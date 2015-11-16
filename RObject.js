/*

RObject - okienkovy framework pre mmcitanka.sk.

Marek Nagy.

*/


/*
  RObject zakladny zobrazovaci objekt
*/
var RObject;
(function (){//{{{
  RObject = RObject0;

  // Zobrazene RObjekty v danom poradi ako v poli. Vhodne na urcovanie zmeny fokusu, poradia, ...
  var RObjects = [];
  // Ulozene udalosti, aby sa nezmenilo ich poradie. {type:, robj:, arg:}
  var events_queue = [];

function flush_events_queue () {//{{{
  while (events_queue.length > 0) {
    //console.log (events_queue.length);
    var e = events_queue.shift ();
    switch (e.type) {
      case 'select': if (e.robj.select) e.robj.select (); break;
      case 'unselect': 
        if (e.robj.unselect) e.robj.unselect ();
        if (e.robj.unselect2) e.robj.unselect2 (); //TODO 2015.07.30. toto uz nebude treba
        break;
      case 'gselect': if (e.robj.gselect) e.robj.gselect (e.arg); break;
      case 'gunselect': if (e.robj.gunselect) e.robj.gunselect (e.arg); break;
    }
  }
}//}}}


function RObject0 () {//{{{
  var self = this;
/*
  0 - vseobecne okna
  1 - okno pribehu
  2 - okno otazky pri editovani
  3 - okno editovania udajov uzivatela, skupiny, zadania
  4 - vlastne okno/a aktivity
  5 - nastroje pracujuce nad textom pribehu (kurzory)
*/
  self.group = 0; // nastav identifikator skupiny

  // Objekt s konfiguraciou
  self.cfg = {};

  self.hidden = true;
  self.root = null;
  //Nie vzdy je to vhodne
  //self.root = new Element ('div');
  //self.root.addEvent ('mousedown', function () { self.bring_to_front (); });

  // eventy so svojimi callback-mi
  this.events = {};

}//}}}
RObject0.prototype.show = function () {//{{{
  if (this.hidden) {
    var i, all = RObjects, j;
    if (all.length > 0) events_queue.push ({type:'unselect', robj: all[0]});

    // find first window in same group
    for (j = 0; j < all.length && all[j].group != this.group; j++);
    if (j < all.length) events_queue.push ({type:'gunselect', robj: all[j], arg:false});

    events_queue.push ({type:'gselect', robj: this, arg:(j >= all.length)});
    events_queue.push ({type:'select', robj: this});

    // add this window on top position in array
    all.unshift (this);

    // Dodatocne unselect, aby bolo v nom mozne zavolat funkciu hide
    //if (all[1] && all[1].unselect2 !== undefined) all[1].unselect2 ();

    if (this.root) document.body.appendChild (this.root);
    this.hidden = false;
    
    flush_events_queue ();
  }

  // Akokeby sa zmenili vsetky nastavene hodnoty na tie iste
  //if (this.change_cfg_post !== undefined && !this.hidden) this.change_cfg_post ();
  return this;
}//}}}
RObject0.prototype.hide = function () {//{{{
  // Akokeby budem menit vsetky hodnoty, ktore su uz nastavene. Nech sa vsetko prepojenie a eventy zrusia.
  //if (this.change_cfg_pre !== undefined && !this.hidden) this.change_cfg_pre ();

  if (!this.hidden) {
    var all = RObjects;
    var i = all.indexOf (this), j = all.length;

    if (i >= 0) { 
      if (i == 0) events_queue.push ({type:'unselect', robj: this});

      // Is this window the first in group?
      for (j = i - 1; j >= 0 && all[j].group != this.group; j--);

      if (j < 0) {// yes, this window is the first in its group
        // check if this window is last in group
        for (j = i + 1; j < all.length && all[j].group != this.group; j++);

        events_queue.push ({type:'gunselect', robj: this, arg: (j >= all.length)});

        // new group leader window
        if (j < all.length) events_queue.push ({type:'gselect', robj: all[j], arg:false});
      }

      // if it is on top then select second window
      if (i == 0 && all.length > 1) events_queue.push ({type:'select', robj: all[1]});

      // remove i-th item from array
      all.splice (i, 1);
    }

    if (this.root) document.body.removeChild (this.root);
    this.hidden = true;

    flush_events_queue ();
  }

  return this;
}//}}}
RObject0.prototype.bring_to_front = function () {//{{{
  var all = RObjects; 
  var i = all.indexOf (this), j;
  if (i > 0) {
    events_queue.push ({type:'unselect', robj: all[0]});

    // find first window in same group
    for (j = 0; j < i && all[j].group != this.group; j++);
    if (j < i) {
      events_queue.push ({type:'gunselect', robj: all[j], arg:false});
      events_queue.push ({type:'gselect', robj: this, arg:false});
    }

    events_queue.push ({type:'select', robj: this});

    // move windows in array
    for (; i > 0; i--) all[i] = all[i-1];
    all[0] = this;

    // Dodatocne unselect, aby bolo v nom mozne zavolat funkciu hide
    //if (all[1].unselect2 !== undefined) all[1].unselect2 ();
  }

  if (this.root) BringTopScroll (this.root); // pozor strati sa propagovanie udalosti k detom. (Pri prvom kliknuti.)

  flush_events_queue ();

  return this;
}//}}}
// Zisti, ci je objekt na vrchu
RObject0.prototype.is_first = function () {//{{{
  if (this.hidden) return false;
  var all = RObjects; 
  return (0 < all.length && all[0] == this)
}//}}}
// Zisti, ci je objekt vramci skupiny prvy. Vhodne v kombinacii s gselect(), gunselect(), ktore by sa pri bring_to_front() nevykonali
RObject0.prototype.is_gfirst = function () {//{{{
  if (this.hidden) return false;
  var all = RObjects; 
  for (var j = 0; j < all.length && all[j].group != this.group; j++); // zastane na prvom okne v skupine (prinajhorsom na 'this' okne)
  return (j < all.length && all[j] == this)
}//}}}
RObject0.prototype.destroy = function () {//{{{
  this.hide ();
  if (this.root) this.root.destroy (); // zrusit vsetky elementy -> garbage collection
  // teraz uz nie su ziadne callback vyrobene objekty funkcii, t.j. nie je potrebne drzat hodnoty self premennych
  // t.j. na tento onjekt uz nic neukazuje
};//}}}

// Zmena konfiguracie, volane metody pre, post. Ak nie je hodnota v cfg0, ponecha sa povodna
RObject0.prototype.change_cfg = function (cfg0) {//{{{
  // Zistit ci nastala zmena v konfiguraci
  var change = false;
  for (c in cfg0) {
    if (this.cfg[c] === undefined || this.cfg[c] != cfg0[c]) change = true;
  }
  //console.log (this.name+': change=' + change);
  //console.log (this.cfg);
  if (change) {

    // Mali by sa zrusit vsetky eventy a prepojenia, aby mohla nastupit nova konfiguracia
    if (this.change_cfg_pre !== undefined) this.change_cfg_pre (cfg0);

    // Zmena hodnot konfiguracie
    for (c in cfg0) this.cfg[c] = cfg0[c];

    // Uz je nova konfiguracia. Vytvoria sa podla nej vsetky eventy a prepojenia
    if (this.change_cfg_post !== undefined) this.change_cfg_post (cfg0);
  }
  //console.log (this.cfg);
  return this;
};//}}}

RObject0.prototype.check_pos = function (p) {//{{{
  // left, top sa beru od margin-u.
  if (this.root && !this.hidden) {
    var w = window.innerWidth, h = window.innerHeight;
    // Rozmer elementu aj s padding-om a border-om, t.j. bez margin-u
    var s = this.root.style;
    var sw = this.root.offsetWidth, sh = this.root.offsetHeight;
    var nw = ['marginLeft', 'marginRight'];
    var nh = ['marginTop', 'marginBottom'];
    for (var i = 0; i < nw.length; i++) sw += Number (s[nw[i]].substr (0, s[nw[i]].length - 2)); // remove 'px'
    for (var i = 0; i < nh.length; i++) sh += Number (s[nh[i]].substr (0, s[nh[i]].length - 2)); // remove 'px'

    // Naprv poziciu laveho horneho rohu
    if (p.x < 0) p.x = 0;
    if (p.y < 0) p.y = 0;
    if (p.x > w) p.x = w;
    if (p.y > h) p.y = h;

    // Teraz este sirku
    if (p.x + sw > w) p.x = w - sw;
    if (p.y + sh > h) p.y = h - sh;
  }
}//}}}
RObject0.prototype.change_pos = function (x, y) {//{{{
  if (this.root) {
    var p = {x:x, y:y};
    this.check_pos (p);

    this.root.style.left = p.x + 'px';
    this.root.style.top = p.y + 'px';
  }
  return this;
}//}}}
RObject0.prototype.get_pos = function () {//{{{
  var x = 0, y = 0;
  if (this.root) {
    var s = this.root.style;
    x = Number (s.left.substr (0, s.left.length - 2)); // remove 'px'
    y = Number (s.top.substr (0, s.top.length - 2)); // remove 'px'
  }
  return {x:x, y:y};
}//}}}
RObject0.prototype.check_size = function (sz) {//{{{
  if (this.root && !this.hidden) {
    var w = window.innerWidth, h = window.innerHeight;
    var p = this.get_pos ();

    if (p.x + sz.x > w) sz.x = w - p.x;
    if (p.y + sz.y > h) sz.y = h - p.y;
  }
}//}}}
RObject0.prototype.change_size = function (w, h) {//{{{
  // Nastavuje sa velkost vnutorneho obsahu elementu, ale testuje sa, ci sa zmesti cely aj s okrajmi ...
  if (this.root) {
    var s = this.root.style, vis = s.visibility;

    if (this.hidden) {
      s.visibility = 'hidden';
      document.body.appendChild (this.root);
    }

    var sz = {x:w, y:h};
    this.check_size (sz);

    var nw = ['marginLeft', 'marginRight', 'paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth'];
    var nh = ['marginTop', 'marginBottom', 'paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth'];
    for (var i = 0; i < nw.length; i++) sz.x -= Number (s[nw[i]].substr (0, s[nw[i]].length - 2)); // remove 'px'
    for (var i = 0; i < nh.length; i++) sz.y -= Number (s[nh[i]].substr (0, s[nh[i]].length - 2)); // remove 'px'

    if (sz.x <= 0) sz.x = 10;
    if (sz.y <= 0) sz.y = 10;

    s.width = sz.x + 'px';
    s.height = sz.y + 'px';
    // Pre dalsie prepocty je dolezitejsia velkost obsahu.
    if (this.change_size_add) this.change_size_add (sz.x, sz.y);

    if (this.hidden) {
      document.body.removeChild (this.root);
      s.visibility = vis;
    }
  }
  return this;
}//}}}
RObject0.prototype.get_size = function () {//{{{
  var x = 0, y = 0;
  if (this.root) {
    var s = this.root.style, vis = s.visibility;

    if (this.hidden) {
      s.visibility = 'hidden';
      document.body.appendChild (this.root);
    }

    //x = Number (s.width.substr (0, s.width.length - 2)); // remove 'px'
    //y = Number (s.height.substr (0, s.height.length - 2)); // remove 'px'

    var nw = ['width', 'marginLeft', 'marginRight', 'paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth'];
    var nh = ['height', 'marginTop', 'marginBottom', 'paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth'];
    for (var i = 0; i < nw.length; i++) x += Number (s[nw[i]].substr (0, s[nw[i]].length - 2)); // remove 'px'
    for (var i = 0; i < nh.length; i++) y += Number (s[nh[i]].substr (0, s[nh[i]].length - 2)); // remove 'px'

    if (this.hidden) {
      document.body.removeChild (this.root);
      s.visibility = vis;
    }
  }

  return {x:x, y:y};
}//}}}

RObject0.prototype.addEventListener = function (type, fn) {//{{{
// Prida funkciu k danemu eventu do pola
  if (this.events[type] === undefined) this.events[type] = [];
  // Ta ista funkcia bude pridana iba raz. Anonymne funkcie treba ustriehnut!!!
  var events = this.events[type];
  if (events.indexOf (fn) < 0) events.push (fn);
  return this;
}//}}}
RObject0.prototype.removeEventListener = function (type, fn) {//{{{
// Odoberie funkciu z daneho eventu
  var events = this.events[type];
  if (events) {
    var index = events.indexOf (fn);
    if (index >= 0) events.splice (index, 1);
  }
  return this;
}//}}}
RObject0.prototype.removeAllEventListeners = function (type) {//{{{
// Zrusi vsetky funkcie z eventov
  if (type) {
    if (this.events[type]) delete this.events[type];
  }
  else 
    this.events = {};
}//}}}
RObject0.prototype.sendEvent = function (type) {//{{{
  var events = this.events[type];
  //if (events) for (var i = 0; i < events.length; i++) events[i].call (this);
  // Umozni poslat vsetky argumenty (okrem prveho "type") volania tejto funkcie do listenerov.
  if (events) for (var i = 0; i < events.length; i++) events[i].apply (this, Array.prototype.slice.call (arguments, 1));
}//}}}
})();//}}}



