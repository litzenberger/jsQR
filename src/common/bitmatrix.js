"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BitMatrix {
    constructor(data, width) {
        this.width = width;
        this.height = data.length / width;
        this.data = data;
    }
    static createEmpty(width, height) {
        var data = new Uint8ClampedArray(width * height);
        return new BitMatrix(data, width);
    }
    get(x, y) {
        return !!this.data[y * this.width + x];
    }
    set(x, y, v) {
        this.data[y * this.width + x] = v ? 1 : 0;
    }
    copyBit(x, y, versionBits) {
        return this.get(x, y) ? (versionBits << 1) | 0x1 : versionBits << 1;
    }
    setRegion(left, top, width, height) {
        var right = left + width;
        var bottom = top + height;
        for (var y = top; y < bottom; y++) {
            for (var x = left; x < right; x++) {
                this.set(x, y, true);
            }
        }
    }
    mirror() {
        for (var x = 0; x < this.width; x++) {
            for (var y = x + 1; y < this.height; y++) {
                if (this.get(x, y) != this.get(y, x)) {
                    this.set(x, y, !this.get(x, y));
                    this.set(y, x, !this.get(y, x));
                }
            }
        }
    }
}
exports.BitMatrix = BitMatrix;
