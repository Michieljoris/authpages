//node module
console.log('Hello from a node module!!!');

// vouchdb.connect('http://couch.local');
vouchdb.connect('http://localhost:5984');

var callback = makeUUID();
listenForMsgs(callback);
console.log('Callback key: ', callback);

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

// vouchdb.dbChanges(function(change) {
//     change.results.forEach(function(result) {
//         console.log('Reception change:', result.doc);
//     });
// }, 0, { include_docs: true  }, 'reception');


function listenForMsgs(callback) {
    console.log('listening for public messages..');
    var options =
        callback ? { include_docs: true, filter: 'app/bla', callback:callback } :
    { inclue_docs: true };
    vouchdb.dbChanges(function(change) {
        change.results.forEach(function(result) {
            console.log('Received msg: ', result.doc.msg);
        });
    }, 0, options, 'public');
    
}

if (location.pathname == '/confirm.html' &&
    location.search.indexOf('?signup=' === 0)) {
    var uuid = location.search.slice(8);
    console.log(uuid);
    vouchdb.docSave({ msg: 'confirm',
                      uuid: uuid,
                      callback: callback
                    }, 'reception');
}

function makeUUID() {
    function makeUUID() {
        return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, function(c) {
            var r = Math.random()*16|0, v = r;
            return v.toString(16);
        });
    }
    return makeUUID();
}


var cliks = $("#forgotpwd").asEventStream("click");
cliks.onValue(function() {
    vouchdb.docSave({ msg:'forgotpwd',
                      usernameOrPassword: $("#username")[0].value,
                      callback: callback
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

cliks = $("#login").asEventStream("click");
cliks.onValue(function() {
    vouchdb.login($("#username")[0].value, $("#password")[0].value)
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
                      pwd: $("#password")[0].value,
                      callback: callback
                    }, 'reception')
        .when(
            function(data) {
                console.log('Posted signup msg');
            },
            function(err) {
                console.log('Error posting signup msg:', err);
            }
        );
    
});

cliks = $("#resetpwd").asEventStream("click");
cliks.onValue(function() {
    vouchdb.docSave({ msg:'resetpwd',
                      pwd: $("#password1")[0].value,
                      uuid: location.search.slice(10),
                      callback: callback
                    }, 'reception')
        .when(
            function(data) {
                console.log('Posted resetpwd msg');
            },
            function(err) {
                console.log('Error posting resetpwd msg:', err);
            }
        );
    
});














