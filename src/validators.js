import { Commands, Directions, Table } from "./constants.js";

// Set the validator of the input type and table boundary
const validator = {
  x: (x) => typeof x === "number" && x <= Table.max && x >= Table.min,
  y: (y) => typeof y === "number" && y <= Table.max && y >= Table.min,
  f: (f) => typeof f === "string" && Directions.includes(f),
  cmd: (cmd) => typeof cmd === "string" && Commands.includes(cmd),
};

export default validator;
