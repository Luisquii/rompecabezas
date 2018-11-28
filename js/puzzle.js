//Variable que almacena el elemento del DOM que contiene las piezas del rompecabezas
var puzzleContainer;
//Variable que almacena la imagen a cargar
var imageObj = new Image();
//Guarda las piezas generadas y ordenadas
var pieces = [];
//guarda las piezas generadas mezcladas
var mixedPieces = [];
//Número de piezas
var piecesNumber = null;
var firstPiece = null;
var secondPiece = null;
var temp = null;
var tiempo = null;
var piezas = null;
var ganador = new Audio('./victory.mp3');
var perdido = new Audio('./lose.mp3');
/*
get the value from the get
*/
fetch('./config/config.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(JSON.stringify(myJson));
  });

/*
 Función que obtiene los dos divisores más grandes del número de piezas para distribuirlas en
una cantidad similar de renglones y columnas
Calcula el tamaño de la pieza en función de la cantidad de renglones y columnas calculados
 */
function getPieceSize(){

    var prevDivider = 1;
    var rows;
    var cols;
    var width;
    var height;

    if( (Math.sqrt(piecesNumber) % 1) === 0 ){
        rows = Math.sqrt(piecesNumber);
        cols = rows;
    }
    else{

        for(var i=2; i<=piecesNumber; i++){

            if( (piecesNumber % i) === 0 ){

                if( (i * prevDivider) === piecesNumber ){
                    //Encontré el número
                    rows = i;
                    cols = prevDivider;
                    break;
                }
                else{
                    prevDivider = i;
                }

            }

        }

    }

    width = imageObj.width/cols;
    height = imageObj.height/rows;

    return {
        "width" : width,
        "height" : height,
        "rows" : rows,
        "cols" : cols
    };

}


function pieceSelected(event){
    console.info("click", event.target.id);
    console.info("parent", event.target.parentElement.id);
    if(firstPiece === null){
        firstPiece = event.target;
    }
    else{
        secondPiece = event.target;
        var container2 = secondPiece.parentElement;
        var container1 = firstPiece.parentElement;
        if(((container2.id.split("_")[1] == secondPiece.id.split("_")[1]) && (container2.id.split("_")[2] == secondPiece.id.split("_")[2])) || ((container1.id.split("_")[1] == firstPiece.id.split("_")[1]) && (container1.id.split("_")[2] == firstPiece.id.split("_")[2])))
        window.alert("Movimiento No Valido: Alguna de las piezas ya se encuentra bien posicionada");
        else{
        container2.replaceChild(firstPiece, secondPiece);
        container1.appendChild(secondPiece);
        }
        firstPiece = null;
        secondPiece = null;
        }
    }

function checkwinner(){
  var acum = 0;
  var goal = mixedPieces.length * mixedPieces[0].length;
     for(var i=0; i< mixedPieces.length;i++){
       for(var j=0; j< mixedPieces[i].length;j++){
         var lbl = "p_"+i+"_"+j;
         var foto = document.getElementById(lbl);
         var container3 = foto.parentElement;
         if(((container3.id.split("_")[1] == foto.id.split("_")[1]) && (container3.id.split("_")[2] == foto.id.split("_")[2])))
             {
             acum = acum + 1;
             }
     }
     }
    if (acum == goal)
      return true;
    else {
      return false;
    }
  }





/*
 Crea un elemento de tipo canvas con un fragmento de la imagen y lo devuelve.
La imagen, posición desde donde se inicia el fragmento y las dimensiones se pasan
como parámetros
 */
function createPiece(img, posX, posY, width, height){

    //Se crea y configura un elemento HTML de tipo canvas para guardar el fragmento de la imagen
    var piece = document.createElement("canvas");
    piece.width = width;
    piece.height = height;

    /*
    Se copia un fragmento de la imagen pasada como parámetro con las dimensiones pasadas como parámetro
    y recortada desde la posición pasada.
    */
    var context = piece.getContext("2d");
    context.drawImage(img, posX, posY, width, height, 0, 0, width, height);

    piece.addEventListener("click", pieceSelected);

    return piece;

}


