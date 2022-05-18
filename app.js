const bodyParser = require('body-parser');
const express = require('express');
const https = require('https');
const fs = require('fs')

const app = express();
const port = 7443;
const responseTimeout = 1;

const protocol = 'https';
const keyPath  = __dirname + '/certs/localhost.key';
const certPath = __dirname + '/certs/localhost.crt';

const respContentType = 'application/json';
const respStatus = 200;
const resp = `
{"result": "response from ${port}"}
`;

app.use(bodyParser.text({type:'*/*'}));

function processRequest (req,res) {
  console.log(new Date().toISOString()+' [request]:\n'+
    req.method+' '+req.protocol+':\/\/'+req.get('host')+req.originalUrl+'\n'+
    JSON.stringify(req.headers));
  if (['POST','PUT','PATCH'].includes(req.method.toUpperCase())){
    console.log(req.body);
  }

  res.set('Content-Type', respContentType);
  res.status(respStatus);
  res.setTimeout(responseTimeout, function(){
    console.log(new Date().toISOString()+' [response]:\n'+
      respStatus+'\n'+`${resp}`);
    res.send(resp);
  });
}

app.all('*', (req, res) => processRequest(req,res));

let server = {};

if (protocol === 'https') {
  server = https.createServer({key: fs.readFileSync(keyPath, 'utf8'), cert: fs.readFileSync(certPath, 'utf8')},app);
} else {
  server = app;
}

server.listen(port, () => {
  console.clear();
  console.log('Mock server is listening at '+protocol+'://localhost:'+port);
});