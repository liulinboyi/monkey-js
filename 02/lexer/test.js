import Lexer from "./lexer.js";
import token from "../token/token.js";

function run(command) {
    let l = new Lexer(command);
    let tok = new token.Token();
    let res = [];
    while (true) {
        tok = l.NextToken(l);
        if (tok.Type != token.EOF) {
            res.push(tok);
        } else {
            break;
        }
    }
    return res;
}

function test(command, msg, judge) {
    console.log(`test: ${msg}`);
    console.assert(judge(command), `${msg} failed!`);
}

test(`let a = 10;`, `'let a = 10;' token length`, (command) => {
    return run(command).length === 5;
});

test(`let a = 10;`, `'let a = 10;' token content`, (command) => {
    let left = JSON.stringify(run(command))
    let right = JSON.stringify([
        {
            Type: "LET",
            Literal: "let"
        },
        {
            Type: "IDENT",
            Literal: "a"
        },
        {
            Type: "=",
            Literal: "="
        },
        {
            Type: "INT",
            Literal: "10"
        }, {
            Type: ";",
            Literal: ";"
        },
    ])
    return(left === right);
});