/*
  Objekt realizujuci okno. Inspirovane TurtleWorldom.

  - okno sa vytvori a zrusi: constructor/destroy
  - okno sa moze zobrazit a skryt: show/hide
  - vsetky ukazane okna su registrovane v poli
  - okno moze ist do popredia: bring_to_front (bring_to_back, ...)
  - jedno okno je vrchne/vyselektovane o com dostava udalosti: select/unselect
  - okna su v skupinach oznacenych cislom. V ramci skupiny je najvrchnejsie okno vyselektovane o com dostane udalosti: gselect/gunselect
     gselect (is_first_added_to_group) / gunselect (is_last_removed_from_group)
*/
var RWindow;
(function (){//{{{
  (function () {//{{{
    function Tmp () {};
    Tmp.prototype = RObject.prototype;
    RWindow0.prototype = new Tmp ();
  })();//}}}
  RWindow = RWindow0;

  // Pohyb a resize okna
  chosen = null; var oX = 0, oY = 0, hnd, pos1, pos2, startdrag;
  $(window).addEvents({//{{{
    'mousemove': function (e) {
      if (chosen && (chosen.dragable || chosen.resizeable)) {
        if (chosen.resizeable && hnd > 0) {
          pos2 = e.page;
          // Myska je mimo okna?
          var ww = window.innerWidth, wh = window.innerHeight;
          var p = chosen.get_pos (), p1 = p;
          var s = chosen.get_size (), s1 = s;
          if (pos2.x < 0) pos2.x = 0; else if (pos2.x >= ww) pos2.x = ww - 1;
          if (pos2.y < 0) pos2.y = 0; else if (pos2.y >= wh) pos2.y = wh - 1;

          var dx = pos2.x - pos1.x;
          var dy = pos2.y - pos1.y;
          var dw, dh;
          switch (hnd) {
            case 1: dw = -dx; dh = -dy; break;
            case 2: dw = -dx; dh = dy; dy = 0; break;
            case 3: dw = dx; dh = -dy; dx = 0; break;
            case 4: dw = dx; dh = dy; dx = dy = 0; break;
          }
          if (s.x + dw > 100) { s.x += dw; p.x += dx; pos1.x = pos2.x;}
          if (s.y + dh > 70) { s.y += dh; p.y += dy; pos1.y = pos2.y;}
          chosen.change_pos (p.x, p.y);
          chosen.change_size (s.x, s.y);

          // Zisti sa o kolko sa skutocne okno posunulo
          var p2 = chosen.get_pos ();
          //pos1.x += p2.x - p1.x;
          //pos1.y += p2.y - p1.y;

          if (chosen.resize !== undefined) chosen.resize ();
        }
        else {
          if (startdrag) {
            chosen.root.setStyle ('opacity', 0.7);
            chosen.head.setStyle ('cursor', 'move');
            startdrag = false;
          }
          chosen.change_pos (e.page.x - oX, e.page.y - oY);
        }
      }
    },
    'mouseup': function (e) {
      if (chosen) {
        chosen.head.setStyle ('cursor', 'pointer');
        chosen.root.setStyle ('opacity', 1.0);

        enableSelection (chosen.root);
        chosen = null;
      }
    }
  });//}}}

  function RWindow0 (x, y, w, h, icon) {//{{{
    RObject.call (this);

    var self = this;

    this.dragable = true;
    this.resizeable = true;
    this.hidden = true;

    this.cfg.bgcolor = '#FBD52B';  //Farba okna
    this.cfg.selcolor = '#CBB50B'; //Farba listy pri vyselektovani

    var loadup_images = 1;
    var LoadUp = function () {//{{{
      loadup_images--;
      if (!loadup_images) {
        if (self.resize !== undefined) self.resize ();
      }
    }//}}}

    self.con;                     // content of window
    self.lab;                     // title of window
    //self.resize = function () {}  // when window size is changed

    //root        - cely <div/> okna
    //  head      - vrchny <div/>
    //    lab     - napis
    //  con       - spodny <div/>


    var root = this.root = new Element ('div');
    root.setStyles ({'top': y, 'left': x, 'padding': 0, 'margin': 0, 'position': 'absolute', 'z-index': 5,
                     'width':w, 'height': h, 'border': '2px solid #000000', 'background-color': this.cfg.bgcolor,
                     'border-radius': '10px', 'box-shadow': '10px 10px 1px 0px rgba(0, 0, 0, 0.5)'});

    var head = self.head = new Element ('div');
    head.setStyles ({'top':0, 'left':10, 'margin': 0, 'border':0, 'position': 'absolute',
                    'width':w-20, 'height': 24, 'cursor':'pointer',
                    'border-bottom': '1px solid black',
                    'background-color':this.cfg.bgcolor,
                    'padding': '0px'});
    root.appendChild (head);
    self.lab = new Element ('div'); // legend of window
    self.lab.setStyles ({'font-weight':'bold', 'height': 24, 'line-height': 24, 'overflow':'hidden'});
    head.appendChild (self.lab);

    var con = self.con = new Element ('div');
    con.setStyles ({'top':10 + 25, 'left':10, 'width':w-20, 'height': h-20 -25, 'position': 'absolute',
                    'overflow':'hidden', 'padding':'0px'});
    root.appendChild (con);

    var b;
    if (icon) {//{{{
      loadup_images++;
      b = Asset.image ('obrazky/'+icon, {alt:'icon', onLoad: LoadUp});
      b.setStyles ({'position':'absolute', 'left': 0, 'top': 0, 'visibility': 'visible'});
      head.appendChild (b);
      self.lab.setStyle ('margin-left', '30px');
    }//}}}
    // Button close {{{
    loadup_images++;
    self.Bclose = b = Asset.image ('obrazky/window-close.png', {alt:'Zatvor', title:'Zatvor', onLoad: LoadUp});
    b.setStyles ({'position':'absolute', 'right': 0, 'top': 0, 'visibility': 'hidden'});
    MakeButton (b);
    head.appendChild (b);
    //}}}
    // Button save {{{
    loadup_images++;
    self.Bsave = b = Asset.image ('obrazky/document-save.png', {alt:'Ulož', title:'Ulož', onLoad: LoadUp});
    b.setStyles ({'position': 'absolute', 'right': 24, 'top': 0, 'visibility':'hidden'});
    head.appendChild (b);
    MakeButton (b);
    //}}}
    // Button refresh {{{
    loadup_images++;
    self.Brefresh = b = Asset.image ('obrazky/view-refresh.png', {alt:'Obnov', title:'Obnov', onLoad: LoadUp});
    b.setStyles ({'position': 'absolute', 'right': 48, 'top': 0, 'visibility':'hidden'});
    head.appendChild (b);
    MakeButton (b);
    //}}}

    head.addEvents ({//{{{
      'mousedown': function (e) {
        if (self.dragable) {
          startdrag = true;
          pos1 = e.page;
          var pos = self.get_pos ();
          oX = e.page.x - pos.x; oY = e.page.y - pos.y;
          disableSelection (self.root);
          chosen = self;
        }
      }
    });//}}}
    root.addEvents ({//{{{
      'mousedown': function (e) {
        self.bring_to_front ();
        hnd = self.chosen_handler (e.page);
        if (self.resizeable && hnd > 0) {
          pos1 = e.page;
          var pos = self.get_pos ();
          oX = e.page.x - pos.x; oY = e.page.y - pos.y;
          disableSelection (self.root);
          chosen = self;
        }
      },
      'mousemove': function (e) {
        if (self.resizeable) {
          var hnd = self.chosen_handler (e.page);
          switch (hnd) {
            case 1: self.root.setStyles ({'cursor': 'nw-resize'}); break;
            case 2: self.root.setStyles ({'cursor': 'sw-resize'}); break;
            case 3: self.root.setStyles ({'cursor': 'ne-resize'}); break;
            case 4: self.root.setStyles ({'cursor': 'se-resize'}); break;
            default: self.root.setStyles ({'cursor': 'default'}); break;
          }
        }
      }
    });//}}}

    root.pin ();
    // po pin() treba znovu umiestnit
    this.change_pos (x, y);


    LoadUp ();




    //TODO RNotebook
    //self.getPos = function () {return this.get_pos ();}

  }//}}}

  RWindow0.prototype.Done = function () {//{{{
    this.destroy ();
  }//}}}
  // Signaly danych udalosti
  RWindow0.prototype.select = function () {//{{{
    this.head.setStyle ('background-color', this.cfg.selcolor);
  }//}}}
  RWindow0.prototype.unselect = function () {//{{{
    this.head.setStyle ('background-color', this.cfg.bgcolor);
  };//}}}

  RWindow0.prototype.chosen_handler = function (p) {//{{{
    var hnd = 0;
    if (!this.hidden) {
      var r = 15;
      var pos = this.get_pos ();
      var sz = this.get_size ();
      var ox = p.x - pos.x; 
      var oy = p.y - pos.y;
      if (ox >= 0 && ox < r) {
        if (oy >= 0 && oy < r) hnd = 1;
        if (oy >= sz.y - r && oy < sz.y) hnd = 2;
      }
      if (ox >= sz.x - r && ox < sz.x) {
        if (oy >= 0 && oy < r) hnd = 3;
        if (oy >= sz.y - r && oy < sz.y) hnd = 4;
      }
    }
    return hnd;
  }//}}}
  RWindow0.prototype.change_size_add = function (w, h) {//{{{
    this.con.style.width = (w - 20) + 'px';
    this.con.style.height = (h - 20 - 25) + 'px';
    this.head.style.width = (w - 20) + 'px';
    this.head.style.height = 24 + 'px';
  }//}}}

  RWindow0.prototype.change_cfg_pre = function (cfg0) {//{{{
  }//}}}
  RWindow0.prototype.change_cfg_post = function (cfg0) {//{{{
    if (cfg0.bgcolor !== undefined) {
      this.root.setStyle ('background-color', this.cfg.bgcolor);
    }
    if (cfg0.selcolor !== undefined) {
      if (this.is_first ())    
        this.head.setStyle ('background-color', this.cfg.selcolor);
      else
        this.head.setStyle ('background-color', this.cfg.bgcolor);
    }
  }//}}}
})();//}}}

