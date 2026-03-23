/**
 * RUN THIS ONCE IN GOOGLE APPS SCRIPT TO CLEAN UP DUPLICATE ROWS
 * Tools > Script Editor > Paste this > Run cleanupDuplicates()
 */

function cleanupDuplicates() {
    const SPREADSHEET_ID = '1fcLgHkJG3tzaTU8-ArD2BLnG7Rb5zUTSAfG5kdVcnD4';
    const SHEET_NAME = 'FARIO-PRODUCTS';

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
        Logger.log('Sheet not found!');
        return;
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idColIndex = headers.findIndex(h => String(h).toLowerCase().trim() === 'id');

    if (idColIndex === -1) {
        Logger.log('ID column not found!');
        return;
    }

    Logger.log('Total rows before cleanup: ' + (data.length - 1));
    Logger.log('ID column index: ' + idColIndex);

    // Track which IDs we've seen and their preferred row
    const seenIds = new Map();
    const rowsToDelete = [];

    // Scan all rows (skip header)
    for (let i = 1; i < data.length; i++) {
        const rowId = String(data[i][idColIndex] || '').trim().toLowerCase();

        if (!rowId) continue; // Skip empty IDs

        if (seenIds.has(rowId)) {
            // DUPLICATE FOUND
            const existingRowIndex = seenIds.get(rowId);
            const existingRow = data[existingRowIndex];
            const currentRow = data[i];

            // Find stock column (try multiple names)
            let stockValue_existing = 0;
            let stockValue_current = 0;

            for (let col = 0; col < headers.length; col++) {
                const header = String(headers[col]).toLowerCase().replace(/\s/g, '');
                if (['stock', 'stockquantity', 'quantity'].includes(header)) {
                    stockValue_existing = Number(existingRow[col]) || 0;
                    stockValue_current = Number(currentRow[col]) || 0;
                    break;
                }
            }

            Logger.log('DUPLICATE: ' + rowId + ' in rows ' + (existingRowIndex + 1) + ' and ' + (i + 1));
            Logger.log('  Row ' + (existingRowIndex + 1) + ' stock: ' + stockValue_existing);
            Logger.log('  Row ' + (i + 1) + ' stock: ' + stockValue_current);

            // Keep the row with higher stock, delete the other
            if (stockValue_current > stockValue_existing) {
                // Current row is better, mark old one for deletion
                rowsToDelete.push(existingRowIndex + 1); // +1 for 1-based indexing
                seenIds.set(rowId, i); // Update to track current row
                Logger.log('  → Keeping row ' + (i + 1) + ', will delete row ' + (existingRowIndex + 1));
            } else {
                // Existing row is better, mark current for deletion
                rowsToDelete.push(i + 1);
                Logger.log('  → Keeping row ' + (existingRowIndex + 1) + ', will delete row ' + (i + 1));
            }
        } else {
            // First time seeing this ID
            seenIds.set(rowId, i);
        }
    }

    // Delete rows (must do in REVERSE order to avoid index shifting)
    rowsToDelete.sort((a, b) => b - a); // Sort descending

    Logger.log('\nDeleting ' + rowsToDelete.length + ' duplicate rows...');

    for (const rowNum of rowsToDelete) {
        Logger.log('Deleting row ' + rowNum);
        sheet.deleteRow(rowNum);
    }

    Logger.log('\nCLEANUP COMPLETE!');
    Logger.log('Rows deleted: ' + rowsToDelete.length);
    Logger.log('Final row count: ' + (sheet.getLastRow() - 1));
}
