/** @type {import('pm2').ModuleOptions[]} */
module.exports = {
    apps: [
        {
            name: 'gateway-svc',
            script: 'apps/gateway-svc/dist/main.js',
            watch: false,
            env_production: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'findata-svc',
            script: 'apps/findata-svc/dist/main.js',
            watch: false,
            env_production: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'trading-svc',
            script: 'apps/trading-svc/dist/main.js',
            watch: false,
            env_production: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'notification-svc',
            script: 'apps/notification-svc/dist/main.js',
            watch: false,
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],
};