/*
  Zobrazenie obrazku ako prvku plochy.
*/
var RImage;
(function (){//{{{
  RImage = function (x, y, isrc) {
    RObject.call (this);
    //this.group = 5;

    var self = this;

    ro = this.root = new Element ('div');
    disableSelection (ro);
    ro.setStyles ({'z-index':'5'});
    ro.setStyles ({'position':'absolute', 'left': x, 'top': y});

    img = Asset.image (isrc);
    img.setStyles ({'position':'absolute', 'left':'0px', 'top':'0px', 'cursor':'pointer'});
    ro.appendChild (img);

    img.addEvents ({//{{{
      'mousedown': function () {
        self.bring_to_front ();
      }
    });//}}}
    new Drag.Move(ro, {'snap':0, 'container': window, 'handle':img, 'stopPropagation': false, //{{{
      'onStart': function(dg) {
        dg.setStyle ('opacity', 0.7);
        img.setStyles ({'cursor': 'move'});
      },          
      'onComplete': function(dg) {
        dg.setStyle ('opacity', 1.0);
        img.setStyles ({'cursor': 'pointer'});
      }
    });//}}}
  };
  (function () {//{{{
    function Tmp () {};
    Tmp.prototype = RObject.prototype;
    RImage.prototype = new Tmp ();
  })();//}}}

})();//}}}


