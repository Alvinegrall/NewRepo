
module.exports = {
  apps: [
    {
      name: 'Api le jeune agropreneur',
      script: './build/server.js',
      instances: '1',
      exec_mode: 'cluster',
      autorestart: true,
    },
  ],
}
