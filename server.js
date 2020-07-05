const express = require('express');
const http = require('http');
const app = express();

app.use(express.static(__dirname + '/dist/covid-app'))


app.get('/numberdata/:numParams', (req, res) => {
    const params = req.params;
    var options = {
        host: 'numbersapi.com',
        path: `/${params.numParams}`
    };

    callback = function (response) {
        let str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            res.send(str);
        });
    }
    let numberReq = http.request(options, callback);
    numberReq.on('error', function (error) {
        res.status(500).send(error);
    })
    numberReq.end();
})

app.get('/*', (req, res) => {
    res.sendFile(__dirname + '/dist/covid-app/index.html');
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on Port ...')
})