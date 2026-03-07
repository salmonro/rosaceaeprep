let filteredQuestions = [];
let current = 0;
let currentCategory = "";
let currentTopic = "";

// Key for localStorage
function storageKey(category, topic) {
  return `progress_${category}_${topic}`;
}

// Get completed count from localStorage
function getCompleted(category, topic) {
  return parseInt(localStorage.getItem(storageKey(category, topic)) || 0);
}

// Save completed count to localStorage
function setCompleted(category, topic, completed) {
  localStorage.setItem(storageKey(category, topic), completed);
}

// Start quiz
async function startQuiz(category) {
  await loadQuestions();
  currentCategory = category;

  const topicSelect = document.getElementById("topicSelect");
  if (topicSelect && topicSelect.options.length > 0) {
    currentTopic = topicSelect.options[0].value;
    topicSelect.value = currentTopic;
  }

  filterTopic(currentTopic);
}

// Filter questions
function filterTopic(topic) {
  currentTopic = topic;
  filteredQuestions = questions.filter(
    q => q.category === currentCategory && q.topic === currentTopic
  );
  current = getCompleted(currentCategory, currentTopic);
  loadQuestion();
}

// Load question
function loadQuestion() {
  if (filteredQuestions.length === 0) {
    document.getElementById("question").innerHTML = "No questions found.";
    document.getElementById("answers").innerHTML = "";
    updateProgressBar();
    return;
  }

  const q = filteredQuestions[current];
  document.getElementById("question").innerHTML = q.question;

  const answers = document.getElementById("answers");
  answers.innerHTML = "";

  q.answers.forEach((a, i) => {
    const btn = document.createElement("button");
    btn.innerText = a;
    btn.onclick = () => checkAnswer(i);
    answers.appendChild(btn);
  });

  updateProgressBar();
}

// Check answer
function checkAnswer(i) {
  const q = filteredQuestions[current];
  const buttons = document.querySelectorAll("#answers button");

  buttons.forEach((btn, index) => {
    if (index === q.correct) btn.classList.add("correct");
    if (index === i && i !== q.correct) btn.classList.add("wrong");
  });

  // Mark this question as completed
  setCompleted(currentCategory, currentTopic, current + 1);
  updateProgressBar();
}

// Next question
function nextQuestion() {
  current++;
  if (current >= filteredQuestions.length) current = 0;
  setCompleted(currentCategory, currentTopic, current);
  loadQuestion();
}

// Update progress bar
function updateProgressBar() {
  const total = filteredQuestions.length;
  const completed = Math.min(current, total);
  const bar = document.getElementById("progressBar");
  const text = document.getElementById("progressText");
  const percent = total === 0 ? 0 : (completed / total) * 100;
  bar.style.width = percent + "%";
  text.innerText = `${completed}/${total} questions of ${currentTopic} completed`;
}
