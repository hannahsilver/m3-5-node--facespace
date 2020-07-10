"use strict";

const express = require("express");
const morgan = require("morgan");

const { users } = require("./data/users");

let currentUser = {};

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};
const handleHomepage = (req, res) => {
  res.status(200).render("pages/homepage", { users: users, currentUser });
};

const handleProfilePage = (req, res) => {
  const _id = req.params._id;
  let userObj = {};
  users.forEach((user) => {
    if (_id === user._id) {
      userObj = user;
    }
  });

  let friendsList = userObj.friends.map((friendId) => {
    let foundUser = users.find((user) => {
      if (user._id === friendId) {
        return true;
      }
    });
    return foundUser;
  });

  res.render("pages/profile", {
    user: userObj,
    friends: friendsList,
    currentUser,
  });
};

const handleSignin = (req, res) => {
  res.render("pages/signin", { currentUser });
};

const handleName = (req, res) => {
  const firstName = req.body.firstName;
  let foundUser = users.find((user) => {
    return user.name === firstName;
  });

  currentUser = foundUser;

  if (foundUser !== undefined) {
    res.status(200).redirect("/users/" + foundUser._id);
  } else {
    res.status(400).redirect("/signin");
  }
};
// -----------------------------------------------------
// server endpoints
express()
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints
  .get("/", handleHomepage)

  .get("/users/:_id", handleProfilePage)

  .get("/signin", handleSignin)

  .post("/getname", handleName)

  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));
