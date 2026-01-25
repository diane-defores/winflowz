module.exports = {
  apps: [{
    name: "winflowz",
    cwd: "/root/winflowz",
    script: "bash",
    args: ["-c", "export PORT=3001 && flox activate -- pnpm dev -- --port 3001"],
    env: {
      PORT: 3001
    },
    autorestart: true,
    watch: false
  }]
};
