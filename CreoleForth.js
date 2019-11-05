// Creole Forth for JavaScript
// Version 0.01
// Copyright 2018 Joseph M. O'Connor
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

// From Crockford's JavaScript: The Good Parts
Function.prototype.method = function (name, func) {
    if (!this.prototype[name]) {
        this.prototype[name] = func;
        this.prototype.toString = name;
        return this;
    }
};

Number.method('integer', function () {
    return Math[this < 0 ? 'ceil' : 'floor'](this);
});

String.method('trim', function () {
    return this.replace(/^\s+|\s$/g, '');
});

// Start of Creole Forth-specific code
var BasicForthConstants = function () {
    "use strict";

    if (!(this instanceof BasicForthConstants)) {
        throw new Error("BasicForthConstants needs to be called with the new keyword");
    }
    this.SmudgeFlag = "SMUDGED";
    this.ImmediateVocab = "IMMEDIATE";
    this.PrefilterVocab = "PREFILTER";
    this.PostfilterVocab = "POSTFILTER";
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
    this.loopLabels = ["I", "J", "K"];
    this.LoopLabelPtr = 0;
    this.LoopCurrIndexes = [0, 0, 0];
    this.OuterPtr = 0;
    this.InnerPtr = 0;
    this.ParamFieldPtr = 0;
    this.InputArea = "";
    this.OutputArea = "";
    this.CurrentVocab = "";
    this.HelpCommentField = "";
    this.SoundField = "";
    this.CompiledList = [];
    this.BFC = new BasicForthConstants();
    this.MinArgsSwitch = true;   // When true MinArgs is checked
    this.pause = false;
    this.onContinue = null
};

GlobalSimpleProps.method("cleanFields", function () {
    this.DataStack = [];
    this.ReturnStack = [];
    this.PADarea = [];
    this.ParsedInput = [];
    this.LoopLabelPtr = 0;
    this.LoopCurrIndexes = [0, 0, 0];
    this.OuterPtr = 0;
    this.InnerPtr = 0;
    this.ParamFieldPtr = 0;
    this.InputArea = "";
    this.OutputArea = "";
    this.HelpCommentField = "";
    this.SoundField = "";
    this.CompiledList = [];
    this.pause = false;
});


GlobalSimpleProps.method('hasMinArgs', function (stack, minSize) { 
    var i;
    if (this.MinArgsSwitch === false) {
        return;
    }
    for (i = stack.length - 1; i >= 0; i--) {
        if (stack[i] == "" || stack.length < minSize) {
            alert("Error: Stack underflow");
            this.cleanFields();
            return false;
        }
    }   
    return true;
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

var LoopInfo = function(label, index, limit) {
    "use strict";
    if (!(this instanceof LoopInfo)) {
        throw new Error("LoopInfo needs to be called with the new keyword");
    }
    this.Label = label;
    this.Index = index;
    this.Limit = limit;
}

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
    if (gsp.hasMinArgs(gsp.DataStack, 3) === false) { 
        return;
    }

    var val3 = gsp.DataStack.pop();
    var val2 = gsp.DataStack.pop();
    var val1 = gsp.DataStack.pop();
    
    gsp.DataStack.push(val2);
    gsp.DataStack.push(val3);
    gsp.DataStack.push(val1);
});

// ( n1 n2 n3 -- n3 n1 n2 )  Rotates top value of the stack to the third position 
CorePrims.method("doMinusRot", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 3) === false) { 
        return;
    }

    var val3 = gsp.DataStack.pop();
    var val2 = gsp.DataStack.pop();
    var val1 = gsp.DataStack.pop(); 
  
    gsp.DataStack.push(val3);    
    gsp.DataStack.push(val1);
    gsp.DataStack.push(val2);
    
});

CorePrims.method("doNip", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 2) === false) { 
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
    var beforeArgCount = gsp.DataStack.length;
    if (gsp.hasMinArgs(gsp.DataStack, 1) === false) { 
        return;
    }
    gsp.DataStack.pop();
    var afterArgCount = gsp.DataStack.length;
    if (beforeArgCount === afterArgCount) {
        alert("Error: stack underflow");
        gsp.cleanFields();
    }
});

