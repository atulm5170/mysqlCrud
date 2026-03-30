// using faker to fake data
const { faker } = require('@faker-js/faker');

//my sql connection
const mysql = require('mysql2');

//express connection
const express = require('express');

//path createion
const path = require("path");

// method-override connection
const methodOverride = require('method-override');

//random id createion
const { v4: uuidv4 } = require("uuid");

//express store in app variable
const app = express();

//reading code
app.use(express.urlencoded({ extended: true }));

//ejs setup
app.set("view engine", "ejs");

//views folder setup
app.set("views", path.join(__dirname, "/views"));

//public folder setup
app.use(express.static(path.join(__dirname, "public")));

//use of methode-override
app.use(methodOverride("_method"));


// MySQL connection
const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'sigmaClass',
      password: 'atul@1234'
});


//home count user
app.get("/", (req, res) => {
      let q = `select count(*) from userClass`;
      try {
            connection.query(q, (err, result) => {
                  if (err) throw err;
                  let count = result[0]["count(*)"];
                  res.render("home.ejs", { count });
            });

      } catch (err) {
            res.send("some error occured");
      }
});

// show user detail
app.get("/user", (req, res) => {
      let q = `select * from userClass order by username asc`;
      try {
            connection.query(q, (err, users) => {
                  if (err) throw err;
                  res.render("user.ejs", { users });
            });
      } catch (err) {
            res.send("some error in databases");
      }
});

// edit form open
app.get("/user/:id/edit", (req, res) => {
      let { id } = req.params;
      let q = `select * from userClass where id='${id}'`;

      try {
            connection.query(q, (err, result) => {
                  if (err) throw err;
                  let user = result[0];
                  res.render("edit.ejs", { user });
            });
      } catch (err) {
            res.send("some error in db");
      }
});

//update route
app.patch("/user/:id", (req, res) => {
      let { id } = req.params;
      let { password: formPass, username: newUsername } = req.body;

      let q = `select * from userClass where id='${id}'`;

      try {
            connection.query(q, (err, result) => {
                  if (err) throw err;
                  let user = result[0];

                  if (formPass != user.password) {
                        res.send("wrong password! please enter true password");
                  } else {
                        let q2 = `update userClass set username='${newUsername}'where id='${id}'`;
                        connection.query(q2, (err, result) => {
                              if (err) throw err;
                              res.redirect("/user");
                        });
                  }
            });
      } catch (err) {
            res.send("some err in db");
      }
});

//add form open
app.get("/user/new", (req, res) => {
      res.render("new.ejs");
});

//update new user in db
app.post("/user", (req, res) => {

      let { username, email, password } = req.body;
      let id = uuidv4();
      console.log("ID:", id, req.body);

      let q = `insert into userClass (id, username, email, password) values (?, ?, ?, ?) `;

      let values = [id, username, email, password];

      connection.query(q, values, (err, result) => {
            if (err) {
                  console.log("db problem", err);
                  return res.send("DB error");
            }
            res.redirect("/user");
      });
});

//delete form open
app.get("/user/:id/delete", (req, res) => {
      let { id } = req.params;
      let q = `select * from userClass where id=?`;

      connection.query(q, [id], (err, result) => {
            if (err) throw err;

            let user = result[0];
            res.render("del.ejs", { user });
      });
});

//delete form
app.post("/user/delete", (req, res) => {
      let { email, password } = req.body;

      let q = `select * from userClass where email=?`;

      connection.query(q, [email], (err, result) => {
            if (err) throw err;
            let user = result[0];

            if (!user) {
                  return res.send("Please Enter Correct Email!");
            }
            if (user.password !== password) {
                  return res.send("wrong password");
            }

            let q2 = `delete from userClass where email=?`;

            connection.query(q2, [email], (err, result) => {
                  if (err) throw err;
                  res.redirect("/user");
            });
      });
});

//port
app.listen(8080, () => {
      console.log("server running on port");
});


// // create random user
// let createRandomUser = () => {
//       return [
//             faker.string.uuid(),
//             faker.internet.username(),
//             faker.internet.email(),
//             faker.internet.password()
//       ];
// };

// // insert 100 users query
// let query = "INSERT INTO userClass (id, username, email, password) VALUES ?";

// let data = [];
// for (let i = 0; i < 100; i++) {
//       data.push(createRandomUser());
// }

// connection.query(query, [data], (err, result) => {
//       if (err) throw err;
//       console.log("100 users inserted",result      );
// });