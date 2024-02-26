import { Commands, Directions } from "./constants";

// Set the validator of the input type and table boundary
const validator = {
  x: (x) => typeof x === "number" && x <= 5 && x >= 0,
  y: (y) => typeof y === "number" && y <= 5 && y >= 0,
  f: (f) => typeof f === "string" && Directions.includes(f),
  cmd: (cmd) => typeof cmd === "string" && Commands.includes(cmd),
};

export default validator;
