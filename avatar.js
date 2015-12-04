var avatarSkladanie;

(function () {

  avatarSkladanie = function () {
    RWindow.call (this, 100, 90, 830, 450, 'avatar-skladanie-min.png');
    var self = this;

    this.change_cfg ({bgcolor:'rgb(164, 234, 164)', selcolor:'rgb(81, 218, 129)'});
    this.resizeable = false;
    this.dragable = true;
    this.lab.innerHTML = 'Vyskladaj si avatara';
    this.lab.style.textAlign = 'center';
    this.lab.style.marginLeft = '0px';

    ////////////////////////////////////////////////////
    self.con.innerHTML = [
    '<div class=\"avatar\">',
    '  <div id=\"canvasPanel\">',
    '    <div class=\"tool-wrapper\">',
    '      <button type=\"button\" class=\"btn-default \" title=\"Pridať trojuholník\" onclick=\"addTriangle()\"><i class=\"fa fa-file\"></i></button>',
    '      <button type=\"button\" class=\"btn-default \" title=\"Posunúť vyššie\" onclick=\"bringForward()\"><i class=\"fa fa-plus-square\"></i></button>',
    '      <button type=\"button\" class=\"btn-default \" title=\"Posunúť nižšie\" onclick=\"sendBackwards()\"><i class=\"fa fa-minus-square\"></i></button>',
    '      <button type=\"button\" class=\"btn-default \" title=\"Zmazať objekt\" onclick=\"deleteSelected()\"><i class=\"fa fa-trash-o\"></i></button>',
    '      <button type=\"button\" class=\"btn-default \" title=\"Zmazať všetko\" onclick=\"canvas.clear()\"><i class=\"fa fa-times\"></i></button>',
    '      <button type=\"button\" class=\"btn-default \" title=\"Uložiť\" onclick=\"avatarUloz()\"><i class=\"fa fa-floppy-o\"></i></button>',
    '    </div>',
    '    <canvas id=\"myCanvas\" width=\"400\" height=\"350\">',
    '    Your browser does not support the HTML5 canvas tag.',
    '    </canvas>',
    '  </div>',
    '',
    '  <div class=\"objekty\">',
    '    <img src=\"upload/temy/1/eyes.png\" onclick=\"addImage(\'eyes.png\', 0.1, 0.25)\" class=\"avatar-objekt\">',
    '    <img src=\"upload/temy/1/nose.png\" onclick=\"addImage(\'nose.png\', 0.1, 0.25)\" class=\"avatar-objekt\">',
    '    <img src=\"upload/temy/1/usta.png\" onclick=\"addImage(\'usta.png\', 0.1, 0.25)\" class=\"avatar-objekt\">',
    '    <img src=\"upload/temy/1/usta2.png\" onclick=\"addImage(\'usta2.png\', 0.1, 0.25)\" class=\"avatar-objekt\">',
    '  </div>',
    '</div>'].join('\n');
    ////////////////////////////////////////////////////
    

    this.Bclose.style.visibility = 'visible';
    this.Bclose.addEventListener ('mousedown', function (e) {
      // clear canvas on close
      canvas.clear();

      self.hide ();
      menu.Add (self.ico);
      e.stopPropagation ();
    });


    this.ico = Asset.image ('obrazky/avatar-skladanie.png');
    menu.Add (this.ico);
    this.ico.addEventListener ('mousedown', function (e) {
      self.show ();
      menu.Rem (self.ico);
      e.stopPropagation ();
      
      // volame moju funkciu ktora z canvasu spravi fabric.js canvas
      self.moja();
    });

  };

  (function (){
    function Tmp () {};
    Tmp.prototype = RWindow.prototype;
    avatarSkladanie.prototype = new Tmp ();
  })();

})();

///////////////////////////////////////////////////

avatarSkladanie.prototype.jeInicializovane = false;
avatarSkladanie.prototype.moja = function () {
  // ak este nie je fabric.js inicializovany, tak ho inicializuj, inac nie
  if (!this.jeInicializovane) {
    canvas = new fabric.Canvas('myCanvas');
    avatarSkladanie.prototype.jeInicializovane = true;
    console.log(this.jeInicializovane);
  }
  
}
///////////////////////////////////////////////////

var avatarAdmin;

