#!/bin/bash

chmod +x ./dist/rpi.js
scp ./dist/rpi.js pi@192.168.11.5:/home/pi/rpi/
ssh pi@192.168.11.5 "sudo systemctl restart rpi"
