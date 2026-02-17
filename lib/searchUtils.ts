
/**
 * Deep search utility to recursively search through an object or array.
 * Returns true if the query string is found in any value.
 *
 * @param data The object or array to search
 * @param query The search query string
 * @returns boolean
 */
export const deepSearch = (data: any, query: string): boolean => {
    if (!data) return false;
    if (!query) return true;

    const lowerQuery = query.toString().toLowerCase().trim();

    // Handle primitives
    if (typeof data === 'string') {
        return data.toLowerCase().includes(lowerQuery);
    }

    if (typeof data === 'number' || typeof data === 'boolean') {
        return String(data).toLowerCase().includes(lowerQuery);
    }

    // Handle arrays
    if (Array.isArray(data)) {
        return data.some(item => deepSearch(item, query));
    }

    // Handle objects
    if (typeof data === 'object') {
        return Object.values(data).some(value => deepSearch(value, query));
    }

    return false;
};
