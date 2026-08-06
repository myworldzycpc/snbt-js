import { expect } from "chai";
import { NbtNumber, NbtObject } from "../src/snbt.js";

describe('SNBT Serializer', () => {
    it('should quote unsafe keys', () => {
        const result = new NbtObject({
            "minecraft:key": new NbtNumber(1),
            "key with spaces": new NbtNumber(2),
        }).text();

        expect(result).to.equal('{"minecraft:key": 1, "key with spaces": 2}');
    });
});