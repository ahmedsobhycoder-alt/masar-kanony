"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printRed = printRed;
exports.printBlue = printBlue;
exports.printGreen = printGreen;
exports.printYellow = printYellow;
require("colors");
function printRed(text, value) {
    console.log(`${text} ${value}`.red);
}
function printBlue(text, value) {
    console.log(`${text} ${value}`.bgBlue);
}
function printGreen(text, value) {
    console.log(`${text} ${value}`.bgGreen);
}
function printYellow(text, value) {
    console.log(`${text} ${value}`.bgYellow);
}
