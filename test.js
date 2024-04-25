const crypto = require('crypto');

function toFixedHex(number, length) {
    return number.toString(16).toUpperCase().padStart(length, '0').substring(0, length);
}

function getChecksumForSerial(serial) {
    let t = 175;
    let n = 86;
    for (let i = 0; i < serial.length; i++) {
        const code = serial.charCodeAt(i);
        t = (t + code) % 256;
        n = (n + t) % 256;
    }
    return toFixedHex((n << 8) + t, 4);
}

function getSubkeyFromSeed(seed, t, n, i) {
    if (typeof seed === 'string') {
        seed = parseInt(seed, 16);
    }
    n %= 3;
    t %= 25;
    const shifted = seed >> t & 255;
    const complex = seed >> n & i & 255;
    const result = t % 2 === 0 ? shifted ^ complex : shifted ^ (seed >> n | i) & 255;
    return toFixedHex(result, 2);
}

function generateLicenseKey() {
    let seed, subkey, serial, checksum, licenseKey;
    do {
        // Generate random seed
        seed = crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 8);
        // Generate subkey based on seed
        subkey = getSubkeyFromSeed(seed, 36, 1, 137);
        // Create serial number using seed and subkey
        serial = seed + subkey + crypto.randomBytes(2).toString('hex').toUpperCase().slice(0, 4);
        // Calculate checksum
        checksum = getChecksumForSerial(serial);
        // Form the license key
        licenseKey = `${serial.substring(0, 8)}-${serial.substring(8, 12)}-${serial.substring(12, 16)}-${checksum}`;
    } while (licenseKey.replace(/-/g, '').length !== 24);  // Ensure the key is of valid length
    return licenseKey;
}

console.log(generateLicenseKey());
