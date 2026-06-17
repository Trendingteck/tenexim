'use server';

import { prisma, clickhouse, isClickHouseConnected } from '@tenexim/database';
import { SearchParams, SearchResult } from '@tenexim/types';

/**
 * High-speed macro trade stats.
 */
export async function getCachedMacroStats() {
    try {
        const totalValue = await prisma.shipment.aggregate({
            _sum: { totalValueUsd: true }
        });
        return {
            success: true,
            totalValueUsd: totalValue._sum.totalValueUsd || 0,
            updatedAt: new Date().toISOString()
        };
    } catch (error) {
        return { success: false, totalValueUsd: 0 };
    }
}

// Strict internal execution typing for arithmetic safety
interface ExecuteSearchArgs {
    query?: string;
    filters?: any;
    page: number;
    limit: number;
    skip: number;
}

export async function getShipments({ query, filters, page = 1, limit = 20 }: SearchParams): Promise<SearchResult> {
    const chActive = await isClickHouseConnected();
    const skip = (page - 1) * limit;

    const executionArgs: ExecuteSearchArgs = {
        query,
        filters,
        page,
        limit,
        skip
    };

    if (chActive) {
        try {
            return await executeClickHouseSearch(executionArgs);
        } catch (error) {
            console.error('ClickHouse analytical cluster error, engaging transactional PostgreSQL failover:', error);
        }
    }
    return await executePostgresSearch(executionArgs);
}

