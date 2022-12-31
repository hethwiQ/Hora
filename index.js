var dropdown = document.getElementById("languageOption");
dropdown.onchange = function() {
    let codeInput = document.getElementById("codeInput");
    codeInput.value = "";

}


var getHoraBtn = document.getElementById("getHoraBtn");
getHoraBtn.onclick = function() {
    var codeInput = document.getElementById("codeInput")
    var code = codeInput.value.trim();

    var result = parseInput(code)

    var resultShow = document.getElementById("resultShow");
    resultShow.innerHTML = result;
}


function parseInput(code) {
    let newlineSplit = code.split("\n")
    let forStatements = getForStatements(newlineSplit);
    let result = getBigONotation(forStatements);
    return result;
}