CorePrims.method("doDepth", function (gsp) {
    gsp.DataStack.push(gsp.DataStack.length);
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
    var dtString;
    
    definitionTable[0] = gsp.CreoleForthBundle.row + 1 + " definitions<br><table>";
    definitionTable.push("<th>Index</th><th>Name</th><th>Vocabulary</th><th>Code Field</th><th>Param Field</th><th>Help Field</th>");
    for (i = 0; i <= gsp.CreoleForthBundle.row; i++) {
        cw = gsp.CreoleForthBundle.Address[i];
        if (cw != null) {
            definitionTable.push("<tr>" + 
                "<td>" + gsp.CreoleForthBundle.Address[i].IndexField   + "</td>" +  
                "<td>" + gsp.CreoleForthBundle.Address[i].NameField    + "</td>" +
                "<td>" + gsp.CreoleForthBundle.Address[i].Vocabulary   + "</td>" +
                "<td>" + gsp.CreoleForthBundle.Address[i].CodeFieldStr + "</td>" +     
                "<td>" + gsp.CreoleForthBundle.Address[i].ParamField   + "</td>" +                 
                "<td>" + gsp.CreoleForthBundle.Address[i].HelpField    + "</td>" +
            "</tr>");
        }
    }
    definitionTable.push("</table>");  
    dtString = definitionTable.join("\n");
    gsp.HelpCommentField = dtString;
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
        if (gsp.pause === false) {
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
        // Have to assign stack parameters this way to account for the way JavaScript initializes arrays
        if (isFound === false) {
            if (gsp.DataStack.length === 1 && gsp.DataStack[0] == "") {
                gsp.DataStack[0] = rawWord;
            }
            else {
                gsp.DataStack.push(rawWord);
            }
        }
        gsp.OuterPtr += 1;  
        isFound = false;
        }
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
    newCreoleWord.ParamFieldStart += 1;
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
    gsp.DataStack.push(joinedList);
});

// Executes at time one of colon compilation, then the information in the CompileInfo triplets are
// passed to the standar interpreter for execution. Example : immediate words such as IF.
Compiler.method("doExecute", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 1) === false) { 
        return;
    }
    var address = gsp.DataStack.pop();
    gsp.InnerPtr = address;
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
    
    var cw = new CreoleWord(name, gsp.CreoleForthBundle.Modules.Compiler.doMyAddress, "Compiler.doMyAddress", gsp.CurrentVocab, "COMPINPF", help, hereLoc - 1, hereLoc, hereLoc - 1, hereLoc, params, data); 
    // The smudge flag avoids accidental recursion. But it's easy enough to get around if you want to. 
    var fqName = name + "." + gsp.CurrentVocab;
    
    gsp.CreoleForthBundle[fqName] = cw;
    gsp.CreoleForthBundle.row += 1;
    gsp.CreoleForthBundle.Address[gsp.CreoleForthBundle.row] = gsp.CreoleForthBundle[fqName];
    gsp.OuterPtr += 2;   
});

Compiler.method("CompileColon", function (gsp) {
    var hereLoc = gsp.CreoleForthBundle.row + 1 ;
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
    var cw = new CreoleWord(name, gsp.CreoleForthBundle.Modules.Interpreter.doColon, "Interpreter.doColon", gsp.CurrentVocab, "COMPINPF", help, hereLoc - 1, hereLoc, hereLoc - 1, hereLoc, params, data); 
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

Compiler.method("CompileDo", function (gsp) {
    var newRow = gsp.CreoleForthBundle.row;
    var newCreoleWord = gsp.CreoleForthBundle.Address[newRow];
    var doStartDoAddr = gsp.CreoleForthBundle["doStartDo.IMMEDIATE"].IndexField;
    var doAddr = gsp.CreoleForthBundle["doDo.IMMEDIATE"].IndexField;
    var doLoc;
    newCreoleWord.ParamField.push(doStartDoAddr);
    newCreoleWord.ParamField.push(doAddr);
    doLoc = newCreoleWord.ParamField.length - 1;
    gsp.DataStack.push(doLoc);
});

Compiler.method("CompileLoop", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 1) === false) { 
        return;
    }       
    var newRow = gsp.CreoleForthBundle.row;
    var newCreoleWord = gsp.CreoleForthBundle.Address[newRow];
    var loopAddr = gsp.CreoleForthBundle["doLoop.IMMEDIATE"].IndexField;
    var doLoc = gsp.DataStack.pop();
    newCreoleWord.ParamField.push(loopAddr);
    newCreoleWord.ParamField.push(doLoc);
});

Compiler.method("CompilePlusLoop", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 1) === false) { 
        return;
    }       
    var newRow = gsp.CreoleForthBundle.row;
    var newCreoleWord = gsp.CreoleForthBundle.Address[newRow];
    var loopAddr = gsp.CreoleForthBundle["doPlusLoop.IMMEDIATE"].IndexField;
    var doLoc = gsp.DataStack.pop();
    newCreoleWord.ParamField.push(loopAddr);
    newCreoleWord.ParamField.push(doLoc);
});

