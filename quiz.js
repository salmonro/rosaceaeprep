let filteredQuestions = [];
let current = 0;
let currentCategory = "";
let currentTopic = "";
let skipCompleted = true; // Option to skip completed questions

async function startQuiz(category, topic = null, skipDone = true) {
  await loadQuestions();

  currentCategory = category;
  currentTopic = topic || document.getElementById("topicSelect").value;
  skipCompleted = skipDone;

  // Filter questions for category & topic
  filteredQuestions = questions.filter(q => q.category === currentCategory && q.topic === currentTopic);

  // Filter out completed questions if desired
  const user = localStorage.getItem("currentUser") || "guest";
  const progress = JSON.parse(localStorage.getItem("progress_" + user) || "{}");
  if (skipCompleted) {
    filteredQuestions = filteredQuestions.filter((q, index) => {
      return !(progress[currentCategory]?.[currentTopic]?.[index]);
    });
  }

  // Shuffle questions
  shuffleArray(filteredQuestions);

  current = 0;
  loadQuestion();
  updateProgressBar();
}

// Simple shuffle function
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function loadQuestion() {
  const questionEl = document.getElementById("question");
  const answersEl = document.getElementById("answers");

  if (filteredQuestions.length === 0) {
    questionEl.innerText = "No questions available (all completed or none in this topic).";
    answersEl.innerHTML = "";
    updateProgressBar();
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
  const user = localStorage.getItem("currentUser") || "guest";
  const progress = JSON.parse(localStorage.getItem("progress_" + user) || "{}");
  if (!progress[currentCategory]) progress[currentCategory] = {};
  if (!progress[currentCategory][currentTopic]) progress[currentCategory][currentTopic] = {};
  progress[currentCategory][currentTopic][current] = true;
  localStorage.setItem("progress_" + user, JSON.stringify(progress));

  // Update checkmarks on topic list
  if (typeof markCompletedTopics === "function") markCompletedTopics();
}

function nextQuestion(skip = false) {
  if (filteredQuestions.length === 0) return;

  if (skip) {
    current++;
    if (current >= filteredQuestions.length) current = 0;
  } else {
    current++;
    if (current >= filteredQuestions.length) current = 0;
  }

  loadQuestion();
}

function updateProgressBar() {
  const bar = document.getElementById("progressBar");
  const text = document.getElementById("progressText");

  const total = filteredQuestions.length;
  const completed = filteredQuestions.filter((q, index) => {
    const user = localStorage.getItem("currentUser") || "guest";
    const progress = JSON.parse(localStorage.getItem("progress_" + user) || "{}");
    return progress[currentCategory]?.[currentTopic]?.[index];
  }).length;

  const percent = total === 0 ? 0 : (completed / total) * 100;
  bar.style.width = percent + "%";
  text.innerText = `${completed}/${total} questions of ${currentTopic} completed`;
}
