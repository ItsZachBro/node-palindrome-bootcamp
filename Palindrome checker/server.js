const http = require('http');
const fs = require('fs');
const { parse } = require('querystring');

const isPalindrome = (str) => {
    const cleanedStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleanedStr === cleanedStr.split('').reverse().join('');
};

const responseHtml = (result = '') => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Palindrome Checker</title>
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>
        <section class="container">
            <h1>Palindrome Checker</h1>
            <form action="/check" method="POST">
                <input type="text" name="input" placeholder="Enter a word or phrase" required>
                <button type="submit">Check</button>
            </form>
            <section id="result" style="${result ? '' : 'display: none;'}">${result}</section>
            <p><a href="/">Check another word or phrase</a></p>
        </section>
    </body>
    </html>
`;

const server = http.createServer((req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(responseHtml());
    } else if (req.url === '/styles.css' && req.method === 'GET') {
        fs.readFile('styles.css', (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(data);
        });
    } else if (req.url === '/check' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const input = parse(body).input;
            const isPalin = isPalindrome(input);
            const result = isPalin
                ? `<p>${input} is a palindrome!</p>`
                : `<p>${input} is not a palindrome.</p>`;
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(responseHtml(result));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

const port = process.env.PORT || 1234;
server.listen(port, () => {
    console.log(`Get served on port ${port}`);
});
