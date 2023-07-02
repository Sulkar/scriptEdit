$(document).ready(function () {

    let SCRIPT_EDIT_DATA;
    let REGEX_TEST = false;
    let CM_MARKERS = [];
    let CHANGED = false;

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


    let localStorageCode = localStorage.getItem("currentCodeInput");
    if (localStorageCode != null) myCodeMirrorJS.setValue(localStorageCode);

    

    window.onbeforeunload = function () {
        if (CHANGED) {
            return "";
        }
    }



    // EVENTS //
    $('#btnRunCode').on('click', function () {
        $('#myError').hide();
        var currentCodeInput = myCodeMirrorJS.getValue();
        // Store
        localStorage.setItem("currentCodeInput", currentCodeInput);

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

    function setActiveListItem(listItemId) {
        document.querySelectorAll("button").forEach(btn => {
            btn.classList.remove("active");
        });
        document.querySelector(listItemId).classList.add("active");
    }

    $('#btnList1-1').on('click', function () {
        var sourceContent = getJSONData('suchen-ersetzen', 'code');
        myCodeMirrorJS.setValue(sourceContent);
        $("#myInfo").html(getJSONData('suchen-ersetzen', 'info'));
        setActiveListItem('#btnList1-1');
    });
    $('#btnList1-2').on('click', function () {
        var sourceContent = getJSONData('daten-liste', 'code');
        var beautified = js_beautify(sourceContent);
        myCodeMirrorJS.setValue(beautified);
        setActiveListItem('#btnList1-2');
    });
    $('#btnList1-3').on('click', function () {
        var sourceContent = getJSONData('zahlen-liste', 'code');
        var beautified = js_beautify(sourceContent);
        myCodeMirrorJS.setValue(beautified);
        setActiveListItem('#btnList1-3');
    });
    $('#btnList1-4').on('click', function () {
        var sourceContent = getJSONData('email-adressen', 'code');;
        myCodeMirrorJS.setValue(sourceContent);
        setActiveListItem('#btnList1-4');
    });
    $('#btnList1-5').on('click', function () {
        var sourceContent = getJSONData('vorname-nachname', 'code');;
        myCodeMirrorJS.setValue(sourceContent);
        setActiveListItem('#btnList1-5');
    });
    $('#btnList1-6').on('click', function () {
        var sourceContent = getJSONData('sql-filtern', 'code');;
        myCodeMirrorJS.setValue(sourceContent);
        setActiveListItem('#btnList1-6');
    });
    $('#btnList1-7').on('click', function () {
        var sourceContent = getJSONData('vorname-anzahl-sortieren', 'code');;
        var beautified = js_beautify(sourceContent);
        myCodeMirrorJS.setValue(beautified);
        setActiveListItem('#btnList1-7');
    });
    $('#btnList1-8').on('click', function () {
        var sourceContent = getJSONData('liste-sortieren-zufall', 'code');;
        var beautified = js_beautify(sourceContent);
        myCodeMirrorJS.setValue(beautified);
        $("#myInfo").html(getJSONData('fisher-yates-verfahren', 'info'));
        setActiveListItem('#btnList1-8');
    });
    $('#btnList1-9').on('click', function () {
        var sourceContent = getJSONData('duplikate-loeschen', 'code');;
        var beautified = js_beautify(sourceContent);
        myCodeMirrorJS.setValue(beautified);
        setActiveListItem('#btnList1-9');
    });
    $('#btnList1-10').on('click', function () {
        var sourceContent = getJSONData('daten-sortieren', 'code');;
        var beautified = js_beautify(sourceContent);
        myCodeMirrorJS.setValue(beautified);
        setActiveListItem('#btnList1-10');
    });
    $('#btnList1-11').on('click', function () {
        var sourceContent = getJSONData('listen-vergleichen', 'code');;
        var beautified = js_beautify(sourceContent);
        myCodeMirrorJS.setValue(beautified);
        setActiveListItem('#btnList1-11');
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
    $('#btnList2-4').on('click', function () {
        myCodeMirrorData.setValue(getJSONData('nachnamen-1000', 'text'));
        $("#myInfo").html(getJSONData('nachnamen-1000', 'info'));
    });
    $('#btnList2-5').on('click', function () {
        myCodeMirrorData.setValue(getJSONData('vornamen-1000', 'text'));
        $("#myInfo").html(getJSONData('vornamen-1000', 'info'));
    });


    //button: RegEx Tester
    $('#btnRegExTester').on('click', function () {
        $('#txtRegExTester').focus();
        REGEX_TEST = !REGEX_TEST;
        //reset markers
        CM_MARKERS.forEach(marker => marker.clear());
        CM_MARKERS = [];
    });
    $('#txtRegExTester').on('input', function (event) {
        CM_MARKERS.forEach(marker => marker.clear());
        CM_MARKERS = [];
        let inputValue = $('#txtRegExTester').val();
        try {
            // Create a regular expression from user input on every keyup
            if (inputValue != "") {
                let regexp = new RegExp(inputValue, FLAG_ARRAY.toString().replaceAll(",", ""));
                search(regexp);
            }
        }
        catch (err) {
            // Highlight user input red 
            $('#txtRegExTester').removeClass('valid-entry').addClass('invalid-entry');

        }
    });

    //Check RegEx wenn Text eingegeben wird
    myCodeMirrorData.on("change", function () {
        CHANGED = true;
        if (REGEX_TEST) {
            CM_MARKERS.forEach(marker => marker.clear());
            CM_MARKERS = [];
            let inputValue = $('#txtRegExTester').val();
            if (inputValue != "") {
                let regexp = new RegExp(inputValue, FLAG_ARRAY.toString().replaceAll(",", ""));
                search(regexp);
            }
        }
    });
    myCodeMirrorJS.on("change", function () {
        CHANGED = true;
    });

    //function: Sucht im CodeMirror DATA nach einem String und gibt diesem die Klasse "highlight"
    function search(val) {
        var cursor = myCodeMirrorData.getSearchCursor(val);
        //sucht nach val und speichert den erstellten Marker im CM_MARKERS Array -> solange der Array < 100 Einträge ist
        while (cursor.findNext() && CM_MARKERS.length < 100) {
            var tempMarker = myCodeMirrorData.markText(
                cursor.from(),
                cursor.to(),
                { className: 'highlight' }
            );
            CM_MARKERS.push(tempMarker);
        }
    }

    // RegEx Flags 
    let FLAG_ARRAY = ["g"];
    $(".dropdown-flags .dropdown-item").on('click', function (e) {
        e.stopPropagation();
    });
    $(".checkbox-flag").click(function () {
        let tempCheckboxValue = $(this).val();
        if (!isCheckboxChecked(this)) {
            let indexToRemove = FLAG_ARRAY.indexOf(tempCheckboxValue);
            FLAG_ARRAY.splice(indexToRemove, 1);
            createFlagButtonName();
        } else {
            FLAG_ARRAY.push(tempCheckboxValue);
            createFlagButtonName();
        }
        //update editor with current regex search
        CM_MARKERS.forEach(marker => marker.clear());
        CM_MARKERS = [];
        let inputValue = $('#txtRegExTester').val();
        if (inputValue != "") {
            let regexp = new RegExp(inputValue, FLAG_ARRAY.toString().replaceAll(",", ""));
            search(regexp);
        }
    });
    function isCheckboxChecked(tempCheckbox) {
        if ($(tempCheckbox).prop("checked")) return true;
        else return false;
    }
    function createFlagButtonName() {
        $(".dropdown-flags-button").html("/" + FLAG_ARRAY.toString().replaceAll(",", ""));
    }



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

});