let filteredQuestions = [];
let current = 0;
let currentCategory = "";
let currentTopic = "";

// Start quiz by category (e.g., "USABO" or "AP Bio")
async function startQuiz(category) {
  await loadQuestions();

  currentCategory = category;
  currentTopic = ""; // default: all topics/units
  filteredQuestions = questions.filter(q => q.category === category);
  current = 0;

  createProgressBar();
  loadQuestion();
  updateProgressBar();
}

// Filter questions by topic/unit
function filterTopic(topic) {
  currentTopic = topic;
  filteredQuestions = questions.filter(
    q => q.category === currentCategory && q.topic === topic
  );
  current = 0;

  loadQuestion();
  updateProgressBar();
}

// Load current question
function loadQuestion() {
  const questionEl = document.getElementById("question");
  const answersEl = document.getElementById("answers");

  if (filteredQuestions.length === 0) {
    questionEl.innerHTML = "No questions found.";
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
    btn.classList.add("answer");
    btn.onclick = () => checkAnswer(i);
    answersEl.appendChild(btn);
  });

  updateProgressBar();
}

// Check answer
function checkAnswer(i) {
  const q = filteredQuestions[current];
  const buttons = document.querySelectorAll("#answers button");

  buttons.forEach((btn, index) => {
    if (index === q.correct) btn.style.background = "green";
    if (index === i && i !== q.correct) btn.style.background = "red";
  });

  // Mark this question as completed
  q.completed = true;

  updateProgressBar();
}

// Next question
function nextQuestion() {
  current++;
  if (current >= filteredQuestions.length) current = 0;
  loadQuestion();
}

// ----------------------
// Progress Bar Functions
// ----------------------
function createProgressBar() {
  if (document.getElementById("progressContainer")) return;

  const container = document.createElement("div");
  container.id = "progressContainer";
  container.style.width = "80%";
  container.style.maxWidth = "600px";
  container.style.height = "24px";
  container.style.background = "rgba(255,255,255,0.15)";
  container.style.borderRadius = "12px";
  container.style.margin = "20px auto";
  container.style.overflow = "hidden";

  const bar = document.createElement("div");
  bar.id = "progressBar";
  bar.style.height = "100%";
  bar.style.width = "0%";
  bar.style.background = "rgba(255,255,255,0.8)";
  bar.style.transition = "width 0.3s ease";

  const text = document.createElement("div");
  text.id = "progressText";
  text.style.position = "absolute";
  text.style.width = "100%";
  text.style.textAlign = "center";
  text.style.color = "white";
  text.style.fontWeight = "bold";
  text.style.marginTop = "-24px"; // place text inside bar

  container.appendChild(bar);
  container.appendChild(text);

  document.body.insertBefore(container, document.getElementById("question"));
}

// Update progress bar
function updateProgressBar() {
  const progressContainer = document.getElementById("progressContainer");
  const bar = document.getElementById("progressBar");
  const text = document.getElementById("progressText");

  if (!progressContainer || !bar || !text) return;

  let relevantQuestions = questions.filter(q =>
    q.category === currentCategory &&
    (currentTopic === "" || q.topic === currentTopic)
  );

  let completedCount = relevantQuestions.filter(q => q.completed).length;
  let totalCount = relevantQuestions.length;

  const percent = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;
  bar.style.width = percent + "%";
  text.innerText = `${completedCount}/${totalCount} questions of ${currentTopic || currentCategory} completed`;
}
