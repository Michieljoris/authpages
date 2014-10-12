websocket_url = 'ws://localhost:9001';
(function () {
        var probe;
        function getConnection() {
            var connection = new WebSocket(websocket_url, []);
    
            // When the connection is open, send some data to the server
            connection.onopen = function () {
                connection.send('browser ' + navigator.userAgent); // Send the message 'Ping' to the server
                clearTimeout(probe);
                probe = false;
            };

            // Log errors
            connection.onerror = function (error) {
                // console.log('WebSocket Error ' , error);
            };

            // Log messages from the server
            connection.onmessage = function (e) {
                clearTimeout(probe);
                console.log('Server: ' , e.data);
                if (e.data === "reload") {
                    location.reload();
                }
            };
            connection.onclose = function (e) {
                if (!probe)
                    probe = setInterval(function() {
                        console.log('Trying to connect to bb-server');
                        connection = getConnection();
                    },1000);
            };
        }
        getConnection();
    })();
