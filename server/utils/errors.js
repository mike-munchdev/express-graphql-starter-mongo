module.exports.convertError = (e) => {
  return { message: e.message || String(e) };
};
