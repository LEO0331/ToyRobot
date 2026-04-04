import { initialState } from "../src/simulator.js";
import {
  getBoardCells,
  parseScript,
  runCommandWithLog,
} from "../src/web-controller.js";

const commandInput = document.getElementById("command-input");
const runCommandButton = document.getElementById("run-command");
const scriptInput = document.getElementById("script-input");
const stepScriptButton = document.getElementById("step-script");
const runScriptButton = document.getElementById("run-script");
const resetScriptButton = document.getElementById("reset-script");
const resetStateButton = document.getElementById("reset-state");
const board = document.getElementById("board");
const log = document.getElementById("log");
const stateLine = document.getElementById("state-line");

let state = { ...initialState };
let scriptCommands = [];
let scriptCursor = 0;

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderState() {
  if (!state.Placed) {
    stateLine.textContent = "Not placed";
    return;
  }

  stateLine.textContent = `${state.x},${state.y},${state.f}`;
}

function renderBoard() {
  const cells = getBoardCells(state);
  board.innerHTML = cells
    .map((cell) => {
      const robot = cell.hasRobot
        ? `<span class="robot" aria-label="Robot">${cell.robotGlyph}</span>`
        : "";

      return `<div class="cell"><span class="coord">(${cell.x},${cell.y})</span>${robot}</div>`;
    })
    .join("");
}

function appendLog({ commandText, status, message, reportOutput }) {
  const item = document.createElement("li");
  const statusClass = status === "success" ? "ok" : "bad";
  const base = `[${status.toUpperCase()}] ${commandText} -> ${message}`;
  item.className = statusClass;
  item.innerHTML = `${escapeHtml(base)}${
    reportOutput ? `<br><strong>${escapeHtml(reportOutput)}</strong>` : ""
  }`;
  log.prepend(item);
}

function executeCommand(commandText) {
  const result = runCommandWithLog(commandText, state);
  state = result.state;
  renderState();
  renderBoard();
  appendLog({
    commandText,
    status: result.status,
    message: result.message,
    reportOutput: result.reportOutput,
  });
}

function reloadScriptCommands() {
  scriptCommands = parseScript(scriptInput.value);
  scriptCursor = 0;
}

runCommandButton.addEventListener("click", () => {
  const commandText = commandInput.value;
  executeCommand(commandText);
  commandInput.value = "";
  commandInput.focus();
});

commandInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    runCommandButton.click();
  }
});

stepScriptButton.addEventListener("click", () => {
  if (scriptCursor === 0 || scriptCommands.length === 0) {
    reloadScriptCommands();
  }

  if (scriptCursor >= scriptCommands.length) {
    appendLog({
      commandText: "SCRIPT",
      status: "fail",
      message: "Command failed: Script has no remaining commands",
      reportOutput: null,
    });
    return;
  }

  executeCommand(scriptCommands[scriptCursor]);
  scriptCursor += 1;
});

runScriptButton.addEventListener("click", () => {
  reloadScriptCommands();
  scriptCommands.forEach((command) => executeCommand(command));
  scriptCursor = scriptCommands.length;
});

resetScriptButton.addEventListener("click", () => {
  scriptCursor = 0;
  appendLog({
    commandText: "SCRIPT",
    status: "success",
    message: "Command success: Script cursor reset",
    reportOutput: null,
  });
});

resetStateButton.addEventListener("click", () => {
  state = { ...initialState };
  renderState();
  renderBoard();
  appendLog({
    commandText: "RESET",
    status: "success",
    message: "Command success: Robot state reset",
    reportOutput: null,
  });
});

renderState();
renderBoard();
