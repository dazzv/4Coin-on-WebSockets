const API_KEY = "9e75fe3943538323d347345d62e661502ee07ed0fd51f0cb850d6bd1b946d6e3";

const tickersHandlers = new Map();

const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`);
const AGGREGATE_INDEX = '5';

socket.addEventListener('message', e => {
  const {TYPE: type, FROMSYMBOL: currency, PRICE: newPrice} = JSON.parse(e.data);
  if(type !== AGGREGATE_INDEX || newPrice === undefined) {
    return
  }

  const handlers = tickersHandlers.get(currency) ?? [];
  handlers.forEach(fn => fn(newPrice));
  
})

//получаем через websocket
function sendToWS(message) {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN){
    socket.send(stringifiedMessage);
    return;
  }
  socket.addEventListener('open', () => {
    socket.send(stringifiedMessage);
  }, {once: true});
}

function subscribeToTickerOnWS(ticker) {
  sendToWS({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`]
  });
}

function unsubscribeToTickerOnWS(ticker) {
  sendToWS({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`]
  });
}

export const subscribeToTicker = (ticker, callback) => { // когда обновиться такой то ticker, вызови функцию callback
  const subscriber = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscriber, callback]);
  subscribeToTickerOnWS(ticker);
}

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
  unsubscribeToTickerOnWS(ticker);
}
// window.tickers = tickers;