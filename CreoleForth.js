Function.prototype.method = function (name, func) {
    if (!this.prototype[name]) {
        this.prototype[name] = func;
        return this;
    }
};

Number.method('integer', function () {
    return Math[this < 0 ? 'ceil' : 'floor'](this);
});

String.method('trim', function () {
    return this.replace(/^\s+|\s$/g, '');
});

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
    this.PAD = [];
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
    this.Scratch = null;
};

// These objects are to be stored on the return stack
var ReturnLoc = function (dictAddr, pfAddr) {
    "use strict";
    if (!(this instanceof ReturnLoc)) {
        throw new Error("ReturnLoc needs to be called with the new keyword");
    }
    this.DictAddr = dictAddr;
    this.ParamFieldAddr = pfAddr;
};

// Colon definitions are built in pad - each new entry is a triplet consisting of the
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
    this.title = "Core Primitives grouping";
};

CorePrims.method("doNOP", function (gsp) {
        // Does exactly nothing
     //   alert("I do nothing");
    gsp.Scratch = null;
});

CorePrims.method("doPlus", function (gsp) {
    var val2 = gsp.DataStack.pop();
    var val1 = gsp.DataStack.pop();
    var sum = Number(val1) + Number(val2);
    gsp.DataStack.push(sum);
});

CorePrims.method("doMinus", function (gsp) {
    var val2 = gsp.DataStack.pop();
    var val1 = gsp.DataStack.pop();
    var difference = Number(val1) - Number(val2);
    gsp.DataStack.push(difference);
});

CorePrims.method("doMultiply", function (gsp) {
    var val2 = gsp.DataStack.pop();
    var val1 = gsp.DataStack.pop();
    var product = Number(val2) * Number(val1);
    gsp.DataStack.push(product);
});

CorePrims.method("doDivide", function (gsp) {
    var val2 = gsp.DataStack.pop();
    var val1 = gsp.DataStack.pop();
    var quotient = Number(val1) / Number(val2);
    gsp.DataStack.push(quotient);
});

CorePrims.method("doMod", function (gsp) {
    var val2 = gsp.DataStack.pop();
    var val1 = gsp.DataStack.pop();
    var remainder = Number(val1) % Number(val2);
    gsp.DataStack.push(remainder);
});

CorePrims.method("doDup", function (gsp) {
    var val = gsp.DataStack.pop();
    gsp.DataStack.push(val);
    gsp.DataStack.push(val);    
});

CorePrims.method("doSwap", function (gsp) {
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
    gsp.DataStack.push(val3);    
    gsp.DataStack.push(val1);
    gsp.DataStack.push(val2);
    
});

CorePrims.method("doNip", function (gsp) {
    var val1 = gsp.DataStack.pop();
    gsp.DataStack.pop();
    gsp.DataStack.push(val1);   
});

CorePrims.method("doTuck", function (gsp) {
    var val2 = gsp.DataStack.pop();
    var val1 = gsp.DataStack.pop();
    gsp.DataStack.push(val2);
    gsp.DataStack.push(val1);
    gsp.DataSta
});

CorePrims.method("doOver", function (gsp) {
    var val2 = gsp.DataStack.pop();
    var val1 = gsp.DataStack.pop();
    gsp.DataStack.push(val1);
    gsp.DataStack.push(val2);
    gsp.DataStack.push(val1);
});

CorePrims.method("doDrop", function (gsp) {
    gsp.DataStack.pop();
});

CorePrims.method("doDepth", function (gsp) {
    gsp.DataStack.push(gsp.DataStack.length);
});

CorePrims.method("doHello", function (gsp) {
    gsp.PAD = "Hello World";
    alert(gsp.PAD);
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
    gsp.ParsedInput = gsp.InputArea.split(/\s+/);
});

Interpreter.method("doInner", function (gsp) {
    gsp.CreoleForthBundle.Address[gsp.InnerPtr].CodeField(gsp);   
});

Interpreter.method("doColon", function(gsp) {
    gsp.ParamFieldPtr = 0;
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
        searchVocabPtr = 0;
        while (searchVocabPtr < gsp.VocabStack.length) {
            fqWord = rawWord.toUpperCase() + "." + gsp.VocabStack[searchVocabPtr];
            if (fqWord in gsp.CreoleForthBundle) {
                gsp.InnerPtr = gsp.CreoleForthBundle[fqWord].IndexField;
                this.doInner(gsp);
                isFound = true;
                break;
            }
            else {
                searchVocabPtr += 1;
            }
        }
        if (isFound === false) {
            gsp.DataStack.push(rawWord);
        }
        gsp.OuterPtr += 1;     
    }    
});

