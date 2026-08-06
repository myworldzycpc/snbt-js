import { expect } from 'chai';
import { parseNbtString, NbtObject, NbtList, NbtString, NbtNumber, NbtLongArray, NbtByteArray } from '../src/snbt.js';

describe('NBT Parser', () => {
  it('should parse simple compound', () => {
    const result = parseNbtString<NbtObject>(`{ name: "Steve", age: 30 }`);
    expect(result).to.be.instanceOf(NbtObject);
    expect((result.get('name') as NbtString).value).to.equal('Steve');
    expect((result.get('age') as NbtNumber).value).to.equal(30);
  });

  it('should handle nested compounds', () => {
    const result = parseNbtString<NbtObject>(`{ player: { pos: [100, 64, -200] } }`);
    expect(result.get('player')).to.be.instanceOf(NbtObject);
    expect(result.get('player.pos')).to.be.instanceOf(NbtList);
  });

  it('should support all number types', () => {
    const result = parseNbtString<NbtObject>(`{ 
      byte: 127b, 
      short: 32767s, 
      int: 2147483647,
      long: 2147483648L,
      float: 3.14f,
      double: 3.1415926535d
    }`);
    
    expect((result.get('byte') as NbtNumber).value).to.equal(127);
    expect((result.get('byte') as NbtNumber).unit).to.equal('b');
  });

  it('should parse long array', () => {
    const result = parseNbtString<NbtObject>(`{
      long_array: [L;100L]
    }`);

    expect((result.get("long_array") as NbtLongArray).childs[0].value).to.equal(100);
  });

  it('should parse byte array', () => {
    const result = parseNbtString<NbtObject>(`{
      byte_array: [B;100B]
    }`);

    expect((result.get("byte_array") as NbtByteArray).childs[0].value).to.equal(100);
  });

  // 添加更多测试用例...
});
