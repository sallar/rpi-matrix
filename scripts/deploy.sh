#!/bin/bash

IP_ADDRESS=${RPI_ADDRESS:-192.168.11.5}

chmod +x ./dist/rpi.js
scp ./dist/rpi.js pi@$IP_ADDRESS:/home/pi/rpi/
ssh pi@$IP_ADDRESS "sudo systemctl restart rpi"
