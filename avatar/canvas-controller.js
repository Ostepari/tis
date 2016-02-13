var getRandomInt = fabric.util.getRandomInt;

function getRandomNum(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Vrati nahodnu poziciu v canvase
 *
 * @method     getRandomLeftTop
 * @return     {Object}  vrati objekt s top a left suradnicami
 */
function getRandomLeftTop() {
  var offset = 100;
  return {
    left: fabric.util.getRandomInt(0 + offset, 400 - offset),
    top: fabric.util.getRandomInt(0 + offset, 400 - offset)
  };
}

/**
 * Dopln hex kod farby nulami zlava
 *
 * @method     pad
 * @param      {string}  str     vstupny kod farby
 * @param      {number}  length  dlzka
 * @return     {string}  spravny kod farby
 */
function pad(str, length) {
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
}

/**
 * Nahodna farba
 *
 * @method     getRandomColor
 * @return     {<type>}  string s kodom nahodnej farby
 */
function getRandomColor() {
  var getRandomInt = fabric.util.getRandomInt;
  return (
    pad(getRandomInt(0, 255).toString(16), 2) +
    pad(getRandomInt(0, 255).toString(16), 2) +
    pad(getRandomInt(0, 255).toString(16), 2)
  );
}

/**
 * Vytvori trojuholnik v canvase s nahodnymi suradnicami
 *
 * @method     addTriangle
 */
addTriangle = function() {
  var coord = getRandomLeftTop();

  canvas.add(new fabric.Triangle({
    left: coord.left,
    top: coord.top,
    fill: '#' + getRandomColor(),
    width: 50,
    height: 50,
    opacity: 1
  }));
};

/**
 * Prida obrazok do canvasu
 *
 * @method     addImage
 * @param      {string}  imageName  nazov obrazka
 * @param      {<type>}  minScale   { description }
 * @param      {<type>}  maxScale   { description }
 */     
function addImage(imagePath, minScale, maxScale) {
    var coord = getRandomLeftTop();

    fabric.Image.fromURL(imagePath, function(image) {

      image.set({
        left: coord.left,
        top: coord.top,
        angle: getRandomInt(-10, 10)
      })
      .scale(getRandomNum(minScale, maxScale))
      .setCoords();

      canvas.add(image);
    });
  };

/**
 * Rasterizuje canvas do formatu JSON
 *
 * @method     rasterizeJSON
 * @return     {string}  canvas rasterizovany vo formate JSON
 */
rasterizeJSON = function() {
  return JSON.stringify(canvas);
};

/**
 * Nacita udaje vo formate json a zobrazi ich v canvase
 *
 * @method     loadJSON
 * @param      {string}  json    ulozeny string vo formate json
 */
loadJSON = function(json) {
  canvas.loadFromJSON(json, function(){
    canvas.renderAll();
  });
};

/**
 * Posunie vyznaceny objekt pod dalsi objekt
 *
 * @method     sendBackwards
 */
sendBackwards = function() {
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.sendBackwards(activeObject);
  }
};

/**
 * Posunie vyznaceny objekt nad dalsi objekt
 *
 * @method     bringForward
 */
bringForward = function() {
  var activeObject = canvas.getActiveObject();
  if (activeObject) {
    canvas.bringForward(activeObject);
  }
};

/**
 * Zmaze oznaceny objekt v canvase
 *
 * @method     deleteSelected
 */
deleteSelected = function() {
  var activeObject = canvas.getActiveObject();
  if (activeObject) canvas.remove(activeObject);
  return;
}

deleteAll = function() {
  if (confirm('Naozaj chcete zmazať celú plochu?')) {
    canvas.clear();
  } else {
  }
}