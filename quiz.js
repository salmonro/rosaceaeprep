let filteredQuestions = [];
let current = 0;
let currentCategory = "";
let currentTopic = "";
let showOnlyUncompleted = false;

function getStorageKey(category, topic) {
  return `completed_${category}_${topic}`;
}

// Retrieve completed questions from localStorage
function getCompleted(category, topic) {
  const key = getStorageKey(category, topic);
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}

// Check if a question is completed
function isCompleted(category, topic, id) {
  const completed = getCompleted(category, topic);
  return completed.includes(id);
}

// Mark a question as completed
function markCompleted(category, topic, id) {
  const completed = getCompleted(category, topic);
  if (!completed.includes(id)) {
    completed.push(id);
    localStorage.setItem(getStorageKey(category, topic), JSON.stringify(completed));
  }
}

// Shuffle questions
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function startQuiz(category, topic = null) {
  await loadQuestions();

  currentCategory = category;
  currentTopic = topic || document.getElementById("topicSelect").value;

  filteredQuestions = questions.filter(q => q.category === currentCategory && q.topic === currentTopic);

  applyFilters();

  current = 0;
  loadQuestion();
  updateProgressBar();
}

function applyFilters() {
  filteredQuestions = questions.filter(q => q.category === currentCategory && q.topic === currentTopic);
  if (showOnlyUncompleted) {
    filteredQuestions = filteredQuestions.filter(q => !isCompleted(currentCategory, currentTopic, q.uniqueId));
  }
  filteredQuestions = shuffle(filteredQuestions);
}

function filterTopic(topic) {
  currentTopic = topic;
  applyFilters();
  current = 0;
  loadQuestion();
  updateProgressBar();
}

function toggleFilter() {
  showOnlyUncompleted = !showOnlyUncompleted;
  applyFilters();
  current = 0;
  loadQuestion();
  updateProgressBar();
}

function loadQuestion() {
  const questionEl = document.getElementById("question");
  const answersEl = document.getElementById("answers");
  const skipBtn = document.getElementById("skipBtn");

  if (filteredQuestions.length === 0) {
    questionEl.innerText = "No questions found for this category/topic.";
    answersEl.innerHTML = "";
    skipBtn.style.display = "none";
    updateProgressBar();
    return;
  }

  const q = filteredQuestions[current];
  questionEl.innerHTML = q.question;

  // Show skip button only if completed
  skipBtn.style.display = isCompleted(currentCategory, currentTopic, q.uniqueId) ? "inline-block" : "none";

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

  // Mark completed
  markCompleted(currentCategory, currentTopic, q.uniqueId);

  // Show skip button after completion
  document.getElementById("skipBtn").style.display = "inline-block";

  updateProgressBar();
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

function updateProgressBar() {
  const bar = document.getElementById("progressBar");
  const text = document.getElementById("progressText");

  const total = filteredQuestions.length;
  const completedCount = filteredQuestions.filter(q => isCompleted(currentCategory, currentTopic, q.uniqueId)).length;

  const percent = total === 0 ? 0 : (completedCount / total) * 100;
  bar.style.width = percent + "%";
  text.innerText = `${completedCount}/${total} questions of ${currentTopic} completed`;
}

window.startQuiz = startQuiz;
window.filterTopic = filterTopic;
window.nextQuestion = nextQuestion;
window.skipQuestion = skipQuestion;
window.toggleFilter = toggleFilter;
