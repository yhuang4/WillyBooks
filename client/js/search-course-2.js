$(document).ready(function(){
    let url = location.search
    let start = url.indexOf("course=") + 7
    let course = url.substring(start)
    $("#course-name").text(course)
    
    let param = new FormData()
    param.append('course', course)

    fetch(data, {
        method: "POST",
        body: param
    })
    .then(checkStatus)
    .then(JSON.parse)
    .then(showProject)
    .catch(console.log);

    function showProject(result){
        for (let i = 0; i < result.length; i++){
            $('#books-container').append(
                '<div class="row border-bottom border-dark">' + 
                    '<div class="my-3">' + 
                        '<a href="cat.html">' + 
                            '<h4>Cat on a Hot Tin Roof</h4>' + 
                        '</a>' + 
                        '<h5>ISBN: 9780811216012</h5>' + 
                        '<h5>Course: AP English Literature</h5>' + 
                    '</div>' + 
                '</div>'
            )
        }
    }        

    function checkStatus(response){
        if(response.status >= 200 && response.status < 300 || response.status == 0){
            return response.text();
        } else{
            return Promise.reject(new Error(response.status + ': ' + response.statusText));
        }
    }

    $('.extend').on('click', function(){
        let book = $(this).text();
        fetch(data, {
            method: "POST",
            body: param
        })
        .then(checkStatus)
        .then(JSON.parse)
        .then(showBooks)
        .catch(console.log);

        function showBooks(result){
            for (let i = 0; i < result.length; i++){
                $('#books-box').append(
                    '<div class="row">' +
                        '<div class="col-sm-12 col-md-4 border-bottom border-dark">' +
                            '<div class="text-center my-3"><img src="' + result[i].image + '" alt="cat" width="150"></div>' + 
                        '</div>' +
                        '<div class="col-sm-12 col-md-8 border-bottom border-dark">' +
                            '<div class="my-3">' + 
                                '<a href="#">' + 
                                    '<h5>' + result[i].name + '</h5>' + 
                                '</a>' + 
                                '<h6>' + result[i].course + '</h6>' + 
                                '<h6>' + result[i].price + '</h6>' + 
                                '<h6>' + result[i].condition + '</h6>' + 
                                '<h6>From: ' + result[i].seller + '</h6>' +
                            '</div>' + 
                        '</div>' + 
                    '</div>'
                )
            }
        }
    })
})