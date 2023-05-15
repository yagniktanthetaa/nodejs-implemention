var cryptoJS = require("crypto-js");

const encodeData = (data) => {
  try {
    const plainData = JSON.stringify(data);
    const cipherData = cryptoJS.AES.encrypt(
      plainData,
      process.env.CRYPTO_SECRET_KEY
    ).toString();
    return cipherData;
  } catch {
    return "";
  }
};

const decodeData = (data) => {
  try {
    const bytes = cryptoJS.AES.decrypt(data, process.env.CRYPTO_SECRET_KEY);
    const plainData = JSON.parse(bytes.toString(cryptoJS.enc.Utf8));
    return plainData;
  } catch {
    return {};
  }
};

const encodeResData = (body, req, res) => {
  try {
    const plainData = JSON.stringify(body);
    const cipherData = cryptoJS.AES.encrypt(
      plainData,
      process.env.CRYPTO_SECRET_KEY
    ).toString();
    return { data: cipherData };
  } catch (e) {
    console.log("🚀 ~ encodeResData ~ e:", e);
    return {};
  }
};

const decodeReqData = (req, res, next) => {
  try {
    if (!req.body || !req.body.data) {
      next();
    } else {
      const bytes = cryptoJS.AES.decrypt(
        req.body.data,
        process.env.CRYPTO_SECRET_KEY
      );
      const plainData = JSON.parse(bytes.toString(cryptoJS.enc.Utf8));
      req.body = plainData;
      next();
    }
  } catch (e) {
    console.log("🚀 ~ decodeReqData ~ e:", e);
    next();
  }
};

module.exports = {
  encodeData,
  decodeData,
  encodeResData,
  decodeReqData,
};
