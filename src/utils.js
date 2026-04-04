import validator from "./validators.js";

const MAX_INPUT_LENGTH = 100;
const PLACE_PARAM_PATTERN = /^(\d+),(\d+),(NORTH|EAST|SOUTH|WEST)$/;

// Create a data transformation pipeline via functional programming
const pipe = (...arr) =>
  arr.reduce(
    (f1, f2) =>
      (...args) =>
        f2(f1(...args)),
  );

// PLACE command requires params
function parseParams(command, params) {
  if (command !== "PLACE" && !params) {
    return;
  }

  // Allow "MOVE", "LEFT", "RIGHT", "REPORT" commands with params but will trim unnecessary words
  // if (command !== "PLACE") {
  //   return;
  // }

  // Don't allow "MOVE", "LEFT", "RIGHT", "REPORT" commands with params
  if (command !== "PLACE" && params) {
    throw new RangeError(
      "Command failed: MOVE, LEFT, RIGHT, REPORT commands do not allow params",
    );
  }

  // Only type PLACE
  if (command === "PLACE" && !params) {
    throw new RangeError(
      "Command failed: Please enter valid position X,Y and facing direction F",
    );
  }

  const normalizedParams = params.trim();
  const matched = normalizedParams.match(PLACE_PARAM_PATTERN);

  if (!matched) {
    throw new RangeError(
      "Command failed: Please enter allowed values (non empty numbers between 0-5) of position X,Y and facing direction F (NORTH, EAST, SOUTH, WEST)",
    );
  }

  const x = Number(matched[1]);
  const y = Number(matched[2]);
  const f = matched[3];

  if (!validator.x(x) || !validator.y(y) || !validator.f(f)) {
    throw new RangeError(
      "Command failed: Please enter allowed values (non empty numbers between 0-5) of position X,Y and facing direction F (NORTH, EAST, SOUTH, WEST)",
    );
  }

  return {
    x,
    y,
    f,
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
    throw new TypeError();
  }

  const normalizedInput = input.trim();

  if (normalizedInput.length > MAX_INPUT_LENGTH) {
    throw new RangeError(
      "Command failed: Input too long, please keep command length under 100 characters",
    );
  }

  const { cmd, args } = pipe(
    // Handle whitespace between command and params safely
    (arr) => arr.match(/^(\S+)(?:\s+(.+))?$/),
    (match) => {
      if (!match) {
        throw new RangeError(
          "Command failed: Please enter allowed values of commands (PLACE, MOVE, LEFT, RIGHT, REPORT)",
        );
      }

      return {
        command: match[1],
        params: match[2],
      };
    },
    ({ command, params }) => ({
      cmd: parseCommand(command),
      args: parseParams(command, params),
    }),
  )(normalizedInput);

  return {
    cmd,
    args,
  };
}

export { parseInput, parseParams };
