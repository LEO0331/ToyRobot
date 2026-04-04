import { initialState, runCommand } from "../src/simulator.js";

describe("simulator runCommand", () => {
  test("rejects commands before first valid PLACE", () => {
    const result = runCommand("MOVE", { ...initialState });
    expect(result.status).toBe("fail");
    expect(result.message).toBe(
      "Command failed: The first valid command must be PLACE",
    );
    expect(result.state).toEqual(initialState);
  });

  test("rejects lowercase command", () => {
    const result = runCommand("report", { ...initialState });
    expect(result.status).toBe("fail");
    expect(result.message).toContain("allowed values of commands");
  });

  test("rejects malformed PLACE", () => {
    const result = runCommand("PLACE 1,,NORTH", { ...initialState });
    expect(result.status).toBe("fail");
    expect(result.message).toContain("allowed values");
  });

  test("ignores move that would fall", () => {
    const placed = runCommand("PLACE 0,5,NORTH", { ...initialState }).state;
    const result = runCommand("MOVE", placed);
    expect(result.status).toBe("fail");
    expect(result.message).toContain("Robot will fall");
    expect(result.state).toEqual(placed);
  });

  test("reports output in expected format", () => {
    const state = runCommand("PLACE 1,2,EAST", { ...initialState }).state;
    const moved = runCommand("MOVE", state).state;
    const report = runCommand("REPORT", moved);
    expect(report.status).toBe("success");
    expect(report.reportOutput).toBe("2,2,EAST");
  });
});
