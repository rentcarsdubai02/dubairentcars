const fs = require('fs');
const https = require('https');

const download = (url, path) => {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120.0.0.0 Safari/537.36' } }, (res) => {
    let data = [];
    res.on('data', chunk => data.push(chunk));
    res.on('end', () => {
       fs.writeFileSync(path, Buffer.concat(data));
       console.log("Downloaded:", path);
    });
  }).on('error', (e) => console.error(e));
};

const dir = './public/brands';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

download('https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Lexus_logo.svg/512px-Lexus_logo.svg.png', dir + '/lexus.png');
download('https://upload.wikimedia.org/wikipedia/en/thumb/4/4b/Jaguar_Cars_logo.svg/512px-Jaguar_Cars_logo.svg.png', dir + '/jaguar.png');
download('https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Land_Rover_logo_2011.svg/512px-Land_Rover_logo_2011.svg.png', dir + '/landrover.png');
download('https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Logo.svg/512px-Mercedes-Logo.svg.png', dir + '/maybach.png');
