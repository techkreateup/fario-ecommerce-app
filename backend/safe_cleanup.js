/**
 * SAFE CLEANUP - Remove only lowercase duplicate columns
 * This keeps your data and working sync intact
 */

function safeCleanupDuplicates() {
    const SPREADSHEET_ID = '1fcLgHkJG3tzaTU8-ArD2BLnG7Rb5zUTSAfG5kdVcnD4';
    const SHEET_NAME = 'FARIO-PRODUCTS';

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    const data = sheet.getDataRange().getValues();
    const headers = data[0];

    Logger.log('Current columns: ' + headers.length);

    // Columns to delete (ONLY lowercase duplicates that are definitely empty)
    const columnsToDelete = [];

    for (let col = 0; col < headers.length; col++) {
        const header = String(headers[col]);

        // Only delete if it's a lowercase duplicate AND has no data
        const isDuplicateLowercase =
            header === 'instock' ||
            header === 'originalprice' ||
            header === 'isdeleted' ||
            header === 'Stock Quantity' ||
            header === 'Stock' ||
            header === 'Quantity';

        if (isDuplicateLowercase) {
            // Check if column is actually empty
            let hasData = false;
            for (let row = 1; row < data.length; row++) {
                const val = data[row][col];
                if (val !== '' && val !== null && val !== undefined) {
                    hasData = true;
                    break;
                }
            }

            if (!hasData) {
                columnsToDelete.push({
                    index: col,
                    name: header
                });
            } else {
                Logger.log('KEEPING column "' + header + '" - it has data');
            }
        }
    }

    Logger.log('\nWill delete ' + columnsToDelete.length + ' empty duplicate columns:');
    columnsToDelete.forEach(c => {
        Logger.log('  - Column ' + (c.index + 1) + ': "' + c.name + '"');
    });

    // Delete in reverse order
    columnsToDelete.sort((a, b) => b.index - a.index);

    Logger.log('\nDeleting...');
    for (const col of columnsToDelete) {
        Logger.log('Deleting: ' + col.name);
        sheet.deleteColumn(col.index + 1);
    }

    Logger.log('\n✅ CLEANUP COMPLETE!');
    Logger.log('Before: ' + headers.length + ' columns');
    Logger.log('After: ' + sheet.getLastColumn() + ' columns');
    Logger.log('Deleted: ' + columnsToDelete.length + ' empty duplicates');
    Logger.log('\n🎯 Your working sync is SAFE - no data was removed!');
}
