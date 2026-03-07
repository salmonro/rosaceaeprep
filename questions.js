// questions.js
const SHEET_ID = "1ASwq5ePVyvHaxw69ESD7i_sliLNALuLUBdU1N1osD18";
const SHEET_NAME = "Sheet1";

let questions = [];

async function loadQuestions() {
  const url = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;
  const res = await fetch(url);
  const data = await res.json();

  questions = data.map(row => ({
    category: (row.Category || "").trim(), // normalize category
    topic: (row.Topic || "").trim(),       // normalize topic
    question: (row.Question || "").trim(),
    answers: [
      (row.A || "").trim(),
      (row.B || "").trim(),
      (row.C || "").trim(),
      (row.D || "").trim()
    ],
    correct: ["A", "B", "C", "D"].indexOf((row.Correct || "").trim())
  }));
}

// expose globally
window.loadQuestions = loadQuestions;
window.questions = questions;
