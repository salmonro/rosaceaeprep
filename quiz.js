// quiz.js (updated for skip, checkmarks, filter)
let filteredQuestions = [];
let current = 0;
let currentCategory = "";
let currentTopic = "";
let showOnlyUncompleted = false;

// Load completed questions from localStorage
let completedQuestions = JSON.parse(localStorage.getItem("completedQuestions") || "{}");

async function startQuiz(category, topic = null) {
  await loadQuestions();

  currentCategory = category;
  currentTopic = topic || document.getElementById("topicSelect").value;

  filterAndRandomize();
  current = 0;
  loadQuestion();
  updateProgressBar();
}

function filterAndRandomize() {
  filteredQuestions = questions.filter(q => q.category === currentCategory && q.topic === currentTopic);
  
  if (showOnlyUncompleted) {
    filteredQuestions = filteredQuestions.filter(q => !isCompleted(q));
  }

  // Randomize
  for (let i = filteredQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filteredQuestions[i], filteredQuestions[j]] = [filteredQuestions[j], filteredQuestions[i]];
  }
}

function filterTopic(topic) {
  currentTopic = topic;
  filterAndRandomize();
  current = 0;
  loadQuestion();
  updateProgressBar();
}

function loadQuestion() {
  const questionEl = document.getElementById("question");
  const answersEl = document.getElementById("answers");
  const skipBtn = document.querySelector("button[onclick='skipQuestion()']");

  if (filteredQuestions.length === 0) {
    questionEl.innerText = "No questions found for this category/topic.";
    answersEl.innerHTML = "";
    updateProgressBar();
    skipBtn.style.display = "none";
    return;
  }

  const q = filteredQuestions[current];
  questionEl.innerText = q.question;

  answersEl.innerHTML = "";
  q.answers.forEach((a, i) => {
    const btn = document.createElement("button");
    btn.innerText = a;
    btn.className = "answer";
    btn.onclick = () => checkAnswer(i);
    if (isCompleted(q)) {
      btn.innerText += " ✔"; // add checkmark
    }
    answersEl.appendChild(btn);
  });

  // Show skip button only if completed
  skipBtn.style.display = isCompleted(q) ? "inline-block" : "none";

  updateProgressBar();
}

function checkAnswer(i) {
  const q = filteredQuestions[current];
  const buttons = document.querySelectorAll("#answers button");

  buttons.forEach((btn, index) => {
    if (index === q.correct) btn.classList.add("correct");
    if (index === i && i !== q.correct) btn.classList.add("wrong");
  });

  markCompleted(q);
  updateProgressBar();
}

function markCompleted(q) {
  const key = `${q.category}||${q.topic}||${q.question}`;
  completedQuestions[key] = true;
  localStorage.setItem("completedQuestions", JSON.stringify(completedQuestions));
}

function isCompleted(q) {
  const key = `${q.category}||${q.topic}||${q.question}`;
  return completedQuestions[key] || false;
}

function nextQuestion() {
  if (filteredQuestions.length === 0) return;

  current++;
  if (current >= filteredQuestions.length) current = 0;

  loadQuestion();
}

function skipQuestion() {
  nextQuestion();
}

function toggleFilterUncompleted() {
  showOnlyUncompleted = !showOnlyUncompleted;
  const btn = document.querySelector("button[onclick='toggleFilterUncompleted()']");
  btn.innerText = showOnlyUncompleted ? "Show All Questions" : "Show Only Uncompleted Questions";
  filterAndRandomize();
  current = 0;
  loadQuestion();
}

function updateProgressBar() {
  const bar = document.getElementById("progressBar");
  const text = document.getElementById("progressText");

  const total = filteredQuestions.length;
  const completed = filteredQuestions.filter(q => isCompleted(q)).length;

  const percent = total === 0 ? 0 : (completed / total) * 100;
  bar.style.width = percent + "%";
  text.innerText = `${completed}/${total} questions of ${currentTopic} completed`;
}

window.startQuiz = startQuiz;
window.filterTopic = filterTopic;
window.nextQuestion = nextQuestion;
window.skipQuestion = skipQuestion;
window.toggleFilterUncompleted = toggleFilterUncompleted;
