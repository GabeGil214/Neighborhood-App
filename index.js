var express = require("express");
var app = express();


app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/views'));

app.get("/", function(req, res){
  res.render("landing.html");
});

app.listen(5000, function(){
  console.log("server is running");
});
