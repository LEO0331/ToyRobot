import { parseInput, parseParams } from "../src/utils";

describe("utils testCases", () => {
  describe("parseInput function", () => {
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
  });
});
