//import firebase from 'firebase'

const ApiKey = function () {
  this.getApiKey = function() {
    const API_KEY =  'OAuth oauth_consumer_key="KQ3YUg58YCfrcH0MjOHsxjfgg",oauth_token="978283603355492353-rsTF3uhmMhHI0l1Nm8daw6h4NmpJHkU",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1523212988",oauth_nonce="0M2PQ5wCoXD",oauth_version="1.0",oauth_signature="cwiOCbNRI4IxxLR08PuhXjAlk7Y%3D"';
    return API_KEY;
  };
}

// const config = {
//     apiKey: "AIzaSyCcVF6eVFAkFgsbm33J8y5owQbl5g8a4RY",
//     authDomain: "sentify-01.firebaseapp.com",
//     databaseURL: "https://sentify-01.firebaseio.com",
// };

// firebase.initializeApp(config);

export const Key = new ApiKey();
// export const googleProvider = new firebase.auth.GoogleAuthProvider();
// export const ref = firebase.database().ref();
// export const firebaseAuth = firebase.auth;
