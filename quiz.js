let filteredQuestions = [];
let current = 0;

async function startQuiz(category){

await loadQuestions();

filteredQuestions = questions.filter(q => q.category === category);

current = 0;

loadQuestion();

}

function filterTopic(topic){

filteredQuestions = questions.filter(
q => q.category === "USABO" && q.topic === topic
);

current = 0;

loadQuestion();

}

function loadQuestion(){

if(filteredQuestions.length === 0){
document.getElementById("question").innerHTML = "No questions found.";
return;
}

const q = filteredQuestions[current];

document.getElementById("question").innerHTML = q.question;

const answers = document.getElementById("answers");

answers.innerHTML = "";

q.answers.forEach((a,i)=>{

const btn = document.createElement("button");

btn.innerText = a;

btn.onclick = ()=>checkAnswer(i);

answers.appendChild(btn);

});

}

function checkAnswer(i){

const q = filteredQuestions[current];

const buttons = document.querySelectorAll("#answers button");

buttons.forEach((btn,index)=>{

if(index === q.correct){
btn.style.background = "green";
}

if(index === i && i !== q.correct){
btn.style.background = "red";
}

});

}

function nextQuestion(){

current++;

if(current >= filteredQuestions.length){
current = 0;
}

loadQuestion();

}
