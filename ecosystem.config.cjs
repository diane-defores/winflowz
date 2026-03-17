module.exports = {
  apps: [{
    name: "winflowz",
    cwd: "/home/claude/winflowz",
    script: "bash",
    args: ["-c", "export PORT=3013 && flox activate -- pnpm dev -- --port 3013"],
    env: {
      PORT: 3013
    },
    autorestart: true,
    watch: false
  }]
};
