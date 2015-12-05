// simulacia usera na realnom serveri
var Users = {
  currentLoggedIn: function () {
    return {id:0}
  }
}


var avatarData;
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
    '<div class=\"avatarMain\">',
    '<button id="pridajAvatara">Pridaj avatara</button>',
    '</div>'].join('\n');
    ////////////////////////////////////////////////////
    

    this.Bclose.style.visibility = 'visible';
    this.Bclose.addEventListener ('mousedown', function (e) {
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
      socket.emit('get zoznam tem', "test");
    });
    
    socket.on('zoznam tem', function(data) { 
      avatarSkladanie.prototype.zoznamTem = [];  
      data.forEach(function(theme) {
        avatarSkladanie.prototype.zoznamTem.push('<option data-img-src=\"' 
          + theme.thumbPath +'\" value=\"' + theme.id +'\">' + theme.name +'</option>');
      });
      avatarSkladanie.prototype.zoznamTem = avatarSkladanie.prototype.zoznamTem.join('\n');
      var element = document.getElementById("zoznamTemPridaj");
      if (element != null) {
        element.innerHTML = avatarSkladanie.prototype.zoznamTem;
      }
    }); 

    socket.on('avatar id a obrazky', function(data) {
      console.log(data.id);
      avatarData = data;
    }); 
    
  };

  (function (){
    function Tmp () {};
    Tmp.prototype = RWindow.prototype;
    avatarSkladanie.prototype = new Tmp ();
  })();
})();

///////////////////////////////////////////////////

