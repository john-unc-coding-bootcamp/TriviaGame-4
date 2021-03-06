var questionCount = 0;
var status;
var currentQuiz;
var timer;
var countdown;
var correct = 0;
var incorrect = 0;
var interQuestion;
var theEnd;

//var endEarly = endGame();

// This defines how the quiz objects will be structured. 
function quiz(name, questions, background, finalImage, link) {
	    this.name = name;
	    this.questions = questions;
	    this.background = background;
	    this.finalImage = finalImage;
	    this.link = link;
	}

// This defines how the ask (question) objects will be structured. 
function ask(question, choices, correct, endImage) {
	    this.question = question;
	    this.choices = choices;

	    // Index of correct answer in above array.
	    this.correct = correct;

	    // Image to be displayed at end of question.
	    this.endImage = endImage;
	}

// The entire page will be generated dynamically using this function. The only thing on the actual page is basic head markup and the objects necesary for that particular quiz. 
// This allows quiz functionality to be quickly cloned to make any number of quizes, updating only the objects passed in. 
// The reason each quiz operates from a seperate HTML page is to make them easier to link to individually. 
function loadGame(quiz) {
	$('body').html("<h1>Super Trivia Game</h1>");
	$('body').append("<p id='time-left'>Time remaining: <span id='time-update'></span></p>");
	$('body').append("<p id='question'></p>");
	$('body').append("<div id='choices'></div>");
	$("#choices").append("<p id='choice-1' class='choice' value='0'></p>");
	$("#choices").append("<p id='choice-2' class='choice' value='1'></p>");
	$("#choices").append("<p id='choice-3' class='choice' value='2'></p>");
	$("#choices").append("<p id='choice-4' class='choice' value='3'></p>");
	backgroundImage = "url(assets/images/" + quiz.background + ")"
	console.log(backgroundImage);
//	$('body').css("background", backgroundImage);
	$('body').prepend("<div id='background-cover'></div>");

	// This initiates the first question. 
	runQuestion(quiz, questionCount)

}

// This functionality powers the individual questions. 
function runQuestion(quiz, ques){
	currentQuiz = quiz;
	$('#question').text(quiz.questions[ques].question);

	//This populates the questions
	$('#choice-1').text(quiz.questions[ques].choices[0]);
	$('#choice-2').text(quiz.questions[ques].choices[1]);
	$('#choice-3').text(quiz.questions[ques].choices[2]);
	$('#choice-4').text(quiz.questions[ques].choices[3]);

	timer = setTimeout(outOfTime, 15500)

	// Functionality to display time. 
	var timeLeft = 15;
	countdown = setInterval(function(){
		timeLeft--;
		if (timeLeft < 10){
			timeLeft = "0" + timeLeft;
		}
		$('#time-update').text("0:" + timeLeft);
	}, 1000);	

}

function outOfTime(){
	alert("Sorry, you're out of time!");
	status = "outtime"
	incorrect++;
	endQuestion();
}

// Returns game to starting state
function resetGame(){
	// Resets variables
	questionCount = 0;
	correct = 0;
	incorrect = 0;

	// Resets document
	$('#time-left').html("Time remaining: <span id='time-update'></span>");
	$('#endChoice-1').remove();
	$('#endChoice-2').remove();
	$('#endChoice-3').remove();
	$('#final-image').remove();

	// Re-shows the HTML elements that will contain the choices. 
	$('#choice-1').show();
	$('#choice-2').show();
	$('#choice-3').show();
	$('#choice-4').show();

	// Loads the new game with the same quiz object
//	loadGame(currentQuiz);
	runQuestion(currentQuiz, questionCount);
}

// On click functionality
$(document).ready(function(){

	$(".choice").click(function(){ 
		var clickedElement = this;
		var elementValue = clickedElement.getAttribute("value");
		if ( elementValue == currentQuiz.questions[questionCount].correct) {
			// Player answered the question correctly
			status = "correct"
			correct++;
		} else {
			// Player answered incorrectly
			status = "incorrect"
			incorrect++;
		}
		endQuestion();
	});

	$("h1").click(function(){ 
		var leavePage = window.confirm("Are you sure you want to exit the quiz?");
		if (leavePage) {
			window.location.replace('index.html');
		}
	});

});

// What happens once the question ends. 
function endQuestion(){
	// Clears out the timers. 
	clearTimeout(timer);
	clearInterval(countdown);
	$('#time-update').text("0:00");

	// Updates display depending on whether user what right, wrong, or slow.
	if (status === "correct"){
		$('#question').text("That's correct!");
	} else if (status === "incorrect") {
		$('#question').text("Incorrect.");
	} else if (status === "outtime"){
		$('#question').text("Out of time.");
	}

	// Displays the correct answer. 
	var correctIndex = currentQuiz.questions[questionCount].correct;
	$('#choice-1').hide();
	$('#choice-2').hide();
	$('#choice-3').hide();
	$('#choice-4').hide();

	$("#choices").append("<p id='ansDisp'></p>");
	$('#ansDisp').text("The answer was " + currentQuiz.questions[questionCount].choices[correctIndex] + ".");
	$('body').append("<img src='assets/images/" + currentQuiz.questions[questionCount].endImage + "' id='answer-image'>");

	// Checks to see if the quiz should end.
	if (questionCount + 1 != currentQuiz.questions.length){
		// This prepares for the next question
		questionCount++
		interQuestion = setTimeout(initNext, 2000);
	} else {
		theEnd = setTimeout(endGame, 2000);
	}
}

// This prepares the program to display the next question. 
// This contains all code that does not to be executed before the first qustion, but that should be executed before subsequent questions. 
// This in runs the function to display the question. 
function initNext(){
	$('#ansDisp').remove();
	$('#answer-image').remove();

	$('#choice-1').show();
	$('#choice-2').show();
	$('#choice-3').show();
	$('#choice-4').show();

	runQuestion(currentQuiz, questionCount);

}

function endGame(){
	// Ensures no time functionality is running.
	clearTimeout(timer);
	clearInterval(countdown);

	// Asseses score
	var totalQuestions = correct + incorrect;
	var percentCorrect = correct / totalQuestions;
	$('#time-left').text("You got " + correct + " out of " + totalQuestions + " correct.");
	if (percentCorrect > 0.9){
		status = "Wow, you know this stuff really well!";
	} else if (percentCorrect > 0.8) {
		status = "Not bad. This is a good subject for you.";
	} else if (percentCorrect > 0.7) {
		status = "Well, you're not an embarassment, but don't quit your day job.";
	} else if (percentCorrect > 0.6) {
		status = "You should probably read up on this more....";
	} else if (percentCorrect > 0.2) {
		status = "I've seen worse, believe it or not....";
	} else {
		status = "You suck!";
	}
	$('#question').text(status);

	$('body').append("<img src='assets/images/" + currentQuiz.finalImage + "' id='final-image'>");

	// This offers possible next steps
	$('#ansDisp').remove();
	$('#answer-image').remove();
	$('#choice-1').hide();
	$('#choice-2').hide();
	$('#choice-3').hide();
	$('#choice-4').hide();
	$("#choices").append("<p id='endChoice-1' class='end-choice'>Try again</p>");
	$("#choices").append("<p id='endChoice-2' class='end-choice'>Take a different quiz</p>");
	$("#choices").append("<p id='endChoice-3' class='end-choice'>Learn more about this subject</p>");

	$("#endChoice-1").click(function(){ 
		resetGame();
	});	

	$("#endChoice-2").click(function(){ 
		window.location.replace('index.html');

	});	

	$("#endChoice-3").click(function(){ 
		window.open(currentQuiz.link,'_blank');
	});	
}