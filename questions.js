const SHEET_ID = "1ASwq5ePVyvHaxw69ESD7i_sliLNALuLUBdU1N1osD18";
const SHEET_NAME = "Sheet1";

let questions = [];

async function loadQuestions() {
  if (questions.length > 0) return; // Already loaded

  const url = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;
  const res = await fetch(url);
  const data = await res.json();

  questions = data.map(row => ({
    category: row.Category,
    topic: row.Topic,
    question: row.Question,
    answers: [row.A, row.B, row.C, row.D],
    correct: ["A","B","C","D"].indexOf(row.Correct),
    uniqueId: `${row.Category}_${row.Topic}_${row.Question}` // unique identifier for tracking
  }));
}

// Expose to global
window.loadQuestions = loadQuestions;
window.questions = questions;
