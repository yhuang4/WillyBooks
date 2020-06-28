$(document).ready(function () {
    // Initialize Cloud Firestore through Firebase
    // const config = {
    //     apiKey: "AIzaSyC5TzLHjjL2WOd9ohiUAFTmd2y5wJx46cw",
    //     authDomain: "willybook-97a70.firebaseapp.com",
    //     databaseURL: "https://willybook-97a70.firebaseio.com",
    //     projectId: "willybook-97a70",
    //     storageBucket: "willybook-97a70.appspot.com",
    //     messagingSenderId: "390421399190",
    //     appId: "1:390421399190:web:b2f607bc879934f0"
    // };
    // firebase.initializeApp(config);

    let auth = firebase.auth()
    var db = firebase.firestore();
    let user

    auth.onAuthStateChanged(firebaseUser => {
        user = firebaseUser

        $("#resend-email-btn").on("click", function(){
            user.sendEmailVerification().then(function () {
                alert("Verification email has been resent")
            }).catch(function (error) {
                alert(error)
            })
        })

        db.collection("books").where("uid", "==", user.uid)
            .get()
            .then(function (querySnapshot) {
                console.log(user.uid)
                console.log(querySnapshot.docs)
                if (querySnapshot.docs.length === 0) {
                    $('#na-container').removeClass("d-none")
                }

                querySnapshot.forEach(function (doc) {
                    console.log(doc.id, " => ", doc.data());
                    let book = doc.data()
                    append()

                    // delete button clicked
                    $(".delete-button").on("click", (event) => {
                        console.log(event)
                        if (confirm("Are you sure you want to remove this book from WillyBook?")) {
                            db.collection("books").doc(event.target.id).delete()
                                .then(function () {
                                    console.log("document deleted")
                                    alert("This book has been successfully removed!")
                                    location.reload()
                                })
                                .catch((error) => {
                                    alert(error)
                                })
                        }
                    })

                    // obtain photos
                    // var listRef = storageRef.child('books/' + doc.id);
                    // listRef.listAll().then(function (res) {
                    //     console.log('list', res)
                    //     // res.items.forEach(function (items) {
                    //     //     console.log('each', items)
                    //     //     items.getDownloadURL().then(function(url){
                    //     //         picSrc = url
                    //     //     }).catch(function(error){
                    //     //         console.log(error)
                    //     //     })
                    //     //     console.log(picSrc)
                    //     // });
                    //     let picPath = res.items[0].location.path_
                    //     storageRef.child(picPath).getDownloadURL().then(function(url){
                    //         console.log('uid', uid)

                    //     })
                    // }).catch(function (error) {
                    //     console.log(error)
                    // });

                    // obtain other info
                    function append() {
                        $('#result-container').append(
                            '<div class="row">' +
                            // '<div class="col-sm-12 col-md-4 border-bottom border-dark">' +
                            //     '<div class="text-center my-3"><img src="' + picSrc + '" alt="cat" width="200"></div>' +
                            // '</div>' +
                            '<div class="col-sm-12 col-md-12 pb-3 border-bottom border-dark">' +
                                '<div class="my-3">' +
                                    '<a href="#">' +
                                        '<h4>' + book.bookName + '</h4>' +
                                    '</a>' +
                                    '<h5>Course: ' + book.courses + '</h5>' +
                                    '<h5>$' + book.price + '</h5>' +
                                    '<h5>' + book.condition + '</h5>' +
                                '</div>' +
                                '<button type="button" class="btn btn-primary delete-button" id="' + doc.id + '">Delete</button>' + 
                            '</div>' +
                        '</div>'
                        )
                    }

                });
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });

    })




})