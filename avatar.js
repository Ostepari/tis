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
    '      <button type=\"button\" class=\"btn-default \" title=\"Uložiť\" ><i class=\"fa fa-floppy-o\"></i></button>',
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
  //ukladanie objektov
  var json = JSON.stringify( canvas.toJSON() );
  console.log(json);
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
    self.con.innerHTML = '<div id="avatar-admin-index" style="display:block;">\
      <button type="button" id="pridajTemu">Pridat novu temu</button><br>\
      Zoznam tem:\
      </div>\
      <div id="avatar-admin-pridaj" style="display:none;"></div>'
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
      
      // volame moju funkciu ktora z canvasu spravi fabric.js canvas
      self.moja();
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
  // vymeni obsah okna
  function SwapDivsWithClick(div1,div2) {
     d1 = document.getElementById(div1);
     d2 = document.getElementById(div2);
     if ( d2.style.display == "none" ) {
        d1.style.display = "none";
        d2.style.display = "block";
     }
     else {
        d1.style.display = "block";
        d2.style.display = "none";
     }
  }
  document.getElementById("pridajTemu").onclick = function () {
    SwapDivsWithClick("avatar-admin-index","avatar-admin-pridaj")
  };

}
///////////////////////////////////////////////////


var slimak;

(function () {
  slimak = function () {
    RImage.call (this, 10, 100, 'obrazky/snail150.png');

    var self = this;

    this.Bclose = Asset.image ('obrazky/window-close.png');
    this.root.appendChild (this.Bclose);
    this.Bclose.style.position = 'absolute';
    this.Bclose.style.left = '90px';
    this.Bclose.style.top = '10px';
    MakeButton (this.Bclose);



    this.Bclose.style.visibility = 'visible';
    this.Bclose.addEventListener ('mousedown', function (e) {
      self.hide ();
      menu.Add (self.ico);
      e.stopPropagation ();
    });

    this.ico = Asset.image ('obrazky/snail50.png');
    menu.Add (this.ico);
    this.ico.addEventListener ('mousedown', function (e) {
      self.show ();
      menu.Rem (self.ico);
      e.stopPropagation ();
    });
  };

  (function (){
    function Tmp () {};
    Tmp.prototype = RImage.prototype;
    slimak.prototype = new Tmp ();
  })();

})();

