
$(function(){

    //adding a clock to jumbotron
  var datetime = null,
    date = null;

  var update =  () => {
    date = moment(new Date())
    datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
  };

  datetime = $('#datetime')
  update();
  setInterval(update, 1000);

    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyB-gw925BJPGRlHlBuhGj9XJBPmKMO6Fqg",
      authDomain: "trainschedulerauth.firebaseapp.com",
      databaseURL: "https://trainschedulerauth.firebaseio.com",
      projectId: "trainschedulerauth",
      storageBucket: "trainschedulerauth.appspot.com",
      messagingSenderId: "284899467132"
    };
    firebase.initializeApp(config);
  var database = firebase.database();

 
  // 2. Button for adding Trains
  $("#submit").on("click",  (event) => {
    event.preventDefault();

    
    // Grabs user input
    var trainName = $("#train-name").val().trim();
    // console.log(trainName);
    var destination = $("#destination").val().trim();
    // console.log(destination);
    var freq = $("#freq").val().trim();
    // console.log(freq);

    var firstTime = $("#train-time").val().trim();
    // console.log(firstTime);
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");;
    // console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    // console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    var diffTime = currentTime.diff(moment(firstTimeConverted), "minutes");
    // console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder) 
    var tRemainder = diffTime % freq;
    // console.log(tRemainder);

    // Minute Until Train - minutes away
    var tMinutesTillTrain = freq - tRemainder;
    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrainMin = moment().add(tMinutesTillTrain, "minutes");
    var nextTrain = moment(nextTrainMin).format("hh:mm")
    // console.log("ARRIVAL TIME: " + nextTrain);
    
   

    // Creates local "temporary" object for holding employee data
    var newTrain = {
      trainName: trainName,
      destination: destination,
      freq: freq,
      nextTrain: nextTrain,
      tMinutesTillTrain: tMinutesTillTrain
    };

    // Uploads trains data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    // console.log(trainName);
    // console.log(destination);
    // console.log(freq);
    // console.log(nextTrain);
    // console.log(tMinutesTillTrain);
    

    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#new-train").val("");
    $("#destination").val("");
    $("#train-time").val("");
    $("#freq").val("");
    
  });
  
// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", (childSnapshot) => {

    //store everything into a variable
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var freq = childSnapshot.val().freq;
    var nextTrain = childSnapshot.val().nextTrain;
    var tMinutesTillTrain = childSnapshot.val().tMinutesTillTrain;

    // Employee Info
    console.log(trainName);
    console.log(destination);
    console.log(freq);
    console.log(nextTrain);
    console.log(tMinutesTillTrain);

    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destination),
      $("<td>").text(freq),
      $("<td>").text(nextTrain),
      $("<td>").text(tMinutesTillTrain),
      $("<td>").html("<span class='remove'> x </span>")
    );

    // Append the new row to the table
    $("#train-new > tbody").append(newRow);

    //deleting the row
    // need to use parent() because it is a jQuery object, not a normal DOM object
    $(".remove").on('click', function () {
      $(this).parent().parent().remove();
      childSnapshot.remove();

        });

  })

});

