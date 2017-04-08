// # SimpleServer
// A simple chat bot server

var logger = require('morgan');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');
var router = express();

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
var server = http.createServer(app);


app.get('/', (req, res) => {
  res.send("Home page. Server running okay.");
});

app.get('/webhook', function(req, res) {
  if (req.query['hub.verify_token'] === 'maxaminhcuatui') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});



app.post('/webhook', function(req, res) {
  var entries = req.body.entry;
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      if (message.message) {
        // If user send text
        if (message.message.text) {
          var text = message.message.text;
          console.log(text); // In tin nhắn người dùng
          sendMessage(senderId, "Tui là bot đây: " + text);
        }
      }
    }
  }

  res.status(200).send("OK");
});


// Gửi thông tin tới REST API để trả lời
function sendMessage(senderId, message) {
  addPersistentMenu();
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: "EAACNJHU49IwBAJbZCuyuRfX3iXTKsnFtYaBkoFv9qUx5dyNYklsK0ZCRwkZAl3t6nqmr67efzQANSwbCOjZBQvsrxXxp4uGTCjtVHW86zN7bQH0tq947AF5AfBYkcwOjswOnFdgxsavRLYOR9St7WafykLbKeXngPeYBX9ARkwZDZD",
    },
    method: 'POST',
    json: {
      recipient: {
        id: senderId
      },
      message: {
        text: message
      },
    }
  });
}


function addPersistentMenu() {
  request({
      url:'https://graph.facebook.com/v2.6/me/messenger_profile',
      qs: {
          access_token: "EAACNJHU49IwBAJbZCuyuRfX3iXTKsnFtYaBkoFv9qUx5dyNYklsK0ZCRwkZAl3t6nqmr67efzQANSwbCOjZBQvsrxXxp4uGTCjtVHW86zN7bQH0tq947AF5AfBYkcwOjswOnFdgxsavRLYOR9St7WafykLbKeXngPeYBX9ARkwZDZD",
      },
      method: 'POST',
      persistent_menu:[
          {
              "locale":"default",
              "composer_input_disabled":true,
              "call_to_actions":[
                  {
                      "title":"My Account",
                      "type":"nested",
                      "call_to_actions":[
                          {
                              "title":"Pay Bill",
                              "type":"postback",
                              "payload":"PAYBILL_PAYLOAD"
                          },
                          {
                              "title":"History",
                              "type":"postback",
                              "payload":"HISTORY_PAYLOAD"
                          },
                          {
                              "title":"Contact Info",
                              "type":"postback",
                              "payload":"CONTACT_INFO_PAYLOAD"
                          }
                      ]
                  },
                  {
                      "type":"web_url",
                      "title":"Latest News",
                      "url":"http://petershats.parseapp.com/hat-news",
                      "webview_height_ratio":"full"
                  }
              ]
          },
          {
              "locale":"zh_CN",
              "composer_input_disabled":false
          }
      ]
  })

}


app.set('port', process.env.PORT || 3002);

server.listen(app.get('port'), function() {
  console.log("Chat bot server listening at");
});
