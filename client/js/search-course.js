$(document).ready(function(){
    let url = location.search
    let start = url.indexOf("course=") + 7
    let course = url.substring(start)
    $("#search-result").text(course)
    
    let param = new FormData()
    param.append('course', course)

    // fetch(data, {
    //     method: "POST",
    //     body: param
    // })
    // .then(checkStatus)
    // .then(JSON.parse)
    // .then(showProject)
    // .catch(console.log);

    function showProject(result){
        for (let i = 0; i < result.length; i++){
            $('#result-container').append(
                '<div class="row border-bottom border-dark">' + 
                    '<div class="my-3">' + 
                        '<a href="course.html?course=' + result[i].link + '">' + 
                            '<h4>' + result[i].name + '</h4>' + 
                        '</a>' + 
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
})