var Compiler = function () {
    "use strict";
    if (!(this instanceof Compiler)) {
                      throw new Error("Compiler needs to be called with the new keyword");
    }
    this.title = "Compiler grouping";
};

var LogicOps = function () {
    "use strict";
    if (!(this instanceof LogicOps)) {
                      throw new Error("LogicOps needs to be called with the new keyword");
    }
    this.title = "Logical operatives grouping";
};

LogicOps.method("doEquals", function (gsp) {
    var val1 = gsp.DataStack.pop();
    var val2 = gsp.DataStack.pop();
    if (val1 === val2) {
        gsp.DataStack.push(-1);
    } 
    else {
        gsp.DataStack.push(0);
    }
});

LogicOps.method("doNotEquals", function (gsp) {
    var val1 = gsp.DataStack.pop();
    var val2 = gsp.DataStack.pop();
    if (val1 === val2) {
        gsp.DataStack.push(0);
    } 
    else {
        gsp.DataStack.push(-1);
    }
});

LogicOps.method("doLessThan", function (gsp) {
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
    var val = gsp.DataStack.pop();
    if (val === 0) {
        gsp.DataStack.push(-1);
    }
    else {
        gsp.DataStack.push(0);
    }
});

LogicOps.method("doAnd", function (gsp) {
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
    var val1 = gsp.DataStack.pop();
    var val2 = gsp.DataStack.pop();
    if ((val1 != 0 || val2 != 0) && ! (val1 === 0 && val2 === 0)) {
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

var CreoleWord =
    function (NameField, CodeField, Vocabulary, CompileActionField, HelpField,
              PrevRowLocField, RowLocField, LinkField, IndexField, ParamField) {
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
};

/*
Function.prototype.method = function (name, func) {
    if (!this.prototype[name]) {
        this.prototype[name] = func;
        return this;
    }
}
*/

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
  
    var cw = new CreoleWord(name, cf, vocab, compAction, help, this.row - 1, this.row, this.row - 1, this.row, params);
    var fqName = name + "." + vocab;
    this[fqName] = cw;
    this.Address[this.row] = this[fqName];
    this.row += 1;
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

// BuildPrimitive(objFbps As ForthBundleParamSet, psName As String, psClassModule As String, psCodeField As String, psVocab As String, psCompileAction As String, psHelp As String)
var cfb1 = new CreoleForthBundle(modules);
gsp.CreoleForthBundle = cfb1;

// The onlies
cfb1.BuildPrimitive("ONLY", cfb1.Modules.Interpreter.doOnly, "ONLY", "EXECUTE","( -- ) Empties the vocabulary stack, then puts ONLY on it");
cfb1.BuildPrimitive("FORTH", cfb1.Modules.Interpreter.doForth, "ONLY", "EXECUTE","( -- ) Puts FORTH on the vocabulary stack");
cfb1.BuildPrimitive("NOP", cfb1.Modules.CorePrims.doNOP, "ONLY", "COMPF","( -- ) Do-nothing primitive which is surprisingly useful");

cfb1.BuildPrimitive("HELLO", cfb1.Modules.CorePrims.doHello, "FORTH", "COMPF","( -- ) Pops up an alert saying Hello World");

// Basic math
cfb1.BuildPrimitive("+", cfb1.Modules.CorePrims.doPlus, "FORTH", "COMPF","( n1 n2 -- sum ) Adds two numbers on the stack");
cfb1.BuildPrimitive("-", cfb1.Modules.CorePrims.doMinus, "FORTH", "COMPF","( n1 n2 -- difference ) Subtracts two numbers on the stack");
cfb1.BuildPrimitive("*", cfb1.Modules.CorePrims.doMultiply, "FORTH", "COMPF","( n1 n2 -- product ) Multiplies two numbers on the stack");
cfb1.BuildPrimitive("/", cfb1.Modules.CorePrims.doDivide, "FORTH", "COMPF","( n1 n2 -- quotient ) Divides two numbers on the stack");
cfb1.BuildPrimitive("%", cfb1.Modules.CorePrims.doMod, "FORTH", "COMPF","( n1 n2 -- remainder ) Returns remainder of division operation");

// Stack manipulation
cfb1.BuildPrimitive("DUP", cfb1.Modules.CorePrims.doDup, "FORTH", "COMPF","( val --  val val ) Duplicates the argument on top of the stack");
cfb1.BuildPrimitive("SWAP", cfb1.Modules.CorePrims.doSwap, "FORTH", "COMPF","( val1 val2 -- val2 val1 ) Swaps the positions of the top two stack arguments");
cfb1.BuildPrimitive("ROT", cfb1.Modules.CorePrims.doRot, "FORTH", "COMPF","( val1 val2 val3 -- val2 val3 val1 ) Moves the third stack argument to the top");
cfb1.BuildPrimitive("-ROT", cfb1.Modules.CorePrims.doMinusRot, "FORTH", "COMPF","( val1 val2 val3 -- val3 val1 val2 ) Moves the top stack argument to the third position");
cfb1.BuildPrimitive("NIP", cfb1.Modules.CorePrims.doNip, "FORTH", "COMPF","( val1 val2 -- val2 ) Removes second stack argument");
cfb1.BuildPrimitive("TUCK", cfb1.Modules.CorePrims.doTuck, "FORTH", "COMPF","( val1 val2 -- val2 val1 val2 ) Copies top stack argument under second argument");
cfb1.BuildPrimitive("OVER", cfb1.Modules.CorePrims.doOver, "FORTH", "COMPF","( val1 val2 -- val1 val2 val1 ) Copies second stack argument to the top of the stack");
cfb1.BuildPrimitive("DROP", cfb1.Modules.CorePrims.doDrop, "FORTH", "COMPF","( val -- ) Drops the argument at the top of the stack");
cfb1.BuildPrimitive("DEPTH", cfb1.Modules.CorePrims.doDepth, "FORTH", "COMPF","( -- n ) Returns the stack depth");

// Logical operatives
cfb1.BuildPrimitive("=", cfb1.Modules.LogicOps.doEquals, "FORTH", "COMPF","( val1 val2 -- flag ) -1 if equal, 0 otherwise");
cfb1.BuildPrimitive("<>", cfb1.Modules.LogicOps.doNotEquals, "FORTH", "COMPF","( val1 val2 -- flag ) 0 if equal, -1 otherwise");
cfb1.BuildPrimitive("<", cfb1.Modules.LogicOps.doLessThan, "FORTH", "COMPF","( val1 val2 -- flag ) -1 if less than, 0 otherwise");
cfb1.BuildPrimitive(">", cfb1.Modules.LogicOps.doGreaterThan, "FORTH", "COMPF","( val1 val2 -- flag ) -1 if greater than, 0 otherwise");
cfb1.BuildPrimitive("<=", cfb1.Modules.LogicOps.doLessThanOrEquals, "FORTH", "COMPF","( val1 val2 -- flag ) -1 if less than or equal to, 0 otherwise");
cfb1.BuildPrimitive(">=", cfb1.Modules.LogicOps.doGreaterThanOrEquals, "FORTH", "COMPF","( val1 val2 -- flag ) -1 if greater than or equal to, 0 otherwise");
cfb1.BuildPrimitive("NOT", cfb1.Modules.LogicOps.doNot, "FORTH", "COMPF","( val -- opval ) -1 if 0, 0 otherwise");
cfb1.BuildPrimitive("AND", cfb1.Modules.LogicOps.doAnd, "FORTH", "COMPF","( val1 val2 -- flag ) -1 if both arguments are non-zero, 0 otherwise");
cfb1.BuildPrimitive("OR", cfb1.Modules.LogicOps.doOr, "FORTH", "COMPF","( val1 val2 -- flag ) -1 if one or both arguments are non-zero, 0 otherwise");
cfb1.BuildPrimitive("XOR", cfb1.Modules.LogicOps.doXor, "FORTH", "COMPF","( val1 val2 -- flag ) -1 if one and only one argument is non-zero, 0 otherwise");

// # 28 
cfb1.BuildPrimitive("TESTCOLON", cfb1.Modules.Interpreter.doColon, "FORTH", "COMPF","( val1 val2 -- flag ) Test for colon definition");
cfb1["TESTCOLON.FORTH"].ParamField = [3, 2, 3];
cfb1.Address[28].ParamField = [3, 2, 3];
