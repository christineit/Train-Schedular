//This is necessary so that the html loads before the js code starts to run:
$(document).ready(function() {
  // Initialize Firebase:
  var config = {
    apiKey: "AIzaSyCAkFWIr7xIRN1GSkQd9W5bt2750ZYyd00",
    authDomain: "train-schedular-e9eb5.firebaseapp.com",
    databaseURL: "https://train-schedular-e9eb5.firebaseio.com",
    projectId: "train-schedular-e9eb5",
    storageBucket: "train-schedular-e9eb5.appspot.com",
    messagingSenderId: "797557887738"
  };
  firebase.initializeApp(config);
  //This is setting my database variable to always call back to the firebase database:
  var database = firebase.database();
  // console.log(firebase); which tells us database is connecting correctly

  //This function will allow the values entered into the form to be captured, and placed into the database on the on click event:
  $("button").on("click", function(event) {
    event.preventDefault();

    var trainName = $("#trainName").val();
    var trainDestination = $("#trainDestination").val();
    var firstTrainTime = $("#firstTrainTime").val();
    var trainFrequency = $("#trainFrequency").val();

    // Firebase requires data to be entered as an object.  Each key value pair gets entered separately as a diff. field:
    var newTrain = {
      trainName: trainName,
      trainDestination: trainDestination,
      firstTrainTime: firstTrainTime,
      trainFrequency: trainFrequency
    };

    database.ref().push(newTrain);
  });

  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    var trainName = childSnapshot.val().trainName;
    var trainDestination = childSnapshot.val().trainDestination;
    var firstTrainTime = childSnapshot.val().firstTrainTime;
    var trainFrequency = childSnapshot.val().trainFrequency;

    //First train time is subtracted by a year to make sure train comes before current time the user is setting it to.
    var firstTrainConverted = moment(firstTrainTime, "hh:mm").subtract(
      1,
      "years"
    );

    //The time right now:
    var currentTime = moment();
    // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // //Difference between times:
    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
    // console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % trainFrequency;
    //  console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = trainFrequency - tRemainder;
    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment()
      .add(tMinutesTillTrain, "minutes")
      .format("LT");
    // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    var newRow = $("<tr>");
    nameTd = $("<td>").text(trainName);
    destinationTd = $("<td>").text(trainDestination);
    frequencyTd = $("<td>").text(trainFrequency);
    nextTrainTd = $("<td>").text(nextTrain);
    tMinutesTillTrainTd = $("<td>").text(tMinutesTillTrain);

    newRow
      .append(nameTd)
      .append(destinationTd)
      .append(frequencyTd)
      .append(nextTrainTd)
      .append(tMinutesTillTrainTd);
    $("#train-schedule").append(newRow);
  });
});

//object assignment shorthand
// var newTrain = {
//     trainName,
//     trainDestination,
//     firstTrainTime,
//     trainFrequency,
//   };
// var nextTrain = "months worked";
// var minutesNextTrain = "total billed"
//object destructuring
// var {trainName, trainDestination, firstTrainTime, trainFrequency} = childSnapshot.val()

//   newDiv.append(nameTd);
//   newDiv.append(roleTd);
//   newDiv.append(dateTd);
//   newDiv.append(monthsTd);
//   newDiv.append(rateTd);
//   newDiv.append(billedTd);
