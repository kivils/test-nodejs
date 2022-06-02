const routes = (req, res) => {
  const url = req.url;
  const method = req.method;

  if(url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>Hello!</title></head>');
    res.write('<body>' +
        '<h1>Hey, nice to see you!</h1>' +
        '<p>We have many greate people here, <a href="/users">just have a look</a>!</p>' +
        '<h2>Please join us :-)</h2>' +
        '<form action="/create-user" method="POST">' +
        '<label for="username">Pick a username</label><br/>' +
        '<input type="text" name="username" id="username"/>' +
        '<button type="submit">Submit</button>' +
        '</form>' +
        '</body>');
    res.write('</html>');
    return res.end();
  }

  if(url === '/users') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>Our people</title></head>');
    res.write('<body>' +
        '<p><a href="/">Our home page</a></p>' +
        '<h1>Our people</h1>' +
        '<p>We have many greate people here, just have a look!</p>' +
        '<ol>' +
        '<li>Thomas Cook</p>' +
        '<li>Robinson Crouso</p>' +
        '<li>Federico Fellini</p>' +
        '</ol>' +
        '<h2>Please join us :-)</h2>' +
        '<form action="/create-user" method="POST">' +
        '<label for="username">Pick a username</label><br/>' +
        '<input type="text" name="username" id="username"/>' +
        '<button type="submit">Submit</button>' +
        '</form>' +
        '</body>');
    res.write('</html>');
    return res.end();
  }

  if(url === '/create-user') {
    if(method === 'POST') {
      const body = [];

      req.on('data', (chunk) => {
        body.push(chunk);
      });

      return req.on('end', () => {
        const parsedBody = Buffer.concat(body);
        const message = parsedBody.toString().split('=')[1].split('+').toString().replaceAll(',', ' ');

        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Welcome to the club!</title></head>');
        res.write('<body>' +
            '<p><a href="/">Our home page</a></p>' +
            '<h1>Wow <span style="color: green;">' + message + '</span>! Welcome to the club :-) !</h1>' +
            '<p>Now you are <a href="/users">one of us</a>!</p>' +
            '</body>');
        res.write('</html>');
        res.end();
      });
    }
    else {
      res.statusCode = 302;
      res.setHeader('Location', '/');
    }
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>Page from server</title></head>');
  res.write('<body><h1>Page from server</h1></body>');
  res.write('</html>');
  res.end();
}

module.exports = routes;
