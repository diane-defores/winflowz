module.exports = {
  apps: [{
    name: "voiceflowz",
    cwd: "/home/claude/voiceflowz",
    script: "bash",
    args: ["-lc", "flox activate -- bash -lc 'npx expo start --dev-client --tunnel'"],
    autorestart: false,
    watch: false
  }]
};
