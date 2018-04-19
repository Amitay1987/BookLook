var books = new Array(10);

//event listener to button
$('#btn').on('click',function () {
    if(!$('#customCheck1').is(' :checked')){
        alert("You must agree to the terms")
    }
    else {
        var input = $('input').val();
        var option = $('select').val();
        //ISBN option
        if (option === '1') {
            var valid = $('.form-group input').parsley();

            //check valid input of ISBN option
            if (valid.isValid() === true) {
                emptyList();
                $.ajax({
                    method: "GET",
                    url: 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + input,
                    success: function (data) {
                        if (data.totalItems === 0) {
                            emptyData();
                            alert("ISBN not found")
                        }
                        else {
                            var bookObject = {
                                title : data.items[0].volumeInfo.title,
                            }
                            if('authors' in data.items[0].volumeInfo){
                                bookObject.author =  data.items[0].volumeInfo.authors;
                            }
                            else{
                                bookObject.author = "author details missing";
                            }
                            if(!('description' in  data.items[0].volumeInfo)){
                                bookObject.description ="<h4>" + "*description missing*" + "</h4>";
                            }
                            else{
                                bookObject.description = data.items[0].volumeInfo.description;
                            }
                            if("imageLinks" in data.items[0].volumeInfo){
                                bookObject.picBook = data.items[0].volumeInfo.imageLinks.smallThumbnail;
                            }
                            else {
                                bookObject.picBook = "http://i.imgur.com/J5LVHEL.jpg";
                            }

                            fillData(bookObject);
                        }
                    },

                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(textStatus);
                    }
                });
            }
            //if the ISBN input is not valid
            else {
                alert("The ISBN number is not valid");
            }
        }

        //title option
        else if (option === '2') {
            $.ajax({
                method: "GET",
                url: 'https://www.googleapis.com/books/v1/volumes?q=intitle:' + input,
                success: function (data) {
                    if (data.totalItems === 0) {
                        emptyList();
                        emptyData();
                        alert(input + " title not found");
                        $("#results").text("Result by : " + input);
                    }
                    else {
                        var SearchParameter = "Title : " + input;
                        emptyData();
                        emptyList();
                        fillList(data, SearchParameter);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus);
                }
            });
        }

        //author option
        else {
            $.ajax({
                method: "GET",
                url: 'https://www.googleapis.com/books/v1/volumes?q=inauthor:' + input,
                success: function (data) {
                    if (data.totalItems === 0) {
                        emptyList();
                        emptyData();
                        alert(input + " author not found");
                    }
                    else{
                        var SearchParameter = "Author : " + input;
                        emptyData();
                        emptyList();
                        fillList(data, SearchParameter);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus);
                }
            });
        }
    }
})

//event listener to book list
$('#list_books').on('click','li',function () {
    var index = $(this).index();
    emptyData();
    fillArrayData(books[index]);
})

//fill data from books array
var fillArrayData = function(objectBook){
    $('#title').append("<h1>" + objectBook.title + "</h1>");
    $('#description').append("<p>" + objectBook.description + "</p>");
    $('#writer').append("<h4>" + "Written by: "+ objectBook.author + "</h4>");
    $('#picBook').append("<img src =" + objectBook.picBook + ">" );
}

//fill list of books
var fillList = function (data,searchParameter){
    $("#results").text("Result by " + searchParameter);
    books = [];
    var bookObject;
    for (var i = 0; i < 10; i++) {
        bookObject  = {
            title : data.items[i].volumeInfo.title,
        }
        if('authors' in data.items[i].volumeInfo){
            bookObject.author =  data.items[i].volumeInfo.authors;
        }
        else{
            bookObject.author = "author details missing";
        }
        if(!('description' in  data.items[i].volumeInfo)){
            bookObject.description ="<h4>" + "*description missing*" + "</h4>";
        }
        else{
            bookObject.description = data.items[i].volumeInfo.description;
        }
        if("imageLinks" in data.items[i].volumeInfo){
            bookObject.picBook = data.items[i].volumeInfo.imageLinks.smallThumbnail;
        }
        else {
            bookObject.picBook = "http://i.imgur.com/J5LVHEL.jpg";
        }

        books.push(bookObject);
        $('#list_books').append("<li>" + bookObject.title + "</li>")
    }
}

//fill data of book
var fillData  = function (data) {
    emptyData();
    $('#title').append("<h1>" +data.title + "</h1>");
    $('#description').append("<p>" + data.description + "</p>");
    var authors = "";
    for (var i = 0; i < data.author.length; i++) {
        authors+= "," +data.author[i];
    }
    $('#writer').append("<h4>" + "Written by: "+ authors + "</h4>");
    $('#picBook').append("<img src =" + data.picBook + ">" );
}

//empty data of book
var emptyData = function (){
    $('#title').text("");
    $('#description').text("");
    $('#writer').text("");
    $('#picBook').empty();
}

//empty books list
var emptyList = function () {
    $('#list_books').empty()
}

$(document)
    .ajaxStart(function () {
        //ajax request went so show the loading image
        $('#loading-image').show();
    })
    .ajaxStop(function () {
        //got response so hide the loading image
        $('#loading-image').hide();
    });




