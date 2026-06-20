'use server';

import { clickhouse, isClickHouseConnected } from '@tenexim/database';

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
 * Executes a high-performance query strictly over the columnar ClickHouse analytical engine.
 */
export async function getShipments({ query, filters, page = 1, limit = 20 }: SearchParams) {
    const chActive = await isClickHouseConnected();
    const skip = (page - 1) * limit;

    if (chActive) {
        try {
            return await executeClickHouseSearch({ query, filters, page, limit, skip });
        } catch (error) {
            console.error('ClickHouse Query Execution failed:', error);
            return {
                success: false,
                error: 'ClickHouse query failed to execute.',
                data: [],
                facets: { countries: [], ports: [], hsnCodes: [], exporters: [], importers: [], uqc: [] },
                meta: { total: 0, page, limit, totalPages: 0 }
            };
        }
    }

    return {
        success: false,
        error: 'Analytical Database (ClickHouse) is currently offline.',
        data: [],
        facets: { countries: [], ports: [], hsnCodes: [], exporters: [], importers: [], uqc: [] },
        meta: { total: 0, page, limit, totalPages: 0 }
    };
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

    if (requestedCountry !== 'India') {
        whereConditions.push("originCountry = {country: String}");
        params.country = requestedCountry;
    }

    // 3. Facet filtering
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

/**
 * Autocomplete Query Routing Path natively executing over ClickHouse Columnar Indices
 */
export async function getAutocompleteSuggestions(query: string) {
    if (!query || query.length < 2) return [];

    const chActive = await isClickHouseConnected();
    if (!chActive) return [];

    try {
        const [products, companies] = await Promise.all([
            clickhouse.query({
                query: `SELECT DISTINCT productDesc FROM shipments WHERE productDesc ILIKE {query: String} LIMIT 6`,
                query_params: { query: `%${query}%` },
                format: 'JSONEachRow'
            }).then(res => res.json() as Promise<any[]>),
            
            clickhouse.query({
                query: `
                    SELECT DISTINCT supplierName as label, 'EXPORTER' as type FROM shipments WHERE supplierName ILIKE {query: String} LIMIT 6
                    UNION ALL
                    SELECT DISTINCT importerName as label, 'IMPORTER' as type FROM shipments WHERE importerName ILIKE {query: String} LIMIT 6
                `,
                query_params: { query: `%${query}%` },
                format: 'JSONEachRow'
            }).then(res => res.json() as Promise<any[]>)
        ]);

        const suggestions: { label: string; type: string }[] = [];

        products.forEach((p: any) => {
            if (p.productDesc) suggestions.push({ label: p.productDesc, type: 'Product' });
        });

        companies.forEach((c: any) => {
            if (c.label) {
                suggestions.push({ label: c.label, type: c.type === 'EXPORTER' ? 'Exporter' : 'Importer' });
            }
        });

        return Array.from(new Map(suggestions.map(s => [s.label, s])).values()).slice(0, 8);
    } catch (error) {
        console.error('Autocomplete Error:', error);
        return [];
    }
}