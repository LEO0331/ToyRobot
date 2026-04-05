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
const latestStatus = document.getElementById("latest-status");
const scriptPreview = document.getElementById("script-preview");
const presetButtons = document.querySelectorAll(".preset");
const buttonModeToggle = document.getElementById("button-mode-toggle");
const textControls = document.getElementById("text-controls");
const buttonControls = document.getElementById("button-controls");
const placeX = document.getElementById("place-x");
const placeY = document.getElementById("place-y");
const placeF = document.getElementById("place-f");
const placeButton = document.getElementById("place-button");
const actionPadButtons = document.querySelectorAll("[data-command]");
const buttonResetState = document.getElementById("button-reset-state");

let state = { ...initialState };
let scriptCommands = [];
let scriptCursor = 0;

const demoPresets = {
  A: "PLACE 0,0,NORTH\nMOVE\nREPORT",
  B: "PLACE 0,0,NORTH\nLEFT\nREPORT",
  C: "PLACE 1,2,EAST\nMOVE\nMOVE\nLEFT\nMOVE\nREPORT",
};

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function setStatusBanner(status, message) {
  latestStatus.classList.remove("success", "fail", "neutral");

  if (status === "success") {
    latestStatus.classList.add("success");
  } else if (status === "fail") {
    latestStatus.classList.add("fail");
  } else {
    latestStatus.classList.add("neutral");
  }

  latestStatus.textContent = message;
}

function renderScriptPreview() {
  if (scriptCommands.length === 0) {
    scriptPreview.innerHTML = "<li>No parsed script commands yet.</li>";
    return;
  }

  scriptPreview.innerHTML = scriptCommands
    .map((line, index) => {
      const activeClass = index === scriptCursor ? "active-line" : "";
      return `<li class="${activeClass}">${escapeHtml(line)}</li>`;
    })
    .join("");
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
  setStatusBanner(result.status, result.message);
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
  renderScriptPreview();
}

function resetRobotState() {
  state = { ...initialState };
  renderState();
  renderBoard();
  setStatusBanner("success", "Command success: Robot state reset");
  appendLog({
    commandText: "RESET",
    status: "success",
    message: "Command success: Robot state reset",
    reportOutput: null,
  });
}

function toggleControlMode(useButtonControls) {
  textControls.classList.toggle("hidden-controls", useButtonControls);
  buttonControls.classList.toggle("hidden-controls", !useButtonControls);
  setStatusBanner(
    "neutral",
    useButtonControls
      ? "Button mode enabled: use PLACE/LEFT/MOVE/RIGHT/REPORT controls"
      : "Text mode enabled: use command or script input",
  );
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
    setStatusBanner("fail", "Command failed: Script has no remaining commands");
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
  renderScriptPreview();
});

runScriptButton.addEventListener("click", () => {
  reloadScriptCommands();
  scriptCommands.forEach((command) => executeCommand(command));
  scriptCursor = scriptCommands.length;
  renderScriptPreview();
});

resetScriptButton.addEventListener("click", () => {
  scriptCursor = 0;
  renderScriptPreview();
  setStatusBanner("success", "Command success: Script cursor reset");
  appendLog({
    commandText: "SCRIPT",
    status: "success",
    message: "Command success: Script cursor reset",
    reportOutput: null,
  });
});

resetStateButton.addEventListener("click", () => {
  resetRobotState();
});

scriptInput.addEventListener("input", () => {
  reloadScriptCommands();
});

presetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const presetKey = button.dataset.preset;
    scriptInput.value = demoPresets[presetKey] || "";
    reloadScriptCommands();
    setStatusBanner("neutral", `Preset loaded: Example ${presetKey}`);
  });
});

buttonModeToggle.addEventListener("change", (event) => {
  toggleControlMode(event.target.checked);
});

placeButton.addEventListener("click", () => {
  const command = `PLACE ${placeX.value},${placeY.value},${placeF.value}`;
  executeCommand(command);
});

actionPadButtons.forEach((button) => {
  button.addEventListener("click", () => {
    executeCommand(button.dataset.command);
  });
});

buttonResetState.addEventListener("click", () => {
  resetRobotState();
});

renderState();
renderBoard();
reloadScriptCommands();
toggleControlMode(false);
