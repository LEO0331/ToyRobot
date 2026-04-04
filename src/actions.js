import { runCommand } from "./simulator.js";

function handleLineInput(input, state, logger = console.log) {
  const result = runCommand(input, state);

  if (result.status === "fail") {
    logger(result.message);
  }

  if (result.reportOutput) {
    logger(result.reportOutput);
  }

  return result.state;
}

export default handleLineInput;
