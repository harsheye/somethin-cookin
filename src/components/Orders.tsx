const response = await fetch('http://localhost:5009/api/orders', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
}); 