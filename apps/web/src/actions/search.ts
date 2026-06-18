'use server';

import { prisma, clickhouse, isClickHouseConnected } from '@tenexim/database';

interface SearchFilters {
    shipmentType?: 'import' | 'export';
    country?: string;
    startDate?: string;
    endDate?: string;
    ports?: string[];
    hsnCodes?: string[];
    uqc?: string[];
    products?: string[];
    exporters?: string[];
    importers?: string[];
}

interface SearchParams {
    query?: string;
    filters?: SearchFilters;
    page?: number;
    limit?: number;
}

/**
 * Executes a high-performance query across analytical columnar or transactional engines,
 * fully resolving bilateral mirror search paths for missing datasets.
 */
export async function getShipments({ query, filters, page = 1, limit = 20 }: SearchParams) {
    const chActive = await isClickHouseConnected();
    const skip = (page - 1) * limit;

    if (chActive) {
        try {
            return await executeClickHouseSearch({ query, filters, page, limit, skip });
        } catch (error) {
            console.error('ClickHouse Execution failed, falling back to PostgreSQL:', error);
        }
    }

    return await executePostgresSearch({ query, filters, page, limit, skip });
}

/**
 * ClickHouse Multi-billion Columnar Query Optimization Path
 */
async function executeClickHouseSearch({ query, filters, page = 1, limit = 20, skip }: SearchParams & { skip: number }) {
    let whereConditions = ['1 = 1'];
    const params: Record<string, any> = {};

    // 1. Base query match (Uses optimized multi-column token matches)
    if (query) {
        whereConditions.push(
            `(productDesc ILIKE {query: String} OR hsCode ILIKE {query: String} OR importerName ILIKE {query: String} OR supplierName ILIKE {query: String})`
        );
        params.query = `%${query}%`;
    }

    // 2. Bilateral Mirroring & Country Logic
    const requestedCountry = filters?.country || 'India';
    const isImport = filters?.shipmentType === 'import';

    if (requestedCountry !== 'India') {
        if (isImport) {
            // Mirrored importing logic: Exporter is foreign, Origin country is target
            whereConditions.push(`originCountry = {country: String}`);
            params.country = requestedCountry;
        } else {
            // Mirrored exporting logic
            whereConditions.push(`foreignPort ILIKE {country: String}`);
            params.country = `%${requestedCountry}%`;
        }
    }

    // 3. Multi-Select Facet Filtering
    if (filters?.exporters && filters.exporters.length > 0) {
        whereConditions.push(`supplierName IN {exporters: Array(String)}`);
        params.exporters = filters.exporters;
    }
    if (filters?.importers && filters.importers.length > 0) {
        whereConditions.push(`importerName IN {importers: Array(String)}`);
        params.importers = filters.importers;
    }
    if (filters?.hsnCodes && filters.hsnCodes.length > 0) {
        whereConditions.push(`hsCode IN {hsnCodes: Array(String)}`);
        params.hsnCodes = filters.hsnCodes;
    }
    if (filters?.ports && filters.ports.length > 0) {
        whereConditions.push(`indianPort IN {ports: Array(String)}`);
        params.ports = filters.ports;
    }

    const whereClause = whereConditions.join(' AND ');

    // Optimized parallel data queries executing over compressed columnar parts
    const [dataRows, countResult, countriesG, portsG, hsCodesG, suppliersG, importersG, unitsG] = await Promise.all([
        clickhouse.query({
            query: `SELECT id, boeDate, hsCode, productDesc, quantity, unit, importerName, supplierName, originCountry, indianPort, totalValueUsd 
                    FROM shipments 
                    WHERE ${whereClause} 
                    ORDER BY boeDate DESC 
                    LIMIT ${limit} OFFSET ${skip}`,
            query_params: params,
            format: 'JSONEachRow'
        }).then(res => res.json() as Promise<any[]>),

        clickhouse.query({
            query: `SELECT count() as total FROM shipments WHERE ${whereClause}`,
            query_params: params,
            format: 'JSONEachRow'
        }).then(res => res.json() as Promise<any[]>),

        clickhouse.query({
            query: `SELECT originCountry, count() as cnt FROM shipments WHERE ${whereClause} GROUP BY originCountry ORDER BY cnt DESC LIMIT 10`,
            query_params: params,
            format: 'JSONEachRow'
        }).then(res => res.json() as Promise<any[]>),

        clickhouse.query({
            query: `SELECT indianPort, count() as cnt FROM shipments WHERE ${whereClause} GROUP BY indianPort ORDER BY cnt DESC LIMIT 10`,
            query_params: params,
            format: 'JSONEachRow'
        }).then(res => res.json() as Promise<any[]>),

        clickhouse.query({
            query: `SELECT hsCode, count() as cnt FROM shipments WHERE ${whereClause} GROUP BY hsCode ORDER BY cnt DESC LIMIT 10`,
            query_params: params,
            format: 'JSONEachRow'
        }).then(res => res.json() as Promise<any[]>),

        clickhouse.query({
            query: `SELECT supplierName, count() as cnt FROM shipments WHERE ${whereClause} GROUP BY supplierName ORDER BY cnt DESC LIMIT 10`,
            query_params: params,
            format: 'JSONEachRow'
        }).then(res => res.json() as Promise<any[]>),

        clickhouse.query({
            query: `SELECT importerName, count() as cnt FROM shipments WHERE ${whereClause} GROUP BY importerName ORDER BY cnt DESC LIMIT 10`,
            query_params: params,
            format: 'JSONEachRow'
        }).then(res => res.json() as Promise<any[]>),

        clickhouse.query({
            query: `SELECT unit, count() as cnt FROM shipments WHERE ${whereClause} GROUP BY unit ORDER BY cnt DESC LIMIT 10`,
            query_params: params,
            format: 'JSONEachRow'
        }).then(res => res.json() as Promise<any[]>)
    ]);

    const total = Number(countResult[0]?.total || 0);

    return {
        success: true,
        data: dataRows.map((row: any) => ({
            ...row,
            boeDate: new Date(row.boeDate) // Transform date string back into native date object
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

/**
 * Standard PostgreSQL/Prisma In-Memory Workload Fallback
 */
async function executePostgresSearch({ query, filters, page = 1, limit = 20, skip }: SearchParams & { skip: number }) {
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

        if (filters?.country && filters.country !== 'India') {
            where.originCountry = { contains: filters.country, mode: 'insensitive' };
        }

        if (filters?.exporters && filters.exporters.length > 0) {
            where.supplierName = { in: filters.exporters };
        }
        if (filters?.importers && filters.importers.length > 0) {
            where.importerName = { in: filters.importers };
        }
        if (filters?.hsnCodes && filters.hsnCodes.length > 0) {
            where.hsCode = { in: filters.hsnCodes };
        }
        if (filters?.ports && filters.ports.length > 0) {
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
            data, // Returned directly (native Date types map perfectly)
            facets: {
                countries: countriesGroup.map((g: any) => g.originCountry),
                ports: portsGroup.map((g: any) => g.indianPort),
                hsnCodes: hsCodesGroup.map((g: any) => g.hsCode),
                exporters: suppliersGroup.map((g: any) => g.supplierName),
                importers: importersGroup.map((g: any) => g.importerName),
                uqc: unitsGroup.map((g: any) => g.unit),
            },
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        console.error('PostgreSQL query execution error:', error);
        return { success: false, error: 'Database pipeline transaction failed' };
    }
}

/**
 * Autocomplete Query Routing Path
 */
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

        products.forEach((p: any) => {
            if (p.productDesc) suggestions.push({ label: p.productDesc, type: 'Product' });
        });

        companies.forEach((c: any) => {
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