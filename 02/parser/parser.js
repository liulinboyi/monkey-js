import token from '../token/token.js'
import {
    Program,
    LetStatement,
    Identifier,
    ReturnStatement,
    ExpressionStatement,
    IntegerLiteral,
    PrefixExpression,
    InfixExpression,
    Boolean,
    BlockStatement,
    FunctionLiteral,
    CallExpression
} from '../ast/ast.js'
// 常量使用的数字无关紧要，重要的是顺序和彼此之间的关系。
// 这些常量是用来区分运算符优先级的，比如*运算符的优先级
// 是否比==运算符高，前缀运算符的优先级是否比调用表达式的优先级高。
const int = 0
const LOWEST = 1
const EQUALS = 2 // ==
const LESSGREATER = 3 // > or <
const SUM = 4 // +
const PRODUCT = 5 // *
const PREFIX = 6 // -X or !X
const CALL = 7 // myFunction(X)

var precedences = new Map([
    [
        token.EQ, EQUALS
    ],
    [
        token.NOT_EQ, EQUALS
    ],
    [
        token.LT, LESSGREATER
    ],
    [
        token.GT, LESSGREATER
    ],
    [
        token.PLUS, SUM
    ],
    [
        token.MINUS, SUM
    ],
    [
        token.SLASH, PRODUCT
    ],
    [
        token.ASTERISK, PRODUCT
    ],
    [
        token.LPAREN, CALL
    ],
])

export class Parser {
    // l      *lexer.Lexer
    // errors []string

    // curToken  token.Token
    // peekToken token.Token

    // prefixParseFns map[token.TokenType]prefixParseFn
    // infixParseFns  map[token.TokenType]infixParseFn
    constructor(l) {
        this.l = l
        this.errors = []

        // 初始化了prefixParseFns映射
        this.prefixParseFns = {}
        // 注册解析函数们
        this.registerPrefix(token.IDENT, this.parseIdentifier)
        this.registerPrefix(token.INT, this.parseIntegerLiteral)
        this.registerPrefix(token.BANG, this.parsePrefixExpression)
        this.registerPrefix(token.MINUS, this.parsePrefixExpression)
        this.registerPrefix(token.TRUE, this.parseBoolean)
        this.registerPrefix(token.FALSE, this.parseBoolean)
        this.registerPrefix(token.LPAREN, this.parseGroupedExpression)
        this.registerPrefix(token.IF, this.parseIfExpression)
        this.registerPrefix(token.FUNCTION, this.parseFunctionLiteral)

        this.infixParseFns = {}
        this.registerInfix(token.PLUS, this.parseInfixExpression)
        this.registerInfix(token.MINUS, this.parseInfixExpression)
        this.registerInfix(token.SLASH, this.parseInfixExpression)
        this.registerInfix(token.ASTERISK, this.parseInfixExpression)
        this.registerInfix(token.EQ, this.parseInfixExpression)
        this.registerInfix(token.NOT_EQ, this.parseInfixExpression)
        this.registerInfix(token.LT, this.parseInfixExpression)
        this.registerInfix(token.GT, this.parseInfixExpression)

        this.registerInfix(token.LPAREN, this.parseCallExpression)

        // Read two tokens, so curToken and peekToken are both set
        this.nextToken()
        this.nextToken()

    }

    nextToken() {
        this.curToken = this.peekToken
        this.peekToken = this.l.NextToken(this.l)
    }

    curTokenIs(t /* token.TokenType */
    ) {
        return this.curToken.Type == t
    }

    peekTokenIs(t /* token.TokenType */
    ) {
        return this.peekToken.Type == t
    }

    expectPeek(t /* token.TokenType */
    ) {
        if (this.peekTokenIs(t)) {
            this.nextToken()
            return true
        } else {
            this.peekError(t)
            return false
        }
    }

    Errors() {
        return this.errors
    }

    peekError(t /* token.TokenType */
    ) {
        // msg := fmt.Sprintf("expected next token to be %s, got %s instead",
        //     t, p.peekToken.Type)
        let msg = `expected next token to be ${t}, got ${
            this.peekToken.Type
        } instead`
        // p.errors = append(p.errors, msg)
        this.errors.push(msg)
    }

    noPrefixParseFnError(t /* token.TokenType */
    ) { // msg := fmt.Sprintf("no prefix parse function for %s found", t)
        let msg = `no prefix parse function for ${t} found`
        // p.errors = append(p.errors, msg)
        this.errors.push(msg)
    }

