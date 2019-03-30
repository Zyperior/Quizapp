
let answerButtons;
let quizDataJSON;
let currentQuestion;
let currentAnswers;
let correctAnswer;
let numberOfPlayers;
let questionType;
let players;

let questionDisplay = document.getElementById("question");
let answerGrid = document.getElementById("answerGrid");
let finalAnswerButton = document.getElementById("finalAnswer");
let progressGrid = document.getElementById("progressGrid");
let questionNr = 0;
let playerNr = 0;


finalAnswerButton.addEventListener("click", () => {
    lockAnswer();
});

function runQuiz(){

    numberOfPlayers = localStorage.getItem("numberOfPlayers");
    quizDataJSON = JSON.parse(localStorage.getItem("quizData"));

    let playersString = "{\"answers\":[";
    for(let i = 0; i<numberOfPlayers; i++){
        if(i===numberOfPlayers-1){
            playersString = playersString + "[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \"]"
        }
        else{
            playersString = playersString + "[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \"],"
        }
    }

    playersString = playersString + "]}";

    players = JSON.parse(playersString);

    for(let i=0; i<4; i++){
        let progressLine = document.getElementById("progressLine" + i);
        if(i>=numberOfPlayers){
            progressLine.className = "invisible"
        }
    }

    setTurn();

}

function setTurn(){

    if(playerNr===numberOfPlayers){
        questionNr++;
        playerNr=0;
    }

    let playerIndicators = Array.from(progressGrid.getElementsByClassName("player"));
    playerIndicators.forEach(function(indicator){
        if(indicator.value==="active"){
            indicator.className = "player"
        }
    });

    let playerIndicator = document.getElementById("player" + playerNr);
    playerIndicator.className = "player active";
    playerIndicator.value = "active";

    nextQuestion();

}

function nextQuestion(){

    if(questionNr>10){
        endQuiz();
    }
    else{
        setUpQuestion();
    }

}

function lockAnswer(){
    playerNr++;
    setTurn();
}

async function setUpQuestion(){

    questionType = quizDataJSON.results[questionNr].type;
    currentQuestion = quizDataJSON.results[questionNr].question;
    correctAnswer = quizDataJSON.results[questionNr].correct_answer;
    currentAnswers = Array.from(quizDataJSON.results[questionNr].incorrect_answers);

    questionDisplay.innerHTML = currentQuestion;

    setUpAnswers().then(()=>{

        buildAnswerGrid().then(()=>{

            setAnswerButtonsListeners();

        },(ErrorMessage)=>{
            console.log(ErrorMessage);
        });

    },(ErrorMessage)=>{
        console.log(ErrorMessage);
    });

}

setUpAnswers = function(){

    return new Promise((resolve, reject) => {

        if(questionType==="boolean"){
            currentAnswers = ["True","False"];
            resolve();
        }
        else{
            if(questionNr===0){
                randomizeAnswerArray().then(()=> {
                    resolve();
                }, (ErrorMessage)=> {
                    reject(ErrorMessage);
                });
            }
            resolve();
        }

    })


};

randomizeAnswerArray = function() {

    return new Promise((resolve, reject) => {

        //Pick random index from incorrect answers array.
        let min = 0;
        let max = 4;
        let random = Math.floor(Math.random() * ( +max - +min )) + +min;

        //If index is out of bounds, put the correct answer at the end.
        if(random===3){
            currentAnswers.push(correctAnswer);
        }
        else{
            //Else, save the random incorrect answer.
            let randomAnswer = currentAnswers[random];

            //Overwrite the random answer in the array with the correct answer.
            currentAnswers[random] = correctAnswer;
            //Put the saved incorrect answer at the end of the array;
            currentAnswers.push(randomAnswer);
        }

        setTimeout(function(){
            if(currentAnswers.length===4){
                resolve();
            }
            else{
                reject("Error randomizing answers");
            }
        },200)
    });

};

buildAnswerGrid = function () {

    return new Promise((resolve, reject) => {

        answerGrid.innerHTML="";
        let answerId = 0;
        currentAnswers.forEach(function (answer) {
            let answerDiv = document.createElement("div");
            answerDiv.className = "answer";
            answerDiv.id = "answer" + answerId;
            answerDiv.innerHTML = answer;
            answerId++;

            answerGrid.appendChild(answerDiv);
        });

        setTimeout(()=>{
            if(answerGrid.querySelectorAll("div").length===currentAnswers.length){
                resolve();
            }
            else{
                reject(new Error("Error building answerGrid"));
            }
        }, 200);

    });
};

function setAnswerButtonsListeners(){

    answerButtons = answerGrid.querySelectorAll("div");

    for(let i = 0; i<answerButtons.length; i++){
        answerButtons[i].addEventListener("click",()=>{
            answerButtonAction(i);
        });
    }
}

function answerButtonAction(number){

    answerButtons.forEach((button)=>{
        if(button.getAttribute("id") === "answer" + number){
            button.className = "answer selected";
        }
        else{
            button.className = "answer";
        }
    });
}


function endQuiz(){

}