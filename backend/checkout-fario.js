/**
 * FARIO ALL-IN-ONE BACKEND (v4 - Bouncer Edition)
 */

const SPREADSHEET_ID = '1fcLgHkJG3tzaTU8-ArD2BLnG7Rb5zUTSAfG5kdVcnD4'; // Your Sheet ID

const SHEETS = {
    PRODUCTS: 'FARIO-PRODUCTS',
    ORDERS: 'checkout-fario',
    USERS: 'FARIO-USERS',
    OTP: 'FARIO-OTP',
    REVIEWS: 'FARIO-REVIEWS',
    INQUIRIES: 'FARIO-INQUIRIES'
};

function doGet(e) { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }

function handleRequest(e) {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        let action = 'get';
        let body = {};
        if (e.parameter && e.parameter.action) {
            action = e.parameter.action;
        } else if (e.postData && e.postData.contents) {
            try {
                body = JSON.parse(e.postData.contents);
                if (body.action) action = body.action;
            } catch (err) { }
        }

        const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

        switch (action) {
            case 'getProducts':
            case 'get':
                const products = getSheetData(ss, SHEETS.PRODUCTS);
                return responseJSON({ status: 'success', data: products });
            case 'createOrder':
                const orderId = createOrder(ss, body);
                return responseJSON({ status: 'success', orderId: orderId });
            case 'getOrders':
                const userOrders = getUserOrders(ss, e.parameter.email || body.email);
                return responseJSON({ status: 'success', data: userOrders });
            case 'getAllOrders':
                const allOrders = getAllOrders(ss);
                return responseJSON({ status: 'success', data: allOrders });
            case 'updateOrderStatus':
                updateOrderStatus(ss, body);
                return responseJSON({ status: 'success' });
            case 'getUserProfile':
                const profile = getUserProfile(ss, e.parameter.email || body.email);
                return responseJSON({ status: 'success', data: profile });
            case 'updateProfile':
                updateUserProfile(ss, body);
                return responseJSON({ status: 'success' });
            case 'getReviews':
                const reviews = getProductReviews(ss, e.parameter.productId || body.productId);
                return responseJSON({ status: 'success', data: reviews });
            case 'add': // For Products (Upsert)
                const success = addOrUpdateProduct(ss, body);
                return responseJSON({ status: 'success', action: 'add' });
            case 'submitInquiry':
                submitInquiry(ss, body);
                return responseJSON({ status: 'success' });
            case 'sendOTP':
                return sendOTP(ss, body.email);
            case 'verifyOTP':
                return verifyOTP(ss, body.email, body.otp);
            default:
                return responseJSON({ status: 'error', message: 'Unknown Action: ' + action });
        }
    } catch (err) {
        return responseJSON({ status: 'error', message: 'Server Error: ' + err.toString() });
    } finally {
        lock.releaseLock();
    }
}

// --- PRODUCT MANAGEMENT (UPSERT) ---
function addOrUpdateProduct(ss, data) {
    const sheet = getOrCreateSheet(ss, SHEETS.PRODUCTS, [
        'id', 'name', 'price', 'category', 'image', 'description',
        'inStock', 'rating', 'sizes', 'colors', 'stockQuantity',
        'tagline', 'originalPrice', 'features', 'gender', 'isDeleted'
    ]);

    const rows = sheet.getDataRange().getValues();
    const idIndex = 0; // 'id' column
    let rowIndex = -1;

    // Look for existing product
    if (data.id) {
        for (let i = 1; i < rows.length; i++) {
            if (String(rows[i][idIndex]).toLowerCase() === String(data.id).toLowerCase()) {
                rowIndex = i + 1;
                break;
            }
        }
    }

    // Construct Row Data (Order MUST match headers above)
    const newRow = [
        data.id || 'PROD-' + Date.now(),
        data.name || '',
        data.price || 0,
        data.category || 'Unisex',
        data.image || '',
        data.description || '',
        data.inStock === true || data.stockQuantity > 0,
        data.rating || 5,
        typeof data.sizes === 'string' ? data.sizes : JSON.stringify(data.sizes || []),
        typeof data.colors === 'string' ? data.colors : JSON.stringify(data.colors || []),
        data.stockQuantity || 0,
        data.tagline || '',
        data.originalPrice || '',
        typeof data.features === 'string' ? data.features : JSON.stringify(data.features || []),
        data.gender || 'Unisex',
        data.isDeleted === "TRUE" || data.isDeleted === true // Handle DELETE
    ];

    if (rowIndex > -1) {
        // UPDATE Existing
        sheet.getRange(rowIndex, 1, 1, newRow.length).setValues([newRow]);
    } else {
        // CREATE New
        sheet.appendRow(newRow);
    }
    SpreadsheetApp.flush(); // Force write to disk
    return true;
}

// --- INQUIRY MANAGEMENT ---
function submitInquiry(ss, data) {
    const headers = ['id', 'name', 'email', 'message', 'date', 'status'];
    const sheet = getOrCreateSheet(ss, SHEETS.INQUIRIES, headers);
    sheet.appendRow([
        'INQ-' + Date.now(),
        data.name || 'Anonymous',
        data.email || '',
        data.message || '',
        new Date().toISOString(),
        'New'
    ]);
    SpreadsheetApp.flush();
}

