const https = require('https');
const fs = require('fs');

const secretKey = process.env.MONNIFY_SECRET_KEY || 'UW3CVMYUZD2AUPJBN7QEFFTX23ZET49N'
const apiKey = process.env.MONNIFY_API_KEY || 'MK_TEST_329GSK82VC'
const sourceAccountNumber = process.env.SOURCE_ACCOUNT_NUMBER || 4637221455
const baseUrl = 'sandbox.monnify.com'
const accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsibW9ubmlmeS12YWx1ZS1hZGRlZC1zZXJ2aWNlIiwibW9ubmlmeS1wYXltZW50LWVuZ2luZSIsIm1vbm5pZnktZGlzYnVyc2VtZW50LXNlcnZpY2UiXSwic2NvcGUiOlsicHJvZmlsZSJdLCJleHAiOjE2NTA5NzY0NjksImF1dGhvcml0aWVzIjpbIk1QRV9NQU5BR0VfTElNSVRfUFJPRklMRSIsIk1QRV9VUERBVEVfUkVTRVJWRURfQUNDT1VOVCIsIk1QRV9JTklUSUFMSVpFX1BBWU1FTlQiLCJNUEVfUkVTRVJWRV9BQ0NPVU5UIiwiTVBFX0NBTl9SRVRSSUVWRV9UUkFOU0FDVElPTiIsIk1QRV9SRVRSSUVWRV9SRVNFUlZFRF9BQ0NPVU5UIiwiTVBFX0RFTEVURV9SRVNFUlZFRF9BQ0NPVU5UIiwiTVBFX1JFVFJJRVZFX1JFU0VSVkVEX0FDQ09VTlRfVFJBTlNBQ1RJT05TIl0sImp0aSI6IjJiODA3MmU4LTk5NTEtNGFjMy05YmMyLWNiYWM4Y2NmNzY2OSIsImNsaWVudF9pZCI6Ik1LX1RFU1RfMzI5R1NLODJWQyJ9.CiqTL5xEXH3I7XUCa22gc6ftXTOlyQ-hE-pdn_3pC8f7X8GtQsyFZx-fJztnjSZJL79hgulvkAgS8vZCQNlN-gcwtB05IxDOqQic2cyX68jx0kWW6S0o4fCS8TIYeJw9_5A5K12K0HLK4QpFuw2pyssOatjoNbqPkFeaES9ryZiYikhiSvucuOPmJVxvCHP2pkdziNXq5foveF3Etxy32LsaCRoU3HOSPIDZihbL5ZgnamjlprdA09lZ2tpLYaEMASc_QNAqADpOxHnF6jnp7Lm2l4Zu6iPV-2S3ub_xtp_EbS70n-__-0--BDezo6cfvIZ7CSURlNcUZgSijh7oGg'


async function makeRequest(method, path, headers, requestBody) {
    try {
        const options = {
            hostname: baseUrl,
            port: 443,
            path: path,
            method: method,
            headers: headers
        };
        let p = new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (d) => {
                    data += d;
                });
                res.on('end', () => {
                    resolve(JSON.parse(data));
                });
            }).on('error', (error) => {
                reject(error);
            });
            if (typeof (requestBody) !== 'undefined') {
                req.write(JSON.stringify(requestBody));
            }
            req.end();
        });
        return await p
    } catch (error) {
        console.log(error)
        return error
    }
}

async function genToken() {
    const key = Buffer.from(apiKey + ':' + secretKey).toString('base64')
    let path = '/api/v1/auth/login'
    const headers = {
        'Authorization': `Basic ${key}`
    }
    const data = await makeRequest('POST', path, headers)
    console.log(data)
}

async function reserveAccount(requestBody) {
    let path = '/api/v2/bank-transfer/reserved-accounts'
    let headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': "application/json"
    }
    const data = await makeRequest('POST', path, headers, requestBody)
    console.log(data)
}

async function getAccountDetails(accountRef) {
    let path = `/api/v2/bank-transfer/reserved-accounts/${accountRef}`
    let headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': "application/json"
    }
    const data = await makeRequest('GET', path, headers)
    console.log(data)
}

async function getBanks() {
    let path = '/api/v1/banks'
    let headers = {
        'Authorization': `Bearer ${accessToken}`
    }
    const data = await makeRequest('GET', path, headers)
    // console.log(data)
    return data
}

async function singleOutboundTransfer(requestBody) {
    let path = '/api/v2/disbursements/single'
    let headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': "application/json"
    }
    const data = await makeRequest('POST', path, headers)
    console.log(data)
}

async function bulkOutboundTransfer(requestBody) {
    let path = '/api/v2/disbursements/batch'
    let headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': "application/json"
    }
    const data = await makeRequest('POST', path, headers, requestBody)
    console.log(data)
}

async function authorizeSingleTransfer(requestBody) {
    let path = '/api/v2/disbursements/authorize-transfer'
    let headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': "application/json"
    }
    const data = await makeRequest('POST', path, headers, requestBody);
    console.log(data);
}

