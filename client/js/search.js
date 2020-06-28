$(document).ready(function(){
    // for search.html
    $('#isbn-form').on('submit', function() { 
        event.preventDefault();
        console.log('hi');
        let isbn = $('#isbn').val();

        if (isNaN(isbn) || isbn.length !== 13)
            alert("Please enter a valid ISBN (13 digit)");
        else{
            location.href = "isbn.html?isbn=" + isbn
        }
    });

    $('#course-form').on('submit', function() { 
        event.preventDefault();
        console.log('hi');
        let course = $('#course').val();
        location.href = "course-selection.html?course=" + course
    });

    // for authentication
    

})