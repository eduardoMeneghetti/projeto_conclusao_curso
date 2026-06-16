const appJson = require('./app.json');

module.exports = ({ config }) => ({
    ...config,
    android: {
        ...config.android,
        config: {
            googleMaps: {
                apiKey: process.env.GOOGLE_MAPS_API_KEY
            }
        }
    }
});
