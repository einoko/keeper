const scraper = require('website-scraper');
const Promise = require("bluebird");
const fs = require('fs');
const rimraf = require('rimraf');



const service = {
  deleteBookmark: function deleteBookmark(id) {
    return new Promise((resolve, reject) => {
      // check if path exists
      if (fs.existsSync('./public/files/' + id)) {
        rimraf('./public/files/' + id, (error) => {
          if (error !== null) {
            reject();
          }
        });
      }
      resolve();
    });
  },

  createBookmark: function createBookmark(url, type, id) {
    return new Promise((resolve, reject) => {
      switch(type){
        case 'archive':
          const options = {
            urls: [url],
            directory: './public/files/' + id
          };
          scraper(options).then(() => {
            resolve();
          }).catch((err) => {
            console.log(err);
            reject(err);
          });
          break;
        case 'bookmark':
          // just a bookmark
          resolve();
          break;
      }
    });
  }
};

module.exports = service;