import {len} from '../lexer/lexer.js'
import token from '../token/token.js'
export class Program {
    constructor() { // this.Statements
    }
    TokenLiteral(p) {
        if (len(p.Statements) > 0) {
            return p.Statements[0].TokenLiteral()
        } else {
            return ""
        }
    }
    String(p) {
        debugger
        console.log(JSON.stringify(p))
        // var out bytes.Buffer

        // for _, s := range p.Statements {
        //     out.WriteString(s.String())
        // }

        // return out.String()
    }

}

export class Node {
    TokenLiteral() {}
    String() {}
}

export class Statement extends Node {
    constructor() {
        super()
    }
    statementNode() {}
}
export class LetStatement extends Statement {
    // Token token.Token // the token.LET token
    // Name  *Identifier
    // Value Expression
    constructor(Token, Value) {
        super()
        this.Token = Token
        this.Value = Value ? Value : ''
    }
    statementNode(ls) {}
    TokenLiteral(ls) {
        return ls.Token.Literal
    }
    String(ls) {
        debugger
        console.log(JSON.stringify(ls))
        // var out bytes.Buffer

        // out.WriteString(ls.TokenLiteral() + " ")
        // out.WriteString(ls.Name.String())
        // out.WriteString(" = ")

        // if ls.Value != nil {
        //     out.WriteString(ls.Value.String())
        // }

        // out.WriteString(";")

        // return out.String()
    }
}

export class ReturnStatement extends Statement {
    // Token       token.Token // the 'return' token
    // ReturnValue Expression
    constructor(Token) {
        super()
        this.Token = Token
        // this.ReturnValue =
    }
    statementNode(rs) {}
    TokenLiteral(re) {
        return rs.Token.Literal
    }
    String(rs) {
        debugger
        console.log(JSON.stringify(rs))
        // var out bytes.Buffer

        // out.WriteString(rs.TokenLiteral() + " ")

        // if rs.ReturnValue != nil {
        //     out.WriteString(rs.ReturnValue.String())
        // }

        // out.WriteString(";")

        // return out.String()
    }
}

export class ExpressionStatement extends Statement {
    // Token      token.Token // the first token of the expression
    // Expression Expression
    constructor(Token) {
        super()
        this.Token = Token
        // this.Expression =
    }
    statementNode(es) {}
    TokenLiteral(es) {
        return es.Token.Literal
    }
    String(es) {
        debugger
        // if es.Expression != nil {
        //     return es.Expression.String()
        // }
        // return ""
    }
}

export class BlockStatement extends Statement {
    // Token      token.Token // the { token
    // Statements []Statement
    constructor(Token) {
        super()
        this.Token = Token
        // this.Statements =
    }
    statementNode() {}
    TokenLiteral(bs) {
        return bs.Token.Literal
    }
    String(bs) {
        debugger
        console.log(JSON.stringify(bs))
        // var out bytes.Buffer

        // for _, s := range bs.Statements {
        //     out.WriteString(s.String())
        // }

        // return out.String()
    }
}

export class Identifier {
    // Token token.Token // the token.IDENT token
    // Value string
    constructor(Token, Value) {
        this.Token = Token
        this.Value = Value ? Value : ''
    }
    expressionNode() {}
    TokenLiteral(i) {
        return i.Token.Literal
    }
    String(i) {
        debugger
        return i.Value
    }
}

export class Boolean {
    // Token token.Token
    // Value bool
    constructor(Token, Value) {
        this.Token = Token
        this.Value = Value
    }
    expressionNode() {}
    TokenLiteral(b) {
        return b.Token.Literal
    }
    String(b) {
        return b.Token.Literal
    }
}

export class IntegerLiteral {
    // Token token.Token
    // Value int64
    constructor(Token) {
        this.Token = Token
        // this.Value =
    }
    expressionNode() {}
    TokenLiteral(il) {
        return il.Token.Literal
    }
    String(il) {
        debugger
        return il.Token.Literal
    }
}

export class PrefixExpression {
    // Token    token.Token // The prefix token, e.g. !
    // Operator string
    // Right    Expression
    constructor(Token, Operator) {
        this.Token = Token
        this.Operator = Operator
    }
    expressionNode() {}
    TokenLiteral(pe) {
        return pe.Token.Literal
    }
    String(pe) {
        debugger
        console.log(JSON.stringify(pe))
        // var out bytes.Buffer

        // out.WriteString("(")
        // out.WriteString(pe.Operator)
        // out.WriteString(pe.Right.String())
        // out.WriteString(")")

        // return out.String()
    }
}

export class InfixExpression {
    // Token    token.Token // The operator token, e.g. +
    // Left     Expression
    // Operator string
    // Right    Expression
    constructor(Token, Operator, Left) {
        this.Token = Token
        this.Left = Left
        this.Operator = Operator
    }
    expressionNode() {}
    TokenLiteral(ie) {
        return ie.Token.Literal
    }
    String(ie) {
        debugger
        console.log(JSON.stringify(ie))
        // var out bytes.Buffer

        // out.WriteString("(")
        // out.WriteString(ie.Left.String())
        // out.WriteString(" " + ie.Operator + " ")
        // out.WriteString(ie.Right.String())
        // out.WriteString(")")

        // return out.String()
    }
}


export class IfExpression {
    // Token       token.Token // The 'if' token
    // Condition   Expression
    // Consequence *BlockStatement
    // Alternative *BlockStatement
    constructor(Condition, Consequence, Alternative) {
        this.Token = new token.Token()
        this.Condition = Condition
        this.Consequence = Consequence
        this.Alternative = Alternative
    }
    expressionNode() {}
    TokenLiteral(ie) {
        return ie.Token.Literal
    }
    String(ie) {
        debugger
        console.log(JSON.stringify(ie))
        // var out bytes.Buffer

        // out.WriteString("if")
        // out.WriteString(ie.Condition.String())
        // out.WriteString(" ")
        // out.WriteString(ie.Consequence.String())

        // if ie.Alternative != nil {
        //     out.WriteString("else ")
        //     out.WriteString(ie.Alternative.String())
        // }

        // return out.String()
    }
}

export class FunctionLiteral {
    // Token      token.Token // The 'fn' token
    // Parameters []*Identifier
    // Body       *BlockStatement
    constructor(Token) {
        this.token = Token
        // this.Parameters = Parameters
        // this.Body = Body
    }
    expressionNode() {}
    TokenLiteral(fl) {
        return fl.Token.Literal
    }
    String(fl) {
        debugger
        console.log(JSON.stringify(fl))
        // var out bytes.Buffer

        // params := []string{}
        // for _, p := range fl.Parameters {
        //     params = append(params, p.String())
        // }

        // out.WriteString(fl.TokenLiteral())
        // out.WriteString("(")
        // out.WriteString(strings.Join(params, ", "))
        // out.WriteString(") ")
        // out.WriteString(fl.Body.String())

        // return out.String()
    }
}


export class CallExpression {
    // Token     token.Token // The '(' token
    // Function  Expression  // Identifier or FunctionLiteral
    // Arguments []Expression
    constructor(Token, Function) {
        this.Token = Token
        this.Function = Function
    }
    expressionNode() {}
    TokenLiteral(ce) {
        return ce.Token.Literal
    }
    String(ce) {
        debugger
        console.log(JSON.stringify(ce))
        // var out bytes.Buffer

        // args := []string{}
        // for _, a := range ce.Arguments {
        //     args = append(args, a.String())
        // }

        // out.WriteString(ce.Function.String())
        // out.WriteString("(")
        // out.WriteString(strings.Join(args, ", "))
        // out.WriteString(")")

        // return out.String()
    }
}
