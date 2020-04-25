const express = require('express');
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

const routes = require('./api/routes');
routes(app);

app.listen(port, function() {   
   console.log('Server started on port: ' + port);
});