function createOrder(ss, orderData) {
    // 🛑 BOUNCER CHECK
    if (!orderData || !orderData.items || orderData.items.length === 0) {
        throw new Error("Invalid Order: No items found.");
    }
    if (orderData.total <= 0) {
        throw new Error("Invalid Order: Total is 0.");
    }

    const headers = ['id', 'userEmail', 'amount', 'status', 'itemsJson', 'addressJson', 'date', 'paymentMethod'];
    const sheet = getOrCreateSheet(ss, SHEETS.ORDERS, headers);
    const id = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    sheet.appendRow([
        id,
        orderData.userEmail || 'guest',
        orderData.total || 0,
        'Processing',
        JSON.stringify(orderData.items || []),
        JSON.stringify(orderData.shippingAddress || {}),
        new Date().toISOString(),
        orderData.paymentMethod || 'COD'
    ]);
    SpreadsheetApp.flush();
    return id;
}

function getUserOrders(ss, email) {
    if (!email) return [];
    const rows = getSheetData(ss, SHEETS.ORDERS);
    return rows.filter(r => r.userEmail === email);
}

function getAllOrders(ss) {
    const rows = getSheetData(ss, SHEETS.ORDERS);
    return rows.reverse(); // Newest first
}

function updateOrderStatus(ss, data) {
    const sheet = ss.getSheetByName(SHEETS.ORDERS);
    const rows = sheet.getDataRange().getValues();
    // Headers: id, userEmail, amount, status...
    // status is index 3 (0-based)

    for (let i = 1; i < rows.length; i++) {
        if (rows[i][0] === data.orderId) {
            // Update status (Column 4 -> Index 3 + 1 = 4)
            sheet.getRange(i + 1, 4).setValue(data.status);
            SpreadsheetApp.flush();
            break;
        }
    }
}

function getUserProfile(ss, email) {
    const rows = getSheetData(ss, SHEETS.USERS);
    const user = rows.find(r => r.email === email);
    if (user) {
        try { user.addresses = user.addressesJson ? JSON.parse(user.addressesJson) : []; } catch (e) { user.addresses = []; }
        return user;
    }
    return null;
}

function updateUserProfile(ss, data) {
    const headers = ['email', 'name', 'phone', 'addressesJson', 'points'];
    const sheet = getOrCreateSheet(ss, SHEETS.USERS, headers);
    const allData = sheet.getDataRange().getValues();
    let rowIndex = -1;
    for (let i = 1; i < allData.length; i++) {
        if (allData[i][0] === data.email) {
            rowIndex = i + 1;
            break;
        }
    }
    const rowData = [
        data.email,
        data.name || '',
        data.phone || '',
        JSON.stringify(data.addresses || []),
        data.points || 0
    ];
    if (rowIndex > -1) {
        sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    } else {
        sheet.appendRow(rowData);
    }
    SpreadsheetApp.flush();
}

function getProductReviews(ss, productId) {
    const rows = getSheetData(ss, SHEETS.REVIEWS);
    return rows.filter(r => r.productId === productId);
}

function addReview(ss, data) {
    const headers = ['reviewId', 'productId', 'userEmail', 'rating', 'comment', 'date'];
    const sheet = getOrCreateSheet(ss, SHEETS.REVIEWS, headers);
    sheet.appendRow([
        'REV-' + Date.now(),
        data.productId,
        data.userEmail,
        data.rating,
        data.comment,
        new Date().toISOString()
    ]);
}

function sendOTP(ss, email) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const headers = ['email', 'otp', 'expiresAt'];
    const sheet = getOrCreateSheet(ss, SHEETS.OTP, headers);
    const expiresAt = new Date().getTime() + (5 * 60 * 1000);
    sheet.appendRow([email, otp, expiresAt]);
    try {
        MailApp.sendEmail({
            to: email,
            subject: "Fario Login Code: " + otp,
            htmlBody: `<h2>Your Fario Verification Code</h2><h1>${otp}</h1><p>This code expires in 5 minutes.</p>`
        });
        return responseJSON({ status: 'success' });
    } catch (e) {
        return responseJSON({ status: 'error', message: 'Failed to send email: ' + e.toString() });
    }
}

function verifyOTP(ss, email, otp) {
    const headers = ['email', 'otp', 'expiresAt'];
    const sheet = getOrCreateSheet(ss, SHEETS.OTP, headers);
    const data = sheet.getDataRange().getValues();
    const now = new Date().getTime();
    for (let i = data.length - 1; i > 0; i--) {
        const row = data[i];
        if (row[0] === email && String(row[1]).trim() === String(otp).trim()) {
            if (row[2] > now) return responseJSON({ status: 'success' });
            else return responseJSON({ status: 'error', message: 'OTP has expired' });
        }
    }
    return responseJSON({ status: 'error', message: 'Invalid OTP' });
}

function getOrCreateSheet(ss, name, headers) {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
        sheet = ss.insertSheet(name);
        if (headers) sheet.appendRow(headers);
    }
    return sheet;
}

function getSheetData(ss, sheetName) {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return [];
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) return [];
    const headers = data[0];
    const results = [];
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const obj = {};
        headers.forEach((h, idx) => {
            const key = String(h).trim();
            obj[key] = row[idx];
        });
        results.push(obj);
    }
    return results;
}

function responseJSON(data) {
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
