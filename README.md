# monnify-nodejs

## Description
A simple wrapper to leverage monnify's payment gateway for businesses to accept payments from customers, 
either on a recurring or one-time basis. It offers an easier and faster way for integration 
with monnify API on you web and mobile applications from within your node application.

For more information, please check the monnify documentation [here](https://teamapt.atlassian.net/wiki/spaces/MON/overview)

## Installation

```npm install monnify-nodejs```


## How to use

To get started, we need to import and instantiate our package. When instantiating, we need to pass our `secretKey` and `apiKey` which can be found on the monnify dashboard along with our `baseUrl` which is either the sandbox or production url for monnify API. Note that all methods are asynchronous so you have to make use of the `await` keyword when calling them.

```js
const Monnify = require('monnify-nodejs')

async function testMonnify() {
    const m = new Monnify(secretKey, apiKey, baseUrl)
}

```

### Reserve Account
You reserve an account by calling the `reserveAccount` method and passing a `requestBody` as a parameter. This returns the details off the account along with the account numbers.

```js
async function testMonnify() {
    const m = new Monnify(secretKey, apiKey, baseUrl)

    let requestBody= {
        "accountReference": "abc123",
        "accountName": "Test Reserved Account",
        "currencyCode": "NGN",
        "contractCode": "8389328412",
        "customerEmail": "test@tester.com",
        "bvn": "21212121212",
        "customerName": "John Doe",
        "getAllAvailableBanks": true
    }
    const reservedAcc = await m.reserveAccount(requestBody)
}
```

### Get Banks
To get a list of all banks supported by monnify and their information, you leverage the `getBanks` method.

```js
async function testMonnify() {
    
    ...

    const banks = await m.getBanks();

}
```

### Single Outbound Transfer
To make a single transfer from the merchant wallet to any bank account in nigeria, you call the `singleOutboundTransfer` method.

```js

async function testMonnify() {
    
    ...

    let requestBody = {
        "amount": 10,
        "reference":"reference12934",
        "narration":"911 Transaction",
        "destinationBankCode": "058",
        "destinationAccountNumber": "0111946768",
        "currency": "NGN",
        "sourceAccountNumber": "4637221455"
    } 
    const sot = await m.singleOutboundTransfer(requestBody)
}
```

### Bulk Outbound Transfer
To make transfers from the merchant wallet to multiple bank accounts in nigeria, you call the `bulkOutboundTransfer` method.

```js

async function testMonnify() {
    
    ...

    let requestBody = {
        "title" : "Game of Batches",
        "batchReference":"batchreference12934",
        "narration":"911 Transaction",
        "sourceAccountNumber": "9624937372",
        "onValidationFailure" : "CONTINUE",
        "notificationInterval": 10,
        "transactionList" : [
            {
                "amount": 1300,
                "reference":"Final-Reference-1a",
                "narration":"911 Transaction",
                "destinationBankCode": "058",
                "destinationAccountNumber": "0111946768",
                "currency": "NGN"
            },
            {
                "amount": 230,
                "reference":"Final-Reference-3a",
                "narration":"911 Transaction",
                "destinationBankCode": "058",
                "destinationAccountNumber": "0111946768",
                "currency": "NGN"
            }

        ]
    } 
    const bot = await m.bulkOutboundTransfer(requestBody)
}
```

### Authorize Single Transfer
To authorize single outbound transfer, you call the `authorizeSingleTransfer` method.

```js
async function testMonnify() {
    
    ...

    let requestBody = {
        "reference":"reference12934",
        "authorizationCode":"40538652"
    } 
    const ast = await m.authorizeSingleTransfer(requestBody)
}
```


### Authorize Bulk Transfer
To authorize bulk outbound transfer, you call the `authorizeBulkTransfer` method.

```js
async function testMonnify() {
    
    ...

    let requestBody = {
        "reference":"batch-reference12934",
        "authorizationCode":"40538652"
    } 
    const abt = await m.authorizeBulkTransfer(requestBody)
}
```

### Resend OTP For single transfer
To request OTP resend for single users, you call the `resendOtpSingle` method.

```js
async function testMonnify() {
    
    ...

    let requestBody = {
        "reference" : "reference12934"
    }
    const data = await m.resendOtpSingle(requestBody)
}
```

### Resend OTP For Bulk transfer
To request OTP resend for Bulk users, you call the `resendOtpBulk` method.

```js
async function testMonnify() {
    
    ...

    let requestBody = {
        "reference" : "batch-reference12934"
    }
    const data = await m.resendOtpBulk(requestBody)
}

```

### Get single outbound transfer status
To get the status for a single outbound transfer, you call the `getSingleTransferStatus` method.

```js
async function testMonnify() {
    
    ...

    const data = await m.getSingleTransferStatus(reference)
    // reference here is the transaction reference
}

```

### Get Bulk outbound transfer status
To get the status for a bulk outbound transfer, you call the `getBulkTransferStatus` method.

```js
async function testMonnify() {
    
    ...

    const data = await m.getBulkTransferStatus(reference)
    // reference here is the bulk transaction reference
}

```

### Get Wallet balance
To get merchant wallet ballance, you call the `getWalletBallance` method.


```js
async function testMonnify() {
    
    ...

    const data = await m.getWalletBallance(accountNumber)
    // accountNumber here is the merchant waller account number
}

```

### Get Account Details
To get reserved account details, you call the `getAccountDetails` method.

```js
async function testMonnify() {
    
    ...

    const data = await m.getAccountDetails(reference)
    // accountNumber here is the merchant waller account reference
}

```

### Initiate Payment
To initiate a one time payment by customers to the merchant, you call the `initiatePayment` method.

```js
async function testMonnify() {
    
    ...

    let requestBody = {
        "amount": 100.00,
        "customerName": "Stephen Ikhane",
        "customerEmail": "stephen@ikhane.com",
        "paymentReference": "123031klsadkad",
        "paymentDescription": "Trial transaction",
        "currencyCode": "NGN",
        "contractCode":"32904822812",
        "redirectUrl": "https://my-merchants-page.com/transaction/confirm",
        "paymentMethods":["CARD","ACCOUNT_TRANSFER"]
    }
    const data = await m.initiatePayment(requestBody)
    
}

```

### Pay with Bank Transfer

```js
async function testMonnify() {
    
    ...

    let requestBody = {
        "transactionReference": "{{transactionReference}}",
        "bankCode": "058"
    }
    const data = await m.payWithBankTransfer(requestBody)
    
}

```

### Pay with Card

```js
async function testMonnify() {
    
    ...

    let requestBody = {
        "transactionReference": "MNFY|20190514172736|000001",
        "collectionChannel": "API_NOTIFICATION",
        "card": {
            "number": "4111111111111111",
            "expiryMonth": "10",
            "expiryYear": "2022",
            "pin": "1234",
            "cvv": "122"
        }
    }
    const data = await m.payWithCard(requestBody)
    
}

```


### Authorize OTP for Card
After paying with card, we need to authorize the payment with a OTP using this method.

```js

async function testMonnify() {
    
    ...

    let requestBody = {
        "transactionReference": "MNFY|54|20210429142945|000208",
        "collectionChannel": "API_NOTIFICATION",
        "tokenId": "2000.00-e944ba213f0acbc90a16b292ba353b2f",
        "token": "123456"
    }
    // tokenId is gotten from the pay with card response `otpData.id`
    const data = await m.payWithCard(requestBody)
    
}
```

### Charge Card Token

This feature allows you to accept payments from your customer’s card without requiring the customer’s card details. This can be used for recurring payments, subscriptions, automated savings, etc. 

- How it works:     
  - A first transaction requiring customer authorization is done from your web or mobile application
  - Get a token linked to the card.
  - Save the card token
  - Charge the card using the saved token.

Once the first card transaction is successful, you get a card token by getting the transaction status for that particular transaction. You can than use this token, along with the user's email address for future purposes.
To do this, you can do;

```js
async function testMonnify() {
    
    ...

    let requestBody = {
        "cardToken": "MNFY_6A9DAD234B3E4E3C965B8F1D7BA8E0DE",
        "amount": 50,
        "customerName": "Smart Mekiliuwa",
        "customerEmail": "smekiluwa@teamapt.com",
        "paymentReference": "1642776682937",
        "paymentDescription": "Paying for Product A",
        "currencyCode": "NGN",
        "contractCode": "675234136342",
        "apiKey": "MK_TEST_VR7J3UAACH",
        "metaData": {
            "ipAddress": "127.0.0.1",
            "deviceType": "mobile"
        }
    }
    const data = await m.chargeCardToken(requestBody)
    
}

```

### Delete Reserved Account

```js

async function testMonnify() {
    
    ...

    const data = await m.deleteReservedAccount(accountReference)
    
}
```

### Create Limit Profile
We can create a limit profile for a merchant. This allows the merchant to set a limit on a customer's account. To do this, we call the `createLimitProfile` method.

```js

async function testMonnify() {
    
    ...

    let requestBody = {
        "limitProfileName": "Test Limit Profile",
        "singleTransactionValue": 2000,
        "dailyTransactionVolume": 500,
        "dailyTransactionValue": 150000
    }
    const data = await m.createLimitProfile(requestBody)
    
}

```

### Update Limit Profile

```js

async function testMonnify() {
    
    ...

    let requestBody = {
        "limitProfileName":"Test Limit Profile Update",
        "singleTransactionValue":70000,
        "dailyTransactionVolume":4000,
        "dailyTransactionValue": 100000000
    } 
    const data = await m.createLimitProfile(rb)
    const limitProfileCode = data.responseBody.limitProfileCode
    const data = await m.updateLimitProfile(limitProfileCode, requestBody)
    
}

```


### Get Limit Profiles

```js

async function testMonnify() {
    
    ...

    const data = await m.getLimitProfiles()
    
}

```


### Reserve Account With Limit

```js

async function testMonnify() {
    
    ...

    let requestBody = {
        "contractCode":"915483727511",
        "accountName":"Kan Yo' Reserved with Limit ",
        "currencyCode":"NGN",
        "accountReference": "ref-007",
        "customerEmail": "KanYo@monnify.com",
        "customerName": "Kan Yo",
        "limitProfileCode": "2XKTQ3LE9NH2",
    }
    const data = await m.reserveAccountWithLimit(requestBody)
    
}

```


### Update Reserve Account Limit

```js

async function testMonnify() {
    
    ...

    let requestBody = {
        "accountReference": "ref-007",
        "limitProfileCode": "CJNRPG6VDHYE"
    } 
    // limitProfileCode is the code for the new profile to be added to account
    const data = await m.updateReserveAccountLimit(requestBody)
    
}

```


### Initiate Refund

```js
async function testMonnify() {
    
    ...

    let requestBody = {
        "transactionReference": "tranRef",
        "refundReference":"merchantRefundRef",
        "refundAmount": 1000.56,
        "refundReason": "Order cancelled! (limited to 64 characters)",
        "customerNote": "A note to be sent to customer (limited to 16 characters)",
        "destinationAccountNumber": "Optional account number to send the refund amount to",
        "destinationAccountBankCode": "Optional bank code to identify the destination bank"
    }
    const data = await m.initiateRefund(requestBody)
    
}

```


### Get All Refunds
```js
async function testMonnify() {
    
    ...
    const data = await m.getAllRefunds(page=0, size=10)
    
}
```


### Get Refund Status
```js
async function testMonnify() {
    
    ...
    const data = await m.getRefundStatus(refundRefence)
    
}
```

### Get Refund Status
```js
async function testMonnify() {
    
    ...
    const data = await m.validateBankAccount(accountNumber, bankCode)
    
}
```


## Conclusion

The end ... .. . ?