(function () {

  avatarAdmin = function () {
    RWindow.call (this, 100, 90, 650, 353, 'avatar-skladanie-min.png');
    var self = this;

    this.change_cfg ({bgcolor:'rgb(164, 234, 164)', selcolor:'rgb(81, 218, 129)'});
    this.resizeable = false;
    this.dragable = true;
    this.lab.innerHTML = 'Admin - Vyskladaj si avatara';
    this.lab.style.textAlign = 'center';
    this.lab.style.marginLeft = '0px';
    
    var zoznamTem = [];
    socket.on('zoznam tem', function(data){
      zoznamTem.push('<ul id=\"avatarZoznamTem\">');
      data.forEach(function(theme) {
        zoznamTem.push('<li>' + theme.name + '</li>');
      });
      zoznamTem.push('</ul>');
      zoznamTem = zoznamTem.join('\n');
    });

    ////////////////////////////////////////////////////
    self.con.innerHTML = ['<div id=\"avatar-admin-index\" style=\"display:block;\">',
'      <button type=\"button\" id=\"pridajTemu\">Pridat novu temu</button><br>',
'      Zoznam tem:', 
'      <ul id=\"avatarZoznamTem\"></ul>',
'      </div>',
'      <div id=\"avatar-admin-pridaj\" style=\"display:none;\"></div>'].join('\n');
    ////////////////////////////////////////////////////
    

    this.Bclose.style.visibility = 'visible';
    this.Bclose.addEventListener ('mousedown', function (e) {
      self.hide ();
      menu.Add (self.ico);
      e.stopPropagation ();
    });


    this.ico = Asset.image ('obrazky/avatar-admin.png');
    menu.Add (this.ico);
    this.ico.addEventListener ('mousedown', function (e) {
      self.show ();
      menu.Rem (self.ico);
      e.stopPropagation ();
      
      // zobrazime zoznam tem
      self.moja();
      document.getElementById("avatarZoznamTem").innerHTML = zoznamTem;
    });

  };

  (function (){
    function Tmp () {};
    Tmp.prototype = RWindow.prototype;
    avatarAdmin.prototype = new Tmp ();
  })();

})();

///////////////////////////////////////////////////
avatarAdmin.prototype.moja = function () {
  
  document.getElementById("pridajTemu").onclick = function () {
    var okno = new RWindow(120, 110, 650, 500, 'avatar-skladanie-min.png');
    okno.show();
    okno.lab.innerHTML = 'Admin - Pridaj temu';
    okno.lab.style.textAlign = 'center';
    okno.lab.style.marginLeft = '0px';
    okno.Bclose.style.visibility = 'visible';
    okno.con.innerHTML = ['<label for=\"nazovTemy\">Názov témy</label>',
      '<input type=\"text\" id=\"nazovTemy\"><br />', 
      '<input id=\"fileupload\" type=\"file\" multiple=\"multiple\" />',
      '<hr />',
      '<b>Náhľad obrázkov</b>',
      '<br />',
      '<br />',
      '<div id=\"dvPreview\">',
      '</div>',
      '<hr />',
      '<button id="ulozTemu">Uložiť tému</button>'].join('\n');
    okno.Bclose.addEventListener ('mousedown', function (e) {
      okno.hide ();
      e.stopPropagation ();
    });

    var fileUpload = document.getElementById("fileupload");
    var objectFiles = [];
    fileUpload.onchange = function () {
      if (typeof (FileReader) != "undefined") {
          var dvPreview = document.getElementById("dvPreview");
          dvPreview.innerHTML = "";
          var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;
          for (var i = 0; i < fileUpload.files.length; i++) {
              var file = fileUpload.files[i];
              if (regex.test(file.name.toLowerCase())) {
                  var reader = new FileReader();
                  reader.onload = function (e) {
                      var img = document.createElement("IMG");
                      img.height = "100";
                      img.width = "100";
                      img.src = e.target.result;
                      dvPreview.appendChild(img);
                      objectFiles.push(e.target.result);
                  }
                  reader.readAsDataURL(file);
              } else {
                  alert(file.name + " nie je validný obrázok.");
                  dvPreview.innerHTML = "";
                  return false;
              }
          }
      } else {
          alert("Tento prehliadač nepodporuje HTML5 FileReader.");
      }
    }
    document.getElementById("ulozTemu").onclick = function () {
      var nazovTemy = document.getElementById('nazovTemy').value;
      var data = {name: nazovTemy, files: objectFiles};
      socket.emit('uloz temu', data);
      // TODO ak sa podarilo ulozit tak zavriet okno alebo nieco napisat
    };
  }

}