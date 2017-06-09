// DEPENDANCIES
var express = require("express");
var exphbs = require ("express-handlebars");
var bodyParser = require("body-parser");
var path = require("path");
var logger = require("morgan");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var router = express.Router();

// Requiring Note and Article models
var KotakuNote = require("../models/KotakuNote.js");
var KotakuArticle = require("../models/KotakuArticle.js");

// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];


// Import comment and article models
var comment = require("../models/KotakuNote.js");
var article = require("../models/KotakuArticle.js");

// Index file
router.get("/", function(req, res){
	// res.redirect("/scrape");
	console.log("^_^rendering file...");
	// res.send('ok');
	res.render('index', {
		articles: [
			{ 
				title: 'Article',
				summary: 'Summary',
				link: 'Link'

			}
		]
	});
});

// Web Scraping
router.get("/scrape", function(req, res, next) {
  // Make a request for the news section of combinator
    request("http://kotaku.com/", function(error, response, html) {
       var $ = cheerio.load(html);
       var counter = 0;
          var data = [];
          var arrLength = $(".block").length;
         $(".block").each(function(i, element) {
            var result = {};
            result.title = $(element).find("h1.headline").text();
            result.link = $(element).find("a").attr("href");
            result.summary = $(element).find("p").text();
            var entry = new article(result);
            entry.save(function(err, doc) {
              if (err) {
                console.log(err);
              } else {
                // console.log(doc);
                data.push(doc);
                if (data.length == arrLength){
                  res.json(data);
                }
              }
            }); // closes save
          }); // this closes the .each

    }); // this closes request

}); // this closes the get route

router.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// Add a Routing Comment
router.post("/add/comment/:id", function (req, res) {

	var articleId = req.params.id;

	var commentAuthor = req.body.name;

	var commentBody = req.body.comment;

	var result = {
		author: commentAuthor,
		body: commentBody
	}

	var newComment = new comment(result);

	newComment.save(function(err, docs) {
		if (error) {
			console.log(err);
		}
		else {
			article.findOneAndUpdate({"_id": articleId}, {$push:{"comments": docs.id}},{new: true})
			.exec(function(err, docs){
				if (err){
					console.log(err);
				} else {
					res.send(docs);
				}
			});
		}
	});	
});

// Delete a Rounting Comment
router.post("/remove/comment/:id", function(req, res){
	var commentId = req.params.id;
	comment.findIdandRemove(commentId, function(err, result) {
		if (err) {
			console.log(err);
		} else {
			res.send(result);
		}
	});
});

// Export router
module.exports = router;