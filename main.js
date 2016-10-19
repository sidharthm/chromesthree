$(document).ready(function(){
 $('form').submit(false); 
  var s3;//available in higher namespace

  /*Handler functions*/
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
          loadStructure(s3);
        }
      });
    } else {
      printMessage("span#credential-message",'Please Provide Credentials',"error");
    }
  });

  /*Utility functions*/
  printMessage = function(element,message,classToAdd){
    msgElement = $(element);
    if (msgElement){
      msgElement.text(message);
      if (classToAdd) msgElement.addClass(classToAdd);
    }
  }

  loadStructure = function(objS3){
    objS3.listBuckets(function(err,data){
      if (err) printMessage("span#main-message",err,"error")
      else{
        myData = data; //DEBUG
        console.log(data);
        var tableBody = $("#files > tbody");
        tableBody.html();
        data.Buckets.forEach(loadTable = function(x){
          addedRow = $('<tr/>');
          addedCol = $('<td/>');
          addedCol.text(x.Name);
          addedCol.attr('class','bucket');
          addedCol.attr('id',x.Name);
          addedRow.append(addedCol);
          tableBody.append(addedRow);
        });
        $(".bucket").click(expandBucket);
      }
    });
  }

  expandBucket = function(){
    if (s3){
      bucketId = $(this).attr("id");
      s3.listObjects({Bucket: bucketId}, getObjects = function(err,data){
        if (err){
          console.log(err);
        } else {
          console.log(data);
        }
      });
    } else {
      console.log("bucket pressed, no s3");
      //should not happen
    } 
  }
});
