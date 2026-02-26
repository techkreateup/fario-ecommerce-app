function fixStockColumns() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('FARIO-PRODUCTS');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];

    // 1. Identify all "Stock" related columns
    const stockIndices = [];
    let mainStockIndex = -1;
    const targetHeader = 'stockQuantity';

    headers.forEach((h, i) => {
        const clean = String(h).toLowerCase().replace(/\s/g, '');
        if (['stockquantity', 'stock', 'quantity'].includes(clean)) {
            stockIndices.push(i);
            if (String(h) === targetHeader) mainStockIndex = i;
        }
    });

    if (stockIndices.length < 2) {
        Logger.log("No duplicate columns found. All good!");
        return;
    }

    // 2. Ensuring the Main Column Exists
    if (mainStockIndex === -1) {
        // Determine the first valid stock column to be the survivor
        mainStockIndex = stockIndices[0];
        sheet.getRange(1, mainStockIndex + 1).setValue(targetHeader); // Rename it
        Logger.log("Renamed column " + (mainStockIndex + 1) + " to " + targetHeader);
    }

    // 3. Consolidate Values
    // For each row, find the Best Stock value from ALL columns and put it in the Main Column
    for (let r = 1; r < data.length; r++) {
        const row = data[r];
        let bestVal = 0;

        // Find first non-zero/valid value
        for (const idx of stockIndices) {
            if (row[idx] > 0) {
                bestVal = row[idx];
                break; // Found a positive stock, use it
            }
        }

        // Update main column in memory
        data[r][mainStockIndex] = bestVal;

        // Clear other columns in memory
        stockIndices.forEach(idx => {
            if (idx !== mainStockIndex) {
                data[r][idx] = '';
            }
        });
    }

    // 4. Write Data Back (Values Only)
    sheet.getRange(1, 1, data.length, data[0].length).setValues(data);

    // 5. Delete Empty Columns (The ones we cleared)
    // We delete from right to left to avoid index shifting problems
    const indicesToDelete = stockIndices.filter(i => i !== mainStockIndex).sort((a, b) => b - a);

    indicesToDelete.forEach(idx => {
        sheet.deleteColumn(idx + 1);
        Logger.log("Deleted duplicate column: " + (idx + 1));
    });

    Logger.log("✅ Fixed! Consolidated " + indicesToDelete.length + " columns into 'stockQuantity'.");
}
