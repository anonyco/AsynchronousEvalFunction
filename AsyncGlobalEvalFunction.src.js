var AsyncGlobalEvalFunction = (function(window){
	"use strict";
	// setTimeout("string") is not evil; as with most things in Javascript, it is merely misunderstood and
	//	especially misused. Infact, AsyncGlobalEvalFunction uses setTimeout("string") for good:
	//	setTimeout("string") turns control over to the browser for evaluating the code snippet. This is
	//	good because
	var Function = window.Function;
	var setTimeout = window.setTimeout;
	var windowProperty = "", maxDepth=0;
	while(windowProperty === "") { // try to find an available untaken property on the window object
		(function findAvailableWindowProperty(str, depth) {
			for (var i=str === "" ? 10 : 0, prop=""; i<62 && windowProperty === ""; i=i+1|0) {
				prop = i < 36 ? str + i.toString(36) : str + (i-26|0).toString(36).toUpperCase();
				if (depth === 0) {
					windowProperty = window.hasOwnProperty(prop) ? "" : prop; // notify if we have found an available name
				} else { // depth is greater than 0, so we have already checked prop, so check longer names
					findAvailableWindowProperty(prop, depth - 1|0); // try to find longer names
				}
			}
		})("", maxDepth);
		maxDepth = maxDepth + 1|0;
	}
	var globalName = windowProperty.replace(/\\/g, '\\\\');
	var supportsSetTimeout = false;
	var globalArea = window[windowProperty] = [function(){supportsSetTimeout = true;}];
	try {
		// test for actual compatibility given the fact that some future browsers may potentially fail silently
		setTimeout(globalName + '[0]()', 0);
	} catch(e) {}
	return function(code, thenFunc){
		if (!supportsSetTimeout) {
			(window.requestIdleCallback || setTimeout)(function(){
                var returnValue = Function('"use strict";return (' + code + ')')();
                if (typeof thenFunc === "function") setTimeout(function(){thenFunc(returnValue)}, NaN);
            }, {timeout: 334});
			return;
		}
		if (typeof thenFunc !== "function") {
			// no sense in waisting more effort than needed:
			setTimeout('"use strict";(' + code + ')');
			return;
		}
		var firstEmptyIndex = globalArea.indexOf(null);
		var index = firstEmptyIndex === -1 ? globalArea.push(thenFunc) - 1 : ((globalArea[firstEmptyIndex] = thenFunc), firstEmptyIndex);
		setTimeout('"use strict";(0,'+globalName+'['+index+'])('+code+');'+globalName+'['+index+']=null');
	};
})(typeof global === "object" ? global : typeof window === "object" ? window : this);
