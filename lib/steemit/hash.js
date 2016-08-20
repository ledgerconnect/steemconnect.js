var crypto = require('crypto')

function sha1(data, encoding) {
    return crypto.createHash('sha1').update(data).digest(encoding)
}

function sha256(data, encoding) {
    return crypto.createHash('sha256').update(data).digest(encoding)
}

function HmacSHA256(buffer, secret) {
    return crypto.createHmac('sha256', secret).update(buffer).digest()
}

module.exports = {
    sha256: sha256,
    HmacSHA256: HmacSHA256
}
