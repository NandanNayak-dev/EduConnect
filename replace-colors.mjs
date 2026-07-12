import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
    fs.readdir(dir, function(err, list) {
        if (err) return;
        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    if (!file.includes('node_modules')) walk(file, callback);
                } else {
                    if (file.endsWith('.jsx')) callback(file);
                }
            });
        });
    });
}

function processFile(file) {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) return;
        let modified = data;
        // Replace exact hex colors in sx props or styles
        // #1b2e35 is usually dark green, used for text or dark buttons
        // #59e3a7 is light green, used for active text, buttons
        
        // For text color, #1b2e35 is used often. If in Typography sx color, we should use 'text.primary' or 'secondary.main'
        modified = modified.replace(/color:(\s*)"#1b2e35"/g, 'color:$1"text.primary"');
        modified = modified.replace(/color="\#1b2e35"/g, 'color="text.primary"');
        modified = modified.replace(/backgroundColor:(\s*)"#1b2e35"/g, 'backgroundColor:$1"secondary.main"');
        
        modified = modified.replace(/color:(\s*)"#59e3a7"/g, 'color:$1"primary.main"');
        modified = modified.replace(/color="\#59e3a7"/g, 'color="primary.main"');
        modified = modified.replace(/backgroundColor:(\s*)"#59e3a7"/g, 'backgroundColor:$1"primary.main"');
        
        modified = modified.replace(/borderColor:(\s*)"#1b2e35"/g, 'borderColor:$1"divider"');
        modified = modified.replace(/borderBottom:(\s*)"1px solid #1b2e35"/g, 'borderBottom:$11, borderColor: "divider"');
        modified = modified.replace(/boxShadow:(\s*)"0px 0px 3px 0px #1b2e35"/g, 'boxShadow:$13');
        
        // Linear gradients
        modified = modified.replace(/#1b2e35/g, 'var(--mui-palette-secondary-main, #e11d48)');
        modified = modified.replace(/#59e3a7/g, 'var(--mui-palette-primary-main, #4f46e5)');

        if (data !== modified) {
            fs.writeFile(file, modified, 'utf8', (err) => {
                if (err) console.error(err);
                else console.log(`Updated ${file}`);
            });
        }
    });
}

const dirs = [
    path.join(process.cwd(), 'client', 'src'),
    path.join(process.cwd(), 'client', 'components')
];

dirs.forEach(dir => walk(dir, processFile));
