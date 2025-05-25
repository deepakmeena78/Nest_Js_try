module.exports = {
  apps: [
    {
      name: 'ventursa',
      script: 'dist/main.js',
      wait_ready: true,
      kill_timeout: 300000,
    },
  ],
};
