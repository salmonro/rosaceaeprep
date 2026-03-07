let filteredQuestions = [];
let current = 0;
let currentCategory = "";
let answeredQuestions = {}; // tracks answered questions per category/topic

async function startQuiz(category) {
  await loadQuestions();

  currentCategory = category;

  // initialize answeredQuestions if not already
  if (!answeredQuestions[currentCategory]) answeredQuestions[currentCategory] = new Set();

  filteredQuestions = questions.filter(q => q.category === category);
  current = 0;

  loadQuestion();
  updateProgress();
}

function filterTopic(topic) {
  filteredQuestions = questions.filter(
    q => q.category === currentCategory && q.topic === topic
  );

  current = 0;

  // initialize answeredQuestions for this topic/unit
  const key = `${currentCategory} - ${topic}`;
  if (!answeredQuestions[key]) answeredQuestions[key] = new Set();

  loadQuestion();
  updateProgress();
}

function loadQuestion() {
  if (filteredQuestions.length === 0) {
    document.getElementById("question").innerHTML = "No questions found.";
    document.getElementById("answers").innerHTML = "";
    updateProgress();
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

  updateProgress();
}

function checkAnswer(i) {
  const q = filteredQuestions[current];
  const buttons = document.querySelectorAll("#answers button");

  buttons.forEach((btn, index) => {
    if (index === q.correct) btn.style.background = "green";
    if (index === i && i !== q.correct) btn.style.background = "red";
  });

  // mark question as answered
  const key = q.topic ? `${currentCategory} - ${q.topic}` : currentCategory;
  answeredQuestions[key].add(current);
  updateProgress();
}

function nextQuestion() {
  current++;
  if (current >= filteredQuestions.length) current = 0;
  loadQuestion();
}

// ----------------- Progress Bar -----------------
function updateProgress() {
  const progressContainer = document.getElementById("progressContainer");
  if (!progressContainer) return;

  const key = filteredQuestions[current]?.topic
    ? `${currentCategory} - ${filteredQuestions[current].topic}`
    : currentCategory;

  const answered = answeredQuestions[key] ? answeredQuestions[key].size : 0;
  const total = filteredQuestions.length;

  // create progress bar HTML
  const barWidth = total ? (answered / total) * 100 : 0;

  progressContainer.innerHTML = `
    <div style="width: 80%; background: rgba(255,255,255,0.2); height: 18px; border-radius: 10px; margin: 0 auto;">
      <div style="width: ${barWidth}%; background: white; height: 100%; border-radius: 10px; transition: width 0.3s;"></div>
    </div>
    <div id="progressText">${answered}/${total} questions of ${key} completed</div>
  `;
}
