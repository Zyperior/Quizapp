window.onload = function () {

    let loader = document.getElementById("loaderGrid");
    let bodyGrid = document.getElementById("bodyGrid");
    bodyGrid.className = "invisible";

    let whileLoading = setInterval(loading, 500);
    let boxID = 1;

    function loading(){
        let isLoaded = localStorage.getItem("QuizLoaded");
        isLoaded = "true";
        let box = document.getElementById("loadBox" + boxID);

        if(isLoaded==="true"){
            clearInterval(whileLoading);
            bodyGrid.className = "bodyGrid";
            loader.className = "invisible";
            console.log("Quiz loaded");
            runQuiz();
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