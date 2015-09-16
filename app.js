console.log('starting...');

var nconf = require('nconf');
var azure = require('azure-storage');
var uuid = require('node-uuid');


nconf.env()
	.file({ file: 'config.json', search: true });

var containerName = nconf.get("CONTAINER_NAME");
var accountName = nconf.get("STORAGE_NAME");
var accountKey = nconf.get("STORAGE_KEY");

var retryOperations = new azure.ExponentialRetryPolicyFilter();
var uploadOptions = { 'parallelOperationThreadCount': 5};
var blobSvc = azure.createBlobService(accountName, accountKey).withFilter(retryOperations);

var container = blobSvc.createContainerIfNotExists(containerName, function (error) {
	if (!error) {
		console.log('doing stuff...')

		blobSvc.createBlockBlobFromLocalFile(containerName, uuid(), 'test.txt', uploadOptions, function (error, result, response) {
			if (!error) {
				console.log('file uploaded...');
			}
			else 
				throw error;
		});

	}
	else
		throw error;
});






