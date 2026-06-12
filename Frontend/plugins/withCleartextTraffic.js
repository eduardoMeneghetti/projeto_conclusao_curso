const { withAndroidManifest, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

function withCleartextTraffic(config) {
    config = withAndroidManifest(config, (config) => {
        config.modResults.manifest.application[0].$['android:networkSecurityConfig'] = '@xml/network_security_config';
        return config;
    });
    config = withDangerousMod(config, ['android', async (config) => {
        const dir = path.join(config.modRequest.platformProjectRoot, 'app/src/main/res/xml');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(
            path.join(dir, 'network_security_config.xml'),
            `<?xml version="1.0" encoding="utf-8"?>\n<network-security-config>\n    <base-config cleartextTrafficPermitted="true" />\n</network-security-config>`
        );
        return config;
    }]);
    return config;
}

module.exports = withCleartextTraffic;