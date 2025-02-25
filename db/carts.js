db.createCollection('cart');
db.cart.insert([
  {
    client_id: 1,
    cart: [
      {
        product_id: 1,
        quantity: 1
      },
      {
        product_id: 2,
        quantity: 2
      }
    ]
  }
]);