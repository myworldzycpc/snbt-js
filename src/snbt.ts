const gettype = Object.prototype.toString;

export function changeToFloat(val: number): number | string {
    if ((val / 1).toString().includes(".")) {
        return (val / 1);
    } else {
        return (val / 1).toFixed(1);
    };
};

export type HighlightType = "key" | "str" | "num" | "bool" | "unit";

export function highlightCode(text: string, type: HighlightType | string): string {
    if (type == "key") {
        return `<span style="color:aqua">${text}</span>`
    } else if (type == "str") {
        return `<span style="color:rgb(84,351,84)">${text}</span>`
    } else if (type == "num") {
        return `<span style="color:orange">${text}</span>`
    } else if (type == "bool") {
        return `<span style="color:yellow">${text}</span>`
    } else if (type == "unit") {
        return `<span style="color:red">${text}</span>`
    }
    return text;
}

export abstract class NbtValue {
    abstract text(ispretty?: boolean): string;
}

type Path = string | number;

interface PathAccessible extends NbtValue {
    get(path: Path | Path[]): NbtValue | undefined;
    get(...path: Path[]): NbtValue | undefined;
    set(index: Path | Path[], value: NbtValue): void;
}

export class NbtObject extends NbtValue {
    childs: Record<string, NbtValue>;

    constructor(childsal?: Record<string, NbtValue>) {
        super();
        this.childs = {};
        if (childsal) {
            for (const index in childsal) {
                this.addChild(index, childsal[index]);
            }
        }
    }

    addChild(key: string, value: NbtValue): void {
        this.childs[key] = value;
    };

    isempty(): boolean {
        return (Object.keys(this.childs).length == 0 ? true : false);
    };

    get(path: Path | Path[]): NbtValue | undefined;
    get(...path: Path[]): NbtValue | undefined;
    get(...args: any[]): NbtValue | undefined {
        let pathArgs: Path[];
        if (Array.isArray(args[0])) {
            pathArgs = args[0];
        } else {
            pathArgs = args;
        }
        if (pathArgs.length == 1) {
            pathArgs = parsePath(pathArgs[0])
        }
        if (pathArgs.length == 1) {
            return this.childs[pathArgs[0] as string];
        } else if (pathArgs.length > 1) {
            const child = this.childs[pathArgs[0] as string];
            if (child === undefined) {
                return undefined;
            }
            return (child as PathAccessible).get(pathArgs.slice(1));
        } else {
            return this;
        };
    };

    set(index: Path | Path[], value: NbtValue): void {
        if (typeof index === "string" || typeof index === "number") {
            this.childs[index as string] = value;
        } else if (Array.isArray(index)) {
            if (index.length == 1) {
                this.childs[index[0] as string] = value;
            } else if (index.length > 1) {
                const parent = this.get(index.slice(0, -1));
                if (parent !== undefined) {
                    (parent as PathAccessible).set(index.slice(-1), value);
                }
            };
        };
    };

    text(ispretty?: boolean): string {
        const tl: string[] = [];
        for (const i in this.childs) {
            tl.push(`${ispretty ? highlightCode(i, "key") : i}: ${this.childs[i].text(ispretty)}`);
        };
        return `{${tl.join(", ")}}`;
    };
};

export class NbtList extends NbtValue {
    childs: NbtValue[];

    constructor(childsal?: NbtValue[]) {
        super();
        this.childs = [];
        if (childsal) {
            for (const value of childsal) {
                this.addChild(value);
            }
        }
    }

    addChild(value: NbtValue): void {
        this.childs.push(value)
    };

    isempty(): boolean {
        return (this.childs.length == 0 ? true : false);
    };

    get(path: Path | Path[]): NbtValue | undefined;
    get(...path: Path[]): NbtValue | undefined;
    get(...args: any[]): NbtValue | undefined {
        let pathArgs: Path[];
        if (Array.isArray(args[0])) {
            pathArgs = args[0];
        } else {
            pathArgs = args;
        }
        if (pathArgs.length == 1) {
            pathArgs = parsePath(pathArgs[0])
        }
        if (pathArgs.length == 1) {
            return this.childs[pathArgs[0] as number];
        } else if (pathArgs.length > 1) {
            const child = this.childs[pathArgs[0] as number];
            if (child === undefined) {
                return undefined;
            }
            return (child as PathAccessible).get(pathArgs.slice(1));
        } else {
            return this;
        };
    };

