let filteredQuestions = [];
let current = 0;
let currentCategory = "";
let progressKey = "quizProgress";

// Load saved progress from localStorage or initialize
let progress = JSON.parse(localStorage.getItem(progressKey)) || {};

// Start the quiz for a given category/unit
async function startQuiz(category) {
  await loadQuestions();

  currentCategory = category;

  filteredQuestions = questions.filter(q => q.category === category);

  current = 0;

  if (!progress[currentCategory]) {
    progress[currentCategory] = 0; // initialize if first time
  }

  loadQuestion();
  updateProgressBar();
}

// Filter by topic (e.g., for USABO units or AP Bio units)
function filterTopic(topic) {
  filteredQuestions = questions.filter(
    q => q.category === currentCategory && q.topic === topic
  );

  current = 0;
  if (!progress[topic]) {
    progress[topic] = 0;
  }
  updateProgressBar(topic);
  loadQuestion();
}

// Load a question
function loadQuestion() {
  if (filteredQuestions.length === 0) {
    document.getElementById("question").innerHTML = "No questions found.";
    document.getElementById("answers").innerHTML = "";
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
}

// Check the selected answer
function checkAnswer(i) {
  const q = filteredQuestions[current];
  const buttons = document.querySelectorAll("#answers button");

  buttons.forEach((btn, index) => {
    if (index === q.correct) btn.style.background = "green";
    if (index === i && i !== q.correct) btn.style.background = "red";
  });

  // Update progress
  const key = q.topic || currentCategory;
  progress[key] = (progress[key] || 0) + 1;
  localStorage.setItem(progressKey, JSON.stringify(progress));
  updateProgressBar(key);
}

// Move to the next question
function nextQuestion() {
  current++;
  if (current >= filteredQuestions.length) current = 0;
  loadQuestion();
}

// Update the progress bar
function updateProgressBar(key = currentCategory) {
  const container = document.getElementById("progressContainer");
  if (!container) return;

  const total = questions.filter(q => (q.topic || q.category) === key).length;
  const done = progress[key] || 0;

  const percent = Math.min((done / total) * 100, 100);

  container.innerHTML = `
    <div style="
      width: 80%;
      height: 12px;
      margin: 10px auto;
      background: rgba(255,255,255,0.15);
      border-radius: 6px;
      overflow: hidden;
    ">
      <div style="
        width: ${percent}%;
        height: 100%;
        background: white;
        transition: width 0.3s;
      "></div>
    </div>
    <div id="progressText">${done}/${total} questions of "${key}" completed</div>
  `;
}
