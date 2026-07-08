module.exports = {
  apps: [
    {
      name: "ahlan-frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 0.0.0.0 -p 3005",
      env: {
        NODE_OPTIONS: "--experimental-require-module",
        PORT: 3005,
      },
    },
    {
      name: "ahlan-tunnel",
      script: "node_modules/cloudflared/bin/cloudflared.exe",
      args: "tunnel --url http://localhost:3005",
      interpreter: "none",
    },
  ],
};
