// Set this global variable to DEVELOPMENT in your web page to get the stack
// underflow checking to work correctly. It comes at the expense of overriding
// the Array.prototype.pop() method, so you can remove it when you're sure there
// are no stack-based errors and you may have to interact with other libraries. 

if (creoleForthCodeBase === undefined) {
    var creoleodeBase = "PRODUCTION";
}

Function.prototype.method = function (name, func) {
    if (!this.prototype[name]) {
        this.prototype[name] = func;
        return this;
    }
};


var originalPop = Array.prototype.pop;
var GlobalErrors = function () {
    "use strict";

    if (!(this instanceof BasicForthConstants)) {
        throw new Error("BasicForthConstants needs to be called with the new keyword");
    }

    this.StackUnderFlowFlag = false;  
};

var globalErrors = Object.create(GlobalErrors);
if (creoleForthCodeBase === "DEVELOPMENT") {
    Array.prototype.pop = function() {
        var popVal = originalPop.apply(this, arguments);
        if ((this.length === 0) && (popVal === "")) {
            globalErrors.StackUnderFlowFlag = true;
            alert("Error: Stack underflow");
        }
        else {
            return popVal;
        }
    };
}

Number.method('integer', function () {
    return Math[this < 0 ? 'ceil' : 'floor'](this);
});

String.method('trim', function () {
    return this.replace(/^\s+|\s$/g, '');
});

var BasicForthConstants = function () {
    "use strict";

    if (!(this instanceof BasicForthConstants)) {
        throw new Error("BasicForthConstants needs to be called with the new keyword");
    }
    this.SmudgeFlag = "SMUDGED";
    this.ImmediateVocab = "IMMEDIATE";
    this.BranchloopVocab = "BRANCHLOOP";
    this.PrefilterVocab = "PREFILTER";
    this.PostfilterVocab = "POSTFILTER";
    this.EndOfSingleLineComment = "\n";
    this.EndOfMultilineComment = ")";
    this.ExecZeroAction = "EXEC0";
    this.CompLitAction = "COMPLIT";
};

var GlobalSimpleProps = function (cfb) {
    "use strict";
    
    if (!(this instanceof GlobalSimpleProps)) {
        throw new Error("GlobalSimpleProps needs to be called with the new keyword");
    }
    this.CreoleForthBundle = cfb;
    this.DataStack = [];
    this.ReturnStack = [];
    this.VocabStack = [];
    this.PrefilterStack = [];
    this.PostfilterStack = [];
    this.PADarea = [];
    this.ParsedInput = [];
    this.LoopName = [];
    this.LoopIndex = [];
    this.LoopEnd = [];
    this.OuterPtr = 0;
    this.InnerPtr = 0;
    this.ParamFieldPtr = 0;
    this.InputArea = "";
    this.OutputArea = "";
    this.CurrentVocab = "";
    this.HelpCommentField = "";
    this.CompiledList = [];
    this.BFC = new BasicForthConstants();
};

GlobalSimpleProps.method("cleanFields", function () {
    this.DataStack = [];
    this.ReturnStack = [];
    this.PADarea = [];
    this.ParsedInput = [];
    this.LoopName = [];
    this.LoopIndex = [];
    this.LoopEnd = [];
    this.OuterPtr = 0;
    this.InnerPtr = 0;
    this.ParamFieldPtr = 0;
    this.InputArea = "";
    this.OutputArea = "";
    this.HelpCommentField = "";
    this.CompiledList = [];
});


GlobalSimpleProps.method('hasMinArgs', function (stack, minSize) {  
    
    if (minSize === 1) {
      //  minSize += 1;
    }
    if (stack.length < minSize) {
        alert("Error: Stack underflow");
        this.cleanFields();
        //throw new Error("Insufficient number of stack arguments");
        return false;
    } 
    else {
        return true;
    }
});

GlobalSimpleProps.method('cfPop', function (arr) {
    
    originalPop.apply(this, arguments);
    var popVal = arr[0];
    if ((arr.length === 1) && (popVal === "")) {
        this.cleanFields();
        alert("Error: Stack underflow");
        // throw new Error("Insufficient number of stack arguments");       
    }
    else { 
        return arr.pop();
    }
    
});

// These objects are to be stored on the return stack
var ReturnLoc = function (dictAddr, pfAddr) {
    "use strict";
    if (!(this instanceof ReturnLoc)) {
        throw new Error("ReturnLoc needs to be called with the new keyword");
    }
    this.DictAddr = dictAddr;
    this.ParamFieldAddr = pfAddr;
};

// Colon definitions are built in the PAD area - each new entry is a triplet consisting of the
// word's fully qualified name, its dictionary address, and associated compilation action. 
var CompileInfo = function (fqName, address, compileAction) {
    "use strict";
    if (!(this instanceof CompileInfo)) {
        throw new Error("CompileInfo needs to be called with the new keyword");
    }
    this.FQName = fqName;
    this.Address = address;
    this.CompileAction = compileAction;
};

var CorePrims = function () {
    "use strict";
    if (!(this instanceof CorePrims)) {
        throw new Error("CorePrims needs to be called with the new keyword");
    }
    this.title = "Core Primitives grouping";    "use strict";
    if (!(this instanceof CorePrims)) {
        throw new Error("CorePrims needs to be called with the new keyword");
    }
    this.title = "Core Primitives grouping";
};

CorePrims.method("doNOP", function (gsp) {
    // Does exactly nothing
});

CorePrims.method("doPlus", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 2) === false) { 
        return;
    }    

    var val2 = gsp.DataStack.pop();
    var val1 = gsp.DataStack.pop();
    var sum = Number(val1) + Number(val2);
    gsp.DataStack.push(sum);
});

CorePrims.method("doMinus", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 2) === false) { 
        return;
    }    
    var val2 = gsp.DataStack.pop();
    var val1 = gsp.DataStack.pop();
    var difference = Number(val1) - Number(val2);
    gsp.DataStack.push(difference);
});

CorePrims.method("doMultiply", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 2) === false) { 
        return;
    }
    var val2 = gsp.DataStack.pop();
    var val1 = gsp.DataStack.pop();
    var product = Number(val2) * Number(val1);
    gsp.DataStack.push(product);
});

CorePrims.method("doDivide", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 2) === false) { 
        return;
    }
    var val2 = gsp.DataStack.pop();
    var val1 = gsp.DataStack.pop();
    var quotient = Number(val1) / Number(val2);
    gsp.DataStack.push(quotient);
});

CorePrims.method("doMod", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 2) === false) { 
        return;
    }
    var val2 = gsp.DataStack.pop();
    var val1 = gsp.DataStack.pop();
    var remainder = Number(val1) % Number(val2);
    gsp.DataStack.push(remainder);
});

