var admin = require("firebase-admin");

var serviceAccount = require("./beyond-rd-firebase-adminsdk-yksu3-283b60b813.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore()

module.exports = firestore
