const SpotifyWebApi = require('spotify-web-api-node');
const config = require("../config/config");

async function getMyDeviceId() {
    const response = await this.spotifyApi.getMyDevices();
    return response.body.devices.filter( device => device.name === "PHILCO")[0].id;
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

    async startMusic() {
        const deviceId = await getMyDeviceId.bind(this)();
        const response = await this.spotifyApi.play({device_id: deviceId})
        return response;
    }

    async stopMusic() {
        const deviceId = await getMyDeviceId.bind(this)();
        const response = await this.spotifyApi.pause({device_id: deviceId})
        return response;
    }

}

const spotifyApi = new SpotifyApi();

// try {
//     (async () => {
//       await spotifyApi.authenticate();
//       const response = await spotifyApi.stopMusic();
//       console.log(response);
//   })().then(console.log)
//       .catch(console.log);
// } catch (e) {
//   console.log(e.toString());
// }
//

module.exports = SpotifyApi;
