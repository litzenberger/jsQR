"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const tests = JSON.parse(fs.readFileSync(path.join("test-data", "AUTOGEN", "tests.json")).toString());
exports.default = tests;
