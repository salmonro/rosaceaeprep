let filteredQuestions = [];
let current = 0;
let currentCategory = "";
let currentTopic = "";

// Start quiz for a category (USABO / AP Bio)
async function startQuiz(category) {
  await loadQuestions(); // load all questions
  currentCategory = category;

  // Automatically pick the first topic in the select dropdown
  const topicSelect = document.getElementById("topicSelect");
  if (topicSelect && topicSelect.options.length > 0) {
    currentTopic = topicSelect.options[0].value;
  } else {
    currentTopic = ""; // fallback if no select
  }

  filterTopic(currentTopic); // immediately filter by first topic
}

// Filter questions by topic within the current category
function filterTopic(topic) {
  currentTopic = topic;
  filteredQuestions = questions.filter(
    q => q.category === currentCategory && q.topic === currentTopic
  );
  current = 0;
  updateProgressBar();
  loadQuestion();
}

// Load the current question
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

// Check answer colors
function checkAnswer(i) {
  const q = filteredQuestions[current];
  const buttons = document.querySelectorAll("#answers button");

  buttons.forEach((btn, index) => {
    if (index === q.correct) btn.classList.add("correct");
    if (index === i && i !== q.correct) btn.classList.add("wrong");
  });
}

// Next question
function nextQuestion() {
  current++;
  if (current >= filteredQuestions.length) current = 0;
  loadQuestion();
}

// Progress bar update
function updateProgressBar() {
  const total = filteredQuestions.length;
  const completed = current;
  const bar = document.getElementById("progressBar");
  const text = document.getElementById("progressText");
  const percent = total === 0 ? 0 : (completed / total) * 100;
  bar.style.width = percent + "%";
  text.innerText = `${completed}/${total} questions of ${currentTopic} completed`;
}
