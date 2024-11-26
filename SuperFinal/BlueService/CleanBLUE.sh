#!/bin/bash

echo "Start clean..."
echo "Clean Application data"

docker-compose -f compose.yaml down
rm -r logs

docker-compose -f compose.yaml up -d
echo "Finish clean..."