    set(index: Path | Path[], value: NbtValue): void {
        if (typeof index === "string" || typeof index === "number") {
            this.childs[index as number] = value;
        } else if (Array.isArray(index)) {
            if (index.length == 1) {
                this.childs[index[0] as number] = value;
            } else if (index.length > 1) {
                const parent = this.get(index.slice(0, -1));
                if (parent !== undefined) {
                    (parent as PathAccessible).set(index.slice(-1), value);
                }
            };
        };
    };

    text(ispretty?: boolean): string {
        const tl: string[] = [];
        for (let i = 0; i < this.childs.length; i++) {
            tl.push(this.childs[i].text(ispretty));
        }
        return `[${tl.join(", ")}]`;
    };
};

abstract class NbtNumberArray extends NbtValue {
    childs: NbtNumber[] = [];
    readonly unit: string;
    protected readonly label: string;

    constructor(unit: string, label: string, childsal?: NbtNumber[]) {
        super();
        this.unit = unit;
        this.label = label;
        if (childsal) {
            for (const value of childsal) {
                this.addChild(value);
            }
        }
    }

    protected validateValue(value: NbtNumber): void {
        if (!(value instanceof NbtNumber && value.unit === this.unit)) {
            const unitDesc = this.unit === "" ? "without unit" : `with unit "${this.unit}"`;
            throw new Error(`${this.constructor.name} only accept NbtNumber ${unitDesc}`);
        }
    }

    addChild(value: NbtNumber): void {
        this.validateValue(value);
        this.childs.push(value);
    };

    isempty(): boolean {
        return (this.childs.length == 0 ? true : false);
    };

    get(path: Path | Path[]): NbtValue | undefined;
    get(...path: Path[]): NbtValue | undefined;
    get(...args: any[]): NbtValue | undefined {
        let pathArgs: Path[];
        if (Array.isArray(args[0])) {
            pathArgs = args[0];
        } else {
            pathArgs = args;
        }
        if (pathArgs.length == 1) {
            pathArgs = parsePath(pathArgs[0])
        }
        if (pathArgs.length == 1) {
            return this.childs[pathArgs[0] as number];
        } else if (pathArgs.length > 1) {
            throw new Error(`${this.constructor.name} only accept one index`)
        } else {
            return this;
        };
    };

    set(index: Path | Path[], value: NbtNumber): void {
        const indices = Array.isArray(index) ? index : [index];
        if (indices.length == 1) {
            this.validateValue(value);
            this.childs[indices[0] as number] = value;
        } else if (indices.length > 1) {
            throw new Error(`${this.constructor.name} only accept one index`)
        };
    };

    text(ispretty?: boolean): string {
        const tl: string[] = [];
        for (let i = 0; i < this.childs.length; i++) {
            tl.push(this.childs[i].text(ispretty));
        }
        return `[${this.label}; ${tl.join(", ")}]`;
    };
};

export class NbtIntArray extends NbtNumberArray {
    constructor(childsal?: NbtNumber[]) {
        super("", "I", childsal);
    }
};

export class NbtLongArray extends NbtNumberArray {
    constructor(childsal?: NbtNumber[]) {
        super("l", "L", childsal);
    }
};

export class NbtByteArray extends NbtNumberArray {
    constructor(childsal?: NbtNumber[]) {
        super("b", "B", childsal);
    }
};

export class NbtNumber extends NbtValue {
    value: number;
    unit: string;

