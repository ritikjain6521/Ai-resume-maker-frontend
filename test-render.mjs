import https from 'https';

const data = JSON.stringify({
  email: 'admin@example.com', // fake email just to see headers, will probably return 401 but might not set cookie if fails.
});

const options = {
  hostname: 'ai-resume-maker-backend-ve6d.onrender.com',
  port: 443,
  path: '/api/admin/stats',
  method: 'GET',
  headers: {
    'Origin': 'https://ai-resume-maker-frontend-lac.vercel.app'
  }
};

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