    ParseProgram() {
        /* *ast.Program */
        // program := &ast.Program{}
        let program = new Program()
        // program.Statements = []ast.Statement{}
        program.Statements = []

        while (!this.curTokenIs(token.EOF)) {
            let stmt = this.parseStatement()
            if (stmt != null) { // program.Statements = append(program.Statements, stmt)
                program.Statements.push(stmt)
            }
            this.nextToken()
        }

        return program
    }

    parseStatement() {
        /* ast.Statement */
        // 由于Monkey中实际上仅有的两种语句类型是let语句和return语句，
        // 因此，在没有这两种语句的情况下，就需要解析表达式语句
        switch (this.curToken.Type) {
            case token.LET: // let语句
                return this.parseLetStatement()
            case token.RETURN: // return语句
                return this.parseReturnStatement()
            default: // 表达式语句
                return this.parseExpressionStatement()
        }
    }

    parseLetStatement() { /* *ast.LetStatement */
        let stmt = new LetStatement( /* Token: */
            this.curToken)

        if (!this.expectPeek(token.IDENT)) {
            return null
        }

        stmt.Name = new Identifier( /* Token: */
            this.curToken, /* Value: */
            this.curToken.Literal)

        if (!this.expectPeek(token.ASSIGN)) {
            return null
        }

        this.nextToken()

        stmt.Value = this.parseExpression(LOWEST)

        if (this.peekTokenIs(token.SEMICOLON)) {
            this.nextToken()
        }

        return stmt
    }

    parseReturnStatement() { /* *ast.ReturnStatement */
        let stmt = new ReturnStatement( /* Token: */
            this.curToken)

        this.nextToken()

        stmt.ReturnValue = this.parseExpression(LOWEST)

        if (this.peekTokenIs(token.SEMICOLON)) {
            this.nextToken()
        }

        return stmt
    }

    parseExpressionStatement() { /* *ast.ExpressionStatement */
        let stmt = new ExpressionStatement( /* Token: */
            this.curToken)

        // 最低的优先级会传递给parseExpression
        stmt.Expression = this.parseExpression(LOWEST)

        if (this.peekTokenIs(token.SEMICOLON)) {
            this.nextToken()
        }

        return stmt
    }

    parseExpression(precedence) { /* ast.Expression */
        // 检查前缀位置是否有与curToken.Type关联的解析函数
        let prefix = this.prefixParseFns[this.curToken.Type]
        if (prefix == null) {
            this.noPrefixParseFnError(this.curToken.Type)
            return null
        }
        // 存在prefix，则调用该解析函数
        let leftExp = prefix.call(this)

        while (!this.peekTokenIs(token.SEMICOLON) && precedence < this.peekPrecedence()) {
            let infix = this.infixParseFns[this.peekToken.Type]
            if (infix == null) {
                return leftExp
            }

            this.nextToken()

            leftExp = infix.call(this, leftExp)
        }

        return leftExp
    }

    peekPrecedence() {
        /* int */
        // if p, ok := precedences[p.peekToken.Type]; ok {
        //     return p
        // }

        let p = precedences.get(this.peekToken.Type)

        if (p) {
            return p
        }

        return LOWEST
    }

    curPrecedence() {
        /* int */
        // if p, ok := precedences[p.curToken.Type]; ok {
        //     return p
        // }

        let p = precedences.get(this.curToken.Type)
        if (p) {
            return p
        }

        return LOWEST
    }

    parseIdentifier() { /* ast.Expression */
        return new Identifier( /* Token: */
            this.curToken, /* Value: */
            this.curToken.Literal)
    }

    parseIntegerLiteral() { /* ast.Expression */
        let lit = new IntegerLiteral( /* Token: */
            this.curToken)

        // value, err := strconv.ParseInt(p.curToken.Literal, 0, 64)
        // if err != nil {
        //     msg := fmt.Sprintf("could not parse %q as integer", p.curToken.Literal)
        //     p.errors = append(p.errors, msg)
        //     return nil
        // }

        let value
        try {
            value = parseInt(this.curToken.Literal)
        } catch (error) {
            let msg = `could not parse ${
                this.curToken.Literal
            } as integer`
            this.errors.push(msg)
            return null
        }

        lit.Value = value

        return lit
    }

    parsePrefixExpression() { /* ast.Expression */
        let expression = new PrefixExpression(
            /* Token: */
                this.curToken,
            /* Operator: */
                this.curToken.Literal,
        )

        this.nextToken()

        expression.Right = this.parseExpression(PREFIX)

        return expression
    }

