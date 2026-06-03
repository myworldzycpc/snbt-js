import { expect } from 'chai';
import { parseNbtString, NbtObject, NbtList } from '../src/snbt.js';

describe('NBT Parser', () => {
  it('should parse simple compound', () => {
    const result = parseNbtString(`{ name: "Steve", age: 30 }`);
    expect(result).to.be.instanceOf(NbtObject);
    expect(result.get('name').value).to.equal('Steve');
    expect(result.get('age').value).to.equal(30);
  });

  it('should handle nested compounds', () => {
    const result = parseNbtString(`{ player: { pos: [100, 64, -200] } }`);
    expect(result.get('player')).to.be.instanceOf(NbtObject);
    expect(result.get('player.pos')).to.be.instanceOf(NbtList);
  });

  it('should support all number types', () => {
    const result = parseNbtString(`{ 
      byte: 127b, 
      short: 32767s, 
      int: 2147483647,
      long: 2147483648L,
      float: 3.14f,
      double: 3.1415926535d
    }`);
    
    expect(result.get('byte').value).to.equal(127);
    expect(result.get('byte').unit).to.equal('b');
  });

  it('should parse long array', () => {
    const result = parseNbtString(`{
      long_array: [L;100L]
    }`);

    expect(result.get("long_array").childs[0].value).to.equal(100);
  });

  it('should parse byte array', () => {
    const result = parseNbtString(`{
      byte_array: [B;100B]
    }`);

    expect(result.get("byte_array").childs[0].value).to.equal(100);
  });

  // 添加更多测试用例...
});
