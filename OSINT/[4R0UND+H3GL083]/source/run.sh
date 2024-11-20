#! /bin/bash

docker compose up -d
sleep 1

rm -rf tmp task

mkdir -p tmp
docker cp globe:/ctf/qr_test.png tmp
docker cp globe:/ctf/task_data.txt tmp
docker cp globe:/ctf/qr_solution.png tmp

mkdir -p task
docker cp globe:/ctf/task.png task
