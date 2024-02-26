import { Directions } from "./constants";
import validator from "./validators";
import parseInput from "./utils";

// Place
function place(args, state) {
  return {
    ...state,
    ...args,
  };
}

// Move
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

  // Ignore move causing the robot to fall
  if (!validator.y(newY) || !validator.x(newX)) {
    console.log("Command failed: Robot will fall, return to the previous state, please enter a valid input")
    return state;
  }

  return {
    ...state,
    x: newX,
    y: newY,
  };
}

// Rotate
function turn(cmd, state) {
  let { f: face } = state;
  const facingIdx = Directions.indexOf(face);
  const lastIdx = Directions.length - 1;

  if (face === Directions[0] && cmd === "LEFT") {
    // NORTH rotate LEFT will face WEST
    face = Directions[lastIdx];
  } else if (face === Directions[lastIdx] && cmd === "RIGHT") {
    // WEST rotate RIGHT will face NORTH
    face = Directions[0];
  } else if (cmd === "RIGHT") {
    face = Directions[facingIdx + 1];
  } else if (cmd === "LEFT") {
    face = Directions[facingIdx - 1];
  }

  return {
    ...state,
    f: face
  };
}

// Announce robot position and facing direcions
function report(state) {
  const { x, y, f } = state;
  const output = `${x},${y},${f}`;
  console.log(output);
  return state;
}

function action(cmd, args, state) {
  // Ignore if first command is not PLACE
  if (!state.Placed && cmd !== "PLACE") {
    console.log("Command failed: The first valid command must be PLACE");
    return state;
  }

  const newState = {
    ...state,
    Placed: true,
  };

  switch (cmd) {
    case "PLACE":
      return place(args, newState);
    case "MOVE":
      return move(newState);
    case "LEFT":
    case "RIGHT":
      return turn(cmd, newState);
    case "REPORT":
      return report(newState);
    default:
      return newState;
  }
}

function handleLineInput(input, state) {
  try {
    const { cmd, args } = parseInput(input);
    return action(cmd, args, state);
  } catch (e) {
    console.log(e);
    return state;
  }
}

export default handleLineInput;
