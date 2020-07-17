module.exports = (order) => {
    const uuidv1 = require('uuidv1');
    const https = require('https');
    //parameters send to MoMo get get payUrl
    var endpoint = "https://test-payment.momo.vn/gw_payment/transactionProcessor"
    var hostname = "https://test-payment.momo.vn"
    var path = "/gw_payment/transactionProcessor"
    var partnerCode = "MOMO8BMH20200717";
    var accessKey = "PBVVK360866h4btk";
    var serectkey = "s6PUjXvY6zjpqjhLFMfvbgcRJfzmcgVn";
    var orderInfo = "Thanh toán bằng ví Momo";
    var returnUrl = "http://localhost:8080";
    var notifyurl = "http://localhost:8080";
    var amount = order.total;
    var orderId = order._id;
    var requestId = uuidv1();
    var requestType = "captureMoMoWallet";
    var extraData = "merchantName=;merchantId="; //pass empty value if your merchant does not have stores else merchantName=[storeName]; merchantId=[storeId] to identify a transaction map with a physical store
    //before sign HMAC SHA256 with format
    //partnerCode=$partnerCode&accessKey=$accessKey&requestId=$requestId&amount=$amount&orderId=$oderId&orderInfo=$orderInfo&returnUrl=$returnUrl&notifyUrl=$notifyUrl&extraData=$extraData
    var rawSignature = "partnerCode=" + partnerCode + "&accessKey=" + accessKey + "&requestId=" + requestId + "&amount=" + amount + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&returnUrl=" + returnUrl + "&notifyUrl=" + notifyurl + "&extraData=" + extraData

    //signature
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', serectkey)
        .update(rawSignature)
        .digest('hex');

    //json object send to MoMo endpoint
    var body = JSON.stringify({
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        returnUrl: returnUrl,
        notifyUrl: notifyurl,
        extraData: extraData,
        requestType: requestType,
        signature: signature,
    })
    //Create the HTTPS objects
    var options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/gw_payment/transactionProcessor',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
        }
    };

    //Send the request and get the response
    var req = https.request(options, (res) => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (body) => {
            console.log('Body');
            console.log(body);
            console.log('payURL');
            console.log(JSON.parse(body).payUrl);
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    });

    req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
    });

    // write data to request body
    req.write(body);
    req.end();
}