/*
  Okno so strunou vlavo.
*/
var RNotebook;
(function (){//{{{

RNotebook = function (x, y, w, h) {//{{{{
  var self = this;

  RWindow.call (this, x, y, w, h); //zavola sa iny konstruktor na tento objekt.

  var spring, rsz = self.get_size ();

  self.spring = spring = new Element ('div');
  //spring.setStyles ({'top':10, 'left':-22, 'margin': 0, 'border':0, 'position': 'absolute',
  //                   'width':56, 'height': rsz.h-20,
  //                   'background-image':'url("obrazky/blok3a.png")', 'background-repeat': 'repeat-y'});
  spring.setStyles ({'top':2+24+1, 'left':-22 -2, 'margin': 0, 'border':0, 'position': 'absolute',
                    'width':56, 'height': rsz.y-27-27,
                    'background-image':'url("obrazky/blok3a.png")', 'background-repeat': 'repeat-y'});
  self.root.appendChild (spring);
  self.con.setStyles ({'left':10+34, 'width':rsz.x-20-34, 'height':rsz.y-20-25, 'overflow':'hidden', 
                      'font-size': '12pt', 'color': '#000000', 'background-color': '#FBD52B'});

  self.resize ();
};//}}}

(function () {//{{{
  function Tmp () {};
  Tmp.prototype = RWindow.prototype;
  RNotebook.prototype = new Tmp ();
})();//}}}

RNotebook.prototype.resize = function () {//{{{
  var self = this;

  rsz = self.get_size (); 
  if (self.spring) self.spring.setStyles ({'height': rsz.y-27-27});
  self.con.setStyles ({'width':rsz.x-20-34, 'height': rsz.y-20-25});

}//}}}
})();//}}}


