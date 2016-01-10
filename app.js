var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://postgres:snmc@localhost:5432/alexandria');

var Content = sequelize.define('content', {
    id: {type: Sequelize.UUID, primaryKey: true},
    // The json data type stores an exact copy of the input text, which processing functions must reparse on each execution; while jsonb data is stored in a decomposed binary format that makes it slightly slower to input due to added conversion overhead, but significantly faster to process, since no reparsing is needed. jsonb also supports indexing, which can be a significant advantage.
    // http://www.postgresql.org/docs/current/static/datatype-json.html
    content: Sequelize.JSONB
},{
    indexes: [
        // Create a unique index on id
        {
            unique: true,
            fields: ['id']
        },

        // Creates a gin index on content with the jsonb_path_ops operator
        // The default GIN operator class for jsonb supports queries with top-level key-exists operators ?, ?& and ?| operators and path/value-exists operator @>. The non-default GIN operator class jsonb_path_ops supports indexing the @> operator only.
        {
            fields: ['content'],
            using: 'gin',
            operator: 'jsonb_path_ops'
        }
    ]
});

sequelize.sync().then(function() {
    return Content.create({
        id: 'deadbeef-dead-beef-dead-feebfeebdaed',
        content: {"a":"b"}
    });
}).then(function(data) {
    console.log(data.get({
        plain: true
    }));
});

var express = require('express');
var app = express();

app.route(/^\/content\/(.*)/)
    .get(function (req, res) {
        res.send('Hello World!');
    })
    .post(function (req, res) {
        res.status(409).send('Use PUT not POST');
    })
    .put(function (req, res) {

        // check Content-type: application/json
        res.send('Hello World!');
    });

app.use(function (req, res, next) {
    res.status(404).send('404 - Page not found');
});

// make public folder the root for static assets
app.use(express.static('public'));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
})

