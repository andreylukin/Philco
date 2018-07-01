const SpotifyWebApi = require('spotify-web-api-node');
const config = require("../config/config");

async function getMyDeviceId() {
    const response = await this.spotifyApi.getMyDevices();
    console.log(response.body.devices);
    const device = response.body.devices.filter( device => device.name === "PHILCO")[0];// use "PHILCO" usually
    return device === undefined ? "Philoco aint here" : device.id;
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
        const deviceId = await getMyDeviceId.bind(this)();
        console.log(deviceId);
        await this.spotifyApi.play({device_id: deviceId, context_uri: context_uri || undefined})
    }

    async stopMusic() {
        const deviceId = await getMyDeviceId.bind(this)();
        await this.spotifyApi.pause({device_id: deviceId})
    }

    async startPlaylist(number) {
        number = number || 0;
        const playlists = await this.spotifyApi.getUserPlaylists();
        const playlistURIs = playlists.body.items.map(item => item.uri);
        this.startMusic(playlistURIs[number])
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
        const isShuffling = this.isShuffle();
        await this.spotifyApi.setShuffle({state: !isShuffling});
    }

    async play() {
        const response = await spotifyApi.spotifyApi.getMyCurrentPlaybackState();
        response.body.is_playing ? this.stopMusic() : this.startMusic();
    }
}


module.exports = SpotifyApi;
