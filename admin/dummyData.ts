
export const INITIAL_IPA_LOGS = [
    {
        id: '1',
        user: 'Deepak',
        action: 'Query Product',
        query: 'What is the stock for Midnight Force?',
        response: 'The Midnight Force is currently in stock in sizes 7, 8, and 9.',
        timestamp: new Date().toISOString(),
        status: 'Success'
    },
    {
        id: '2',
        user: 'Admin',
        action: 'Update Catalog',
        query: 'Add new product "Fario Lite"',
        response: 'Product "Fario Lite" has been added to the catalog successfully.',
        timestamp: new Date().toISOString(),
        status: 'Pending'
    }
];
