/** @type {import('pm2').ModuleOptions[]} */
module.exports = {
    apps: [
        {
            name: 'gateway-svc',
            script: 'apps/gateway-svc/dist/main.js',
            watch: false,
            env: {
                NODE_ENV: 'development',
                PORT: 3000,
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
        },
        {
            name: 'findata-svc',
            script: 'apps/findata-svc/dist/main.js',
            watch: false,
            env: {
                NODE_ENV: 'development',
                TCP_PORT: 3001,
            },
            env_production: {
                NODE_ENV: 'production',
                TCP_PORT: 3001,
            },
        },
        {
            name: 'trading-svc',
            script: 'apps/trading-svc/dist/main.js',
            watch: false,
            env: {
                NODE_ENV: 'development',
                TCP_PORT: 3002,
            },
            env_production: {
                NODE_ENV: 'production',
                TCP_PORT: 3002,
            },
        },        
        {
            name: 'notification-svc',
            script: 'apps/notification-svc/dist/main.js',
            watch: false,
            env: {
                NODE_ENV: 'development',
                TCP_PORT: 3003,
            },
            env_production: {
                NODE_ENV: 'production',
                TCP_PORT: 3003,
            },
        },
    ],
};
