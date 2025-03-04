db.createCollection('carts');
db.carts.insert([
  {
    client_id: 1,
    content: [
      {
        product_id: 1,
        quantity: 1,
        price: 100
      },
      {
        product_id: 2,
        quantity: 2,
        price: 100
      }
    ]
  },
  {
    client_id: 2,
    content: [
      {
        product_id: 1,
        quantity: 1,
        price: 100
      }
    ]
  }
]);