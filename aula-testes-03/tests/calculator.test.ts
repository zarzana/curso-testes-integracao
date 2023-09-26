import calculator from "../src/calculator";

describe("basic operations testing", () => {
  it("sum", () => {
    expect(calculator.sum(4, 2)).toBe(6);
  });
  it("subtraction", () => {
    expect(calculator.sub(4, 2)).toBe(2);
  });
  it("division", () => {
    expect(calculator.div(4, 2)).toBe(2);
  });
  it("multiplication", () => {
    expect(calculator.mul(4, 2)).toBe(8);
  });
});