CorePrims.method("doDup", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 1) === false) { 
        return;
    }
    var val = gsp.DataStack.pop();
    gsp.DataStack.push(val);
    gsp.DataStack.push(val);    
});

CorePrims.method("doSwap", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 2) === false) { 
        return;
    }
    var val2 = gsp.DataStack.pop();
    var val1 = gsp.DataStack.pop();
    gsp.DataStack.push(val2);
    gsp.DataStack.push(val1);    
});

// ( n1 n2 n3 -- n2 n3 n1 ) Rotates the third value to the top of the stack
CorePrims.method("doRot", function (gsp) {
    var val3 = gsp.DataStack.pop();
    var val2 = gsp.DataStack.pop();
    var val1 = gsp.DataStack.pop();
    
    gsp.DataStack.push(val2);
    gsp.DataStack.push(val3);
    gsp.DataStack.push(val1);
});

// ( n1 n2 n3 -- n3 n1 n2 )  Rotates top value of the stack to the third position 
CorePrims.method("doMinusRot", function (gsp) {
    var val3 = gsp.DataStack.pop();
    var val2 = gsp.DataStack.pop();
    var val1 = gsp.DataStack.pop(); 
 
    if (globalErrors.StackUnderFlowFlag === true) {
        gsp.cleanFields();
        globalErrors.StackUnderFlowFlag = false;
        return;
    }
 
    gsp.DataStack.push(val3);    
    gsp.DataStack.push(val1);
    gsp.DataStack.push(val2);
    
});

CorePrims.method("doNip", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 1) === false) { 
        return;
    }
    var val1 = gsp.DataStack.pop();
    gsp.DataStack.pop();
    gsp.DataStack.push(val1);   
});

CorePrims.method("doTuck", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 2) === false) { 
        return;
    }
    var val2 = gsp.DataStack.pop();
    var val1 = gsp.DataStack.pop();
    gsp.DataStack.push(val2);
    gsp.DataStack.push(val1);
    gsp.DataSta
});

CorePrims.method("doOver", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 2) === false) { 
        return;
    }
    var val2 = gsp.DataStack.pop();
    var val1 = gsp.DataStack.pop();
    gsp.DataStack.push(val1);
    gsp.DataStack.push(val2);
    gsp.DataStack.push(val1);
});

CorePrims.method("doDrop", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 1) === false) { 
        return;
    }
    gsp.DataStack.pop();
});

CorePrims.method("doDepth", function (gsp) {
    gsp.DataStack.push(gsp.DataStack.length - 1);
});

CorePrims.method("doHello", function (gsp) {
    alert("Hello World");
});

CorePrims.method("doTulip", function (gsp) {
    alert("Tulip");
});

CorePrims.method("doMsgBox", function (gsp) {
    var msg = gsp.DataStack.pop();
    alert(msg);
});

CorePrims.method("doEval", function (gsp) {
    var jsCode = gsp.DataStack.pop();
    if (jsCode.search(/^alert/) === -1) {
        alert("Sorry, only alerts allowed");
    }
    else {
        eval(jsCode);
    }
});

CorePrims.method("doVList", function (gsp) {
    var definitionTable = [];
    var i;
    var cw;
    
    definitionTable[0] = "<table>";
    definitionTable.push("<th>Index</th><th>Name</th><th>Vocabulary</th><th>Help Field</th>");
    for (i = 0; i < gsp.CreoleForthBundle.row; i++) {
        cw = gsp.CreoleForthBundle.Address[i];
        if (cw != null) {
            definitionTable.push("<tr>" + 
                "<td>" + gsp.CreoleForthBundle.Address[i].IndexField + "</td>" +  
                "<td>" + gsp.CreoleForthBundle.Address[i].NameField  + "</td>" +
                "<td>" + gsp.CreoleForthBundle.Address[i].Vocabulary + "</td>" +
                "<td>" + gsp.CreoleForthBundle.Address[i].HelpField + "</td>" +
            "</tr>");
        }
    }
    definitionTable.push("</table>");  
    dtString = definitionTable.join("\n");
    gsp.HelpCommentField = dtString;
    // alert(dtString);
});

CorePrims.method("doToday", function (gsp) { 
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var mmddyyyy = [];
    var fmtDate;

    dd = dd < 10 ? "0" + dd : dd;
    mm = mm < 10 ? "0" + mm : mm;
    mmddyyyy.push(mm);
    mmddyyyy.push(dd);
    mmddyyyy.push(yyyy);
    fmtDate = mmddyyyy.join("/");    
    alert(fmtDate);
});

CorePrims.method("doNow", function (gsp) { 
    gsp.DataStack.push(Date.now());
});

CorePrims.method("doToHoursMinSecs", function (gsp) { 
    if (gsp.hasMinArgs(gsp.DataStack, 1) === false) { 
        return;
    }
    var timeDiff0 = Math.abs(gsp.DataStack.pop()) / 1000;
    var hours = Math.floor(timeDiff0 / 3600);
    var timeDiff1 = timeDiff0 - (hours * 3600);
    var minutes = Math.floor(timeDiff1 / 60);
    var seconds = timeDiff1 - (minutes * 60);
    var hhmmss = [];
    var fmtTime;
    
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    hhmmss.push(hours);
    hhmmss.push(minutes);
    hhmmss.push(seconds);
    fmtTime = hhmmss.join(":");
    alert(fmtTime);
});

var Interpreter = function () {
    "use strict";
    if (!(this instanceof Interpreter)) {
        throw new Error("Interpreter needs to be called with the new keyword");
    }
    this.title = "Interpreter grouping";
};

Interpreter.method("doParseInput", function (gsp) {
    // splits the input into individual words
    var lines = gsp.InputArea.split(/\n/);
    var i;
    
    for (i = 0; i < lines.length; i++)
    {
        lines[i] += "  __#EOL#__";
    }
    
    var codeLine = lines.join(" ");
    gsp.ParsedInput = codeLine.trim().split(/\s+/);
});

Interpreter.method("doInner", function (gsp) {
    gsp.CreoleForthBundle.Address[gsp.InnerPtr].CodeField(gsp);
    if (globalErrors.StackUnderFlowFlag === true) {
        gsp.cleanFields();
        globalErrors.StackUnderFlowFlag = false;     
    } 
});

