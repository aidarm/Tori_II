exports.blobs = function (request, response) {

   4:  

   5:     var accessKey = '[accountKey]';

   6:     var storageAccount = '[accountName]';

   7:     var container = 'nodejs';

   8:  

   9:     var blobService = azure.createBlobService(storageAccount, accessKey);

  10:     //render blobs with blobs.jade view

  11:     blobService.listBlobs(container, function (error, blobs) {

  12:         response.render('blobs', {

  13:             error: error,

  14:             container: container,

  15:             blobs: blobs

  16:         });

  17:     });

  18: }