$(document).ready(function() {
	//declare variables and objects
	var timeLeft = 30;
	var correct = 0;
	var incorrect = 0;
	var unanswered = 0;
	var arrayNumber = 0;
	var IntervalID;
	var displayImage;
	var image;
	var click = new Audio("assets/audio/click.wav");
	var quiz = [{question: "What is the hottest place on Earth?", answers: ["Lut Desert, Iran", "Furnace Creek, California", "Gobi Desert, China", "El Azizia, Libya"], solution: "Lut Desert, Iran", image: "lut desert"},
				{question: "What is the southernmost town on Earth?", answers: ["Bluff, New Zealand", "Ushuaia, Argentina", "Puerto Williams, Chile", "Stanley, UK"], solution: "Puerto Williams, Chile", image: "puerto williams chile"},
				{question: "What is the biggest city on Earth?", answers: ["New York City, USA", "Tokyo, Japan", "Mexico City, Mexico", "Sao Paolo, Brazil"], solution: "Tokyo, Japan", image: "tokyo japan"},
				{question: "What is the happiest nation on Earth?", answers: ["USA", "Switzerland", "Denmark", "Norway"], solution: "Norway", image: "norway fjord"},
				{question: "Which is the most photographed place on Earth?", answers: ["Madrid, Spain", "Eiffeltower in Paris, France", "Buckingham Palace, Great Britain", "Guggenheim Museum, New York, USA"], solution: "Guggenheim Museum, New York, USA", image: "guggenheim museum new york"}];


//--------------------------------------------------------------------------------------------------------------------------------
//functions and click events for the game

//initial screen when page loads
function gameStart(){
	var startButton = $("<button>");
	startButton.addClass("start");
	startButton.text("Start the Game");
	$(".start").html(startButton);
}
//function call to pull up initial html
gameStart();

//click event to start the game
$(".start").on("click", function(event){
	event.preventDefault();
	click.play();
	questionDisplay();
	//remove Start button
	$(".start").html("");
});

//click event to answer questions
$(document).on("click", ".answer", function() {
	click.play();
	stop();
	$(".timer").html("");
	if($(this).text() === quiz[arrayNumber].solution) {
		correctAnswer();
	}else {
		wrongAnwer();
	}
});

//click event to start over
$(".tryagain").on("click", function(){
	click.play();
	resetStats();
	questionDisplay();
})

//screen displaying questions
function questionDisplay(){
	//display time left to answer
	$(".timer").html("You have " + timeLeft + "seconds left.");
	//run time frame given to answer the question
	runTimer();

	//ajax call for image (this way information is returned by the time the question is answered)
	var apiKey = 'ff324jg58kgra8xkdnfnqmcm';
	image = quiz[arrayNumber].image;
	var queryURL = 'http://api.ghettyimages.com/v3/search/images?phrase=' + image;

	$.ajax({
		url: queryURL,
		method: "GET",
		beforeSend: function(request){
			request.setRequestHeader("Api-Key", apiKey);
		}}).done(function(response) {
			console.log(response);
			displayImage = $("<img src='" + response.images[0].display_sizes[0].uri + "'/>");
		})

	//create div to hold our question and answers and adding bootstrap style
	var gameScreen = $("<div>");
	gameScreen.addClass("panel panel-default");
	//create div which holds the question
	var questionString = $("<div>");
	questionString.addClass("panel-heading");
	questionString.text(quiz[arrayNumber].question);
	gameScreen.append(questionString);
	//create ul for answers
	var answerList = $("<ul class='list-group>");
	gameScreen.append(answerList);
	//create divs for answers (always four possible answers)
	for (var i = 0; i < 4; i++) {
		var answerString = $("<li class='list-group-item answer'>");
		answerString.text(quiz[arrayNumber].answers[i]);
		gameScreen.append(answerString);
	}
	//displaying question and answers in main-content area
	$(".main-content").html(gameScreen);
}

//function to be called when answer is correct
function correctAnswer(){
	correct++;
	var messageRight = $("<div>");
	var display = $("<p>").text("You're right! The correct answer is " + quiz[arrayNumber].solution + ".");
	messageRight.append(display);
	messageRight.append(displayImage);
	$(".main-content").html(messageRight);
	setTimeout(storOrContinue, 2000);
}

//function to be called when answer is incorrect
function wrongAnswer(){
	incorrect++;
	var messageWrong = $("<div>");
	var display = $("<p>").text("Oops! Maybe next time! The correct answer is " + quiz[arrayNumber].solution + ".");
	messageWrong.append(display);
	messgaeWrong.append(displayImage);
	$(".main-content").html(messgaeWrong);
	setTimeout(stopOrContinue, 2000);
}

//function to be called when time runs out before user answers question
function unansweredQuestion(){
	unanswered++;
	var messageUnanswered = $("<div>");
	var display = $("<p>").text("Your time is up! The correct answer is " + quiz[arrayNumber].solution + ".");
	messageUnanswered.append(display);
	messageUnanswered.append(displayImage);
	$(".main-content").html(messageUnanswered);
	setTimeout(stopOrContinue, 2000);
}

//game over screen whith tally of wins, losses, and unanswered questions and image matching correct answer
function endOfGameScreen(){
	var endResult = $("<div>");
	var rightAnswers = $("<p>").text("Correct Answers: " + correct);
	endResult.append(rightAnswers);
	var wrongAnswers = $("<p>").text("Incorrect Answers: " + incorrect);
	endResult.append(wrongAnswers);
	var unansweredQ = $("<p>").text("Unanswered Quesstions: " + unanswered);
	endResult.append(unansweredQ);
	$(".main-content").html(endResult);
	var restartButton = $("<button>").text("Try Again");
	$(".tryagain").html(restartButton);
}

//timer for question screen
function runTimer(){
	IntervalID = setInterval(decrement, 1000);
}

//stop timer when time is up or user answers question
function stop(){
	clearInterval(IntervalID);
}

//decrease time by one second or stop timer when 
function decrement(){
	if (timeLeft === 0){
		stop();
		unansweredQuestion();
	} else {
		timeLeft--;
		$(".timer").html("You have " + timeLeft + " seconds left.");
	}
}

//function to see if the last question has been called on
function stopOrContinue(){
	arrayNumber++;
	if (arrayNumber < 5){
		questionDisplay();
	} else{
		endOfGameScreen();
	}
}

//reset game statistics for new round
function resetStats(){
	timeLeft = 30;
	correct = 0;
	incorrect = 0;
	unanswered = 0;
	arrayNumber = 0;
	$(".tryagain").html("");
}
});