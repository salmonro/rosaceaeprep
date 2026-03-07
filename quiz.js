let filteredQuestions = [];
let current = 0;
let currentCategory = "";
let currentTopic = "";

/**
 * Start quiz with a category (e.g., "USABO" or "AP Bio")
 */
async function startQuiz(category) {
    await loadQuestions(); // ensure questions are loaded
    currentCategory = category;

    // If topic is empty, show all questions in category
    currentTopic = "";
    filteredQuestions = questions.filter(q => q.category === category);
    current = 0;
    loadQuestion();
}

/**
 * Filter questions by topic
 */
async function filterTopic(topic) {
    await loadQuestions(); // make sure questions are loaded

    currentTopic = topic;
    filteredQuestions = questions.filter(
        q => q.category === currentCategory && q.topic === topic
    );

    current = 0;
    loadQuestion();
}

/**
 * Load the current question and update answers + progress
 */
function loadQuestion() {
    const questionEl = document.getElementById("question");
    const answersEl = document.getElementById("answers");

    if (filteredQuestions.length === 0) {
        questionEl.innerHTML = "No questions found.";
        answersEl.innerHTML = "";
        updateProgress(0, 0, currentTopic || currentCategory);
        return;
    }

    const q = filteredQuestions[current];
    questionEl.innerHTML = q.question;

    // Clear previous answers
    answersEl.innerHTML = "";

    q.answers.forEach((a, i) => {
        const btn = document.createElement("button");
        btn.className = "answer";
        btn.innerText = a;
        btn.onclick = () => checkAnswer(i);
        answersEl.appendChild(btn);
    });

    // Update progress bar
    updateProgress(current, filteredQuestions.length, currentTopic || currentCategory);
}

/**
 * Check the selected answer
 */
function checkAnswer(i) {
    const q = filteredQuestions[current];
    const buttons = document.querySelectorAll("#answers button");

    buttons.forEach((btn, index) => {
        if (index === q.correct) {
            btn.classList.add("correct");
        } else if (index === i && i !== q.correct) {
            btn.classList.add("wrong");
        }
    });
}

/**
 * Go to next question
 */
function nextQuestion() {
    if (filteredQuestions.length === 0) return;

    current++;
    if (current >= filteredQuestions.length) current = 0;
    loadQuestion();
}

/**
 * Update the progress bar
 */
function updateProgress(completed, total, category) {
    const bar = document.getElementById("progressBar");
    const text = document.getElementById("progressText");

    const percent = total === 0 ? 0 : ((completed + 1) / total) * 100; // +1 for human-friendly
    if (bar) bar.style.width = percent + "%";
    if (text) text.innerText = `${completed + 1}/${total} questions of ${category} completed`;
}

// Expose functions globally
window.startQuiz = startQuiz;
window.filterTopic = filterTopic;
window.nextQuestion = nextQuestion;
