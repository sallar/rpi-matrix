# RaspberryPi LED Matrix Clock & Apps

This repo includes code for both RaspberryPi and it's web simulator. It's possible to design the code online before uploading to the Rpi.

:warning: This project is one of my hobbies and it's not meant to be taken seriously or be used in production. It comes as is without any warranties. However I would appreciate your input and as always, PRs are very welcome.

![](rpi.gif)

## Requirements

* NodeJS
* RasperryPi (Gen 1+, Zero, Zero W)
* Wifi Adapter for Rpi (if not present on RaspberryPi itself or you are not using LAN)
* [Adafruit 32x16 RGB LED Matrix](https://www.adafruit.com/product/420) (or alike)
* Jumper cables
* [Push Switch](https://www.amazon.de/Gazechimp-Button-Momentary-Tactile-Touch-Push/dp/B01N6HE3TB/ref=sr_1_1?ie=UTF8&qid=1515073143&sr=8-1&keywords=push+switch) for changing modes

## Wiring Up

* [Connect the Push Switch to the RaspberryPi](http://razzpisampler.oreilly.com/ch07.html)
* [Connect the LED Matrix to the RaspberryPi](https://github.com/hzeller/rpi-rgb-led-matrix/blob/master/wiring.md)
* [Install latest NodeJS version on your RaspberryPi](https://github.com/sdesalas/node-pi-zero)
* Install the [Unix Service](scripts/rpi.service) on your RaspberryPi [using this guide](https://www.digitalocean.com/community/tutorials/how-to-use-systemctl-to-manage-systemd-services-and-units)

## Browser Simulation

To start the browser simulation of the physical device:

```sh
$ npm install
$ npm run dev
```

## Deploy to the RaspberryPi

```sh
RPI_ADDRESS=192.168.11.5 npm run deploy
```

This command will build the project for use in Rpi device and deploys it to the device over the local network.

## Creating Views

The app cycles through "views". Each view is a program that shows something on the LED. For example `clock` and `bus` are views. The user can toggle through views using the physical switch button. For creating a view, create a file in `views` folder. Each view should export these functions and properties:

* `setup()` a function that returns a `Promise`. This function gets called once when the program starts.
* `teardown()` a function that returns a `Promise`. This function gets called once when the program ends.
* `loop()` Loop function gets called repeatedly at a rate that you specify with `fps`.
* `fps` a properties that defines the rate at which the program calls `loop` function. Number of frames per second.

## Related

+ [matrix-display-store](https://github.com/sallar/matrix-display-store)
+ [led-matrix](https://github.com/sallar/led-matrix)
+ [led-matrix-simulator](https://github.com/sallar/led-matrix-simulator)

## License

This software is released under the [MIT License](LICENSE)
