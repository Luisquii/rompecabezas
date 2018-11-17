//Construye el HTML correspondiente a un item de la lista y lo regresa como elemento del DOM
function buildItem(itemId, itemData){
    
}

/*
 Función que carga los items del archivo de configuración en la interfaz
Es el callback que se manda llamar al ejecutarse la carga del archivo de configuración
Recibe el contenido del archivo como parámetro, parseado a objeto de JS (JSON)
*/
function loadItems(data){
    
    //Iterar sobre los items, generar el elemento del DOM de cada uno con buildItem e insertarlo en el DOM para que se vea.
    
}

//Función que se ejecuta cuando el documento ya está cargado, a partir de aquí comienza la lógica
function documentLoaded(){
    //Comenzar por hacer la petición al archivo de configuración y mandar llamar el callback cuando esté lista
    doGet("./config/config.json",loadItems,null,"json");
}

