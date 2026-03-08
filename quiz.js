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

  filterQuestions();

  current = 0;
  loadQuestion();
  updateProgressBar();
}

function filterQuestions() {
  filteredQuestions = questions
    .filter(q => q.category === currentCategory && q.topic === currentTopic)
    .map((q, index) => ({ ...q, originalIndex: index }));

  // Apply "only uncompleted" filter
  if (showOnlyUncompleted) {
    filteredQuestions = filteredQuestions.filter(q => !isCompleted(currentCategory, currentTopic, q.originalIndex));
  }

  // Randomize questions
  filteredQuestions = shuffleArray(filteredQuestions);
}

function isCompleted(category, topic, index) {
  return completedQuestions[`${category}_${topic}_${index}`] === true;
}

function markCompleted(category, topic, index) {
  completedQuestions[`${category}_${topic}_${index}`] = true;
  localStorage.setItem("completedQuestions", JSON.stringify(completedQuestions));
}

function loadQuestion() {
  const questionEl = document.getElementById("question");
  const answersEl = document.getElementById("answers");

  if (filteredQuestions.length === 0) {
    questionEl.innerHTML = "No questions found for this category/topic.";
    answersEl.innerHTML = "";
    updateProgressBar();
    return;
  }

  const q = filteredQuestions[current];
  const completed = isCompleted(currentCategory, currentTopic, q.originalIndex);

  questionEl.innerHTML = `${q.question} ${completed ? "✅" : ""}`;

  answersEl.innerHTML = "";
  q.answers.forEach((a, i) => {
    const btn = document.createElement("button");
    btn.innerText = a;
    btn.className = "answer";
    btn.onclick = () => checkAnswer(i);
    answersEl.appendChild(btn);
  });

  updateProgressBar();
}

function checkAnswer(i) {
  const q = filteredQuestions[current];
  const buttons = document.querySelectorAll("#answers button");

  buttons.forEach((btn, index) => {
    if (index === q.correct) btn.classList.add("correct");
    if (index === i && i !== q.correct) btn.classList.add("wrong");
  });

  // Mark as completed if answered
  markCompleted(currentCategory, currentTopic, q.originalIndex);

  // Update checkmark
  const questionEl = document.getElementById("question");
  questionEl.innerHTML = `${q.question} ✅`;
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
  showOnlyUncompleted = document.getElementById("filterUncompleted").checked;
  filterQuestions();
  current = 0;
  loadQuestion();
  updateProgressBar();
}

function clearProgress() {
  if (confirm("Are you sure you want to clear all completed question progress?")) {
    completedQuestions = {};
    localStorage.setItem("completedQuestions", JSON.stringify(completedQuestions));
    loadQuestion();
  }
}

function updateProgressBar() {
  const bar = document.getElementById("progressBar");
  const text = document.getElementById("progressText");

  const total = filteredQuestions.length;
  const completed = filteredQuestions.filter(q => isCompleted(currentCategory, currentTopic, q.originalIndex)).length;

  const percent = total === 0 ? 0 : (completed / total) * 100;
  bar.style.width = percent + "%";
  text.innerText = `${completed}/${total} questions of ${currentTopic} completed`;
}

// Fisher-Yates shuffle
function shuffleArray(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Expose functions to global
window.startQuiz = startQuiz;
window.filterTopic = (topic) => {
  currentTopic = topic;
  filterQuestions();
  current = 0;
  loadQuestion();
  updateProgressBar();
};
window.nextQuestion = nextQuestion;
window.skipQuestion = skipQuestion;
window.toggleFilterUncompleted = toggleFilterUncompleted;
window.clearProgress = clearProgress;
