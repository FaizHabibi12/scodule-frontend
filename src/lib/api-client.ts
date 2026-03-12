export const API_CONFIG = {
    baseURL: process.env.NEXT_PUBLIC_API_URL || '',
    token: process.env.NEXT_PUBLIC_API_TOKEN || '',
};

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
        const url = `${API_CONFIG.baseURL}${endpoint}`;

        console.log('API Request:', {
            url,
            method: options.method || 'GET',
            hasToken: !!API_CONFIG.token,
            timestamp: new Date().toISOString(),
        });

        const response = await fetch(url, {
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

        let result;
        try {
            result = await response.json();
            console.log('API Response Data:', result);
        } catch (parseError) {
            console.error('Failed to parse JSON response:', parseError);
            return {
                data: null,
                error: 'Server returned invalid JSON response',
            };
        }

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
