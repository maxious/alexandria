#!/usr/bin/env bash
curl http://localhost:3068/content/path-on-gov-uk -X PUT \
    -H 'Content-type: application/json' \
    -d @example-input.json

curl http://localhost:3068/content/path-on-gov-uk