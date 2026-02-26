// Test script to verify drive() function output
const drive = (idOrUrl) => {
    if (!idOrUrl) return '';
    if (idOrUrl.includes('/folders/')) return '';
    // If already a direct URL, return as-is
    if (idOrUrl.includes('unsplash.com') || idOrUrl.includes('drive.google.com/uc?')) return idOrUrl;

    // Extract file ID from various Google Drive URL formats
    const match = idOrUrl.match(/\/d\/([-\w]{25,})/) || idOrUrl.match(/id=([-\w]{25,})/);
    const id = match ? match[1] : (idOrUrl.length > 25 ? idOrUrl : null);

    if (!id) return idOrUrl;

    // Use the uc?export=view format for better compatibility
    return `https://drive.google.com/uc?export=view&id=${id}`;
};

// Test URLs from constants.ts
const testUrls = [
    "https://drive.google.com/file/d/1pc6UNVFR889igs7LbnQml_DpWpVd5AP2/view?usp=sharing",
    "https://drive.google.com/file/d/1JAkZKl652biLyzUdO5X05Y4s7a1AsqPU/view?usp=sharing",
    "https://drive.google.com/file/d/19UKGRbcIZHffq1xs56MekmVpgF90H2kr/view?usp=sharing",
    "https://drive.google.com/file/d/1fm0yzmL6IQktGcvEZ34X3hF3YaVqcYoC/view?usp=sharing",
    "https://drive.google.com/file/d/1P2Rdo8iTmbVCLJ7bKG8SRiYdjoiEl5TZ/view?usp=sharing",
    "https://drive.google.com/file/d/1flbPCaMUvTIxbIV0F8ifxLEP1ySIgSwt/view?usp=sharing",
];

console.log("Testing drive() function:\n");
testUrls.forEach((url, i) => {
    const result = drive(url);
    console.log(`${i + 1}. Input:  ${url}`);
    console.log(`   Output: ${result}\n`);
});

console.log("\nCopy these URLs and test them in your browser:");
console.log("If they show 'Access Denied', the files need to be publicly shared.\n");
testUrls.forEach((url, i) => {
    console.log(drive(url));
});
