var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const { Question } = require("../model/questionSchema.model");
const { options } = require("./admin");

/* GET questions listing. */
router.get(`/`, async function (req, res, next) {
  const question = await Question.find().sort({ questionNumber: 1 });
  if (!question) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(question);
});

//GET QUESTION THROUGH ID
router.get("/:id", async function (req, res, next) {
  const question = await Question.findById(req.params.id);
  if (!question) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(question);
});

//ADD A QUESTION
router.post("/add", async function (req, res, next) {
  const option = req.body.options;
  const quesNum = parseInt(req.body.questionNumber);
  let updatedOptions = null;
  if (option != "") {
    updatedOptions = option.split(",");
  }
  await addQuestionNumbers(quesNum);
  let question = new Question({
    questionNumber: req.body.questionNumber,
    question: req.body.question,
    type: req.body.type,
    options: updatedOptions,
    tag: req.body.tag,
  });

  question = await question.save();
  if (!question) {
    return res.status(404).send("Question cannot be added");
  }

  res.send(question);
});

//UPDATE A QUESTION
router.put("/add/:id", async (req, res) => {
  const ques = await Question.findById(req.params.id);
  const existQuesNum = parseInt(ques.questionNumber);
  const option = req.body.options;
  const quesNum = parseInt(req.body.questionNumber);

  if (quesNum != existQuesNum) {
    await updateQuestionNumbers(quesNum, existQuesNum);
  }
  let updatedOptions = null;
  if (option != "" && option != null && typeof option == "string") {
    updatedOptions = option.split(",");
  } else {
    updatedOptions = option;
  }
  const question = await Question.findByIdAndUpdate(
    req.params.id,
    {
      questionNumber: req.body.questionNumber,
      question: req.body.question,
      type: req.body.type,
      options: updatedOptions,
      tag: req.body.tag,
    },
    { new: true }
  );
  if (!question) {
    return res.status(400).send("Question cannot be updated");
  }
  res.send(question);
});

//Delete A Question
router.delete("/delete/:id", (req, res) => {
  Question.findByIdAndRemove(req.params.id)
    .then(async (question) => {
      if (question) {
        await delQuestionNumbers(parseInt(question.questionNumber));
        return res
          .status(200)
          .json({ success: true, message: "The question is deleted" });
      } else {
        return res.status(404).json({
          success: false,
          message: "The question not found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ success: false, error: err });
    });
});

//ADD UPDATE QUESTION NUMBER
async function addQuestionNumbers(startIndex) {
  const questions = await Question.find({
    questionNumber: { $gte: startIndex },
  });

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    question.questionNumber += 1;
    await question.save();
  }
}

//UPDATE QUESTION NUMBER
async function updateQuestionNumbers(startIndex, existQuesNum) {
  if (startIndex > existQuesNum) {
    const questions = await Question.find({
      questionNumber: { $gt: existQuesNum, $lte: startIndex },
    });
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      question.questionNumber -= 1;
      await question.save();
    }
  } else if (startIndex < existQuesNum) {
    const questions = await Question.find({
      questionNumber: { $gte: startIndex, $lt: existQuesNum },
    });
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      question.questionNumber += 1;
      await question.save();
    }
  }
}

//DELETE QUESTION NUMBER
async function delQuestionNumbers(startIndex) {
  const questions = await Question.find({
    questionNumber: { $gte: startIndex },
  });
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    question.questionNumber -= 1;
    await question.save();
  }
}

module.exports = router;
