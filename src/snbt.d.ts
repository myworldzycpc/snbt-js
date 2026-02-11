export declare function changeToFloat(val: number): number | string;
export declare function highlightCode(text: string, type: "key" | "str" | "num" | "bool" | "unit" | string): string;

export type NbtValue = NbtObject | NbtList | NbtIntArray | NbtNumber | NbtString | NbtBool | NbtNull;

export declare class NbtObject {
  childs: Record<string, NbtValue>;
  constructor(childsal?: Record<string, NbtValue>);
  addChild(key: string, value: NbtValue): void;
  isempty(): boolean;
  /**
   * Get a child element by path.
   * @param path The path to the element (key or array of keys/indices)
   */
  get(path: string | number | (string | number)[]): NbtValue | undefined;
  get(...path: (string | number)[]): NbtValue | undefined;
  set(index: string | number | (string | number)[], value: NbtValue): void;
  text(ispretty?: boolean): string;
}

export declare class NbtList {
  childs: NbtValue[];
  constructor(childsal?: NbtValue[]);
  addChild(value: NbtValue): void;
  isempty(): boolean;
  get(path: string | number | (string | number)[]): NbtValue | undefined;
  get(...path: (string | number)[]): NbtValue | undefined;
  set(index: string | number | (string | number)[], value: NbtValue): void;
  text(ispretty?: boolean): string;
}

export declare class NbtIntArray {
  childs: NbtNumber[];
  constructor(childsal?: NbtNumber[]);
  addChild(value: NbtNumber): void;
  isempty(): boolean;
  get(path: string | number | (string | number)[]): NbtValue | undefined;
  get(...path: (string | number)[]): NbtValue | undefined;
  set(index: string | number | (string | number)[], value: NbtNumber): void;
  text(ispretty?: boolean): string;
}

export declare class NbtNumber {
  value: number;
  unit: string;
  constructor(value: number, unit?: string);
  text(ispretty?: boolean): string;
}

export declare class NbtString {
  value: string;
  constructor(value: string);
  text(ispretty?: boolean): string;
}

export declare class NbtBool {
  value: string;
  constructor(value: boolean);
  text(ispretty?: boolean): string;
}

export declare class NbtNull {
  value: null;
  constructor();
  text(ispretty?: boolean): string;
}

export declare function arrangementNbt(str: string): string;
/**
 * @deprecated Use `parseNbtString()` instead
 */
export declare function decodeNbtStr(str: string): NbtValue;
export declare function changeObj(jsObj: any): NbtValue;
export declare function parsePath(path: string | number): (string | number)[];
export declare function parseNbtString<V extends NbtValue = NbtValue>(str: string): V;
