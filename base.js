/* (c) Marek Nagy

2011.07.27. Univerzalne pouzitelne funkcie. (potreba Mootools)
2011.08.10. Vylepsenie BringTop() a BringBack(). Presuvaju iba ak je nutne.

*/

// Modul inicialization 
(function () {//{{{
  //Asset.css ('base.css');
})();//}}}


//2014.02.09. kvoli IE9
if (window.console === undefined) {console = {log : function (txt) {}};}


function MakeButton (el) {// Blednutie tlacidla{{{
  if (el != null) {
    el.setStyle('opacity', 1.0);
    el.setStyles({'cursor': 'pointer'});
    el.addEvents ({
      'mouseover': function (e) { this.setStyle ('opacity', 0.6); },
      'mouseout': function (e) { this.setStyle ('opacity', 1.0); }
    });
  }
}//}}}

function BringTop (el) {// Preusporiadanie deti. Pozor strati sa propagovanie udalosti k detom (napr. mousedown)!!! {{{
// Nevhodne pre formulare.
// Jedna finta je zavesit el.focus() napr. na 'mouseup' a na 'mousedown' bude BringTop.
// Pri prvom kliknuti sa stratia eventy (element je odpojeny). Ale pri druhom kliknuti sa uz nic nepresuva t.j. eventy funguju

//  var par = el.getParent ();
  var par = el.parentNode;
  if (par && par.lastChild != el) {
    //par.removeChild (el);//2012.10.29. netreba, element sa presunie
    par.appendChild (el);
  }
}//}}}

function BringTopScroll (el) {// Uchovanie a obnovenie vsetkych scrollov  {{{

  var par = el.parentNode;
  if (par && par.lastChild != el) {
    var s = Array (), a;
    el.getElements ('.scroll').each (function (el1) {
      a = el1.getScroll ();
      a.el = el1;
      s.push (a);
    });

    //par.removeChild (el);//2012.10.29.
    par.appendChild (el);

    s.each (function (a) {
      a.el.scrollTo (a.x, a.y);
    });
  }
}//}}}

function BringBack (el) {// Preusporiadanie deti{{{
  //var par = el.getParent ();
  var par = el.parentNode;
  if (par.firstChild != el) {
    //par.removeChild (el);//2012.10.29. netreba
    par.insertBefore (el, par.firstChild);
  }
}//}}}

function InRect (a, b) {// Test ci sa nachadza v oblasti{{{
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return (0 <= dx && dx <= b.w && 0 <= dy && dy <= b.h);
}//}}}

function PlaceIn (root, el) {// Umiestnenie v ramci otca po resize-nuti{{{
  var p = root.getPosition ();
  var sz = root.getSize ();
  var p1 = el.getPosition ();
  var sz1 = el.getSize ();
  if (p1.x < p.x) p1.x = p.x;
  if (p1.x + sz1.x > p.x + sz.x) p1.x = p.x + sz.x - sz1.x;
  if (p1.y < p.y) p1.y = p.y;
  if (p1.y + sz1.y > p.y + sz.y) p1.y = p.y + sz.y - sz1.y;
  el.setPosition ({'x':p1.x, 'y':p1.y});
}//}}}


function disableSelectionOld (target) {// Nebude mozne vyznacovat mysou text{{{
  if (typeof target.onselectstart != "undefined") //IE route
    target.onselectstart = function() {return false}
  else if (typeof target.style.MozUserSelect != "undefined") //Firefox route
    target.style.MozUserSelect = "none"
  else //All other route (ie: Opera)
    target.onmousedown = function() {return false}
 //target.style.cursor = "default";
}//}}}
function disableSelection (target) {// Nebude mozne vyznacovat mysou text{{{
  target.addClass ('base_disSel');
}//}}}
function enableSelection (target) {// Nebude mozne vyznacovat mysou text{{{
  target.removeClass ('base_disSel');
}//}}}


// Redukcia pola o nedefinovanie hodnoty
Array.prototype.mn_clean = function () {//{{{
  for (var i = this.length - 1; i >= 0; i--) {
    if (this[i] === undefined) {
      this.splice(i, 1);
    }
  }
  return this;
}//}}}

getElementFullSize = function (elem) {//{{{
  var x = 0, y = 0;
  if (elem) {
    var s = elem.style;

    //x = Number (s.width.substr (0, s.width.length - 2)); // remove 'px'
    //y = Number (s.height.substr (0, s.height.length - 2)); // remove 'px'

    var nw = ['width', 'marginLeft', 'marginRight', 'paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth'];
    var nh = ['height', 'marginTop', 'marginBottom', 'paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth'];
    for (var i = 0; i < nw.length; i++) x += Number (s[nw[i]].substr (0, s[nw[i]].length - 2)); // remove 'px'
    for (var i = 0; i < nh.length; i++) y += Number (s[nh[i]].substr (0, s[nh[i]].length - 2)); // remove 'px'
  }

  return {w:x, h:y};
}//}}}

