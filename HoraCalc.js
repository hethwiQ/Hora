const comparisonOperators = [">", "<", ">=", "<=", "==", "!="]
const operations = ["+=", "-=", "/=", "*=", "++", "--", "="]
const arithOperations = ["+", "-", "/", "*"]


/* 
    Sort the Hora strings based on below criteria:
        1. The number of N's in the string
        2. The number of logN's in the string
*/

function getBiggestHoraString(horaStrings) {

    var numberNsList = [];
    var maxNs = 0;
    for(var i = 0; i < horaStrings.length; i++) {
        var horaStr = horaStrings[i];
        var numberNs = 0;
        for(var k = 0; k < horaStr.length; k++) {
            var c = horaStr[k];
            if (c == 'N') {
                numberNs++;
            }
        }

        if(numberNs > maxNs) {
            maxNs = numberNs;
        }

        numberNsList.push(numberNs);
    }


    topHoraStrings = [];
    for(var i = 0; i < numberNsList.length; i++) {
        if(numberNsList[i] == maxNs) {
            topHoraStrings.push(horaStrings[i]);
        }
    }


    if(topHoraStrings.length == 1) {
        return topHoraStrings[0];
    }

    // if not, check the next criteria of logs
    var maxLsIndex = 0;
    var maxLsCount = 0;
    for(var i = 0; i < topHoraStrings.length; i++) {
        var str = topHoraStrings[i];
        var LsCount = 0;
        for(var k = 0; k < str.length; k++) {
            var c = str[k];
            if(c == 'L') {
                LsCount++;
            }
        }

        if(LsCount > maxLsCount) {
            maxLsCount = LsCount;
            maxLsIndex = i;
        }
    }

    return topHoraStrings[maxLsIndex];

}

function translateBigHoraStringToHora(HoraString) {
    var nCount = 0;
    var lCount = 0;

    console.log("HoraString " + HoraString);

    for(var i = 0; i < HoraString.length; i++) {
        var c = HoraString[i];
        if (c == 'N') {
            nCount++;
        }
        else if(c == 'L') {
            lCount++;
        }
    }

    res = "";
    if(nCount > 0) {
        if(nCount > 1) {
            res += "N^" + nCount;
        }
        else {
            res += "N";
        }
    }

    if(lCount > 0) {
        if(lCount > 1) {
            res += "log^" + lCount + "(N)";
        }
        else {
            res += "log(N)";
        }
    }

    if(nCount == 0 && lCount == 0) {
        res += "1";
    }

    return "O(" + res + ")";
}


/* 
    This function should strip out all the for statements in the code
*/
function getForStatements(linesOfCode) {
    let forStatements = [];
    var level = 1;
    linesOfCode.forEach(line => {
        let isFor = line.indexOf("for");
        let isClosingStatement = line.indexOf("}")
        if(isFor > -1) {
            lineObj = {
                "line": line,
                "level": level
            }
            forStatements.push(lineObj);
            level += 1;
        }

        if(isClosingStatement > -1) {
            level -= 1;
        }
    });

    return forStatements;
}

function checkAlphaNumeric(lexicon) {
    const alphaRegex = "^[a-zA-Z]*$"
    const numericRegex = "^[0-9]*$"
    const alphaNumericRegex = "^[a-zA-Z0-9]*$"

    lexicon = lexicon.trim();

    let mN = lexicon.match(numericRegex)
    let mAN = lexicon.match(alphaNumericRegex)

    var res;
    if(mN) {
        res = "num";
    }
    else if(mAN) {
        if(lexicon[0].match(alphaRegex)) {
            res = "var";
        }
        else {
            res = "err";
        }
    }
    else {
        res = "err";
    }

    return res;

}

