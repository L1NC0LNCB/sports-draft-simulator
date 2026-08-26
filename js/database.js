// Configuração e inicialização do Firebase (SDK "compat" -> funciona com <script> normal,
// sem precisar de servidor local nem de type="module")
const firebaseConfig = {
    apiKey: "AIzaSyBFp4QiEaupVgoUVlZYIBdszF5t2Ql20C8",
    authDomain: "sportsbar-b313e.firebaseapp.com",
    projectId: "sportsbar-b313e",
    storageBucket: "sportsbar-b313e.firebasestorage.app",
    messagingSenderId: "483447820443",
    appId: "1:483447820443:web:a4f135b1adf3e46948f63e"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
