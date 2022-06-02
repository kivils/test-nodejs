const fs = require('fs');

const routes = (req, res) => {
  const url = req.url;
  const method = req.method;

  if(url === '/') {
    res.write('<html>');
    res.write('<head><title>Please fill in this form</title></head>');
    res.write('<body>' +
        '<h1>Please fill in this form</h1>' +
        '<form action="/message" method="POST"><input type="text" name="message"/><button type="submit">Submit</button></form>' +
        '</body>');
    res.write('</html>');
    return res.end();
  }

  if(url === '/message' && method === 'POST') {
    const body = [];

    req.on('data', (chunk) => {
      body.push(chunk);
    });

    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      fs.writeFile('message.text', message, err => {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        if (err) {
          //
        }
        return res.end();
      });
    });
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>Page from server</title></head>');
  res.write('<body><h1>Page from server</h1></body>');
  res.write('</html>');
  res.end();
}

module.exports = routes;
