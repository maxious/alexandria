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

module.exports = {Content: Content};

// if running directly, not as included module
// https://nodejs.org/docs/latest/api/modules.html#modules_accessing_the_main_module
if (require.main === module) {
    // if run directly, sync model to db structure by DELETING ALL TABLES
    // "If force is true, each DAO will do DROP TABLE IF EXISTS ..., before it tries to create its own table"
    sequelize.sync({force: true, logging: console.log}).then(function () {
        console.log("DB: Tables created");
    });
}