/*
  Jednoduche okienko z informacnym textom.
*/
var RAlert;
(function (){//{{{
  (function () {//{{{
    function Tmp () {};
    Tmp.prototype = RWindow.prototype;
    RAlert0.prototype = new Tmp ();
  })();//}}}
  RAlert = RAlert0;

function RAlert0 () {//{{{
  var self = this;
  RWindow.call (this, 0, 0, 500, 200);

  this.type = 'none'; 
 
  this.change_cfg ({bgcolor:'rgb(253, 157, 135)', selcolor:'rgb(253, 157, 135)'});
  this.resizeable = this.dragable = false;
  this.root.setStyles ({'z-index':100});
  this.con.setStyles ({'overflow':'auto', 'font-weight':'normal'});
  this.head.setStyles ({'text-align':'center'});
  this.lab.set ('html','UPOZORNENIE');

  this.Bclose.setStyle ('visibility','visible');
  this.Bclose.addEvent ('click', function () {//{{{
    self.hide ();
  });//}}}
  this.unselect2 = function () {
    self.hide ();
  }
}//}}}
RAlert0.prototype.show = function () {//{{{
  var wsz = window.getSize ();
  this.change_pos ((wsz.x-500)/2, (wsz.y-200)/2);
  RObject.prototype.show.call (this);
  return this;
}//}}}
RAlert0.prototype.txt = function (txt) {//{{{
  this.con.set ('html', txt);
  return this;
}//}}}
})();//}}}



