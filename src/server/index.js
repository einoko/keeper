const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const uuidv4 = require("uuid/v4");
const bookmarkService = require("./services/BookmarkService");
const _ = require("lodash");
const cors = require("cors");
const axios = require("axios");
const articleTitle = require("article-title");

app.use(express.static(__dirname + "./../../"));
app.use(bodyParser.json());
app.use(cors());

// Create database instance and start server
const adapter = new FileAsync("./db.json");

// API
low(adapter)
  .then(db => {
    // Get all bookmarks
    app.get("/bookmarks", (req, res) => {
      const bookmarks = db.get("bookmarks");
      res.send(bookmarks);
    });

    // Get a specific bookmark
    app.get("/bookmarks/:id", (req, res) => {
      const bookmark = db
        .get("bookmarks")
        .find({ id: req.params.id })
        .value();
      res.send(bookmark);
    });

    // Get all archived bookmarks
    app.get("/archived", (req, res) => {
      const bookmarks = db
        .get("bookmarks")
        .filter(bookmark => bookmark.type === "archive")
        .value();
      res.send(bookmarks);
    });

    // Get all bookmarked bookmarks
    app.get("/bookmarked", (req, res) => {
      const bookmarks = db
        .get("bookmarks")
        .filter(bookmark => bookmark.type === "bookmark")
        .value();
      res.send(bookmarks);
    });

    // Get all unread bookmarks
    app.get("/unread", (req, res) => {
      const bookmarks = db
        .get("bookmarks")
        .filter(bookmark => bookmark.unread)
        .value();
      res.send(bookmarks);
    });

    // Get all tags
    app.get("/tags", (req, res) => {
      const tags = [];
      db
        .get("bookmarks")
        .value()
        .forEach(bookmark => {
          bookmark.tags.forEach(tag => tags.push({ name: tag.name }));
        });
      res.send(_.uniqBy(tags, "name"));
    });

    // Get all bookmarks with a specific tag
    app.get("/tags/:tag", (req, res) => {
      const targetTag = req.params.tag;
      const bookmarks = db
        .get("bookmarks")
        .filter(bookmark => _.some(bookmark.tags, ["name", targetTag]));
      res.send(bookmarks);
    });

    // Post a new bookmark
    app.post("/bookmarks", (req, res) => {
      if (
        db
          .get("bookmarks")
          .find({ url: req.body.url })
          .value()
      ) {
        res
          .status(400)
          .send({ message: "Bookmark for this URL already exists" });
      } else {
        const id = uuidv4();
        bookmarkService
          .createBookmark(req.body.url, req.body.type, id)
          .then(() => {
            const bookmarkBody = {
              id: id,
              date: new Date(),
              url: req.body.url,
              title: req.body.title,
              unread: true,
              tags: req.body.tags,
              type: req.body.type
            };
            if (req.body.type === "archive") {
              bookmarkBody.path = "./public/files/" + id;
            }

            db
              .get("bookmarks")
              .push(bookmarkBody)
              .last()
              .write()
              .then(res.status(200).send(bookmarkBody))
              .catch(() =>
                res.status(400).send({ message: "Could not save bookmark" })
              );
          })
          .catch(error => {
            res.status(500).send(error);
          });
      }
    });

    // Delete a bookmark
    app.delete("/bookmarks/:id", (req, res) => {
      const bookmark = db
        .get("bookmarks")
        .find({ id: req.params.id })
        .value();

      if (bookmark) {
        db
          .get("bookmarks")
          .remove({ id: req.params.id })
          .write()
          .then(
            bookmarkService
              .deleteBookmark(req.params.id)
              .then(res.status(200).send())
              .catch(error => console.log(error))
          );
      } else {
        res.status(400).send({ message: "Bookmark does not exist" });
      }
    });

    app.patch("/bookmarks/read/:id", (req, res) => {
      const bookmark = db
        .get("bookmarks")
        .find({ id: req.params.id })
        .value();
      const bookmarkBody = {
        unread: false,
      };
      _.assign(bookmark, bookmarkBody);

      db
        .get("bookmarks")
        .find({ id: req.params.id })
        .assign(bookmark)
        .write()
        .then(res.status(200).send(bookmark))
        .catch(error => res.status(400).send(error));
    });

    // Update a bookmark
    app.patch("/bookmarks/:id", (req, res) => {
      const bookmark = db
        .get("bookmarks")
        .find({ id: req.params.id })
        .value();
      const bookmarkBody = {
        id: req.params.id,
        date: new Date(),
        url: req.body.url,
        title: req.body.title,
        tags: req.body.tags,
        type: req.body.type
      };
      _.assign(bookmark, bookmarkBody);

      db
        .get("bookmarks")
        .find({ id: req.params.id })
        .assign(bookmark)
        .write()
        .then(res.status(200).send(bookmark))
        .catch(error => res.status(400).send(error));
    });

    app.post("/helper/title", (req, res) => {
      const url = req.body.url;
      console.log(url);
      const request = axios.get(url);
      request
        .then(response => {
          res.status(200).send({ title: articleTitle(response.data) });
        })
        .catch(() => res.status(200).send({ title: "Error" }));
    });

    // TODO: API: Convert bookmark to archive

    // TODO: API: Convert archive to bookmark

    // Set db default values
    //return db.defaults({ bookmarks: [] }).write()
  })
  .then(() => {
    app.listen(3000, () => console.log("Listening on port 3000"));
  });
