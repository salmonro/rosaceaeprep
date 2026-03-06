let current = 0;
let filteredQuestions = [];

/* Detect which page we are on */

const page = document.body.dataset.page;

if(page === "usabo"){
filteredQuestions = questions.filter(q => q.category === "USABO");
}

if(page === "apbio"){
filteredQuestions = questions.filter(q => q.category === "AP Bio");
}


/* Load Question */

function loadQuestion(){

const q = filteredQuestions[current];

document.getElementById("question").innerText = q.question;

const answers = document.getElementById("answers");

answers.innerHTML="";

q.answers.forEach((a,i)=>{

const div = document.createElement("div");

div.className="answer";

div.innerText=a;

div.onclick=()=>selectAnswer(div,i);

answers.appendChild(div);

});

}


/* Select Answer */

function selectAnswer(el,i){

const q = filteredQuestions[current];

if(i === q.correct){

el.classList.add("correct");

}else{

el.classList.add("wrong");

}

}


/* Next Question */

function nextQuestion(){

current++;

if(current >= filteredQuestions.length){

current = 0;

}

loadQuestion();

}


/* Topic Filter */

function filterTopic(topic){

if(document.body.dataset.page === "usabo"){

filteredQuestions = questions.filter(
q => q.category === "USABO" && q.topic === topic
);

}

if(document.body.dataset.page === "apbio"){

filteredQuestions = questions.filter(
q => q.category === "AP Bio" && q.topic === topic
);

}

current = 0;

loadQuestion();

}


loadQuestion();
