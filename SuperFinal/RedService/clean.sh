#!/bin/bash

pip3 install -r requirements.txt

if [ -n "$(ls -A ./db 2>/dev/null)" ]
then
  rm /home/scx/redservice/db/data.db
  $(python3 main.py &)
else
  echo "file data.db not exist, starting python service..."
  $(python3 main.py &)
fi

