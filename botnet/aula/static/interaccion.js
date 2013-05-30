function aulas(){

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.open("POST","ajax_info.txt",true);
    document.write("<h1>This is a heading</h1>");
}

function otra(data){
    document.write("<h1>This is a heading</h1>");
    alert(data.message);
}