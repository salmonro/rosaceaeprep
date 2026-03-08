let filteredQuestions = [];
let current = 0;
let currentCategory = "";
let currentTopic = "";
let skipCompleted = true; // filter out completed questions
const STORAGE_KEY = "completedQuestions";

function getCompletedQuestions() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
}

function saveCompletedQuestion(category, topic, question) {
  const completed = getCompletedQuestions();
  if (!completed[category]) completed[category] = {};
  if (!completed[category][topic]) completed[category][topic] = [];
  if (!completed[category][topic].includes(question)) {
    completed[category][topic].push(question);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
}

function updateTopicDropdown() {
  const topicSelect = document.getElementById("topicSelect");
  const completed = getCompletedQuestions();
  Array.from(topicSelect.options).forEach(option => {
    const cat = currentCategory;
    const topic = option.value;
    const done = completed[cat]?.[topic]?.length || 0;
    option.text = done ? `${topic} ✔️` : topic;
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function startQuiz(category, topic = null) {
  await loadQuestions();

  currentCategory = category;
  currentTopic = topic || document.getElementById("topicSelect").value;

  const completed = getCompletedQuestions();
  filteredQuestions = questions.filter(q => q.category === currentCategory && q.topic === currentTopic);

  if (skipCompleted) {
    filteredQuestions = filteredQuestions.filter(q => !(completed[currentCategory]?.[currentTopic]?.includes(q.question)));
  }

  shuffleArray(filteredQuestions);

  current = 0;
  updateTopicDropdown();
  loadQuestion();
  updateProgressBar();
}

function filterTopic(topic) {
  currentTopic = topic;
  startQuiz(currentCategory, currentTopic);
}

function loadQuestion() {
  const questionEl = document.getElementById("question");
  const answersEl = document.getElementById("answers");

  if (filteredQuestions.length === 0) {
    questionEl.innerText = "No questions left in this category/topic.";
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

  // Save question as completed if answered
  saveCompletedQuestion(currentCategory, currentTopic, q.question);
  updateTopicDropdown();
}

function nextQuestion() {
  if (filteredQuestions.length === 0) return;

  current++;
  if (current >= filteredQuestions.length) {
    current = 0;
  }

  loadQuestion();
}

function skipQuestion() {
  nextQuestion();
}

function updateProgressBar() {
  const bar = document.getElementById("progressBar");
  const text = document.getElementById("progressText");

  const total = filteredQuestions.length;
  const completed = current;
  const percent = total === 0 ? 100 : (completed / total) * 100;
  bar.style.width = percent + "%";
  text.innerText = `${completed}/${total} questions of ${currentTopic} completed`;
}

window.startQuiz = startQuiz;
window.filterTopic = filterTopic;
window.nextQuestion = nextQuestion;
window.skipQuestion = skipQuestion;