avatarSkladanie.prototype.canvasJeInicializovany = false;
avatarSkladanie.prototype.moja = function () {
  
  document.getElementById("pridajAvatara").onclick = function () {
    var okno = new RWindow(100, 90, 830, 450, 'avatar-skladanie-min.png');
    okno.change_cfg ({bgcolor:'rgb(164, 234, 164)', selcolor:'rgb(81, 218, 129)'});
    okno.resizeable = false;
    okno.show();
    okno.lab.innerHTML = 'Admin - Pridaj avatara';
    okno.lab.style.textAlign = 'center';
    okno.lab.style.marginLeft = '0px';
    okno.Bclose.style.visibility = 'visible';

    okno.con.innerHTML = [
      '<div id=\"pridajAvataraOkno\">',
      ' <label for=\"nazovAvatara\">Názov avatara</label>',
      ' <input type=\"text\" id=\"nazovAvatara\"><br />', 
      '<hr />',
      '<b>Vyber temu</b>',
      '<br />',
      '<select class=\"image-picker show-labels show-html\" id="zoznamTemPridaj">',
      '</select>',
      '<hr>',
      '<button type=\"button\" id=\"vytvorAvatara\">Pokračovať</button><br>',
      '</div>'].join('\n');
    // pridaj zoznam tem
    document.getElementById("zoznamTemPridaj").innerHTML = avatarSkladanie.prototype.zoznamTem;;
    // TODO vytvorit horizontalny scroll na posuvanie tem...
    

    // vytvor selectovacie obrazky zo selectu
    jQuery("select.image-picker").imagepicker({
      show_label  : true
    });

    okno.Bclose.addEventListener ('mousedown', function (e) {
      okno.hide ();
      e.stopPropagation ();
    });

    var pridajAvataraOkno = document.getElementById("pridajAvataraOkno");
    document.getElementById("vytvorAvatara").onclick = function () {
      var nazovAvatara = document.getElementById('nazovAvatara').value;
      var e = document.getElementById("zoznamTemPridaj");
      var themeId = e.options[e.selectedIndex].value;
      // simulacia usera na realnom serveri
      var user = Users.currentLoggedIn();
      var data = {name: nazovAvatara, theme_id: themeId, user_id: user.id};
      socket.emit("pridaj avatara", data);

      var objekty = [];
      for (var i = 0; i < avatarData.objekty.length; i++) {
        var objekt = avatarData.objekty[i];
        console.log(objekt.path);
        objekty.push('<img src=\"'+ objekt.path +'\" onclick=\"addImage(\''+ objekt.path +'\', 0.1, 0.25)\" class=\"avatar-objekt\">');
      }
      objekty = objekty.join('\n');
      pridajAvataraOkno.innerHTML = [
        '<div id=\"avatar\">',
        '  <div id=\"canvasPanel\">',
        '    <div class=\"tool-wrapper\">',
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
        '  <div class=\"objekty\" div="avatarObjekty">',
        objekty,
        '  </div>',
        '</div>'].join('\n');
      
      // ak este nie je fabric.js inicializovany, tak ho inicializuj, inac nie
      if (!this.canvasJeInicializovany) {
        canvas = new fabric.Canvas('myCanvas');
        avatarSkladanie.prototype.canvasJeInicializovany = true;
      }
    }

    okno.Bclose.addEventListener ('mousedown', function (e) {
      // clear canvas on close
      canvas.clear();
      okno.hide ();
      e.stopPropagation ();
    });
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
    
    

    ////////////////////////////////////////////////////
    self.con.innerHTML = ['<div id=\"avatarAdminIndex\" style=\"display:block;\">',
'      <button type=\"button\" id=\"pridajTemu\">Pridat novu temu</button><br>',
'      Zoznam tem:', 
'      <ul id=\"avatarZoznamTem\"></ul>',
'      </div>'].join('\n');
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
      socket.on('zoznam tem', function(data) {
        var zoznamTem = [];
        zoznamTem.push('<ul id=\"avatarZoznamTem\">');
        data.forEach(function(theme) {
          zoznamTem.push('<li>' + theme.name + '</li>');
        });
        zoznamTem.push('</ul>');
        zoznamTem = zoznamTem.join('\n');
        document.getElementById("avatarZoznamTem").innerHTML = zoznamTem;
      });
      socket.emit('get zoznam tem', "test");
    });
    
    socket.on('zoznam tem', function(data) { 
      avatarAdmin.prototype.zoznamTem = [];  
      avatarAdmin.prototype.zoznamTem.push('<ul id=\"avatarZoznamTem\">');
        data.forEach(function(theme) {
          avatarAdmin.prototype.zoznamTem.push('<li>' + theme.name + '</li>');
        });
        avatarAdmin.prototype.zoznamTem.push('</ul>');
      avatarAdmin.prototype.zoznamTem = avatarAdmin.prototype.zoznamTem.join('\n');
      var element = document.getElementById("avatarZoznamTem");
      if (element != null) {
        element.innerHTML = avatarAdmin.prototype.zoznamTem;
      }
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
  var element = document.getElementById("avatarZoznamTem");
  if (element != null) {
    element.innerHTML = avatarAdmin.prototype.zoznamTem;
  }
  document.getElementById("pridajTemu").onclick = function () {
    var okno = new RWindow(120, 110, 650, 800, 'avatar-skladanie-min.png');
    okno.show();
    okno.lab.innerHTML = 'Admin - Pridaj temu';
    okno.lab.style.textAlign = 'center';
    okno.lab.style.marginLeft = '0px';
    okno.Bclose.style.visibility = 'visible';
    okno.con.innerHTML = ['<div id=\"nahravanieTem\">',
      '<label for=\"nazovTemy\">Názov témy</label>',
      '<input type=\"text\" id=\"nazovTemy\"><br />', 
      '<label for=\"thumbupload\">Náhľadový obrázok</label>',
      '<input id=\"thumbupload\" type=\"file\"/>',
      '<br />',
      '<label for=\"fileupload\">Obrázky</label>',
      '<input id=\"fileupload\" type=\"file\" multiple=\"multiple\" />',
      '<hr />',
      '<b>Obrázok náhľadu témy</b>',
      '<br />',
      '<br />',
      '<div id=\"thumbPreview\">',
      '</div>',
      '<hr />',
      '<b>Náhľad obrázkov</b>',
      '<br />',
      '<br />',
      '<div id=\"dvPreview\">',
      '</div>',
      '<hr />',
      '<button id="ulozTemu">Uložiť tému</button>',
      '</div>',
      '<div id="avatarResultMessage"></div>'].join('\n');
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
    var thumbUpload = document.getElementById("thumbupload");
    var thumbFile;
    thumbUpload.onchange = function () {
      if (typeof (FileReader) != "undefined") {
          var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;
          var dvPreview = document.getElementById("thumbPreview");
          dvPreview.innerHTML = "";
          var file = thumbUpload.files[0];
          if (regex.test(file.name.toLowerCase())) {
              var reader = new FileReader();
              reader.onload = function (e) {
                  var img = document.createElement("IMG");
                  img.height = "100";
                  img.width = "100";
                  img.src = e.target.result;
                  dvPreview.appendChild(img);
                  thumbFile = e.target.result;
              }
              reader.readAsDataURL(file);
          } else {
              alert(file.name + " nie je validný obrázok.");
              dvPreview.innerHTML = "";
              return false;
              }
          
      } else {
          alert("Tento prehliadač nepodporuje HTML5 FileReader.");
      }
    }

    document.getElementById("ulozTemu").onclick = function () {
      var nazovTemy = document.getElementById('nazovTemy').value;
      var resultMessage = document.getElementById('avatarResultMessage');
      if (nazovTemy == '' || objectFiles.length == 0 || thumbUpload.files.length == 0) {
        // ak nie je vyplneny niektory z inputov vypis chybu
        resultMessage.innerHTML = '<span class="errorMessage">Chyba! Nezadali ste názov témy alebo ste nenahrali žiadne obrázky</span>';
      } else {
        // inac posli data do server.js a refreshni okno
        var data = {name: nazovTemy, files: objectFiles, thumbFile: thumbFile};
        socket.emit('uloz temu', data);
        resultMessage.innerHTML = '<span class="successMessage">Téma bola úspešne uložená</span>';
        document.getElementById('nahravanieTem').innerHTML = ['<label for=\"nazovTemy\">Názov témy</label>',
          '<input type=\"text\" id=\"nazovTemy\"><br />', 
          '<label for=\"thumbupload\">Náhľadový obrázok</label>',
          '<input id=\"thumbupload\" type=\"file\"/>',
          '<br />',
          '<label for=\"fileupload\">Obrázky</label>',
          '<input id=\"fileupload\" type=\"file\" multiple=\"multiple\" />',
          '<hr />',
          '<b>Obrázok náhľadu témy</b>',
          '<br />',
          '<br />',
          '<div id=\"thumbPreview\">',
          '</div>',
          '<hr />',
          '<b>Náhľad obrázkov</b>',
          '<br />',
          '<br />',
          '<div id=\"dvPreview\">',
          '</div>',
          '<hr />',
          '<button id="ulozTemu">Uložiť tému</button>',].join('\n');
      }
      // zmaz resultMessage po nejakej dobe
      setTimeout(function(){
        resultMessage.innerHTML = '';
      }, 2000);
    };
  }
}