/*
  Spodne vyskakovacie menu

*/
function RMenu () {//{{{
  var self = this;

  var visible = 0;
  var wsz = window.getSize (), x = 140, y = wsz.y, w = wsz.x - 280, h = 70;
  var root = new Element ('div');
  this.root = root;
  root.setStyles ({//{{{
    'position': 'absolute', 'left': x, 'top': y, 'width': w, 'height': h, 'z-index': 60,
    'margin': '0px', 'padding': '10px',
    'border-radius': '0px 10px 0px 0px', 'border': '2px solid #000000',
    //'box-shadow': '5px 5px 10px',
    'box-shadow': '10px 10px 1px 0px rgba(0, 0, 0, 0.5)',
    'background-color': '#00AA00',
    'text-align':'left', 'vertical-align':'middle', 'white-space':'nowrap'
  });//}}} 
  disableSelection (root);

  var handle = new Element ('div');
  handle.setStyles ({//{{{
    'position': 'absolute', 'left': -2, 'top': -62, 'width': 60, 'height': 60,
    'margin': '0px', 'padding': '0px',
    'border-radius': '10px 10px 0px 0px', 'border': '2px solid #000000', 'border-bottom':'0px', 'box-shadow': '0px 0px 0px',
    'background-color': '#00AA00'
  });//}}}
  root.appendChild (handle);
  var p = Asset.image ('obrazky/kompas50.png', {alt:'obr'});
  p.setStyles ({//{{{
    'position': 'absolute', 'left': 5, 'top': 5
  });//}}}
  p.addEvents ({//{{{
    'mousedown': function (e) {
      visible = 1 - visible;
      y = wsz.y - visible*70
      if (visible) root.tween ('top', y); else root.tween ('top', y);
     }
  });//}}}
  MakeButton (p);
  handle.appendChild (p);

  document.body.appendChild (root);
  root.pin ();

  this.Open = function () {
    visible = 1;
    y = wsz.y - visible*70
    if (visible) root.tween ('top', y); else root.tween ('top', y);
  }

  $(window).addEvents ({//{{{
/*
    'mousemove': function (e) {
      var p = InRect (e.page, {x:x, y:y, w:w, h:h});
      if (p != visible) {
        visible = p;
        y = wsz.y - visible*70
        if (visible) root.tween ('top', y); else root.tween ('top', y);
      }
    },
*/
    'resize': function () {
      wsz = window.getSize ();
      y = wsz.y - visible*70
      w = wsz.x - 280;
      root.setStyles ({'left': x, 'top': y, 'width': w});
    }
  });//}}}
}//}}}
RMenu.prototype.Add = function (el) {//{{{
  this.root.appendChild (el);
  el.addClass ('icon');
  MakeButton (el);
}//}}}
RMenu.prototype.Rem = function (el) {//{{{
  if (el.getParent() == this.root) this.root.removeChild (el);
  el.removeClass ('icon');
}//}}}


