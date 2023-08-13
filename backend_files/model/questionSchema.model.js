const mongoose = require("mongoose");
const { stringify } = require("querystring");

const questionSchema = mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
  },
  options: {
    type: [String],
  },
});

//FOR CHANING _id to id
questionSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

questionSchema.set("toJSON", {
  virtuals: true,
});

exports.Question = mongoose.model("Question", questionSchema);
