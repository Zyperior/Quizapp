/*
 * Author: Andreas Albihn
 * Project: QuizApp, ITHS 2019
 * Date: 2019-04-05
 */

let answerButtons;
let quizDataJSON;
let currentQuestion;
let currentAnswers;
let correctAnswer;
let numberOfPlayers;
let questionType;
let playerDataJSON;

let questionDisplay = document.getElementById("questionText");
let answerGrid = document.getElementById("answerGrid");
let lockAnswerButton = document.getElementById("lockAnswer");
let progressGrid = document.getElementById("progressGrid");
let questionNr = 0;
let playerNr = 0;

function initializeQuiz(){

    //Set quiz essential params from local storage
    numberOfPlayers = parseInt(localStorage.getItem("numberOfPlayers"));
    quizDataJSON = JSON.parse(localStorage.getItem("quizData"));

    //Create a JSON array for the answer data for each player
    playerDataJSON = createPlayerJSON();

    //Set the appropriate amount of progress lines
    for(let i=0; i<4; i++){
        let progressLine = document.getElementById("progressLine" + i);
        if(i>=numberOfPlayers){
            progressLine.className = "invisible"
        }
    }

    //Add initial eventlistener to lock answer button
    lockAnswerButton.addEventListener("click",lockAnswer);

    //Set the first turn
    setTurn();

}

function createPlayerJSON(){

    //Initial Json string
    let playersString = "{\"player\":[";

    //Add answer strings to each player
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

    //final answer string
    playersString = playersString + "]}";

    return JSON.parse(playersString);
}


function setTurn(){

    //Check if last player and not completed
    if(playerNr===numberOfPlayers && questionNr < 10){

        //If last player, control the answers and go to next question and first player
        controlAnswers(questionNr);
        questionNr++;
        playerNr=0;
    }

    //Check if not completed
    if(questionNr < 10){

        //Reset former player indicator
        let playerIndicators = Array.from(progressGrid.getElementsByClassName("player"));
        playerIndicators.forEach(function(indicator){
            if(indicator.value==="active"){
                indicator.className = "player"
            }
        });

        //Get next players indicator and set it active
        let playerIndicator = document.getElementById("player" + playerNr);
        playerIndicator.className = "player active";
        playerIndicator.value = "active";

        //Set the question
        setUpQuestion();


    }

}

function controlAnswers(questionNr){

    for(let i = 0; i < numberOfPlayers; i++){

        //Get the progress bar segment element for the current question and each player
        let progSegment = document.getElementById("progSegment"+i+questionNr);
        //Get the progress bar number element for each player
        let progressNumber = document.getElementById("progressNumber"+i);
        //Get the current correct amount of answers from the JSON array for each player
        let correctAnswers = playerDataJSON.player[i].correct_answers;

        //Check if player answer in array is the same as current correct answer.
        if(playerDataJSON.player[i].answers[questionNr].toLowerCase()===correctAnswer.toLowerCase()){

            //Change progress bar segment to correct
            progSegment.className = "progSegment correct";

            //Increase the amount of correct answers, add it to the JSON array and adjust the progress bar number
            correctAnswers++;
            playerDataJSON.player[i].correct_answers = correctAnswers;
            progressNumber.innerHTML = correctAnswers + "/10";
        }
        else{
            //If wrong, set the progress bar segment to wrong
            progSegment.className = "progSegment wrong";

        }
    }

}

async function setUpQuestion(){

    //Check if first player
    if(playerNr===0){

        //Get question data from JSON array
        questionType = quizDataJSON.results[questionNr].type;
        currentQuestion = quizDataJSON.results[questionNr].question;
        correctAnswer = quizDataJSON.results[questionNr].correct_answer;
        currentAnswers = Array.from(quizDataJSON.results[questionNr].incorrect_answers);

        //Show current question
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
}

function setUpAnswers(){

    return new Promise((resolve, reject) => {

        //Check if question type is boolean
        if(questionType==="boolean"){
            //Set current answer array
            currentAnswers = ["True","False"];
            resolve();
        }
        else{

            randomizeAnswerArray().then(()=> {

                resolve();

                }, (error)=> {

                    console.log(error.message)
                });



        }

    })


}

function randomizeAnswerArray() {

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
                reject(new Error("Error randomizing answers"));
            }
        },500)
    });

}

function buildAnswerGrid() {

    return new Promise((resolve, reject) => {

        //Delete former answers
        answerGrid.innerHTML="";

        //Create a div element for each answer and add them to the grid
        let answerId = 0;
        currentAnswers.forEach(function (answer) {

            //Check if not an empty answer
            if(answer.length>0){
                let answerDiv = document.createElement("div");
                answerDiv.className = "answer";
                answerDiv.id = "answer" + answerId;
                answerDiv.innerHTML = answer;

                //The value is used to save the answer in the player data json array when the player locks the answer
                answerDiv.value = currentAnswers.indexOf(answer);
                answerId++;

                answerGrid.appendChild(answerDiv);
            }
        });

        setTimeout(()=>{
            //Check that each answer is represented in the html
            if(answerGrid.querySelectorAll("div").length===currentAnswers.length){
                resolve();
            }
            else{
                reject("Error building answerGrid");
            }
        }, 200);

    });
}

function setAnswerButtonsListeners(){

    answerButtons = answerGrid.querySelectorAll("div");

    for(let i = 0; i<answerButtons.length; i++){
        answerButtons[i].addEventListener("click",()=>{
            answerButtonAction(i);
        });
    }
}

function answerButtonAction(number){

    //Check all buttons
    answerButtons.forEach((button)=>{

        //If the Id matches the button that is clicked
        if(button.getAttribute("id") === "answer" + number){
            //Set it to selected and use the value to get the current answer from the quiz data to the answer data
            button.className = "answer selected";
            playerDataJSON.player[playerNr].answers[questionNr] = currentAnswers[button.value];
        }
        else{
            button.className = "answer";
        }
    });
}

function lockAnswer(){
    //Remove the event listener to prevent double click
    lockAnswerButton.removeEventListener("click",lockAnswer);

    setTimeout(()=>{
        //Reset the event listener
        lockAnswerButton.addEventListener("click",lockAnswer);

        //Switch to next players turn
        playerNr++;
        setTurn();
    }, 500);
}

initializeQuiz();