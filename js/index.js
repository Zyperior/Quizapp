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


function openNewQuiz(){

    localStorage.clear();

    getQuizData().then(function (QuizData) {

        controlQuizData(QuizData).then(function(){

            openNewWindow().then(function () {
                localStorage.setItem("quizData", QuizData);
                localStorage.setItem("numberOfPlayers", numberOfPlayers.value);
                localStorage.setItem("QuizLoaded", "true");

            });
        }, function (){

            console.log("bajs")

        });



    }, function (ErrorMessage) {
        console.log(ErrorMessage);
    });

}