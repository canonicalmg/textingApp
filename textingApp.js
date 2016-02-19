Contacts = new Mongo.Collection("contacts");
Messages = new Mongo.Collection("messages");

if (Meteor.isCordova) {
  var app = {
    sendSms: function() {
      var number = document.getElementById('numberTxt').value;
      var message = document.getElementById('messageTxt').value;
      alert(number);
      alert(message);

      //CONFIGURATION
      var options = {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
          //intent: 'INTENT'  // send SMS with the native android SMS messaging
          intent: '' // send SMS without open any other app
        }
      };

      var success = function () { alert('Message sent successfully'); };
      var error = function (e) { alert('Message Failed:' + e); };
      sms.send(number, message, options, success, error);
    }
  };}

if (Meteor.isClient) {
  // counter starts at 0

  Tracker.autorun(function () {
    /* In order to perform query from server, must wait until db has been connected. Tracker.autorun waits for that to happen */

    var contentItem = Contacts.find().fetch(); //.find for query; .fetch to get query as array
    $("#devAdd").click(function () { //User is changing content

    });
    if (contentItem.length <= 0) {
      Contacts.insert(({
        contactName: "Marcus",
        contactNumber: "2098140683"
      }));
      Contacts.insert(({
        contactName: "User1",
        contactNumber: "1234567890"
      }));
      Contacts.insert(({
        contactName: "User2",
        contactNumber: "0987654321"
      }));
      Messages.insert(({
        contactNumberTo: "2098140683",
        contactNumberFrom: "0987654321",
        messageContent: "Hey what's up",
        messageSentDate: "2/13/2016"
      }));
      Messages.insert(({
        contactNumberTo: "0987654321",
        contactNumberFrom: "2098140683",
        messageContent: "Just testing this app",
        messageSentDate: "2/13/2016"
      }));
      Messages.insert(({
        contactNumberTo: "2098140683",
        contactNumberFrom: "0987654321",
        messageContent: "Neato :^)",
        messageSentDate: "2/13/2016"
      }));
      }
    else {
      for (var i = 0; i < contentItem.length; i++) { //making buttons for each content object. Used for dev until grid is built
        if (!$("#" + contentItem[i].contactName).length) {
          $("#contacts").append("<button class='contentButton' id='" + contentItem[i].contactName + "' value='" + contentItem[i].contactNumber + "' type='button'>" + contentItem[i].contactName + "</button><br>");
        }
      }
    }
//asd
    $(".contentButton").click(function () { //User is changing content
      var contentNumber = $(this).attr("value");
      console.log(contentNumber);
      var thisContact = Contacts.findOne({contactNumber: contentNumber}); //redundant query at the moment, but plan on using a query later to restrict data to only be what is needed
      console.log(thisContact);
      $("#contactName").html("<h1>" + thisContact.contactName + " - " + thisContact.contactNumber + "</h1>");
      var receivedMessages = Messages.find({contactNumberFrom: thisContact.contactNumber}).fetch();
      var sentMessages = Messages.find({contactNumberTo: thisContact.contactNumber}).fetch();
      var messages = [];
      for(var i=0; i < receivedMessages.length;i++){
        var contactName = Contacts.findOne({contactNumber: receivedMessages[i].contactNumberFrom});
        receivedMessages[i].name = contactName.contactName;
        messages.push(receivedMessages[i]);
      }
      for(var i=0; i < sentMessages.length;i++){
        var contactName = Contacts.findOne({contactNumber: sentMessages[i].contactNumberTo});
        sentMessages[i].name = contactName.contactName;
        messages.push(sentMessages[i]);
      }
      $("#contactTexts").html();
      for(var i=0; i < messages.length; i++) {
        if (!$("#" + messages[i]._id).length) {
          var messageTemplate = "<div id='" + messages[i]._id + "' class='textTemplate'>"
              + "<div class='textTemplateName'>" + messages[i].name + "</div><br>"
              + "<div class='textTemplateContent'>" + messages[i].messageContent + "</div><br>"
              + "<div class='textTemplateDate'>" + messages[i].messageSentDate + "</div>"
              + "</div>";
          $("#contactTexts").append(messageTemplate);
        }
      }

      console.log(receivedMessages);
    });

    /*$("#addNewContent").off('click').on('click', function (e) { //dev purposes. Messy way to allow us to add content easily
      e.preventDefault(); //prevents button from being clicked multiple times
      if ($("#addNewContent").text() == "Add New Content") {
        $("#addNewContent").text("Save");
        $("#panRight").append("<div style='border:2px solid black' id='addNewTopic'>"
            + "<form id='usrform'>"
            + "<a style='color:white'>Name:</a> <input type='text' style='width:100%;' id='tName'> <br>"
            + "<a style='color:white'>Content:</a> <input type='text' style='width:100%;' id='tContent'> <br>"
            + "<a style='color:white'>URL:</a> <input type='text' style='width:100%;' id='tURL'>"
            + "</form></div>");

      }
      else if ($("#addNewContent").text() == "Save") {
        $("#addNewContent").text("Add New Content");
        var tName = $('#tName').val();
        var tContent = $('#tContent').val();
        var tURL = $('#tURL').val();
        if ((tName.length > 0) && (tContent.length > 0)) {
          Contents.insert(({topicName: tName, topicContent: tContent, topicVideo: tURL}));
        }
        $("#addNewTopic").remove()
      }
      //document.getElementById("saveAddNewTopic").addEventListener("click", saveNewTopic);
    });*/


  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
