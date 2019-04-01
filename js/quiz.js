
let answerButtons;
let quizDataJSON;
let currentQuestion;
let currentAnswers;
let correctAnswer;
let numberOfPlayers;
let questionType;
let playerDataJSON;

let questionDisplay = document.getElementById("question");
let answerGrid = document.getElementById("answerGrid");
let finalAnswerButton = document.getElementById("finalAnswer");
let progressGrid = document.getElementById("progressGrid");
let questionNr = 0;
let playerNr = 0;


finalAnswerButton.addEventListener("click", () => {
    lockAnswer();
});

function initializeQuiz(){

    numberOfPlayers = parseInt(localStorage.getItem("numberOfPlayers"));
    quizDataJSON = JSON.parse(localStorage.getItem("quizData"));

    createAnswerJSON();

    for(let i=0; i<4; i++){
        let progressLine = document.getElementById("progressLine" + i);
        if(i>=numberOfPlayers){
            progressLine.className = "invisible"
        }
    }

    setTurn();

}

function createAnswerJSON(){

    let playersString = "{\"player\":[";
    for(let i = 0; i<numberOfPlayers; i++){
        if(i===numberOfPlayers-1){
            playersString = playersString +
                "{\"answers\":[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \"], \"correct_answers\":\"0\"}";
        }
        else{
            playersString = playersString +
                "{\"answers\":[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \"],\"correct_answers\":\"0\"},"
        }
    }


    playersString = playersString + "]}";

    playerDataJSON = JSON.parse(playersString);
}


function setTurn(){

    if(questionNr>10){
        endQuiz();
    }
    else{

        if(playerNr===numberOfPlayers){
            playerNr--;

            controlAnswers(questionNr);
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

        setUpQuestion();
    }



}

function controlAnswers(questionNr){

    for(let i = 0; i < numberOfPlayers; i++){

        let progSegment = document.getElementById("progSegment"+i+questionNr);
        let progressNumber = document.getElementById("progressNumber"+i);
        let correctAnswers = playerDataJSON.player[i].correct_answers;

        if(playerDataJSON.player[i].answers[questionNr].toLowerCase()===correctAnswer.toLowerCase()){
            progSegment.className = "progSegment correct";
            correctAnswers++;
            playerDataJSON.player[i].correct_answers = correctAnswers;
            progressNumber.innerHTML = correctAnswers + "/10";
        }
        else{
            progSegment.className = "progSegment wrong";

        }
    }

}

setCorrectAnswers = function(i){
    return new Promise( (resolve, reject) =>{



        setTimeout(function(){
            resolve(correctAnswers);
        },100);

    })
};


async function setUpQuestion(){
    if(playerNr===0){
        questionType = quizDataJSON.results[questionNr].type;
        currentQuestion = quizDataJSON.results[questionNr].question;
        correctAnswer = quizDataJSON.results[questionNr].correct_answer;
        currentAnswers = Array.from(quizDataJSON.results[questionNr].incorrect_answers);
    }

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
            if(playerNr===0){
                randomizeAnswerArray().then(()=> {
                    resolve();
                }, (ErrorMessage)=> {
                    reject(ErrorMessage);
                });
            }
            else{
                resolve();
            }
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
        },500)
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
            answerDiv.value = currentAnswers.indexOf(answer);
            answerId++;

            answerGrid.appendChild(answerDiv);
        });

        setTimeout(()=>{
            if(answerGrid.querySelectorAll("div").length===currentAnswers.length){
                resolve();
            }
            else{
                reject("Error building answerGrid");
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
            playerDataJSON.player[playerNr].answers[questionNr] = currentAnswers[button.value];
        }
        else{
            button.className = "answer";
        }
    });
}

function lockAnswer(){

    playerNr++;
    setTurn();
}

function endQuiz(){

}