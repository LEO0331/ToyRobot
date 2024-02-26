import validator from "../src/validators";
import { Commands, Directions } from "../src/constants";

let xFunc = validator.x;

describe("validator testCases", () => {
  describe("x validator", () => {
    test("given an invalid type", () => {
      const expected = false;
      const xValues = [undefined, null, NaN, "string", {}, []];

      xValues.forEach((x) => {
        const actual = xFunc(x);
        expect(actual).toEqual(expected);
      });
    });
    test("given an out of range value", () => {});
    test("given a correct type and value", () => {});
  });
});
