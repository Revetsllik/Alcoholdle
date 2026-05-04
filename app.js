'use strict'
    let alcoholData = [];
    let dailyAlcohol = "UwU";
    let i = 0;
    let fields = ["Name", "Type", "Country/Continent", "Vol.%", 
            "Liquid Color", "Price", "Served", "Bottle Color", "Vibe"]
    let globalFilter;

    fetch('./alcohols.json')
    .then(response => response.json())
    .then(data => {
        alcoholData = data;
        dailyAlcohol = getDailyAlcohol();
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
    //define correct to lowercase
    let correct = alcoholData.find(alcohol => alcohol.Name.toLowerCase() === dailyAlcohol);
    //space where blocks will spawn
    let gameSpace = document.getElementById("gameSpace");
    let newRow = document.createElement("div");

    //style of new rows
    newRow.classList.add("newRow");

    //generate fields
    for(let i = 0; i < fields.length; i++){
        let newBox = document.createElement("div");
        newBox.classList.add("answerBox");
        
        let guessedValue = match[fields[i]];
        let correctValue = correct[fields[i]];
        let displayValue = guessedValue;

        if (Array.isArray(guessedValue)) displayValue = guessedValue.join(', ');
        if (i===0){displayValue = capitalize(displayValue)}
        newBox.textContent = displayValue; 
        newBox.id = "jegKanGøresBlå"; 
        //define exact and partial match
        let isExactMatch = JSON.stringify(guessedValue) === JSON.stringify(correctValue);
        let isPartialMatch = false;
        
        //check for partial match
        if(Array.isArray(guessedValue) && Array.isArray(correctValue))
        {
            isPartialMatch = guessedValue.some(val => correctValue.includes(val));
        } 
        else if(Array.isArray(correctValue))
        {
            isPartialMatch = correctValue.includes(guessedValue);
        }
        
        //determine color and arrows
        //hvis alkoholprocent felt & du har gættet for lavt:
        if(i===3 && correctValue > guessedValue)                       
        {   
            newBox.style.backgroundColor = "blue"
            let arrowUp = document.createElement("img");
            arrowUp.src = "./upArrow.png";
            arrowUp.alt = "higher";
            newBox.appendChild(arrowUp);
        }
        else if(i===3 && correctValue < guessedValue)                       
        {   
            newBox.style.backgroundColor = "blue"
            let arrowDown = document.createElement("img");
            arrowDown.src = "./downArrow.png";
            arrowDown.alt = "lower";
            newBox.appendChild(arrowDown);
        }
        else if(i===8 && isExactMatch){
            newBox.style.backgroundColor = "green";
        }
        else if(i===8 && isPartialMatch){
            //insert checkmark at correct elements of array
            newBox.style.backgroundColor = "orange";
            newBox.innerHTML = ""; // clear textContent set earlier
            for(let v = 0; v < guessedValue.length; v++){
                if(correctValue.includes(guessedValue[v])){
                    newBox.innerHTML += `&#9989; ${guessedValue[v]}<br>`;
                } 
                else {
                    newBox.innerHTML += `${guessedValue[v]}<br>`;
                }
            }
        }
        //hvis alkoholprocent felt & du har gættet for hæjt:
        else if(isExactMatch === true)  {newBox.style.backgroundColor = "green";} 
        else if(isPartialMatch === true){newBox.style.backgroundColor = "orange";} 
        else                            {newBox.style.backgroundColor = "red";}

        /*if(i = 4 && guessedValue[4] > dailyAlcohol[4]) {
            newBox.style.image
        }*/
        newRow.appendChild(newBox);
    }
    i++;
    if (i === 1){
        gameSpace.appendChild(newRow);
    }
    else {
        gameSpace.insertBefore(newRow, gameSpace.firstChild);
    }
}
//compare om playerInput === dailyAlcohol
function compare()
{
    let playerInput = document.getElementById("searchBox").value.toLowerCase();
    let match = alcoholData.find(alcohol => normalizeString(alcohol.Name) === normalizeString(playerInput))
    logCheckIfWrongInData(match);
    
    if (!match && globalFilter.length === 1) {
        match = globalFilter[0];
    }

    if (normalizeString(playerInput) === normalizeString(dailyAlcohol)) {
        console.log("You guessed it!")
        addGuessRow(match);
        document.getElementById("searchBox").value = "";
        document.getElementById("suggestions").innerHTML = "";
    }
    if (normalizeString(playerInput) !== normalizeString(dailyAlcohol) && match) {
        console.log("You guessed wrong..")
        document.getElementById("searchBox").value = "";
        document.getElementById("suggestions").innerHTML = "";
        addGuessRow(match);
    }
     
}

//når du rammer enter skal den søge
document.getElementById("searchBox").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        compare();
    }
    else {
        let currentInput = document.getElementById("searchBox").value.toLowerCase();
        let filtered = alcoholData.filter(alcohol => alcohol.Name.includes(currentInput));
    }
});
//Searchbar
document.getElementById("searchBox").addEventListener("input", function(event) {
    if(document.getElementById("searchBox").value !== "")
    {
        let currentInput = document.getElementById("searchBox").value.toLowerCase();

        let filtered = [];
        for (let i = 0; i < alcoholData.length; i++) {
            let nameWords = normalizeString(alcoholData[i].Name).split(" ");
            let inputNormalized = normalizeString(currentInput);
            let matches = nameWords.some(word => word.startsWith(inputNormalized));
            if (matches) {
                filtered.push(alcoholData[i]);
            }
        }
        globalFilter = filtered;

        document.getElementById("suggestions").innerHTML = "";

        for (let i = 0; i < filtered.length; i++) {
        document.getElementById("suggestions").innerHTML += `<div style="cursor: pointer; margin: 10px; "onclick="selectSuggestion('${filtered[i].Name}')">${filtered[i].Name}</div>`;
        }        
    }
    if(document.getElementById("searchBox").value === ""){document.getElementById("suggestions").innerHTML = "";}
});

//håndter special characters
function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
//stort bogstav funktion
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function selectSuggestion(name) {
    document.getElementById("searchBox").value = name;
    compare();
}
function getDailyAlcohol() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const index = (dayOfYear + today.getFullYear()) % alcoholData.length;
    return alcoholData[index].Name;
}
console.log("Program started.");