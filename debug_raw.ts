
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwr6_CdnWgCyRvouZ7cdprWa1nsDfRzm_6pUW2HlUlZt2yPuzYbK-fGomWT_kx6-CmcZQ/exec';

async function verify() {
    console.log('Fetching raw data...');
    try {
        const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=get`);
        const json = await response.json();

        console.log('Status:', json.status);
        if (json.data) {
            const p1Rows = json.data.filter((p: any) => p.id === 'p1');
            console.log(`Found ${p1Rows.length} rows for p1.`);
            p1Rows.forEach((row: any, i: number) => {
                console.log(`[${i}] inStock (raw): "${row.inStock}" (type: ${typeof row.inStock}), stockQty: "${row.stockQuantity}"`);
            });
        }
    } catch (e) {
        console.error(e);
    }
}

verify();
