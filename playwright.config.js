module.exports = {
    testDir: './tests',
    use: {
        headless: false,
        baseURL: 'http://localhost:3001', 
        browserName: 'chromium',
        actionTimeout: 10000, 
        navigationTimeout: 30000, 
        slowMo: 50000,
    },
};