Interpreter.method("doColon", function(gsp) {
  //  gsp.ParamFieldPtr = 0;
    var currWord = gsp.CreoleForthBundle.Address[gsp.InnerPtr]; 
    var paramField = currWord.ParamField;
    var addrInPF;
    var codeField;
    var rLoc;
    
    while (gsp.ParamFieldPtr < paramField.length) {
        addrInPF = paramField[gsp.ParamFieldPtr];
        codeField = gsp.CreoleForthBundle.Address[addrInPF].CodeField;
        gsp.ParamFieldPtr += 1;
        rLoc = new ReturnLoc(gsp.InnerPtr, gsp.ParamFieldPtr);
        gsp.ReturnStack.push(rLoc);
        codeField(gsp);
        rLoc = gsp.ReturnStack.pop();
        gsp.InnerPtr = rLoc.DictAddr;
        gsp.ParamFieldPtr = rLoc.ParamFieldAddr;
    }
});

Interpreter.method("doOnly", function (gsp) {
    gsp.VocabStack = [];
    gsp.VocabStack.push("ONLY");
});// Search vocabularies from top to bottom for word. If found, then execute. 

Interpreter.method("doForth", function (gsp) {
    gsp.VocabStack.push("FORTH");
});

Interpreter.method("doAppSpec", function (gsp) {
    gsp.VocabStack.push("APPSPEC");
});

// Search vocabularies from top to bottom for word. If found, then execute. 
// iF not, it goes on the stack
Interpreter.method("doOuter", function (gsp) {
    
    var rawWord = "";
    var fqWord = "";
    var searchVocabPtr;
    var isFound = false;
    gsp.OuterPtr = 0;
    gsp.InnerPtr = 0;
    gsp.ParamFieldPtr = 0;
    
    while (gsp.OuterPtr < gsp.ParsedInput.length) {
        rawWord = gsp.ParsedInput[gsp.OuterPtr];
        searchVocabPtr = gsp.VocabStack.length - 1;
        while (searchVocabPtr >= 0) {
            fqWord = rawWord.toUpperCase() + "." + gsp.VocabStack[searchVocabPtr];
            if (fqWord in gsp.CreoleForthBundle) {
                gsp.InnerPtr = gsp.CreoleForthBundle[fqWord].IndexField;
                this.doInner(gsp);
                isFound = true;
                break;
            }
            else {
                searchVocabPtr -= 1;
            }
        }
        if (isFound === false) {
            gsp.DataStack.push(rawWord);
        }
        gsp.OuterPtr += 1;   
        isFound = false;
    }  
});

var Compiler = function () {
    "use strict";
    if (!(this instanceof Compiler)) {
                      throw new Error("Compiler needs to be called with the new keyword");
    }
    this.title = "Compiler grouping";
};

Compiler.method("doComma", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 1) === false) { 
        return;
    }
    var newRow = gsp.CreoleForthBundle.row;
    var token = gsp.DataStack.pop();
    var newCreoleWord = gsp.CreoleForthBundle.Address[newRow];
    newCreoleWord.ParamField.push(token);
    gsp.ParamFieldPtr = newCreoleWord.ParamField.length - 1;
});

// Executes at time zero of colon compilation, when CompileInfo triplets are placed in the PAD area.
// Example : comment handling. The pointer is moved past the comments. 

Compiler.method("doSingleLineCmts", function (gsp) { 
    while (gsp.ParsedInput[gsp.OuterPtr] != "__#EOL#__") {
        gsp.OuterPtr += 1;
    }  
});

Compiler.method("doParenCmts", function (gsp) {
    while (gsp.ParsedInput[gsp.OuterPtr].search(/\)/) === -1) {
        gsp.OuterPtr += 1;
    }
});

Compiler.method("doCompileList", function (gsp) {
    var joinedList;
    gsp.CompiledList = [];
    
    gsp.OuterPtr += 1;
    while (gsp.ParsedInput[gsp.OuterPtr].search(/\}/) === -1) {
        gsp.CompiledList.push(gsp.ParsedInput[gsp.OuterPtr]);
        gsp.OuterPtr += 1;
    }
    
    joinedList = gsp.CompiledList.join(" ");
    console.log(joinedList)
    gsp.DataStack.push(joinedList);
});

// Executes at time one of colon compilation, then the information in the CompileInfo triplets are
// passed to the standar interpreter for execution. Example : immediate words such as IF.
Compiler.method("doExecute", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 1) === false) { 
        return;
    }
    var address = gsp.DataStack.pop();
    gsp.CreoleForthBundle.Address[address].CodeField(gsp);  
});

Compiler.method("doHere", function (gsp) {
    var hereLoc = gsp.CreoleForthBundle.row + 1;
    gsp.DataStack.push(hereLoc);
});

Compiler.method("doMyAddress", function (gsp) {
    var cw = gsp.CreoleForthBundle.Address[gsp.InnerPtr];
    gsp.DataStack.push(cw.IndexField);
});

Compiler.method("doCreate", function (gsp) {
    var hereLoc = gsp.CreoleForthBundle.row + 1;
    var name = gsp.ParsedInput[gsp.OuterPtr + 1];
    var params = [];
    var data = [];
    var help = "TODO: ";
    
    var cw = new CreoleWord(name, gsp.CreoleForthBundle.Modules.Compiler.doMyAddress, gsp.CurrentVocab, "COMPINPF", help, hereLoc - 1, hereLoc, hereLoc - 1, hereLoc, params, data); 
    // The smudge flag avoids accidental recursion. But it's easy enough to get around if you want to. 
    var fqName = name + "." + gsp.CurrentVocab;
    
    gsp.CreoleForthBundle[fqName] = cw;
    gsp.CreoleForthBundle.row += 1;
    gsp.CreoleForthBundle.Address[gsp.CreoleForthBundle.row] = gsp.CreoleForthBundle[fqName];
    gsp.OuterPtr += 2;   
});



