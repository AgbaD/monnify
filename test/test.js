const Monnify = require('monnify-nodejs')

const secretKey = "UW3CVMYUZD2AUPJBN7QEFFTX23ZET49N"
const apiKey = "MK_TEST_329GSK82VC"
const baseUrl = 'sandbox.monnify.com'


async function testMonnify() {
    let m = new Monnify(secretKey, apiKey, baseUrl)
    console.log(m.accessToken)
}

testMonnify()