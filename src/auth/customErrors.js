class ProcessError extends Error {
  constructor(message) {
    super(message);
  }
}
class DataError extends Error {
  constructor(message) {
    super(message);
  }
}

module.exports = { ProcessError, DataError };