Compiler.method("CompileColon", function (gsp) {
    var hereLoc = gsp.CreoleForthBundle.row + 1;
    var name = gsp.ParsedInput[gsp.OuterPtr + 1];
    var params = [];
    var data = [];
    var help = "TODO: ";
    var rawWord;
    var searchVocabPtr;
    var isFound;
    var compAction;
    var compInfo;
    var isSemiPresent = false;
    var colonIndex = -1;
    var gspComp = new GlobalSimpleProps(gsp.CreoleForthBundle);
    var i;
    var codeField; 
    
    // Elementary syntax check to avoid allowing the page to hang. If A colon isn't followed by a matching semicolon, you get an error message
    // and the stacks and input are cleared.
    for (i = 0; i < gsp.ParsedInput.length; i++) {
        if (gsp.ParsedInput[i] === ":") {
            colonIndex = i;
        }
        if (gsp.ParsedInput[i] === ";" && i > colonIndex) {
            isSemiPresent = true;    
        }
    }
    if (isSemiPresent === false) {
        alert("Error: colon def must have matching semicolon");
        gsp.cleanFields();
        return;
    }
    
    // Compilation is started when the IMMEDIATE vocabulary is pushed onto the vocabulary stack. No need for the usual Forth STATE flag.
    gsp.VocabStack.push(gsp.BFC.ImmediateVocab);
    var cw = new CreoleWord(name, gsp.CreoleForthBundle.Modules.Interpreter.doColon, gsp.CurrentVocab, "COMPINPF", help, hereLoc - 1, hereLoc, hereLoc - 1, hereLoc, params, data); 
    // The smudge flag avoids accidental recursion. But it's easy enough to get around if you want to. 
    var fqNameSmudged = name + "." + gsp.CurrentVocab + "." + gsp.BFC.SmudgeFlag;
    var fqName = name + "." + gsp.CurrentVocab;
    var fqWord;
    
    gsp.CreoleForthBundle[fqNameSmudged] = cw;
    gsp.CreoleForthBundle.row += 1;
    gsp.CreoleForthBundle.Address[gsp.CreoleForthBundle.row] = gsp.CreoleForthBundle[fqNameSmudged];
    gsp.OuterPtr += 2;
    // parameter field contents are set up in the PAD area. Each word is looked up one at a time in the dictionary, and its name, address, and compilation action
    // are placed in the CompileInfo triplet. 
    while (gsp.OuterPtr < gsp.ParsedInput.length && gsp.VocabStack[gsp.VocabStack.length - 1] === gsp.BFC.ImmediateVocab && gsp.ParsedInput[gsp.OuterPtr] != ";" ) {
        rawWord = gsp.ParsedInput[gsp.OuterPtr];   
        searchVocabPtr = gsp.VocabStack.length - 1;
        isFound = false;
        while (searchVocabPtr >= 0) {
            fqWord = rawWord.toUpperCase() + "." + gsp.VocabStack[searchVocabPtr];
            if (fqWord in gsp.CreoleForthBundle) {
                compAction = gsp.CreoleForthBundle[fqWord].CompileActionField;
                if (compAction != gsp.BFC.ExecZeroAction) {
                    compInfo = new CompileInfo(fqWord, gsp.CreoleForthBundle[fqWord].IndexField, compAction);
                    gsp.PADarea.push(compInfo);  
                }
                else {
                    // This is stuff where the outer ptr is manipulated such as comments
                    codeField = gsp.CreoleForthBundle[fqWord].CodeField;
                    codeField(gsp);
                }
                isFound = true;
                break;
            }
            else {
                searchVocabPtr -= 1;
            }
        }
    
        // if no dictionary entry is found, it's tagged as a literal.
        if (isFound === false) {
            compInfo = new CompileInfo(rawWord, rawWord, gsp.BFC.CompLitAction);
            gsp.PADarea.push(compInfo);
        }
        gsp.OuterPtr += 1;   
    }   
    //  1. Builds the definition in the parameter field from the PAD area. Very simple; the address of each word appears before its associated
    //    compilation action. Most of the time, it will be COMPINPF, which will simply compile the word into the parameter field (it's actually 
    //    , (comma) with a different name for readability purposes).
    //    Compiling words such as CompileIf will execute since that's the compilation action they're tagged with. 
    //  2. Attaches it to the smudged definition
    //  3. "Unsmudges" the new definition by copying it to its proper fully-qualified property and place in the rows array.
    //  4. Deletes the smudged definition.
    //  5. Pops the IMMEDIATE vocabulary off the vocabulary stack and halts compilation. 
    i = 0;    
    gspComp.VocabStack = gsp.VocabStack;
    // Putting the args and compilation actions together and executing then executing them seems to cause a problem with compiling words.
    // Getting around this by putting one arg on the stack, one in the input area, then executing.
    while (i < gsp.PADarea.length)
    {
        compInfo = gsp.PADarea[i];
        gspComp.DataStack.push(compInfo.Address);
        gspComp.InputArea = compInfo.CompileAction;
        gspComp.CreoleForthBundle.Modules.Interpreter.doParseInput(gspComp);
        gspComp.CreoleForthBundle.Modules.Interpreter.doOuter(gspComp);
        i += 1;
    }
    
    gspComp.InputArea = ";";
    gspComp.CreoleForthBundle.Modules.Interpreter.doParseInput(gspComp);
    gspComp.CreoleForthBundle.Modules.Interpreter.doOuter(gspComp);

    cw = gspComp.CreoleForthBundle.Address[gspComp.CreoleForthBundle.row];
    gsp.CreoleForthBundle[fqName] = cw;
    delete gsp.CreoleForthBundle[fqNameSmudged];
    gsp.VocabStack.pop();
    gsp.PADarea = [];
});

Compiler.method("doSemi", function (gsp) {
    gsp.PADarea = [];
 //   alert("Compilation is complete");   
    console.log("Compilation is complete");
});

// Compiling wordsCreoleWord = gsp.CreoleForthBundle.Address[row]; have two separate actions - 
// a compile-time and a run-time action.
Compiler.method("CompileIf", function (gsp) {
    var newRow = gsp.CreoleForthBundle.row;
    var newCreoleWord = gsp.CreoleForthBundle.Address[newRow];
    var zeroBranchAddr = gsp.CreoleForthBundle["0BRANCH.IMMEDIATE"].IndexField;
    
    newCreoleWord.ParamField.push(zeroBranchAddr);
    newCreoleWord.ParamField.push(-1);
    gsp.ParamFieldPtr = newCreoleWord.ParamField.length - 1;
    gsp.DataStack.push(gsp.ParamFieldPtr);    
});

Compiler.method("CompileElse", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 1) === false) { 
        return;
    }
    var newRow = gsp.CreoleForthBundle.row;
    var newCreoleWord = gsp.CreoleForthBundle.Address[newRow];
    var jumpAddr = gsp.CreoleForthBundle["JUMP.IMMEDIATE"].IndexField;
    var elseAddr = gsp.CreoleForthBundle["doElse.IMMEDIATE"].IndexField;
    var jumpAddrPFLoc;
    var zeroBrAddrPFLoc;
    
    newCreoleWord.ParamField.push(jumpAddr);
    newCreoleWord.ParamField.push(-1);   
    jumpAddrPFLoc = newCreoleWord.ParamField.length - 1;
    newCreoleWord.ParamField.push(elseAddr);
    zeroBrAddrPFLoc = gsp.DataStack.pop();
    newCreoleWord.ParamField[zeroBrAddrPFLoc] = newCreoleWord.ParamField.length - 1;
    gsp.DataStack.push(jumpAddrPFLoc);
    gsp.ParamFieldPtr = newCreoleWord.ParamField.length - 1;
});

