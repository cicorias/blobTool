import nconf from 'nconf';
import assert from 'assert';
import fs from 'fs';
import crypto from 'crypto';
import now from 'performance-now';
import azure from 'azure-storage';
import uuid from 'node-uuid';


describe('Time of Uploads single threaded', function () {
	var start, end, totalTime;
	let configFile = __dirname + '/config.1.json';
	console.log('using file: ' + configFile);

	var blobService;

	nconf.env().file({ file: configFile, search: true });
	
	let containerName = nconf.get("CONTAINER_NAME");
	let accountName = nconf.get("STORAGE_NAME");
	let accountKey = nconf.get("STORAGE_KEY");

	let warmupFile = 'filewarmup.tst';
	let testFile = 'testFile.tst';
	let aMB = 1024 * 1024;
	let numberOfMB = 10;
	let fileSize = numberOfMB * aMB;
		
	before(function (done) {
		this.timeout(10000);
		blobService = azure.createBlobService(accountName, accountKey);
			//.withFilter(new azure.ExponentialRetryPolicyFilter());
		
		generateTempFile(warmupFile, aMB, false);
		generateTempFile(testFile, fileSize, false);
		
		done();
    });

	beforeEach(function (done) {
		start = now();
		done();
	});

	afterEach(function (done) {
		end = now();
		totalTime = end - start;
		var mbs = fileSize / totalTime / 1000;
		
		Math.round
		
		console.log('\t\ttotalTime: ' + totalTime.toFixed(2) + ' MBs: ' + mbs.toFixed(2) );
		done();
	});

	describe('warm up- 1 thread - 1MB', function () {
		it('just take some time....', function (done) {
			this.timeout(300000)
			let blobName = uuid();
			let fileName = warmupFile;
			let ptc = 1;
			callIt(blobService, containerName, blobName, fileName, ptc, done);
		});
	});

	describe( numberOfMB + ' MB upload - 1 thread', function () {
		it('just take some time....', function (done) {
			this.timeout(300000)
			let blobName = uuid();
			let ptc = 1;
			callIt(blobService, containerName, blobName, testFile, ptc, done);
		});
	});

	describe(numberOfMB + ' MB upload - 2 thread', function () {
		it('just take some time....', function (done) {
			this.timeout(300000)
			let blobName = uuid();
			let ptc = 2;
			callIt(blobService, containerName, blobName, testFile, ptc, done);
		});
	});

	describe(numberOfMB + ' MB upload - 3 thread', function () {
		it('just take some time....', function (done) {
			this.timeout(300000)
			let blobName = uuid();
			let ptc = 3;
			callIt(blobService, containerName, blobName, testFile, ptc, done);
		});
	});

	describe(numberOfMB + ' MB upload - 4 thread', function () {
		it('just take some time....', function (done) {
			this.timeout(300000)
			let blobName = uuid();
			let ptc = 4;
			callIt(blobService, containerName, blobName, testFile, ptc, done);
		});
	});


	describe(numberOfMB + ' MB upload - 5 thread', function () {
		it('just take some time....', function (done) {
			this.timeout(300000)
			let blobName = uuid();
			let ptc = 5;
			callIt(blobService, containerName, blobName, testFile, ptc, done);
		});
	});


	describe(numberOfMB + ' MB upload - 6 thread', function () {
		it('just take some time....', function (done) {
			this.timeout(300000)
			let blobName = uuid();
			let ptc = 6;
			callIt(blobService, containerName, blobName, testFile, ptc, done);
		});
	});

	describe(numberOfMB + ' MB upload - 7 thread', function () {
		it('just take some time....', function (done) {
			this.timeout(300000)
			let blobName = uuid();
			let ptc = 7;
			callIt(blobService, containerName, blobName, testFile, ptc, done);
		});
	});

	describe(numberOfMB + ' MB upload - 8 thread', function () {
		it('just take some time....', function (done) {
			this.timeout(300000)
			let blobName = uuid();
			let ptc = 8;
			callIt(blobService, containerName, blobName, testFile, ptc, done);
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

function generateTempFile (fileName, size, hasEmptyBlock) {
  var blockSize = 4 * 1024 * 1024;
  var fileInfo = { name: fileName, contentMD5: '', size: size, content: '' };

  var md5hash = crypto.createHash('md5');
  var offset = 0;
  var file = fs.openSync(fileName, 'w');
  var saveContent= size <= blockSize;

  do {
    var value = crypto.randomBytes(1);
    var zero = hasEmptyBlock ? (parseInt(value[0], 10) >= 64) : false;
    var writeSize = Math.min(blockSize, size);
    var buffer;

    if (zero) {
      buffer = new Buffer(writeSize);
      buffer.fill(0);
    } else {
      buffer = crypto.randomBytes(writeSize);
    }
      
    fs.writeSync(file, buffer, 0, buffer.length, offset);
    size -= buffer.length;
    offset += buffer.length;
    md5hash.update(buffer);

    if (saveContent) {
      fileInfo.content += buffer.toString();
    }
  } while(size > 0);
      
  fileInfo.contentMD5 = md5hash.digest('base64');
};
