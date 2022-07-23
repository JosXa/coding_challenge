const { createStatement } = require("./createStatement")
const plays = require("./plays.json")
const invoices = require("./invoices.json")

console.log(createStatement(invoices[0], plays));
