function limpiar_contenido(nodo){
    cantidad = nodo.childNodes.length
    for (var indice=0; indice<cantidad; indice++ ){
        nodo.removeChild(nodo.childNodes[0]);
    }
}

function titulo(una_descripcion){
    var principal=document.getElementById("content-main");
    limpiar_contenido(principal);
    descripcion = document.createElement( 'p');
    texto = document.createTextNode(una_descripcion);
    descripcion.appendChild(texto);
    principal.appendChild(descripcion);
    return principal
    }

function aulas(datos){
    aula = titulo('Lista de aulas:');
    for (var clave in datos){
        var un_aula = document.createElement( 'div' );
        escribir_nombre = document.createElement( 'h1' );
        escribir_nombre.appendChild(document.createTextNode(clave));
        un_aula.appendChild(escribir_nombre);
        un_aula.appendChild(document.createTextNode('Red:' + datos[clave].red));
        un_aula.appendChild(document.createTextNode('/'+datos[clave].mascara));
        un_aula.className = 'acciones';
        aula.appendChild(un_aula);
        }
}

function resultado(datos){
    aula = titulo('Ejecuciones:');
    alert(aula);
    for (var clave in datos){
        var un_aula = document.createElement( 'div' );
        escribir_nombre = document.createElement( 'h1' );
        escribir_nombre.appendChild(document.createTextNode(clave));
        un_aula.appendChild(escribir_nombre);
        un_aula.appendChild( document.createTextNode('Instrucciones:' +
            datos[clave].instrucciones));
        un_aula.className = 'acciones';
        aula.appendChild(un_aula);
        }
}