function evaluateForStatement(forLine) {
    let forLineSplit = forLine['line'].split("(");
    let level = forLine['level'];
    let forLineLogic = forLineSplit[1].split(";");

    let varInstantiation = forLineLogic[0];
    let range = forLineLogic[1];
    let operation = forLineLogic[2].split(")")[0];

    var initValue = varInstantiation.split("=");
    initValue = initValue[initValue.length - 1];

    var rangeStop;
    for(var i = 0; i < comparisonOperators.length; i++) {
        let op = comparisonOperators[i];
        if(range.indexOf(op) > -1) {
            let rangeStopSplit = range.split(op);
            rangeStop = rangeStopSplit[rangeStopSplit.length - 1];
            break;
        }
    }

    var operationDone;
    for(var i = 0; i < operations.length; i++) {
        let op = operations[i];
        if(operation.indexOf(op) > -1) {
            if(op === "=") {
                operationDone = "lazy"
                
            }
            else {
                if(op === "++" || op === "--") {
                    let lex = operation.split(op)[0];
                    let typeCheck = checkAlphaNumeric(lex)
  
                    if(typeCheck === "var") {
                        operationDone = "lin";
                    }
                    else {
                        operationDone = "err";
                    }   
                }
                if (op === "+=" || op === "-=") {
                    let operationSplit = operation.split(op);
                    let leftLex = operationSplit[0];
                    let rightLex = operationSplit[1];
                    
                    let leftTypeCheck = checkAlphaNumeric(leftLex);
                    let rightTypeCheck = checkAlphaNumeric(rightLex);

                    if(leftTypeCheck === "var") {
                        if(rightTypeCheck === "num") {
                            rightLex = rightLex.trim();
                            let rightLexVal = Number(rightLex);
                            if(rightLexVal > 0) {
                                operationDone = "lin";
                            }
                            else {
                                operationDone = "err";
                            }
                        }
                        else {
                            operationDone = "err";
                        }
                    }
                    else {
                        operationDone = "err";
                    }
                }

                if(op === "*=" || op === "/=") {
                    let operationSplit = operation.split(op);
                    let leftLex = operationSplit[0];
                    let rightLex = operationSplit[1];
                    
                    let leftTypeCheck = checkAlphaNumeric(leftLex);
                    let rightTypeCheck = checkAlphaNumeric(rightLex);

                    if(leftTypeCheck === "var") {
                        if(rightTypeCheck === "num") {
                            rightLex = rightLex.trim();
                            let rightLexVal = Number(rightLex);
                            if(rightLexVal > 1) {
                                operationDone = "log";
                            }
                            else {
                                operationDone = "err";
                            }
                        }
                        else {
                            operationDone = "err";
                        }
                    }
                    else {
                        operationDone = "err";
                    }
                }
            }
            break;
        }
        operationDone = "err";
    }

    return {
        "eval": operationDone,
        "level": level
    }

}

function getHoraNotation(forStatements) {
    var val_results = [];
    forStatements.forEach(forLine => {
        let r = evaluateForStatement(forLine);
        val_results.push(r);
    })

    var horaRes;
    var horaString = "";
    var horaList = [];
    var hasError = false;
    var isLazy = false;
    for(var i = 0; i < val_results.length; i++) {
        let val_result = val_results[i];
        let eval = val_result['eval'];
        let level = val_result['level'];

        if(i != 0 && level == 1) {
            horaList.push(horaString);
            horaString = "";
        }

        if(eval === "err") {
            hasError = true;
            break;
        }

        if(eval == "lazy") {
            isLazy = true;
            break;
        }

        else if(eval === "lin") {
            horaString += "N";
        }

        else if(eval == 'log') {
            horaString += "L"
        }
        
        else if(eval == "const") {
            horaString += "O"
        }

        else {
            hasError = true;
        }

    }

    horaList.push(horaString);

    if(hasError) {
        return "⚠️ Error, make sure the syntax of your code." +
        "code is correct or that it's logic doesn't create an infinite loop.";    
    }

    if(isLazy) {
        return "Congrats🎉, you found a use case that I am really too lazy 🦥 to implement. " +
        "It's not that it's IMPOSSIBLE to do, but there are so many insane edge cases to this " +
        "that I decided it wasn't worth the hassle. Please, use a simpler for loop that uses" +
        " operators like ++, --, +=, -=, *=, /=";
    }

    horaRes = getBiggestHoraString(horaList);
    var finalResult = translateBigHoraStringToHora(horaRes);

    return finalResult;

}
