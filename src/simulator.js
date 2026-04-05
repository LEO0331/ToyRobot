import { Directions } from "./constants.js";
import validator from "./validators.js";
import { parseInput } from "./utils.js";

const initialState = {
  x: undefined,
  y: undefined,
  f: undefined,
  Placed: false,
};

function place(args, state) {
  const nextState = {
    ...state,
    ...args,
  };

  return {
    state: nextState,
    status: "success",
    message: `Command success: Robot placed at ${nextState.x},${nextState.y},${nextState.f}`,
  };
}

function move(state) {
  const { x, y, f } = state;
  let newX = x;
  let newY = y;

  switch (f) {
    case "NORTH":
      newY += 1;
      break;
    case "SOUTH":
      newY -= 1;
      break;
    case "EAST":
      newX += 1;
      break;
    case "WEST":
      newX -= 1;
      break;
  }

  if (!validator.y(newY) || !validator.x(newX)) {
    return {
      state,
      status: "fail",
      message:
        "Command failed: Robot will fall, return to the previous state, please enter a valid input",
    };
  }

  return {
    state: {
      ...state,
      x: newX,
      y: newY,
    },
    status: "success",
    message: `Command success: Robot moved to ${newX},${newY},${f}`,
  };
}

function turn(cmd, state) {
  const { f: face } = state;
  const facingIdx = Directions.indexOf(face);
  const delta = cmd === "RIGHT" ? 1 : -1;
  const nextIdx = (facingIdx + delta + Directions.length) % Directions.length;
  const nextFace = Directions[nextIdx];

  return {
    state: {
      ...state,
      f: nextFace,
    },
    status: "success",
    message: `Command success: Robot now faces ${nextFace}`,
  };
}

function report(state) {
  const { x, y, f } = state;
  const output = `${x},${y},${f}`;

  return {
    state,
    status: "success",
    message: `Command success: ${output}`,
    reportOutput: output,
  };
}

function executeCommand(cmd, args, state) {
  if (!state.Placed && cmd !== "PLACE") {
    return {
      state,
      status: "fail",
      message: "Command failed: The first valid command must be PLACE",
      command: cmd,
    };
  }

  const stateWithPlacement = {
    ...state,
    Placed: true,
  };

  let result;
  switch (cmd) {
    case "PLACE":
      result = place(args, stateWithPlacement);
      break;
    case "MOVE":
      result = move(stateWithPlacement);
      break;
    case "LEFT":
    case "RIGHT":
      result = turn(cmd, stateWithPlacement);
      break;
    case "REPORT":
      result = report(stateWithPlacement);
      break;
  }

  return {
    ...result,
    command: cmd,
  };
}

function runCommand(input, state = initialState) {
  try {
    const { cmd, args } = parseInput(input);
    return executeCommand(cmd, args, state);
  } catch (error) {
    const message =
      error && typeof error === "object" && "message" in error && error.message
        ? error.message
        : "Command failed: Unknown parsing error";

    return {
      state,
      status: "fail",
      message,
      command: null,
    };
  }
}

export { initialState, runCommand };
