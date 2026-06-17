export interface SearchFilters {
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

export interface SearchParams {
    query?: string;
    filters?: SearchFilters;
    page?: number;
    limit?: number;
}

export interface SearchResult {
    success: boolean;
    error?: string;
    data: any[];
    facets: {
        countries: string[];
        ports: string[];
        hsnCodes: string[];
        exporters: string[];
        importers: string[];
        uqc: string[];
    };
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface UserSessionPayload {
    userId: string;
    email: string;
    role: string;
    isTrial: boolean;
    trialEndsAt: number | null;
}
