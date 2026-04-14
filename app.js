'use strict'
    let alcoholData = [];
    let dailyAlcohol = "fireball";
    let i = 0;
    let fields = ["Name", "Type", "Country/Continent", "Vol.%", 
            "Liquid Color", "Price", "Served", "Bottle Color", "Vibe"]

    fetch('./alcohols.json')
    .then(response => response.json())
    .then(data => {
        alcoholData = data;
        console.log("Data loaded!", alcoholData); // verify it loaded
    });
function logCheckIfWrongInData(match)
{
    if (match) {
    console.log("Found it!", match);
    // match.Type, match.Country, match.Vol.% etc. are all accessible
    } else {
    console.log("Not in the dataset!")
    }
}

function addGuessRow(match){
    let correct = alcoholData.find(alcohol => alcohol.Name.toLowerCase() === dailyAlcohol);
    let gameSpace = document.getElementById("gameSpace");
    let newRow = document.createElement("div");
    newRow.style.display = "flex";
    newRow.style.justifyContent = "center";
    newRow.style.flexWrap = "wrap";
    for(let i = 0; i < fields.length; i++){
        let newBox = document.createElement("div");
        newBox.classList.add("answerBox");
        let guessedValue = match[fields[i]];
        let correctValue = correct[fields[i]];
        let displayValue = guessedValue;
        if (Array.isArray(guessedValue)) displayValue = guessedValue.join(', ');
        newBox.textContent = displayValue;
        
        let isExactMatch = JSON.stringify(guessedValue) === JSON.stringify(correctValue);
        let isPartialMatch = false;
        
        if(Array.isArray(guessedValue) && Array.isArray(correctValue)){
            isPartialMatch = guessedValue.some(val => correctValue.includes(val));
        } else if(Array.isArray(correctValue)){
            isPartialMatch = correctValue.includes(guessedValue);
        }
        
        if(isExactMatch){
            newBox.style.backgroundColor = "green";
        } else if(isPartialMatch){
            newBox.style.backgroundColor = "orange";
        } else {
            newBox.style.backgroundColor = "red";
        }
        newRow.appendChild(newBox);
    }
    gameSpace.appendChild(newRow);
}
//compare om playerInput === dailyAlcohol
function compare()
{
    let playerInput = document.getElementById("searchBox").value.toLowerCase();
    let match = alcoholData.find(alcohol => alcohol.Name === playerInput)
    logCheckIfWrongInData(match);

    if (playerInput === dailyAlcohol) {
        console.log("You guessed it!")
        addGuessRow(match);
    }
    if (playerInput !== dailyAlcohol && match) {
        console.log("You guessed wrong..")
        document.getElementById("searchBox").value = "";
        addGuessRow(match);
    }
     
}

//når du rammer enter skal den søge
document.getElementById("searchBox").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        compare();
    }
});

console.log("Program started.")