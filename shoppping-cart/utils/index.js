function getProductLabelsWithTotal(products = {}) {
  return Object.entries(products).map(([_, { quantity, product }]) => {
    return `Cart contains ${quantity} x ${product.title}`;
  });
}

function roundToDecimal(number, decimals = 2) {
  return Number(number.toFixed(decimals));
}

module.exports = {
  roundToDecimal,
  getProductLabelsWithTotal,
};
