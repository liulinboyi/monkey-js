class Token {
    constructor(Type, Literal) {
        this.Type = Type
        this.Literal = Literal ? Literal : ''
    }
}

const token = {
    ILLEGAL: "ILLEGAL",
    EOF: "EOF",

    // Identifiers + literals
    IDENT: "IDENT", // add, foobar, x, y, ...
    INT: "INT", // 1343456

    // Operators
    ASSIGN: "=",
    PLUS: "+",
    MINUS: "-",
    BANG: "!",
    ASTERISK: "*",
    SLASH: "/",

    LT: "<",
    GT: ">",

    EQ: "==",
    NOT_EQ: "!=",

    // Delimiters
    COMMA: ",",
    SEMICOLON: ";",

    LPAREN: "(",
    RPAREN: ")",
    LBRACE: "{",
    RBRACE: "}",

    // Keywords
    FUNCTION: "FUNCTION",
    LET: "LET",
    TRUE: "TRUE",
    FALSE: "FALSE",
    IF: "IF",
    ELSE: "ELSE",
    RETURN: "RETURN",
    LookupIdent,
    Token
}

let keywords = new Map([
    ["fn", token.FUNCTION],
    ["let", token.LET],
    ["true", token.TRUE],
    ["false", token.FALSE],
    ["if", token.IF],
    ["else", token.ELSE],
    ["return", token.RETURN],
])

function LookupIdent(ident) {
    let tok = keywords.get(ident)
    if (tok) {
        return tok
    }
    return token.IDENT
}

export default token
