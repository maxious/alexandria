Alexandria - Basic Content Store API in node.js on postgres JSONB

http://docs.sequelizejs.com/en/latest/api/datatypes/?highlight=json#jsonb



Why a content store? https://gdstechnology.blog.gov.uk/2014/08/27/taking-another-look-at-gov-uks-disaster-recovery/

Port 3068 like https://github.com/alphagov/content-store https://github.com/alphagov/govuk-dummy_content_store

=== Features ===
[ ] Put
[ ] Get
[ ] Static Content Generation
[ ] Routing and delivery of static content
[ ] Indexing of static content in ElasticSearch
[ ] Publish Intents https://github.com/alphagov/content-store/blob/master/doc/publish_intents.md

=== Roadmap ===
Content generation/indexing should be asyncronous, maybe seperate: throw in some https://github.com/JustinTulloss/zeromq.node for asynchronous queues as required
Routing should be seperate: https://github.com/alphagov/router https://github.com/alphagov/router-api