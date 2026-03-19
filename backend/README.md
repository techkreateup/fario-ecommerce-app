# Fario Backend (Google Apps Script)

This directory contains the server-side logic for Fario, which runs on Google Apps Script (GAS) and uses Google Sheets as a database.

## 📂 File Structure

- **`appsscript.js`**: The main backend logic. Handles `doGe` and `doPost` requests from the React app.
- **`cleanup_*.js`**: Utility scripts to maintain data hygiene in the Google Sheet (remove duplicates, fix columns, etc.).

## 🚀 Deployment Instructions

To deploy this backend:

1.  Go to [script.google.com](https://script.google.com/home).
2.  Create a new project.
3.  Copy the contents of `appsscript.js` into via the online editor.
4.  **Important**: Set the `SPREADSHEET_ID` variable in the script to your actual Google Sheet ID.
5.  Click **Deploy** -> **New Deployment**.
6.  Select **Web App**.
    - **Description**: Fario Backend
    - **Execute as**: Me
    - **Who has access**: **Anyone** (Critical for the frontend to access it without Google Sign-In prompts).
7.  Copy the **Web App URL** (ends in `/exec`).
8.  Update the frontend `services/*.ts` files with this new URL.

## 🛠 Features

- **Store Products**: Saves product details to the `FARIO-PRODUCTS` sheet.
- **Get Products**: Retrieves the catalog as JSON.
- **Diagnose**: Provides debug info about specific rows/IDs.

## ⚠️ Notes

- The `search` and filtering logic is presently handled on the **Frontend** to save API calls.
- Images are stored as URLs (Google Drive or external).
