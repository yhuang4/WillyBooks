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

    var db = firebase.firestore();
    let storageRef = firebase.storage().ref()

    db.collection("books")
        .get()
        .then(function (querySnapshot) { // no condition for query -> return all books
            //console.log(querySnapshot.docs)
            if (querySnapshot.docs.length === 0) {
                $('#na-card').attr('hidden', false)
                $('#no-result').text("Sorry, there are no books for sale")
            }

            querySnapshot.forEach(function (doc) {
                //console.log(doc.id, " => ", doc.data());
                let book = doc.data()
                let picSrc
                let uid = book.uid
                let name, email, number
                 
                db.collection("users").doc(uid).get().then(function(userDoc){
                    // picSrc = url
                    name = userDoc.data().name
                    email = userDoc.data().email
                    number = userDoc.data().number
                    
                    // obtain photos
                    var listRef = storageRef.child('books/' + doc.id + '/cover');
                    //console.log('listref', listRef)
                    listRef.listAll().then(function (res) {
                        //console.log('res', res)
                        // console.log('list', res)
                        // res.items.forEach(function (items) {
                        //     console.log('each', items)
                        //     items.getDownloadURL().then(function(url){
                        //         picSrc = url
                        //     }).catch(function(error){
                        //         console.log(error)
                        //     })
                        //     console.log(picSrc)
                        // });
                        let picPath = res.items[0].location.path_
                        // console.log(pic)
                        storageRef.child(picPath).getDownloadURL().then(function(url){
                            //console.log('url', url)
                            picSrc = url
                            append()
                        })
                    }).catch(function (error) {
                        console.log(error)
                    });

                    
                }) 

                

                // obtain other info
                function append(){
                    $('#result-container').append(
                        '<div class="row">' +
                            '<div class="col-sm-12 col-md-4 border-bottom border-dark">' +
                                '<div class="text-center my-3"><img src="' + picSrc + '" alt="cat" width="200"></div>' +
                            '</div>' +
                            '<div class="col-sm-12 col-md-8 border-bottom border-dark">' +
                                '<div class="my-3">' +
                                    '<a href="#">' +
                                        '<h4>' + book.bookName + '</h4>' +
                                    '</a>' +
                                    '<h5>Course: ' + book.courses + '</h5>' +
                                    '<h5>$' + book.price + '</h5>' +
                                    '<h5>' + book.condition + '</h5>' +
                                    '<h5>isbn: ' + book.isbn + '</h5>' +
                                    '<h5>From: ' + name + '</h5>' +
                                    '<h5>Contact email: ' + email + '</h5>' +
                                    '<h5>Contact number: ' + number + '</h5>' +
                                    '<h5>Notes: ' + book.notes + '</h5>' +
                                    '<button type="button" id="' + doc.id + '" class="btn btn-outline-secondary photos-btn">View Photos</button>' + 
                                '</div>' +
                            '</div>' +
                        '</div>'
                    )

                    $("#" + doc.id).on("click", function(){
                        let others = []
                        var listRef = storageRef.child('books/' + doc.id + '/others')
                        let count = 0
                        listRef.listAll().then(function (res) {
                            if (res.items.lentgh == 0){
                                popUp()
                            }
                            res.items.forEach(function (item) {
                                item.getDownloadURL().then(function(url){
                                    //console.log('then', url)
                                    others.push(url)
                                    count++
                                    //console.log("item",  res.items)
                                    if (count === res.items.length){
                                        popUp()
                                    }
                                }).catch(function(error){
                                    console.log(error)
                                })
                                //console.log('foreach')
                            })

                            function popUp(){
                                let indicator = '<li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>'
                                let item = '<div class="carousel-item active bg-dark">' + 
                                                '<img src="' + picSrc + '" class="d-block m-auto carousel-img" alt="...">' + 
                                            '</div>' // this is for cover photo
                                for (let i = 0; i < others.length; i++){
                                    indicator += '<li data-target="#carouselExampleIndicators" data-slide-to="' + (i+1) + '"></li>'
                                    item += '<div class="carousel-item bg-dark">' + 
                                                '<img src="' + others[i] + '" class="d-block m-auto carousel-img" alt="...">' + 
                                            '</div>'
                                }
                                //console.log(indicator)
                                $('body').append(
                                    '<div class="pop-up-container">' +
                                        '<div class="pop-up-box">' + 
                                            '<div class="card">' + 
                                                '<div class="card-header p-0">' + 
                                                    '<nav class="navbar navbar-expand-sm bg-light">' + 
                                                        '<h5 class="navbar-brand">Preview</h5>' + 
                                                        '<ul class="navbar-nav ml-auto">' + 
                                                            '<li class="nav-item">' + 
                                                                '<h5 class="fas fa-times pointer" id="close-pop-up"></h5>' + 
                                                            '</li>' + 
                                                        '</ul>' + 
                                                    '</nav>' + 
                                                '</div>' + 
                                                '<div class="card-body bg-dark">' + 
                                                    '<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">' + 
                                                        '<ol class="carousel-indicators">' + 
                                                            indicator +  
                                                        '</ol>' + 
                                                        '<div class="carousel-inner" style="height: 500px;">' + 
                                                            item + 
                                                        '</div>' + 
                                                        '<a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">' + 
                                                            '<span class="carousel-control-prev-icon" aria-hidden="true"></span>' + 
                                                            '<span class="sr-only">Previous</span>' + 
                                                        '</a>' + 
                                                        '<a class="carousel-control-next" href="#carouselExampleIndicators" role="button"' + 
                                                            'data-slide="next">' + 
                                                            '<span class="carousel-control-next-icon" aria-hidden="true"></span>' + 
                                                            '<span class="sr-only">Next</span>' + 
                                                        '</a>' + 
                                                    '</div>' + 
                                                '</div>' + 
                                            '</div>' + 
                                        '</div>' + 
                                    '</div>'
                                )
                                $("#close-pop-up").on("click", function(){
                                    $(".pop-up-container").remove()
                                })
                            }

                    // // obtain other info
                    // function append(){
                    //     $('#result-container').append(
                    //         '<div class="row">' +
                    //             '<div class="col-sm-12 col-md-4 border-bottom border-dark">' +
                    //                 '<div class="text-center my-3"><img src="' + picSrc + '" alt="cat" width="200"></div>' +
                    //             '</div>' +
                    //             '<div class="col-sm-12 col-md-8 border-bottom border-dark">' +
                    //                 '<div class="my-3">' +
                    //                     '<a href="#">' +
                    //                         '<h4>' + book.bookName + '</h4>' +
                    //                     '</a>' +
                    //                     '<h5>Course: ' + book.courses + '</h5>' +
                    //                     '<h5>$' + book.price + '</h5>' +
                    //                     '<h5>' + book.condition + '</h5>' +
                    //                     '<h5>From: ' + name + '</h5>' +
                    //                     '<h5>Contact email: ' + email + '</h5>' +
                    //                     '<h5>Contact number: ' + number + '</h5>' +
                    //                     '<button type="button" class="btn btn-outline-secondary photos-btn">View Photos</button>' + 
                    //                 '</div>' +
                    //             '</div>' +
                    //         '</div>'
                    //     )

                    //     $(".photos-btn").on("click", function(){
                    //         let others = []
                    //         var listRef = storageRef.child('books/' + doc.id + '/others')
                    //         let count = 0
                    //         listRef.listAll().then(function (res) {
                    //             res.items.forEach(function (item) {
                    //                 item.getDownloadURL().then(function(url){
                    //                     //console.log('then', url)
                    //                     others.push(url)
                    //                     count++
                    //                     //console.log("item",  res.items)
                    //                     if (count === res.items.length){
                    //                         popUp()
                    //                     }
                    //                 }).catch(function(error){
                    //                     console.log(error)
                    //                 })
                    //                 //console.log('foreach')
                    //             })

                    //             function popUp(){
                    //                 let indicator = '<li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>'
                    //                 let item = '<div class="carousel-item active bg-dark">' + 
                    //                                 '<img src="' + picSrc + '" class="d-block m-auto carousel-img" alt="...">' + 
                    //                             '</div>' // this is for cover photo
                    //                 for (let i = 0; i < others.length; i++){
                    //                     indicator += '<li data-target="#carouselExampleIndicators" data-slide-to="' + (i+1) + '"></li>'
                    //                     item += '<div class="carousel-item bg-dark">' + 
                    //                                 '<img src="' + others[i] + '" class="d-block m-auto carousel-img" alt="...">' + 
                    //                             '</div>'
                    //                 }
                    //                 //console.log(indicator)
                    //                 $('body').append(
                    //                     '<div class="pop-up-container">' +
                    //                         '<div class="pop-up-box">' + 
                    //                             '<div class="card">' + 
                    //                                 '<div class="card-header p-0">' + 
                    //                                     '<nav class="navbar navbar-expand-sm bg-light">' + 
                    //                                         '<h5 class="navbar-brand">Preview</h5>' + 
                    //                                         '<ul class="navbar-nav ml-auto">' + 
                    //                                             '<li class="nav-item">' + 
                    //                                                 '<h5 class="fas fa-times pointer" id="close-pop-up"></h5>' + 
                    //                                             '</li>' + 
                    //                                         '</ul>' + 
                    //                                     '</nav>' + 
                    //                                 '</div>' + 
                    //                                 '<div class="card-body bg-dark">' + 
                    //                                     '<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">' + 
                    //                                         '<ol class="carousel-indicators">' + 
                    //                                             indicator +  
                    //                                         '</ol>' + 
                    //                                         '<div class="carousel-inner" style="height: 500px;">' + 
                    //                                             item + 
                    //                                         '</div>' + 
                    //                                         '<a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">' + 
                    //                                             '<span class="carousel-control-prev-icon" aria-hidden="true"></span>' + 
                    //                                             '<span class="sr-only">Previous</span>' + 
                    //                                         '</a>' + 
                    //                                         '<a class="carousel-control-next" href="#carouselExampleIndicators" role="button"' + 
                    //                                             'data-slide="next">' + 
                    //                                             '<span class="carousel-control-next-icon" aria-hidden="true"></span>' + 
                    //                                             '<span class="sr-only">Next</span>' + 
                    //                                         '</a>' + 
                    //                                     '</div>' + 
                    //                                 '</div>' + 
                    //                             '</div>' + 
                    //                         '</div>' + 
                    //                     '</div>'
                    //                 )
                    //                 $("#close-pop-up").on("click", function(){
                    //                     $(".pop-up-container").remove()
                    //                 })
                    //             }
                            
                        }).catch(function (error) {
                            console.log(error)
                        })

                    })
                }
                
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });

        

    function showProject(result) {
        for (let i = 0; i < result.length; i++) {
            $('#result-container').append(
                '<div class="row">' +
                '<div class="col-sm-12 col-md-4 border-bottom border-dark">' +
                '<div class="text-center my-3"><img src="' + result[i].image + '" alt="cat" width="200"></div>' +
                '</div>' +
                '<div class="col-sm-12 col-md-8 border-bottom border-dark">' +
                '<div class="my-3">' +
                '<a href="#">' +
                '<h4>' + result[i].name + '</h4>' +
                '</a>' +
                '<h5>Course: ' + result[i].course + '</h5>' +
                '<h5>$' + result[i].price + '</h5>' +
                '<h5>' + result[i].condition + '</h5>' +
                '<h5>From: ' + result[i].seller + '</h5>' +
                '</div>' +
                '</div>' +
                '</div>'
            )
        }
    }

    function checkStatus(response) {
        if (response.status >= 200 && response.status < 300 || response.status == 0) {
            return response.text();
        } else {
            return Promise.reject(new Error(response.status + ': ' + response.statusText));
        }
    }
})