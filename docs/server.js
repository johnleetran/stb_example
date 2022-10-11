var express = require('express');
var app = express();
var fs = require('fs');
var cors = require('cors')
//add other middleware
var corsOptions = {
  origin: '*',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
}

// app.options('*', function (req, res) {
//   let headers = {};
//   headers["Access-Control-Allow-Methods"] = "*";
//   headers["Cross-Origin-Embedder-Policy"] = "require-corp";
//   headers["Cross-Origin-Opener-Policy"] = 'same-origin'; 

//   // respond to the request
//   res.writeHead(200, headers);
//   res.end();
// });

// app.use(cors);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Methods", '*');
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});

app.use(express.static('.'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/isitup', (req, res) => {
  res.end("si")
})

app.listen(8080, ()=> {
  console.log("http://127.0.0.1:8080")
})

process.on('SIGINT', function () {
  console.log("Caught interrupt signal");
  process.exit(0);
});