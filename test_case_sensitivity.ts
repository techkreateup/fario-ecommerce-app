
import { GoogleSheetsService } from './lib/googleSheets';

// Mock data: Lowercase keys
const mockResponse = {
    status: 'success',
    data: [
        { id: 'p1', name: 'Edustep Core Black', instock: 'TRUE', stockquantity: 124, type: 'lowercase_keys' }
    ]
};

global.fetch = async (url) => {
    return {
        json: async () => mockResponse
    } as any;
};

async function test() {
    console.log('--- Test: Lowercase keys handling ---');
    const products = await GoogleSheetsService.getProducts();
    const p1 = products.find(p => p.id === 'p1');

    if (p1) {
        console.log(`p1: inStock=${p1.inStock}, stockQuantity=${p1.stockQuantity}`);
        if (p1.inStock === true && p1.stockQuantity === 124) {
            console.log('SUCCESS: Handled lowercase keys correctly.');
        } else {
            console.error('FAILED: Incorrect values parsed.');
        }
    } else {
        console.error('FAILED: Product not found.');
    }
}

test();
