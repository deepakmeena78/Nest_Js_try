module.exports = {
  apps: [
    {
      name: 'saral-auth',
      script: 'dist/main.js',
      wait_ready: true,
      kill_timeout: 300000,
    },
  ],
};
