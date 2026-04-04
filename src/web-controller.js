import { Table } from "./constants.js";
import { runCommand } from "./simulator.js";

const FaceGlyph = {
  NORTH: "^",
  EAST: ">",
  SOUTH: "v",
  WEST: "<",
};

function parseScript(scriptText) {
  if (typeof scriptText !== "string") {
    return [];
  }

  return scriptText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function getRobotGlyph(facing) {
  return FaceGlyph[facing] || "?";
}

function getBoardCells(state, min = Table.min, max = Table.max) {
  const cells = [];

  for (let y = max; y >= min; y -= 1) {
    for (let x = min; x <= max; x += 1) {
      const hasRobot = state.Placed && state.x === x && state.y === y;
      cells.push({
        x,
        y,
        hasRobot,
        facing: hasRobot ? state.f : null,
        robotGlyph: hasRobot ? getRobotGlyph(state.f) : null,
      });
    }
  }

  return cells;
}

function runCommandWithLog(input, state) {
  return runCommand(input, state);
}

export { getBoardCells, getRobotGlyph, parseScript, runCommandWithLog };
