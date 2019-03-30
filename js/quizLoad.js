window.onload = function () {

    let question = document.getElementById("question");
    let progressGrid = document.getElementById("progressGrid");
    let low = document.getElementById("low");
    progressGrid.className = "invisible";
    low.className = "invisible";

    let whileLoading = setInterval(loading, 500);
    let boxID = 1;

    function loading(){
        let isLoaded = localStorage.getItem("QuizLoaded");
        let box = document.getElementById("loadBox" + boxID);

        if(isLoaded==="true"){
            clearInterval(whileLoading);
            progressGrid.className = "progressGrid";
            low.className = "low";
            question.innerHTML = "";
            console.log("Quiz loaded");
            initializeQuiz();
        }
        else{
            setTimeout(()=>{
                box.style.backgroundColor = "white";
            }, 500);

            box.style.backgroundColor = "gray";

            boxID++;
            if(boxID>3){
                boxID = 1;
            }
        }
    }
};