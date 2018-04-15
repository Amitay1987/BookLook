//var $ = require('jquery');

$('#btn').on('click',function () {
    alert("test");
    var isbn = $('input').val();
    $.ajax({
        method: "GET",
        url: 'https://www.googleapis.com/books/v1/volumes?q=isbn:0439023521',
        success: function(data) {
            console.log(data);
            var title = data.items[0].volumeInfo.title;
            console.log(title);
            var description = data.items[0].volumeInfo.description;
            console.log(description);

            // addBook();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
})