/*
  Obrazok prenasledujuci kurzor
*/
function Cursor (dx, dy) {//{{{
/*
  dx, dy - offset prenasledovania kurzora
*/
  var self = this;
  self.sel = null; // aktualny nastroj
  var x, y; // actual mouse position
  var hnd = 0;
 
  this.Add = function (el) {//{{{
    if (self.sel != el) {
      self.Rem ();
      el.addClass ('tool');
      document.body.appendChild (el);
      el.pin ();
      self.sel = el;
      el.setStyle ('opacity', 1.0);
      el.setPosition ({'x':dx + x, 'y':dy + y});
      px = x; py = y;
  
      // Posun kurzora v intervaloch, aby nespomalil prehliadac
      hnd = setInterval (function () {
        if (self.sel) self.sel.setPosition ({'x':dx + x, 'y':dy + y});
      }, 100); // 30
    }
  }//}}}
  this.Rem = function (el) {//{{{
    if (self.sel && (el == undefined || self.sel == el)) {
      // Stopnutie posunu, aby zbytocne netikal
      if (hnd) {
        clearInterval (hnd);
        hnd = 0;
      }

      self.sel.unpin ();
      document.body.removeChild (self.sel);
      self.sel.removeClass ('tool');
      self.sel = null;
    }
  }//}}}

  $(document).addEvents ({//{{{
    'mousemove': function (e) {
      x = e.page.x; y = e.page.y;
      /*
      //if (self.sel && (Math.abs (px - x) > 10 || Math.abs (py - y) > 10)) {
      if (self.sel) {
        self.sel.setPosition ({'x':dx + x, 'y':dy + y});
        px = x; py = y;
      }
      */
    }
  });//}}}
}//}}}


/*
  Jednoduchy signalizator progresu. Do dokumentu sa vlozi this.root.
*/
function BarMeter () {//{{{
  this.root = new Element ('div');
  this.root.setStyles ({display:'inline-block', width:100, height:16, border:'1px solid black'});
  this.con = new Element ('div');
  this.con.setStyles ({display:'inline-block', 'background-color':'#0000FF', width:0, height:16});
  this.con.setProperty ('title', '0 %');
  this.root.appendChild (this.con);
}//}}}
BarMeter.prototype.set = function (percent) {//{{{
  if (percent === undefined || percent < 0) percent = 0;
  if (percent > 100) percent = 100;
  percent = Math.round (percent);
  this.con.setStyle ('width', percent+'px');
  this.con.setProperty ('title', percent+' %');
}//}}}