    constructor(value: number, unit = "") {
        super();
        unit = unit.toLowerCase();
        if (unit == "b") {
            if (Math.round(value) > 127) {
                this.value = 127;
            } else if (Math.round(value) < -128) {
                this.value = -128;
            } else {
                this.value = Math.round(value);
            }

        } else if (unit == "s") {
            if (Math.round(value) > 32767) {
                this.value = 32767;
            } else if (Math.round(value) < -32768) {
                this.value = -32768;
            } else {
                this.value = Math.round(value);
            }
        } else if (unit == "l") {
            if (BigInt(Math.round(value)) > 9223372036854775807n) {
                this.value = Number(9223372036854775807n);
            } else if (BigInt(Math.round(value)) < -9223372036854775808n) {
                this.value = Number(-9223372036854775808n);
            } else {
                this.value = Math.round(value);
            }
        } else if (unit == "d") {
            this.value = changeToFloat(value) as number;
        } else if (unit == "f") {
            this.value = changeToFloat(value) as number;
        } else if (unit == "") {
            this.value = Math.round(value);
        } else {
            this.value = value;
        };
        this.unit = unit;
    }

    text(ispretty?: boolean): string {
        if (ispretty) {
            return `${highlightCode(this.value.toString(), "num")}${this.unit ? highlightCode(this.unit, "unit") : ""}`
        } else {
            return `${this.value}${this.unit ? this.unit : ""}`
        };
    };
};

export class NbtString extends NbtValue {
    value: string;

    constructor(value: string) {
        super();
        this.value = value;
    }

    text(ispretty?: boolean): string {
        // 转义特殊字符
        const escapedValue = this.value
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/\t/g, "\\t");

        if (ispretty) {
            return highlightCode(`'${escapedValue}'`, "str");
        } else {
            return `'${escapedValue}'`;
        }
    };
};

export class NbtBool extends NbtValue {
    value: boolean;

    constructor(value: unknown) {
        super();
        this.value = !!value;
    }

    text(ispretty?: boolean): string {
        if (ispretty) {
            return highlightCode(`${this.value}`, "bool")
        } else {
            return `${this.value}`
        };
    };
};

export class NbtNull extends NbtValue {
    value: null;

    constructor() {
        super();
        this.value = null;
    }

    text(ispretty?: boolean): string {
        if (ispretty) {
            return highlightCode("null", "bool"); // 使用布尔值的样式
        } else {
            return "null";
        }
    };
}

export function arrangementNbt(str: string): string {
    str = str.replace(/(: *)([0-9\.]+)([bfdis])/g, '$1new NbtNumber($2,"$3")');
    str = str.replace(/(, *)([0-9\.]+)([bfdis])( *[,\]])/g, '$1new NbtNumber($2,"$3")$4');
    str = str.replace(/(\[ *)([0-9\.]+)([bfdis])/g, '$1new NbtNumber($2,"$3")');

    return str;
}

/**
 * 
 * @deprecated Use `parseNbtString()` instead
 * @param str 
 * @returns 
 */
export function decodeNbtStr(str: string): NbtValue {
    const jsObj = eval("obj=" + arrangementNbt(str));
    return changeObj(jsObj);
}

export function changeObj(jsObj: any): NbtValue {
    if (gettype.call(jsObj) == "[object String]") {
        return new NbtString(jsObj);
    } else if (gettype.call(jsObj) == "[object Boolean]") {
        return new NbtBool(jsObj);
    } else if (gettype.call(jsObj) == "[object Number]") {
        return new NbtNumber(jsObj);
    } else if (gettype.call(jsObj) == "[object Object]") {
        if (jsObj instanceof NbtNumber) {
            return jsObj;
        } else {
            const a = new NbtObject();
            for (const i in jsObj) {
                a.addChild(i, changeObj(jsObj[i]))
            }
            return a;
        }
    } else if (gettype.call(jsObj) == "[object Array]") {
        const a = new NbtList();
        for (const i in jsObj) {
            a.addChild(changeObj(jsObj[i]));
        }
        return a;
    }
    throw new Error(`Unsupported type: ${gettype.call(jsObj)}`);
}

