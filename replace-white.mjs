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
        
        // Convert backgroundColor: "white" to "background.paper"
        modified = modified.replace(/backgroundColor:(\s*)"white"/g, 'backgroundColor:$1"background.paper"');
        modified = modified.replace(/backgroundColor="white"/g, 'backgroundColor="background.paper"');
        
        // Convert color: "white" to "text.primary" inside sx
        modified = modified.replace(/color:(\s*)"white"/g, 'color:$1"text.primary"');
        modified = modified.replace(/color="white"/g, 'color="text.primary"');

        // Border colors
        modified = modified.replace(/borderColor:(\s*)"white"/g, 'borderColor:$1"divider"');

        // Also change secondary.main blocks to background.paper so text is readable
        // in Login and Registration they had: backgroundColor: "secondary.main"
        if (file.includes('Login.jsx') || file.includes('Registration.jsx')) {
            modified = modified.replace(/backgroundColor:(\s*)"secondary.main"/g, 'backgroundColor:$1"background.paper"');
            // Remove the complex white border overrides for textfields if possible, or leave them as divider (which we just replaced)
        }

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
