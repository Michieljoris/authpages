//node module
console.log('Hello from a node module!!!');

// vouchdb.connect('http://couch.local');
vouchdb.connect('http://localhost:5984');

var from = makeUUID();
listenForMsgs(from);
console.log('From key: ', from);

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


function listenForMsgs(from) {
    console.log('listening for public messages..');
    var options =
        from ? { include_docs: true, filter: 'cape/to', to:from } :
    { inclue_docs: true };
    vouchdb.dbChanges(function(change) {
        change.results.forEach(function(result) {
            console.log('Received msg: ', result.doc.msg);
            alert('Received msg: ' + result.doc.msg);
        });
    }, 0, options, 'public');
    
}

if (location.pathname == '/confirm.html' &&
    location.search.indexOf('?signup=' === 0)) {
    var uuid = location.search.slice(8);
    console.log(uuid);
    vouchdb.docSave({ msg: 'confirm',
                      uuid: uuid,
                      from: from
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
                      usernameOrEmail: $("#username")[0].value,
                      from: from
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
                      from: from
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
                      from: from
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


cliks = $("#test").asEventStream("click");
cliks.onValue(function() {
    console.log('Testing');
    var res = httpGet('http://couch.local/temp/_all_docs?include_docs=true"');
    console.log(res);
    
});

function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