Compiler.method("doStartDo", function (gsp) {
    if (gsp.hasMinArgs(gsp.DataStack, 2) === false) { 
        return;
    } 
    var rLoc = gsp.ReturnStack.pop();
    var startIndex = gsp.DataStack.pop();
    var loopEnd = gsp.DataStack.pop();  
    var li = new LoopInfo(gsp.loopLabels[gsp.LoopLabelPtr], startIndex, loopEnd);
    gsp.LoopCurrIndexes = [0, 0, 0];
    
    gsp.LoopLabelPtr += 1;
    gsp.ReturnStack.push(li);
    gsp.ReturnStack.push(rLoc);
});

Compiler.method("doPlusLoop", function (gsp) {
  //  gsp.MinArgsSwitch = false;
    var incVal = gsp.DataStack.pop();
    var currWord = gsp.CreoleForthBundle.Address[gsp.InnerPtr];
    var paramField = currWord.ParamField;
    var rLoc = gsp.ReturnStack.pop();
    var li = gsp.ReturnStack.pop();
    var jumpAddr = paramField[rLoc.ParamFieldAddr];
    var loopLimit = li.Limit;
    var loopLabel = li.Label;
    var currIndex = li.Index;

    if (incVal < 0) {
       loopLimit += incVal;
    }
    else {
       loopLimit -= incVal; 
    }
    if ( ( (Number(incVal) > 0) && (Number(currIndex) >= Number(loopLimit)) ) || 
         ( (Number(incVal) < 0) && (Number(currIndex) <= Number(loopLimit)) )
       ) {
        gsp.ParamFieldPtr += 1;  
        rLoc.ParamFieldAddr = gsp.ParamFieldPtr;
        gsp.LoopLabelPtr -= 1;
    }
    else {
        gsp.ParamFieldPtr = jumpAddr;
        currIndex = Number(currIndex) + incVal;
        li.Index = currIndex;
        rLoc.ParamFieldAddr = gsp.ParamFieldPtr;
        gsp.ReturnStack.push(li);
    }
    switch (loopLabel) {
        case "I" : gsp.LoopCurrIndexes[0] = currIndex;
            break;
       case "J" : gsp.LoopCurrIndexes[1] = currIndex;
            break;
        case "K" : gsp.LoopCurrIndexes[2] = currIndex;
            break;    
    }
    gsp.ReturnStack.push(rLoc);  
  //  gsp.MinArgsSwitch = true;
});

Compiler.method("doArgsCheckOff", function (gsp) {
    gsp.MinArgsSwitch = false;
});

Compiler.method("doArgsCheckOn", function (gsp) {
    gsp.MinArgsSwitch = true;
});

Compiler.method("doLoop", function (gsp) {
    gsp.DataStack.push(1);
    var codeField = gsp.CreoleForthBundle["doPlusLoop.IMMEDIATE"].CodeField;
    codeField(gsp);
});

Compiler.method("doIndexI", function (gsp) {
    gsp.DataStack.push(gsp.LoopCurrIndexes[0]);
});

Compiler.method("doIndexJ", function (gsp) {
    gsp.DataStack.push(gsp.LoopCurrIndexes[1]);
});

Compiler.method("doIndexK", function (gsp) {
    gsp.DataStack.push(gsp.LoopCurrIndexes[2]);
});

