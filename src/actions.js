import { Directions } from "./constants";
import validator from "./validators";
import { parseInput } from "./utils";

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
  let { f } = state;
  const facingIdx = Directions.indexOf(f);
  const lastIdx = Directions.length - 1;

  if (f === Directions[0] && cmd === "LEFT") {
    // NORTH rotate LEFT will face WEST
    f = Directions[lastIdx];
  } else if (f === Directions[lastIdx] && cmd === "RIGHT") {
    // WEST rotate RIGHT will face NORTH
    f = Directions[0];
  } else if (cmd === "RIGHT") {
    f = Directions[facingIdx + 1];
  } else if (cmd === "LEFT") {
    f = Directions[facingIdx - 1];
  }

  return {
    ...state,
  };
}

// Log robot position and facing direcions
function report(state) {
  const { x, y, f } = state;

  // Announce the X,Y,F of Toy Robot
  const output = `${x},${y},${f}`;
  console.log(output);

  return state;
}

function action(cmd, args, state) {
  // Ignore if first command is not PLACE
  if (!state.Placed && cmd !== "PLACE") {
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
    console.error("Command Failed", e.message);
    return state;
  }
}

export default handleLineInput;
