var avatarSkladanie;

(function () {

  avatarSkladanie = function () {
    RWindow.call (this, 100, 90, 650, 353, 'avatar-skladanie-min.png');
    var self = this;

    this.change_cfg ({bgcolor:'rgb(164, 234, 164)', selcolor:'rgb(81, 218, 129)'});
    this.resizeable = false;
    this.dragable = true;
    this.lab.innerHTML = 'Vyskladaj si avatara';
    this.lab.style.textAlign = 'center';
    this.lab.style.marginLeft = '0px';

    ////////////////////////////////////////////////////
    self.con.innerHTML = '<canvas id="myCanvas" width="400" height="400" style="border:1px solid #c3c3c3;"></canvas>';
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
    });

  };

  (function (){
    function Tmp () {};
    Tmp.prototype = RWindow.prototype;
    avatarSkladanie.prototype = new Tmp ();
  })();

})();

///////////////////////////////////////////////////
avatarSkladanie.prototype.moja = function () {
  var canvas = new fabric.Canvas('myCanvas');

  // create a rectangle object
  var rect = new fabric.Rect({
    left: 100,
    top: 100,
    fill: 'red',
    width: 20,
    height: 20
  });
  //ukladanie objektov
  var json = JSON.stringify( canvas.toJSON() );
  console.log(json);
  
  // "add" rectangle onto canvas
  canvas.add(rect);
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
    this.lab.innerHTML = 'Vyskladaj si avatara';
    this.lab.style.textAlign = 'center';
    this.lab.style.marginLeft = '0px';

    ////////////////////////////////////////////////////
    self.con.innerHTML = '<canvas id="myCanvas" width="400" height="400" style="border:1px solid #c3c3c3;"></canvas>';
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
  var canvas = new fabric.Canvas('myCanvas');

  // create a rectangle object
  var rect = new fabric.Rect({
    left: 100,
    top: 100,
    fill: 'red',
    width: 20,
    height: 20
  });
  //ukladanie objektov
  var json = JSON.stringify( canvas.toJSON() );
  console.log(json);
  
  // "add" rectangle onto canvas
  canvas.add(rect);
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

