import Lexer, {len} from '../lexer/lexer.js';
import {Parser} from './parser.js'
import fs from 'fs'
import path from 'path'
import {__dirname} from './fileInfo.js'

// let command = `let a = 10;`
// let command = `fn foo() {let a = 10;return a;}` // err
// let command = `let foo = fn() {let a = 10; return a;}`
// let command = `let foo = fn() {let a = 10; return a;}; foo()`
// let command = `let foo = fn() {let a = 10; return fn() { return a + 1 };}; foo()`
// let command = `1+2+3`
let command = `1  +  2  +  3`

let l = new Lexer(command)
let p = new Parser(l)
let program = p.ParseProgram()
if (len(p.Errors()) !== 0) {
    for (let err of p.Errors()) {
        console.error(err)
    }
    throw new Error("parser has errors")
}

const output = JSON.stringify(program, null, 4)
fs.writeFileSync(path.resolve(__dirname, './output.json'), output)
console.log(output)
