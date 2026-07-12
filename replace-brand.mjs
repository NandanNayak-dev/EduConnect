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
                    if (file.endsWith('.jsx') || file.endsWith('.html') || file.endsWith('.js')) callback(file);
                }
            });
        });
    });
}

function processFile(file) {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) return;
        let modified = data;
        
        modified = modified.replace(/Thinkify/g, 'EduConnect');
        modified = modified.replace(/thinkify/g, 'educonnect');
        modified = modified.replace(/Thikify/g, 'EduConnect'); // Fixed a typo if any

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
    path.join(process.cwd(), 'client', 'components'),
    path.join(process.cwd(), 'client', 'provider'),
    path.join(process.cwd(), 'client', 'index.html'),
];

dirs.forEach(dir => {
    fs.stat(dir, (err, stat) => {
        if (err) return;
        if (stat.isDirectory()) walk(dir, processFile);
        else processFile(dir);
    })
});