Compiler.method("CompileThen", function (gsp) {
     if (gsp.hasMinArgs(gsp.DataStack, 1) === false) { 
        return;
    }   
    var newRow = gsp.CreoleForthBundle.row;
    var newCreoleWord = gsp.CreoleForthBundle.Address[newRow];
    var branchPFLoc = gsp.DataStack.pop();
    var thenAddr = gsp.CreoleForthBundle["doThen.IMMEDIATE"].IndexField;
    
    newCreoleWord.ParamField.push(thenAddr);
    newCreoleWord.ParamField[branchPFLoc] = newCreoleWord.ParamField.length - 1;
});

Compiler.method("do0Branch", function (gsp) {
    var currWord = gsp.CreoleForthBundle.Address[gsp.InnerPtr]; 
    var paramField = currWord.ParamField;
    var rLoc = gsp.ReturnStack.pop();
    var jumpAddr = paramField[rLoc.ParamFieldAddr];
    var branchFlag = gsp.DataStack.pop();
    
    if (branchFlag == 0) {
        gsp.ParamFieldPtr = jumpAddr;  
    }
    else {
        gsp.ParamFieldPtr += 1;
    }
    rLoc.ParamFieldAddr = gsp.ParamFieldPtr;
    gsp.ReturnStack.push(rLoc);
});

Compiler.method("CompileBegin", function (gsp) {
    var newRow = gsp.CreoleForthBundle.row;
    var newCreoleWord = gsp.CreoleForthBundle.Address[newRow];
    var beginAddr = gsp.CreoleForthBundle["doBegin.IMMEDIATE"].IndexField;
    var beginLoc;
    newCreoleWord.ParamField.push(beginAddr);
    beginLoc = newCreoleWord.ParamField.length - 1;
    gsp.DataStack.push(beginLoc);
});

Compiler.method("CompileUntil", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 1) === false) { 
        return;
    }   
    var newRow = gsp.CreoleForthBundle.row;
    var newCreoleWord = gsp.CreoleForthBundle.Address[newRow];
    var beginLoc = gsp.DataStack.pop();
    var zeroBranchAddr = gsp.CreoleForthBundle["0BRANCH.IMMEDIATE"].IndexField;
    
    newCreoleWord.ParamField.push(zeroBranchAddr);
    newCreoleWord.ParamField.push(beginLoc);   
});

Compiler.method("doDoes", function (gsp) {
    var execToken = gsp.CreoleForthBundle.Address[gsp.InnerPtr].IndexField;
    gsp.ParamFieldPtr += 1;
    gsp.DataStack.push(execToken);
    gsp.CreoleForthBundle.Modules.Interpreter.doColon(gsp);
});

// 1. Copy the code beyond DOES> into the defining word to the new definition
// 2. Advance the parameter field pointer past the runtime code that was copied
//    so it won't be executed.
// Example: : CONSTANT CREATE , DOES> @ ;
//            3 CONSTANT THREE
Compiler.method("CompileDoes", function (gsp) {
    var rLoc = gsp.ReturnStack.pop();
    var parentRow = rLoc.DictAddr;
    var newRow = gsp.CreoleForthBundle.row;
    var parentCreoleWord = gsp.CreoleForthBundle.Address[parentRow];
    var childCreoleWord = gsp.CreoleForthBundle.Address[newRow];
    var doesAddr = gsp.CreoleForthBundle["DOES>.FORTH"].IndexField;
    var i = 0;
    var fqNameField = childCreoleWord.fqNameField;
    var startCopyPoint;
    
    childCreoleWord.CodeField = gsp.CreoleForthBundle.Modules.Compiler.doDoes;
    // Find the location of the does address in the parent definition
    while (i < parentCreoleWord.ParamField.length) {
        if (parentCreoleWord.ParamField[i] == doesAddr) {
            startCopyPoint = i + 1;
            break;
        }
        else {
            i += 1;
        }
    }
    
    i = 0;
    while (startCopyPoint < parentCreoleWord.ParamField.length) {
        childCreoleWord.ParamField.push(parentCreoleWord.ParamField[startCopyPoint]);
        startCopyPoint += 1
        i += 1;
    }
    
    rLoc.ParamFieldAddr += i;
    gsp.ReturnStack.push(rLoc);
//    gsp.CreoleForthBundle.Address[newRow] = childCreoleWord;
//    gsp.CreoleForthBundle[fqNameField] = childCreoleWord;
});

Compiler.method("doJump", function (gsp) {
    var currWord = gsp.CreoleForthBundle.Address[gsp.InnerPtr]; 
    var paramField = currWord.ParamField;
    var jumpAddr = paramField[gsp.ParamFieldPtr + 1];
    var rLoc = gsp.ReturnStack.pop();
    
    gsp.ParamFieldPtr = jumpAddr;
    rLoc.ParamFieldAddr = gsp.ParamFieldPtr;
    gsp.ReturnStack.push(rLoc);
});

Compiler.method("CompileLiteral", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 1) === false) { 
        return;
    }
    var newRow = gsp.CreoleForthBundle.row;
    var newCreoleWord = gsp.CreoleForthBundle.Address[newRow];
    var doLitAddr = gsp.CreoleForthBundle["doLiteral.IMMEDIATE"].IndexField;
    var litVal = gsp.DataStack.pop();
    
    newCreoleWord.ParamField.push(doLitAddr);
    newCreoleWord.ParamField.push(litVal);
    gsp.ParamFieldPtr = newCreoleWord.length - 1;
});

Compiler.method("doLiteral", function (gsp) {
    var rLoc = gsp.ReturnStack.pop();
    var litVal = gsp.CreoleForthBundle.Address[rLoc.DictAddr].ParamField[rLoc.ParamFieldAddr];
    
    gsp.DataStack.push(litVal);
    rLoc.ParamFieldAddr += 1;
    gsp.ParamFieldPtr = rLoc.ParamFieldAddr;
    gsp.ReturnStack.push(rLoc);
});

Compiler.method("doFetch", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 1) === false) { 
        return;
    }
    var address = gsp.DataStack.pop();
    var storedVal = gsp.CreoleForthBundle.Address[address].ParamField[0];
    gsp.DataStack.push(storedVal);
});

Compiler.method("doStore", function (gsp) {
   if (gsp.hasMinArgs(gsp.DataStack, 2) === false) { 
        return;
    }
    var address = gsp.DataStack.pop();
    var valToStore = gsp.DataStack.pop();
    gsp.CreoleForthBundle.Address[address].ParamField[0] = valToStore;
});

Compiler.method("doSetCurrentToContext", function (gsp) {
    var currentVocab = gsp.VocabStack[gsp.VocabStack.length - 1];
    gsp.CurrentVocab = currentVocab;
    console.log("Current vocab is now " + gsp.CurrentVocab);
});

var LogicOps = function () {
    "use strict";
    if (!(this instanceof LogicOps)) {
        throw new Error("LogicOps needs to be called with the new keyword");
    }
    this.title = "Logical operatives grouping";
};

