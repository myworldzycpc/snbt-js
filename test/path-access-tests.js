import { expect } from 'chai';
import { parseNbtString, NbtObject, NbtList, NbtString, NbtNumber } from '../src/snbt.js';

describe('Path Access Tests', () => {
  describe('NbtObject.get() with non-existent paths', () => {
    it('should return undefined when accessing non-existent key', () => {
      const nbt = new NbtObject({
        'minecraft:enchantments': new NbtObject()
      });
      
      const result = nbt.get(['minecraft:enchantments', 'levels']);
      expect(result).to.be.undefined;
    });

    it('should return undefined when accessing nested non-existent path', () => {
      const nbt = parseNbtString(`{
        player: {
          name: "Steve"
        }
      }`);
      
      const result = nbt.get(['player', 'inventory', 0]);
      expect(result).to.be.undefined;
    });

    it('should return undefined when accessing non-existent top-level key', () => {
      const nbt = new NbtObject({
        name: new NbtString('Steve')
      });
      
      const result = nbt.get('age');
      expect(result).to.be.undefined;
    });

    it('should return undefined when using dot notation on non-existent path', () => {
      const nbt = parseNbtString(`{ player: { name: "Steve" } }`);
      
      const result = nbt.get('player.health');
      expect(result).to.be.undefined;
    });

    it('should return undefined when accessing deeply nested non-existent path', () => {
      const nbt = parseNbtString(`{
        level1: {
          level2: {
            level3: "value"
          }
        }
      }`);
      
      const result = nbt.get(['level1', 'level2', 'level4', 'level5']);
      expect(result).to.be.undefined;
    });
  });

  describe('NbtList.get() with non-existent paths', () => {
    it('should return undefined when accessing non-existent index in nested list', () => {
      const nbt = parseNbtString(`{
        items: [
          { id: "diamond" }
        ]
      }`);
      
      const result = nbt.get(['items', 5, 'id']);
      expect(result).to.be.undefined;
    });

    it('should return undefined when accessing property on undefined array element', () => {
      const nbt = new NbtObject({
        inventory: new NbtList([
          new NbtObject({ id: new NbtString('sword') })
        ])
      });
      
      const result = nbt.get(['inventory', 10, 'id']);
      expect(result).to.be.undefined;
    });

    it('should return undefined when list element exists but nested path does not', () => {
      const nbt = parseNbtString(`{
        items: [
          { name: "item1" },
          { name: "item2" }
        ]
      }`);
      
      const result = nbt.get(['items', 0, 'count']);
      expect(result).to.be.undefined;
    });
  });

  describe('NbtObject.set() with non-existent paths', () => {
    it('should not throw error when setting on non-existent intermediate path', () => {
      const nbt = new NbtObject({
        player: new NbtObject()
      });
      
      // This should not throw an error, but also should not set the value
      // since 'inventory' doesn't exist on the player object (parent is undefined)
      expect(() => {
        nbt.set(['player', 'inventory', 'count'], new NbtNumber(5));
      }).to.not.throw();
      
      // Verify the value was not set (because 'inventory' doesn't exist)
      const result = nbt.get(['player', 'inventory', 'count']);
      expect(result).to.be.undefined;
    });

    it('should handle setting on deeply nested non-existent path gracefully', () => {
      const nbt = parseNbtString(`{ level1: { level2: {} } }`);
      
      expect(() => {
        nbt.set(['level1', 'level2', 'level3', 'value'], new NbtString('test'));
      }).to.not.throw();
    });
  });

  describe('NbtList.set() with non-existent paths', () => {
    it('should not throw error when setting on non-existent array index path', () => {
      const nbt = new NbtObject({
        items: new NbtList([
          new NbtObject({ id: new NbtString('item1') })
        ])
      });
      
      expect(() => {
        nbt.set(['items', 5, 'id'], new NbtString('item2'));
      }).to.not.throw();
      
      // The value at index 5 should still be undefined
      const result = nbt.get(['items', 5]);
      expect(result).to.be.undefined;
    });
  });

  describe('Valid path access should still work', () => {
    it('should correctly access existing nested paths', () => {
      const nbt = parseNbtString(`{
        "minecraft:enchantments": {
          levels: {
            sharpness: 5
          }
        }
      }`);
      
      const result = nbt.get(['minecraft:enchantments', 'levels', 'sharpness']);
      expect(result).to.not.be.undefined;
      expect(result.value).to.equal(5);
    });

    it('should correctly access array elements', () => {
      const nbt = parseNbtString(`{
        items: [
          { id: "diamond", count: 5 },
          { id: "gold", count: 10 }
        ]
      }`);
      
      const result = nbt.get(['items', 1, 'id']);
      expect(result).to.not.be.undefined;
      expect(result.value).to.equal('gold');
    });

    it('should correctly set values on existing paths', () => {
      const nbt = new NbtObject({
        player: new NbtObject({
          health: new NbtNumber(20)
        })
      });
      
      nbt.set(['player', 'health'], new NbtNumber(15));
      const result = nbt.get(['player', 'health']);
      expect(result.value).to.equal(15);
    });
  });
});
