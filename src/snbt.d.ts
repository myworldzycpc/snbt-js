export declare function changeToFloat(val: number): number | string;
export declare function highlightCode(text: string, type: "key" | "str" | "num" | "bool" | "unit" | string): string;

export declare abstract class NbtValue {
  text(ispretty?: boolean): string;
}

export declare class NbtObject extends NbtValue {
  childs: Record<string, NbtValue>;
  constructor(childsal?: Record<string, NbtValue>);
  addChild(key: string, value: NbtValue): void;
  isempty(): boolean;
  /**
   * Get a child element by path.
   * @param path The path to the element (key or array of keys/indices)
   */
  get<V extends NbtValue = NbtValue>(path: string | number | (string | number)[]): V | undefined;
  get<V extends NbtValue = NbtValue>(...path: (string | number)[]): V | undefined;
  set(index: string | number | (string | number)[], value: NbtValue): void;
}

export declare class NbtList extends NbtValue {
  childs: NbtValue[];
  constructor(childsal?: NbtValue[]);
  addChild(value: NbtValue): void;
  isempty(): boolean;
  get<V extends NbtValue = NbtValue>(path: string | number | (string | number)[]): V | undefined;
  get<V extends NbtValue = NbtValue>(...path: (string | number)[]): V | undefined;
  set(index: string | number | (string | number)[], value: NbtValue): void;
}

export declare class NbtIntArray extends NbtValue {
  childs: NbtNumber[];
  constructor(childsal?: NbtNumber[]);
  addChild(value: NbtNumber): void;
  isempty(): boolean;
  get<V extends NbtValue = NbtValue>(path: string | number | (string | number)[]): V | undefined;
  get<V extends NbtValue = NbtValue>(...path: (string | number)[]): V | undefined;
  set(index: string | number | (string | number)[], value: NbtNumber): void;
}

export declare class NbtNumber extends NbtValue {
  value: number;
  unit: string;
  constructor(value: number, unit?: string);
}

export declare class NbtString extends NbtValue {
  value: string;
  constructor(value: string);
}

export declare class NbtBool extends NbtValue {
  value: string;
  constructor(value: boolean);
}

export declare class NbtNull extends NbtValue {
  value: null;
  constructor();
}

export declare function arrangementNbt(str: string): string;
/**
 * @deprecated Use `parseNbtString()` instead
 */
export declare function decodeNbtStr(str: string): NbtValue;
export declare function changeObj(jsObj: any): NbtValue;
export declare function parsePath(path: string | number): (string | number)[];
export declare function parseNbtString<V extends NbtValue = NbtValue>(str: string): V;