/*
Divide la imagen el la cantidad determinada de piezas (de acuerdo a la configuración) de acuerdo
al ancho y alto calculados al optimizar el número de renglones y columnas.
Las piezas las almacena en dos arreglos de dos dimensiones (matrices):
++ pieces: guarda las piezas en las posiciones ordenadas correctamente. Sirve como referencia para comparar.
++ mixedPieces: guarda las piezas revueltas (mezcladas en posiciones), se inicializa ordenado y luego se revuelve.
*/
function generatePieces(){

	//Genera las piezas de acuerdo a la dimensión devuelta por getPieceSize() usando la función createPiece()

    var size = getPieceSize();
    var posX;
    var posY;

    console.info("imageSize", imageObj.width,imageObj.height);
    console.info("pieceSize", size);

    for(var i=0; i<size.rows; i++){

        posY = (i * size.height);
        pieces[i] = [];
        mixedPieces[i] = [];

        for(var j=0; j<size.cols; j++){

            posX = (j * size.width);

            var piece = createPiece(imageObj, posX, posY, size.width, size.height);
            piece.id = "p_" + i + "_" + j;
            pieces[i][j] = piece;
            mixedPieces[i][j] = piece;
        }

    }

    console.info("pieces", pieces);
    console.info("mixedPieces", mixedPieces);

}


/*
Función que toma la matriz de piezas guardada en mixedPieces y las revuelve.
mixedPieces originalmente tiene las piezas ordenadas, después de ejecutar la función
las piezas quedan en desorden dentro de la misma matriz.
*/
function mixPieces(){

    var newRow;
    var newCol;

    //Se puede recorrer la mitad de la matriz e intercambiar la pieza con otra en una posición aleatoria
    for(var i=0; i<mixedPieces.length; i++){

        for(var j=0; j<(Math.ceil(mixedPieces[i].length/2)); j++){

            newRow = randomInterval(0, mixedPieces.length-1);
            newCol = randomInterval(0, mixedPieces[i].length-1);

            var tempPiece = mixedPieces[newRow][newCol];
            mixedPieces[newRow][newCol] = mixedPieces[i][j];
            mixedPieces[i][j] = tempPiece;

        }

    }


}

/*
Función que toma el arreglo mixedPieces y coloca las piezas en la interfaz para que se
vean correctamente
*/
function buildBoard(){
    //Aquí deberás desarrollar la lógica para lograrlo. Las piezas deberían ir dentro del div con id "puzzle"
    //este elemento se encuentra guardado en la variable puzzleContainer.

    var container;

    for(var i=0; i<mixedPieces.length; i++){

        for(var j=0; j<mixedPieces[i].length; j++){

            container = document.createElement("div");
            container.id = "c_" + i + "_" + j;
            container.className = "pieceContainer";
            container.appendChild(mixedPieces[i][j]);

            puzzleContainer.appendChild(container);

        }

        puzzleContainer.appendChild(document.createElement("br"));

    }

}


