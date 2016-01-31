var chai = require('chai')
    , assert = chai.assert
    , expect = chai.expect
    , should = chai.should();


describe ('demo tests', function() {
    var foo = 'bar'
        , beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };
    it('correctly works',  function() {
        assert.typeOf(foo, 'string'); // without optional message
        assert.typeOf(foo, 'string', 'foo is a string'); // with optional message
        assert.equal(foo, 'bar', 'foo equal `bar`');
        assert.lengthOf(foo, 3, 'foo`s value has a length of 3');
        assert.lengthOf(beverages.tea, 3, 'beverages has 3 types of tea');
    });
});
