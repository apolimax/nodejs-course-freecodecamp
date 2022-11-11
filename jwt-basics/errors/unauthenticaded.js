const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-error");

class Unathenticaded extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = Unathenticaded;
