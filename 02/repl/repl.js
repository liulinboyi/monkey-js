import {createInterface} from 'readline';
import Lexer from '../lexer/lexer.js';
import {Parser} from '../parser/parser.js'
import {len} from '../lexer/lexer.js'

export default {
    run() {
        process.stdout.write('Welcome to monkey-lang REPL!\n');
        process.stdout.write('Hit RETURN once to enter multiline editing, twice to enter your command.\n');
        cli.prompt();
    }
};

let input = [];

let cli = createInterface({input: process.stdin, output: process.stdout, prompt: '> '});

function run(command) {
    try { // let a = ( b + ( c + d ) ) + e;
        let l = new Lexer(command)
        let p = new Parser(l)
        let program = p.ParseProgram()
        if (len(p.Errors()) !== 0) {
            for (let err of p.Errors()) { // console.error(err)
                process.stdout.write(err + '\r\n');
            }
            throw new Error("parser has errors")
        }
        process.stdout.write(JSON.stringify(program, null, 4) + '\r\n');
    } catch (err) {
        process.stdout.write(`${
            err.message
        } Something went wrong with the execution of your command, sorry!\n`);
    }
}

cli.on('line', line => {
    let command = input.join('');

    if (line !== '') {
        input.push(line);
        cli.setPrompt('');
        cli.prompt();
        return;
    }

    // Move cursor one line up
    process.stdout.write('\x1b[1A');

    switch (command) {
        case 'quit':
        case 'q': cli.close();
            break;
        default: run(command);
            input = [];
            cli.setPrompt('> ');
            cli.prompt();
    }
}).on('close', () => {
    process.stdout.write('Exiting monkey-lang REPL...\n');
    process.exit(0);
});
