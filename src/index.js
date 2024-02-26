import Readline from "readline";
import handleLineInput from "./actions";

// Initial state
let state = {
  x: undefined,
  y: undefined,
  f: undefined,
  Placed: false,
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
