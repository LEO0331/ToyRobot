import { initialState } from "../src/simulator.js";
import {
  getBoardCells,
  getRobotGlyph,
  parseScript,
  runCommandWithLog,
} from "../src/web-controller.js";

describe("web controller helpers", () => {
  test("parses multiline script into executable commands", () => {
    const script = "PLACE 0,0,NORTH\n\nMOVE\n REPORT ";
    expect(parseScript(script)).toEqual(["PLACE 0,0,NORTH", "MOVE", "REPORT"]);
  });

  test("builds a 6x6 board with coordinates", () => {
    const cells = getBoardCells({ ...initialState });
    expect(cells).toHaveLength(36);
    expect(cells[0]).toMatchObject({ x: 0, y: 5, hasRobot: false });
    expect(cells[cells.length - 1]).toMatchObject({ x: 5, y: 0, hasRobot: false });
  });

  test("shows robot position and orientation glyph", () => {
    const cells = getBoardCells({ x: 3, y: 4, f: "WEST", Placed: true });
    const robotCell = cells.find((cell) => cell.x === 3 && cell.y === 4);
    expect(robotCell.hasRobot).toBe(true);
    expect(robotCell.robotGlyph).toBe("<");
    expect(getRobotGlyph("NORTH")).toBe("^");
  });

  test("runs script commands step-by-step and logs report output", () => {
    let state = { ...initialState };
    const commands = parseScript("PLACE 0,0,NORTH\nMOVE\nREPORT");
    const outputs = [];

    commands.forEach((command) => {
      const result = runCommandWithLog(command, state);
      state = result.state;
      if (result.reportOutput) {
        outputs.push(result.reportOutput);
      }
    });

    expect(outputs).toEqual(["0,1,NORTH"]);
  });
});
