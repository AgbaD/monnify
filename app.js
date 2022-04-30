const https = require('https');
const { promisify } = require('util')
const sleep = promisify(setTimeout)

class Monnify {

    constructor(secretKey, apiKey, baseUrl) {
        this.secretKey = secretKey;
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.accessToken = this.genToken()
    }

    async makeRequest(method, path, headers, requestBody) {
        try {
            const options = {
                hostname: this.baseUrl,
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

    // to generate token
    async genToken() {
        const key = Buffer.from(this.apiKey + ':' + this.secretKey).toString('base64')
        let path = '/api/v1/auth/login'
        const headers = {
            'Authorization': `Basic ${key}`
        }
        const data = await this.makeRequest('POST', path, headers)
        await sleep(1000)
        this.accessToken = data.responseBody.accessToken
        // return data.responseBody.accessToken
    }

    // to reserve an account
    async reserveAccount(requestBody) {
        await this.genToken()
        let path = '/api/v2/bank-transfer/reserved-accounts'
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data;
    }

    // to get list of all banks
    async getBanks() {
        await this.genToken()
        let path = '/api/v1/banks'
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`
        }
        const data = await this.makeRequest('GET', path, headers)
        return data
    }

    // to make single outbound transfer
    async singleOutboundTransfer(requestBody) {
        await this.genToken()
        let path = '/api/v2/disbursements/single'
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data
    }

    // to make bulk outbound transfer
    async bulkOutboundTransfer(requestBody) {
        await this.genToken()
        let path = '/api/v2/disbursements/batch'
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data
    }

    // to authorize single outbound transfer 
    async authorizeSingleTransfer(requestBody) {
        await this.genToken()
        let path = '/api/v2/disbursements/single/validate-otp'
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody);
        return data;
    }

    // to authorize bulk outbound transfer 
    async authorizeBulkTransfer(requestBody) {
        await this.genToken()
        let path = '/api/v2/disbursements/batch/validate-otp'
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data
    }

    // resend OTP
    async resendOtpSingle(requestBody) {
        await this.genToken()
        let path = '/api/v2/disbursements/single/resend-otp'
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data
    }

    async resendOtpBulk(requestBody) {
        await this.genToken()
        let path = '/api/v2/disbursements/batch/resend-otp'
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data
    }

    // to get single outbound transfer status
    async getSingleTransferStatus(reference) {
        await this.genToken()
        let path = `/api/v2/disbursements/single/summary?reference=${reference}`
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`
        }
        const data = await this.makeRequest('GET', path, headers)
        return data
    }

    // to get bulk outbound transfer status
    async getBulkTransferStatus(reference) {
        await this.genToken()
        let path = `/api/v2/disbursements/batch/summary?reference=${reference}`
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`
        }
        const data = await this.makeRequest('GET', path, headers)
        return data
    }

    // to get merchant account wallet balance
    async getWalletBalance(accountNumber) {
        await this.genToken()
        let path = `/api/v2/disbursements/wallet-balance?accountNumber=${accountNumber}`
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`
        }
        const data = await this.makeRequest('GET', path, headers)
        return data
    }

    // to get reserved account details
    async getAccountDetails(reference) {
        await this.genToken()
        let path = `/api/v2/bank-transfer/reserved-accounts/${reference}`
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`
        }
        const data = await this.makeRequest('GET', path, headers)
        return data
    }

    // for merchant to receive payments
    async initiatePayment(requestBody) {
        await this.genToken()
        let path = '/api/v1/merchant/transactions/init-transaction'
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data
    }

    async payWithBankTransfer(requestBody) {
        await this.genToken()
        let path = '/api/v1/merchant/bank-transfer/init-payment'
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data
    }

    async payWithCard(requestBody) {
        await this.genToken()
        let path = '/api/v1/merchant/cards/charge'
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data
    }


    async authorizeOtpForCard(requestBody) {
        await this.genToken()
        let path = '/api/v1/merchant/cards/otp/authorize'
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data
    }

    async chargeCardToken(requestBody) {
        await this.genToken()
        let path = '/api/v1/merchant/cards/charge-card-token'
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data
    }

    async deleteReservedAccount(accountReference) {
        await this.genToken()
        let path = `/api/v1/bank-transfer/reserved-accounts/reference/${accountReference}`
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`
        }
        const data = await this.makeRequest('DELETE', path, headers)
        return data
    }

    async createLimitProfile(requestBody) {
        await this.genToken()
        let path = '/api/v1/limit-profile/'
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data
    }

    async updateLimitProfile(limitProfileCode, requestBody) {
        await this.genToken()
        let path = `/api/v1/limit-profile/${limitProfileCode}`
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('PUT', path, headers, requestBody)
        return data
    }

    async getLimitProfiles() {
        await this.genToken()
        let path = '/api/v1/limit-profile/'
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`
        }
        const data = await this.makeRequest('GET', path, headers)
        return data
    }


    async reserveAccountWithLimit(requestBody) {
        await this.genToken()
        let path = '/api/v1/bank-transfer/reserved-accounts/limit'
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data
    }


    async updateReserveAccountLimit(requestBody) {
        await this.genToken()
        let path = '/api/v1/bank-transfer/reserved-accounts/limit'
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('PUT', path, headers, requestBody)
        return data
    }

    async initiateRefund(requestBody) {
        await this.genToken()
        let path = '/api/v1/refunds/initiate-refund'
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data
    }

    async getAllRefunds(page, size) {
        await this.genToken()
        let path = `/api/v1/refunds?page=${page}&size=${size}`
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`
        }
        const data = await this.makeRequest('GET', path, headers)
        return data
    }

    async getRefundStatus(refundReference) {
        await this.genToken()
        let path = `/api/v1/refunds/${refundReference}`
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`
        }
        const data = await this.makeRequest('GET', path, headers)
        return data
    }

    async validateBankAccount(accountNumber, bankCode) {
        await this.genToken()
        let path = `/api/v1/disbursements/account/validate?accountNumber=${accountNumber}&bankCode=${bankCode}`
        let headers = {
            'Authorization': `Bearer ${this.accessToken}`
        }
        const data = await this.makeRequest('GET', path, headers)
        return data
    }
}


module.exports = Monnify

