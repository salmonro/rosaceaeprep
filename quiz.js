let filteredQuestions = [];
let current = 0;
let currentCategory = "";
let currentTopic = "";

function getCurrentUser() {
  return localStorage.getItem("currentUser") || "guest";
}

function getProgress() {
  const user = getCurrentUser();
  const saved = localStorage.getItem("progress_" + user);
  return saved ? JSON.parse(saved) : {};
}

function saveProgress() {
  const user = getCurrentUser();
  localStorage.setItem("progress_" + user, JSON.stringify(progress));
}

let progress = getProgress();

async function startQuiz(category, topic = null) {
  await loadQuestions();

  currentCategory = category;
  currentTopic = topic || document.getElementById("topicSelect").value;

  filteredQuestions = questions.filter(q => q.category === currentCategory && q.topic === currentTopic);
  current = 0;

  loadQuestion();
  updateProgressBar();
}

function filterTopic(topic) {
  currentTopic = topic;
  filteredQuestions = questions.filter(q => q.category === currentCategory && q.topic === topic);
  current = 0;
  loadQuestion();
  updateProgressBar();
}

function loadQuestion() {
  const questionEl = document.getElementById("question");
  const answersEl = document.getElementById("answers");

  if (filteredQuestions.length === 0) {
    questionEl.innerText = "No questions found for this category/topic.";
    answersEl.innerHTML = "";
    updateProgressBar();
    return;
  }

  const q = filteredQuestions[current];
  questionEl.innerHTML = q.question;

  answersEl.innerHTML = "";
  q.answers.forEach((a, i) => {
    const btn = document.createElement("button");
    btn.innerText = a;
    btn.className = "answer";
    if (progress[currentCategory]?.[currentTopic]?.[current] === true) {
      btn.innerText = "✔ " + btn.innerText; // add checkmark if completed
    }
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

  // Save progress
  const user = getCurrentUser();
  if (!progress[currentCategory]) progress[currentCategory] = {};
  if (!progress[currentCategory][currentTopic]) progress[currentCategory][currentTopic] = {};
  progress[currentCategory][currentTopic][current] = true;
  saveProgress();

  // Add checkmark to button
  buttons[q.correct].innerText = "✔ " + buttons[q.correct].innerText;
}

function nextQuestion() {
  if (filteredQuestions.length === 0) return;

  current++;
  if (current >= filteredQuestions.length) current = 0;

  loadQuestion();
}

function updateProgressBar() {
  const bar = document.getElementById("progressBar");
  const text = document.getElementById("progressText");

  const total = filteredQuestions.length;
  const completed = Object.values(progress[currentCategory]?.[currentTopic] || {}).length;

  const percent = total === 0 ? 0 : (completed / total) * 100;
  bar.style.width = percent + "%";
  text.innerText = `${completed}/${total} questions of ${currentTopic} completed`;
}

window.startQuiz = startQuiz;
window.filterTopic = filterTopic;
window.nextQuestion = nextQuestion;
