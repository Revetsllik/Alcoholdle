'use strict'
    let alcoholData = []
    let dailyAlcohol = "fireball";

    fetch('./.data/alcohols.json')
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
//compare om playerInput === dailyAlcohol
function compare()
{
    let playerInput = document.getElementById("searchBox").value.toLowerCase();
    let match = alcoholData.find(alcohol => alcohol.Name === playerInput)
    logCheckIfWrongInData(match);

    if (playerInput === dailyAlcohol)
    {
        console.log("You guessed it!")
    } else console.log("Try again..")

    document.getElementById("searchBox").value = "";
}
//når du rammer enter skal den søge
document.getElementById("searchBox").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        compare();
    }
});

console.log("Program started.")