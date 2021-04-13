$(document).ready(function () {

    var SCRIPT_EDIT_DATA;

    // init CodeMirror instances
    var myCodeMirrorJS = CodeMirror(document.querySelector('#myCodemirrorJS'), {
        lineNumbers: true,
        tabSize: 2,
        value: '/*kopiert den Text von DATA zu RESULT*/\nRESULT.setValue(DATA);',
        mode: 'javascript'
    });
    var myCodeMirrorData = CodeMirror(document.querySelector('#myCodemirrorData'), {
        lineNumbers: true,
        tabSize: 2,
        value: '',
        mode: 'text/html'
    });
    var myCodeMirrorResult = CodeMirror(document.querySelector('#myCodemirrorResult'), {
        lineNumbers: true,
        tabSize: 2,
        value: '',
        mode: 'text/html'
    });

    // EVENTS //
    $('#btnRunCode').on('click', function () {
        $('#myError').hide();
        var currentCodeInput = myCodeMirrorJS.getValue();
        var DATA = myCodeMirrorData.getValue();
        var RESULT = myCodeMirrorResult;
        var currentCodeInputString = currentCodeInput.replaceAll(/(?<=RESULT.setValue\(.+)\);/g, ".toString());");
        var compileEditorCode = new Function("DATA", "RESULT", currentCodeInputString);
        try {
            compileEditorCode(DATA, RESULT);
        } catch (error) {
            $('#myError').show();
            $('#myError').html(error);
        }
    });

    $('#btnUndo').on('click', function () {
        myCodeMirrorJS.undo();
    });
    $('#btnRedo').on('click', function () {
        myCodeMirrorJS.redo();
    });

    $('#btnList1-1').on('click', function () {
        var sourceContent = getJSONData('suchen-ersetzen', 'code');
        myCodeMirrorJS.setValue(sourceContent);
        $("#myInfo").html(getJSONData('suchen-ersetzen', 'info'));
    });
    $('#btnList1-2').on('click', function () {
        var sourceContent = getJSONData('daten-liste', 'code');
        var beautified = js_beautify(sourceContent);
        myCodeMirrorJS.setValue(beautified);
    });
    $('#btnList1-3').on('click', function () {
        var sourceContent = getJSONData('zahlen-liste', 'code');
        var beautified = js_beautify(sourceContent);
        myCodeMirrorJS.setValue(beautified);
    });
    $('#btnList1-4').on('click', function () {
        var sourceContent = getJSONData('email-adressen', 'code');;
        myCodeMirrorJS.setValue(sourceContent);
    });

    $('#btnList2-1').on('click', function () {
        myCodeMirrorData.setValue(getJSONData('Personen', 'text'));
    });
    $('#btnList2-2').on('click', function () {
        myCodeMirrorData.setValue(getJSONData('SQL', 'text'));
    });
    $('#btnList2-3').on('click', function () {
        myCodeMirrorData.setValue(getJSONData('EMAIL', 'text'));
    });




    //function: Befüllt den Dateneditor mit Daten aus dem JSON
    function getJSONData(dataName, type) {
        var tempData = "";
        if (type == "text") {
            SCRIPT_EDIT_DATA.text.forEach(element => {
                if (element.name == dataName) {
                    tempData = element.data;
                }
            });
        } else if (type == "code") {
            SCRIPT_EDIT_DATA.code.forEach(element => {
                if (element.name == dataName) {
                    tempData = element.data;
                }
            });
        } else if (type == "info") {
            SCRIPT_EDIT_DATA.info.forEach(element => {
                if (element.name == dataName) {
                    tempData = element.data;
                }
            });
        }
        return tempData;
    }

    //resize codemirror instances when resizing browser window
    $(window).on('resize', function () {
        myCodeMirrorJS.refresh();
        myCodeMirrorData.refresh();
        myCodeMirrorResult.refresh();
    });

    //load Data from json file
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            SCRIPT_EDIT_DATA = JSON.parse(this.responseText);
            myCodeMirrorData.setValue(getJSONData('Personen', 'text'));
        }
    };
    xmlhttp.open("GET", "data/scriptEditData.json", true);
    xmlhttp.send();

    //function log
    function log(info, tempValue) {
        console.log(info);
        if (tempValue != undefined) console.log("-> " + tempValue);
    }

});