export function parsePath(path: string | number): (string | number)[] {
    if (typeof path === 'number') {
        return [path];
    }

    const tokens: (string | number)[] = [];
    let current = '';
    let inQuote = false;
    let inBracket = false;
    let hasQuoteInBracket = false;

    for (let i = 0; i < path.length; i++) {
        const char = path[i];

        if (inQuote) {
            if (char === '"') {
                inQuote = false;
                if (inBracket) {
                    hasQuoteInBracket = true;
                }
            } else {
                current += char;
            }
        } else {
            if (char === '"') {
                if (current !== '') {
                    throw new Error('Unexpected double quote');
                }
                inQuote = true;
            } else if (char === '[') {
                if (inBracket) {
                    throw new Error('Nested brackets are not allowed');
                }
                if (current !== '') {
                    tokens.push(current);
                    current = '';
                } else if (tokens.length === 0 || typeof tokens[tokens.length - 1] === 'number') {
                    throw new Error('Unexpected opening bracket');
                }
                inBracket = true;
                hasQuoteInBracket = false;
            } else if (char === ']') {
                if (!inBracket) {
                    throw new Error('Unexpected closing bracket');
                }
                const content = current.trim();
                if (content === '') {
                    throw new Error('Empty brackets are not allowed');
                }
                if (hasQuoteInBracket) {
                    tokens.push(content);
                } else {
                    if (!/^\d+$/.test(content)) {
                        throw new Error('Brackets must contain only numbers or quoted strings');
                    }
                    tokens.push(parseInt(content, 10));
                }
                current = '';
                inBracket = false;
            } else if (char === '.') {
                if (inBracket) {
                    throw new Error('Dot not allowed inside brackets');
                }
                if (current !== '') {
                    tokens.push(current);
                    current = '';
                } else if (i === 0 || path[i - 1] === '.') {
                    throw new Error('Unexpected dot');
                }
            } else {
                if (inBracket && !hasQuoteInBracket) {
                    if (char === ' ' || char === '\t') {
                        // 允许空格
                    } else if (char >= '0' && char <= '9') {
                        current += char;
                    } else {
                        throw new Error(`Invalid character in bracket: '${char}'`);
                    }
                } else {
                    current += char;
                }
            }
        }
    }

    // 结束后的状态检查
    if (inQuote) throw new Error('Unclosed quote');
    if (inBracket) throw new Error('Unclosed bracket');
    if (current !== '') tokens.push(current);

    return tokens;
}

