$(document).ready(function() {

    //declare variables and objects
    var timeLeft;
    var correct = 0;
    var incorrect = 0;
    var unanswered = 0;
    var arrayNumber = 0;
    var questionTime;
    var displayImage;
    var image;
    var click = new Audio("assets/audio/click.wav");
    var quiz = [
    	{question: "What is the hottest place on Earth?", answers: ["Lut Desert, Iran", "Furnace Creek, California", "Gobi Desert, China", "El Azizia, Libya"], solution: "Lut Desert, Iran", image: "lut desert"}, 
        {question: "What is the southernmost town on Earth?", answers: ["Bluff, New Zealand", "Ushuaia, Argentina", "Puerto Williams, Chile", "Stanley, UK"], solution: "Puerto Williams, Chile", image: "puerto williams chile"}, 
        {question: "What is the biggest city on Earth?", answers: ["New York City, USA", "Tokyo, Japan", "Sao Paulo, Brazil", "Mexico City, Mexiko"], solution: "Tokyo, Japan", image: "tokyo japan"}, 
        {question: "What is the happiest nation on Earth?", answers: ["USA", "Switzerland", "Norway", "Denmark"], solution: "Norway", image: "norway fjord"}, 
        {question: "Which is the most photographed place on Earth?", answers: ["Guggenheim Museum, New York", "Taj Mahal, India", "The Leaning Tower of Pisa, Italy", "Eiffeltower, France"], solution: "Guggenheim Museum, New York", image: "guggenheim museum new york"},
        {question: "What is the smallest country in the world?", answers: ["Tuvalu", "San Marino", "Monaco", "Vatican City"], solution: "Vatican City", image: "vatican"},
        {question: "Which country has the highest biodiversity?", answers: ["China", "Indonesia", "Brazil", "Mexico"], solution: "Brazil", image: "brazil rainforest"},
        {question: "Which country has the most days of paid leave per year?", answers: ["Austria", "USA", "Spain", "Sri Lanka"], solution: "Austria", image: "austria"},
        {question: "Which country produces the most movies in the world?", answers: ["USA", "India", "Nigeria", "France"], solution: "India", image: "bollywood"},
        {question: "What is the lowest point on the Earth?", answers: ["Death Valley, USA", "Quattara Depression, Egypt", "Dead Sea, Israel/Jordan", "Lake Assal, Djibuti"], solution: "Dead Sea, Israel/Jordan", image: "dead sea israel"}
        ];

    //first screen when page loads with click event to start game
    function gameStart() {
        var startButton = $("<button>");
        startButton.addClass("start");
        startButton.text("Start the Game");
        $(".start").html(startButton);
    }
    //calls on gameStart function to display initial screen
    gameStart();

    //click function to start game by pulling first quesstion
    $(":button.start").on("click", function() {
        event.preventDefault();
        click.play();
        questionDisplay();
        //remove start button
        $(".start").html("");
    });

    //screen displaying the questions
    function questionDisplay() {
        //display time left to answer
        timeLeft = 20;
        $(".timer").html("You have " + timeLeft + " seconds left.");
        //run time frame given to answer question
        runTimer();

        //ajax call for image
        var apiKey = 'ff324jg58kgra8xkdnfnqmcm';
        image = quiz[arrayNumber].image;
        var queryURL = 'https://api.gettyimages.com/v3/search/images?phrase=' + image;
        $.ajax({
            url: queryURL,
            method: "GET",
            beforeSend: function(request) {
                request.setRequestHeader("Api-Key", apiKey);
            }
        }).done(function(response) {
            console.log(response);
            displayImage = $("<img src='" + response.images[0].display_sizes[0].uri + "'/>");

        })

        //creating the div to hold our question and answers and adding bootstrap style
        var gameScreen = $("<div>");
        gameScreen.addClass("panel panel-default");
        //create div which holds the question
        var questionString = $("<div>");
        questionString.addClass("panel-heading");
        questionString.text(quiz[arrayNumber].question);
        gameScreen.append(questionString);
        //create ul for answers
        var answerList = $("<ul class='list-group>'");
        gameScreen.append(answerList);
        //create divs for answers (always four possible answers)
        for (var i = 0; i < 4; i++) {
            var answerString = $("<li class='list-group-item answer'>");
            answerString.text(quiz[arrayNumber].answers[i]);
            gameScreen.append(answerString);
        }
        //filling main-content area with our question and answers
        $(".main-content").html(gameScreen);
    }

    //click function to process user input on answer
    $(document).on("click", ".answer", function() {
        click.play();
        stop();
        if ($(this).text() === quiz[arrayNumber].solution) {
            correctAnswer();
        } else {
            wrongAnswer();
        }
    });


    //screen for correct answer
    function correctAnswer() {
        correct++;
        $(".timer").html("");
        var messageRight = $("<div>");
        var display = $("<p class='text-center'>").text("You're right! The correct answer is " + quiz[arrayNumber].solution + ".");
        messageRight.append(display);
        messageRight.append(displayImage);
        $(".main-content").html(messageRight);
        setTimeout(stopOrContinue, 5000);
    }
    //screen for incorrent answer
    function wrongAnswer() {
        incorrect++;
        $(".timer").html("");
        var messageWrong = $("<div>");
        var display = $("<p class= 'text-center'>").text("Oops! Maybe next time! The correct answer is " + quiz[arrayNumber].solution + ".");
        messageWrong.append(display);
        messageWrong.append(displayImage);
        $(".main-content").html(messageWrong);
        setTimeout(stopOrContinue, 5000);
    }
    //screen when question remains unanswered after time is up
    function unansweredQuestion() {
        unanswered++;
        $(".timer").html("");
        var messageUnanswered = $("<div>");
        var display = $("<p class='text-center'>").text("Your time is up! The correct answer is " + quiz[arrayNumber].solution + ".");
        messageUnanswered.append(display);
        messageUnanswered.append(displayImage);
        $(".main-content").html(messageUnanswered);
        setTimeout(stopOrContinue, 5000);
    }

    //game over screen with tally of wins, losses and unanswered questions with click to start over
    function endOfGameScreen() {
        var endResult = $("<div>");
        endResult.addClass("endresult");
        var rightAnswers = $("<p>").text("Correct Answers: " + correct);
        endResult.append(rightAnswers);
        var wrongAnwers = $("<p>").text("Incorrect Answers: " + incorrect);
        endResult.append(wrongAnwers);
        var unansweredQ = $("<p>").text("Unanswered Questions: " + unanswered);
        endResult.append(unansweredQ);
        var restartButton = $("<button>").text("Try Again");
        if (correct === 10){
        	var message = $("<p>").text("You are an expert!");
        	endResult.append(message);
        }else if (correct <= 9 && correct >=6) {
        	var message = $("<p>").text("You have a solid knowledge of world facts!");
  			endResult.append(message);
        }else {
        	var message = $("<p>").text("Most of your answers are wrong! Grab your passport and go travel!");
        	endResult.append(message);
        }
        //display main content html and restart button
        $(".main-content").html(endResult);
        $(".tryagain").html(restartButton);
    }

    //run timer for question screen
    function runTimer() {
        questionTime = setInterval(decrement, 1000);
    }

    //decreases time by one second or stops timer when countdown is up
    function decrement() {
        //decrease timeLeft by one and display on screen in timer tag
        timeLeft--;
        $(".timer").html("You have " + timeLeft + " seconds left.");

        if (timeLeft === 0) {
            stop();
            unansweredQuestion();
        }
    }

    //stops interval when question is answered or time is up
    function stop() {
        clearInterval(questionTime);
    }

    //function to see if there are questions left or final screen needs to be displayed
    function stopOrContinue() {
        arrayNumber++;
        if (arrayNumber < quiz.length) {
            questionDisplay();
        } else {
            endOfGameScreen();
        }
    }

    //reset game statistics
    function resetStats() {
        timeLeft = 30;
        correct = 0;
        incorrect = 0;
        unanswered = 0;
        arrayNumber = 0;
        $(".tryagain").html("");
    }

    $(".tryagain").on("click", function() {
        click.play();
        resetStats();
        questionDisplay();
    });

});
