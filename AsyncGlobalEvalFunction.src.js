var AsyncGlobalEvalFunction = (function(window){
	var s = 0, t = "", JSON_stringify = window.JSON.stringify, Function = window.Function;
	var String_fromCharCode = window.String.fromCharCode, setTimeout = window.setTimeout;
	while (window.hasOwnProperty(t + String_fromCharCode(s)))
		if (++s === 65536)
			s = 0, t += String_fromCharCode(t);
	t += String_fromCharCode(s);
	var globalName = JSON_stringify(t);
	var supportsSetTimeout = false;
	var globalArea = window[t] = [function(){globalArea[0] = null; supportsSetTimeout = true;}];
	try {
		// test for actual compatibility given the fact that some browsers may potentially fail silently
		setTimeout('self[' + globalName + '][0]()');
    } catch(e) {}
	
	return function(code, thenFunc){
		if (!supportsSetTimeout) {
			var returnValue = Function('"use strict";return ' + code)();
			if (typeof thenFunc !== "function") setTimeout(thenFunc, NaN, returnValue);
        }
		if (typeof thenFunc !== "function") setTimeout(`"use strict";(${code})`); // no sense in waisting more effort than needed
		var firstEmptyIndex = globalArea.indexOf(null);
		var index = firstEmptyIndex === -1 ? globalArea.push(thenFunc) - 1 : ((globalArea[firstEmptyIndex] = thenFunc), firstEmptyIndex);
		setTimeout(`"use strict";(0,self[${globalName}][${index}])(${code});self[${globalName}][${index}]=null`);
    };
})(self);
