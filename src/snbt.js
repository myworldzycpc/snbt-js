const gettype = Object.prototype.toString;

export function changeToFloat(val) {
    if ((val / 1).toString().includes(".")) {
        return (val / 1);
    } else {
        return (val / 1).toFixed(1);
    };
};

export function highlightCode(text, type) {
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
    };

}

export class NbtObject {
    constructor(childsal) {
        this.childs = {};
        this.addChild = function (key, value) {
            this.childs[key] = value;
        };
        this.isempty = function () {
            return (Object.keys(this.childs).length == 0 ? true : false);
        };
        this.get = function () {
            var args = Array.prototype.slice.call(arguments);
            if (gettype.call(args[0]) == "[object Array]") {
                args = args[0];
            };
            if (args.length == 1) {
                args = parsePath(args[0])
            }
            if (args.length == 1) {
                return this.childs[args[0]];
            } else if (args.length > 1) {
                var child = this.childs[args[0]];
                if (child === undefined) {
                    return undefined;
                }
                return child.get(args.slice(1));
            } else {
                return this;
            };
        };
        this.set = function (index, value) {
            if (["[object String]", "[object Number]"].includes(gettype.call(index))) {
                this.childs[index] = value;
            } else if (gettype.call(index) == "[object Array]") {
                if (index.length == 1) {
                    this.childs[index[0]] = value;
                } else if (index.length > 1) {
                    var parent = this.get(index.slice(0, -1));
                    if (parent !== undefined) {
                        parent.set(index.slice(-1), value);
                    }
                };
            };
        };
        this.text = function (ispretty) {
            var tl = [];
            for (var i in this.childs) {
                tl.push(`${ispretty ? highlightCode(i, "key") : i}: ${this.childs[i].text(ispretty)}`);
            };
            return `{${tl.join(", ")}}`;
        };
        if (childsal) {
            for (var index in childsal) {
                this.addChild(index, childsal[index])
            };
        };
    };
};

export class NbtList {
    constructor(childsal) {
        this.childs = [];
        this.addChild = function (value) {
            this.childs.push(value)
        };
        this.isempty = function () {
            return (this.childs.length == 0 ? true : false);
        };
        this.get = function () {
            var args = Array.prototype.slice.call(arguments);
            if (gettype.call(args[0]) == "[object Array]") {
                args = args[0];
            };
            if (args.length == 1) {
                args = parsePath(args[0])
            }
            if (args.length == 1) {
                return this.childs[args[0]];
            } else if (args.length > 1) {
                var child = this.childs[args[0]];
                if (child === undefined) {
                    return undefined;
                }
                return child.get(args.slice(1));
            } else {
                return this;
            };
        };
        this.set = function (index, value) {
            if (["[object String]", "[object Number]"].includes(gettype.call(index))) {
                this.childs[index] = value;
            } else if (gettype.call(index) == "[object Array]") {
                if (index.length == 1) {
                    this.childs[index[0]] = value;
                } else if (index.length > 1) {
                    var parent = this.get(index.slice(0, -1));
                    if (parent !== undefined) {
                        parent.set(index.slice(-1), value);
                    }
                };
            };
        };
        this.text = function (ispretty) {
            var tl = [];
            for (var i = 0; i < this.childs.length; i++) {
                tl.push(this.childs[i].text(ispretty));
            }
            return `[${tl.join(", ")}]`;
        };
        if (childsal) {
            for (var i = 0; i < childsal.length; i++) {
                this.addChild(childsal[i]);
            }
        };
    };
};

export class NbtIntArray {
    constructor(childsal) {
        this.childs = [];
        this.addChild = function (value) {
            if (value instanceof NbtNumber && value.unit == "") {
                this.childs.push(value)
            } else {
                throw new Error("NbtIntArray only accept NbtNumber without unit")
            }
        };
        this.isempty = function () {
            return (this.childs.length == 0 ? true : false);
        };
        this.get = function () {
            var args = Array.prototype.slice.call(arguments);
            if (gettype.call(args[0]) == "[object Array]") {
                args = args[0];
            };
            if (args.length == 1) {
                args = parsePath(args[0])
            }
            if (args.length == 1) {
                return this.childs[args[0]];
            } else if (args.length > 1) {
                throw new Error("NbtIntArray only accept one index")
            } else {
                return this;
            };
        };
        this.set = function (index, value) {
            if (index.length == 1) {
                if (value instanceof NbtNumber && value.unit == "") {
                    this.childs[index[0]] = value;
                } else {
                    throw new Error("NbtIntArray only accept NbtNumber without unit")
                }
            } else if (index.length > 1) {
                throw new Error("NbtIntArray only accept one index")
            };
        };
        this.text = function (ispretty) {
            var tl = [];
            for (var i = 0; i < this.childs.length; i++) {
                tl.push(this.childs[i].text(ispretty));
            }
            return `[I; ${tl.join(", ")}]`;
        };
        if (childsal) {
            for (var i = 0; i < childsal.length; i++) {
                this.addChild(childsal[i]);
            }
        };
    };
};

