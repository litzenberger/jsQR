"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const png = require("upng-js");
const helpers = require("./helpers");
const decoder_1 = require("../src/decoder/decoder");
const binarizer_1 = require("../src/detector/binarizer");
const extractor_1 = require("../src/detector/extractor");
const locator_1 = require("../src/detector/locator");
((() => __awaiter(this, void 0, void 0, function* () {
    yield fs.remove(path.join("test-data", "AUTOGEN"));
    yield fs.ensureDir(path.join("test-data", "AUTOGEN", "binarized"));
    yield fs.ensureDir(path.join("test-data", "AUTOGEN", "extracted"));
    const images = (yield fs.readdir(path.join("test-data", "images"))).filter((n) => n.includes(".png"));
    const testCases = [];
    for (const imagePath of images) {
        const test = {
            binarizedPath: path.join("test-data", "AUTOGEN", "binarized", imagePath),
            decodedBytes: null,
            extractedPath: "",
            inputPath: path.join("test-data", "images", imagePath),
            location: null,
            name: imagePath,
            successful: false,
        };
        const imageData = png.decode(yield fs.readFile(test.inputPath));
        try {
            const binarized = binarizer_1.binarize(png.toRGBA8(imageData), imageData.width, imageData.height);
            yield fs.writeFile(test.binarizedPath, helpers.bitMatrixToPng(binarized));
            test.location = locator_1.locate(binarized);
            const extracted = extractor_1.extract(binarized, test.location);
            test.extractedPath = path.join("test-data", "AUTOGEN", "extracted", imagePath);
            yield fs.writeFile(test.extractedPath, helpers.bitMatrixToPng(extracted));
            test.decodedBytes = decoder_1.decode(extracted);
            test.successful = !!test.decodedBytes;
        }
        catch (e) {
            // failed to parse QR
        }
        testCases.push(test);
    }
    yield fs.writeFile(path.join("test-data", "AUTOGEN", "tests.json"), JSON.stringify(testCases, null, 2));
}))()).then(() => process.exit(0))
    .catch((e) => { throw e; });
