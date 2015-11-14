/**
 * Vrati nahodnu poziciu v canvase
 *
 * @method     getRandomLeftTop
 * @return     {Object}  vrati objekt s top a left suradnicami
 */
function getRandomLeftTop() {
  var offset = 50;
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
    opacity: 0.8
  }));
};