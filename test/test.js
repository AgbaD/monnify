const Monnify = require('monnify-nodejs')

const secretKey = ""
const apiKey = ""
const baseUrl = 'sandbox.monnify.com'


async function testMonnify() {
    let m = new Monnify(secretKey, apiKey, baseUrl)
    console.log(m.accessToken)
}

testMonnify()