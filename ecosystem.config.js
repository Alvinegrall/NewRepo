
module.exports = {
  apps: [
    {
      name: 'Api gestion de stock',
      script: './build/server.js',
      instances: '1',
      exec_mode: 'cluster',
      autorestart: true,
    },
  ],
}
