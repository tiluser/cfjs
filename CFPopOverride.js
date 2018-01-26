// Code to override Array's pop method. Once you're finished testing that there are
// no stack underflows, you can remove it. 

// Might not be safe to use
var originalPop = Array.prototype.pop;
var GlobalErrors = function () {
    "use strict";

    if (!(this instanceof BasicForthConstants)) {
        throw new Error("BasicForthConstants needs to be called with the new keyword");
    }

    this.StackUnderFlowFlag = false;  
};

var globalErrors = Object.create(GlobalErrors);

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
