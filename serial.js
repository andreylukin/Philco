const SpotifyApi = require("./src/models/SpotifyAPI");


const spotifyApi = new SpotifyApi();
let stationCount = 2;
try {
    (async () => {
      await spotifyApi.authenticate();
      stationCount = await spotifyApi.getNumberofPlaylist();
      stationCount = 2;
    })().then(console.log)
        .catch(console.log);
  } catch (e) {
    console.log(e.toString());
}
console.log(stationCount);
const SerialPort = require('serialport');
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
  delimiter: '\r\n'
});

const port = new SerialPort('/dev/ttyUSB0', {
  baudRate: 115200
});

port.pipe(parser);

port.on('open', () => console.log('opened connection to serial device'));

var encoderPrev = 0;
var shufflePrev = -1;
var stationPrev = -1;
var playingPrev = -1;

parser.on('data', function(data) {
  var reading = new Object();
  var fields = data.split(",");
  reading.encoder = parseInt(fields[0],10);
  reading.playing = parseInt(fields[1],10) == 1 ? true : false;
  reading.shuffle = parseInt(fields[2],10) == 1 ? true : false;
  reading.station = Math.round(parseInt(fields[3],10)/1023*stationCount+.5);

  if(reading.encoder > encoderPrev) {
    spotifyApi.next();
    encoderPrev = reading.encoder;
  } else if(reading.encoder < encoderPrev) {
    spotifyApi.previous();
    encoderPrev = reading.encoder;
  }

  if(reading.shuffle != shufflePrev) {
    spotifyApi.shuffle();
    shufflePrev = reading.shuffle;
  }


  if(reading.station != stationPrev) {
    // spotifyApi.startPlaylist(reading.station);
    stationPrev = reading.station;
    console.log("Now playing from station "+reading.station);
  }

  if(reading.playing != playingPrev) {
    setPlaying(reading.playing);
    playingPrev = reading.playing;
  }

});

function ensureState(desiredCondition,getCurrentCondition,commandCondition) {
  if(desiredCondition != getCurrentCondition()) {
    commandCondition(desiredCondition);
    console.log("Set to "+desiredCondition);
  }
}

function setPlaying(state) {
  if(state) {
    spotifyApi.startMusic().catch(error => console.log(error));
  } else {
    spotifyApi.stopMusic().catch(error => console.log(error));
  }
}
