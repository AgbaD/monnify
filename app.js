const https = require('https');
const fs = require('fs');
const dotenv = require('dotenv')
dotenv.config();

const secretKey = process.env.MONNIFY_SECRET_KEY
const apiKey = process.env.MONNIFY_API_KEY
const baseUrl = 'sandbox.monnify.com'
const sourceAccountNumber = process.env.SOURCE_ACCOUNT_NUMBER
const accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsibW9ubmlmeS12YWx1ZS1hZGRlZC1zZXJ2aWNlIiwibW9ubmlmeS1wYXltZW50LWVuZ2luZSIsIm1vbm5pZnktZGlzYnVyc2VtZW50LXNlcnZpY2UiXSwic2NvcGUiOlsicHJvZmlsZSJdLCJleHAiOjE2NTEyNTMzNjMsImF1dGhvcml0aWVzIjpbIk1QRV9NQU5BR0VfTElNSVRfUFJPRklMRSIsIk1QRV9VUERBVEVfUkVTRVJWRURfQUNDT1VOVCIsIk1QRV9JTklUSUFMSVpFX1BBWU1FTlQiLCJNUEVfUkVTRVJWRV9BQ0NPVU5UIiwiTVBFX0NBTl9SRVRSSUVWRV9UUkFOU0FDVElPTiIsIk1QRV9SRVRSSUVWRV9SRVNFUlZFRF9BQ0NPVU5UIiwiTVBFX0RFTEVURV9SRVNFUlZFRF9BQ0NPVU5UIiwiTVBFX1JFVFJJRVZFX1JFU0VSVkVEX0FDQ09VTlRfVFJBTlNBQ1RJT05TIl0sImp0aSI6IjcyMzMwZmIwLTE5MzMtNDAxNC1hZjRiLWQ4ZTM3YTFhMGU1ZSIsImNsaWVudF9pZCI6Ik1LX1RFU1RfMzI5R1NLODJWQyJ9.NaemFM-3C62m38W6_Q55ddmEaRvxJidPD0BEK87vRXykd5QLn6U0bva9355qCZG1CJZNhoabPk91ByVfMqHn1vSCatSXvE4m2_icFL9kJPGejQs860KzGFYUkIS34Xw6xNERnjlimN--AB8KiYI1bv8mDWHFsEmsP9bwca7H-icLX8OdUv-61-fRMyUwqIQEQbCQSSh6uY3AuZIBYEVO2GjGF_axOiuyg4ZuDd_NitqVORWPFgs_uxwwrFRqmRCsIPJn3Z2bV6DS_ts2pgpMQRe8sJpIioDPEW-lWChrBA02CxlfxcLOkE_ljK366oKf1JKBccvetYgMayOjbm7b1w'


class Monnify {
    constructor(secretKey, apiKey, baseUrl) {
        this.secretKey = secretKey;
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
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
        return data.responseBody.accessToken
    }

    // to reserve an account
    async reserveAccount(accessToken, requestBody) {
        let path = '/api/v2/bank-transfer/reserved-accounts'
        let headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data;
    }

    // to get list of all banks
    async getBanks(accessToken) {
        let path = '/api/v1/banks'
        let headers = {
            'Authorization': `Bearer ${accessToken}`
        }
        const data = await this.makeRequest('GET', path, headers)
        return data
    }

    // to make single outbound transfer
    async singleOutboundTransfer(accessToken, requestBody) {
        let path = '/api/v2/disbursements/single'
        let headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await makeRequest('POST', path, headers, requestBody)
        return data
    }

    // to make bulk outbound transfer
    async bulkOutboundTransfer(accessToken, requestBody) {
        let path = '/api/v2/disbursements/batch'
        let headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data
    }

