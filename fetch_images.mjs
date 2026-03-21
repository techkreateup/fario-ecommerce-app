import https from 'https';

const urls = [
  'https://www.mydesignation.com/collections/men-oversized-tees',
  'https://www.mydesignation.com/collections/men-hoodies-and-jackets',
  'https://www.mydesignation.com/collections/sports-collection-2026'
];

urls.forEach(url => {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.118 Safari/537.36' } }, (res) => {
    
    // Handle redirects
    if (res.statusCode > 300 && res.statusCode < 400 && res.headers.location) {
        console.log("REDIRECT", res.headers.location);
        return;
    }

    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => {
      const match = data.match(/https:\/\/www\.mydesignation\.com\/cdn\/shop\/files\/[^"']+/g);
      if (match) {
        // filter for images that look like banners (width=2000 or similar large widths)
        const webImages = match.filter(m => m.includes('width=2000') || m.includes('WEB') || m.includes('BANNER'));
        console.log("\nMATCHES FOR " + url);
        const unique = [...new Set(webImages)].slice(0, 3);
        unique.forEach(m => console.log(m));
      } else {
        console.log("NO MATCHES " + url);
      }
    });
  }).on('error', e => console.error(e));
});
