#!/usr/bin/env node

const fs = require('fs');
const yargs = require('yargs');
const path = require('path');
const readline = require('readline');
const inquirer = require('inquirer');

let currentDirectory = process.cwd();
const options = yargs
    .option('d', {
        describe: 'Path to directory',
        default: process.cwd(),
    })
    .option('p', {
        describe: 'Pattern',
        default: '',
    }).argv;
console.log(options); 

const isFile = path => fs.lstatSync(path).isFile(); 
const filesList = path => fs.readdirSync(path);
  
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = async (query) => new Promise(resolve => rl.question(query, resolve));
(async () => {
    const query = await question('Введите запрос для поиска: ');
    const data = await inquirerCLI(currentDirectory);
    
    const regex = new RegExp(query, 'g');
    const foundMatches = data.match(regex);
    
    if (foundMatches !== null) console.log(`Найдено совпадений: ${foundMatches.length}`);
    else console.log('Совпадений не найдено');
    
    rl.close();
})();

const inquirerCLI = (pathToFiles) => inquirer
    .prompt([
        {
            name: 'fileName',
            type: 'list',
            message: 'Выберите файл:',
            choices: filesList(pathToFiles),
        }
    ])
    .then(answer => {
        const name = answer.fileName; 
        const fullPath = path.resolve(pathToFiles, name); 
        
        if (isFile(fullPath)) {
            const data = fs.readFileSync(fullPath, 'utf-8'); 
            return data;
        } else {
            return inquirerCLI(fullPath);
        }
    });

    rl.on("close", function() {
        process.exit(0);
    });
    