/*
Función que se manda llamar como callback del request al archivo de configuración
Se encarga de leer la configuración de la imagen recibida como parámetro por GET y
ejecuta la lógica para generar el juego de acuerdo a su configuración
*/
function loadPuzzle(data){
    //Data contiene las configuraciones existentes leídas del archivo
    console.info(data);
    //Id de la imagen enviado por parámetro
    var imageId = getParameter("id");

    //console.info("id", imageId);

    //TODO: leer la configuración de la imagen y generar todo dinámicamente

    //Por ahora se usa una imagen y configuración estática


    //condicional que refiere a las imagenes
    switch(imageId) {
    case '1':
        imageObj.src = data.images.img_01.url;
        tiempo = data.images.img_01.time;
        piecesNumber = data.images.img_01.pieces;
        //imageObj.src = './img/beavis_butthead.jpg';
        break;
    case '2':
        imageObj.src = data.images.img_02.url;
        tiempo = data.images.img_02.time;
        piecesNumber = data.images.img_02.pieces;
        break;
    case '3':
        imageObj.src =  data.images.img_03.url;
        tiempo = data.images.img_03.time;
        piecesNumber = data.images.img_03.pieces;
        break;
    case '4':
        imageObj.src =  data.images.img_04.url;
        tiempo = data.images.img_04.time;
        piecesNumber = data.images.img_04.pieces;
        break;
    case '5':
        imageObj.src =  data.images.img_05.url;
        tiempo = data.images.img_05.time;
        piecesNumber = data.images.img_05.pieces;
        break;
    case '6':
        imageObj.src =  data.images.img_06.url;
        tiempo = data.images.img_06.time;
        piecesNumber = data.images.img_06.pieces;
        break;
    case '7':
        imageObj.src =  data.images.img_07.url;
        tiempo = data.images.img_07.time;
        piecesNumber = data.images.img_07.pieces;
        break;
    case '8':
        imageObj.src =  data.images.img_08.url;
        tiempo = data.images.img_08.time;
        piecesNumber = data.images.img_08.pieces;
        break;
    case '9':
        imageObj.src =  data.images.img_09.url;
        tiempo = data.images.img_09.time;
        piecesNumber = data.images.img_09.pieces;
          break;
    default:

    }


    imageObj.onload = function(){
        generatePieces();
        mixPieces();
        buildBoard();
        timerDown();
    };


    /*
    Una vez cargada la imagen (imageObj.onload), se manda llamar un callback con la lógica para:
    ++ Dividir la imagen en N piezas de X tamaño (la cantidad de piezas debería estar en la configuración)
    ++ Mezclar las piezas
    ++ Construir el tablero en la interfaz con las piezas revueltas
    Esto es prácticamente toda la inicialización del juego
    */

}

//Función que inicia la lógica de la aplicación una vez que el HTML está cargado
function documentLoaded(){

	puzzleContainer = document.getElementById("puzzle");
  doGet('./config/config.json', loadPuzzle, null, "json");
  doGet('./config/config.json', timerDown, null, "json")
    /*
     En esta parte se tiene que cargar el archivo de configuración
     La imagen se tendrá que cargar de acuerdo al parámetro pasado por GET en la URL
    Se tendrá que leer la configuración correspondiente en los datos del archivo y generar todo
    de acuerdo a ella.
    El parámetro de la url lo puedes obtener utilizando la función getParameter(nombre);
    */

    //TODO: Ejecutar el request y mandar llamar como callback la función loadPuzzle
    //loadPuzzle();
}

function timerDown(){
  // Poner el momento al que estamos contando
  // var minut = $_GET
var countDownDate = new Date().getTime();
countDownDate = countDownDate + (1000 * tiempo);

// Actualizar el conteo cada segundo
var x = setInterval(function() {

    // Obtener el tiempo en este momento
    var now = new Date().getTime();

    // Cuanto falta
    var distance = countDownDate - now;

    // La funcion gettime nos da el dato en milisegundos, entonces debemos transformarlos
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Debemos seleccionar que imprimir
    if (minutes < 1){
    document.getElementById("demo").innerHTML = "";
    document.getElementById("alerta").innerHTML = seconds + "s ";}
    else {
      document.getElementById("demo").innerHTML = minutes + "m " + seconds + "s ";
    }

    // Si el tiempo se acaba te dice que se acabo todo, ya perdiste, tlp
    if (distance < 0 ) {
      clearInterval(x);
      document.getElementById("alerta").innerHTML = "TIME'S UP";
      perdido.play();
      window.alert("PERDISTE!!! LOOSER!");
      window.location.replace("./index.html");
    }

    if(checkwinner() && distance > 0)
    {
      ganador.play();
      window.alert("Felicidades!!! Has Ganado!");
      //ganador.pause();
      window.location.replace("./index.html");
    }



}, 1000);

}
