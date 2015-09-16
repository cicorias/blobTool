import nconf from 'nconf';
import assert from 'assert';
import now from 'performance-now';
import azure from 'azure-storage';
import uuid from 'node-uuid';

import * as uploader from '../uploader';

describe('Time of Uploads single threaded', function () {
	var start, end, totalTime;
	var configFile = __dirname + '/config.1.json';
	console.log('using file: ' + configFile);

	var blobService;

	nconf.env()
		.file({ file: configFile, search: true });
	var containerName = nconf.get("CONTAINER_NAME");
	var accountName = nconf.get("STORAGE_NAME");
	var accountKey = nconf.get("STORAGE_KEY");

			var fileName = 'file100m.tst';
	before(function (done) {

		blobService = azure.createBlobService(accountName, accountKey)
			.withFilter(new azure.ExponentialRetryPolicyFilter());
		done();
    });

	beforeEach(function (done) {
		start = now();
		done();
	});

	afterEach(function (done) {
		end = now();
		totalTime = end - start;
		console.warn(totalTime);
		done();
	});

	describe('warm up- 1 thread', function () {
		it('just take some time....', function (done) {
			this.timeout(300000)
			var blobName = uuid();
			var fileName = 'file1m.tst';
			var ptc = 1;
			callIt(blobService, containerName, blobName, fileName, ptc, done);
		});
	});

	describe('100 MB upload - 1 thread', function () {
		it('just take some time....', function (done) {
			this.timeout(300000)
			var blobName = uuid();
			var ptc = 1;
			callIt(blobService, containerName, blobName, fileName, ptc, done);
		});
	});

	describe('100 MB upload - 2 thread', function () {
		it('just take some time....', function (done) {
			this.timeout(300000)
			var blobName = uuid();
			var ptc = 2;
			callIt(blobService, containerName, blobName, fileName, ptc, done);
		});
	});
	
	describe('100 MB upload - 3 thread', function () {
		it('just take some time....', function (done) {
			this.timeout(300000)
			var blobName = uuid();
			var ptc = 3;
			callIt(blobService, containerName, blobName, fileName, ptc, done);
		});
	});
	
	describe('10 MB upload - 4 thread', function () {
		it('just take some time....', function (done) {
			this.timeout(300000)
			var blobName = uuid();
			var ptc = 4;
			callIt(blobService, containerName, blobName, fileName, ptc, done);
		});
	});


	describe('10 MB upload - 5 thread', function () {
		it('just take some time....', function (done) {
			this.timeout(300000)
			var blobName = uuid();
			var ptc = 5;
			callIt(blobService, containerName, blobName, fileName, ptc, done);
		});
	});
	
	
	describe('100 MB upload - 6 thread', function () {
		it('just take some time....', function (done) {
			this.timeout(300000)
			var blobName = uuid();
			var ptc = 6;
			callIt(blobService, containerName, blobName, fileName, ptc, done);
		});
	});
	
	describe('100 MB upload - 7 thread', function () {
		it('just take some time....', function (done) {
			this.timeout(300000)
			var blobName = uuid();
			var ptc = 7;
			callIt(blobService, containerName, blobName, fileName, ptc, done);
		});
	});
	
	describe('100 MB upload - 8 thread', function () {
		it('just take some time....', function (done) {
			this.timeout(300000)
			var blobName = uuid();
			var ptc = 8;
			callIt(blobService, containerName, blobName, fileName, ptc, done);
		});
	});
});


function callIt(blobService, containerName, blobName, fileName, ptc, done) {
	var uploadOptions = { 'parallelOperationThreadCount': ptc };
	blobService.createBlockBlobFromLocalFile(containerName, blobName, fileName, uploadOptions, function (error2) {
		assert.equal(error2, null);
		blobService.removeAllListeners('sendingRequestEvent');
		done();
	});
}