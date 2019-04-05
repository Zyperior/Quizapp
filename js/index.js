let errorMessage = document.getElementById("errorMessage");
let numberOfPlayers = document.getElementById("nrPlayers");
let createButton = document.getElementById("createQuiz");

createButton.addEventListener("click", openNewQuiz);

function openNewQuiz(){

    errorMessage.className = "errorMessage invisible";

    localStorage.clear();

    getQuizData().then(function (QuizData) {

        controlQuizData(QuizData).then(function(){

            localStorage.setItem("numberOfPlayers", numberOfPlayers.value);
            localStorage.setItem("quizData", QuizData);
            openNewWindow();

        }, function (){

            errorMessage.className = "errorMessage show"

        });

    }, function (ErrorMessage) {

        console.log(ErrorMessage);

    });

}

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

        xhttp.open("GET", "https://opentdb.com/api.php?amount=8");
        xhttp.send();

    });
};

function controlQuizData(data){

    return new Promise(((resolve, reject) => {

        let dataJSON = JSON.parse(data);

        setTimeout(function(){

            if(dataJSON.results.length<10){

                reject();
            }
            resolve();

        },500)

    }))

}

openNewWindow = function () {

    setTimeout(()=>{

        window.open("./quiz.html");

    }, 1000);

};




