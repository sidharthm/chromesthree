$(document).ready(function(){
  $('form').submit(false); 
  var s3;//available in higher namespace
  var currentPath = '';
  var localS3Map = {};
  var customDisplayDict = {
    '': {
      dataKey: 'Buckets',
      headers: ["Bucket","Created At"],
      dataFields: ["Name","CreationDate"]
    }
  };
  var defaultDisplayDict = {
    dataKey: 'Contents',
    headers: ["Name","Size","Storage Type","Modified At"],
    dataFields: ["Key","Size","StorageClass","LastModified"]
  }


  loadStructure = function(objS3, currPath, localData){
      var data = localData[currPath];
      var displayDict = (customDisplayDict[currPath]) ? customDisplayDict[currPath] : defaultDisplayDict;
      var tableHeaders = $('#files > thead');
      tableHeaders.html('');
      var headerRow = $('<tr/>');
      displayDict.headers.forEach(loadTableHeaders = function(header){
        addedHeader = $('<th/>');
        addedHeader.text(header);
        headerRow.append(addedHeader);
      });
      tableHeaders.append(headerRow);
      var tableBody = $("#files > tbody");
      tableBody.html('');
      data[displayDict.dataKey].forEach(loadTable = function(x){
        addedRow = $('<tr/>');
        displayDict.dataFields.forEach(function(key){
          addColumnToRow(addedRow, x[key]);
        });
        addedRow.attr('class','bucket');
        addedRow.attr('id',x.Name);
        tableBody.append(addedRow);
      });
      $(".bucket").click(expandBucket);
      $("#path-display").text(currentPath);
  }

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
          localS3Map[currentPath] = data;
          loadStructure(s3, currentPath, localS3Map);
        }
      });
    } else {
      printMessage("div#credential-message",'Please Provide Credentials',"alert-info");
    }
  });

  expandBucket = function(){
    if (s3){
      currentPath = currentPath + $(this).attr("id");
      pathDetails = extractBucketAndPrefixFromPath(currentPath);
      s3.listObjects({Bucket: pathDetails.bucket, Prefix: pathDetails.prefix}, getObjects = function(err,data){
        if (err){
          console.log(err);
        } else {
          localS3Map[currentPath] = data;
          loadStructure(s3, currentPath, localS3Map);
        }
      });
    } else {
      console.log("bucket pressed, no s3");
      //should not happen
    } 
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

addColumnToRow = function(row, value){
  newCol = $('<td/>');
  newCol.text(value);
  row.append(newCol);
}

extractBucketAndPrefixFromPath = function(path){
  var splitPath = path.split('/');
  var bucket = splitPath.shift();
  var prefix = splitPath.join('/');
  console.log('bucket', bucket);
  console.log('prefix?', prefix);
  return {bucket: bucket, prefix: prefix};
}
