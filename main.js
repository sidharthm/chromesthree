$(document).ready(function(){
  var s3;//available in higher namespace

  $("#try").click(function(){
    accessKey = $("#access").val()
    secretKey = $("#secret").val()
    if (accessKey && secretKey){
      s3 = new AWS.S3({accessKeyId: accessKey, secretAccessKey: secretKey});
      s3.listBuckets(function(err, data) {
        if (err){
          console.log(err, err.stack); // an error occurred
          printMessage("span#credential-message",err,"error");
        }
        else{
          printMessage("span#credential-message",'Authentication Success',"success"); // successful response
        }
      });
    } else {
      printMessage("span#credential-message",'Please Provide Credentials',"error");
    }
  });

  printMessage = function(element,message,classToAdd){
    msgElement = $(element);
    if (msgElement){
      msgElement.text(message);
      if (classToAdd) msgElement.addClass(classToAdd);
    }
  }
});
