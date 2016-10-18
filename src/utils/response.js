const STATUS_SUCCESS = 'success';
const STATUS_ERROR = 'error';
const STATUS_FAIL = 'fail';
const STATUS_INVALID_DATA = 'fail';

module.exports = {
  success: function(res, content) {
    var successContent = content || { message: 'Operation complete successfully.' };
    res.json({
      status: STATUS_SUCCESS,
      data: successContent
    });
  },
  notFound: function(res, message) {
    var notFoundMessage = message || 'Resource not found.';
    res.status(404).json({
      status: STATUS_FAIL,
      data: {
        message: notFoundMessage
      }
    });
  },
  invalidData: function(res, message) {
    var invalidDataMessage = message || 'Bad data.';
    res.status(400).json({
      status: STATUS_INVALID_DATA,
      data: {
        message: invalidDataMessage
      }
    })
  },
  internalError: function(res) {
    var errorMessage = 'Internal Server Error.';
    res.status(500).json({
      status: STATUS_ERROR,
      data: {
        message: errorMessage
      }
    });
  }
};