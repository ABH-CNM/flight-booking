module.exports = {
  production: {
    dbUri: "mongodb://flightbooking:1234qwer@ds031257.mlab.com:31257/flight-booking",
    port: 80
  },
  development: {
    dbUri: "mongodb://localhost/flight-booking",
    port: 3000
  },
  test: {
    dbUri: "mongodb://localhost/flight-booking-test",
    port: 3001
  }
};