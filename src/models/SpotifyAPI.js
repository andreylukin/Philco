const SpotifyWebApi = require('spotify-web-api-node');
const config = require("../config/config");

async function getMyDeviceId() {
    const response = await this.spotifyApi.getMyDevices();
    console.log(response.body.devices);
    const device = response.body.devices.filter( device => device.name === "PHILCO")[0];// use "PHILCO" usually
    return device === undefined ? "Philoco aint here" : device.id;
}

async function isShuffle() {
    const response = await spotifyApi.spotifyApi.getMyCurrentPlaybackState();
    return response.body.shuffle_state;
}

class SpotifyApi {
    constructor() {
        this.spotifyApi = new SpotifyWebApi({
            clientId : config.username,
            clientSecret : config.password
        });
    }

    async authenticate() {
        this.spotifyApi.setRefreshToken(config.refreshToken);
        const response = await this.spotifyApi.refreshAccessToken();
        this.spotifyApi.setAccessToken(response.body['access_token']);
    }

    async startMusic(context_uri) {
        const deviceIds = await getMyDeviceId.bind(this)();
        console.log(deviceIds);
        await this.spotifyApi.transferMyPlayback({deviceIds})
        await this.spotifyApi.play({device_id: deviceIds, context_uri: context_uri || undefined})
    }

    async stopMusic() {
        const deviceId = await getMyDeviceId.bind(this)();
        await this.spotifyApi.pause({device_id: deviceId})
    }

    async startPlaylist(number) {
        number = number || 0;
        const playlists = await this.spotifyApi.getUserPlaylists();
        const playlistURIs = playlists.body.items;
        this.startMusic(playlistURIs[number].uri);
        console.log(playlistURIs[number].name);
    }

    async getNumberofPlaylist() {
        const playlists = await this.spotifyApi.getUserPlaylists();
        const playlistURIs = playlists.body.items.map(item => item.uri);
        return playlistURIs.length;
    }

    async next() {
        await this.spotifyApi.skipToNext();
    }
    async previous() {
        await this.spotifyApi.skipToPrevious();
    }

    async shuffle() {
        const isShuffling = await isShuffle.bind(this)();
        await this.spotifyApi.setShuffle({state: (!isShuffling).toString()});
        console.log(`Now shuffling is ${!isShuffling}`);
    }

}


module.exports = SpotifyApi;


const spotifyApi = new SpotifyApi();
try {
    (async () => {
      await spotifyApi.authenticate();
      stationCount = await spotifyApi.shuffle();
    })().then(console.log)
        .catch(console.log);
  } catch (e) {
    console.log(e.toString());
}