    // to authorize single outbound transfer 
    async authorizeSingleTransfer(accessToken, requestBody) {
        let path = '/api/v2/disbursements/authorize-transfer'
        let headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody);
        return data;
    }

    // to authorize bulk outbound transfer 
    async authorizeBulkTransfer(accessToken, requestBody) {
        let path = '/api/v2/disbursements/batch/validate-otp'
        let headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data
    }

    // resend OTP
    async resendOtp(accessToken, requestBody) {
        let path = '/api/v2/disbursements/single/resend-otp'
        let headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data
    }

    // to get single outbound transfer status
    async getSingleTransferStatus(accessToken, reference) {
        let path = `/api/v2/disbursements/single/summary?reference=${reference}`
        let headers = {
            'Authorization': `Bearer ${accessToken}`
        }
        const data = await this.makeRequest('GET', path, headers)
        return data
    }

    // to get bulk outbound transfer status
    async getBulkTransferStatus(accessToken, reference) {
        let path = `/api/v2/disbursements/batch/summary?reference=${reference}`
        let headers = {
            'Authorization': `Bearer ${accessToken}`
        }
        const data = await this.makeRequest('GET', path, headers)
        return data
    }

    // to get merchant account wallet balance
    async getWalletBalance(accessToken, accountNumber) {
        let path = `/api/v2/disbursements/wallet-balance?accountNumber=${accountNumber}`
        let headers = {
            'Authorization': `Bearer ${accessToken}`
        }
        const data = await this.makeRequest('GET', path, headers)
        return data
    }

    // to get reserved account details
    async getAccountDetails(accessToken, reference) {
        let path = `/api/v2/bank-transfer/reserved-accounts/${reference}`
        let headers = {
            'Authorization': `Bearer ${accessToken}`
        }
        const data = await this.makeRequest('GET', path, headers)
        return data
    }

    // for merchant to receive payments
    async initiatePayment(accessToken, requestBody) {
        let path = '/api/v1/merchant/transactions/init-transaction'
        let headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data
    }

    async payWithBankTransfer(accessToken, requestBody) {
        let path = '/api/v1/merchant/bank-transfer/init-payment'
        let headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data
    }

    async payWithCard(accessToken, requestBody) {
        let path = '/api/v1/merchant/cards/charge'
        let headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data
    }


    async authorizeOtpForCard(accessToken, requestBody) {
        let path = '/api/v1/merchant/cards/otp/authorize'
        let headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data
    }

    async chargeCardToken(accessToken, requestBody) {
        let path = '/api/v1/merchant/cards/charge-card-token'
        let headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data
    }

    async deleteReservedAccount(accessToken, accountReference) {
        let path = `/api/v1/bank-transfer/reserved-accounts/reference/${accountReference}`
        let headers = {
            'Authorization': `Bearer ${accessToken}`
        }
        const data = await this.makeRequest('DELETE', path, headers)
        return data
    }

    async createLimitProfile(accessToken, requestBody) {
        let path = '/api/v1/limit-profile/'
        let headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data
    }

    async updateLimitProfile(accessToken, limitProfileCode, requestBody) {
        let path = `/api/v1/limit-profile/${limitProfileCode}`
        let headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('PUT', path, headers, requestBody)
        return data
    }

    async getLimitProfiles(accessToken) {
        let path = '/api/v1/limit-profile/'
        let headers = {
            'Authorization': `Bearer ${accessToken}`
        }
        const data = await this.makeRequest('GET', path, headers)
        return data
    }


    async reserveAccountWithLimit(accessToken, requestBody) {
        let path = '/api/v1/bank-transfer/reserved-accounts/limit'
        let headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data
    }


    async updateReserveAccountLimit(accessToken, requestBody) {
        let path = '/api/v1/bank-transfer/reserved-accounts/limit'
        let headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('PUT', path, headers, requestBody)
        return data
    }

    async initiateRefund(accessToken, requestBody) {
        let path = '/api/v1/refunds/initiate-refund'
        let headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': "application/json"
        }
        const data = await this.makeRequest('POST', path, headers, requestBody)
        return data
    }

    async getAllRefunds(accessToken, page, size) {
        let path = `/api/v1/refunds?page=${page}&size=${size}`
        let headers = {
            'Authorization': `Bearer ${accessToken}`
        }
        const data = await this.makeRequest('GET', path, headers)
        return data
    }

    async getRefundStatus(accessToken, refundReference) {
        let path = `/api/v1/refunds/${refundReference}`
        let headers = {
            'Authorization': `Bearer ${accessToken}`
        }
        const data = await this.makeRequest('GET', path, headers)
        return data
    }

    async validateBankAccount(accessToken, accountNumber, bankCode) {
        let path = `/api/v1/disbursements/account/validate?accountNumber=${accountNumber}&bankCode=${bankCode}`
        let headers = {
            'Authorization': `Bearer ${accessToken}`
        }
        const data = await this.makeRequest('GET', path, headers)
        return data
    }
}







