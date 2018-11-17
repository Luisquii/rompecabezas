//Realiza una petición AJAX usando el método GET
function doGet(url,callback,data,responseType){

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {

        if( (this.readyState === 4) && ( (this.status === 200) || (this.status === 304) ) ){

            if(responseType === "json"){
                callback(JSON.parse(this.responseText));
            }
            else{
                callback(this.responseText);
            }
        }

    };

    if(data !== null){
        url = url + "?";
        for(var param in data){
            url += (param + data[param] + "&");
        }
        url = url.substring(0,(url.length-1));
    }

    xhttp.open("GET", url, true);
    xhttp.send();

}

//Realiza una petición AJAX usando el método POST
function doPost(url, data){

}

//Obtiene el valor de un parámetro de la URL
function getParameter(name){

    var parametersText = window.location.search.substring(1);
    var parameters = {};

    if(parametersText !== ""){
        var parametersListString = parametersText.split("&");

        for(var i=0; i<parametersListString.length; i++){
            var parameterComponents = parametersListString[i].split("=");
            parameters[parameterComponents[0]] = parameterComponents[1];
        }
    }

    return parameters[name];
}

//Devuelve un número aleatorio entre min y max
function randomInterval(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}
