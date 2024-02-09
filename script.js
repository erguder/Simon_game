var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern= [];
var level = 0;
var started = false;
var finished = false;

const getLocalHighScores = async () => {
  const response = await fetch('http://localhost:3000/local-high-scores');
  const data = await response.json();
  console.log('Local High Scores:', data);
};

const updateScoresUI = (containerId, scores) => {
  const container = document.getElementById(containerId);
  // container.innerHTML = ''; // Comment out or remove this line to keep previous scores

  scores.forEach(score => {
      const listItem = document.createElement('li');
      listItem.textContent = `${score.username}: ${score.score}`;
      container.appendChild(listItem);
  });
};

const saveLocalScore = async (username, score) => {
  await fetch('http://localhost:3000/local-high-scores', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, score }),
  });
};

$(document).on("keypress", function(){
  if (!started){
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
  }
});

$(".btn").click( function() {
  var userChosenColor = $(this).attr("id");
  userClickedPattern.push(userChosenColor);

  playSound(userChosenColor);
  animatePress(userChosenColor);
  checkAnswer(userClickedPattern.length-1);
} );

function checkAnswer(currentLevel){
  if(gamePattern[currentLevel] === userClickedPattern[currentLevel]){
    console.log("success");
  if(userClickedPattern.length === gamePattern.length){
      setTimeout( function() {
        nextSequence();}, 1000);
      }
    }else{

    console.log("wrong");
    playSound("wrong");
    $("body").addClass("game-over");

    setTimeout(function() {
    
      $("body").removeClass("game-over");}, 200);
      $("#level-title").text("Game Over, Press Any Key to Restart");
      $(document).keypress(startOver());
    } 
}

function nextSequence(){
  userClickedPattern =[];
  level++;
  $("#level-title").text("Level " + level);

  var randomNumber = Math.floor(Math.random()*4);
  var randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);

  $("#" + randomChosenColor)
    .fadeIn(100)
    .fadeOut(100)
    .fadeIn(100);
  playSound(randomChosenColor);
}

function playSound(name){
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function animatePress(currentColor){
  $("#" + currentColor).addClass("pressed");
  setTimeout( function(){
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

function startOver() {
  // Get the entered username
  const username = document.getElementById('username').value;

  // Show the username input container
  const usernameInputContainer = document.getElementById('username-input-container');
  usernameInputContainer.style.display = 'block';

  // Check if the user entered a name
  if (username !== null && username !== "") {
      // Save the local and global scores
      saveLocalScore(username, level);
      saveGlobalScore(username, level);

      // Display the local and global scores
      getLocalHighScores();
      getGlobalHighScores();

      // Provide feedback to the user and hide the input container
      usernameInputContainer.innerHTML = `<p>Username submitted: ${username}</p>`;
      setTimeout(() => {
          usernameInputContainer.style.display = 'none';
      }, 1000); // Hide after 2 seconds

      // Restart the game
      level = 0;
      gamePattern = [];
      started = false;
      $("#level-title").text("Press A Key to Start");
      $(document).keypress(startOver);
  }
}

function saveScoresAndRestart() {
  const username = document.getElementById('username').value;

  if (username !== "") {
      saveLocalScore(username, level);
      saveGlobalScore(username, level);

      getLocalHighScores();
      getGlobalHighScores();

      document.getElementById('username-input-container').style.display = 'none';
  }
}