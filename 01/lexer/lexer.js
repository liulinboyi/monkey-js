import token from '../token/token.js'
class Lexer {
    constructor(input, position, readPosition, ch) {
        this.input = input
        /* position则指向所输入字符串中与ch字节对应的字符 */
        this.position = position ? position : 0
        /* readPosition始终指向所输入字符串中的“下一个”字符 */
        this.readPosition = readPosition ? readPosition : 0
        this.ch = ch ? ch : ''
        this.readChar(this)
    }
    /* 读取input中的下一个字符，并前移其在input中的位置 */
    readChar(l /* Lexer实例 */ ) {
        if (l.readPosition >= len(l.input)) {
            l.ch = 0
        } else {
            l.ch = l.input[l.readPosition]
        }
        l.position = l.readPosition
        l.readPosition += 1
    }
    NextToken(l) {
        let tok = new token.Token()
        l.skipWhitespace(this)
        switch (l.ch) {
            case '=':
                if (l.peekChar(this) === '=') {
                    let ch = l.ch
                    l.readChar(this)
                    let literal = String(ch) + String(l.ch)
                    tok = new token.Token(token.EQ, literal)
                } else {
                    tok = newToken(token.ASSIGN, l.ch)
                }
                break
            case '+':
                tok = newToken(token.PLUS, l.ch)
                break
            case '-':
                tok = newToken(token.MINUS, l.ch)
                break
            case '!':
                if (l.peekChar(this) === '=') {
                    let ch = l.ch
                    l.readChar(this)
                    let literal = String(ch) + String(l.ch)
                    tok = new token.Token(token.NOT_EQ, literal)
                } else {
                    tok = newToken(token.BANG, l.ch)
                }
                break
            case '/':
                tok = newToken(token.SLASH, l.ch)
                break
            case '*':
                tok = newToken(token.ASTERISK, l.ch)
                break
            case '<':
                tok = newToken(token.LT, l.ch)
                break
            case '>':
                tok = newToken(token.GT, l.ch)
                break
            case ';':
                tok = newToken(token.SEMICOLON, l.ch)
                break
            case ',':
                tok = newToken(token.COMMA, l.ch)
                break
            case '{':
                tok = newToken(token.LBRACE, l.ch)
                break
            case '}':
                tok = newToken(token.RBRACE, l.ch)
                break
            case '(':
                tok = newToken(token.LPAREN, l.ch)
                break
            case ')':
                tok = newToken(token.RPAREN, l.ch)
                break
            case 0:
                tok.Literal = ""
                tok.Type = token.EOF
                break
            default:
                if (isLetter(l.ch)) {
                    tok.Literal = l.readIdentifier(this)
                    tok.Type = token.LookupIdent(tok.Literal)
                    return tok
                } else if (isDigit(l.ch)) {
                    tok.Type = token.INT
                    tok.Literal = l.readNumber(this)
                    return tok
                } else {
                    tok = newToken(token.ILLEGAL, l.ch)
                }
                break
        }

        // 在返回词法单元之前，位于所输入字符串中的指针会前移，
        // 所以之后再次调用NextToken()时，l.ch字段就已经更新过了。
        l.readChar(this)
        return tok
    }
    skipWhitespace(l) {
        while (l.ch === ' ' || l.ch === '\t' || l.ch === '\n' || l.ch === '\r') {
            l.readChar(this)
        }
    }
    peekChar(l) {
        if (l.readPosition >= len(l.input)) {
            return 0
        } else {
            return l.input[l.readPosition]
        }
    }
    readIdentifier(l) {
        let position = l.position
        while (isLetter(l.ch)) {
            l.readChar(this)
        }
        return l.input.slice(position, l.position)
    }

    readNumber(l) {
        let position = l.position
        while (isDigit(l.ch)) {
            l.readChar(this)
        }
        return l.input.slice(position, l.position)
    }
}

function len(str) {
    return str.length
}

function newToken(tokenType, ch) {
    return new token.Token(tokenType, String(ch))
}

function isLetter(ch) {
    return 'a' <= ch && ch <= 'z' || 'A' <= ch && ch <= 'Z' || ch === '_'
}

function isDigit(ch) {
    return '0' <= ch && ch <= '9'
}

export default Lexer