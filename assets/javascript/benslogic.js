// Global Attributes
var playerOneWins = 0;
var playerOneLoss = 0;
var playerTwoWins = 0;
var playerTwoLoss = 0;
var fightBtn = $("#fightBtn");
var backgroundBanner = $("#backgroundBanner");
var backgroundImageButton = $("#backgroundImageButton");
var Jumbotron = $("#jumbotron");
var playerOneAttributes = $("#playerOneAttributes");
var playerTwoAttributes = $("#playerTwoAttributes");
var isGameInProgress = true;

// Restart Function
function startGame() {
    // Empty image boxes
    $("#userImage1").html("");
    $("#userImage2").html("");

    // Hide and show certain buttons
    fightBtn.hide();
    backgroundImageButton.show();
    actionButton.hide();
    backgroundBanner.show();
    Jumbotron.show();

    // Reset players attributes
    playerOneAttributes = "";
    playerOneAttributes.hide();
    playerTwoAttributes = "";
    playerTwoAttributes.hide();
    isGameInProgress = true;
}

// At the start of a fight
$("#startFight").on("click", function () {
    // Hide all the below elements
    $("#searchForm").hide();
    $("#submitButton").hide();
    $("#uploadButton").hide();
    $("#chooseFileButton").hide();
    backgroundBanner.hide();
    Jumbotron.hide();
    actionButton.show();
});

// When play again is pressed
$("#playAgain").on("click", startGame());

// Functions for maps buttons

//map 1 button
$("#map1").on("click", function () {
    $("body").css("background-image", "url()"); //URL to be placed when we get images
    $(".mapButtons").hide();
});

//map 2 button
$("#map2").on("click", function () {
    $("body").css("background-image", "url()"); //URL to be placed when we get images
    $(".mapButtons").hide();
});

//map 3 button
$("#map3").on("click", function () {
    $("body").css("background-image", "url()"); //URL to be placed when we get images
    $(".mapButtons").hide(); 
});

//map 4 button
$("#map4").on("click", function () {
    $("body").css("background-image", "url()"); //URL to be placed when we get images
    $(".mapButtons").hide();
});

//map 5 button
$("#map5").on("click", function () {
    $("body").css("background-image", "url()"); //URL to be placed when we get images
    $(".mapButtons").hide();
});

// End of game function
function endOfGame() {

    // If health is still above 0 for both players
    if (!isGameInProgress) {
        return;
    }

    // If player 1 health is or below 0
    if (playerOneHealth <= 0 && playerTwoHealth > 0) {
        // Update Players wins/losses
        playerOneLoss++;
        playerTwoWins++;
        // Call the Play Again button to show
        $("#playAgain").show();
        isGameInProgress = false;
    }

    // If player 2 health is or below 0
    if (playerOneHealth > 0 && playerTwoHealth <= 0) {
        // Update Players wins/losses
        playerOneWins++;
        playerTwoLoss++;
        // Call the Play Again button to show
        $("#playAgain").show();
        isGameInProgress = false;
    }
}

startGame();