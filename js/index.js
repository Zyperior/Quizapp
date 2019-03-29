let createButton = document.getElementById("createQuiz");
createButton.addEventListener("click", openNewQuiz);

let numberOfPlayers = document.getElementById("nrPlayers");

openNewWindow = function () {
    return new Promise((resolve, reject) => {
        let openNewWindow = window.open("./quiz.html");

        setTimeout(()=>{
            if(openNewWindow===null){
                reject(new Error("openNewWindow is null"));
            }
            if(openNewWindow===undefined){
                reject(new Error("openNewWindow is undefined"));
            }
            resolve(openNewWindow);
        }, 1000);

    });

};


loadQuizElement = function(quiz, elementID){

    return new Promise((resolve, reject) => {
        let element = quiz.document.getElementById(elementID);

        setTimeout(()=> {
            if(element===null){
                reject(new Error(element + " is null"))
            }
            if(element===undefined){
                reject(new Error(element + " is undefined"));
            }
            console.log(elementID + " successfully retrieved");
            resolve(element);

        },1000);
    })
};

buildQuizProgressBars = function(progressGrid){

    return new Promise((resolve) => {

        for(let i = 0; i < numberOfPlayers.value; i++){

            let playerDiv = document.createElement("div");
            playerDiv.setAttribute("class", "player");
            playerDiv.setAttribute("id","player" + i);
            playerDiv.innerHTML = "P"+(i+1);

            let progressDiv = document.createElement("div");
            progressDiv.setAttribute("class", "progressBar");
            progressDiv.setAttribute("id", "progressBar" + i);

            for(let j = 0; j<10; j++){

                let progressSegment = document.createElement("div");
                progressSegment.setAttribute("class", "progSegment");
                progressSegment.setAttribute("id", "progSegment" + i + j);
                progressDiv.appendChild(progressSegment);

            }

            let correctAnswers = document.createElement("div");
            correctAnswers.setAttribute("class", "progressNumber");
            correctAnswers.setAttribute("id", "progressNumber" + i);
            correctAnswers.innerHTML = "0/10";

            progressGrid.appendChild(playerDiv);
            progressGrid.appendChild(progressDiv);
            progressGrid.appendChild(correctAnswers);

        }


        console.log("progressGrid Successfully built");
        resolve();


    })


};

getQuizData = function(){

    return new Promise((resolve) => {
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {

            if(this.status===200){

                if(this.readyState===4){
                    resolve(this.responseText);
                }

            }

        };

        xhttp.open("GET", "https://opentdb.com/api.php?amount=10");
        xhttp.send();

    });
};


function openNewQuiz(){

    localStorage.clear();

    openNewWindow().then(function (NewQuizTab) {

        loadQuizElement(NewQuizTab, "progressGrid").then(function(ProgressGrid){

            buildQuizProgressBars(ProgressGrid).then(function () {

                getQuizData().then(function (QuizData) {
                    localStorage.setItem("quizData", QuizData);
                    localStorage.setItem("numberOfPlayers", numberOfPlayers.value);
                    localStorage.setItem("QuizLoaded", "true");

                }, function (ErrorMessage) {
                    console.log(ErrorMessage);
                });

            });

        },function (ErrorMessage) {
            console.log(ErrorMessage);
        });

    }, function (ErrorMessage) {
        console.log(ErrorMessage);
    });





}