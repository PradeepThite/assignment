const ShoppingCart = require("../shoppping-cart");
const axios = require("axios");
jest.mock("axios");

describe("ShoppingCart", () => {
  let shopping;

  beforeEach(() => {
    shopping = new ShoppingCart();
  });

  describe("addProduct", () => {
    it("should add a valid product", async () => {
      const mockResponse = {
        status: 200,
        data: { price: 2.99, title: "Product 1" },
      };
      axios.get.mockResolvedValueOnce(mockResponse);
      const result = await shopping.addProduct("product1", 2);
      expect(result).toBe(true);
      expect(shopping.cart).toHaveProperty("product1");
    });

    it("should not add an invalid product", async () => {
      axios.get.mockRejectedValueOnce(new Error("Product not found"));
      const result = await shopping.addProduct("invalidProduct", 1);
      expect(result).toBe(false);
      expect(shopping.cart).toEqual({});
    });
  });

  describe("updateQuantity", () => {
    beforeEach(async () => {
      const mockResponse = {
        status: 200,
        data: { price: 2.99, title: "Product 1" },
      };
      axios.get.mockResolvedValueOnce(mockResponse);
      await shopping.addProduct("product1", 2);
    });

    it("should add quantity to an existing product", () => {
      shopping.updateQuantity("product1", 2, "add");
      expect(shopping.cart.product1.quantity).toBe(4);
    });

    it("should remove quantity from an existing product", () => {
      shopping.updateQuantity("product1", 1, "remove");
      expect(shopping.cart.product1.quantity).toBe(1);
    });

    it("should remove the product when quantity is zero", () => {
      shopping.updateQuantity("product1", 2, "remove");
      expect(shopping.cart).toEqual({});
    });
  });

  describe("updateCart", () => {
  
    it("should add a new product to the shopping", () => {
      const productName = "Product A";
      const product = { id: 1, name: "Product A" };
      const quantity = 2;

      shopping.updateCart(productName, product, quantity);

      expect(shopping.cart[productName]).toEqual({
        product,
        quantity,
      });
    });

    it("should update the quantity of an existing product in the shopping", () => {
      const productName = "Product B";
      const product = { id: 2, name: "Product B" };
      const quantity = 3;

      shopping.cart[productName] = {
        product,
        quantity: 1,
      };

      shopping.updateCart(productName, product, quantity);

      expect(shopping.cart[productName]).toEqual({
        product,
        quantity: 4,
      });
    });
  });

  describe("getSubTotal", () => {
    beforeEach(async () => {
      const mockResponse1 = {
        status: 200,
        data: { price: 2.99, title: "Product 1" },
      };
      const mockResponse2 = {
        status: 200,
        data: { price: 3.49, title: "Product 2" },
      };
      axios.get
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2);
      await shopping.addProduct("product1", 2);
      await shopping.addProduct("product2", 1);
    });

    it("should calculate the correct subtotal for multiple products", () => {
      const result = shopping.getSubTotal();
      expect(result).toBe(9.47);
    });

    it("should return 0 for an empty shopping", () => {
      shopping.cart = {};
      const result = shopping.getSubTotal();
      expect(result).toBe(0);
    });
  });

  describe("getTax", () => {
    beforeEach(async () => {
      const mockResponse = {
        status: 200,
        data: { price: 2.99, title: "Product 1" },
      };
      axios.get.mockResolvedValueOnce(mockResponse);
      await shopping.addProduct("product1", 2);
    });

    it("should calculate the correct tax for a non-zero subtotal", () => {
      const result = shopping.getTax();
      expect(result).toBe(0.75);
    });

    it("should return 0 for an empty shopping", () => {
      shopping.cart = {};
      const result = shopping.getTax();
      expect(result).toBe(0);
    });
  });

  describe("getTotal", () => {
    beforeEach(async () => {
      const mockResponse1 = {
        status: 200,
        data: { price: 2.99, title: "Product 1" },
      };
      const mockResponse2 = {
        status: 200,
        data: { price: 3.49, title: "Product 2" },
      };
      axios.get
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2);
      await shopping.addProduct("product1", 2);
      await shopping.addProduct("product2", 1);
    });

    it("should calculate the correct total for multiple products", () => {
      const result = shopping.getTotal();
      expect(result).toBe(10.65);
    });

    it("should return 0 for an empty shopping", () => {
      shopping.cart = {};
      const result = shopping.getTotal();
      expect(result).toBe(0);
    });
  });

  describe("calculateCartState", () => {
    beforeEach(async () => {
      const mockResponse1 = {
        status: 200,
        data: { price: 2.99, title: "Product 1" },
      };
      const mockResponse2 = {
        status: 200,
        data: { price: 3.49, title: "Product 2" },
      };
      axios.get
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2);
      await shopping.addProduct("product1", 2);
      await shopping.addProduct("product2", 1);
    });

    it("should calculate the correct shopping state for multiple products", () => {
      const result = shopping.calculateCartState();
      expect(result.items).toEqual([
        "Cart contains 2 x Product 1",
        "Cart contains 1 x Product 2",
      ]);
      expect(result.subtotal).toBe(9.47);
      expect(result.tax).toBe(1.18);
      expect(result.total).toBe(10.65);
    });

    it("should return an empty shopping state for an empty shopping", () => {
      shopping.cart = {};
      const result = shopping.calculateCartState();
      expect(result.items).toEqual([]);
      expect(result.subtotal).toBe(0);
      expect(result.tax).toBe(0);
      expect(result.total).toBe(0);
    });
  });

  describe("isProductExist", () => {
    beforeEach(async () => {
      const mockResponse = {
        status: 200,
        data: { price: 2.99, title: "Product 1" },
      };
      axios.get.mockResolvedValueOnce(mockResponse);
      await shopping.addProduct("product1", 2);
    });

    it("should return true for an existing product", () => {
      const result = shopping.isProductExist("product1");
      expect(result).toBe(true);
    });

    it("should return false for a non-existing product", () => {
      const result = shopping.isProductExist("invalidProduct");
      expect(result).toBe(false);
    });
  });
});
