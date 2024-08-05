const crypto = require("crypto");
const axios = require("axios");

async function verifyEsewaPayment(encodedData) {
  try {
    // Decoding base64-encoded data received from eSewa
    let decodedData = Buffer.from(encodedData, "base64").toString("utf-8");
    decodedData = JSON.parse(decodedData);

    // Construct data string for hash calculation
    const data = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE},signed_field_names=${decodedData.signed_field_names}`;

    // Generate hash using secret key
    const secretKey = process.env.ESEWA_SECRET_KEY;
    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(data)
      .digest("base64");

    // Logging hash and received signature for debugging
    console.log("Generated hash:", hash);
    console.log("Received signature:", decodedData.signature);

    // Verify if the computed hash matches the received signature
    if (hash !== decodedData.signature) {
      throw { message: "Invalid Info", decodedData };
    }

    // Construct request options for verifying payment status with eSewa API
    const reqOptions = {
      url: `${process.env.ESEWA_GATEWAY_URL}/api/epay/transaction/status/`,
      method: "GET",
      params: {
        product_code: process.env.ESEWA_PRODUCT_CODE,
        total_amount: decodedData.total_amount,
        transaction_uuid: decodedData.transaction_uuid,
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    // Make GET request to eSewa API to verify payment status
    const response = await axios(reqOptions);

    // Verify the response data for completeness and correctness
    if (
      response.data.status !== "COMPLETE" ||
      response.data.transaction_uuid !== decodedData.transaction_uuid ||
      Number(response.data.total_amount) !== Number(decodedData.total_amount)
    ) {
      throw { message: "Invalid Info", decodedData };
    }

    // Return the response and decodedData if verification is successful
    return { response: response.data, decodedData };
  } catch (error) {
    throw error;
  }
}

module.exports = { verifyEsewaPayment };
