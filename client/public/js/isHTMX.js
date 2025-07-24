function isHTMX(req) {
  return req.get("HX-Request");
}

module.exports = isHTMX;
