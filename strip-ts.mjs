import fs from 'fs';
import path from 'path';
import * as babel from '@babel/core';

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walkDir(file));
        } else { 
            if (file.endsWith('.jsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walkDir('./src');
files.forEach(file => {
    try {
        const result = babel.transformFileSync(file, {
            presets: [],
            plugins: [
                ['@babel/plugin-transform-typescript', { isTSX: true, allExtensions: true }],
                '@babel/plugin-syntax-jsx'
            ],
            retainLines: true,
            configFile: false,
            babelrc: false
        });
        fs.writeFileSync(file, result.code);
        console.log('Transformed:', file);
    } catch (e) {
        console.error('Error in:', file, e.message);
    }
});
