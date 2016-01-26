var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://postgres:snmc@localhost:5432/alexandria');

var Content = sequelize.define('content', {
    id: {type: Sequelize.UUID, primaryKey: true, allowNull: false, validate: {isUUID: 4}},
    path: {type: Sequelize.STRING, unique: true, allowNull: false},
    // The json data type stores an exact copy of the input text, which processing functions must reparse on each execution; while jsonb data is stored in a decomposed binary format that makes it slightly slower to input due to added conversion overhead, but significantly faster to process, since no reparsing is needed. jsonb also supports indexing, which can be a significant advantage.
    // http://www.postgresql.org/docs/current/static/datatype-json.html
    content: {type: Sequelize.JSONB, allowNull: false},
}, {
    indexes: [
        // Creates a gin index on content with the jsonb_path_ops operator
        // The default GIN operator class for jsonb supports queries with top-level key-exists operators ?, ?& and ?| operators and path/value-exists operator @>. The non-default GIN operator class jsonb_path_ops supports indexing the @> operator only.
        {
            fields: ['content'],
            using: 'gin',
            operator: 'jsonb_path_ops'
        }
    ]
});

sequelize.sync({force: true});

var express = require('express');
var bodyParser = require('body-parser')
var app = express();
// If you are using valid JSON and are POSTing it with Content-Type: application/json, then you can use the bodyParser middleware to parse the request body and place the result in request.body of your route.
app.use(bodyParser.json())

app.route(/^\/content\/(.*)/)
    .get(function (req, res) {
        var path = req.url.replace("/content", "");
        Content.findOne({where: {path: path}}).then(function (data) {
            if (data !== null) {
                return res.send(data.get({
                    plain: true
                }));
            } else {
                return res.sendStatus(404);
            }
        });
    })
    .post(function (req, res) {
        return res.status(405).send('Use PUT not POST');
    })
    .put(function (req, res) {
        /*if (!req.headers['content-type'].contains('application/json')) {
         res.status(406).send('Use content-type: application/json; charset=utf-8');
         } else {*/
        if (!req.body) return res.sendStatus(400)
        var content = req.body;
        var id = content.content_id;
        var path = req.url.replace("/content", "");

        Content.findByPrimary(id).then(function (old_content) {
            if (old_content !== null) {
                old_content.update({
                    id: id,
                    path: path,
                    content: content
                }).then(function (data) {
                    return res.send(data.get({
                        plain: true
                    }));
                });
            } else {
                Content.create({
                    id: id,
                    path: path,
                    content: content
                }).then(function (data) {
                    return res.status(201).send(data.get({
                        plain: true
                    }));
                });
            }
        });

    });

app.use(function (req, res, next) {
    return res.status(404).send('404 - Page not found');
});

// make public folder the root for static assets
app.use(express.static('public'));

// Port 3068 like https://github.com/alphagov/content-store https://github.com/alphagov/govuk-dummy_content_store
app.listen(3068, function () {
    console.log('Example app listening on port 3068!');
})

