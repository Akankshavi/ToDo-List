const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _=require("lodash");
const date = require(__dirname + "/date.js");
// We can create our own modules that call them when required


const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
app.use(express.static("public"));
// The above line looks for a ejs file in the folder views, so make sure you ahve created it and added the relevant files there

mongoose.connect('mongodb://localhost/todolistDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
  name: "Welcome to your todo list!"
});
const item2 = new Item({
  name: "Hit the + button to add a new item"
});
const item3 = new Item({
  name: "<-- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});
const List = mongoose.model("List", listSchema);


// Item.find({},function(item,err){
//   if(err){
//     console.log(err);
//   }
//   else{
//     console.log("Succesfully displayed all list items");
//   }
// });
// const items=["Buy food","Cook food","Eat food"];
// const workItems=[];
// We can push elements into a constant array but we cannot assign it to a completely new array


app.get("/", function(req, res) {
  // res.send("Hello!");

  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Succesfully saved default items to DB");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: date.getDate(),
        // Call the function from our module
        newListItems: foundItems
        // newListItems:items
        // These are the variables that we are passing, the first word should exactly match the name of the variable in our ejs file.
      });
    }

  });
});

app.get("/list/:listName", function(req, res) {
  const listName = _.capitalize(req.params.listName);
  // console.log(listName);
  List.findOne({
    name: listName
  }, async function(err, foundList) {
    if (!err) {
      if (!foundList) {
        // console.log("doesn't exist");
        const list = new List({
          name: listName,
          items: defaultItems
        });
        await list.save();
        res.redirect("/list/" + listName);
      } else {
        // console.log("Already exists");
        if (foundList.items.length === 0) {
          foundList.items.concat(defaultItems);
        }
          res.render("list", {
            listTitle: foundList.name,
            newListItems: foundList.items
          });
      }
    }
  });
});

app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName
  });
  if (listName === date.getDate()) {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/list/" + listName);
    });
  }

});
app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  const currentListName = req.body.listName;
  if (currentListName === date.getDate()) {
    Item.findByIdAndRemove(checkedItemId, function(err) {
      // If callback function is not specified then only the the found item is returned, for the deletion to take place, must specify callback
      if (!err) {
        // console.log("Succesfully deleted item");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({
      name: currentListName
    }, {
      $pull: {
        items: {
          _id: checkedItemId
        }
      }
    }, function(err, foundList) {
      // The first parameter is what do we have to update and the 2nd is how we want to update it
      // Here the 1st tells us which list and second tells us that we want to pull(remove) from items an item with id as given
      // foundList is the List found using find in the method
      if (!err) {
        res.redirect("/list/" + currentListName);
      }
    });
  }
});
app.get("/about", function(req, res) {
  res.render("about");
});
app.listen("3000", function() {
  console.log("Server started at port 3000");
});
