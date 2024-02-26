import { parseInput, parseParams } from "../src/utils";

describe("utils testCases", () => {
  describe("input function", () => {
    test("given an empty object or non-string argument provided throws TypeError", () => {
      const invalidInputs = [undefined, null, NaN, 1, {}, []];
      invalidInputs.forEach((input) => {
        try {
          parseInput(input);
        } catch (error) {
          expect(error).toEqual(TypeError());
        }
      });
    });

    test("given a PLACE command containing invalid/empty argument(s) provided throws RangeError", () => {
      const invalidInputs = [
        "PLACE ",
        "PLACE 1",
        "PLACE 1,2",
        "PLACE 1,2,3",
        "PLACE 1,2,3,4",
        "PLACE NORTH",
        "PLACE NORTH,EAST",
        "PLACE NORTH,2",
        "PLACE NORTH,2,3",
        "PLACE 1,NORTH,3",
        "PLACE 1,2,NORTH,3",
        "PLACE ,2,NORTH",
        "PLACE 1,,NORTH",
        "PLACE 1,2,",
        "PLACE 1,2,NORTH,",
      ];
      invalidInputs.forEach((input) => {
        expect(() => {
          parseInput(input);
        }).toThrow();
      });
    });

    test("given a non PLACE command with arguments within Commands list throws RangeError", () => {
      const invalidInputs = [
        "LEFT 123",
        "RIGHT 1,2,3",
        "MOVE abc",
        "REPORT a,b,c",
      ];
      invalidInputs.forEach((input) => {
        try {
          parseInput(input);
        } catch (error) {
          expect(error).toEqual(
            RangeError(
              "Command failed: MOVE, LEFT, RIGHT, REPORT commands do not allow params",
            ),
          );
        }
      });
    });

    test("given a non PLACE command within Commands list returns valid input values", () => {
      const validInputs = [
        { input: " LEFT", expected: { cmd: "LEFT" } },
        { input: "RIGHT ", expected: { cmd: "RIGHT" } },
        { input: "MOVE", expected: { cmd: "MOVE" } },
        { input: " REPORT ", expected: { cmd: "REPORT" } },
      ];
      validInputs.forEach((c) => {
        const actual = parseInput(c.input);
        // expect(actual.cmd).toEqual(c.expected.cmd);
        expect(actual).toEqual(c.expected);
      });
    });

    test("given a PLACE command with correct args returns valid input values", () => {
      const validInputs = [
        {
          input: "PLACE 0,0,NORTH",
          expected: { cmd: "PLACE", args: { x: 0, y: 0, f: "NORTH" } },
        },
        {
          input: " PLACE 1,1,EAST ",
          expected: { cmd: "PLACE", args: { x: 1, y: 1, f: "EAST" } },
        },
      ];
      validInputs.forEach((c) => {
        const actual = parseInput(c.input);
        expect(actual).toEqual(c.expected);
      });
    });

    test("given a non PLACE command of the parseParams function returns undefined", () => {
      const expected = undefined;
      const invalidInputs = ["LEFT", "OTHER"];
      invalidInputs.forEach((cmd) => {
        const actual = parseParams(cmd, "");
        expect(actual).toEqual(expected);
      });
    });

    test("given a PLACE command with falsy params throws RangeError", () => {
      const invalidInputs = [null, undefined, false];
      invalidInputs.forEach((param) => {
        try {
          parseParams("PLACE", param);
        } catch (error) {
          expect(error).toEqual(
            RangeError(
              "Command failed: Please enter valid position X,Y and facing direction F",
            ),
          );
        }
      });
    });

    test("given a PLACE command with invalid params throws RangeError", () => {
      const invalidInputs = ["1", "NORTH", " ", ", ", " ,", " NORTH"];
      invalidInputs.forEach((param) => {
        try {
          parseParams("PLACE", param);
        } catch (error) {
          expect(error).toEqual(
            RangeError(
              "Command failed: Please enter allowed values (non empty numbers between 0-5) of position X,Y and facing direction F (NORTH, EAST, SOUTH, WEST)",
            ),
          );
        }
      });
    });

    test("given a PLACE command with correct args of the parseParams function returns valid input values", () => {
      const validInputs = [
        { params: "0,0,NORTH", expected: { x: 0, y: 0, f: "NORTH" } },
        { params: "1,1,EAST ", expected: { x: 1, y: 1, f: "EAST" } },
      ];
      validInputs.forEach((param) => {
        const actual = parseParams("PLACE", param.params);
        expect(actual).toEqual(param.expected);
      });
    });
  });
});
