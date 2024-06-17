const ShoppingCart = require("./shoppping-cart");
const cart = new ShoppingCart();

/**
 * This function starts the shopping process by adding products to the cart,
 * calculating the cart state, and printing the results to the console.
 *
 */
async function startShopping() {
  // Start adding products

  await cart.addProduct("cornflakes", 1);
  await cart.addProduct("cornflakes", 1);
  await cart.addProduct("weetabix", 1);

  await cart.updateQuantity("cornflakes", 3, "add");
  await cart.updateQuantity("cornflakes", 3, "remove");

  // Get the total state of products
  const cartState = cart.calculateCartState();

  console.table(cartState.items);
  console.log("Cart Subtotal:", cartState.subtotal);
  console.log("Tax Payable:", cartState.tax);
  console.log("Total Payable:", cartState.total);
}

startShopping();
