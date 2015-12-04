var http = require('http');
var path = require('path');
var fs = require('fs');
var FileReader = require('filereader')

var mimeTypes = {
  '.js' : 'text/javascript',
  '.html': 'text/html',
  '.css' : 'text/css',
  '.png' : 'image/png',
  '.gif' : 'image/gif'
};

var server = http.createServer(function (request, response) {

  //var lookup = path.basename(decodeURI(request.url)) || 'index.html';
  // console.log(request.url);
  var d = request.url;
  d = d.substring(1, d.length);
  d = d || 'index.html';
  //var f = '' + lookup; 
  
  fs.exists(d, function (exists) {
    if (exists) {
      fs.readFile(d, function (err, data) {
        if (err) {response.writeHead(500); response.end('Server Error!'); return; }
        var headers = {'Content-type': mimeTypes[path.extname(d)]};
        response.writeHead(200, headers);
        response.end(data);
      });
      return;
    }
    response.writeHead(404); //no such file found!
    response.end();
  });

}).listen(8080);

var Sequelize = require('sequelize')
// database, user, password
var sequelize = new Sequelize('avatar', 'root', '')
//auth
//sequelize.authenticate().complete(function (err) {
// if (err) {
//    console.log('Chyba v spojeni s DB');
// } else {
//    console.log('Spojenie s DB uspesne');
// }
//});

// definicia tabuliek
var Theme = sequelize.define('Theme', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: Sequelize.STRING,
  thumbPath: Sequelize.STRING
})
var Avatar = sequelize.define('Avatar', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: Sequelize.STRING,
  json: Sequelize.TEXT,
  user_id: Sequelize.INTEGER,
  theme_id: Sequelize.INTEGER
})
var Objekt = sequelize.define('Objekt', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  path: Sequelize.STRING,
  order: Sequelize.INTEGER,
  theme_id: Sequelize.INTEGER
})
sequelize.sync();

// Sockety
var iom = require('socket.io').listen(server);

// Namespace pre sockety
var io = iom.of('/avatar');

// funkcia vytvori unikatny string
function uniqeString () {
  return (new Date()).getTime().toString();
}

// funkcia ulozi obrazok vo formate base64 do zvoleneho priecinka
function saveImg (img, path) {
  // strip off the data: url prefix to get just the base64-encoded bytes
  var data = img.replace(/^data:image\/\w+;base64,/, "");
  var buf = new Buffer(data, 'base64');
  fs.writeFile(path, buf);
}

io.on('connection', function(socket) {
  // query na zoznam vsetkych tem, ktore potom posleme klientovi
  Theme.findAll().then(function(themes) {
     socket.emit('zoznam tem', themes);
  });

  socket.on('avatarJSON', function(data) {
    Avatar.create({ name: 'test', json: data, user_id: 1, theme_id: 1 });
  });

  socket.on('uloz temu', function(data) {
    var objectPath = 'upload/temy/' + uniqeString();
    var thumbnailImgPath = objectPath + '/' + 'thumbnail.png';
    fs.mkdir(objectPath);
    saveImg(data.thumbFile, thumbnailImgPath);
    var files = data.files;
    Theme.create({ name: data.name, thumbPath: thumbnailImgPath} ).then(function(theme){      
      // prejdeme cele pole uploadnutych objektov (obrazkov)
      for (var i = 0; i < files.length; i++) {
        var imgFormat = '.png';
        var imgPath = objectPath + '/' + i + imgFormat;
        saveImg(files[i], imgPath);
        
        // nakoniec ulozime odkaz do databazy
        Objekt.create({ path: imgPath, order: 0, theme_id: theme.id });
      }
    });
  });
});

console.log("Server running at http://127.0.0.1:8080/");