LogicOps.method("doEquals", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 2) === false) { 
        return;
    }
    var val1 = gsp.DataStack.pop();
    var val2 = gsp.DataStack.pop();
    if (val1 == val2) {
        gsp.DataStack.push(-1);
    } 
    else {
        gsp.DataStack.push(0);
    }
});

LogicOps.method("doNotEquals", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 2) === false) { 
        return;
    }
    var val1 = gsp.DataStack.pop();
    var val2 = gsp.DataStack.pop();
    if (val1 == val2) {
        gsp.DataStack.push(0);
    } 
    else {
        gsp.DataStack.push(-1);
    }
});

LogicOps.method("doLessThan", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 2) === false) { 
        return;
    }
    var val1 = gsp.DataStack.pop();
    var val2 = gsp.DataStack.pop();
    if (val2 < val1) {
        gsp.DataStack.push(-1);
    } 
    else {
        gsp.DataStack.push(0);
    }
});

LogicOps.method("doGreaterThan", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 2) === false) { 
        return;
    }
    var val1 = gsp.DataStack.pop();
    var val2 = gsp.DataStack.pop();
    if (val2 > val1) {
        gsp.DataStack.push(-1);
    } 
    else {
        gsp.DataStack.push(0);
    }
});

LogicOps.method("doLessThanOrEquals", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 2) === false) { 
        return;
    }
    var val1 = gsp.DataStack.pop();
    var val2 = gsp.DataStack.pop();
    if (val2 <= val1)  {
        gsp.DataStack.push(-1);    
    } 
    else {
        gsp.DataStack.push(0);
    }
});

LogicOps.method("doGreaterThanOrEquals", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 2) === false) { 
        return;
    }
    var val1 = gsp.DataStack.pop();
    var val2 = gsp.DataStack.pop();
    if (val2 >= val1)  {
        gsp.DataStack.push(-1);    
    } 
    else {
        gsp.DataStack.push(0);
    }
});

LogicOps.method("doNot", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 1) === false) { 
        return;
    }
    var val = gsp.DataStack.pop();
    // Must use ==, not === to do type coercion
    if (val == Number(0)) {
        gsp.DataStack.push(-1);
    }
    else {
        gsp.DataStack.push(0);
    }
});

LogicOps.method("doAnd", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 2) === false) { 
        return;
    }
    var val1 = gsp.DataStack.pop();
    var val2 = gsp.DataStack.pop();
    if ((val1 != 0) && (val2 != 0)) {
        gsp.DataStack.push(-1);
    }
    else {
        gsp.DataStack.push(0);
    }
});

LogicOps.method("doOr", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 2) === false) { 
        return;
    }
    var val1 = gsp.DataStack.pop();
    var val2 = gsp.DataStack.pop();
    if ((val1 != 0) || (val2 != 0)) {
        gsp.DataStack.push(-1);
    }
    else {
        gsp.DataStack.push(0);
    }
});

LogicOps.method("doXor", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 2) === false) { 
        return;
    }
    var val1 = gsp.DataStack.pop();
    var val2 = gsp.DataStack.pop();
    if ((val1 != 0 || val2 != 0) && ! (val1 == 0 && val2 == 0)) {
        gsp.DataStack.push(-1);
    }
    else {
        gsp.DataStack.push(0);
    }
});

// Roll your own primitives in this object
var AppSpec = function () {
    "use strict";
    if (!(this instanceof AppSpec)) {
                      throw new Error("AppSpec needs to be called with the new keyword");
    }
    this.title = "Application-specific grouping";
};

AppSpec.method("doTest", function (gsp) {
    alert("TEST primitive in APPSPEC vocabulary");
});

var CreoleWord =
    function (NameField, CodeField, Vocabulary, CompileActionField, HelpField,
              PrevRowLocField, RowLocField, LinkField, IndexField, ParamField, DataField) {
        "use strict"

        if (!(this instanceof CreoleWord)) {
                      throw new Error("CreoleWord needs to be called with the new keyword");
        }
        this.NameField = NameField;
        this.CodeField = CodeField;
        this.Vocabulary = Vocabulary;
        this.fqNameField = NameField + "." + Vocabulary;
        this.CompileActionField = CompileActionField;
        this.HelpField = HelpField;
        this.PrevRowLocField = PrevRowLocField;
        this.RowLocField = RowLocField;
        this.LinkField = LinkField;
        this.IndexField = IndexField;
        this.ParamField = ParamField;
        this.DataField = DataField;
};

var Modules = function (coreprims, interpreter, compiler, logicops, appspec) {
    this.CorePrims = coreprims;
    this.Interpreter = interpreter;
    this.Compiler = compiler;
    this.LogicOps = logicops;
    this.AppSpec = appspec;
};
    
var CreoleForthBundle = function (modules) {
    "use strict"

    if (!(this instanceof CreoleForthBundle)) {
                  throw new Error("CreoleForth needs to be called with the new keyword");
    }
    this.row = 0;
    this.Modules = modules;
    this.Address = [];
};

CreoleForthBundle.method("BuildPrimitive", function(name, cf, vocab, compAction, help) {
    var params = [];
    var data = [];
  
    var cw = new CreoleWord(name, cf, vocab, compAction, help, this.row - 1, this.row, this.row - 1, this.row, params, data);
    var fqName = name + "." + vocab;
    this[fqName] = cw;
    this.Address[this.row] = this[fqName];
    this.row += 1;
});

CreoleForthBundle.method("BuildHighLevel", function(gsp, code, help) {            
    var newDef;
    
    gsp.InputArea = code;
    this.Modules.Interpreter.doParseInput(gsp);
    this.Modules.Interpreter.doOuter(gsp);
    newDef = this.Address[this.row];
    newDef.HelpField = help;
    this[newDef.fqNameField] = newDef;    
});


var coreprims = new CorePrims();
var interpreter = new Interpreter();
var compiler = new Compiler();
var logicops = new LogicOps();
var appspec = new AppSpec();
var modules = new Modules(coreprims, interpreter, compiler, logicops, appspec);
var gsp = new GlobalSimpleProps();
gsp.DataStack = [];
/*
    ONLY vocabulary deals with vocabulary-specific words.
    FORTH is the general Forth lexicon.
    APPSPEC is intended to contain application-specific definitions.
    Vocabularies are searched from the top of the vocabulary stack to the bottom. When a word is found, search is halted. 
*/
gsp.VocabStack.push("ONLY");
gsp.VocabStack.push("FORTH");
gsp.VocabStack.push("APPSPEC");
gsp.CurrentVocab = "FORTH";

// BuildPrimitive(objFbps As ForthBundleParamSet, psName As String, psClassModule As String, psCodeField As String, psVocab As String, psCompileAction As String, psHelp As String)
var cfb1 = new CreoleForthBundle(modules);
gsp.CreoleForthBundle = cfb1;

