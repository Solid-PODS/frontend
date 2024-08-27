onRequest((e) => {
  e.response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  e.response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  e.response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  e.response.headers.set('Access-Control-Allow-Credentials', 'true');

  if (e.request.method === 'OPTIONS') {
    e.response.status = 204;
    e.stop();
  }
});