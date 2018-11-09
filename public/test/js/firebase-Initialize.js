var config = {
    apiKey: "AIzaSyDM0nHhbIi5YU4eqtbFTAkH3nL7CBchBDY",
    authDomain: "yogurt-22fd4.firebaseapp.com",
    databaseURL: "https://yogurt-22fd4.firebaseio.com",
    projectId: "yogurt-22fd4",
    storageBucket: "yogurt-22fd4.appspot.com",
    messagingSenderId: "178442852803"
};
firebase.initializeApp(config);
/*
document.addEventListener('DOMContentLoaded', function () {
    try {
        let app = firebase.app();
        let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
        document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
    } catch (e) {
        console.error(e);
        document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
    }
});*/
