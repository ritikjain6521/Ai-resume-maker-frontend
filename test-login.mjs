import https from 'https';

const data = JSON.stringify({
  email: 'admin@example.com', // use an email that exists or just random to see if cookie is set
  password: 'admin' // whatever
});

const options = {
  hostname: 'ai-resume-maker-backend-ve6d.onrender.com',
  port: 443,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Origin': 'https://ai-resume-maker-frontend-lac.vercel.app',
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
});

req.on('error', (e) => {
  console.error(e);
});
req.write(data);
req.end();
