//node module
console.log('Hello from a node module!!!');

vouchdb.connect('http://localhost:5984');
// vouchdb.info().when(
//     function(data) {
//         console.log(data);
//     },
//     function(err) {
//         console.log('Error:', err);
//     }
// );

// vouchdb.dbAll().when(
//     function(data) {
//         console.log(data);
//     },
//     function(err) {
//         console.log('Error:', err);
//     }
// );


if (location.pathname == '/confirm.html' &&
    location.search.indexOf('?signup=' === 0)) {
    var uuid = location.search.slice(8);
    console.log(uuid);
    vouchdb.docSave({ msg: 'confirm',
                      uuid: uuid
                    }, 'reception');
}

var cliks = $("#forgotpwd").asEventStream("click");
cliks.onValue(function() {
    vouchdb.docSave({ msg:'forgotpwd',
                      username: $("#username")[0].value
                    }, 'reception')
        .when(
            function(data) {
                console.log(data);
            },
            function(err) {
                console.log('Error:', err);
            }
        );
    
});

cliks = $("#signup").asEventStream("click");
cliks.onValue(function() {
    vouchdb.docSave({ msg:'signup',
                      username: $("#username")[0].value,
                      email: $("#email")[0].value,
                      pwd: $("#password")[0].value
                    }, 'reception')
        .when(
            function(data) {
                console.log(data);
            },
            function(err) {
                console.log('Error:', err);
            }
        );
    
});