// The onlies
cfb1.BuildPrimitive("ONLY", cfb1.Modules.Interpreter.doOnly, "ONLY", "EXECUTE","( -- ) Empties the vocabulary stack, then puts ONLY on it");
cfb1.BuildPrimitive("FORTH", cfb1.Modules.Interpreter.doForth, "ONLY", "EXECUTE","( -- ) Puts FORTH on the vocabulary stack");
cfb1.BuildPrimitive("APPSPEC", cfb1.Modules.Interpreter.doAppSpec, "ONLY", "EXECUTE","( -- ) Puts APPSPEC on the vocabulary stack");
cfb1.BuildPrimitive("NOP", cfb1.Modules.CorePrims.doNOP, "ONLY", "COMPINPF","( -- ) Do-nothing primitive which is surprisingly useful");
cfb1.BuildPrimitive("__#EOL#__", cfb1.Modules.CorePrims.doNOP, "ONLY", "NOP","( -- ) EOL marker");

// dialogs and help
cfb1.BuildPrimitive("HELLO", cfb1.Modules.CorePrims.doHello, "FORTH", "COMPINPF","( -- ) Pops up an alert saying Hello World");
cfb1.BuildPrimitive("TULIP", cfb1.Modules.CorePrims.doTulip, "FORTH", "COMPINPF","( -- ) Pops up an alert saying Tulip");
cfb1.BuildPrimitive("MSGBOX", cfb1.Modules.CorePrims.doMsgBox, "FORTH", "COMPINPF","( msg -- ) Pops up an alert saying the message");
cfb1.BuildPrimitive("EVAL", cfb1.Modules.CorePrims.doEval, "FORTH", "COMPINPF","( code -- ) Evaluates raw JavaScript code - only allows alerts");
cfb1.BuildPrimitive("VLIST", cfb1.Modules.CorePrims.doVList, "FORTH", "COMPINPF","( -- ) Lists the dictionary definitions");

// Basic math
cfb1.BuildPrimitive("+", cfb1.Modules.CorePrims.doPlus, "FORTH", "COMPINPF","( n1 n2 -- sum ) Adds two numbers on the stack");
cfb1.BuildPrimitive("-", cfb1.Modules.CorePrims.doMinus, "FORTH", "COMPINPF","( n1 n2 -- difference ) Subtracts two numbers on the stack");
cfb1.BuildPrimitive("*", cfb1.Modules.CorePrims.doMultiply, "FORTH", "COMPINPF","( n1 n2 -- product ) Multiplies two numbers on the stack");
cfb1.BuildPrimitive("/", cfb1.Modules.CorePrims.doDivide, "FORTH", "COMPINPF","( n1 n2 -- quotient ) Divides two numbers on the stack");
cfb1.BuildPrimitive("%", cfb1.Modules.CorePrims.doMod, "FORTH", "COMPINPF","( n1 n2 -- remainder ) Returns remainder of division operation");

// Date/time handling
cfb1.BuildPrimitive("TODAY", cfb1.Modules.CorePrims.doToday, "FORTH", "COMPINPF","( -- ) Pops up today's date");
cfb1.BuildPrimitive("NOW", cfb1.Modules.CorePrims.doNow, "FORTH", "COMPINPF","( --  time ) Puts the time on the stack");
cfb1.BuildPrimitive(">HHMMSS", cfb1.Modules.CorePrims.doToHoursMinSecs, "FORTH", "COMPINPF","( time -- ) Formats the time");

// Stack manipulation
cfb1.BuildPrimitive("DUP", cfb1.Modules.CorePrims.doDup, "FORTH", "COMPINPF","( val --  val val ) Duplicates the argument on top of the stack");
cfb1.BuildPrimitive("SWAP", cfb1.Modules.CorePrims.doSwap, "FORTH", "COMPINPF","( val1 val2 -- val2 val1 ) Swaps the positions of the top two stack arguments");
cfb1.BuildPrimitive("ROT", cfb1.Modules.CorePrims.doRot, "FORTH", "COMPINPF","( val1 val2 val3 -- val2 val3 val1 ) Moves the third stack argument to the top");
cfb1.BuildPrimitive("-ROT", cfb1.Modules.CorePrims.doMinusRot, "FORTH", "COMPINPF","( val1 val2 val3 -- val3 val1 val2 ) Moves the top stack argument to the third position");
cfb1.BuildPrimitive("NIP", cfb1.Modules.CorePrims.doNip, "FORTH", "COMPINPF","( val1 val2 -- val2 ) Removes second stack argument");
cfb1.BuildPrimitive("TUCK", cfb1.Modules.CorePrims.doTuck, "FORTH", "COMPINPF","( val1 val2 -- val2 val1 val2 ) Copies top stack argument under second argument");
cfb1.BuildPrimitive("OVER", cfb1.Modules.CorePrims.doOver, "FORTH", "COMPINPF","( val1 val2 -- val1 val2 val1 ) Copies second stack argument to the top of the stack");
cfb1.BuildPrimitive("DROP", cfb1.Modules.CorePrims.doDrop, "FORTH", "COMPINPF","( val -- ) Drops the argument at the top of the stack");
cfb1.BuildPrimitive("DEPTH", cfb1.Modules.CorePrims.doDepth, "FORTH", "COMPINPF","( -- n ) Returns the stack depth");

// Logical operatives
cfb1.BuildPrimitive("=", cfb1.Modules.LogicOps.doEquals, "FORTH", "COMPINPF","( val1 val2 -- flag ) -1 if equal, 0 otherwise");
cfb1.BuildPrimitive("<>", cfb1.Modules.LogicOps.doNotEquals, "FORTH", "COMPINPF","( val1 val2 -- flag ) 0 if equal, -1 otherwise");
cfb1.BuildPrimitive("<", cfb1.Modules.LogicOps.doLessThan, "FORTH", "COMPINPF","( val1 val2 -- flag ) -1 if less than, 0 otherwise");
cfb1.BuildPrimitive(">", cfb1.Modules.LogicOps.doGreaterThan, "FORTH", "COMPINPF","( val1 val2 -- flag ) -1 if greater than, 0 otherwise");
cfb1.BuildPrimitive("<=", cfb1.Modules.LogicOps.doLessThanOrEquals, "FORTH", "COMPINPF","( val1 val2 -- flag ) -1 if less than or equal to, 0 otherwise");
cfb1.BuildPrimitive(">=", cfb1.Modules.LogicOps.doGreaterThanOrEquals, "FORTH", "COMPINPF","( val1 val2 -- flag ) -1 if greater than or equal to, 0 otherwise");
cfb1.BuildPrimitive("NOT", cfb1.Modules.LogicOps.doNot, "FORTH", "COMPINPF","( val -- opval ) -1 if 0, 0 otherwise");
cfb1.BuildPrimitive("AND", cfb1.Modules.LogicOps.doAnd, "FORTH", "COMPINPF","( val1 val2 -- flag ) -1 if both arguments are non-zero, 0 otherwise");
cfb1.BuildPrimitive("OR", cfb1.Modules.LogicOps.doOr, "FORTH", "COMPINPF","( val1 val2 -- flag ) -1 if one or both arguments are non-zero, 0 otherwise");
cfb1.BuildPrimitive("XOR", cfb1.Modules.LogicOps.doXor, "FORTH", "COMPINPF","( val1 val2 -- flag ) -1 if one and only one argument is non-zero, 0 otherwise");

