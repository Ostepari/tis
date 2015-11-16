/*

Hlavny informacny panel MMC

*/


function Headblock () {//{{{
  var self = this;

  var wsz = window.getSize ();
  var root = this.root = new Element ('div');
  root.setStyles ({'position': 'absolute', 'top': 0, 'left': 0, 'visibility':'hidden', 
                   'padding': '7px', 'padding-right':'27px', 'background-color': '#FBD52B',
                 //'border-radius': '0px 0px 10px 10px', 'box-shadow': '10px 10px 15px'});
                   'border-radius': '0px 0px 10px 10px', 'box-shadow': '10px 10px 1px 0px rgba(0, 0, 0, 0.5)', 'border': '2px solid #000000'});
  var p = Asset.image ('obrazky/MC_s.png', {alt:'Multimediálna čítanka', onload: function () {
        self.onResize (); 
      }});
  root.appendChild (p);
  document.body.appendChild (root);
  disableSelection (root);
  root.pin ();
  //var sz = root.getSize ();
  root.setStyles ({'left': (wsz.x - (7+7+2+2+396) )/2, 'visibility':'visible'});
  $(window).addEvents ({
    'resize': function () {self.onResize ()}
  });

}//}}}
Headblock.prototype.onResize = function () {//{{{
  var wsz = window.getSize ();
  var sz = this.root.getSize ();
  this.root.setStyles ({'left': (wsz.x - sz.x)/2});
}//}}}


