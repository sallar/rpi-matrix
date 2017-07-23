#!/bin/bash

chmod +x ./dist/rpi.js
scp ./dist/rpi.js pi@192.168.11.16:/home/pi/rpi/
ssh pi@192.168.11.16 "sudo systemctl restart rpi"
