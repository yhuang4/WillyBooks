
$(document).ready(function () {
    var auth = firebase.auth();
    var db = firebase.firestore();
    var storage = firebase.storage();
    var storageRef = storage.ref();
    let user

    let cover
    let photos
    auth.onAuthStateChanged(firebaseUser => {
        user = firebaseUser
    })

    $('#cover-photo').on('change', (event) => {
        cover = event.target.files
        console.log(cover)
    })

    $('#photos').on('change', (event) => {
        photos = event.target.files
        console.log(photos)
    })

    let count = 0
    $("#upload").on("submit", function () {
        event.preventDefault()
        if (!user.emailVerified) {
            alert("Sorry, please verify your email first")
        }
        else {
            $('#submit-btn').attr("disabled", true)
            $('#uploading').text("Uploading... Please don't close this page")
            let bookName = $("#book-name").val()
            let isbn = $("#isbn").val()
            let courses = $("#courses").val()
            if (courses === ""){
                courses = "N/A"
            }
            let price = $("#price").val()
            let condition = $("input[name='condition']:checked").val()
            let notes = $("#notes").val()
            if (notes === ""){
                notes = "N/A"
            }
            let id = Date.now().toString() // id is current time

            let photosRef = storageRef.child('books/' + id + '/cover/' + cover[0].name)
                console.log(photosRef)
                photosRef.put(cover[0]).then(function (snapshot) {
                    console.log('cover uploaded')
                    count++
                    checkRedirect()
                })

            // other photos
            if (photos){ // to make sure there are other photos uploaded
                for (let i = 0; i < Math.min(photos.length, 5); i++) { // so maximum upload is 5
                    let photosRef = storageRef.child('books/' + id + '/others/' + photos[i].name)
                    photosRef.put(photos[i]).then(function (snapshot) {
                        console.log('image uploaded')
                        count++
                        checkRedirect()
                    })
                }
            }
            

            db.collection("books").doc(id).set({
                bookName: bookName,
                isbn: isbn,
                courses: courses,
                price: price,
                condition: condition,
                uid: user.uid, 
                notes: notes
            })
                .then(function () {
                    console.log('data uploaded')
                })
                .catch(function (error) {
                    alert("Error writing document: ", error);
                })

            function checkRedirect() {
                console.log(count)
                if (photos){
                    if (count === Math.min(photos.length, 5) + 1) { // +1 because of cover photo
                        location.href = "index.html"
                    }
                }   
                else{
                    location.href = "index.html"
                }
            }
        }
    })

    function checkStatus(response) {
        if (response.status >= 200 && response.status < 300 || response.status == 0) {
            return response.text();
        } else {
            return Promise.reject(new Error(response.status + ': ' + response.statusText));
        }
    }
})