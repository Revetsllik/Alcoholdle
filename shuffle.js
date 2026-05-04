const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./alcohols.json', 'utf8'));

for (let i = data.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [data[i], data[j]] = [data[j], data[i]];
}

fs.writeFileSync('./alcohols.json', JSON.stringify(data, null, 4));
console.log("Shuffled!");