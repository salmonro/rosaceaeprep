let filteredQuestions = [];
let current = 0;
let currentCategory = "";
let currentTopic = "";

async function startQuiz(category, topic = null) {
  await loadQuestions();

  currentCategory = category;
  currentTopic = topic || document.getElementById("topicSelect").value;

  filteredQuestions = questions.filter(q => q.category === currentCategory && q.topic === currentTopic);

  // Shuffle questions
  for (let i = filteredQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filteredQuestions[i], filteredQuestions[j]] = [filteredQuestions[j], filteredQuestions[i]];
  }

  current = 0;
  loadQuestion();
  updateProgressBar();
}

function filterTopic(topic) {
  currentTopic = topic;
  toggleFilterUncompleted(); // Respect filter setting
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

  const completedQuestions = JSON.parse(localStorage.getItem("completedQuestions") || "[]");
  const isCompleted = completedQuestions.includes(q.question);

  questionEl.innerText = (isCompleted ? "✅ " : "") + q.question;

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

  // Save completed if correct
  if (i === q.correct) {
    let completedQuestions = JSON.parse(localStorage.getItem("completedQuestions") || "[]");
    if (!completedQuestions.includes(q.question)) {
      completedQuestions.push(q.question);
      localStorage.setItem("completedQuestions", JSON.stringify(completedQuestions));
    }
    document.getElementById("question").innerText = "✅ " + q.question;
  }
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
  const showOnlyUncompleted = document.getElementById("filterUncompleted")?.checked || false;
  const completedQuestions = JSON.parse(localStorage.getItem("completedQuestions") || "[]");

  if (!showOnlyUncompleted) {
    filteredQuestions = questions.filter(q => q.category === currentCategory && q.topic === currentTopic);
  } else {
    filteredQuestions = questions.filter(q => q.category === currentCategory && q.topic === currentTopic && !completedQuestions.includes(q.question));
  }

  // Shuffle questions
  for (let i = filteredQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filteredQuestions[i], filteredQuestions[j]] = [filteredQuestions[j], filteredQuestions[i]];
  }

  current = 0;
  loadQuestion();
}

function clearProgress() {
  localStorage.removeItem("completedQuestions");
  toggleFilterUncompleted();
}

function updateProgressBar() {
  const bar = document.getElementById("progressBar");
  const text = document.getElementById("progressText");

  const total = filteredQuestions.length;
  const completedQuestions = JSON.parse(localStorage.getItem("completedQuestions") || "[]");
  const completed = filteredQuestions.filter(q => completedQuestions.includes(q.question)).length;

  const percent = total === 0 ? 0 : (completed / total) * 100;
  bar.style.width = percent + "%";
  text.innerText = `${completed}/${total} questions of ${currentTopic} completed`;
}

window.startQuiz = startQuiz;
window.filterTopic = filterTopic;
window.nextQuestion = nextQuestion;
window.skipQuestion = skipQuestion;
window.toggleFilterUncompleted = toggleFilterUncompleted;
window.clearProgress = clearProgress;
