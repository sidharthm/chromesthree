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
          printMessage("div#credential-message",err,"alert-error");
        }
        else{
          printMessage("div#credential-message",'Authentication Success',"alert-success"); // successful response
          loadStructure(s3);
        }
      });
    } else {
      printMessage("div#credential-message",'Please Provide Credentials',"alert-info");
    }
  });

  /*Utility functions*/
  printMessage = function(element,message,classToAdd){
    msgElement = $(element);
    if (msgElement){
      msgElement.text(message);
      if (classToAdd) {
        // not a great idea, removes all classes
        msgElement.removeClass();
        msgElement.addClass(classToAdd);
      }
    }
  }

  loadStructure = function(objS3){
    objS3.listBuckets(function(err,data){
      if (err) printMessage("div#credential-message",err,"alert-error")
      else{
        myData = data; //DEBUG
        console.log(data);
        var tableBody = $("#files > tbody");
        tableBody.html();
        data.Buckets.forEach(loadTable = function(x){
          addedRow = $('<tr/>');
          [x.Name, x.CreationDate].forEach(function(val){
            addColumnToRow(addedRow, val);
          });
          addedRow.attr('class','bucket');
          addedRow.attr('id',x.Name);
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

//Utility functions

addColumnToRow = function(row, value){
  newCol = $('<td/>');
  newCol.text(value);
  row.append(newCol);
}
