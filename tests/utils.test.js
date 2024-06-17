const {
  getProductLabelsWithTotal,
  roundToDecimal,
} = require("../shoppping-cart/utils");

describe("utils", () => {
  describe("getProductLabelsWithTotal", () => {
    it("should return an empty array for an empty object", () => {
      const products = {};
      const result = getProductLabelsWithTotal(products);
      expect(result).toEqual([]);
    });

    it("should return an array of formatted product labels", () => {
      const products = {
        product1: { product: { title: "Product 1" }, quantity: 2 },
        product2: { product: { title: "Product 2" }, quantity: 1 },
      };
      const result = getProductLabelsWithTotal(products);
      expect(result).toEqual([
        "Cart contains 2 x Product 1",
        "Cart contains 1 x Product 2",
      ]);
    });
  });

  describe("roundToDecimal", () => {
    it("should return the same number for a number with no decimal places", () => {
      const number = 42;
      const result = roundToDecimal(number);
      expect(result).toBe(42);
    });

    it("should round a number to the specified number of decimal places", () => {
      const number = 3.14159;
      const result = roundToDecimal(number, 2);
      expect(result).toBe(3.14);
    });
  });
});