// Compiler definitions
cfb1.BuildPrimitive(",", cfb1.Modules.Compiler.doComma, "FORTH", "COMPINPF","( n --). Compiles value off the TOS into the next parameter field cell");
cfb1.BuildPrimitive("COMPINPF", cfb1.Modules.Compiler.doComma, "IMMEDIATE", "COMPINPF","( n --). It's does the same thing as , (comma) - given a different name for ease of reading");
cfb1.BuildPrimitive("EXECUTE", cfb1.Modules.Compiler.doExecute, "FORTH", "COMPINPF","( address --). Executes the word corresponding to the address on the stack");
cfb1.BuildPrimitive(":", cfb1.Modules.Compiler.CompileColon, "FORTH", "COMPINPF","( -- ) Starts compilation of a colon definition");
cfb1.BuildPrimitive(";", cfb1.Modules.Compiler.doSemi, "IMMEDIATE", "EXECUTE","( -- ) Terminates compilation of a colon definition");
cfb1.BuildPrimitive("COMPLIT", cfb1.Modules.Compiler.CompileLiteral, "IMMEDIATE", "EXECUTE","( -- ) Compiles doLit and a literal into the dictionary");
cfb1.BuildPrimitive("doLiteral", cfb1.Modules.Compiler.doLiteral, "IMMEDIATE", "NOP","( -- lit ) Run-time code that pushes a literal onto the stack");
cfb1.BuildPrimitive("HERE", cfb1.Modules.Compiler.doHere, "FORTH", "COMPINPF","( -- location ) Returns address of the next available dictionary location");
cfb1.BuildPrimitive("CREATE", cfb1.Modules.Compiler.doCreate, "FORTH", "COMPINPF","CREATE <name>. Adds a named entry into the dictionary");
cfb1.BuildPrimitive("DOES>", cfb1.Modules.Compiler.CompileDoes, "FORTH", "COMPINPF", "DOES> <list of runtime actions>. When defining word is created, copies code following it into the child definition")

cfb1.BuildPrimitive("@", cfb1.Modules.Compiler.doFetch, "FORTH", "COMPINPF","( addr -- val ) Fetches the value in the param field  at addr");
cfb1.BuildPrimitive("!", cfb1.Modules.Compiler.doStore, "FORTH", "COMPINPF","( val addr --) Stores the value in the param field  at addr");
cfb1.BuildPrimitive("DEFINITIONS", cfb1.Modules.Compiler.doSetCurrentToContext, "FORTH",
                    "COMPINPF","(  -- ). Sets the current (compilation) vocabulary to the context vocabulary (the one on top of the vocabulary stack)");

// Branching compiler definitions
cfb1.BuildPrimitive("IF", cfb1.Modules.Compiler.CompileIf, "IMMEDIATE", "EXECUTE","( -- location ). Compile-time code for IF which should not be used outside of a colon definition");
cfb1.BuildPrimitive("ELSE", cfb1.Modules.Compiler.CompileElse, "IMMEDIATE", "EXECUTE","( -- location ) Compile-time code for ELSE which should not be used outside of a colon definition");
cfb1.BuildPrimitive("THEN", cfb1.Modules.Compiler.CompileThen, "IMMEDIATE", "EXECUTE","( -- location ) Compile-time code for THEN which should not be used outside of a colon definition");
cfb1.BuildPrimitive("0BRANCH", cfb1.Modules.Compiler.do0Branch, "IMMEDIATE", "NOP","( flag -- ) Run-time code for IF");
cfb1.BuildPrimitive("JUMP", cfb1.Modules.Compiler.doJump, "IMMEDIATE", "NOP","( -- ) Jumps unconditionally to the parameter field location next to it and is compiled by ELSE");
cfb1.BuildPrimitive("doElse", cfb1.Modules.CorePrims.doNOP, "IMMEDIATE", "NOP","( -- ) Run-time code for ELSE");
cfb1.BuildPrimitive("doThen", cfb1.Modules.CorePrims.doNOP, "IMMEDIATE", "NOP","( -- ) Run-time code for THEN");
cfb1.BuildPrimitive("BEGIN", cfb1.Modules.Compiler.CompileBegin, "IMMEDIATE", "EXECUTE","( -- beginLoc ). Compile-time code for BEGIN which should not be used outside of a colon definition");
cfb1.BuildPrimitive("UNTIL", cfb1.Modules.Compiler.CompileUntil, "IMMEDIATE", "EXECUTE","( beginLoc -- ) Compile-time code for UNTIL which should not be used outside of a colon definition");
cfb1.BuildPrimitive("doBegin", cfb1.Modules.CorePrims.doNOP, "IMMEDIATE", "NOP","( -- ) Run-time code for BEGIN");

cfb1.BuildPrimitive("\\", cfb1.Modules.Compiler.doSingleLineCmts, "FORTH", "EXEC0","( -- ) Single-line comment handling");
cfb1.BuildPrimitive("(", cfb1.Modules.Compiler.doParenCmts, "FORTH", "EXEC0","( -- ) Multiline comment handling");
cfb1.BuildPrimitive("\{", cfb1.Modules.Compiler.doCompileList, "FORTH", "EXEC0","( -- list ) List compiler");
cfb1.BuildHighLevel(gsp, ": CONSTANT CREATE , DOES> @ ;", "( val -- ) CONSTANT <name>. Defining word for scalar constants");
cfb1.BuildHighLevel(gsp, ": VARIABLE CREATE 0 , ;", "VARIABLE <name>. Used for simple scalar data storage and retrieval");

// APPSPEC is a convenient vocabulary to group your application specific primitives in
cfb1.BuildPrimitive("TEST", cfb1.Modules.AppSpec.doTest, "APPSPEC", "COMPINPF","( -- ) Do what you like here");
gsp.CurrentVocab = "APPSPEC";
cfb1.BuildHighLevel(gsp, ": HT HELLO TULIP ;", "Simple testing definition");
