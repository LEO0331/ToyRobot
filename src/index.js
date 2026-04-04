import Readline from "readline";
import handleLineInput from "./actions.js";
import { initialState } from "./simulator.js";

// Initial state
let state = {
  ...initialState,
};

// Create a instruction interface
const readline = Readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Please give instructions to the robot:");

readline
  .on("line", (line) => {
    state = handleLineInput(line.trim(), state);
    readline.prompt();
  })
  .on("close", () => {
    console.log("Thanks");
    process.exit(0);
  });

readline.prompt();
