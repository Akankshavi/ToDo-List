const express = require("express");
const bodyParser = require("body-parser");
const date=require(__dirname+"/date.js");
// We can create our own modules that call them when required
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));
// The above line looks for a ejs file in the folder views, so make sure you ahve created it and added the relevant files there
var items=["Buy food","Cook food","Eat food"];
let workItems=[];
app.get("/", function(req, res) {
  // res.send("Hello!");

  res.render("list",{
    listTitle:date.getDate(),
    newListItems:items
    // These are the variables that we are passing, the first word should exactly match the name of the variable in our ejs file.
  });
  // var currentDay = today.getDay();
  // var day = "";
  // switch (currentDay) {
  //   case 0:
  //     day = "Sunday";
  //     break;
  //   case 1:
  //     day = "Monday";
  //     break;
  //   case 2:
  //     day = "Tuesday";
  //     break;
  //   case 3:
  //     day = "Wednesday";
  //     break;
  //   case 4:
  //     day = "Thursday";
  //     break;
  //   case 5:
  //     day = "Friday";
  //     break;
  //   case 6:
  //     day = "Saturday";
  //     break;
  //   default:
  //   console.log("Error, the current day is equal to: "+currentDay);
  //
  // }
});
app.get("/work",function(req,res){
  res.render("list",{listTitle:"Work list",newListItems:workItems});
});
app.post("/",function(req,res){
  item=req.body.newItem;
  // console.log(req.body);
  if(req.body.list==="Work")
  {
    workItems.push(item);
    res.redirect("/work");
  }
  else{
    items.push(item);
    res.redirect("/");
    // console.log(req.body.newItem);
  }

});
app.get("/about",function(req,res){
  res.render("about");
});
app.listen("3000", function() {
  console.log("Server started at port 3000");
});
