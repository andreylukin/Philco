/* eslint-disable node/no-missing-require */
'use strict';

var stationCount = 5;

const SerialPort = require('serialport');
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
  delimiter: '\r\n'
});

const port = new SerialPort('/dev/tty.usbserial-AH02LQCH', {
  baudRate: 115200
});

port.pipe(parser);

port.on('open', () => console.log('opened connection to serial device'));

var encoderPrev = 0;

parser.on('data', function(data) {
  var reading = new Object();
  var fields = data.split(",");
  reading.encoder = parseInt(fields[0],10);
  reading.playing = parseInt(fields[1],10) == 1 ? true : false;
  reading.shuffle = parseInt(fields[2],10) == 1 ? true : false;
  reading.station = Math.round(parseInt(fields[3],10)/1023*stationCount+.5);

  ensureState(reading.playing, checkIfPlaying, setPlaying);
  ensureState(reading.shuffle, checkIfShuffle, setShuffle);
  ensureState(reading.station, checkStation,   setStation);

  if(reading.encoder > encoderPrev) {
    skipForward();
  } else if(reading.encoder < encoderPrev) {
    skipBack();
  }

  if(reading.encoder != encoderPrev) {
    encoderPrev = reading.encoder;
  }

});

function ensureState(desiredCondition,getCurrentCondition,commandCondition) {
  if(desiredCondition != getCurrentCondition()) {
    commandCondition(desiredCondition);
    console.log("Set to "+desiredCondition);
    handler(desiredCondition);
  }
}

var isPlaying = false; // temporary
function checkIfPlaying() {
  return isPlaying;
}

function setPlaying(state) {
  isPlaying = state;
}

function handleRadioOnOff(state) {
  if(state) {
    console.log("Radio is turning on");
  } else {
    console.log("Radio is turning off");
  }
}

var isShuffle = false; // temporary
function checkIfShuffle() {
  return isShuffle;
}

function setShuffle(state) {
  isShuffle = state;
}

var station = 1; // temporary
function checkStation() {
  return station;
}

function setStation(state) {
  station = state;
}

function skipForward() {
  console.log("skip forward");
}

function skipBack() {
  console.log("skip back");
}
