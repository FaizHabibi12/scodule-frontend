export const API_CONFIG = {
    baseURL: process.env.NEXT_PUBLIC_API_URL || '',
    token: process.env.NEXT_PUBLIC_API_TOKEN || '',
};

function buildUrl(endpoint: string): string {
    const base = API_CONFIG.baseURL.replace(/\/$/, '');
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${base}${path}`;
}

function toSingularFirstSegment(endpoint: string): string {
    const parts = endpoint.split('?');
    const pathOnly = parts[0];
    const query = parts[1] ? `?${parts[1]}` : '';

    const segments = pathOnly.split('/');
    const firstIndex = segments.findIndex((segment) => segment.length > 0);

    if (firstIndex === -1) {
        return endpoint;
    }

    const firstSegment = segments[firstIndex];
    if (firstSegment.endsWith('s') && firstSegment.length > 1) {
        segments[firstIndex] = firstSegment.slice(0, -1);
        return `${segments.join('/')}${query}`;
    }

    return endpoint;
}

async function parseJsonResponse(response: Response): Promise<any> {
    try {
        return await response.json();
    } catch {
        return null;
    }
}

export function validateAPIConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!API_CONFIG.baseURL) {
        errors.push('NEXT_PUBLIC_API_URL is not set in environment variables');
    }

    if (!API_CONFIG.token) {
        errors.push('NEXT_PUBLIC_API_TOKEN is not set in environment variables');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

export async function apiRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
    const configValidation = validateAPIConfig();
    if (!configValidation.isValid) {
        console.error('API Configuration Error:', configValidation.errors);
        return {
            data: null,
            error: `API Configuration Error: ${configValidation.errors.join(', ')}`,
        };
    }

    try {
        const url = buildUrl(endpoint);

        console.log('API Request:', {
            url,
            method: options.method || 'GET',
            hasToken: !!API_CONFIG.token,
            timestamp: new Date().toISOString(),
        });

        let response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.token}`,
                'Accept': 'application/json',
                ...options.headers,
            },
        });

        console.log('API Response Status:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            headers: {
                contentType: response.headers.get('content-type'),
            },
        });

        let result = await parseJsonResponse(response);

        const isRouteNotFound =
            response.status === 404 &&
            typeof result?.message === 'string' &&
            result.message.toLowerCase().includes('route') &&
            result.message.toLowerCase().includes('could not be found');

        if (isRouteNotFound) {
            const fallbackEndpoint = toSingularFirstSegment(endpoint);

            if (fallbackEndpoint !== endpoint) {
                const fallbackUrl = buildUrl(fallbackEndpoint);

                console.warn('Retrying API request with singular endpoint:', {
                    originalEndpoint: endpoint,
                    fallbackEndpoint,
                    fallbackUrl,
                });

                response = await fetch(fallbackUrl, {
                    ...options,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${API_CONFIG.token}`,
                        'Accept': 'application/json',
                        ...options.headers,
                    },
                });

                result = await parseJsonResponse(response);
            }
        }

        if (result === null) {
            return {
                data: null,
                error: 'Server returned invalid JSON response',
            };
        }

        console.log('API Response Data:', result);

        if (!response.ok) {
            const errorMessage = result.error || result.message || `HTTP ${response.status}: ${response.statusText}`;
            console.error('API Error Response:', errorMessage);
            return {
                data: null,
                error: errorMessage,
            };
        }

        return { data: result, error: null };
    } catch (error: any) {
        let errorMessage = 'Tidak dapat terhubung ke server';

        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage = 'Tidak dapat terhubung ke server. Pastikan Laravel backend berjalan di ' + API_CONFIG.baseURL;
        } else if (error.message) {
            errorMessage = error.message;
        }

        return {
            data: null,
            error: errorMessage,
        };
    }
}
