const axios = require('axios').default;

const secretKey = ""
const apiKey = ""
const baseUrl = "https://sandbox.monnify.com"
const contractCode = ""

async function runWallet() {
    const key = Buffer.from(apiKey + ':' + secretKey).toString('base64')
    let resp = await axios({
        headers: {
            'Authorization': `Basic ${key}`
        },
        url: baseUrl + '/api/v1/auth/login',
        method: 'post'
    }).catch(function (error) {
        console.log(error.response.data);
        return error.response
    });

    console.log(resp.data)
    const token = resp.data.responseBody.accessToken

    resp = await axios({
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': "application/json"
        },
        url: baseUrl + '/api/v2/bank-transfer/reserved-accounts',
        method: 'post',
        data: {
            "accountReference": "randomString(7)",
            "accountName": "Test",
            "currencyCode": "NGN",
            "contractCode": contractCode,
            "customerEmail": "email@gmail.com",
            "customerName": "John Doe",
            "getAllAvailableBanks": true
        }
    }).catch(function (error) {
        console.log(error.response.data);
        return error.response
    });
    console.log(resp.data)

}


runWallet()