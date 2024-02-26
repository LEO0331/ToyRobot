import validator from "./validators";

// Create a data transformation pipeline via functional programming
const pipe = (...arr) =>
  arr.reduce(
    (f1, f2) =>
      (...args) =>
        f2(f1(...args)),
  );

// PLACE command requires params
function parseParams(command, params) {
  if (command !== "PLACE") {
    return;
  }

  if (!params) {
    throw new RangeError(
      "Command failed: Please enter position X,Y and facing direction F",
    );
  }

  // Handle X,Y,F separately with correct type
  const args = params.trim().split(",");

  if (
    args.length !== 3 ||
    !validator.x(Number(args[0])) ||
    !validator.y(Number(args[1])) ||
    !validator.f(args[2])
  ) {
    throw new RangeError(
      "Command failed: Please enter allowed values of position X,Y and facing direction F (NORTH, EAST, SOUTH, WEST",
    );
  }

  return {
    x: Number(args[0]),
    y: Number(args[1]),
    f: args[2],
  };
}

function parseCommand(command) {
  if (!validator.cmd(command)) {
    throw new RangeError(
      "Command failed: Please enter allowed values of commands (PLACE, MOVE, LEFT, RIGHT, REPORT)",
    );
  }

  return command;
}

function parseInput(input) {
  if (typeof input !== "string") {
    throw new TypeError(
      "Command failed: Please enter correct type of inputs (string)",
    );
  }

  const { cmd, args } = pipe(
    // Handle PLACE cmd and args
    (arr) => arr.trim().split(" "),

    // Remove empty string
    (arr) => arr.filter((v) => v !== " "),

    ([command, params]) => ({
      cmd: parseCommand(command),
      args: parseParams(command, params),
    }),
  )(input);

  return {
    cmd,
    args,
  };
}

export { parseInput, parseParams, pipe };
