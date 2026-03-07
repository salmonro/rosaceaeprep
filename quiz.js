// quiz.js
let filteredQuestions = [];
let current = 0;
let currentTopic = ""; // stores the current category/topic

async function startQuiz(category) {
  await loadQuestions(); // load all questions
  currentTopic = category;

  // filter only the questions for the initial category
  filteredQuestions = questions.filter(q => q.category === currentTopic);

  current = 0;
  loadQuestion();
  updateProgressBar();
}

// switch topics within the same category (like a select dropdown)
function filterTopic(topic) {
  currentTopic = topic;
  filteredQuestions = questions.filter(q => q.category === currentTopic);
  current = 0;
  loadQuestion();
  updateProgressBar();
}

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

function checkAnswer(i) {
  const q = filteredQuestions[current];
  const buttons = document.querySelectorAll("#answers button");

  buttons.forEach((btn, index) => {
    if (index === q.correct) {
      btn.classList.add("correct");
    }
    if (index === i && i !== q.correct) {
      btn.classList.add("wrong");
    }
  });
}

function nextQuestion() {
  current++;
  if (current >= filteredQuestions.length) {
    current = 0; // loop back to start
  }
  loadQuestion();
}

// Smooth progress bar animation
let progressAnimation = null;
function updateProgressBar() {
  const total = filteredQuestions.length;
  const completed = Math.min(current, total);
  const bar = document.getElementById("progressBar");
  const text = document.getElementById("progressText");
  const targetPercent = total === 0 ? 0 : (completed / total) * 100;

  text.innerText = `${completed}/${total} questions of ${currentTopic} completed`;

  if (progressAnimation) cancelAnimationFrame(progressAnimation);

  const startPercent = parseFloat(bar.style.width) || 0;

  function animateProgress() {
    let currentPercent = parseFloat(bar.style.width) || 0;
    if (Math.abs(currentPercent - targetPercent) < 0.5) {
      bar.style.width = targetPercent + "%";
      return;
    }
    currentPercent += (targetPercent - currentPercent) / 5; // smoothing factor
    bar.style.width = currentPercent + "%";
    progressAnimation = requestAnimationFrame(animateProgress);
  }

  progressAnimation = requestAnimationFrame(animateProgress);
}
