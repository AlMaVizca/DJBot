function limpiar_contenido(nombre_nodo){
    nodo = document.getElementById(nombre_nodo);
    cantidad = nodo.childNodes.length
    for (var indice=0; indice<cantidad; indice++ ){
        nodo.removeChild(nodo.childNodes[0]);
    }
}


function aulas(data){
    var aula=document.getElementById("content-main");
    limpiar_contenido('content-main');
    descripcion = document.createElement( 'p');
    texto = document.createTextNode("A continuacion se presentan las aulas disponibles");
    descripcion.appendChild(texto);
    aula.appendChild(descripcion);
    for (var key in data){
        var un_aula = document.createElement( 'div' );
        titulo = document.createElement( 'h1' );
        titulo.appendChild(document.createTextNode(key));
        un_aula.appendChild(titulo);
        un_aula.appendChild(document.createTextNode('Red:' + data[key].red));
        un_aula.appendChild(document.createTextNode('/'+data[key].mascara));
        un_aula.className = 'aulas';
        aula.appendChild(un_aula);
        }
}
