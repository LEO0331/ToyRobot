import validator from "../src/validators";
import { Commands, Directions } from "../src/constants";

let xFunc = validator.x;
let yFunc = validator.y;
let fFunc = validator.f;
let cmdFunc = validator.cmd;

describe("validator testCases", () => {
  describe("x validator", () => {
    test("given an invalid type returns false", () => {
      const expected = false;
      const xValues = [undefined, null, NaN, "string", {}, []];
      xValues.forEach((x) => {
        const actual = xFunc(x);
        expect(actual).toEqual(expected);
      });
    });

    test("given an out of range value returns false", () => {
      const expected = false;
      const xValues = [-1, 6];
      xValues.forEach((x) => {
        const actual = xFunc(x);
        expect(actual).toEqual(expected);
      });
    });

    test("given a correct type and value returns true", () => {
      const expected = true;
      const xValues = [0, 1, 2, 3, 4, 5];
      xValues.forEach((x) => {
        const actual = xFunc(x);
        expect(actual).toEqual(expected);
      });
    });
  });

  describe("y validator", () => {
    test("given an invalid type returns false", () => {
      const expected = false;
      const yValues = [undefined, null, NaN, "string", {}, []];
      yValues.forEach((y) => {
        const actual = yFunc(y);
        expect(actual).toEqual(expected);
      });
    });

    test("given an out of range value returns false", () => {
      const expected = false;
      const yValues = [-1, 6];
      yValues.forEach((y) => {
        const actual = yFunc(y);
        expect(actual).toEqual(expected);
      });
    });

    test("given a correct type and value returns true", () => {
      const expected = true;
      const yValues = [0, 1, 2, 3, 4, 5];
      yValues.forEach((y) => {
        const actual = yFunc(y);
        expect(actual).toEqual(expected);
      });
    });
  });

  describe("f validator", () => {
    test("given an invalid type returns false", () => {
      const expected = false;
      const fValues = [undefined, null, NaN, 123, {}, []];
      fValues.forEach((f) => {
        const actual = fFunc(f);
        expect(actual).toEqual(expected);
      });
    });

    test("given a value not within the Directions list returns false", () => {
      const expected = false;
      const actual = fFunc("wrongValue");
      expect(actual).toEqual(expected);
    });

    test("given a correct type and value within the Directions list returns true", () => {
      const expected = true;
      Directions.forEach((f) => {
        const actual = fFunc(f);
        expect(actual).toEqual(expected);
      });
    });
  });

  describe("cmd validator", () => {
    test("given an invalid type returns false", () => {
      const expected = false;
      const cmdValues = [undefined, null, NaN, 123, {}, []];
      cmdValues.forEach((cmd) => {
        const actual = cmdFunc(cmd);
        expect(actual).toEqual(expected);
      });
    });

    test("given a value not within the Commands list returns false", () => {
      const expected = false;
      const actual = cmdFunc("report");
      expect(actual).toEqual(expected);
    });

    test("given a correct type and value within the Commands list returns true", () => {
      const expected = true;
      Commands.forEach((f) => {
        const actual = cmdFunc(f);
        expect(actual).toEqual(expected);
      });
    });
  });
});
