$(document).ready(function () {
    // Uploading images part of the code

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
                };
                fileReader.readAsDataURL(fileToLoad);
            }
        }
    }
    
    selectImageLeft();
    
    loadImageFileAsURLLeft();
    
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
                };
                fileReader.readAsDataURL(fileToLoad);
            }
        }
    }
    
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

    var player1Name = "";
    var player2Name = "";
    var player1Wins = "";
    var player2Wins = "";
    var player1Losses = "";
    var player2Losses = "";

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
        });
    };

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
    };

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
    });

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
    });

    database.ref().child("Player 1").on("value", function (snapshot) {
        if (snapshot.exists()) {
            $("#player1-name").text(snapshot.val().name);
            $("#player1-wins").text(snapshot.val().wins);
            $("#player1-losses").text(snapshot.val().losses);
        }
    });

    database.ref().child("Player 2").on("value", function (snapshot) {
        if (snapshot.exists()) {
            $("#player2-name").text(snapshot.val().name);
            $("#player2-wins").text(snapshot.val().wins);
            $("#player2-losses").text(snapshot.val().losses);
        }
    });

    // API side of the code

    $("#submit-button-left").on("click", function () {
        var leftSubmit = $("#search-area-left").val().trim();

        var queryURL = 'https://cors-anywhere.herokuapp.com/https://api.giphy.com/v1/gifs/random?q=' + leftSubmit + '_face&api_key=geIvRT3pmBulEx73snik2cGpLMo8dNKL&limit=1';

        var imageURL = "";

        $.ajax({
            url: queryURL,
            method: "GET",
            dataType: "json",
            headers: {
                "x-requested-with": "xhr"
            }
        }).then(function (mySearch) {
            imageURL = mySearch.data.images['480w_still'].url;

            $("#image-left").attr("src", imageURL);

            var faceAPIURL = "https://cors-anywhere.herokuapp.com/https://api-us.faceplusplus.com/facepp/v3/detect?api_secret=dplTghWzYIibJghR7hm-dDpM6wsgQbbO&api_key=veWkJ-Dem6QYsHQkC_lvGtug0Y05OLjz&image_url=" + imageURL + "&return_attributes=gender,age,emotion";

            $.ajax({
                url: faceAPIURL,
                method: "POST",
                dataType: "json",
                headers: {
                    "x-requested-with": "xhr"
                }
            }).then(function (response) {
                var player1Neutral = response.faces[0].attributes.emotion.neutral;
                var player1Sadness = response.faces[0].attributes.emotion.sadness;
                var player1Disgust = response.faces[0].attributes.emotion.disgust;
                var player1Anger = response.faces[0].attributes.emotion.anger;
                var player1Surprise = response.faces[0].attributes.emotion.surprise;
                var player1Happiness = response.faces[0].attributes.emotion.happiness;
                var player1Fear = response.faces[0].attributes.emotion.fear;

                if (player1Neutral > 80) {
                    $("#image-left").attr("neutral", 20);
                }
                else {
                    $("#image-left").attr("neutral", 10);
                }

                if (player1Sadness > 80) {
                    $("#image-left").attr("sadness", 20);
                }
                else {
                    $("#image-left").attr("sadness", 10);
                }

                if (player1Disgust > 80) {
                    $("#image-left").attr("disgust", 20);
                }
                else {
                    $("#image-left").attr("disgust", 10);
                }

                if (player1Anger > 80) {
                    $("#image-left").attr("anger", 20);
                }
                else {
                    $("#image-left").attr("anger", 10);
                }

                if (player1Surprise > 80) {
                    $("#image-left").attr("surprise", 20);
                }
                else {
                    $("#image-left").attr("surprise", 10);
                }

                if (player1Happiness > 80) {
                    $("#image-left").attr("happiness", 20);
                }
                else {
                    $("#image-left").attr("happiness", 10);
                }

                if (player1Fear > 80) {
                    $("#image-left").attr("fear", 20);
                }
                else {
                    $("#image-left").attr("fear", 10);
                }
            }).fail(function (jqXHR, textStatus) {
                console.error(textStatus)
            });
        });
    })

    $("#submit-button-right").on("click", function () {
        var rightSubmit = $("#search-area-right").val().trim();

        var queryURL = 'https://cors-anywhere.herokuapp.com/https://api.giphy.com/v1/gifs/random?q=' + rightSubmit + '_face&api_key=geIvRT3pmBulEx73snik2cGpLMo8dNKL&limit=1';

        var imageURL = "";

        $.ajax({
            url: queryURL,
            method: "GET",
            dataType: "json",
            headers: {
                "x-requested-with": "xhr"
            }
        }).then(function (mySearch) {
            imageURL = mySearch.data.images['480w_still'].url;

            $("#image-right").attr("src", imageURL);

            var faceAPIURL = "https://cors-anywhere.herokuapp.com/https://api-us.faceplusplus.com/facepp/v3/detect?api_secret=dplTghWzYIibJghR7hm-dDpM6wsgQbbO&api_key=veWkJ-Dem6QYsHQkC_lvGtug0Y05OLjz&image_url=" + imageURL + "&return_attributes=gender,age,emotion"

            $.ajax({
                url: faceAPIURL,
                method: "POST",
                dataType: "json",
                headers: {
                    "x-requested-with": "xhr"
                }
            }).then(function (response) {
                var player2Neutral = response.faces[0].attributes.emotion.neutral;
                var player2Sadness = response.faces[0].attributes.emotion.sadness;
                var player2Disgust = response.faces[0].attributes.emotion.disgust;
                var player2Anger = response.faces[0].attributes.emotion.anger;
                var player2Surprise = response.faces[0].attributes.emotion.surprise;
                var player2Happiness = response.faces[0].attributes.emotion.happiness;
                var player2Fear = response.faces[0].attributes.emotion.fear;

                if (player2Neutral > 80) {
                    $("#image-right").attr("neutral", 20);
                }
                else {
                    $("#image-right").attr("neutral", 10);
                }

                if (player2Sadness > 80) {
                    $("#image-right").attr("sadness", 20);
                }
                else {
                    $("#image-right").attr("sadness", 10);
                }

                if (player2Disgust > 80) {
                    $("#image-right").attr("disgust", 20);
                }
                else {
                    $("#image-right").attr("disgust", 10);
                }

                if (player2Anger > 80) {
                    $("#image-right").attr("anger", 20);
                }
                else {
                    $("#image-right").attr("anger", 10);
                }

                if (player2Surprise > 80) {
                    $("#image-right").attr("surprise", 20);
                }
                else {
                    $("#image-right").attr("surprise", 10);
                }

                if (player2Happiness > 80) {
                    $("#image-right").attr("happiness", 20);
                }
                else {
                    $("#image-right").attr("happiness", 10);
                }

                if (player2Fear > 80) {
                    $("#image-right").attr("fear", 20);
                }
                else {
                    $("#image-right").attr("fear", 10);
                }
            }).fail(function (jqXHR, textStatus) {
                console.error(textStatus)
            });
        });
    });

    var imageLeft;

    $("#upload-button-left").on("click", function () {
        imageLeft = setTimeout(imageLeftUpload, 1000);
    });

    function imageLeftUpload() {
        console.log("clicked");

        var imageURL = $("#image-left").attr("src");

        var faceAPIURL = "https://cors-anywhere.herokuapp.com/https://api-us.faceplusplus.com/facepp/v3/detect";

        $.ajax({
            url: faceAPIURL,
            method: "POST",
            dataType: "json",
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
            var player1Neutral = response.faces[0].attributes.emotion.neutral;
            var player1Sadness = response.faces[0].attributes.emotion.sadness;
            var player1Disgust = response.faces[0].attributes.emotion.disgust;
            var player1Anger = response.faces[0].attributes.emotion.anger;
            var player1Surprise = response.faces[0].attributes.emotion.surprise;
            var player1Happiness = response.faces[0].attributes.emotion.happiness;
            var player1Fear = response.faces[0].attributes.emotion.fear;

            if (player1Neutral > 80) {
                $("#image-left").attr("neutral", 20);
            }
            else {
                $("#image-left").attr("neutral", 10);
            }

            if (player1Sadness > 80) {
                $("#image-left").attr("sadness", 20);
            }
            else {
                $("#image-left").attr("sadness", 10);
            }

            if (player1Disgust > 80) {
                $("#image-left").attr("disgust", 20);
            }
            else {
                $("#image-left").attr("disgust", 10);
            }

            if (player1Anger > 80) {
                $("#image-left").attr("anger", 20);
            }
            else {
                $("#image-left").attr("anger", 10);
            }

            if (player1Surprise > 80) {
                $("#image-left").attr("surprise", 20);
            }
            else {
                $("#image-left").attr("surprise", 10);
            }

            if (player1Happiness > 80) {
                $("#image-left").attr("happiness", 20);
            }
            else {
                $("#image-left").attr("happiness", 10);
            }

            if (player1Fear > 80) {
                $("#image-left").attr("fear", 20);
            }
            else {
                $("#image-left").attr("fear", 10);
            }
        }).fail(function (jqXHR, textStatus) {
            console.error(textStatus)
        });
    }

    var imageRight;

    $("#upload-button-right").on("click", function () {
        imageRight = setTimeout(imageRightUpload, 1000);
    });

    function imageRightUpload() {
        console.log("clicked");

        var imageURL = $("#image-right").attr("src");

        var faceAPIURL = "https://cors-anywhere.herokuapp.com/https://api-us.faceplusplus.com/facepp/v3/detect";

        $.ajax({
            url: faceAPIURL,
            method: "POST",
            dataType: "json",
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
            var player2Neutral = response.faces[0].attributes.emotion.neutral;
            var player2Sadness = response.faces[0].attributes.emotion.sadness;
            var player2Disgust = response.faces[0].attributes.emotion.disgust;
            var player2Anger = response.faces[0].attributes.emotion.anger;
            var player2Surprise = response.faces[0].attributes.emotion.surprise;
            var player2Happiness = response.faces[0].attributes.emotion.happiness;
            var player2Fear = response.faces[0].attributes.emotion.fear;

            if (player2Neutral > 80) {
                $("#image-right").attr("neutral", 20);
            }
            else {
                $("#image-right").attr("neutral", 10);
            }

            if (player2Sadness > 80) {
                $("#image-right").attr("sadness", 20);
            }
            else {
                $("#image-right").attr("sadness", 10);
            }

            if (player2Disgust > 80) {
                $("#image-right").attr("disgust", 20);
            }
            else {
                $("#image-right").attr("disgust", 10);
            }

            if (player2Anger > 80) {
                $("#image-right").attr("anger", 20);
            }
            else {
                $("#image-right").attr("anger", 10);
            }

            if (player2Surprise > 80) {
                $("#image-right").attr("surprise", 20);
            }
            else {
                $("#image-right").attr("surprise", 10);
            }

            if (player2Happiness > 80) {
                $("#image-right").attr("happiness", 20);
            }
            else {
                $("#image-right").attr("happiness", 10);
            }

            if (player2Fear > 80) {
                $("#image-right").attr("fear", 20);
            }
            else {
                $("#image-right").attr("fear", 10);
            }
            
            // Trial

            var player2Buttons = [];
            

        }).fail(function (jqXHR, textStatus) {
            console.error(textStatus)
        });
    }
})