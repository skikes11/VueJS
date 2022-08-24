const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const axios = require('axios').default;

axios.defaults.headers.common['authority'] = "api.binance.com";
axios.defaults.headers.common['method'] = "GET";
axios.defaults.headers.common['path'] = "/api/v3/ticker/price?symbol=BTCUSDT";
axios.defaults.headers.common['scheme'] = "https";
axios.defaults.headers.common['accept'] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9";
axios.defaults.headers.common['accept-encoding'] = "gzip, deflate, br";
axios.defaults.headers.common['accept-language'] = "en-US,en;q=0.9";
axios.defaults.headers.common['cache-control'] = "max-age=0";

axios.defaults.headers.common['dnt'] = "1";
axios.defaults.headers.common['sec-ch-ua'] = `"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"`;
axios.defaults.headers.common['sec-ch-ua-mobile'] = "?0";
axios.defaults.headers.common['sec-ch-ua-platform'] = "Linux";
axios.defaults.headers.common['sec-fetch-dest'] = "document";
axios.defaults.headers.common['sec-fetch-mode'] = "navigate";
axios.defaults.headers.common['sec-fetch-site'] = "?1";
axios.defaults.headers.common['upgrade-insecure-requests'] = "1";





const btcapi = axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
const ethapi = axios.get('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT');
const dogeapi = axios.get('https://api.binance.com/api/v3/ticker/price?symbol=DOGEUSDT');
const shibapi = axios.get('https://api.binance.com/api/v3/ticker/price?symbol=SHIBUSDT');



io.on('connection', async (socket) => {
    console.log("connected")

    while(true){
         axios.all([btcapi, ethapi, dogeapi, shibapi]).then(axios.spread(function(res1, res2, res3, res4) {

        
            let btc = res1.data
            let eth = res2.data
            let doge = res3.data
            let shib = res4.data

           
            if(Math.random() < 0.5){
                btc.price = String(parseFloat(btc.price) - Math.random()*btc.price*0.0005)
            }else{
                btc.price = String(parseFloat(btc.price) + Math.random()*btc.price*0.0005)
            }
            
            if(Math.random() < 0.5){
                eth.price = String(parseFloat(eth.price) - Math.random()*eth.price*0.0005)
            }else{
                eth.price = String(parseFloat(eth.price) + Math.random()*eth.price*0.0005)
            }
           
            if(Math.random() < 0.5){
                doge.price = String(parseFloat(doge.price) - Math.random()*doge.price*0.0005)
            }else{
                doge.price = String(parseFloat(doge.price) + Math.random()*doge.price*0.0005)
            }
            
            if(Math.random() < 0.5){
                shib.price = String(parseFloat(shib.price) - Math.random()*shib.price*0.0015)
            }else{
                shib.price = String(parseFloat(shib.price) + Math.random()*shib.price*0.0015)
            }

            btc.price = parseFloat(btc.price).toFixed(3)
            eth.price = parseFloat(eth.price).toFixed(3)
            doge.price = parseFloat(doge.price).toFixed(7)
            shib.price = parseFloat(shib.price).toFixed(9)

            const data = [btc, eth, doge, shib]
            console.log(data)
            socket.emit("data", data)
          }));
          
          await sleep(2000)
    }

   


});

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}


server.listen(3000,()=>{
    console.log("listening on port 3000")
});