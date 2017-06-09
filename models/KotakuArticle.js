// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var KotakuArticleSchema = new Schema({
  // title is a required string
  title: {
    type: String,
    required: true
  },
  // link is a required string
  link: {
    type: String,
    required: true
  },
  // This only saves one note's ObjectId, ref refers to the Note model
  note: {
    type: Schema.Types.ObjectId,
    ref: "KotakuNote"
  }
});

// Create the Article model with the ArticleSchema
var KotakuArticle = mongoose.model("KotakuArticle", KotakuArticleSchema);

// Export the model
module.exports = KotakuArticle;