export class NbtNumber {
    constructor(value, unit = "") {
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
            if (Math.round(value) > 9223372036854775807n) {
                this.value = 9223372036854775807n;
            } else if (Math.round(value) < -9223372036854775808n) {
                this.value = -9223372036854775808n;
            } else {
                this.value = Math.round(value);
            }
        } else if (unit == "d") {
            this.value = changeToFloat(value);
        } else if (unit == "f") {
            this.value = changeToFloat(value);
        } else if (unit == "") {
            this.value = Math.round(value);
        } else {
            this.value = value;
        };
        this.unit = unit;
        this.text = function (ispretty) {
            if (ispretty) {
                return `${highlightCode(this.value.toString(), "num")}${unit ? highlightCode(this.unit, "unit") : ""}`
            } else {
                return `${this.value}${unit ? this.unit : ""}`
            };
        };
    };
};

export class NbtString {
    constructor(value) {
        this.value = value;
        this.text = function (ispretty) {
            // 转义特殊字符
            let escapedValue = this.value
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
};

export class NbtBool {
    constructor(value) {
        this.value = !!value;
        this.text = function (ispretty) {
            if (ispretty) {
                return highlightCode(`${this.value}`, "bool")
            } else {
                return `${this.value}`
            };
        };
    };
};

export class NbtNull {
    constructor() {
        this.value = null;
    }
    text = function (ispretty) {
        if (ispretty) {
            return highlightCode("null", "bool"); // 使用布尔值的样式
        } else {
            return "null";
        }
    };
}

export function arrangementNbt(str) {
    str = str.replace(/(: *)([0-9\.]+)([bfdis])/g, '$1new NbtNumber($2,"$3")');
    str = str.replace(/(, *)([0-9\.]+)([bfdis])( *[,\]])/g, '$1new NbtNumber($2,"$3")$4');
    str = str.replace(/(\[ *)([0-9\.]+)([bfdis])/g, '$1new NbtNumber($2,"$3")');

    return str;
}

/**
 * 
 * @deprecated
 * @param {*} str 
 * @returns 
 */
export function decodeNbtStr(str) {
    jsObj = eval("obj=" + arrangementNbt(str));
    return changeObj(jsObj);
}

export function changeObj(jsObj) {
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
            var a = new NbtObject();
            for (var i in jsObj) {
                a.addChild(i, changeObj(jsObj[i]))
            }
            return a;
        }
    } else if (gettype.call(jsObj) == "[object Array]") {
        var a = new NbtList();
        for (var i in jsObj) {
            a.addChild(changeObj(jsObj[i]));
        }
        return a;
    }
}

export function parsePath(path) {
    if (typeof path === 'number') {
        return [path];
    }

    const tokens = [];
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
                let content = current.trim();
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

export function parseNbtString(str) {
    let index = 0;
    const length = str.length;

    // 确保整个字符串被解析
    function ensureEnd() {
        skipWhitespace();
        if (index < length) {
            throw new Error(`Unexpected character: '${str[index]}'. Expected end of input.`);
        }
    }

    function parseValue() {
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

    function parseObject() {
        index++; // 跳过 '{'
        const obj = new NbtObject();
        let first = true;
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

            const key = parseKey();
            skipWhitespace();

            // 检查键是否以数字开头（非引号包裹时）
            if (!/^['"]/.test(key) && /^\d/.test(key)) {
                throw new Error(`Key cannot start with a digit: ${key}`);
            }

            if (str[index] !== ':') {
                throw new Error(`Expected colon`);
            }
            index++; // 跳过 ':'
            skipWhitespace();

            const value = parseValue();
            obj.addChild(key, value);

            first = false;
            expectComma = true; // 下一个元素前需要逗号
            skipWhitespace();
        }
        throw new Error("Unterminated object");
    }

    function parseArray() {
        index++; // 跳过 '['
        // 检查是否IntArray
        skipWhitespace();
        let arr;
        if (str[index] === 'I') {
            index++;
            skipWhitespace();
            if (str[index] !== ';') {
                throw new Error(`Expected semicolon`);
            }
            index++;
            arr = new NbtIntArray();
        } else {
            arr = new NbtList();
        }

        let first = true;
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
            arr.addChild(value);

            first = false;
            expectComma = true; // 下一个元素前需要逗号
            skipWhitespace();
        }
        throw new Error("Unterminated array");
    }

    function parseString(quoteChar) {
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

    function parseNumber() {
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

    function parseKey() {
        skipWhitespace();
        if (index >= length) {
            throw new Error("Unexpected end of input while parsing key");
        }

        // 键可以是字符串(单/双引号)或标识符
        if (str[index] === "'" || str[index] === '"') {
            const quote = str[index];
            index++;
            return parseStringContent(quote);
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

        return key;
    }

    // 辅助函数：解析字符串内容（用于键和值）
    function parseStringContent(quoteChar) {
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
        return value;
    } catch (e) {
        // 添加位置信息
        // context: before>>e<<after
        const context = str.substring(Math.max(0, index - 10), index) + ">>" + (str[index] || "") + "<<" + str.substring(index + 1, index + 10);
        throw new Error(`${e.message} at position ${index}. Context: ...${context}...`);
    }
}

