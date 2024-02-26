$(document).ready(function() {
  var busSound = new Audio("audio/bus.mp3");
  busSound.volume = 0.3;
  var totalChildren = 25;
  var foundChildren = 0;
  var playgroundWidth = $("#playground").width();
  var playgroundHeight = $("#playground").height();
  var character = $("#character");
  var stepSize = 8;
  var timeRemaining = 300;
  var countdownTimeout;
  var countdownElement = $("#countdown");
  var initialPosition = { top: 75, left: 75 };
  var newPosition;

  character.css(initialPosition);

  // Function to generate a random position within the game container
  function getRandomPosition() {
    var containerWidth = playgroundWidth - 8; // Adjusting for object width
    var containerHeight = playgroundHeight - 16; // Adjusting for object height
    var posX = Math.floor(Math.random() * containerWidth);
    var posY = Math.floor(Math.random() * containerHeight);
    return { top: posY, left: posX };
  }

  // Array of sound files
  var sounds = ['gasp.wav', 'giggle.wav', 'giggle2.wav', 'giggle3.wav'];

  // Function to play a random sound
  function playRandomSound() {
    var randomIndex = Math.floor(Math.random() * sounds.length);
    var audio = new Audio('audio/' + sounds[randomIndex]);
    audio.volume = 0.3;
    audio.play();
  }

  // Create and place the objects randomly within the game container
  for (var i = 1; i <= totalChildren; i++) {
    var child = $('<div class="object"></div>');
    var position = getRandomPosition();
    child.css(position);
    child.attr("id", "object" + i);
    $("#playground").append(child);
  }

  // Move the character
  $(document).keydown(function(e) {
    var position = character.position();

    switch (e.which) {
      case 65: // Left arrow 37
      case 37:
        newPosition = { top: position.top, left: position.left - stepSize };
        $("#character").css('background-image', 'url(img/char-left.png)');
        break;
      case 87: // Up arrow 38
      case 38:
        newPosition = { top: position.top - stepSize, left: position.left };
        $("#character").css('background-image', 'url(img/char-back.png)');
        break;
      case 68: // Right arrow 39
      case 39:
        newPosition = { top: position.top, left: position.left + stepSize };
        $("#character").css('background-image', 'url(img/char-right.png)');
        break;
      case 83: // Down arrow 40
      case 40:
        newPosition = { top: position.top + stepSize, left: position.left };
        $("#character").css('background-image', 'url(img/char-front.png)');
        break;
    }

    // Check that the character stays within the game container
    if (
      newPosition.left >= 0 &&
      newPosition.top >= 0 &&
      newPosition.left + character.width() <= playgroundWidth &&
      newPosition.top + character.height() <= playgroundHeight
    ) {
      character.css(newPosition);
    }

    // Check if the character has found a child object
    $(".object").each(function() {
      if (isColliding(character, $(this)) && !$(this).hasClass("found")) {
        $(this).addClass("found");
        $(this).hide();
        foundChildren++;
        $("#counter span").text(foundChildren + "/25");

        playRandomSound(); // Play a random sound

        if (foundChildren === totalChildren) {
          clearTimeout(countdownTimeout);
          swal("Bra jobbat!", "Du hjälpte till att hitta alla försvunna elever!").then((value) => {
					  location.reload(); // Reload page
					});
        }
      }
    });
  });

  // Collision detection between two elements
  function isColliding(element1, element2) {
    var rect1 = element1[0].getBoundingClientRect();
    var rect2 = element2[0].getBoundingClientRect();

    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  }

  // Function to be executed at the specified interval
  function myFunction() {
    /*
    $('.object').addClass('shake');

    setTimeout(function(){
      $('.object').removeClass('shake');
    },300);*/
  }

  // Generate a random delay between 20 and 30 seconds (in milliseconds)
  function getRandomDelay() {
    return Math.floor(Math.random() * (15000 - 10000 + 1)) + 10000;
  }

  // Run the function at the specified interval
  //setInterval(myFunction, getRandomDelay());

  // Function to update the countdown display
  function updateCountdown() {
    var minutes = Math.floor(timeRemaining / 60);
    var seconds = timeRemaining % 60;
    var formattedTime = padNumber(minutes) + ":" + padNumber(seconds);
    countdownElement.text(formattedTime);

    if (timeRemaining <= 0) {
      $('.object').addClass('animate-circle');
      busSound.play();
      disableCharacterMovement();
      setTimeout(function() {
        location.reload();
      }, 10000);
      //alert("Du hittade inte eleverna i tid och nu har ni missat bussen :(");
      //location.reload(); // Reload the page when time is up
    } else {
      timeRemaining--;
      countdownTimeout = setTimeout(updateCountdown, 1000); // Update countdown every second
    }
  }

  // Function to pad single-digit numbers with a leading zero
  function padNumber(number) {
    return (number < 10) ? "0" + number : number;
  }

  // Disable character movement
  function disableCharacterMovement() {
    $(document).off('keydown');
  }

  // start button click
  $('#start-button').click(function() {
    $("#playground").show();
    $("#counter").show();
    $("#countdown").show();
    $("#game-title").hide();
    $("#game-info").hide();
    $("#version-info").hide();
    $("#credit-info").hide();
    // Start the countdown
    updateCountdown();
  });

  // Initialize the game
  function initGame() {
    $("#playground").hide();
    $("#counter").hide();
    $("#countdown").hide();
  }

  // Run the game
  initGame();

  //Disable right click
  $(document).on("contextmenu", function(e) {
    e.preventDefault();
  });
});
