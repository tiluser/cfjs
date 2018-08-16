Function.prototype.method=function(e,o){if(!this.prototype[e])return this.prototype[e]=o,this.prototype.toString=e,this},Number.method("integer",function(){return Math[this<0?"ceil":"floor"](this)}),String.method("trim",function(){return this.replace(/^\s+|\s$/g,"")});var BasicForthConstants=function(){"use strict";if(!(this instanceof BasicForthConstants))throw new Error("BasicForthConstants needs to be called with the new keyword");this.SmudgeFlag="SMUDGED",this.ImmediateVocab="IMMEDIATE",this.PrefilterVocab="PREFILTER",this.PostfilterVocab="POSTFILTER",this.ExecZeroAction="EXEC0",this.CompLitAction="COMPLIT"},GlobalSimpleProps=function(e){"use strict";if(!(this instanceof GlobalSimpleProps))throw new Error("GlobalSimpleProps needs to be called with the new keyword");this.CreoleForthBundle=e,this.DataStack=[],this.ReturnStack=[],this.VocabStack=[],this.PrefilterStack=[],this.PostfilterStack=[],this.PADarea=[],this.ParsedInput=[],this.loopLabels=["I","J","K"],this.LoopLabelPtr=0,this.LoopCurrIndexes=[0,0,0],this.OuterPtr=0,this.InnerPtr=0,this.ParamFieldPtr=0,this.InputArea="",this.OutputArea="",this.CurrentVocab="",this.HelpCommentField="",this.SoundField="",this.CompiledList=[],this.BFC=new BasicForthConstants,this.MinArgsSwitch=!0,this.pause=!1,this.onContinue=null};GlobalSimpleProps.method("cleanFields",function(){this.DataStack=[],this.ReturnStack=[],this.PADarea=[],this.ParsedInput=[],this.LoopLabelPtr=0,this.LoopCurrIndexes=[0,0,0],this.OuterPtr=0,this.InnerPtr=0,this.ParamFieldPtr=0,this.InputArea="",this.OutputArea="",this.HelpCommentField="",this.SoundField="",this.CompiledList=[],this.pause=!1}),GlobalSimpleProps.method("hasMinArgs",function(e,o){var t;if(!1!==this.MinArgsSwitch){for(t=e.length-1;0<=t;t--)if(""==e[t]||e.length<o)return alert("Error: Stack underflow"),this.cleanFields(),!1;return!0}});var ReturnLoc=function(e,o){"use strict";if(!(this instanceof ReturnLoc))throw new Error("ReturnLoc needs to be called with the new keyword");this.DictAddr=e,this.ParamFieldAddr=o},LoopInfo=function(e,o,t){"use strict";if(!(this instanceof LoopInfo))throw new Error("LoopInfo needs to be called with the new keyword");this.Label=e,this.Index=o,this.Limit=t},CompileInfo=function(e,o,t){"use strict";if(!(this instanceof CompileInfo))throw new Error("CompileInfo needs to be called with the new keyword");this.FQName=e,this.Address=o,this.CompileAction=t},CorePrims=function(){"use strict";if(!(this instanceof CorePrims))throw new Error("CorePrims needs to be called with the new keyword");if(this.title="Core Primitives grouping",!(this instanceof CorePrims))throw new Error("CorePrims needs to be called with the new keyword");this.title="Core Primitives grouping"};CorePrims.method("doNOP",function(e){}),CorePrims.method("doPlus",function(e){if(!1!==e.hasMinArgs(e.DataStack,2)){var o=e.DataStack.pop(),t=e.DataStack.pop(),r=Number(t)+Number(o);e.DataStack.push(r)}}),CorePrims.method("doMinus",function(e){if(!1!==e.hasMinArgs(e.DataStack,2)){var o=e.DataStack.pop(),t=e.DataStack.pop(),r=Number(t)-Number(o);e.DataStack.push(r)}}),CorePrims.method("doMultiply",function(e){if(!1!==e.hasMinArgs(e.DataStack,2)){var o=e.DataStack.pop(),t=e.DataStack.pop(),r=Number(o)*Number(t);e.DataStack.push(r)}}),CorePrims.method("doDivide",function(e){if(!1!==e.hasMinArgs(e.DataStack,2)){var o=e.DataStack.pop(),t=e.DataStack.pop(),r=Number(t)/Number(o);e.DataStack.push(r)}}),CorePrims.method("doMod",function(e){if(!1!==e.hasMinArgs(e.DataStack,2)){var o=e.DataStack.pop(),t=e.DataStack.pop(),r=Number(t)%Number(o);e.DataStack.push(r)}}),CorePrims.method("doDup",function(e){if(!1!==e.hasMinArgs(e.DataStack,1)){var o=e.DataStack.pop();e.DataStack.push(o),e.DataStack.push(o)}}),CorePrims.method("doSwap",function(e){if(!1!==e.hasMinArgs(e.DataStack,2)){var o=e.DataStack.pop(),t=e.DataStack.pop();e.DataStack.push(o),e.DataStack.push(t)}}),CorePrims.method("doRot",function(e){if(!1!==e.hasMinArgs(e.DataStack,3)){var o=e.DataStack.pop(),t=e.DataStack.pop(),r=e.DataStack.pop();e.DataStack.push(t),e.DataStack.push(o),e.DataStack.push(r)}}),CorePrims.method("doMinusRot",function(e){if(!1!==e.hasMinArgs(e.DataStack,3)){var o=e.DataStack.pop(),t=e.DataStack.pop(),r=e.DataStack.pop();e.DataStack.push(o),e.DataStack.push(r),e.DataStack.push(t)}}),CorePrims.method("doNip",function(e){if(!1!==e.hasMinArgs(e.DataStack,2)){var o=e.DataStack.pop();e.DataStack.pop(),e.DataStack.push(o)}}),CorePrims.method("doTuck",function(e){if(!1!==e.hasMinArgs(e.DataStack,2)){var o=e.DataStack.pop(),t=e.DataStack.pop();e.DataStack.push(o),e.DataStack.push(t),e.DataSta}}),CorePrims.method("doOver",function(e){if(!1!==e.hasMinArgs(e.DataStack,2)){var o=e.DataStack.pop(),t=e.DataStack.pop();e.DataStack.push(t),e.DataStack.push(o),e.DataStack.push(t)}}),CorePrims.method("doDrop",function(e){var o=e.DataStack.length;!1!==e.hasMinArgs(e.DataStack,1)&&(e.DataStack.pop(),o===e.DataStack.length&&(alert("Error: stack underflow"),e.cleanFields()))}),CorePrims.method("doDepth",function(e){e.DataStack.push(e.DataStack.length-1)}),CorePrims.method("doHello",function(e){alert("Hello World")}),CorePrims.method("doTulip",function(e){alert("Tulip")}),CorePrims.method("doMsgBox",function(e){var o=e.DataStack.pop();alert(o)}),CorePrims.method("doEval",function(gsp){var jsCode=gsp.DataStack.pop();-1===jsCode.search(/^alert/)?alert("Sorry, only alerts allowed"):eval(jsCode)}),CorePrims.method("doVList",function(e){var o,t,r=[];for(r[0]=e.CreoleForthBundle.row+1+" definitions<br><table>",r.push("<th>Index</th><th>Name</th><th>Vocabulary</th><th>Code Field</th><th>Param Field</th><th>Help Field</th>"),o=0;o<=e.CreoleForthBundle.row;o++)null!=e.CreoleForthBundle.Address[o]&&r.push("<tr><td>"+e.CreoleForthBundle.Address[o].IndexField+"</td><td>"+e.CreoleForthBundle.Address[o].NameField+"</td><td>"+e.CreoleForthBundle.Address[o].Vocabulary+"</td><td>"+e.CreoleForthBundle.Address[o].CodeFieldStr+"</td><td>"+e.CreoleForthBundle.Address[o].ParamField+"</td><td>"+e.CreoleForthBundle.Address[o].HelpField+"</td></tr>");r.push("</table>"),t=r.join("\n"),e.HelpCommentField=t}),CorePrims.method("doToday",function(e){var o,t=new Date,r=t.getDate(),i=t.getMonth()+1,a=t.getFullYear(),d=[];r=r<10?"0"+r:r,i=i<10?"0"+i:i,d.push(i),d.push(r),d.push(a),o=d.join("/"),alert(o)}),CorePrims.method("doNow",function(e){e.DataStack.push(Date.now())}),CorePrims.method("doToHoursMinSecs",function(e){if(!1!==e.hasMinArgs(e.DataStack,1)){var o,t=Math.abs(e.DataStack.pop())/1e3,r=Math.floor(t/3600),i=t-3600*r,a=Math.floor(i/60),d=i-60*a,l=[];r=r<10?"0"+r:r,a=a<10?"0"+a:a,d=d<10?"0"+d:d,l.push(r),l.push(a),l.push(d),o=l.join(":"),alert(o)}});var Interpreter=function(){"use strict";if(!(this instanceof Interpreter))throw new Error("Interpreter needs to be called with the new keyword");this.title="Interpreter grouping"};Interpreter.method("doParseInput",function(e){var o,t=e.InputArea.split(/\n/);for(o=0;o<t.length;o++)t[o]+="  __#EOL#__";var r=t.join(" ");e.ParsedInput=r.trim().split(/\s+/)}),Interpreter.method("doInner",function(e){e.CreoleForthBundle.Address[e.InnerPtr].CodeField(e)}),Interpreter.method("doColon",function(e){for(var o,t,r,i=e.CreoleForthBundle.Address[e.InnerPtr].ParamField;e.ParamFieldPtr<i.length;)o=i[e.ParamFieldPtr],t=e.CreoleForthBundle.Address[o].CodeField,e.ParamFieldPtr+=1,r=new ReturnLoc(e.InnerPtr,e.ParamFieldPtr),e.ReturnStack.push(r),t(e),r=e.ReturnStack.pop(),e.InnerPtr=r.DictAddr,e.ParamFieldPtr=r.ParamFieldAddr}),Interpreter.method("doOnly",function(e){e.VocabStack=[],e.VocabStack.push("ONLY")}),Interpreter.method("doForth",function(e){e.VocabStack.push("FORTH")}),Interpreter.method("doAppSpec",function(e){e.VocabStack.push("APPSPEC")}),Interpreter.method("doOuter",function(e){var o,t="",r="",i=!1;for(e.OuterPtr=0,e.InnerPtr=0,e.ParamFieldPtr=0;e.OuterPtr<e.ParsedInput.length;)if(!1===e.pause){for(t=e.ParsedInput[e.OuterPtr],o=e.VocabStack.length-1;0<=o;){if((r=t.toUpperCase()+"."+e.VocabStack[o])in e.CreoleForthBundle){e.InnerPtr=e.CreoleForthBundle[r].IndexField,this.doInner(e),i=!0;break}o-=1}!1===i&&(1===e.DataStack.length&&""==e.DataStack[0]?e.DataStack[0]=t:e.DataStack.push(t)),e.OuterPtr+=1,i=!1}});var Compiler=function(){"use strict";if(!(this instanceof Compiler))throw new Error("Compiler needs to be called with the new keyword");this.title="Compiler grouping"};Compiler.method("doComma",function(e){if(!1!==e.hasMinArgs(e.DataStack,1)){var o=e.CreoleForthBundle.row,t=e.DataStack.pop(),r=e.CreoleForthBundle.Address[o];r.ParamField.push(t),r.ParamFieldStart+=1,e.ParamFieldPtr=r.ParamField.length-1}}),Compiler.method("doSingleLineCmts",function(e){for(;"__#EOL#__"!=e.ParsedInput[e.OuterPtr];)e.OuterPtr+=1}),Compiler.method("doParenCmts",function(e){for(;-1===e.ParsedInput[e.OuterPtr].search(/\)/);)e.OuterPtr+=1}),Compiler.method("doCompileList",function(e){var o;for(e.CompiledList=[],e.OuterPtr+=1;-1===e.ParsedInput[e.OuterPtr].search(/\}/);)e.CompiledList.push(e.ParsedInput[e.OuterPtr]),e.OuterPtr+=1;o=e.CompiledList.join(" "),e.DataStack.push(o)}),Compiler.method("doExecute",function(e){if(!1!==e.hasMinArgs(e.DataStack,1)){var o=e.DataStack.pop();e.InnerPtr=o,e.CreoleForthBundle.Address[o].CodeField(e)}}),Compiler.method("doHere",function(e){var o=e.CreoleForthBundle.row+1;e.DataStack.push(o)}),Compiler.method("doMyAddress",function(e){var o=e.CreoleForthBundle.Address[e.InnerPtr];e.DataStack.push(o.IndexField)}),Compiler.method("doCreate",function(e){var o=e.CreoleForthBundle.row+1,t=e.ParsedInput[e.OuterPtr+1],r=new CreoleWord(t,e.CreoleForthBundle.Modules.Compiler.doMyAddress,"Compiler.doMyAddress",e.CurrentVocab,"COMPINPF","TODO: ",o-1,o,o-1,o,[],[]),i=t+"."+e.CurrentVocab;e.CreoleForthBundle[i]=r,e.CreoleForthBundle.row+=1,e.CreoleForthBundle.Address[e.CreoleForthBundle.row]=e.CreoleForthBundle[i],e.OuterPtr+=2}),Compiler.method("CompileColon",function(e){var o,t,r,i,a,d,l=e.CreoleForthBundle.row+1,s=e.ParsedInput[e.OuterPtr+1],n=!1,c=-1,u=new GlobalSimpleProps(e.CreoleForthBundle);for(d=0;d<e.ParsedInput.length;d++)":"===e.ParsedInput[d]&&(c=d),";"===e.ParsedInput[d]&&c<d&&(n=!0);if(!1===n)return alert("Error: colon def must have matching semicolon"),void e.cleanFields();e.VocabStack.push(e.BFC.ImmediateVocab);var p,m=new CreoleWord(s,e.CreoleForthBundle.Modules.Interpreter.doColon,"Interpreter.doColon",e.CurrentVocab,"COMPINPF","TODO: ",l-1,l,l-1,l,[],[]),h=s+"."+e.CurrentVocab+"."+e.BFC.SmudgeFlag,P=s+"."+e.CurrentVocab;for(e.CreoleForthBundle[h]=m,e.CreoleForthBundle.row+=1,e.CreoleForthBundle.Address[e.CreoleForthBundle.row]=e.CreoleForthBundle[h],e.OuterPtr+=2;e.OuterPtr<e.ParsedInput.length&&e.VocabStack[e.VocabStack.length-1]===e.BFC.ImmediateVocab&&";"!=e.ParsedInput[e.OuterPtr];){for(o=e.ParsedInput[e.OuterPtr],t=e.VocabStack.length-1,r=!1;0<=t;){if((p=o.toUpperCase()+"."+e.VocabStack[t])in e.CreoleForthBundle){(i=e.CreoleForthBundle[p].CompileActionField)!=e.BFC.ExecZeroAction?(a=new CompileInfo(p,e.CreoleForthBundle[p].IndexField,i),e.PADarea.push(a)):(0,e.CreoleForthBundle[p].CodeField)(e),r=!0;break}t-=1}!1===r&&(a=new CompileInfo(o,o,e.BFC.CompLitAction),e.PADarea.push(a)),e.OuterPtr+=1}for(d=0,u.VocabStack=e.VocabStack;d<e.PADarea.length;)a=e.PADarea[d],u.DataStack.push(a.Address),u.InputArea=a.CompileAction,u.CreoleForthBundle.Modules.Interpreter.doParseInput(u),u.CreoleForthBundle.Modules.Interpreter.doOuter(u),d+=1;u.InputArea=";",u.CreoleForthBundle.Modules.Interpreter.doParseInput(u),u.CreoleForthBundle.Modules.Interpreter.doOuter(u),m=u.CreoleForthBundle.Address[u.CreoleForthBundle.row],e.CreoleForthBundle[P]=m,delete e.CreoleForthBundle[h],e.VocabStack.pop(),e.PADarea=[]}),Compiler.method("doSemi",function(e){e.PADarea=[],console.log("Compilation is complete")}),Compiler.method("CompileIf",function(e){var o=e.CreoleForthBundle.row,t=e.CreoleForthBundle.Address[o],r=e.CreoleForthBundle["0BRANCH.IMMEDIATE"].IndexField;t.ParamField.push(r),t.ParamField.push(-1),e.ParamFieldPtr=t.ParamField.length-1,e.DataStack.push(e.ParamFieldPtr)}),Compiler.method("CompileElse",function(e){if(!1!==e.hasMinArgs(e.DataStack,1)){var o,t,r=e.CreoleForthBundle.row,i=e.CreoleForthBundle.Address[r],a=e.CreoleForthBundle["JUMP.IMMEDIATE"].IndexField,d=e.CreoleForthBundle["doElse.IMMEDIATE"].IndexField;i.ParamField.push(a),i.ParamField.push(-1),o=i.ParamField.length-1,i.ParamField.push(d),t=e.DataStack.pop(),i.ParamField[t]=i.ParamField.length-1,e.DataStack.push(o),e.ParamFieldPtr=i.ParamField.length-1}}),Compiler.method("CompileThen",function(e){if(!1!==e.hasMinArgs(e.DataStack,1)){var o=e.CreoleForthBundle.row,t=e.CreoleForthBundle.Address[o],r=e.DataStack.pop(),i=e.CreoleForthBundle["doThen.IMMEDIATE"].IndexField;t.ParamField.push(i),t.ParamField[r]=t.ParamField.length-1}}),Compiler.method("do0Branch",function(e){var o=e.CreoleForthBundle.Address[e.InnerPtr].ParamField,t=e.ReturnStack.pop(),r=o[t.ParamFieldAddr];0==e.DataStack.pop()?e.ParamFieldPtr=r:e.ParamFieldPtr+=1,t.ParamFieldAddr=e.ParamFieldPtr,e.ReturnStack.push(t)}),Compiler.method("CompileBegin",function(e){var o,t=e.CreoleForthBundle.row,r=e.CreoleForthBundle.Address[t],i=e.CreoleForthBundle["doBegin.IMMEDIATE"].IndexField;r.ParamField.push(i),o=r.ParamField.length-1,e.DataStack.push(o)}),Compiler.method("CompileUntil",function(e){if(!1!==e.hasMinArgs(e.DataStack,1)){var o=e.CreoleForthBundle.row,t=e.CreoleForthBundle.Address[o],r=e.DataStack.pop(),i=e.CreoleForthBundle["0BRANCH.IMMEDIATE"].IndexField;t.ParamField.push(i),t.ParamField.push(r)}}),Compiler.method("CompileDo",function(e){var o,t=e.CreoleForthBundle.row,r=e.CreoleForthBundle.Address[t],i=e.CreoleForthBundle["doStartDo.IMMEDIATE"].IndexField,a=e.CreoleForthBundle["doDo.IMMEDIATE"].IndexField;r.ParamField.push(i),r.ParamField.push(a),o=r.ParamField.length-1,e.DataStack.push(o)}),Compiler.method("CompileLoop",function(e){if(!1!==e.hasMinArgs(e.DataStack,1)){var o=e.CreoleForthBundle.row,t=e.CreoleForthBundle.Address[o],r=e.CreoleForthBundle["doLoop.IMMEDIATE"].IndexField,i=e.DataStack.pop();t.ParamField.push(r),t.ParamField.push(i)}}),Compiler.method("CompilePlusLoop",function(e){if(!1!==e.hasMinArgs(e.DataStack,1)){var o=e.CreoleForthBundle.row,t=e.CreoleForthBundle.Address[o],r=e.CreoleForthBundle["doPlusLoop.IMMEDIATE"].IndexField,i=e.DataStack.pop();t.ParamField.push(r),t.ParamField.push(i)}}),Compiler.method("doStartDo",function(e){if(!1!==e.hasMinArgs(e.DataStack,2)){var o=e.ReturnStack.pop(),t=e.DataStack.pop(),r=e.DataStack.pop(),i=new LoopInfo(e.loopLabels[e.LoopLabelPtr],t,r);e.LoopCurrIndexes=[0,0,0],e.LoopLabelPtr+=1,e.ReturnStack.push(i),e.ReturnStack.push(o)}}),Compiler.method("doPlusLoop",function(e){var o=e.DataStack.pop(),t=e.CreoleForthBundle.Address[e.InnerPtr].ParamField,r=e.ReturnStack.pop(),i=e.ReturnStack.pop(),a=t[r.ParamFieldAddr],d=i.Limit,l=i.Label,s=i.Index;switch(o<0?d+=o:d-=o,0<Number(o)&&Number(s)>=Number(d)||Number(o)<0&&Number(s)<=Number(d)?(e.ParamFieldPtr+=1,r.ParamFieldAddr=e.ParamFieldPtr,e.LoopLabelPtr-=1):(e.ParamFieldPtr=a,s=Number(s)+o,i.Index=s,r.ParamFieldAddr=e.ParamFieldPtr,e.ReturnStack.push(i)),l){case"I":e.LoopCurrIndexes[0]=s;break;case"J":e.LoopCurrIndexes[1]=s;break;case"K":e.LoopCurrIndexes[2]=s}e.ReturnStack.push(r)}),Compiler.method("doArgsCheckOff",function(e){e.MinArgsSwitch=!1}),Compiler.method("doArgsCheckOn",function(e){e.MinArgsSwitch=!0}),Compiler.method("doLoop",function(e){e.DataStack.push(1),(0,e.CreoleForthBundle["doPlusLoop.IMMEDIATE"].CodeField)(e)}),Compiler.method("doIndexI",function(e){e.DataStack.push(e.LoopCurrIndexes[0])}),Compiler.method("doIndexJ",function(e){e.DataStack.push(e.LoopCurrIndexes[1])}),Compiler.method("doIndexK",function(e){e.DataStack.push(e.LoopCurrIndexes[2])}),Compiler.method("doDoes",function(e){var o,t=e.CreoleForthBundle.Address[e.InnerPtr],r=t.CodeFieldStr;console.log("Code field is "+t.CodeFieldStr),"doDoes"===r?(o=t.IndexField,console.log("Direct execution of doDoes"),e.ParamFieldPtr=t.ParamFieldStart,e.DataStack.push(o),e.CreoleForthBundle.Modules.Interpreter.doColon(e)):(o=t.ParamField[e.ParamFieldPtr-1],console.log(e.ParamFieldPtr),console.log("Execution token is "+o),e.DataStack.push(o),e.CreoleForthBundle.Modules.Compiler.doExecute(e))}),Compiler.method("CompileDoes",function(e){var o,t=e.ReturnStack.pop(),r=t.DictAddr,i=e.CreoleForthBundle.row,a=e.CreoleForthBundle.Address[r],d=e.CreoleForthBundle.Address[i],l=d.fqNameField,s=e.CreoleForthBundle["DOES>.FORTH"].IndexField,n=0;for(d.CodeField=e.CreoleForthBundle.Modules.Compiler.doDoes,d.CodeFieldStr="doDoes";n<a.ParamField.length;){if(a.ParamField[n]==s){o=n+1;break}n+=1}for(d.ParamField.push(i),d.ParamFieldStart=d.ParamField.length,n=0;o<a.ParamField.length;)d.ParamField.push(a.ParamField[o]),o+=1,n+=1;t.ParamFieldAddr+=n,e.ReturnStack.push(t),e.CreoleForthBundle.Address[i]=d,e.CreoleForthBundle[l]=d}),Compiler.method("doJump",function(e){var o=e.CreoleForthBundle.Address[e.InnerPtr].ParamField[e.ParamFieldPtr+1],t=e.ReturnStack.pop();e.ParamFieldPtr=o,t.ParamFieldAddr=e.ParamFieldPtr,e.ReturnStack.push(t)}),Compiler.method("CompileLiteral",function(e){if(!1!==e.hasMinArgs(e.DataStack,1)){var o=e.CreoleForthBundle.row,t=e.CreoleForthBundle.Address[o],r=e.CreoleForthBundle["doLiteral.IMMEDIATE"].IndexField,i=e.DataStack.pop();t.ParamField.push(r),t.ParamField.push(i),e.ParamFieldPtr=t.length-1}}),Compiler.method("doLiteral",function(e){var o=e.ReturnStack.pop(),t=e.CreoleForthBundle.Address[o.DictAddr].ParamField[o.ParamFieldAddr];e.DataStack.push(t),o.ParamFieldAddr+=1,e.ParamFieldPtr=o.ParamFieldAddr,e.ReturnStack.push(o)}),Compiler.method("doFetch",function(e){if(!1!==e.hasMinArgs(e.DataStack,1)){var o=e.DataStack.pop(),t=e.CreoleForthBundle.Address[o].ParamField[0];e.DataStack.push(t)}}),Compiler.method("doStore",function(e){if(!1!==e.hasMinArgs(e.DataStack,2)){var o=e.DataStack.pop(),t=e.DataStack.pop();e.CreoleForthBundle.Address[o].ParamField[0]=t}}),Compiler.method("doSetCurrentToContext",function(e){var o=e.VocabStack[e.VocabStack.length-1];e.CurrentVocab=o,console.log("Current vocab is now "+e.CurrentVocab)}),Compiler.method("doImmediate",function(e){var o=e.CreoleForthBundle.row,t=e.CreoleForthBundle.Address[o],r=t.fqNameField;t.CompileAction="EXECUTE",t.Vocabulary="IMMEDIATE",e.CreoleForthBundle.Address[o]=t,e.CreoleForthBundle[r]=t});var LogicOps=function(){"use strict";if(!(this instanceof LogicOps))throw new Error("LogicOps needs to be called with the new keyword");this.title="Logical operatives grouping"};LogicOps.method("doEquals",function(e){!1!==e.hasMinArgs(e.DataStack,2)&&(e.DataStack.pop()==e.DataStack.pop()?e.DataStack.push(-1):e.DataStack.push(0))}),LogicOps.method("doNotEquals",function(e){!1!==e.hasMinArgs(e.DataStack,2)&&(e.DataStack.pop()==e.DataStack.pop()?e.DataStack.push(0):e.DataStack.push(-1))}),LogicOps.method("doLessThan",function(e){if(!1!==e.hasMinArgs(e.DataStack,2)){var o=e.DataStack.pop();e.DataStack.pop()<o?e.DataStack.push(-1):e.DataStack.push(0)}}),LogicOps.method("doGreaterThan",function(e){!1!==e.hasMinArgs(e.DataStack,2)&&(e.DataStack.pop()<e.DataStack.pop()?e.DataStack.push(-1):e.DataStack.push(0))}),LogicOps.method("doLessThanOrEquals",function(e){if(!1!==e.hasMinArgs(e.DataStack,2)){var o=e.DataStack.pop();e.DataStack.pop()<=o?e.DataStack.push(-1):e.DataStack.push(0)}}),LogicOps.method("doGreaterThanOrEquals",function(e){!1!==e.hasMinArgs(e.DataStack,2)&&(e.DataStack.pop()<=e.DataStack.pop()?e.DataStack.push(-1):e.DataStack.push(0))}),LogicOps.method("doNot",function(e){!1!==e.hasMinArgs(e.DataStack,1)&&(e.DataStack.pop()==Number(0)?e.DataStack.push(-1):e.DataStack.push(0))}),LogicOps.method("doAnd",function(e){if(!1!==e.hasMinArgs(e.DataStack,2)){var o=e.DataStack.pop(),t=e.DataStack.pop();0!=o&&0!=t?e.DataStack.push(-1):e.DataStack.push(0)}}),LogicOps.method("doOr",function(e){if(!1!==e.hasMinArgs(e.DataStack,2)){var o=e.DataStack.pop(),t=e.DataStack.pop();0!=o||0!=t?e.DataStack.push(-1):e.DataStack.push(0)}}),LogicOps.method("doXor",function(e){if(!1!==e.hasMinArgs(e.DataStack,2)){var o=e.DataStack.pop(),t=e.DataStack.pop();0==o&&0==t||0==o&&0==t?e.DataStack.push(0):e.DataStack.push(-1)}});var AppSpec=function(){"use strict";if(!(this instanceof AppSpec))throw new Error("AppSpec needs to be called with the new keyword");this.title="Application-specific grouping"};AppSpec.method("doTest",function(e){cfb1.Modules.CorePrims.doHello(e)}),AppSpec.method("doBeep",function(e){e.SoundField='<embed src="beep-08b.mp3" autostart="false" width="0" height="0" id="sound1">'}),AppSpec.method("doSleep",function(e){if(!1!==e.hasMinArgs(e.DataStack,1)){var o=e.DataStack.pop();o*=1e6;for(var t=0;t<o;)t+=1}});var CreoleWord=function(e,o,t,r,i,a,d,l,s,n,c,u){"use strict";if(!(this instanceof CreoleWord))throw new Error("CreoleWord needs to be called with the new keyword");this.NameField=e,this.CodeField=o,this.CodeFieldStr=t,this.Vocabulary=r,this.fqNameField=e+"."+r,this.CompileActionField=i,this.HelpField=a,this.PrevRowLocField=d,this.RowLocField=l,this.LinkField=s,this.IndexField=n,this.ParamField=c,this.DataField=u,this.ParamFieldStart=0},Modules=function(e,o,t,r,i){this.CorePrims=e,this.Interpreter=o,this.Compiler=t,this.LogicOps=r,this.AppSpec=i},CreoleForthBundle=function(e){"use strict";if(!(this instanceof CreoleForthBundle))throw new Error("CreoleForth needs to be called with the new keyword");this.row=0,this.Modules=e,this.Address=[]};CreoleForthBundle.method("BuildPrimitive",function(e,o,t,r,i,a){var d=new CreoleWord(e,o,t,r,i,a,this.row-1,this.row,this.row-1,this.row,[],[]),l=e+"."+r;this[l]=d,this.Address[this.row]=this[l],this.row+=1}),CreoleForthBundle.method("BuildHighLevel",function(e,o,t){var r;e.InputArea=o,this.Modules.Interpreter.doParseInput(e),this.Modules.Interpreter.doOuter(e),(r=this.Address[this.row]).HelpField=t,this[r.fqNameField]=r});var coreprims=new CorePrims,interpreter=new Interpreter,compiler=new Compiler,logicops=new LogicOps,appspec=new AppSpec,modules=new Modules(coreprims,interpreter,compiler,logicops,appspec),gsp=new GlobalSimpleProps;gsp.DataStack=[],gsp.VocabStack.push("ONLY"),gsp.VocabStack.push("FORTH"),gsp.VocabStack.push("APPSPEC"),gsp.CurrentVocab="FORTH";var cfb1=new CreoleForthBundle(modules);gsp.CreoleForthBundle=cfb1,cfb1.BuildPrimitive("ONLY",cfb1.Modules.Interpreter.doOnly,"Interpreter.doOnly","ONLY","EXECUTE","( -- ) Empties the vocabulary stack, then puts ONLY on it"),cfb1.BuildPrimitive("FORTH",cfb1.Modules.Interpreter.doForth,"Interpreter.doForth","ONLY","EXECUTE","( -- ) Puts FORTH on the vocabulary stack"),cfb1.BuildPrimitive("APPSPEC",cfb1.Modules.Interpreter.doAppSpec,"Interpreter.doAppSpec","ONLY","EXECUTE","( -- ) Puts APPSPEC on the vocabulary stack"),cfb1.BuildPrimitive("NOP",cfb1.Modules.CorePrims.doNOP,"CorePrims.doNOP","ONLY","COMPINPF","( -- ) Do-nothing primitive which is surprisingly useful"),cfb1.BuildPrimitive("__#EOL#__",cfb1.Modules.CorePrims.doNOP,"CorePrims.doNOP","ONLY","NOP","( -- ) EOL marker"),cfb1.BuildPrimitive("HELLO",cfb1.Modules.CorePrims.doHello,"CorePrims.doHello","FORTH","COMPINPF","( -- ) Pops up an alert saying Hello World"),cfb1.BuildPrimitive("TULIP",cfb1.Modules.CorePrims.doTulip,"CorePrims.doTulip","FORTH","COMPINPF","( -- ) Pops up an alert saying Tulip"),cfb1.BuildPrimitive("MSGBOX",cfb1.Modules.CorePrims.doMsgBox,"CorePrims.doMsgBox","FORTH","COMPINPF","( msg -- ) Pops up an alert saying the message"),cfb1.BuildPrimitive("EVAL",cfb1.Modules.CorePrims.doEval,"CorePrims.doEval","FORTH","COMPINPF","( code -- ) Evaluates raw JavaScript code - only allows alerts"),cfb1.BuildPrimitive("VLIST",cfb1.Modules.CorePrims.doVList,"CorePrims.doVList","FORTH","COMPINPF","( -- ) Lists the dictionary definitions"),cfb1.BuildPrimitive("+",cfb1.Modules.CorePrims.doPlus,"CorePrims.doPlus","FORTH","COMPINPF","( n1 n2 -- sum ) Adds two numbers on the stack"),cfb1.BuildPrimitive("-",cfb1.Modules.CorePrims.doMinus,"CorePrims.doMinus","FORTH","COMPINPF","( n1 n2 -- difference ) Subtracts two numbers on the stack"),cfb1.BuildPrimitive("*",cfb1.Modules.CorePrims.doMultiply,"CorePrims.doMultiply","FORTH","COMPINPF","( n1 n2 -- product ) Multiplies two numbers on the stack"),cfb1.BuildPrimitive("/",cfb1.Modules.CorePrims.doDivide,"CorePrims.doDivide","FORTH","COMPINPF","( n1 n2 -- quotient ) Divides two numbers on the stack"),cfb1.BuildPrimitive("%",cfb1.Modules.CorePrims.doMod,"CorePrims.doMod","FORTH","COMPINPF","( n1 n2 -- remainder ) Returns remainder of division operation"),cfb1.BuildPrimitive("TODAY",cfb1.Modules.CorePrims.doToday,"CorePrims.doToday","FORTH","COMPINPF","( -- ) Pops up today's date"),cfb1.BuildPrimitive("NOW",cfb1.Modules.CorePrims.doNow,"CorePrims.doNow","FORTH","COMPINPF","( --  time ) Puts the time on the stack"),cfb1.BuildPrimitive(">HHMMSS",cfb1.Modules.CorePrims.doToHoursMinSecs,"CorePrims.doToHoursMinSecs","FORTH","COMPINPF","( time -- ) Formats the time"),cfb1.BuildPrimitive("DUP",cfb1.Modules.CorePrims.doDup,"CorePrims.doDup","FORTH","COMPINPF","( val --  val val ) Duplicates the argument on top of the stack"),cfb1.BuildPrimitive("SWAP",cfb1.Modules.CorePrims.doSwap,"CorePrims.doSwap","FORTH","COMPINPF","( val1 val2 -- val2 val1 ) Swaps the positions of the top two stack arguments"),cfb1.BuildPrimitive("ROT",cfb1.Modules.CorePrims.doRot,"CorePrims.doRot","FORTH","COMPINPF","( val1 val2 val3 -- val2 val3 val1 ) Moves the third stack argument to the top"),cfb1.BuildPrimitive("-ROT",cfb1.Modules.CorePrims.doMinusRot,"CorePrims.doMinusRot","FORTH","COMPINPF","( val1 val2 val3 -- val3 val1 val2 ) Moves the top stack argument to the third position"),cfb1.BuildPrimitive("NIP",cfb1.Modules.CorePrims.doNip,"CorePrims.doNip","FORTH","COMPINPF","( val1 val2 -- val2 ) Removes second stack argument"),cfb1.BuildPrimitive("TUCK",cfb1.Modules.CorePrims.doTuck,"CorePrims.doTuck","FORTH","COMPINPF","( val1 val2 -- val2 val1 val2 ) Copies top stack argument under second argument"),cfb1.BuildPrimitive("OVER",cfb1.Modules.CorePrims.doOver,"CorePrims.doOver","FORTH","COMPINPF","( val1 val2 -- val1 val2 val1 ) Copies second stack argument to the top of the stack"),cfb1.BuildPrimitive("DROP",cfb1.Modules.CorePrims.doDrop,"CorePrims.doDrop","FORTH","COMPINPF","( val -- ) Drops the argument at the top of the stack"),cfb1.BuildPrimitive("DEPTH",cfb1.Modules.CorePrims.doDepth,"CorePrims.doDepth","FORTH","COMPINPF","( -- n ) Returns the stack depth"),cfb1.BuildPrimitive("=",cfb1.Modules.LogicOps.doEquals,"LogicOps.doEquals","FORTH","COMPINPF","( val1 val2 -- flag ) -1 if equal, 0 otherwise"),cfb1.BuildPrimitive("<>",cfb1.Modules.LogicOps.doNotEquals,"LogicOps.doNotEquals","FORTH","COMPINPF","( val1 val2 -- flag ) 0 if equal, -1 otherwise"),cfb1.BuildPrimitive("<",cfb1.Modules.LogicOps.doLessThan,"LogicOps.doLessThan","FORTH","COMPINPF","( val1 val2 -- flag ) -1 if less than, 0 otherwise"),cfb1.BuildPrimitive(">",cfb1.Modules.LogicOps.doGreaterThan,"LogicOps.doGreaterThan","FORTH","COMPINPF","( val1 val2 -- flag ) -1 if greater than, 0 otherwise"),cfb1.BuildPrimitive("<=",cfb1.Modules.LogicOps.doLessThanOrEquals,"LogicOps.doLessThanOrEquals","FORTH","COMPINPF","( val1 val2 -- flag ) -1 if less than or equal to, 0 otherwise"),cfb1.BuildPrimitive(">=",cfb1.Modules.LogicOps.doGreaterThanOrEquals,"LogicOps.doGreaterThanOrEquals","FORTH","COMPINPF","( val1 val2 -- flag ) -1 if greater than or equal to, 0 otherwise"),cfb1.BuildPrimitive("NOT",cfb1.Modules.LogicOps.doNot,"LogicOps.doNot","FORTH","COMPINPF","( val -- opval ) -1 if 0, 0 otherwise"),cfb1.BuildPrimitive("AND",cfb1.Modules.LogicOps.doAnd,"LogicOps.doAnd","FORTH","COMPINPF","( val1 val2 -- flag ) -1 if both arguments are non-zero, 0 otherwise"),cfb1.BuildPrimitive("OR",cfb1.Modules.LogicOps.doOr,"LogicOps.doOr","FORTH","COMPINPF","( val1 val2 -- flag ) -1 if one or both arguments are non-zero, 0 otherwise"),cfb1.BuildPrimitive("XOR",cfb1.Modules.LogicOps.doXor,"LogicOps.doXor","FORTH","COMPINPF","( val1 val2 -- flag ) -1 if one and only one argument is non-zero, 0 otherwise"),cfb1.BuildPrimitive(",",cfb1.Modules.Compiler.doComma,"Compiler.doComma","FORTH","COMPINPF","( n --) Compiles value off the TOS into the next parameter field cell"),cfb1.BuildPrimitive("COMPINPF",cfb1.Modules.Compiler.doComma,"Compiler.doComma","IMMEDIATE","COMPINPF","( n --) Does the same thing as , (comma) - given a different name for ease of reading"),cfb1.BuildPrimitive("EXECUTE",cfb1.Modules.Compiler.doExecute,"Compiler.doExecute","FORTH","COMPINPF","( address --) Executes the word corresponding to the address on the stack"),cfb1.BuildPrimitive(":",cfb1.Modules.Compiler.CompileColon,"Compiler.CompileColon","FORTH","COMPINPF","( -- ) Starts compilation of a colon definition"),cfb1.BuildPrimitive(";",cfb1.Modules.Compiler.doSemi,"Compiler.doSemi","IMMEDIATE","EXECUTE","( -- ) Terminates compilation of a colon definition"),cfb1.BuildPrimitive("COMPLIT",cfb1.Modules.Compiler.CompileLiteral,"Compiler.CompileLiteral","IMMEDIATE","EXECUTE","( -- ) Compiles doLit and a literal into the dictionary"),cfb1.BuildPrimitive("doLiteral",cfb1.Modules.Compiler.doLiteral,"Compiler.doLiteral","IMMEDIATE","NOP","( -- lit ) Run-time code that pushes a literal onto the stack"),cfb1.BuildPrimitive("HERE",cfb1.Modules.Compiler.doHere,"Compiler.doHere","FORTH","COMPINPF","( -- location ) Returns address of the next available dictionary location"),cfb1.BuildPrimitive("CREATE",cfb1.Modules.Compiler.doCreate,"Compiler.doCreate","FORTH","COMPINPF","CREATE <name>. Adds a named entry into the dictionary"),cfb1.BuildPrimitive("doDoes",cfb1.Modules.Compiler.DoDoes,"Compiler.DoDoes","IMMEDIATE","COMPINPF","( address -- ) Run-time code for DOES>"),cfb1.BuildPrimitive("DOES>",cfb1.Modules.Compiler.CompileDoes,"Compiler.CompileDoes","FORTH","COMPINPF","DOES> <list of runtime actions>. When defining word is created, copies code following it into the child definition"),cfb1.BuildPrimitive("@",cfb1.Modules.Compiler.doFetch,"Compiler.doFetch","FORTH","COMPINPF","( addr -- val ) Fetches the value in the param field  at addr"),cfb1.BuildPrimitive("!",cfb1.Modules.Compiler.doStore,"Compiler.doStore","FORTH","COMPINPF","( val addr --) Stores the value in the param field  at addr"),cfb1.BuildPrimitive("DEFINITIONS",cfb1.Modules.Compiler.doSetCurrentToContext,"Compiler.doSetCurrentToContext","FORTH","COMPINPF","(  -- ). Sets the current (compilation) vocabulary to the context vocabulary (the one on top of the vocabulary stack)"),cfb1.BuildPrimitive("IMMEDIATE",cfb1.Modules.Compiler.doImmediate,"Compiler.doImmediate","FORTH","COMPINPF","( -- ) Flags a word as immediate (executes instead of compiling inside a colon definition)"),cfb1.BuildPrimitive("IF",cfb1.Modules.Compiler.CompileIf,"Compiler.CompileIf","IMMEDIATE","EXECUTE","( -- location ) Compile-time code for IF"),cfb1.BuildPrimitive("ELSE",cfb1.Modules.Compiler.CompileElse,"Compiler.CompileElse","IMMEDIATE","EXECUTE","( -- location ) Compile-time code for ELSE"),cfb1.BuildPrimitive("THEN",cfb1.Modules.Compiler.CompileThen,"Compiler.CompileThen","IMMEDIATE","EXECUTE","( -- location ) Compile-time code for THEN"),cfb1.BuildPrimitive("0BRANCH",cfb1.Modules.Compiler.do0Branch,"Compiler.do0Branch","IMMEDIATE","NOP","( flag -- ) Run-time code for IF"),cfb1.BuildPrimitive("JUMP",cfb1.Modules.Compiler.doJump,"Compiler.doJump","IMMEDIATE","NOP","( -- ) Jumps unconditionally to the parameter field location next to it and is compiled by ELSE"),cfb1.BuildPrimitive("doElse",cfb1.Modules.CorePrims.doNOP,"CorePrims.doNOP","IMMEDIATE","NOP","( -- ) Run-time code for ELSE"),cfb1.BuildPrimitive("doThen",cfb1.Modules.CorePrims.doNOP,"CorePrims.doNOP","IMMEDIATE","NOP","( -- ) Run-time code for THEN"),cfb1.BuildPrimitive("BEGIN",cfb1.Modules.Compiler.CompileBegin,"Compiler.CompileBegin","IMMEDIATE","EXECUTE","( -- beginLoc ) Compile-time code for BEGIN"),cfb1.BuildPrimitive("UNTIL",cfb1.Modules.Compiler.CompileUntil,"Compiler.CompileUntil","IMMEDIATE","EXECUTE","( beginLoc -- ) Compile-time code for UNTIL"),cfb1.BuildPrimitive("doBegin",cfb1.Modules.CorePrims.doNOP,"CorePrims.doNOP","IMMEDIATE","NOP","( -- ) Run-time code for BEGIN"),cfb1.BuildPrimitive("DO",cfb1.Modules.Compiler.CompileDo,"Compiler.CompileDo","IMMEDIATE","EXECUTE","( -- beginLoc ) Compile-time code for DO"),cfb1.BuildPrimitive("LOOP",cfb1.Modules.Compiler.CompileLoop,"Compiler.CompileLoop","IMMEDIATE","EXECUTE","( -- beginLoc ) Compile-time code for LOOP"),cfb1.BuildPrimitive("+LOOP",cfb1.Modules.Compiler.CompilePlusLoop,"Compiler.CompilePlusLoop","IMMEDIATE","EXECUTE","( -- beginLoc ) Compile-time code for +LOOP"),cfb1.BuildPrimitive("doStartDo",cfb1.Modules.Compiler.doStartDo,"Compiler.doStartDo","IMMEDIATE","COMPINPF","( start end -- ) Starts off the Do by getting the start and end"),cfb1.BuildPrimitive("doDo",cfb1.Modules.CorePrims.doNOP,"CorePrims.doNOP","IMMEDIATE","COMPINPF","( -- ) Marker for DoLoop to return to"),cfb1.BuildPrimitive("doLoop",cfb1.Modules.Compiler.doLoop,"Compiler.doLoop","IMMEDIATE","COMPINPF","( -- ) Loops back to doDo until the start equals the end"),cfb1.BuildPrimitive("doPlusLoop",cfb1.Modules.Compiler.doPlusLoop,"Compiler.doPlusLoop","IMMEDIATE","COMPINPF","( inc -- ) Loops back to doDo until the start >= the end and increments with inc"),cfb1.BuildPrimitive("I",cfb1.Modules.Compiler.doIndexI,"Compiler.doIndexI","FORTH","COMPINPF","( -- index ) Rturns the index of I"),cfb1.BuildPrimitive("J",cfb1.Modules.Compiler.doIndexJ,"Compiler.doIndexJ","FORTH","COMPINPF","( -- index ) Rturns the index of J"),cfb1.BuildPrimitive("K",cfb1.Modules.Compiler.doIndexK,"Compiler.doIndexK","FORTH","COMPINPF","( -- index ) Rturns the index of K"),cfb1.BuildPrimitive("CHKOFF",cfb1.Modules.Compiler.doArgsCheckOff,"Compiler.doArgsCheckOff","FORTH","COMPINPF","( -- ) Turns check for stack args off"),cfb1.BuildPrimitive("CHKON",cfb1.Modules.Compiler.doArgsCheckOn,"Compiler.doArgsCheckOn","FORTH","COMPINPF","( -- ) Turns check for stack args on"),cfb1.BuildPrimitive("\\",cfb1.Modules.Compiler.doSingleLineCmts,"Compiler.doSingleLineCmts","FORTH",gsp.BFC.ExecZeroAction,"( -- ) Single-line comment handling"),cfb1.BuildPrimitive("(",cfb1.Modules.Compiler.doParenCmts,"Compiler.doParenCmts","FORTH",gsp.BFC.ExecZeroAction,"( -- ) Multiline comment handling"),cfb1.BuildPrimitive("{",cfb1.Modules.Compiler.doCompileList,"Compiler.doCompileList","FORTH",gsp.BFC.ExecZeroAction,"( -- list ) List compiler"),cfb1.BuildPrimitive("BEEP",cfb1.Modules.AppSpec.doBeep,"AppSpec.doBeep","APPSPEC","COMPINPF","( -- ) Plays short beeping sound"),cfb1.BuildPrimitive("SLEEP",cfb1.Modules.AppSpec.doSleep,"AppSpec.doSleep","APPSPEC","COMPINPF","( n -- ) Sleeps n milliseconds"),cfb1.BuildPrimitive("TEST",cfb1.Modules.AppSpec.doTest,"AppSpec.doTest","APPSPEC","COMPINPF","( -- ) Do what you like here"),cfb1.BuildHighLevel(gsp,": CONSTANT CREATE , DOES> @ ;","( val -- ) CONSTANT <name>. Defining word for scalar constants"),cfb1.BuildHighLevel(gsp,": VARIABLE CREATE 0 , ;","VARIABLE <name>. Used for simple scalar data storage and retrieval"),gsp.CurrentVocab="APPSPEC",cfb1.BuildHighLevel(gsp,": DOTEST DO HELLO LOOP ;","Simple testing definition"),cfb1.BuildHighLevel(gsp,": TL2 CHKOFF DO I 3 0 DO J LOOP LOOP CHKON ;","Simple testing definition 2");