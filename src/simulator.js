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
  let { f: face } = state;
  const facingIdx = Directions.indexOf(face);
  const lastIdx = Directions.length - 1;

  if (face === Directions[0] && cmd === "LEFT") {
    face = Directions[lastIdx];
  } else if (face === Directions[lastIdx] && cmd === "RIGHT") {
    face = Directions[0];
  } else if (cmd === "RIGHT") {
    face = Directions[facingIdx + 1];
  } else if (cmd === "LEFT") {
    face = Directions[facingIdx - 1];
  }

  return {
    state: {
      ...state,
      f: face,
    },
    status: "success",
    message: `Command success: Robot now faces ${face}`,
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
    default:
      result = {
        state: stateWithPlacement,
        status: "success",
        message: "Command success",
      };
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
    return {
      state,
      status: "fail",
      message:
        error instanceof Error
          ? error.message
          : "Command failed: Unknown parsing error",
      command: null,
    };
  }
}

export { initialState, runCommand };
