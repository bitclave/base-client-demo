const express = require('express');
const favicon = require('serve-favicon')

const app = express();
app.use(express.static(__dirname + '/example/build/'));
app.use(favicon(__dirname + '/example/build/favicon.ico'));

app.listen(process.env.PORT || 3010);
