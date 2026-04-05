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

  test("moves correctly in all cardinal directions", () => {
    const north = runCommand(
      "MOVE",
      runCommand("PLACE 2,2,NORTH", { ...initialState }).state,
    ).state;
    expect(north).toMatchObject({ x: 2, y: 3, f: "NORTH", Placed: true });

    const south = runCommand(
      "MOVE",
      runCommand("PLACE 2,2,SOUTH", { ...initialState }).state,
    ).state;
    expect(south).toMatchObject({ x: 2, y: 1, f: "SOUTH", Placed: true });

    const east = runCommand(
      "MOVE",
      runCommand("PLACE 2,2,EAST", { ...initialState }).state,
    ).state;
    expect(east).toMatchObject({ x: 3, y: 2, f: "EAST", Placed: true });

    const west = runCommand(
      "MOVE",
      runCommand("PLACE 2,2,WEST", { ...initialState }).state,
    ).state;
    expect(west).toMatchObject({ x: 1, y: 2, f: "WEST", Placed: true });
  });

  test("rotates with wrapping branches", () => {
    const northToWest = runCommand(
      "LEFT",
      runCommand("PLACE 1,1,NORTH", { ...initialState }).state,
    ).state;
    expect(northToWest.f).toBe("WEST");

    const westToNorth = runCommand(
      "RIGHT",
      runCommand("PLACE 1,1,WEST", { ...initialState }).state,
    ).state;
    expect(westToNorth.f).toBe("NORTH");
  });

  test("rotates within interior branches", () => {
    const eastToSouth = runCommand(
      "RIGHT",
      runCommand("PLACE 1,1,EAST", { ...initialState }).state,
    ).state;
    expect(eastToSouth.f).toBe("SOUTH");

    const southToEast = runCommand(
      "LEFT",
      runCommand("PLACE 1,1,SOUTH", { ...initialState }).state,
    ).state;
    expect(southToEast.f).toBe("EAST");

    const eastToNorth = runCommand(
      "LEFT",
      runCommand("PLACE 1,1,EAST", { ...initialState }).state,
    ).state;
    expect(eastToNorth.f).toBe("NORTH");
  });

  test("allows re-PLACE after initial placement", () => {
    const firstPlaced = runCommand("PLACE 0,0,NORTH", { ...initialState }).state;
    const replaced = runCommand("PLACE 5,5,SOUTH", firstPlaced);

    expect(replaced.status).toBe("success");
    expect(replaced.state).toMatchObject({ x: 5, y: 5, f: "SOUTH", Placed: true });
    expect(replaced.message).toContain("Robot placed");
  });

  test("keeps command information in execution result", () => {
    const result = runCommand("PLACE 0,0,NORTH", { ...initialState });
    expect(result.command).toBe("PLACE");
  });

  test("uses default initial state when state argument is omitted", () => {
    const result = runCommand("PLACE 0,0,NORTH");
    expect(result.status).toBe("success");
    expect(result.state).toMatchObject({ x: 0, y: 0, f: "NORTH", Placed: true });
  });

  test("returns fail result for non-string input with default state", () => {
    const result = runCommand(null);
    expect(result.status).toBe("fail");
    expect(result.command).toBeNull();
    expect(result.state).toEqual(initialState);
  });
});
