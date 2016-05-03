$(document).ready(function(){
  $("#try").click(function(){
    accessKey = $("#access").val()
    secretKey = $("#secret").val()
    if (accessKey && secretKey){
      s3 = new AWS.S3({accessKeyId: accessKey, secretAccessKey: secretKey});
      s3.listBuckets(function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
          else     console.log(data);           // successful response
          });
    } else {
      console.log("need creds");
    }
  });
});
