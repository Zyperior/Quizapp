/*
 * Author: Andreas Albihn
 * Project: QuizApp, ITHS 2019
 * Date: 2019-04-05
 */

let errorMessage = document.getElementById("errorMessage");
let numberOfPlayers = document.getElementById("nrPlayers");
let createButton = document.getElementById("createQuiz");
let categorySelector = document.getElementById("category");
let difficultySelector = document.getElementById("difficulty");
createButton.addEventListener("click", openNewQuiz);

/*
Functionality for Create Quiz button click-event
 */
async function openNewQuiz(){

    //Initial reset
    errorMessage.className = "errorMessage invisible";
    localStorage.clear();

    getQuizData().then(function (QuizData) {

        controlQuizData(QuizData).then(function(){

            //Store data for use in quiz
            localStorage.setItem("numberOfPlayers", numberOfPlayers.value);
            localStorage.setItem("quizData", QuizData);
            openNewWindow();

        }, function (Error){

            console.log(Error.message);
            errorMessage.className = "errorMessage show"

        });

    });

}

function getQuizData(){

    return new Promise((resolve) => {

        //Set request parameters
        let categoryValue = categorySelector[categorySelector.selectedIndex].value;
        let difficulty = difficultySelector.value;
        let url = "https://opentdb.com/api.php?amount=10";

        //Add parameters to url if necessary
        if(categoryValue!=="any"){
            url = url + "&category=" + categoryValue
        }

        if(difficulty!=="any"){
            url = url + "&difficulty=" + difficulty
        }

        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {

            if(this.status===200){

                if(this.readyState===4){

                    resolve(this.responseText);
                }

            }

        };

        xhttp.open("GET", url);
        xhttp.send();

    });
}

function controlQuizData(data){

    return new Promise(((resolve, reject) => {

        //Parse response data to JSON array
        let dataJSON = JSON.parse(data);

        setTimeout(function(){

            //Control if array is lower than 10
            if(dataJSON.results.length<10){

                //If so, reject with error message
                reject(new Error("Request response must contain >9 questions, response: " +
                    dataJSON.results.length +
                    " questions"));
            }

            //else resolve
            resolve();

        },500)

    }))

}

function openNewWindow() {

    setTimeout(()=>{

        window.open("./quiz.html");

    }, 500);

}




