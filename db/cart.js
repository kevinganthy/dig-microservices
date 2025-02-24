db.createCollection('users');
db.users.insert([
  {
    firstname: "Jean",
    lastname: "Valjean",
    email: "jean@valjean.fr",
    password: "$2b$10$Z8iEoVVkWZa4mVxds4.Ti.ZquuOetvT8.dwA.VL.TqTiyLi1yRCou",
    description: "Je suis un ancien bagnard",
    image: "https://static.wikia.nocookie.net/les-miserables/images/f/f9/Jean_Valjean.jpg/revision/latest?cb=20161217082048&path-prefix=fr",
    role_id: 1
  }
]);