/**
 * FORCEFULLY DELETE DUPLICATE STOCK COLUMNS
 * This will keep ONLY the "stockQuantity" column and delete all others
 */

function forceDuplicateColumnDeletion() {
    const SPREADSHEET_ID = '1fcLgHkJG3tzaTU8-ArD2BLnG7Rb5zUTSAfG5kdVcnD4';
    const SHEET_NAME = 'FARIO-PRODUCTS';

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    const data = sheet.getDataRange().getValues();
    const headers = data[0];

    Logger.log('Before cleanup - Total columns: ' + headers.length);

    // Find ALL stock-related column indices
    const columnsToDelete = [];
    const stockLikeNames = ['stock', 'quantity', 'stockquantity'];

    for (let col = 0; col < headers.length; col++) {
        const header = String(headers[col]);
        const cleanHeader = header.toLowerCase().replace(/\s/g, '');

        // Keep ONLY "stockQuantity" (exact match), delete everything else
        if (stockLikeNames.includes(cleanHeader) && header !== 'stockQuantity') {
            columnsToDelete.push({
                index: col,
                name: header
            });
        }
    }

    Logger.log('Found stockQuantity at column: ' + (headers.indexOf('stockQuantity') + 1));
    Logger.log('Will delete ' + columnsToDelete.length + ' duplicate columns:');
    columnsToDelete.forEach(c => {
        Logger.log('  - Column ' + (c.index + 1) + ': "' + c.name + '"');
    });

    // Sort by index DESCENDING (delete from right to left to avoid index shifting)
    columnsToDelete.sort((a, b) => b.index - a.index);

    Logger.log('\nDeleting columns...');
    for (const col of columnsToDelete) {
        Logger.log('Deleting column ' + (col.index + 1) + ': "' + col.name + '"');
        sheet.deleteColumn(col.index + 1); // 1-based indexing
    }

    Logger.log('\nCLEANUP COMPLETE!');
    Logger.log('After cleanup - Total columns: ' + sheet.getLastColumn());
    Logger.log('\nREMAINING HEADERS:');
    const newHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    Logger.log(newHeaders.join(', '));
}