async function authorizeBulkTransfer(requestBody) {
    let path = '/api/v2/disbursements/batch/validate-otp'
    let headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': "application/json"
    }
    const data = await makeRequest('POST', path, headers, requestBody)
    console.log(data)
}

async function getSingleTransferStatus(reference) {
    let path = `/api/v2/disbursements/single/summary?reference=${reference}`
    let headers = {
        'Authorization': `Bearer ${accessToken}`
    }
    const data = await makeRequest('GET', path, headers)
    console.log(data)
}

async function getBulkTransferStatus(reference) {
    let path = `/api/v2/disbursements/batch/summary?reference=${reference}`
    let headers = {
        'Authorization': `Bearer ${accessToken}`
    }
    const data = await makeRequest('GET', path, headers)
    console.log(data)
}

async function getWalletBalance() {
    let path = `/api/v2/disbursements/wallet-balance?accountNumber=${sourceAccountNumber}`
    let headers = {
        'Authorization': `Bearer ${accessToken}`
    }
    const data = await makeRequest('GET', path, headers)
    console.log(data)
}

async function getAccountDetails(reference) {
    let path = `/api/v2/bank-transfer/reserved-accounts/${reference}`
    let headers = {
        'Authorization': `Bearer ${accessToken}`
    }
    const data = await makeRequest('GET', path, headers)
    console.log(data)
}




///////////////////////////////////////////////

// getWalletBalance()

getAccountDetails('US-43s58059uw')

// let requestBody = {
//     "accountReference": "US-43s58059uw",
//     "accountName": "BlankGodd4",
//     "currencyCode": "NGN",
//     "contractCode": "1671903846",
//     "customerEmail": "blankgodd33@gmail.com",
//     "bvn": "21212121212",
//     "customerName": "Blank Godd",
//     "getAllAvailableBanks": true
// }
// reserveAccount(requestBody)

// genToken()
// getAccountDetails('bg')


// async function getBanksss() {
//     let banks = await getBanks()
//     console.log(banks)

//     var jsonBanks = JSON.stringify(banks.responseBody);
//     console.log(jsonBanks);

//     fs.writeFile("output.json", jsonBanks, 'utf8', (err) => {
//         if (err) {
//             console.log("An error occured while writing JSON Object to File.");
//             return console.log(err);
//         }

//         console.log("JSON file has been saved.");
//     });
// }
// getBanksss()

// function filterBankNames() {
//     let rawData = fs.readFileSync('output.json');
//     let banks = JSON.parse(rawData);
//     let names = []
//     for (let bank of banks) {
//         names.push(bank.name)
//     }
//     console.log(names)

// }

// filterBankNames()

// function getBankCode(bankName) {
//     let rawData = fs.readFileSync('output.json');
//     let banks = JSON.parse(rawData);
//     for (let bank of banks) {
//         if (bank.name === bankName) return bank.code;
//     }

// }

// console.log(getBankCode('Access bank'))

// let requestBody = {
//     "amount": 1000,
//     "reference": "TS-00001",
//     "narration": "1st Transaction",
//     "destinationBankCode": "035",
//     "destinationAccountNumber": "5000657769",
//     "currency": "NGN",
//     "sourceAccountNumber": sourceAccountNumber
// }


// let requestBody = {
//     "amount": 100,
//     "reference": "references133",
//     "narration": "911 Transaction",
//     "destinationBankCode": "033",
//     "destinationAccountNumber": "2165361806",
//     "currency": "NGN",
//     "sourceAccountNumber": sourceAccountNumber
// }
// singleOutboundTransfer(requestBody)

// let requestBody = {
//     "reference": "references133",
//     "authorizationCode": "061116"
// }
// authorizeTransfer(requestBody);


// let requestBody = {
//     "title": "Game of Batches",
//     "batchReference": "batchreference12934",
//     "narration": "911 Transaction",
//     "sourceAccountNumber": sourceAccountNumber,
//     "onValidationFailure": "CONTINUE",
//     "notificationInterval": 100,
//     "transactionList": [
//         {
//             "amount": 570,
//             "reference": "Final-Reference-2a",
//             "narration": "911 Transaction",
//             "destinationBankCode": "044",
//             "destinationAccountNumber": "1232553353",
//             "currency": "NGN"
//         },
//         {
//             "amount": 230,
//             "reference": "Final-Reference-3a",
//             "narration": "911 Transaction",
//             "destinationBankCode": "033",
//             "destinationAccountNumber": "2165361806",
//             "currency": "NGN"
//         }
//     ]
// }
// bulkOutboundTransfer(requestBody)

// let requestBody = {
//     "reference": "batchreference12934",
//     "authorizationCode": "607753"
// }
// authorizeBulkTransfer(requestBody)

// getBulkTransferStatus('batchreference12934')
