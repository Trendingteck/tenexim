'use server';

import { PrismaClient } from '@tenexim/database';

// Use a global prisma instance to avoid "too many connections" in dev
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

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

export async function getShipments({ query, filters, page = 1, limit = 20 }: SearchParams) {
    try {
        const where: any = {};

        // 1. Text Search (Global Query)
        if (query) {
            where.OR = [
                { productDesc: { contains: query, mode: 'insensitive' } },
                { hsCode: { contains: query, mode: 'insensitive' } },
                { importerName: { contains: query, mode: 'insensitive' } },
                { supplierName: { contains: query, mode: 'insensitive' } },
            ];
        }

        // 2. Smart Mirror Logic & Country Filter
        if (filters?.country && filters.country !== 'India') {
            where.originCountry = { contains: filters.country, mode: 'insensitive' };
        }

        // 3. Date Range
        if (filters?.startDate && filters?.endDate) {
            where.boeDate = {
                gte: new Date(filters.startDate),
                lte: new Date(filters.endDate),
            };
        }

        // 4. Other Specific Filters
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
        if (filters?.uqc && filters.uqc.length > 0) {
            where.unit = { in: filters.uqc };
        }

        // Calculate Pagination
        const skip = (page - 1) * limit;

        // Execute main data query and distinct aggregation queries in parallel
        // Optimization: Use Promise.all to fetch all data points concurrently
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
                // Select only needed fields for the result grid to reduce payload
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
            // Facets (Top 10 by count for speed)
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
            data,
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
        console.error('Search Error:', error);
        return { success: false, error: 'Failed to fetch shipments' };
    }
}

export async function getAutocompleteSuggestions(query: string) {
    if (!query || query.length < 2) return [];

    try {
        // Parallel fetching for faster response
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

        // Unique and limited suggestions
        const uniqueSuggestions = Array.from(new Map(suggestions.map(s => [s.label, s])).values()).slice(0, 8);

        return uniqueSuggestions;
    } catch (error) {
        console.error('Autocomplete Error:', error);
        return [];
    }
}
