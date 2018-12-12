const express = require('express');

const app = express();
app.use(express.static(__dirname + '/example/build/'));
app.use(express.favicon(__dirname + '/example/build/favicon.ico'));

app.listen(process.env.PORT || 3010);