    parseInfixExpression(left /* ast.Expression */
    ) { /* ast.Expression */
        let expression = new InfixExpression(
            /* Token: */
                this.curToken,
            /* Operator: */
                this.curToken.Literal,
            /* Left: */
                left,
        )

        let precedence = this.curPrecedence()
        this.nextToken()
        expression.Right = this.parseExpression(precedence)

        return expression
    }

    parseBoolean() { /* ast.Expression */
        return new Boolean(this.curToken, /* Token: */
            this.curTokenIs(token.TRUE) /* Value: */
        )
    }

    parseGroupedExpression() { /* ast.Expression */
        this.nextToken()

        let exp = this.parseExpression(LOWEST)

        if (!this.expectPeek(token.RPAREN)) {
            return null
        }

        return exp
    }

    parseIfExpression() { /* ast.Expression */
        let expression = new IfExpression( /* Token: */
            this.curToken)

        if (!this.expectPeek(token.LPAREN)) {
            return null
        }

        this.nextToken()
        expression.Condition = this.parseExpression(LOWEST)

        if (!this.expectPeek(token.RPAREN)) {
            return null
        }

        if (!this.expectPeek(token.LBRACE)) {
            return null
        }

        expression.Consequence = this.parseBlockStatement()

        if (this.peekTokenIs(token.ELSE)) {
            this.nextToken()

            if (!this.expectPeek(token.LBRACE)) {
                return null
            }

            expression.Alternative = this.parseBlockStatement()
        }

        return expression
    }

    parseBlockStatement() { /* *ast.BlockStatement */
        let block = new BlockStatement( /* Token: */
            this.curToken)
        block.Statements = []

        this.nextToken()

        while (!this.curTokenIs(token.RBRACE) && !this.curTokenIs(token.EOF)) {
            let stmt = this.parseStatement()
            if (stmt != null) { // block.Statements = append(block.Statements, stmt)
                block.Statements.push(stmt)
            }
            this.nextToken()
        }

        return block
    }

    parseFunctionLiteral() { /* ast.Expression */
        let lit = new FunctionLiteral( /* Token: */
            this.curToken)

        if (!this.expectPeek(token.LPAREN)) {
            return null
        }

        lit.Parameters = this.parseFunctionParameters()

        if (!this.expectPeek(token.LBRACE)) {
            return null
        }

        lit.Body = this.parseBlockStatement()

        return lit
    }

    parseFunctionParameters() { /* []*ast.Identifier */
        let identifiers = []

        if (this.peekTokenIs(token.RPAREN)) {
            this.nextToken()
            return identifiers
        }

        this.nextToken()

        let ident = new Identifier( /* Token: */
            this.curToken, /* Value: */
            this.curToken.Literal)
        // identifiers = append(identifiers, ident)
        identifiers.push(ident)

        while (this.peekTokenIs(token.COMMA)) {
            this.nextToken()
            this.nextToken()
            let ident = new Identifier( /* Token: */
                this.curToken, /* Value: */
                this.curToken.Literal)
            // identifiers = append(identifiers, ident)
            identifiers.push(ident)
        }

        if (!this.expectPeek(token.RPAREN)) {
            return null
        }

        return identifiers
    }

    parseCallExpression(func /* ast.Expression */
    ) { /* ast.Expression */
        let exp = new CallExpression(this.curToken, /* Token: */
            func /* Function: */
        )
        exp.Arguments = this.parseCallArguments()
        return exp
    }

    parseCallArguments() { /* []ast.Expression */
        let args = []

        if (this.peekTokenIs(token.RPAREN)) {
            this.nextToken()
            return args
        }

        this.nextToken()
        // args = append(args, this.parseExpression(LOWEST))
        args.push(this.parseExpression(LOWEST))

        while (this.peekTokenIs(token.COMMA)) {
            this.nextToken()
            this.nextToken()
            // args = append(args, this.parseExpression(LOWEST))
            args.push(this.parseExpression(LOWEST))
        }

        if (!this.expectPeek(token.RPAREN)) {
            return null
        }

        return args
    }

    registerPrefix(tokenType, /* token.TokenType */
        fn /* prefixParseFn */
    ) {
        this.prefixParseFns[tokenType] = fn
    }

    registerInfix(tokenType, /* token.TokenType */
        fn /* infixParseFn */
    ) {
        this.infixParseFns[tokenType] = fn
    }
}
