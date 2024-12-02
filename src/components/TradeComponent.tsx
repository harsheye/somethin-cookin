// Change WebSocket connection
const ws = new WebSocket(`ws://localhost:8080/trade/${tradeId}`);

// Change API endpoint in createTrade
const response = await fetch('http://localhost:5009/api/trades/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(tradeData)
}); 