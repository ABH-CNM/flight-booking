module.exports = {
  production: {
    dbUri: process.env.MONGODB_URI,
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