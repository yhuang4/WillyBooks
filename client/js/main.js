
$(document).ready(function () {
    let auth = firebase.auth();
    let db = firebase.firestore();

    // const config = {
    //     apiKey: "AIzaSyC5TzLHjjL2WOd9ohiUAFTmd2y5wJx46cw",
    //     authDomain: "willybook-97a70.firebaseapp.com",
    //     databaseURL: "https://willybook-97a70.firebaseio.com",
    //     projectId: "willybook-97a70",
    //     storaageBucket: "willybook-97a70.appspot.com",
    //     messagingSenderId: "390421399190",
    //     appId: "1:390421399190:web:b2f607bc879934f0"
    // };
    // firebase.initializeApp(config);
    // const auth = firebase.auth()

    let loginRedirect = false
    let signingUp = false
    let name, number, email

    auth.onAuthStateChanged(user => {
        console.log(user)

        if (loginRedirect){
            location.href = "index.html"
        }
        if (signingUp){
            if (user) {
                alert("Singup successful. Please verify your email. ")
                user.updateProfile({ 
                    displayName: name
                })
                db.collection("users").doc(user.uid).set({ // write in database
                    number: number, 
                    name: name, 
                    email: email
                })
                    .then(function () {
                        console.log('data uploaded')
                    })
                    .catch(function (error) {
                        alert("Error writing document: ", error);
                    })
                
                user.sendEmailVerification().then(function () {
                    console.log("email sent")
                    location.href = "index.html"
                }).catch(function (error) {
                    alert(error)
                })
            }
            else {
                console.log('not logged in')
            }
        }
        if (user) {
            // signed in
            $('#login-n-out').text("Log Out")
            $('#login-n-out').attr("href", "#")
            $('#my-account').attr("hidden", false)

            $("#login-n-out").on("click", function () {
                auth.signOut()
                location.href = "index.html"
            })
        }
        else {
            $('#login-n-out').text("Login")
            $('#login-n-out').attr("href", "login.html")
            $('#my-account').attr("hidden", true)
        }
    })

    $("#login").on("submit", function () {
        event.preventDefault()

        const email = $("#email").val()
        const pwd = $("#pwd").val()

        auth.signInWithEmailAndPassword(email, pwd)
        .catch(e => {
            alert(e.message)
        })
        loginRedirect = true
    })

    $("#signup").on("submit", function () {
        event.preventDefault()

        name = $("#name").val()
        number = $("#number").val()
        email = $("#email").val() + "@williston.com"
        const pwd = $("#pwd").val()
        let reenterPwd = $("#reenter-pwd").val()

        if (pwd === reenterPwd){
            auth.createUserWithEmailAndPassword(email, pwd)
            .catch(e => {
                alert(e.message)
                console.log(e.message)
            })

            signingUp = true
        }
        else{
            alert("Passwords don't agree")
        }

        // auth.onAuthStateChanged(firebaseUser => {
        //     if (firebaseUser) {
        //         alert("Singup successful. Please verify your email. ")
        //         console.log(firebaseUser)
        //         firebaseUser.updateProfile({
        //             displayName: name
        //         })
        //         firebaseUser.sendEmailVerification().then(function () {
        //             console.log("email sent")
        //         }).catch(function (error) {
        //             console.log(error)
        //         })

        //     }
        //     else {
        //         console.log('not logged in')
        //     }
        // })

    })

    

    
})