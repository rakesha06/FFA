var express = require('express');
var path = require('path');
var app = express();
var port = Number(process.argv[2]) || 80;
var maxAge = 86400000; // One day... good for prod... not for dev

var webroot = path.join(__dirname, 'app');
app.configure('production', function(){
    console.log("Using production configuration");
    app.use(express.compress());
    app.use(express.static(webroot, {maxAge: maxAge}));
});
app.configure('development', function(){
    console.log("Using development configuration");
    app.use(express.static(webroot));
});



app.listen(port, function(){
    console.log("Server Up on Port "+port);
    console.log("Webroot: "+webroot);
});