Compiler.method("doDoes", function (gsp) {
    var currWord = gsp.CreoleForthBundle.Address[gsp.InnerPtr];
    var codeFieldStr = currWord.CodeFieldStr;
    var execToken;
    console.log("Code field is " + currWord.CodeFieldStr);
    // DOES> has to react differently depending on whether it's inside a colon 
    // definition or not
    if (codeFieldStr === "doDoes") {
        execToken = currWord.IndexField;
        console.log("Direct execution of doDoes")
        gsp.ParamFieldPtr = currWord.ParamFieldStart;
        gsp.DataStack.push(execToken);
        gsp.CreoleForthBundle.Modules.Interpreter.doColon(gsp);
    }
    else {
        execToken = currWord.ParamField[gsp.ParamFieldPtr - 1];
        console.log(gsp.ParamFieldPtr);
        console.log("Execution token is " + execToken);
        gsp.DataStack.push(execToken);
        gsp.CreoleForthBundle.Modules.Compiler.doExecute(gsp);
    }
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
    var fqNameField = childCreoleWord.fqNameField;
    var doesAddr = gsp.CreoleForthBundle["DOES>.FORTH"].IndexField;
    var i = 0;
    var startCopyPoint;
    
    childCreoleWord.CodeField = gsp.CreoleForthBundle.Modules.Compiler.doDoes;
    childCreoleWord.CodeFieldStr = "doDoes";
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
    
    // Need the definition's address so doDoes can get it easily either when it's being
    // called from the interpreter for from within a compiled definition
    childCreoleWord.ParamField.push(newRow);
    childCreoleWord.ParamFieldStart =  childCreoleWord.ParamField.length;
    i = 0;
    while (startCopyPoint < parentCreoleWord.ParamField.length) {
        childCreoleWord.ParamField.push(parentCreoleWord.ParamField[startCopyPoint]);
        startCopyPoint += 1
        i += 1;
    }
    
    rLoc.ParamFieldAddr += i;
    gsp.ReturnStack.push(rLoc);
    gsp.CreoleForthBundle.Address[newRow] = childCreoleWord;
    gsp.CreoleForthBundle[fqNameField] = childCreoleWord;
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

Compiler.method("doImmediate", function (gsp) {
    var newRow = gsp.CreoleForthBundle.row;
    var newCreoleWord = gsp.CreoleForthBundle.Address[newRow];
    var fqName = newCreoleWord.fqNameField;
    newCreoleWord.CompileAction = "EXECUTE";
    newCreoleWord.Vocabulary = "IMMEDIATE";
    gsp.CreoleForthBundle.Address[newRow] = newCreoleWord;
    gsp.CreoleForthBundle[fqName] = newCreoleWord;
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
        /*
    var sleep = function (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    sleep(3000).then(() => {
        cfb1.Modules.CorePrims.doHello(gsp);
    });
    */
     cfb1.Modules.CorePrims.doHello(gsp);
});

AppSpec.method("doBeep", function (gsp) {
    gsp.SoundField = '<embed src="beep-08b.mp3" autostart="false" width="0" height="0" id="sound1">';
});

AppSpec.method("doSleep", function (gsp) {
   if (gsp.hasMinArgs(gsp.DataStack, 1) === false) { 
        return;
    }    

    var timeout = gsp.DataStack.pop();
    timeout *= 1000000;
/*    gsp.pause = true;

    setTimeout(function () {
        gsp.pause = false;
        gsp.onContinue();
    }, timeout);
    */
    var x = 0;
    while (x < timeout) {
        x += 1;       
    }
});


var CreoleWord =
    function (NameField, CodeField, CodeFieldStr, Vocabulary, CompileActionField, HelpField,
              PrevRowLocField, RowLocField, LinkField, IndexField, ParamField, DataField) {
        "use strict"

        if (!(this instanceof CreoleWord)) {
                      throw new Error("CreoleWord needs to be called with the new keyword");
        }
        this.NameField = NameField;
        this.CodeField = CodeField;
        this.CodeFieldStr = CodeFieldStr;
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
        this.ParamFieldStart = 0;
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

CreoleForthBundle.method("BuildPrimitive", function(name, cf, cfs, vocab, compAction, help) {
    var params = [];
    var data = [];
  
    var cw = new CreoleWord(name, cf, cfs, vocab, compAction, help, this.row - 1, this.row, this.row - 1, this.row, params, data);
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
cfb1.BuildPrimitive("ONLY", cfb1.Modules.Interpreter.doOnly, "Interpreter.doOnly", "ONLY", "EXECUTE","( -- ) Empties the vocabulary stack, then puts ONLY on it");
cfb1.BuildPrimitive("FORTH", cfb1.Modules.Interpreter.doForth, "Interpreter.doForth", "ONLY", "EXECUTE","( -- ) Puts FORTH on the vocabulary stack");
cfb1.BuildPrimitive("APPSPEC", cfb1.Modules.Interpreter.doAppSpec, "Interpreter.doAppSpec", "ONLY", "EXECUTE","( -- ) Puts APPSPEC on the vocabulary stack");
cfb1.BuildPrimitive("NOP", cfb1.Modules.CorePrims.doNOP, "CorePrims.doNOP", "ONLY", "COMPINPF","( -- ) Do-nothing primitive which is surprisingly useful");
cfb1.BuildPrimitive("__#EOL#__", cfb1.Modules.CorePrims.doNOP, "CorePrims.doNOP", "ONLY", "NOP","( -- ) EOL marker");

// dialogs and help
cfb1.BuildPrimitive("HELLO", cfb1.Modules.CorePrims.doHello, "CorePrims.doHello", "FORTH", "COMPINPF","( -- ) Pops up an alert saying Hello World");
cfb1.BuildPrimitive("TULIP", cfb1.Modules.CorePrims.doTulip, "CorePrims.doTulip", "FORTH", "COMPINPF","( -- ) Pops up an alert saying Tulip");
cfb1.BuildPrimitive("MSGBOX", cfb1.Modules.CorePrims.doMsgBox, "CorePrims.doMsgBox", "FORTH", "COMPINPF","( msg -- ) Pops up an alert saying the message");
cfb1.BuildPrimitive("EVAL", cfb1.Modules.CorePrims.doEval, "CorePrims.doEval", "FORTH", "COMPINPF","( code -- ) Evaluates raw JavaScript code - only allows alerts");
cfb1.BuildPrimitive("VLIST", cfb1.Modules.CorePrims.doVList, "CorePrims.doVList", "FORTH", "COMPINPF","( -- ) Lists the dictionary definitions");

// Basic math
cfb1.BuildPrimitive("+", cfb1.Modules.CorePrims.doPlus, "CorePrims.doPlus", "FORTH", "COMPINPF","( n1 n2 -- sum ) Adds two numbers on the stack");
cfb1.BuildPrimitive("-", cfb1.Modules.CorePrims.doMinus, "CorePrims.doMinus", "FORTH", "COMPINPF","( n1 n2 -- difference ) Subtracts two numbers on the stack");
cfb1.BuildPrimitive("*", cfb1.Modules.CorePrims.doMultiply, "CorePrims.doMultiply", "FORTH", "COMPINPF","( n1 n2 -- product ) Multiplies two numbers on the stack");
cfb1.BuildPrimitive("/", cfb1.Modules.CorePrims.doDivide, "CorePrims.doDivide", "FORTH", "COMPINPF","( n1 n2 -- quotient ) Divides two numbers on the stack");
cfb1.BuildPrimitive("%", cfb1.Modules.CorePrims.doMod, "CorePrims.doMod", "FORTH", "COMPINPF","( n1 n2 -- remainder ) Returns remainder of division operation");

// Date/time handling
cfb1.BuildPrimitive("TODAY", cfb1.Modules.CorePrims.doToday, "CorePrims.doToday", "FORTH", "COMPINPF","( -- ) Pops up today's date");
cfb1.BuildPrimitive("NOW", cfb1.Modules.CorePrims.doNow, "CorePrims.doNow", "FORTH", "COMPINPF","( --  time ) Puts the time on the stack");
cfb1.BuildPrimitive(">HHMMSS", cfb1.Modules.CorePrims.doToHoursMinSecs, "CorePrims.doToHoursMinSecs", "FORTH", "COMPINPF","( time -- ) Formats the time");

// Stack manipulation
cfb1.BuildPrimitive("DUP", cfb1.Modules.CorePrims.doDup, "CorePrims.doDup", "FORTH", "COMPINPF","( val --  val val ) Duplicates the argument on top of the stack");
cfb1.BuildPrimitive("SWAP", cfb1.Modules.CorePrims.doSwap, "CorePrims.doSwap", "FORTH", "COMPINPF","( val1 val2 -- val2 val1 ) Swaps the positions of the top two stack arguments");
cfb1.BuildPrimitive("ROT", cfb1.Modules.CorePrims.doRot, "CorePrims.doRot", "FORTH", "COMPINPF","( val1 val2 val3 -- val2 val3 val1 ) Moves the third stack argument to the top");
cfb1.BuildPrimitive("-ROT", cfb1.Modules.CorePrims.doMinusRot, "CorePrims.doMinusRot", "FORTH", "COMPINPF","( val1 val2 val3 -- val3 val1 val2 ) Moves the top stack argument to the third position");
cfb1.BuildPrimitive("NIP", cfb1.Modules.CorePrims.doNip, "CorePrims.doNip", "FORTH", "COMPINPF","( val1 val2 -- val2 ) Removes second stack argument");
cfb1.BuildPrimitive("TUCK", cfb1.Modules.CorePrims.doTuck, "CorePrims.doTuck", "FORTH", "COMPINPF","( val1 val2 -- val2 val1 val2 ) Copies top stack argument under second argument");
cfb1.BuildPrimitive("OVER", cfb1.Modules.CorePrims.doOver, "CorePrims.doOver", "FORTH", "COMPINPF","( val1 val2 -- val1 val2 val1 ) Copies second stack argument to the top of the stack");
cfb1.BuildPrimitive("DROP", cfb1.Modules.CorePrims.doDrop, "CorePrims.doDrop", "FORTH", "COMPINPF","( val -- ) Drops the argument at the top of the stack");
cfb1.BuildPrimitive("DEPTH", cfb1.Modules.CorePrims.doDepth, "CorePrims.doDepth", "FORTH", "COMPINPF","( -- n ) Returns the stack depth");

// Logical operatives
cfb1.BuildPrimitive("=", cfb1.Modules.LogicOps.doEquals, "LogicOps.doEquals", "FORTH", "COMPINPF","( val1 val2 -- flag ) -1 if equal, 0 otherwise");
cfb1.BuildPrimitive("<>", cfb1.Modules.LogicOps.doNotEquals, "LogicOps.doNotEquals", "FORTH", "COMPINPF","( val1 val2 -- flag ) 0 if equal, -1 otherwise");
cfb1.BuildPrimitive("<", cfb1.Modules.LogicOps.doLessThan, "LogicOps.doLessThan", "FORTH", "COMPINPF","( val1 val2 -- flag ) -1 if less than, 0 otherwise");
cfb1.BuildPrimitive(">", cfb1.Modules.LogicOps.doGreaterThan, "LogicOps.doGreaterThan", "FORTH", "COMPINPF","( val1 val2 -- flag ) -1 if greater than, 0 otherwise");
cfb1.BuildPrimitive("<=", cfb1.Modules.LogicOps.doLessThanOrEquals, "LogicOps.doLessThanOrEquals", "FORTH", "COMPINPF","( val1 val2 -- flag ) -1 if less than or equal to, 0 otherwise");
cfb1.BuildPrimitive(">=", cfb1.Modules.LogicOps.doGreaterThanOrEquals, "LogicOps.doGreaterThanOrEquals", "FORTH", "COMPINPF","( val1 val2 -- flag ) -1 if greater than or equal to, 0 otherwise");
cfb1.BuildPrimitive("NOT", cfb1.Modules.LogicOps.doNot, "LogicOps.doNot", "FORTH", "COMPINPF","( val -- opval ) -1 if 0, 0 otherwise");
cfb1.BuildPrimitive("AND", cfb1.Modules.LogicOps.doAnd, "LogicOps.doAnd", "FORTH", "COMPINPF","( val1 val2 -- flag ) -1 if both arguments are non-zero, 0 otherwise");
cfb1.BuildPrimitive("OR", cfb1.Modules.LogicOps.doOr, "LogicOps.doOr", "FORTH", "COMPINPF","( val1 val2 -- flag ) -1 if one or both arguments are non-zero, 0 otherwise");
cfb1.BuildPrimitive("XOR", cfb1.Modules.LogicOps.doXor, "LogicOps.doXor", "FORTH", "COMPINPF","( val1 val2 -- flag ) -1 if one and only one argument is non-zero, 0 otherwise");

// Compiler definitions
cfb1.BuildPrimitive(",", cfb1.Modules.Compiler.doComma, "Compiler.doComma", "FORTH", "COMPINPF","( n --) Compiles value off the TOS into the next parameter field cell");
cfb1.BuildPrimitive("COMPINPF", cfb1.Modules.Compiler.doComma, "Compiler.doComma", "IMMEDIATE", "COMPINPF","( n --) Does the same thing as , (comma) - given a different name for ease of reading");
cfb1.BuildPrimitive("EXECUTE", cfb1.Modules.Compiler.doExecute, "Compiler.doExecute", "FORTH", "COMPINPF","( address --) Executes the word corresponding to the address on the stack");
cfb1.BuildPrimitive(":", cfb1.Modules.Compiler.CompileColon, "Compiler.CompileColon", "FORTH", "COMPINPF","( -- ) Starts compilation of a colon definition");
cfb1.BuildPrimitive(";", cfb1.Modules.Compiler.doSemi, "Compiler.doSemi", "IMMEDIATE", "EXECUTE","( -- ) Terminates compilation of a colon definition");
cfb1.BuildPrimitive("COMPLIT", cfb1.Modules.Compiler.CompileLiteral, "Compiler.CompileLiteral", "IMMEDIATE", "EXECUTE","( -- ) Compiles doLit and a literal into the dictionary");
cfb1.BuildPrimitive("doLiteral", cfb1.Modules.Compiler.doLiteral, "Compiler.doLiteral", "IMMEDIATE", "NOP","( -- lit ) Run-time code that pushes a literal onto the stack");
cfb1.BuildPrimitive("HERE", cfb1.Modules.Compiler.doHere, "Compiler.doHere", "FORTH", "COMPINPF","( -- location ) Returns address of the next available dictionary location");
cfb1.BuildPrimitive("CREATE", cfb1.Modules.Compiler.doCreate, "Compiler.doCreate", "FORTH", "COMPINPF","CREATE <name>. Adds a named entry into the dictionary");

cfb1.BuildPrimitive("doDoes", cfb1.Modules.Compiler.DoDoes, "Compiler.DoDoes", "IMMEDIATE", "COMPINPF", "( address -- ) Run-time code for DOES>");
cfb1.BuildPrimitive("DOES>", cfb1.Modules.Compiler.CompileDoes, "Compiler.CompileDoes", "FORTH", "COMPINPF", 
                    "DOES> <list of runtime actions>. When defining word is created, copies code following it into the child definition");

cfb1.BuildPrimitive("@", cfb1.Modules.Compiler.doFetch, "Compiler.doFetch", "FORTH", "COMPINPF","( addr -- val ) Fetches the value in the param field  at addr");
cfb1.BuildPrimitive("!", cfb1.Modules.Compiler.doStore, "Compiler.doStore", "FORTH", "COMPINPF","( val addr --) Stores the value in the param field  at addr");
cfb1.BuildPrimitive("DEFINITIONS", cfb1.Modules.Compiler.doSetCurrentToContext, "Compiler.doSetCurrentToContext", "FORTH",
                    "COMPINPF","(  -- ). Sets the current (compilation) vocabulary to the context vocabulary (the one on top of the vocabulary stack)");
cfb1.BuildPrimitive("IMMEDIATE", cfb1.Modules.Compiler.doImmediate, "Compiler.doImmediate", "FORTH", "COMPINPF","( -- ) Flags a word as immediate (executes instead of compiling inside a colon definition)");

// Branching compiler definitions
cfb1.BuildPrimitive("IF", cfb1.Modules.Compiler.CompileIf, "Compiler.CompileIf", "IMMEDIATE", "EXECUTE","( -- location ) Compile-time code for IF");
cfb1.BuildPrimitive("ELSE", cfb1.Modules.Compiler.CompileElse, "Compiler.CompileElse", "IMMEDIATE", "EXECUTE","( -- location ) Compile-time code for ELSE");
cfb1.BuildPrimitive("THEN", cfb1.Modules.Compiler.CompileThen, "Compiler.CompileThen", "IMMEDIATE", "EXECUTE","( -- location ) Compile-time code for THEN");
cfb1.BuildPrimitive("0BRANCH", cfb1.Modules.Compiler.do0Branch, "Compiler.do0Branch", "IMMEDIATE", "NOP","( flag -- ) Run-time code for IF");
cfb1.BuildPrimitive("JUMP", cfb1.Modules.Compiler.doJump, "Compiler.doJump", "IMMEDIATE", "NOP","( -- ) Jumps unconditionally to the parameter field location next to it and is compiled by ELSE");
cfb1.BuildPrimitive("doElse", cfb1.Modules.CorePrims.doNOP, "CorePrims.doNOP", "IMMEDIATE", "NOP","( -- ) Run-time code for ELSE");
cfb1.BuildPrimitive("doThen", cfb1.Modules.CorePrims.doNOP, "CorePrims.doNOP", "IMMEDIATE", "NOP","( -- ) Run-time code for THEN");
cfb1.BuildPrimitive("BEGIN", cfb1.Modules.Compiler.CompileBegin, "Compiler.CompileBegin", "IMMEDIATE", "EXECUTE","( -- beginLoc ) Compile-time code for BEGIN");
cfb1.BuildPrimitive("UNTIL", cfb1.Modules.Compiler.CompileUntil, "Compiler.CompileUntil", "IMMEDIATE", "EXECUTE","( beginLoc -- ) Compile-time code for UNTIL");
cfb1.BuildPrimitive("doBegin", cfb1.Modules.CorePrims.doNOP, "CorePrims.doNOP", "IMMEDIATE", "NOP","( -- ) Run-time code for BEGIN");
cfb1.BuildPrimitive("DO", cfb1.Modules.Compiler.CompileDo, "Compiler.CompileDo", "IMMEDIATE", "EXECUTE","( -- beginLoc ) Compile-time code for DO");
cfb1.BuildPrimitive("LOOP", cfb1.Modules.Compiler.CompileLoop, "Compiler.CompileLoop", "IMMEDIATE", "EXECUTE","( -- beginLoc ) Compile-time code for LOOP");
cfb1.BuildPrimitive("+LOOP", cfb1.Modules.Compiler.CompilePlusLoop, "Compiler.CompilePlusLoop", "IMMEDIATE", "EXECUTE","( -- beginLoc ) Compile-time code for +LOOP");
cfb1.BuildPrimitive("doStartDo", cfb1.Modules.Compiler.doStartDo, "Compiler.doStartDo", "IMMEDIATE", "COMPINPF","( start end -- ) Starts off the Do by getting the start and end");
cfb1.BuildPrimitive("doDo", cfb1.Modules.CorePrims.doNOP, "CorePrims.doNOP", "IMMEDIATE", "COMPINPF","( -- ) Marker for DoLoop to return to");
cfb1.BuildPrimitive("doLoop", cfb1.Modules.Compiler.doLoop, "Compiler.doLoop", "IMMEDIATE", "COMPINPF","( -- ) Loops back to doDo until the start equals the end");
cfb1.BuildPrimitive("doPlusLoop", cfb1.Modules.Compiler.doPlusLoop, "Compiler.doPlusLoop", "IMMEDIATE", "COMPINPF","( inc -- ) Loops back to doDo until the start >= the end and increments with inc");
cfb1.BuildPrimitive("I", cfb1.Modules.Compiler.doIndexI, "Compiler.doIndexI", "FORTH", "COMPINPF","( -- index ) Rturns the index of I");
cfb1.BuildPrimitive("J", cfb1.Modules.Compiler.doIndexJ, "Compiler.doIndexJ", "FORTH", "COMPINPF","( -- index ) Rturns the index of J");
cfb1.BuildPrimitive("K", cfb1.Modules.Compiler.doIndexK, "Compiler.doIndexK", "FORTH", "COMPINPF","( -- index ) Rturns the index of K");
cfb1.BuildPrimitive("CHKOFF", cfb1.Modules.Compiler.doArgsCheckOff, "Compiler.doArgsCheckOff", "FORTH", "COMPINPF","( -- ) Turns check for stack args off");
cfb1.BuildPrimitive("CHKON", cfb1.Modules.Compiler.doArgsCheckOn, "Compiler.doArgsCheckOn", "FORTH", "COMPINPF","( -- ) Turns check for stack args on");
cfb1.BuildPrimitive("\\", cfb1.Modules.Compiler.doSingleLineCmts, "Compiler.doSingleLineCmts", "FORTH", gsp.BFC.ExecZeroAction,"( -- ) Single-line comment handling");
cfb1.BuildPrimitive("(", cfb1.Modules.Compiler.doParenCmts, "Compiler.doParenCmts", "FORTH", gsp.BFC.ExecZeroAction,"( -- ) Multiline comment handling");
cfb1.BuildPrimitive("\{", cfb1.Modules.Compiler.doCompileList, "Compiler.doCompileList", "FORTH", gsp.BFC.ExecZeroAction,"( -- list ) List compiler");
cfb1.BuildPrimitive("BEEP", cfb1.Modules.AppSpec.doBeep, "AppSpec.doBeep", "APPSPEC", "COMPINPF","( -- ) Plays short beeping sound");
cfb1.BuildPrimitive("SLEEP", cfb1.Modules.AppSpec.doSleep, "AppSpec.doSleep", "APPSPEC", "COMPINPF","( n -- ) Sleeps n milliseconds");
cfb1.BuildPrimitive("TEST", cfb1.Modules.AppSpec.doTest, "AppSpec.doTest", "APPSPEC", "COMPINPF","( -- ) Do what you like here");

cfb1.BuildHighLevel(gsp, ": CONSTANT CREATE , DOES> @ ;", "( val -- ) CONSTANT <name>. Defining word for scalar constants");
cfb1.BuildHighLevel(gsp, ": VARIABLE CREATE 0 , ;", "VARIABLE <name>. Used for simple scalar data storage and retrieval");
// APPSPEC is a convenient vocabulary to group your application specific primitives in
gsp.CurrentVocab = "APPSPEC";
cfb1.BuildHighLevel(gsp, ": DOTEST DO HELLO LOOP ;", "Simple testing definition");
cfb1.BuildHighLevel(gsp, ": TL2 CHKOFF DO I 3 0 DO J LOOP LOOP CHKON ;", "Simple testing definition 2");
