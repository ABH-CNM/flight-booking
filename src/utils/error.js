module.exports = {
  internalError: function(res) {
    res.status(500).json({ error: 'Internal Server Error!' })
  }
};