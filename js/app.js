function num2letter( number ){
    if (number == 0) {
        return "A";
    } else if (number == 1) {
        return "B";
    } else if (number == 2) {
        return "C";
    } else {
        return "D";
    }
}
// ...
function createList( arrayJson ) {
    var questions = arrayJson.questions;

    var list = '<ul class="ulTop list-group">';
    var letter = '';
    for (var n=0; n < questions.length ; n++) {
        list += '<li class="liTop list-group-item" data-li="'+n+'">';   
            list += '<ul class="ulMid list-group">';
                list += '<li class="liMed title list-group-item">';
                    list += '<div class="row">';
                        list += '<div class="col-1 text-center align-items-center justify-content-center d-inline-flex">';
                            list += parseInt(n+1, 10);
                        list += '</div>';
                        list += '<div class="col-9">';
                            list += questions[n].title;
                        list += '</div>';
                        list += '<div class="col-2">';
                            list += '<button type="button" class="btn btn-outline-primary w-100 h-100" data-question="'+ n +'">Verificar</button>';
                        list += '</div>';
                    list += '</div>';
                list += '<li class="liMed options">';
                    list += '<div class="list-group" data-select="'+n+'">';
                        for (var i = 0; i < questions[n].options.length; i++) {
                            list += '<button type="button" class="list-group-item list-group-item-action" value="'+ i +'">' + num2letter(i) + ': '+ questions[n].options[i] + '</button>';
                        }
                    list += '</div>';
                list += '</li>';
            list += '</ul>';
        list += '</li>';
    }
    list += '</ul>';
    $("#questions").append(list);
}
// ...
function getJson( nameFileJson ) {
    var result;
    $.ajax({
        dataType: "json",
        url: nameFileJson,  
        async: false,  
        success: function(data) {
            result = data; 
      }
    });
    return result;
}
// ...
function openFile(file) {
    var extension = file.substr( (file.lastIndexOf('.') +1) );
    switch(extension) {
        case 'json':
            return true;
        default:
            return false;
    }
};
// ...
function getListJson( baseFolder, filesJson ){
    console.log(">getListJson");
    var fileNames = new Array();
    for (var n=0; n < filesJson.length ; n++) {
        fileNames.push(baseFolder+filesJson[n]+".json");
    }
    return fileNames;
}
// ...
function createSelect( arrayJson ){
    console.log(">createSelect");
    var options = '<option value="title" selected>Select content</option>';
    for (var n=0; n < arrayJson.length ; n++) {
        courseUnit = getJson(arrayJson[n]).courseunit;
        options += '<option value="' + arrayJson[n] + '">' + courseUnit + '</option>';
    }
     $("#select").append(options);
}
// ...
$(document).ready(function(){

    var arrayJson;
    // ...
    $(document).on('click','.btn', function() {
        let questionNumber = $(this).data('question');
        let correctOption = arrayJson.questions[questionNumber].result;
        $("li[data-li="+questionNumber+"] li.options div button[value="+correctOption+"]").addClass( "optionCorrect" );
    });
    // ...
    $(document).on("change","#select",function(){
        let nameJson = $(this).val();
        $("#questions").empty();
        if (nameJson != 'title'){
            arrayJson = getJson(nameJson);
            createList(arrayJson);            
        }
    });

    base = 'https://raw.githubusercontent.com/jvsouza/ANAC-Avionic/main/json/';
    filesJson = ['avi01'];
    createSelect(getListJson(base, filesJson));

});
