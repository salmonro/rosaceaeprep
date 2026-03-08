let filteredQuestions = [];
let current = 0;
let currentCategory = "";
let currentTopic = "";

// Load saved progress from localStorage
function getProgressKey(category, topic) {
  return `progress_${category}_${topic}`;
}

function loadProgress(category, topic) {
  const key = getProgressKey(category, topic);
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : [];
}

function saveProgress(category, topic, questionIndex) {
  const key = getProgressKey(category, topic);
  const completed = loadProgress(category, topic);
  if (!completed.includes(questionIndex)) {
    completed.push(questionIndex);
    localStorage.setItem(key, JSON.stringify(completed));
  }
}

async function startQuiz(category, topic = null) {
  await loadQuestions();

  currentCategory = category;
  currentTopic = topic || document.getElementById("topicSelect").value;

  filteredQuestions = questions.filter(
    (q) => q.category === currentCategory && q.topic === currentTopic
  );
  current = 0;

  loadQuestion();
  updateProgressBar();
}

function filterTopic(topic) {
  currentTopic = topic;
  filteredQuestions = questions.filter(
    (q) => q.category === currentCategory && q.topic === topic
  );
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
  q.questionID = current; // Assign unique ID

  questionEl.innerText = q.question;

  answersEl.innerHTML = "";
  const completedQuestions = loadProgress(currentCategory, currentTopic);

  q.answers.forEach((a, i) => {
    const btn = document.createElement("button");
    btn.innerText = a;
    btn.className = "answer";
    btn.onclick = () => checkAnswer(i);

    // Add checkmark if this question is completed
    if (completedQuestions.includes(current)) {
      const check = document.createElement("span");
      check.innerText = " ✔";
      check.style.color = "#ff8fb3";
      check.style.fontWeight = "bold";
      check.style.textShadow = "0 0 5px #ff8fb3";
      btn.appendChild(check);
    }

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

  // Save progress and show checkmark
  saveProgress(currentCategory, currentTopic, current);
  const btn = buttons[i];
  if (!btn.querySelector("span")) {
    const check = document.createElement("span");
    check.innerText = " ✔";
    check.style.color = "#ff8fb3";
    check.style.fontWeight = "bold";
    check.style.textShadow = "0 0 5px #ff8fb3";
    btn.appendChild(check);
  }

  updateProgressBar();
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
  const completedQuestions = loadProgress(currentCategory, currentTopic);
  const percent = total === 0 ? 0 : (completedQuestions.length / total) * 100;

  bar.style.width = percent + "%";
  text.innerText = `${completedQuestions.length}/${total} questions of ${currentTopic} completed`;
}

window.startQuiz = startQuiz;
window.filterTopic = filterTopic;
