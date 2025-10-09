import Test from "../models/test.model";
import Question from "../models/quiz.model";

const MARKS = { MCQ: 3, SAQ: 1, LAQ: 5 };

export async function submitTest(userId: string, subject: string, type: "MCQ" | "SAQ" | "LAQ" | "mixed", answers: { questionId: string, selectedOption: string }[]) {
  // fetch actual questions
  const questionIds = answers.map(a => a.questionId);
  const questions = await Question.find({ _id: { $in: questionIds } });

  let total = 0;
  const answerData = answers.map((ans:any) => {
    const question = questions.find((q:any) => q._id.toString() === ans.questionId);
    if (!question) throw new Error("Question not found: " + ans.questionId);

    const correct = question.answer === ans.selectedOption;
    const marks = correct ? MARKS[question.type as keyof typeof MARKS] : 0;
    total += marks;

    return { questionId: question._id, selectedOption: ans.selectedOption, correct, marks };
  });

  const test = await Test.create({
    user: userId,
    subject,
    type,
    questions: questionIds,
    answers: answerData,
    total
  });

  return test;
}
