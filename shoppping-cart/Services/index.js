const axios = require("axios");
const configuration = require("../../config/configuration");

const addProductURl = `${configuration.domain}${configuration.productEndpoint}`;

const fetchProductDetails = async (productName) => {
  try {
    const response = await axios.get(`${addProductURl}/${productName}.json`);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Failed to fetch product details for ${productName}`);
    }
  } catch (error) {
    throw new Error(`Error fetching product details: ${error.message}`);
  }
};
module.exports = {
  fetchProductDetails,
};