export function parseNbtString<V extends NbtValue = NbtValue>(str: string): V {
    let index = 0;
    const length = str.length;

    // 确保整个字符串被解析
    function ensureEnd() {
        skipWhitespace();
        if (index < length) {
            throw new Error(`Unexpected character: '${str[index]}'. Expected end of input.`);
        }
    }

    function parseValue(): NbtValue {
        skipWhitespace();
        if (index >= length) {
            throw new Error("Unexpected end of input");
        }

        const char = str[index];

        if (char === '{') {
            const obj = parseObject();
            return obj;
        } else if (char === '[') {
            const arr = parseArray();
            return arr;
        } else if (char === "'" || char === '"') {
            return parseString(char);
        } else if (/[0-9-]/.test(char)) {
            return parseNumber();
        } else if (char === 't' && index + 4 <= length && str.substr(index, 4) === "true") {
            index += 4;
            return new NbtBool(true);
        } else if (char === 'f' && index + 5 <= length && str.substr(index, 5) === "false") {
            index += 5;
            return new NbtBool(false);
        } else if (char === 'n' && index + 4 <= length && str.substr(index, 4) === "null") {
            index += 4;
            return new NbtNull();
        }
        throw new Error(`Unexpected character: ${char}`);
    }

    function parseObject(): NbtObject {
        index++; // 跳过 '{'
        const obj = new NbtObject();
        let expectComma = false;

        while (index < length) {
            skipWhitespace();

            // 检查是否结束
            if (str[index] === '}') {
                index++;
                return obj;
            }

            // 检查逗号分隔符
            if (expectComma) {
                if (str[index] === ',') {
                    index++;
                    skipWhitespace();
                    // 允许尾随逗号: 检查逗号后是否直接是结束符
                    if (str[index] === '}') continue;
                } else {
                    throw new Error(`Expected comma`);
                }
            }

            const { key, quoted } = parseKey();
            skipWhitespace();

            // 检查键是否以数字开头（非引号包裹时）
            if (!quoted && /^\d/.test(key)) {
                throw new Error(`Key cannot start with a digit: ${key}`);
            }

            if (str[index] !== ':') {
                throw new Error(`Expected colon`);
            }
            index++; // 跳过 ':'
            skipWhitespace();

            const value = parseValue();
            obj.addChild(key, value);

            expectComma = true; // 下一个元素前需要逗号
            skipWhitespace();
        }
        throw new Error("Unterminated object");
    }

    function parseArray(): NbtValue {
        index++; // 跳过 '['
        // 检查是否为类型化数组（B; / I; / L;）
        skipWhitespace();
        const typedArrayCtors: Record<string, new () => NbtByteArray | NbtIntArray | NbtLongArray> = { B: NbtByteArray, I: NbtIntArray, L: NbtLongArray };
        let arr: NbtList | NbtByteArray | NbtIntArray | NbtLongArray;
        const TypedCtor = typedArrayCtors[str[index]];
        if (TypedCtor) {
            index++;
            skipWhitespace();
            if (str[index] !== ';') {
                throw new Error(`Expected semicolon`);
            }
            index++;
            arr = new TypedCtor();
        } else {
            arr = new NbtList();
        }

        let expectComma = false;

        while (index < length) {
            skipWhitespace();

            // 检查是否结束
            if (str[index] === ']') {
                index++;
                return arr;
            }

            // 检查逗号分隔符
            if (expectComma) {
                if (str[index] === ',') {
                    index++;
                    skipWhitespace();
                    // 允许尾随逗号: 检查逗号后是否直接是结束符
                    if (str[index] === ']') continue;
                } else {
                    throw new Error(`Expected comma`);
                }
            }

            const value = parseValue();
            arr.addChild(value as NbtNumber);

            expectComma = true; // 下一个元素前需要逗号
            skipWhitespace();
        }
        throw new Error("Unterminated array");
    }

    function parseString(quoteChar: string): NbtString {
        index++; // 跳过开头的引号
        let result = "";
        let escaped = false;

        while (index < length) {
            const char = str[index++];

            if (escaped) {
                // 处理转义字符
                switch (char) {
                    case 'n': result += '\n'; break;
                    case 'r': result += '\r'; break;
                    case 't': result += '\t'; break;
                    case 'b': result += '\b'; break;
                    case 'f': result += '\f'; break;
                    case 'v': result += '\v'; break;
                    case '0': result += '\0'; break;
                    case '\\': result += '\\'; break;
                    case "'": result += "'"; break;
                    case '"': result += '"'; break;
                    case 'u':
                        // 处理Unicode转义：\uXXXX
                        if (index + 4 > length) {
                            throw new Error("Incomplete Unicode escape sequence");
                        }
                        const hex = str.substring(index, index + 4);
                        if (!/^[0-9a-fA-F]{4}$/.test(hex)) {
                            throw new Error(`Invalid Unicode escape: \\u${hex}`);
                        }
                        result += String.fromCharCode(parseInt(hex, 16));
                        index += 4;
                        break;
                    case 'x':
                        // 处理十六进制转义：\xXX
                        if (index + 2 > length) {
                            throw new Error("Incomplete hexadecimal escape sequence");
                        }
                        const hexByte = str.substring(index, index + 2);
                        if (!/^[0-9a-fA-F]{2}$/.test(hexByte)) {
                            throw new Error(`Invalid hexadecimal escape: \\x${hexByte}`);
                        }
                        result += String.fromCharCode(parseInt(hexByte, 16));
                        index += 2;
                        break;
                    default:
                        // 处理未知转义序列 - 保留原样
                        result += '\\' + char;
                }
                escaped = false;
            } else if (char === "\\") {
                escaped = true;
            } else if (char === quoteChar) {
                return new NbtString(result);
            } else {
                result += char;
            }
        }
        throw new Error("Unterminated string");
    }

    function parseNumber(): NbtNumber {
        let start = index;
        // 匹配数字（包括负号、小数点和科学计数法）
        if (str[index] === '-') {
            index++;
        }

        // 整数部分
        while (index < length && /[0-9]/.test(str[index])) {
            index++;
        }

        // 小数部分
        if (str[index] === '.') {
            index++;
            while (index < length && /[0-9]/.test(str[index])) {
                index++;
            }
        }

        // 指数部分
        if (/[eE]/.test(str[index])) {
            index++;
            if (/[+-]/.test(str[index])) {
                index++;
            }
            while (index < length && /[0-9]/.test(str[index])) {
                index++;
            }
        }

        const numStr = str.substring(start, index);
        let unit = "";

        // 检查单位后缀
        if (index < length && /[bfdisl]/i.test(str[index])) {
            unit = str[index++];
        }

        // 验证数字格式
        if (!/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(numStr)) {
            throw new Error(`Invalid number format: ${numStr}`);
        }

        const numValue = parseFloat(numStr);
        if (isNaN(numValue)) {
            throw new Error(`Invalid number: ${numStr}`);
        }

        return new NbtNumber(numValue, unit);
    }

    function parseKey(): { key: string; quoted: boolean } {
        skipWhitespace();
        if (index >= length) {
            throw new Error("Unexpected end of input while parsing key");
        }

        // 键可以是字符串(单/双引号)或标识符
        if (str[index] === "'" || str[index] === '"') {
            const quote = str[index];
            index++;
            return { key: parseStringContent(quote), quoted: true };
        }

        // 标识符键：允许Unicode字符（包括中文）
        let key = "";
        while (index < length) {
            const char = str[index];
            // 允许Unicode字符（包括中文）、字母、数字、下划线、$
            if (!/\s/.test(char) && !/[{}[\]:,]/.test(char)) {
                key += char;
                index++;
            } else {
                break;
            }
        }

        if (!key) {
            throw new Error("Empty key is not allowed");
        }

        return { key, quoted: false };
    }

    // 辅助函数：解析字符串内容（用于键和值）
    function parseStringContent(quoteChar: string): string {
        let result = "";
        let escaped = false;

        while (index < length) {
            const char = str[index++];

            if (escaped) {
                // 处理转义字符
                switch (char) {
                    case 'n': result += '\n'; break;
                    case 'r': result += '\r'; break;
                    case 't': result += '\t'; break;
                    case 'b': result += '\b'; break;
                    case 'f': result += '\f'; break;
                    case 'v': result += '\v'; break;
                    case '0': result += '\0'; break;
                    case '\\': result += '\\'; break;
                    case "'": result += "'"; break;
                    case '"': result += '"'; break;
                    case 'u':
                        // 处理Unicode转义：\uXXXX
                        if (index + 4 > length) {
                            throw new Error("Incomplete Unicode escape sequence");
                        }
                        const hex = str.substring(index, index + 4);
                        if (!/^[0-9a-fA-F]{4}$/.test(hex)) {
                            throw new Error(`Invalid Unicode escape: \\u${hex}`);
                        }
                        result += String.fromCharCode(parseInt(hex, 16));
                        index += 4;
                        break;
                    case 'x':
                        // 处理十六进制转义：\xXX
                        if (index + 2 > length) {
                            throw new Error("Incomplete hexadecimal escape sequence");
                        }
                        const hexByte = str.substring(index, index + 2);
                        if (!/^[0-9a-fA-F]{2}$/.test(hexByte)) {
                            throw new Error(`Invalid hexadecimal escape: \\x${hexByte}`);
                        }
                        result += String.fromCharCode(parseInt(hexByte, 16));
                        index += 2;
                        break;
                    default:
                        // 处理未知转义序列 - 保留原样
                        result += '\\' + char;
                }
                escaped = false;
            } else if (char === "\\") {
                escaped = true;
            } else if (char === quoteChar) {
                return result;
            } else {
                result += char;
            }
        }
        throw new Error("Unterminated string");
    }

    function skipWhitespace() {
        while (index < length && /\s/.test(str[index])) {
            index++;
        }
    }

    try {
        const value = parseValue();
        ensureEnd();
        return value as V;
    } catch (e) {
        // 添加位置信息
        // context: before>>e<<after
        const context = str.substring(Math.max(0, index - 10), index) + ">>" + (str[index] || "") + "<<" + str.substring(index + 1, index + 10);
        throw new Error(`${(e as Error).message} at position ${index}. Context: ...${context}...`);
    }
}
