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
const png = require("upng-js");
const bitmatrix_1 = require("../src/common/bitmatrix");
function bitMatrixToPng(matrix) {
    const output = new Uint8ClampedArray(matrix.width * matrix.height * 4);
    for (let y = 0; y < matrix.height; y++) {
        for (let x = 0; x < matrix.width; x++) {
            const v = matrix.get(x, y);
            const i = (y * matrix.width + x) * 4;
            output[i + 0] = v ? 0x00 : 0xff;
            output[i + 1] = v ? 0x00 : 0xff;
            output[i + 2] = v ? 0x00 : 0xff;
            output[i + 3] = 0xff;
        }
    }
    return new Buffer(png.encode(output, matrix.width, matrix.height, 0));
}
exports.bitMatrixToPng = bitMatrixToPng;
function loadPng(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = png.decode(yield fs.readFile(path));
        const out = {
            data: png.toRGBA8(data),
            height: data.height,
            width: data.width,
        };
        return out;
    });
}
exports.loadPng = loadPng;
function loadBinarized(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const image = yield loadPng(path);
        const out = bitmatrix_1.BitMatrix.createEmpty(image.width, image.height);
        for (let x = 0; x < image.width; x++) {
            for (let y = 0; y < image.height; y++) {
                out.set(x, y, image.data[(y * image.width + x) * 4] === 0x00);
            }
        }
        return out;
    });
}
exports.loadBinarized = loadBinarized;
