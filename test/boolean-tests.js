import { expect } from 'chai';
import { parseNbtString, NbtBool, NbtObject } from '../src/snbt.js';

describe('NbtBool Tests', () => {
  it('should store boolean value as boolean, not string', () => {
    const boolTrue = new NbtBool(true);
    const boolFalse = new NbtBool(false);
    
    expect(boolTrue.value).to.be.a('boolean');
    expect(boolTrue.value).to.equal(true);
    
    expect(boolFalse.value).to.be.a('boolean');
    expect(boolFalse.value).to.equal(false);
  });

  it('should parse true boolean from SNBT', () => {
    const result = parseNbtString('{ flag: true }');
    const flag = result.get('flag');
    
    expect(flag).to.be.instanceOf(NbtBool);
    expect(flag.value).to.be.a('boolean');
    expect(flag.value).to.equal(true);
  });

  it('should parse false boolean from SNBT', () => {
    const result = parseNbtString('{ flag: false }');
    const flag = result.get('flag');
    
    expect(flag).to.be.instanceOf(NbtBool);
    expect(flag.value).to.be.a('boolean');
    expect(flag.value).to.equal(false);
  });

  it('should convert truthy values to true', () => {
    const bool1 = new NbtBool(1);
    const bool2 = new NbtBool("yes");
    const bool3 = new NbtBool({});
    
    expect(bool1.value).to.equal(true);
    expect(bool2.value).to.equal(true);
    expect(bool3.value).to.equal(true);
  });

  it('should convert falsy values to false', () => {
    const bool1 = new NbtBool(0);
    const bool2 = new NbtBool("");
    const bool3 = new NbtBool(null);
    const bool4 = new NbtBool(undefined);
    
    expect(bool1.value).to.equal(false);
    expect(bool2.value).to.equal(false);
    expect(bool3.value).to.equal(false);
    expect(bool4.value).to.equal(false);
  });

  it('should output boolean as string in text() method', () => {
    const boolTrue = new NbtBool(true);
    const boolFalse = new NbtBool(false);
    
    expect(boolTrue.text()).to.equal('true');
    expect(boolFalse.text()).to.equal('false');
  });

  it('should handle boolean in nested objects', () => {
    const result = parseNbtString(`{
      player: {
        isAlive: true,
        isFlying: false
      }
    }`);
    
    const isAlive = result.get('player.isAlive');
    const isFlying = result.get('player.isFlying');
    
    expect(isAlive.value).to.be.a('boolean');
    expect(isAlive.value).to.equal(true);
    
    expect(isFlying.value).to.be.a('boolean');
    expect(isFlying.value).to.equal(false);
  });
});
