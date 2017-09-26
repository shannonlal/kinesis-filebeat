var assert = require('assert');

//var proxyrequire = require('proxyquire');
var LogQueue = require('../src/monitor/log-queue');
/**
 * Unit Test to confirm that log-queue spec is operating correctly
 * 
 */
describe('should tests log-queue to ensure proper operation', function () {
  describe('verify that the log-queue exists', function () {
    it('Should verify that the module exists', function (){
      assert.notEqual(LogQueue, undefined);
    });

    it('Should add a message to the queue', function ( done ){
        assert.notEqual(LogQueue, undefined);

        var logQueue = new LogQueue();

        assert.notEqual(logQueue, undefined);

        logQueue.push('test messge');

        console.log( 'queue', logQueue);
        assert.ok( !logQueue.isEmpty());
        let rst = logQueue.pop();

        assert.equal( rst, 'test messge');

        done();
      });

  });
});
