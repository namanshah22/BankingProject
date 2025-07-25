const fetch = require('node-fetch');

module.exports = async function fetchData() {
    const urls = [
        'http://localhost:8074/customers',
        'http://localhost:8084/accounts',
        'http://localhost:9010/api/transactions',
        'http://localhost:8083/payees',
        'http://localhost:8001/nominees',
        'http://localhost:8082/login-attempts'
    ];

    let results = '';

    for (const url of urls) {
        try {
            const response = await fetch(url);
            const json = await response.json();
            results += `\n\n--- Data from ${url} ---\n${JSON.stringify(json, null, 2)}\n`;
        } catch (err) {
            results += `\n\n--- Failed to fetch ${url}: ${err.message} ---\n`;
        }
    }

    return results;
};