async function executeClickHouseSearch({ query, filters, page, limit, skip }: ExecuteSearchArgs): Promise<SearchResult> {
    let whereConditions = ['1 = 1'];
    const params: Record<string, any> = {};

    if (query) {
        whereConditions.push(
            `(productDesc ILIKE {query: String} OR hsCode ILIKE {query: String} OR importerName ILIKE {query: String} OR supplierName ILIKE {query: String})`
        );
        params.query = `%${query}%`;
    }

    const requestedCountry = filters?.country || 'India';
    const isImport = filters?.shipmentType === 'import';

    if (requestedCountry !== 'India') {
        if (isImport) {
            whereConditions.push(`originCountry = {country: String}`);
            params.country = requestedCountry;
        } else {
            whereConditions.push(`foreignPort ILIKE {country: String}`);
            params.country = `%${requestedCountry}%`;
        }
    }

    if (filters?.exporters?.length) {
        whereConditions.push(`supplierName IN {exporters: Array(String)}`);
        params.exporters = filters.exporters;
    }
    if (filters?.importers?.length) {
        whereConditions.push(`importerName IN {importers: Array(String)}`);
        params.importers = filters.importers;
    }
    if (filters?.hsnCodes?.length) {
        whereConditions.push(`hsCode IN {hsnCodes: Array(String)}`);
        params.hsnCodes = filters.hsnCodes;
    }
    if (filters?.ports?.length) {
        whereConditions.push(`indianPort IN {ports: Array(String)}`);
        params.ports = filters.ports;
    }

    const whereClause = whereConditions.join(' AND ');

    // Parallel promise dispatch for optimized ClickHouse query performance with strict type-casting
    const [dataRows, countResult, countriesG, portsG, hsCodesG, suppliersG, importersG, unitsG] = await Promise.all([
        clickhouse.query({
            query: `SELECT id, boeDate, hsCode, productDesc, quantity, unit, importerName, supplierName, originCountry, indianPort, totalValueUsd 
                    FROM shipments 
                    WHERE ${whereClause} 
                    ORDER BY boeDate DESC 
                    LIMIT ${limit} OFFSET ${skip}`,
            query_params: params,
            format: 'JSONEachRow'
        }).then((res: any) => res.json() as Promise<any[]>),

        clickhouse.query({
            query: `SELECT count() as total FROM shipments WHERE ${whereClause}`,
            query_params: params,
            format: 'JSONEachRow'
        }).then((res: any) => res.json() as Promise<any[]>),

        clickhouse.query({
            query: `SELECT originCountry, count() as cnt FROM shipments WHERE ${whereClause} GROUP BY originCountry ORDER BY cnt DESC LIMIT 10`,
            query_params: params,
            format: 'JSONEachRow'
        }).then((res: any) => res.json() as Promise<any[]>),

        clickhouse.query({
            query: `SELECT indianPort, count() as cnt FROM shipments WHERE ${whereClause} GROUP BY indianPort ORDER BY cnt DESC LIMIT 10`,
            query_params: params,
            format: 'JSONEachRow'
        }).then((res: any) => res.json() as Promise<any[]>),

        clickhouse.query({
            query: `SELECT hsCode, count() as cnt FROM shipments WHERE ${whereClause} GROUP BY hsCode ORDER BY cnt DESC LIMIT 10`,
            query_params: params,
            format: 'JSONEachRow'
        }).then((res: any) => res.json() as Promise<any[]>),

        clickhouse.query({
            query: `SELECT supplierName, count() as cnt FROM shipments WHERE ${whereClause} GROUP BY supplierName ORDER BY cnt DESC LIMIT 10`,
            query_params: params,
            format: 'JSONEachRow'
        }).then((res: any) => res.json() as Promise<any[]>),

        clickhouse.query({
            query: `SELECT importerName, count() as cnt FROM shipments WHERE ${whereClause} GROUP BY importerName ORDER BY cnt DESC LIMIT 10`,
            query_params: params,
            format: 'JSONEachRow'
        }).then((res: any) => res.json() as Promise<any[]>),

        clickhouse.query({
            query: `SELECT unit, count() as cnt FROM shipments WHERE ${whereClause} GROUP BY unit ORDER BY cnt DESC LIMIT 10`,
            query_params: params,
            format: 'JSONEachRow'
        }).then((res: any) => res.json() as Promise<any[]>)
    ]);

    const total = Number(countResult[0]?.total || 0);

    return {
        success: true,
        data: dataRows.map((row: any) => ({
            ...row,
            boeDate: new Date(row.boeDate)
        })),
        facets: {
            countries: countriesG.map((g: any) => g.originCountry),
            ports: portsG.map((g: any) => g.indianPort),
            hsnCodes: hsCodesG.map((g: any) => g.hsCode),
            exporters: suppliersG.map((g: any) => g.supplierName),
            importers: importersG.map((g: any) => g.importerName),
            uqc: unitsG.map((g: any) => g.unit),
        },
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

async function executePostgresSearch({ query, filters, page, limit, skip }: ExecuteSearchArgs): Promise<SearchResult> {
    try {
        const where: any = {};

        if (query) {
            where.OR = [
                { productDesc: { contains: query, mode: 'insensitive' } },
                { hsCode: { contains: query, mode: 'insensitive' } },
                { importerName: { contains: query, mode: 'insensitive' } },
                { supplierName: { contains: query, mode: 'insensitive' } },
            ];
        }

        const requestedCountry = filters?.country || 'India';
        const isImport = filters?.shipmentType === 'import';

        if (requestedCountry !== 'India') {
            if (isImport) {
                where.originCountry = { contains: requestedCountry, mode: 'insensitive' };
            } else {
                where.foreignPort = { contains: requestedCountry, mode: 'insensitive' };
            }
        }

        if (filters?.exporters?.length) {
            where.supplierName = { in: filters.exporters };
        }
        if (filters?.importers?.length) {
            where.importerName = { in: filters.importers };
        }
        if (filters?.hsnCodes?.length) {
            where.hsCode = { in: filters.hsnCodes };
        }
        if (filters?.ports?.length) {
            where.indianPort = { in: filters.ports };
        }

        const [
            total,
            data,
            countriesGroup,
            portsGroup,
            hsCodesGroup,
            suppliersGroup,
            importersGroup,
            unitsGroup
        ] = await Promise.all([
            prisma.shipment.count({ where }),
            prisma.shipment.findMany({
                where,
                skip,
                take: limit,
                orderBy: { boeDate: 'desc' },
                select: {
                    id: true,
                    boeDate: true,
                    hsCode: true,
                    productDesc: true,
                    quantity: true,
                    unit: true,
                    importerName: true,
                    supplierName: true,
                    originCountry: true,
                    indianPort: true,
                    totalValueUsd: true,
                }
            }),
            prisma.shipment.groupBy({
                by: ['originCountry'],
                where,
                _count: { originCountry: true },
                orderBy: { _count: { originCountry: 'desc' } },
                take: 10
            }),
            prisma.shipment.groupBy({
                by: ['indianPort'],
                where,
                _count: { indianPort: true },
                orderBy: { _count: { indianPort: 'desc' } },
                take: 10
            }),
            prisma.shipment.groupBy({
                by: ['hsCode'],
                where,
                _count: { hsCode: true },
                orderBy: { _count: { hsCode: 'desc' } },
                take: 10
            }),
            prisma.shipment.groupBy({
                by: ['supplierName'],
                where,
                _count: { supplierName: true },
                orderBy: { _count: { supplierName: 'desc' } },
                take: 10
            }),
            prisma.shipment.groupBy({
                by: ['importerName'],
                where,
                _count: { importerName: true },
                orderBy: { _count: { importerName: 'desc' } },
                take: 10
            }),
            prisma.shipment.groupBy({
                by: ['unit'],
                where,
                _count: { unit: true },
                orderBy: { _count: { unit: 'desc' } },
                take: 10
            })
        ]);

        return {
            success: true,
            data: data.map(item => ({
                ...item,
                boeDate: new Date(item.boeDate)
            })),
            facets: {
                countries: countriesGroup.map(g => g.originCountry),
                ports: portsGroup.map(g => g.indianPort),
                hsnCodes: hsCodesGroup.map(g => g.hsCode),
                exporters: suppliersGroup.map(g => g.supplierName),
                importers: importersGroup.map(g => g.importerName),
                uqc: unitsGroup.map(g => g.unit),
            },
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        console.error('PostgreSQL query transaction failed:', error);
        
        // Return a completely populated fallback structure to satisfy TypeScript interface
        return { 
            success: false, 
            error: 'Database transaction failed.',
            data: [],
            facets: { countries: [], ports: [], hsnCodes: [], exporters: [], importers: [], uqc: [] },
            meta: { total: 0, page, limit, totalPages: 0 }
        };
    }
}

export async function getAutocompleteSuggestions(query: string) {
    if (!query || query.length < 2) return [];

    try {
        const [products, companies] = await Promise.all([
            prisma.shipment.findMany({
                where: { productDesc: { contains: query, mode: 'insensitive' } },
                select: { productDesc: true },
                distinct: ['productDesc'],
                take: 6
            }),
            prisma.shipment.findMany({
                where: {
                    OR: [
                        { supplierName: { contains: query, mode: 'insensitive' } },
                        { importerName: { contains: query, mode: 'insensitive' } }
                    ]
                },
                select: { supplierName: true, importerName: true },
                take: 6
            })
        ]);

        const suggestions: { label: string, type: string }[] = [];

        products.forEach(p => {
            if (p.productDesc) suggestions.push({ label: p.productDesc, type: 'Product' });
        });

        companies.forEach(c => {
            if (c.supplierName && c.supplierName.toLowerCase().includes(query.toLowerCase())) {
                suggestions.push({ label: c.supplierName, type: 'Company' });
            }
            if (c.importerName && c.importerName.toLowerCase().includes(query.toLowerCase())) {
                suggestions.push({ label: c.importerName, type: 'Company' });
            }
        });

        return Array.from(new Map(suggestions.map(s => [s.label, s])).values()).slice(0, 8);
    } catch (error) {
        console.error('Autocomplete Error:', error);
        return [];
    }
}