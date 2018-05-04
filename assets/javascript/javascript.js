$(document).ready(function () {
    // Functions to generate buttons to choose an image file and upload that image file to use in this app
    selectImageLeft();

    loadImageFileAsURLLeft();

    selectImageRight();

    loadImageFileAsURLRight();

    // Firebase side of the code
    var config = {
        apiKey: "AIzaSyCcJfvajsfRQQCPGsVWrTdAermwyqOUbs0",
        authDomain: "group-project-1-b8e46.firebaseapp.com",
        databaseURL: "https://group-project-1-b8e46.firebaseio.com",
        projectId: "group-project-1-b8e46",
        storageBucket: "",
        messagingSenderId: "328822001679"
    };

    firebase.initializeApp(config);

    var database = firebase.database();

    // Global variables for the game
    var player1Name = "";
    var player2Name = "";

    // Set as integers, so we can increase the count with end-game function
    var player1Wins = 0;
    var player2Wins = 0;
    var player1Losses = 0;
    var player2Losses = 0;

    var mapButton = $(".btn-map");
    var fightBtn = $("#fightButton");
    var replayBtn = $("#replayButton");
    var isGameInProgress = true;

    // Function called to restart game
    function startGame() {
        fightBtn.hide();
        mapButton.show();
        replayBtn.hide();
        $(".input-group").show();
        $("#inputFileToLoadLeft").show();
        $("#inputFileToLoadRight").show();
        $("#upload-button-left").show();
        $("#upload-button-right").show();
        $("#announcement").html("FACE OFF!");
        $("#subAnnouncement").html("");
        $("body").css('background', 'linear-gradient(rgb(231, 231, 231), white, rgb(25, 25, 184))');
        $("#image-left").attr('src', "./assets/images/chocolate.jpg");
        $("#image-right").attr('src', "./assets/images/restaraunt.jpg");
        $(".action-button-left").remove();
        $(".action-button-right").remove();
        isGameInProgress = true;
        imageFileToLoad.val('');
    }
    function retrievePlayer1() {
        return database.ref("Player 1").once('value').then(function (snapshot) {
            if (snapshot.exists()) {
                player1Name = snapshot.val().name;
                player1Wins = snapshot.val().wins;
                player1Losses = snapshot.val().losses;

                $("#player1-name").text(player1Name);
                $("#player1-wins").text(player1Wins);
                $("#player1-losses").text(player1Losses);
            }
            else {
                console.log("Player 1 isn't entered in yet");
            }
        })
    }

    function retrievePlayer2() {
        return database.ref("Player 2").once('value').then(function (snapshot) {
            if (snapshot.exists()) {
                player2Name = snapshot.val().name;
                player2Wins = snapshot.val().wins;
                player2Losses = snapshot.val().losses;

                $("#player2-name").text(player2Name);
                $("#player2-wins").text(player2Wins);
                $("#player2-losses").text(player2Losses);
            }
            else {
                console.log("Player 2 isn't entered in yet");
            }
        })
    }

    retrievePlayer1();

    retrievePlayer2();

    $("#add-player1").on("click", function (event) {
        event.preventDefault();

        player1Name = $("#player1-name-submit").val().trim();
        player1Wins = 0;
        player1Losses = 0;

        var player1 = {
            name: player1Name,
            wins: player1Wins,
            losses: player1Losses
        }

        $("#player1-name-submit").val("");

        database.ref().child("Player 1").set(player1);
    })

    $("#add-player2").on("click", function (event) {
        event.preventDefault();

        player2Name = $("#player2-name-submit").val().trim();
        player2Wins = 0;
        player2Losses = 0;

        var player2 = {
            name: player2Name,
            wins: player2Wins,
            losses: player2Losses
        }

        $("#player2-name-submit").val("");

        database.ref().child("Player 2").set(player2);
    })

    database.ref().child("Player 1").on("value", function (snapshot) {
        if (snapshot.exists()) {
            $("#player1-name").text(snapshot.val().name);
            $("#player1-wins").text(snapshot.val().wins);
            $("#player1-losses").text(snapshot.val().losses);
        }
    })

    database.ref().child("Player 2").on("value", function (snapshot) {
        if (snapshot.exists()) {
            $("#player2-name").text(snapshot.val().name);
            $("#player2-wins").text(snapshot.val().wins);
            $("#player2-losses").text(snapshot.val().losses);
        }
    })

    // API side of the code

    // When the user submits a specific emotion
    $("#submit-button-left").on("click", function () {
        // Storing what the user searches for in a variable
        var leftSubmit = $("#search-area-left").val().trim();

        // Plugging it into the overall data request URL
        var queryURL = 'https://cors-anywhere.herokuapp.com/https://api.giphy.com/v1/gifs/random?q=' + leftSubmit + '_face&api_key=geIvRT3pmBulEx73snik2cGpLMo8dNKL&limit=1';

        // Variable that will store the retrieved image
        var imageURL = "";

        $.ajax({
            // Some CORS stuff
            url: queryURL,
            method: "GET",
            dataType: "json",
            headers: {
                "x-requested-with": "xhr"
            }
        }).then(function (mySearch) {
            imageURL = mySearch.data.images['480w_still'].url;

            // Changing what's displayed on html with what was retrieved
            $("#image-left").attr("src", imageURL);

            // Putting that image through the Face++ API url
            var faceAPIURL = "https://cors-anywhere.herokuapp.com/https://api-us.faceplusplus.com/facepp/v3/detect?api_secret=dplTghWzYIibJghR7hm-dDpM6wsgQbbO&api_key=veWkJ-Dem6QYsHQkC_lvGtug0Y05OLjz&image_url=" + imageURL + "&return_attributes=gender,age,emotion";

            $.ajax({
                // Some CORS stuff
                url: faceAPIURL,
                method: "POST",
                dataType: "json",
                headers: {
                    "x-requested-with": "xhr"
                }
            }).then(function (response) {
                // Storing retrieved data in variables
                var player1Neutral = response.faces[0].attributes.emotion.neutral;
                var player1Sadness = response.faces[0].attributes.emotion.sadness;
                var player1Disgust = response.faces[0].attributes.emotion.disgust;
                var player1Anger = response.faces[0].attributes.emotion.anger;
                var player1Surprise = response.faces[0].attributes.emotion.surprise;
                var player1Happiness = response.faces[0].attributes.emotion.happiness;
                var player1Fear = response.faces[0].attributes.emotion.fear;

                // Initializing empty arrays
                var player1TempButtons = [];
                var player1ActualButtons = [];

                // Actual button 1 of 4
                var player1AppleButton = $("<button class='btn btn-primary action-button-left' type='button'><span class='glyphicon glyphicon-apple'></span></button>");
                player1AppleButton.attr("action-value", -5);
                player1ActualButtons.push(player1AppleButton);

                // Actual button 2 of 4
                var player1NeutralButton = $("<button class='btn btn-primary action-button-left' type='button'><span class='glyphicon glyphicon-pawn'></span></button>");
                player1NeutralButton.attr("action-value", 10);
                player1ActualButtons.push(player1NeutralButton);

                // Temporary button 1 of 6
                var player1SadnessButton = $("<button class='btn btn-primary action-button-left' type='button'><span class='glyphicon glyphicon-music'></span></button>");
                if (player1Sadness > 50) {
                    player1SadnessButton.attr("action-value", 20);
                } else {
                    player1SadnessButton.attr("action-value", 5);
                }
                player1TempButtons.push(player1SadnessButton);

                // Temporary button 2 of 6
                var player1DisgustButton = $("<button class='btn btn-primary action-button-left' type='button'><span class='glyphicon glyphicon-trash'></span></button>");
                if (player1Disgust > 50) {
                    player1DisgustButton.attr("action-value", 20);
                } else {
                    player1DisgustButton.attr("action-value", 5);
                }
                player1TempButtons.push(player1DisgustButton);

                // Temporary button 3 of 6
                var player1AngerButton = $("<button class='btn btn-primary action-button-left' type='button'><span class='glyphicon glyphicon-fire'></span></button>");
                if (player1Anger > 50) {
                    player1AngerButton.attr("action-value", 20);
                } else {
                    player1AngerButton.attr("action-value", 5);
                }
                player1TempButtons.push(player1AngerButton);

                // Temporary button 4 of 6
                var player1SurpriseButton = $("<button class='btn btn-primary action-button-left' type='button'><span class='glyphicon glyphicon-sunglasses'></span></button>");
                if (player1Surprise > 50) {
                    player1SurpriseButton.attr("action-value", 20);
                } else {
                    player1SurpriseButton.attr("action-value", 5);
                }
                player1TempButtons.push(player1SurpriseButton);

                // Temporary button 5 of 6
                var player1HappinessButton = $("<button class='btn btn-primary action-button-left' type='button'><span class='glyphicon glyphicon-heart'></span></button>");
                if (player1Happiness > 50) {
                    player1HappinessButton.attr("action-value", 20);
                } else {
                    player1HappinessButton.attr("action-value", 5);
                }
                player1TempButtons.push(player1HappinessButton);

                // Temporary button 6 of 6
                var player1FearButton = $("<button class='btn btn-primary action-button-left' type='button'><span class='glyphicon glyphicon-eye-close'></span></button>");
                if (player1Fear > 50) {
                    player1FearButton.attr("action-value", 20);
                } else {
                    player1FearButton.attr("action-value", 5);
                }
                player1TempButtons.push(player1FearButton);

                // Using the function ShuffleArray to shuffle our temporary button array
                player1TempButtons = ShuffleArray(player1TempButtons);

                // Appending the 1st button from the shuffled array of temporary buttons
                player1ActualButtons.push(player1TempButtons[0]);

                // Appending the 2nd button from the shuffled array of temporary buttons
                player1ActualButtons.push(player1TempButtons[1]);

                // Appending 4 of our actual action buttons to html
                $("#action-buttons-left").append(player1ActualButtons);
            }).fail(function (jqXHR, textStatus) {
                console.error(textStatus)
            })
        })
    })

    // When the user submits a specific emotion
    $("#submit-button-right").on("click", function () {
        // Storing what the user searches for in a variable
        var rightSubmit = $("#search-area-right").val().trim();

        // Plugging it into the overall data request URL
        var queryURL = 'https://cors-anywhere.herokuapp.com/https://api.giphy.com/v1/gifs/random?q=' + rightSubmit + '_face&api_key=geIvRT3pmBulEx73snik2cGpLMo8dNKL&limit=1';

        // Variable that will store the retrieved image
        var imageURL = "";

        $.ajax({
            // Some CORS stuff
            url: queryURL,
            method: "GET",
            dataType: "json",
            headers: {
                "x-requested-with": "xhr"
            }
        }).then(function (mySearch) {
            imageURL = mySearch.data.images['480w_still'].url;

            // Changing what's displayed on html with what was retrieved
            $("#image-right").attr("src", imageURL);

            // Putting that image through the Face++ API url
            var faceAPIURL = "https://cors-anywhere.herokuapp.com/https://api-us.faceplusplus.com/facepp/v3/detect?api_secret=dplTghWzYIibJghR7hm-dDpM6wsgQbbO&api_key=veWkJ-Dem6QYsHQkC_lvGtug0Y05OLjz&image_url=" + imageURL + "&return_attributes=gender,age,emotion"

            $.ajax({
                // Some CORS stuff
                url: faceAPIURL,
                method: "POST",
                dataType: "json",
                headers: {
                    "x-requested-with": "xhr"
                }
            }).then(function (response) {
                // Storing retrieved data in variables
                var player2Neutral = response.faces[0].attributes.emotion.neutral;
                var player2Sadness = response.faces[0].attributes.emotion.sadness;
                var player2Disgust = response.faces[0].attributes.emotion.disgust;
                var player2Anger = response.faces[0].attributes.emotion.anger;
                var player2Surprise = response.faces[0].attributes.emotion.surprise;
                var player2Happiness = response.faces[0].attributes.emotion.happiness;
                var player2Fear = response.faces[0].attributes.emotion.fear;

                // Initializing empty arrays
                var player2TempButtons = [];
                var player2ActualButtons = [];

                // Actual button 1 of 4
                var player2AppleButton = $("<button class='btn btn-primary action-button-right' type='button'><span class='glyphicon glyphicon-apple'></span></button>");
                player2AppleButton.attr("action-value", -5);
                player2ActualButtons.push(player2AppleButton);

                // Actual button 2 of 4
                var player2NeutralButton = $("<button class='btn btn-primary action-button-right' type='button'><span class='glyphicon glyphicon-pawn'></span></button>");
                player2NeutralButton.attr("action-value", 10);
                player2ActualButtons.push(player2NeutralButton);

                // Temporary button 1 of 6
                var player2SadnessButton = $("<button class='btn btn-primary action-button-right' type='button'><span class='glyphicon glyphicon-music'></span></button>");
                if (player2Sadness > 50) {
                    player2SadnessButton.attr("action-value", 20);
                } else {
                    player2SadnessButton.attr("action-value", 5);
                }
                player2TempButtons.push(player2SadnessButton);

                // Temporary button 2 of 6
                var player2DisgustButton = $("<button class='btn btn-primary action-button-right' type='button'><span class='glyphicon glyphicon-trash'></span></button>");
                if (player2Disgust > 50) {
                    player2DisgustButton.attr("action-value", 20);
                } else {
                    player2DisgustButton.attr("action-value", 5);
                }
                player2TempButtons.push(player2DisgustButton);

                // Temporary button 3 of 6
                var player2AngerButton = $("<button class='btn btn-primary action-button-right' type='button'><span class='glyphicon glyphicon-fire'></span></button>");
                if (player2Anger > 50) {
                    player2AngerButton.attr("action-value", 20);
                } else {
                    player2AngerButton.attr("action-value", 5);
                }
                player2TempButtons.push(player2AngerButton);

                // Temporary button 4 of 6
                var player2SurpriseButton = $("<button class='btn btn-primary action-button-right' type='button'><span class='glyphicon glyphicon-sunglasses'></span></button>");
                if (player2Surprise > 50) {
                    player2SurpriseButton.attr("action-value", 20);
                } else {
                    player2SurpriseButton.attr("action-value", 5);
                }
                player2TempButtons.push(player2SurpriseButton);

                // Temporary button 5 of 6
                var player2HappinessButton = $("<button class='btn btn-primary action-button-right' type='button'><span class='glyphicon glyphicon-heart'></span></button>");
                if (player2Happiness > 50) {
                    player2HappinessButton.attr("action-value", 20);
                } else {
                    player2HappinessButton.attr("action-value", 5);
                }
                player2TempButtons.push(player2HappinessButton);

                // Temporary button 6 of 6
                var player2FearButton = $("<button class='btn btn-primary action-button-right' type='button'><span class='glyphicon glyphicon-eye-close'></span></button>");
                if (player2Fear > 50) {
                    player2FearButton.attr("action-value", 20);
                } else {
                    player2FearButton.attr("action-value", 5);
                }
                player2TempButtons.push(player2FearButton);

                // Using the function ShuffleArray to shuffle our temporary button array
                player2TempButtons = ShuffleArray(player2TempButtons);

                // Appending the 1st button from the shuffled array of temporary buttons
                player2ActualButtons.push(player2TempButtons[0]);

                // Appending the 2nd button from the shuffled array of temporary buttons
                player2ActualButtons.push(player2TempButtons[1]);

                // Appending 4 of our actual action buttons to html
                $("#action-buttons-right").append(player2ActualButtons);
            }).fail(function (jqXHR, textStatus) {
                console.error(textStatus)
            })
        })
    })

    // Just a variable so we can use a function after a set time
    var imageLeft;

    // When the upload-button-left button is clicked, execute imageLeftUpload function after a second
    $("#upload-button-left").on("click", function () {
        imageLeft = setTimeout(imageLeftUpload, 1000);
    })

    function imageLeftUpload() {
        // Getting the uploaded image's src
        var imageURL = $("#image-left").attr("src");

        var faceAPIURL = "https://cors-anywhere.herokuapp.com/https://api-us.faceplusplus.com/facepp/v3/detect";

        // Retrieving data from Face++ API
        $.ajax({
            url: faceAPIURL,
            method: "POST",
            dataType: "json",
            // Data had to be uploaded this way for the site to accept what was being fed into it
            data: {
                api_secret: "dplTghWzYIibJghR7hm-dDpM6wsgQbbO",
                api_key: "veWkJ-Dem6QYsHQkC_lvGtug0Y05OLjz",
                image_base64: imageURL.replace("data:image/jpeg;base64", ""),
                return_attributes: "gender,age,emotion"
            },
            headers: {
                "x-requested-with": "xhr"
            }
        }).then(function (response) {
            // Storing retrieved data in variables
            var player1Neutral = response.faces[0].attributes.emotion.neutral;
            var player1Sadness = response.faces[0].attributes.emotion.sadness;
            var player1Disgust = response.faces[0].attributes.emotion.disgust;
            var player1Anger = response.faces[0].attributes.emotion.anger;
            var player1Surprise = response.faces[0].attributes.emotion.surprise;
            var player1Happiness = response.faces[0].attributes.emotion.happiness;
            var player1Fear = response.faces[0].attributes.emotion.fear;

            // Initializing empty arrays
            var player1TempButtons = [];
            var player1ActualButtons = [];

            // Actual button 1 of 4
            var player1AppleButton = $("<button class='btn btn-primary action-button-left' type='button'><span class='glyphicon glyphicon-apple'></span></button>");
            player1AppleButton.attr("action-value", -5);
            player1ActualButtons.push(player1AppleButton);

            // Actual button 2 of 4
            var player1NeutralButton = $("<button class='btn btn-primary action-button-left' type='button'><span class='glyphicon glyphicon-pawn'></span></button>");
            player1NeutralButton.attr("action-value", 10);
            player1ActualButtons.push(player1NeutralButton);

            // Temporary button 1 of 6
            var player1SadnessButton = $("<button class='btn btn-primary action-button-left' type='button'><span class='glyphicon glyphicon-music'></span></button>");
            if (player1Sadness > 50) {
                player1SadnessButton.attr("action-value", 20);
            } else {
                player1SadnessButton.attr("action-value", 5);
            }
            player1TempButtons.push(player1SadnessButton);

            // Temporary button 2 of 6
            var player1DisgustButton = $("<button class='btn btn-primary action-button-left' type='button'><span class='glyphicon glyphicon-trash'></span></button>");
            if (player1Disgust > 50) {
                player1DisgustButton.attr("action-value", 20);
            } else {
                player1DisgustButton.attr("action-value", 5);
            }
            player1TempButtons.push(player1DisgustButton);

            // Temporary button 3 of 6
            var player1AngerButton = $("<button class='btn btn-primary action-button-left' type='button'><span class='glyphicon glyphicon-fire'></span></button>");
            if (player1Anger > 50) {
                player1AngerButton.attr("action-value", 20);
            } else {
                player1AngerButton.attr("action-value", 5);
            }
            player1TempButtons.push(player1AngerButton);

            // Temporary button 4 of 6
            var player1SurpriseButton = $("<button class='btn btn-primary action-button-left' type='button'><span class='glyphicon glyphicon-sunglasses'></span></button>");
            if (player1Surprise > 50) {
                player1SurpriseButton.attr("action-value", 20);
            } else {
                player1SurpriseButton.attr("action-value", 5);
            }
            player1TempButtons.push(player1SurpriseButton);

            // Temporary button 5 of 6
            var player1HappinessButton = $("<button class='btn btn-primary action-button-left' type='button'><span class='glyphicon glyphicon-heart'></span></button>");
            if (player1Happiness > 50) {
                player1HappinessButton.attr("action-value", 20);
            } else {
                player1HappinessButton.attr("action-value", 5);
            }
            player1TempButtons.push(player1HappinessButton);

            // Temporary button 6 of 6
            var player1FearButton = $("<button class='btn btn-primary action-button-left' type='button'><span class='glyphicon glyphicon-eye-close'></span></button>");
            if (player1Fear > 50) {
                player1FearButton.attr("action-value", 20);
            } else {
                player1FearButton.attr("action-value", 5);
            }
            player1TempButtons.push(player1FearButton);

            // Using the function ShuffleArray to shuffle our temporary button array
            player1TempButtons = ShuffleArray(player1TempButtons);

            // Appending the 1st button from the shuffled array of temporary buttons
            player1ActualButtons.push(player1TempButtons[0]);

            // Appending the 2nd button from the shuffled array of temporary buttons
            player1ActualButtons.push(player1TempButtons[1]);

            // Appending 4 of our actual action buttons to html
            $("#action-buttons-left").append(player1ActualButtons);
        }).fail(function (jqXHR, textStatus) {
            console.error(textStatus)
        })
    }

    // Just a variable so we can use a function after a set time
    var imageRight;

    // When the upload-button-right button is clicked, execute imageRightUpload function after a second
    $("#upload-button-right").on("click", function () {
        imageRight = setTimeout(imageRightUpload, 1000);
    })

    function imageRightUpload() {
        // Getting the uploaded image's src
        var imageURL = $("#image-right").attr("src");

        var faceAPIURL = "https://cors-anywhere.herokuapp.com/https://api-us.faceplusplus.com/facepp/v3/detect";

        // Retrieving data from Face++ API
        $.ajax({
            url: faceAPIURL,
            method: "POST",
            dataType: "json",
            // Data had to be uploaded this way for the site to accept what was being fed into it
            data: {
                api_secret: "dplTghWzYIibJghR7hm-dDpM6wsgQbbO",
                api_key: "veWkJ-Dem6QYsHQkC_lvGtug0Y05OLjz",
                image_base64: imageURL.replace("data:image/jpeg;base64", ""),
                return_attributes: "gender,age,emotion"
            },
            headers: {
                "x-requested-with": "xhr"
            }
        }).then(function (response) {
            // Storing retrieved data in variables
            var player2Neutral = response.faces[0].attributes.emotion.neutral;
            var player2Sadness = response.faces[0].attributes.emotion.sadness;
            var player2Disgust = response.faces[0].attributes.emotion.disgust;
            var player2Anger = response.faces[0].attributes.emotion.anger;
            var player2Surprise = response.faces[0].attributes.emotion.surprise;
            var player2Happiness = response.faces[0].attributes.emotion.happiness;
            var player2Fear = response.faces[0].attributes.emotion.fear;

            // Initializing empty arrays
            var player2TempButtons = [];
            var player2ActualButtons = [];

            // Actual button 1 of 4
            var player2AppleButton = $("<button class='btn btn-primary action-button-right' type='button'><span class='glyphicon glyphicon-apple'></span></button>");
            player2AppleButton.attr("action-value", -5);
            player2ActualButtons.push(player2AppleButton);

            // Actual button 2 of 4
            var player2NeutralButton = $("<button class='btn btn-primary action-button-right' type='button'><span class='glyphicon glyphicon-pawn'></span></button>");
            player2NeutralButton.attr("action-value", 10);
            player2ActualButtons.push(player2NeutralButton);

            // Temporary button 1 of 6
            var player2SadnessButton = $("<button class='btn btn-primary action-button-right' type='button'><span class='glyphicon glyphicon-music'></span></button>");
            if (player2Sadness > 50) {
                player2SadnessButton.attr("action-value", 20);
            } else {
                player2SadnessButton.attr("action-value", 5);
            }
            player2TempButtons.push(player2SadnessButton);

            // Temporary button 2 of 6
            var player2DisgustButton = $("<button class='btn btn-primary action-button-right' type='button'><span class='glyphicon glyphicon-trash'></span></button>");
            if (player2Disgust > 50) {
                player2DisgustButton.attr("action-value", 20);
            } else {
                player2DisgustButton.attr("action-value", 5);
            }
            player2TempButtons.push(player2DisgustButton);

            // Temporary button 3 of 6
            var player2AngerButton = $("<button class='btn btn-primary action-button-right' type='button'><span class='glyphicon glyphicon-fire'></span></button>");
            if (player2Anger > 50) {
                player2AngerButton.attr("action-value", 20);
            } else {
                player2AngerButton.attr("action-value", 5);
            }
            player2TempButtons.push(player2AngerButton);

            // Temporary button 4 of 6
            var player2SurpriseButton = $("<button class='btn btn-primary action-button-right' type='button'><span class='glyphicon glyphicon-sunglasses'></span></button>");
            if (player2Surprise > 50) {
                player2SurpriseButton.attr("action-value", 20);
            } else {
                player2SurpriseButton.attr("action-value", 5);
            }
            player2TempButtons.push(player2SurpriseButton);

            // Temporary button 5 of 6
            var player2HappinessButton = $("<button class='btn btn-primary action-button-right' type='button'><span class='glyphicon glyphicon-heart'></span></button>");
            if (player2Happiness > 50) {
                player2HappinessButton.attr("action-value", 20);
            } else {
                player2HappinessButton.attr("action-value", 5);
            }
            player2TempButtons.push(player2HappinessButton);

            // Temporary button 6 of 6
            var player2FearButton = $("<button class='btn btn-primary action-button-right' type='button'><span class='glyphicon glyphicon-eye-close'></span></button>");
            if (player2Fear > 50) {
                player2FearButton.attr("action-value", 20);
            } else {
                player2FearButton.attr("action-value", 5);
            }
            player2TempButtons.push(player2FearButton);

            // Using the function ShuffleArray to shuffle our temporary button array
            player2TempButtons = ShuffleArray(player2TempButtons);

            // Appending the 1st button from the shuffled array of temporary buttons
            player2ActualButtons.push(player2TempButtons[0]);

            // Appending the 2nd button from the shuffled array of temporary buttons
            player2ActualButtons.push(player2TempButtons[1]);

            // Appending 4 of our actual action buttons to html
            $("#action-buttons-right").append(player2ActualButtons);
        }).fail(function (jqXHR, textStatus) {
            console.error(textStatus)
        })
    }


    $("#action-buttons-left").on("click", ".action-button-left", function (event) {
        if (player1State === true) {
            var player1Action = $(this).attr("action-value");
            console.log(player1Action);

            switchActionState();
        } else {
            console.log("It's not your turn");
        }
    })

    $("#action-buttons-right").on("click", ".action-button-right", function (event) {
        if (player2State === true) {
            var player2Action = $(this).attr("action-value");
            console.log(player2Action);

            switchActionState();
        } else {
            console.log("It's not your turn");
        }
    })


    // Functions that upload images from chosen files
    function selectImageLeft() {
        var imageFileToLoad = document.createElement("input");
        imageFileToLoad.type = "file";
        imageFileToLoad.id = "inputFileToLoadLeft";
        $("#caption-left").append(imageFileToLoad);

        var loadFileButton = document.createElement("button");
        loadFileButton.id = "upload-button-left";
        loadFileButton.onclick = loadImageFileAsURLLeft;
        loadFileButton.textContent = "Use this instead!";
        $("#caption-left").append(loadFileButton);
    }

    function loadImageFileAsURLLeft() {
        var fileSelected = document.getElementById("inputFileToLoadLeft").files;
        if (fileSelected.length > 0) {
            var fileToLoad = fileSelected[0];

            if (fileToLoad.type.match("image.*")) {
                var fileReader = new FileReader();
                fileReader.onload = function (fileLoadedEvent) {
                    var imageLoaded = document.createElement("img");
                    imageLoaded.src = fileLoadedEvent.target.result;
                    $("#image-left").attr("src", imageLoaded.src);
                }
                fileReader.readAsDataURL(fileToLoad);
            }
        }
    }

    function selectImageRight() {
        var imageFileToLoad = document.createElement("input");
        imageFileToLoad.type = "file";
        imageFileToLoad.id = "inputFileToLoadRight";
        $("#caption-right").append(imageFileToLoad);

        var loadFileButton = document.createElement("button");
        loadFileButton.id = "upload-button-right";
        loadFileButton.onclick = loadImageFileAsURLRight;
        loadFileButton.textContent = "Use this instead!";
        $("#caption-right").append(loadFileButton);
    }

    function loadImageFileAsURLRight() {
        var fileSelected = document.getElementById("inputFileToLoadRight").files;
        if (fileSelected.length > 0) {
            var fileToLoad = fileSelected[0];

            if (fileToLoad.type.match("image.*")) {
                var fileReader = new FileReader();
                fileReader.onload = function (fileLoadedEvent) {
                    var imageLoaded = document.createElement("img");
                    imageLoaded.src = fileLoadedEvent.target.result;
                    $("#image-right").attr("src", imageLoaded.src);
                }
                fileReader.readAsDataURL(fileToLoad);
            }
        }
    }

    // Function to shuffle an array in a random order
    function ShuffleArray(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    // Function that will switch action-state of each player
    var player1State = true;
    var player2State = false;

    function switchActionState() {
        if (player1State === true && player2State === false) {
            player1State = false;
            player2State = true;
        }
        else if (player1State === false && player2State === true) {
            player1State = true;
            player2State = false;
        }
    }

    //map 1 button
    $("#mapButton1").on("click", function () {
        console.log("You chose Map 1");
        $("body").css("background-image", "url('./assets/images/map1.jpg')");
        fightBtn.show();
        $("#announcement").html("You Chose Going to Prom!");
        $("#subAnnouncement").html("#bestnightofourlives #classof2018");
    });

    //map 2 button
    $("#mapButton2").on("click", function () {
        console.log("You chose Map 2");
        $("body").css("background-image", "url('./assets/images/map2.jpg')");
        fightBtn.show();
        $("#announcement").html("You Chose the Bachelorette Party!");
        $("#subAnnouncement").html("Woooo! Bring on Magic Mike!!!");
    });

    //map 3 button
    $("#mapButton3").on("click", function () {
        console.log("You chose Map 3");
        $("body").css("background-image", "url('./assets/images/map3.jpg')");
        fightBtn.show();
        $("#announcement").html("You Chose the Company Meet & Greet!");
        $("#subAnnouncement").html("...I think I'm gonna call in sick today");
    });

    //map 4 button
    $("#mapButton4").on("click", function () {
        console.log("You chose Map 4");
        $("body").css("background-image", "url('./assets/images/map4.jpg')");
        fightBtn.show();
        $("#announcement").html("You Chose to Visit Grandma!");
        $("#subAnnouncement").html("Who wants milk and cookies?");
    });

    //map 5 button
    $("#mapButton5").on("click", function () {
        console.log("You chose Map 5");
        $("body").css("background-image", "url('./assets/images/map5.jpg')");
        fightBtn.show();
        $("#announcement").html("You Chose the Backyard BBQ");
        $("#subAnnouncement").html("Oh man, the host couple is fighting again...");
    });

    fightBtn.on("click", function () {
        mapButton.hide();
        fightBtn.hide();
        $(".input-group").hide();
        $("#inputFileToLoadLeft").hide();
        $("#inputFileToLoadRight").hide();
        $("#upload-button-left").hide();
        $("#upload-button-right").hide();
    })

    replayBtn.on("click", function () {
        startGame();
    })

    // End of game function
    function endOfGame() {

        // If health is still above 0 for both players
        if (!isGameInProgress) {
            return;
        }

        // If player 1 health is or below 0
        if (player1Health <= 0 && player2Health > 0) {
            // Update Players wins/losses
            player1Losses++;
            player2Wins++;
            // Call the Play Again button to show
            replayBtn.show();
            isGameInProgress = false;
        }

        // If player 2 health is or below 0
        if (player1Health > 0 && player2Health <= 0) {
            // Update Players wins/losses
            player1Wins++;
            player2Losses++;
            // Call the Play Again button to show
            replayBtn.show();
            isGameInProgress = false;
        }
    }
    startGame();
})