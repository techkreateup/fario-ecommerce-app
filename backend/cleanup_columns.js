/**
 * RUN THIS IN GOOGLE APPS SCRIPT TO FIX DUPLICATE COLUMNS
 * This will remove all the empty duplicate stock columns
 */

function cleanupDuplicateColumns() {
    const SPREADSHEET_ID = '1fcLgHkJG3tzaTU8-ArD2BLnG7Rb5zUTSAfG5kdVcnD4';
    const SHEET_NAME = 'FARIO-PRODUCTS';

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    const data = sheet.getDataRange().getValues();
    const headers = data[0];

    Logger.log('Current headers: ' + headers.join(', '));
    Logger.log('Total columns: ' + headers.length);

    // Find which stock-related columns have data
    const stockColumns = [];
    const stockLikeNames = ['stock', 'quantity', 'stockquantity'];

    for (let col = 0; col < headers.length; col++) {
        const header = String(headers[col]).toLowerCase().replace(/\s/g, '');

        if (stockLikeNames.includes(header)) {
            // Check if this column has any non-empty data
            let hasData = false;
            for (let row = 1; row < data.length; row++) {
                const val = data[row][col];
                if (val !== '' && val !== null && val !== undefined) {
                    hasData = true;
                    break;
                }
            }

            stockColumns.push({
                index: col,
                name: headers[col],
                cleanName: header,
                hasData: hasData
            });
        }
    }

    Logger.log('\nStock-related columns found:');
    stockColumns.forEach(c => {
        Logger.log('  Column ' + (c.index + 1) + ': "' + c.name + '" - Has data: ' + c.hasData);
    });

    // Delete columns in REVERSE order (right to left) to avoid index shifting
    const columnsToDelete = stockColumns
        .filter(c => !c.hasData)
        .sort((a, b) => b.index - a.index);

    Logger.log('\nDeleting ' + columnsToDelete.length + ' empty columns...');

    for (const col of columnsToDelete) {
        Logger.log('Deleting column ' + (col.index + 1) + ': "' + col.name + '"');
        sheet.deleteColumn(col.index + 1); // +1 for 1-based indexing
    }

    // Rename the remaining stock column to canonical name "stockQuantity"
    const remainingStockCol = stockColumns.find(c => c.hasData);
    if (remainingStockCol) {
        const colIndex = remainingStockCol.index - columnsToDelete.filter(c => c.index < remainingStockCol.index).length;
        Logger.log('\nRenaming column ' + (colIndex + 1) + ' from "' + remainingStockCol.name + '" to "stockQuantity"');
        sheet.getRange(1, colIndex + 1).setValue('stockQuantity');
    }

    Logger.log('\nCLEANUP COMPLETE!');
    Logger.log('Final column count: ' + sheet.getLastColumn());
}
