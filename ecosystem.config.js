/** @type {import('pm2').ModuleOptions[]} */

const dotenv = require('dotenv');
dotenv.config({ path: '.env.production' });

module.exports = {
    apps: [
        {
            name: 'gateway-svc',
            script: 'apps/gateway-svc/dist/main.js',
            watch: false,
            env: {
                NODE_ENV: 'production',
                PORT: process.env.GATEWAY_PORT,
            },
        },
        {
            name: 'findata-svc',
            script: 'apps/findata-svc/dist/main.js',
            watch: false,
            env: {
                NODE_ENV: 'production',
                PORT: process.env.FINDATA_PORT,
            },
        },
        {
            name: 'trading-svc',
            script: 'apps/trading-svc/dist/main.js',
            watch: false,
            env: {
                NODE_ENV: 'production',
                PORT: process.env.TRADING_PORT,
            },
        },        
        {
            name: 'notification-svc',
            script: 'apps/notification-svc/dist/main.js',
            watch: false,
            env: {
                NODE_ENV: 'production',
                PORT: process.env.NOTIFICATION_PORT,
            },
        },
    ],
};
