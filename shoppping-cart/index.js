const axios = require("axios");
const configuration = require("../config/configuration");
const { getProductLabelsWithTotal, roundToDecimal } = require("./utils");
const { fetchProductDetails } = require("./Services");
const addProductURl = `${configuration.domain}${configuration.productEndpoint}`;

/* This class represents a shopping cart that can be used to manage products, calculate taxes, amount and totals. */
class ShoppingCart {
  constructor() {
    this.cart = {};
    this.taxRate = configuration.taxRate / 100;
  }

  /* This function adds a product to the cart or updates the quantity if the product already exists. */
  async addProduct(productName, quantity) {
    // Update the quantity
    if (this.cart[productName])
      return this.updateQuantity(productName, quantity, "add");

    try {
      // Fetch product details from the API
      const product = await fetchProductDetails(productName);
      this.updateCart(productName, product, quantity);
      return true;
    } catch (error) {
      console.error("Error fetching product details:", error.message);
      return false;
    }
  }

  updateCart(productName, product, quantity) {
    if (this.cart[productName]) {
      this.updateQuantity(productName, quantity, "add"); // Product is already in cart, just update the quantity
    } else {
      // Add item to the cart
      this.cart[productName] = {
        product,
        quantity,
      };
    }
  }

  updateQuantity(productName, quantity, operation) {
     // Validate product and operation
    if (!this.isProductExist(productName) || !['add', 'remove'].includes(operation) || quantity <= 0) {
      return false;
    }

    const { product, quantity: existingQuantity } = this.cart[productName];

    if (operation === "add") {
      this.cart[productName].quantity = existingQuantity + quantity;
    } else if (operation === "remove") {
      this.cart[productName].quantity = existingQuantity - quantity;
    }

    // Delete the product on zero or less quantity
    if (this.cart[productName].quantity <= 0) {
      delete this.cart[productName];
    }
  }

  getSubTotal() {
    return Object.values(this.cart).reduce((total, item) => {
      return total + item.quantity * item.product.price;
    }, 0);
  }

  getTax() {
    return roundToDecimal(this.getSubTotal() * this.taxRate);
  }

  getTotal() {
    return roundToDecimal(this.getSubTotal() + Number(this.getTax()));
  }

  /* This function calculates and returns the state of the cart, including the items, subtotal, tax, and total. */
  calculateCartState() {
    return {
      items: getProductLabelsWithTotal(this.cart),
      subtotal: this.getSubTotal(),
      tax: this.getTax(),
      total: this.getTotal(),
    };
  }

  isProductExist(productName) {
    return !!this.cart[productName];
  }

  clearProducts() {
    this.cart = {};
  }
}

module.exports = ShoppingCart;
