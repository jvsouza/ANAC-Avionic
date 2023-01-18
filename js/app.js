/*
    https://stackoverflow.com/questions/42218699/chrome-violation-violation-handler-took-83ms-of-runtime
*/

// ...
var keyPass = '' ;
var questions_available = [];
const translate = false;
const sequence_language = ['br', 'en']
const letter_up = ["A", "B", "C", "D"];

const encrypted = true;
const baseUrl = 'https://raw.githubusercontent.com/jvsouza/ANAC-Avionic/main/json/';
//const baseUrl = 'http://localhost/ANAC-Avionic/json/';
//const baseUrl = 'http://localhost/ANAC-Avionic/json/no_encryption/';

const coursesUpdated = {
    "courses_updated":[
        {"file_json":"avi01", "course_unit":"01 - Fundamentals of Computing"},
        {"file_json":"avi02", "course_unit":"02 - Basic Electronics"},
        {"file_json":"avi03", "course_unit":"03 - Digital Electronics"},
        {"file_json":"avi04", "course_unit":"04 - Aircraft Electrical Systems"},
        {"file_json":"avi05", "course_unit":"05 - Electric Engine Starting And Ignition Systems"},
        {"file_json":"avi06", "course_unit":"06 - Electrical Protection Systems Against The Effects Of Ice, Rain And Fire"},
        {"file_json":"avi07", "course_unit":"07 - Communication and Navigation Systems"},
        {"file_json":"avi08", "course_unit":"08 - Avionics Instrumentation"}
    ]
};

// ...
function decryptText(encryptedText){
    let keyView = $("#encry_key").val();
    if ( encrypted ){
        let decryptedText = CryptoJS.AES.decrypt(encryptedText, keyView);
        return String(decryptedText.toString(CryptoJS.enc.Utf8));
    } else{
        return encryptedText;
    }
}

// ...
function createList() {
    let questions = questions_available.questions;
    if ( questions != null ){
        var list = '<ul class="ulTop list-group">';
        var letter = '';
        for (var n=0; n < questions.length ; n++) {
            list += '<li class="liTop list-group-item" data-li="'+n+'">';   
                list += '<ul class="ulMid list-group">';
                    list += '<li class="liMed title list-group-item">';
                        list += '<div class="row">';
                            list += '<div class="col-1 text-center align-items-center justify-content-center d-inline-flex"><label>';
                                list += parseInt(n+1, 10);
                            list += '</label></div>';
                            list += '<div class="col-9">';
                                    list += '<div class="titles_itens">';
                                        list += '<div class="titles_item">';
                                            list += '<div class="bandeira"><img src="img/flag_'+sequence_language[0]+'.png" /></div>';
                                            list += '<div class="title_text">';
                                                list += decryptText(questions[n].title[sequence_language[0]], keyPass);
                                            list += '</div>';
                                        list += '</div>';
                                        list += '<div class="titles_item traduzir">';
                                            list += '<div class="bandeira"><img src="img/flag_'+sequence_language[1]+'.png" /></div>';
                                            list += '<div class="title_text">';                                        
                                                list += decryptText(questions[n].title[sequence_language[1]], keyPass);
                                            list += '</div>';
                                        list += '</div>';
                                    list += '</div>';
                            list += '</div>';
                            list += '<div class="col-2">';
                                list += '<button type="button" class="btn btn-outline-primary w-100 h-100" data-question="'+ n +'"></button>';
                            list += '</div>';
                        list += '</div>';
                    list += '<li class="liMed options">';
                        list += '<div class="list-group" data-select="'+n+'">';
                            for (var i = 0; i < questions[n].options["br"].length; i++) {
                                list += '<button type="button" class="list-group-item list-group-item-action button_itens" value="'+ i +'">';
                                    list += '<div class="letter_up">' + letter_up[i] + '</div>';
                                    list += '<div class="questions_itens">';
                                        list += '<div class="question_item"><div class="bandeira"><img src="img/flag_'+sequence_language[0]+'.png" /></div><div class="question_text">' + decryptText(questions[n].options[sequence_language[0]][i], keyPass) + '</div></div>';
                                        list += '<div class="question_item traduzir"><div class="bandeira"><img src="img/flag_'+sequence_language[1]+'.png" /></div><div class="question_text">' + decryptText(questions[n].options[sequence_language[1]][i], keyPass) + '</div></div>';
                                    list += '</div>';
                                list += '</button>';
                            }
                        list += '</div>';
                    list += '</li>';
                list += '</ul>';
            list += '</li>';
        }
        list += '</ul>';
        $("#questions").append(list);
    }
}

// ...
function getJson( nameFileJson ) {
    fetch(nameFileJson)
    .then(question_file => {
        return question_file.json(); 
    })
    .then( questions_loaded => {
        questions_available = questions_loaded;
        createList();
    })
    .catch( err => {
        console.log(err);
    })
}

// ...
function createSelect( baseUrl, cu ){
    var options = '<option value="title" selected>Select content</option>';
    for (var n=0; n < cu.courses_updated.length ; n++) {
        jsonUrl = baseUrl + cu.courses_updated[n].file_json + '.json'
        courseUnit = cu.courses_updated[n].course_unit;
        options += '<option value="' + jsonUrl + '">' + courseUnit + '</option>';
    }
     $("#select").append(options);
}

// ...
function checkKeyView(){
    let keyView = $("#encry_key").val();
    keyPass = keyView;
    let textTest = "U2FsdGVkX19cv8qTrbFUdx8+8tRyanlSr/1+QWh9A2A=";
    let decryptedText = CryptoJS.AES.decrypt(textTest, keyView);
    let decryptedString = decryptedText.toString(CryptoJS.enc.Utf8);

    if (decryptedString == "ok") {
        return true
    } else {
        return false
    }
}

// ...
$(document).ready(function(){
    // ...
    $(document).on('click','.btn', function() {
        let questionNumber = $(this).data('question');
        let correctOption = questions_available.questions[questionNumber].result;
        for (var i = 0; i < correctOption.length; i++) {
            $("li[data-li="+questionNumber+"] li.options div button[value="+correctOption[i]+"]").addClass( "optionCorrect" );    
        }
    });

    // ...
    $(document).on("change","#select",function(){
        if ( encrypted ){ 
            if (checkKeyView() == true) {
                let nameJson = $(this).val();
                $("#questions").empty();
                if (nameJson != 'title'){
                    getJson(nameJson);
                }
            } else {
                let alertMessage = '<div class="alert alert-danger  alert-dismissible fade show text-center" role="alert">Key view <strong>incorrect</strong> !<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
                $("#mensagem").html(alertMessage);
                $("#questions").empty();
            }
        } else {
            let nameJson = $(this).val();
            $("#questions").empty();
            if (nameJson != 'title'){
                getJson(nameJson);
            }
        }
    });

    $('#translate').change(function() {
        if ( $('#translate').is(':checked') ) {
            $(".traduzir").addClass("showPtBr");
        } else {
            $(".traduzir").removeClass("showPtBr");
        }
    });

    //
    if ( !translate ) {
        $('.boxTranslate').hide();
    }

    // ...
    createSelect( baseUrl, coursesUpdated );

});
