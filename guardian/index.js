const chokidar = require("chokidar");
const fetch = require("node-fetch");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const PROJECT_PATH = path.join(__dirname, "..");
const WEBSITE_URL = "http://localhost:5173";
const STATUS_FILE = path.join(PROJECT_PATH, "guardian.log");

function log(msg) {
  const time = new Date().toLocaleTimeString();
  const text = "[" + time + "] " + msg + "\n";
  console.log(text);
  fs.appendFileSync(STATUS_FILE, text);
}

log("FARIO GUARDIAN STARTED");

function startDev() {
  log("Starting dev server...");
  exec("npm run dev", { cwd: PROJECT_PATH });
}

function installPackages() {
  log("Running npm install...");
  exec("npm install", { cwd: PROJECT_PATH });
}

startDev();

async function checkWebsite() {
  try {
    const res = await fetch(WEBSITE_URL);
    if (res.status === 200) {
      log("Website Healthy");
    } else {
      throw new Error("Bad Status");
    }
  } catch (err) {
    log("WEBSITE DOWN - SELF HEAL");

    installPackages();

    exec("npm run build", { cwd: PROJECT_PATH }, () => {
      log("Rebuild complete");
      startDev();
      log("Restarted Dev Server");
    });
  }
}

setInterval(checkWebsite, 30000);

chokidar.watch(PROJECT_PATH, { ignored: /node_modules|guardian/ })
.on("change", file => log("File Changed: " + file))
.on("add", file => log("File Added: " + file));

process.on("uncaughtException", err => {
  log("CRASH: " + err.message);
  startDev();
});

process.on("unhandledRejection", err => {
  log("PROMISE ERROR: " + err);
  startDev();
});