/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "dc7deb7215cea8a26d08"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				fn[name] = __webpack_require__[name];
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 				else for(var i = 0; i < dep.length; i++)
/******/ 					hot._acceptedDependencies[dep[i]] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else for(var i = 0; i < dep.length; i++)
/******/ 					hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) { if(err) throw err; };
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0; { // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(+id);
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) { if(err) throw err; };
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) { if(err) throw err; };
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = +id;
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(2);
	module.exports = __webpack_require__(8);


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	/*globals window __webpack_hash__ */
	if(true) {
		var lastData;
		var upToDate = function upToDate() {
			return lastData.indexOf(__webpack_require__.h()) >= 0;
		};
		var check = function check() {
			module.hot.check(true, function(err, updatedModules) {
				if(err) {
					if(module.hot.status() in {abort: 1, fail: 1}) {
						console.warn("[HMR] Cannot apply update. Need to do a full reload!");
						console.warn("[HMR] " + err.stack || err.message);
						window.location.reload();
					} else {
						console.warn("[HMR] Update failed: " + err.stack || err.message);
					}
					return;
				}

				if(!updatedModules) {
					console.warn("[HMR] Cannot find update. Need to do a full reload!");
					console.warn("[HMR] (Probably because of restarting the webpack-dev-server)");
					window.location.reload();
					return;
				}

				if(!upToDate()) {
					check();
				}

				__webpack_require__(6)(updatedModules, updatedModules);

				if(upToDate()) {
					console.log("[HMR] App is up to date.");
				}

			});
		};
		var addEventListener = window.addEventListener ? function(eventName, listener) {
			window.addEventListener(eventName, listener, false);
		} : function (eventName, listener) {
			window.attachEvent("on" + eventName, listener);
		};
		addEventListener("message", function(event) {
			if(typeof event.data === "string" && event.data.indexOf("webpackHotUpdate") === 0) {
				lastData = event.data;
				if(!upToDate() && module.hot.status() === "idle") {
					console.log("[HMR] Checking for updates on the server...");
					check();
				}
			}
		});
		console.log("[HMR] Waiting for update signal from WDS...");
	} else {
		throw new Error("[HMR] Hot Module Replacement is disabled.");
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Модуль для кроссбраузерной подписки на DOM события
	 * - Современные браузеры - addEventListener/removeEventListener
	 * - IE8 - attachEvent/detachEvent
	 *
	 * Пример использования:
	 * var func = function() { alert('Ничоси');
	 * addEvent(elem, 'click', func});
	 * removeEvent(elem, 'click', func });
	 */

	var isSupportModernEvent = !!document.addEventListener;

	module.exports = {
	    /**
	     * Подписка на DOM событие
	     * @param elem {HTMLElement} - DOM нода (document.getElementBy ...)
	     * @param type {Object} - тип события (click, mouseout, focus, ...)
	     * @param handler {Function} - обработчик события
	     */
	    addEvent: function (elem, type, handler) {
	        return isSupportModernEvent ?
	            elem.addEventListener(type, handler, false) :
	                elem.attachEvent('on' + type, handler);
	    },

	    /**
	     * Отписка от DOM события
	     * @param elem {HTMLElement} - DOM нода (document.getElementBy ...)
	     * @param type {Object} - тип события (click, mouseout, focus, ...)
	     * @param handler {Function} - обработчик события
	     */
	    removeEvent: function (elem, type, handler) {
	        return isSupportModernEvent ?
	            elem.removeEventListener(type, handler, false) :
	            elem.detachEvent('on' + type, handler);
	    },

	    ready: function (handler) {
	        return isSupportModernEvent ?
	            document.addEventListener('DOMContentLoaded', handler, false) :
	                document.attachEvent('onreadystatechange', handler);
	    }
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// indexOf IE8-
	if (!Array.prototype.indexOf) {
	    Array.prototype.indexOf = function(elt /*, from*/) {
	        var len = this.length >>> 0;

	        var from = Number(arguments[1]) || 0;
	        from = (from < 0)
	            ? Math.ceil(from)
	            : Math.floor(from);
	        if (from < 0)
	            from += len;

	        for (; from < len; from++) {
	            if (from in this &&
	                this[from] === elt)
	                return from;
	        }
	        return -1;
	    };
	}

	// isArray
	if (!Array.isArray) {
	    Array.isArray = function(arg) {
	        return Object.prototype.toString.call(arg) === '[object Array]';
	    };
	}

	// forEach
	if (!Array.prototype.forEach) {
	    Array.prototype.forEach = function(callback){
	        for (var i = 0; i < this.length; i++){
	            callback.apply(this, [this[i], i, this]);
	        }
	    };
	}

	// filter
	if (!Array.prototype.filter) {
	    Array.prototype.filter = function(callback/*, thisArg*/) {
	        if (this === void 0 || this === null) {
	            throw new TypeError();
	        }

	        var t = Object(this);
	        var len = t.length >>> 0;
	        if (typeof callback !== 'function') {
	            throw new TypeError();
	        }

	        var res = [];
	        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
	        for (var i = 0; i < len; i++) {
	            if (i in t) {
	                var val = t[i];
	                if (callback.call(thisArg, val, i, t)) {
	                    res.push(val);
	                }
	            }
	        }

	        return res;
	    };
	}



/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var helpers = __webpack_require__(9),
	    $ = helpers.$,
	    setText = helpers.setText,
	    events = __webpack_require__(3),
	    classList = __webpack_require__(10),
	    text = __webpack_require__(16);

	function Dropdown (options) {
	    var self = this;

	    this.options = options || {};

	    if (!this.options.id) {
	        throw new Error('dropdown-ui: В опциях не указан id');
	    }

	    this.cls = {
	        root: 'dropdown-ui',
	        open: 'dropdown-ui_open',
	        arrow: 'dropdown-ui__arrow',
	        input: 'dropdown-ui__input',
	        control: 'dropdown-ui__control',
	        controlItem: 'dropdown-ui__control-item',
	        tokens: 'dropdown-ui__tokens',
	        token: 'dropdown-ui__token',
	        tokenAdd: 'dropdown-ui__token-add',
	        popup: 'dropdown-ui__popup',
	        list: 'dropdown-ui__list',
	        item: 'dropdown-ui__item',
	        itemName: 'dropdown-ui__item-name',
	        itemDomain: 'dropdown-ui__item-domain'
	    };

	    // 1. Получаем html элемент дропдауна
	    getDropdownElem();

	    // 2. Строим шаблон
	    buildTemplate();

	    // 3. Слушаем события
	    listenEvents();

	    function getDropdownElem () {
	        var id = self.options.id;

	        self.selector = '[data-dropdown-id=' + self.options.id + ']';
	        self.$dropdown = $(self.selector);

	        if (!self.$dropdown.length) {
	            throw new Error('dropdown-ui: Добавьте html разметку c id: ' + id);
	        } else {
	            self.$dropdown = self.$dropdown[0];
	        }
	    }

	    function buildTemplate () {
	        var fragment = document.createDocumentFragment(),
	            options = self.options,
	            cls = self.cls;

	        self.$control = createElem('div', [cls.control, 'clearfix']);
	        self.$arrow = createElem('i', cls.arrow);
	        self.$input = createElem('input', [cls.input, cls.controlItem]);
	        self.$tokens = createElem('div', [cls.tokens, cls.controlItem]);
	        self.$popup = createElem('div', cls.popup);
	        self.$list = createElem('div', cls.list);

	        // Настраиваем input
	        self.$input.setAttribute('type', 'text');
	        self.$input.setAttribute('placeholder', 'Введите имя друга или email');

	        // Если выбрана опции 'мультивыбора' генерируем кнопку добавления
	        if (options.multiSelect) {
	            self.$tokenAdd = createElem('div', [cls.tokenAdd, 'token', 'token_theme_light']);
	            self.$tokenAdd.textContent = 'Добавить';
	            self.$tokens.appendChild(self.$tokenAdd);
	        }

	        // Заполняем __control
	        self.$control.appendChild(self.$tokens);
	        self.$control.appendChild(self.$arrow);
	        self.$control.appendChild(self.$input);

	        // Заполняем __popup
	        self.$popup.appendChild(self.$list);

	        // Заполняем список
	        fillList();

	        fragment.appendChild(self.$control);
	        fragment.appendChild(self.$popup);

	        // Вставляем содержимое dropdown
	        self.$dropdown.appendChild(fragment);
	    }

	    function fillList (items) {
	        var cls = self.cls,
	            fragment = document.createDocumentFragment();

	        items = items || self.options.items;

	        // Генерируем список
	        items.forEach(function (item) {
	            var $item = createElem('div', cls.item),
	                $name = createElem('div', cls.itemName),
	                $domain = createElem('div', cls.itemDomain);

	            // Вставляем текст для составных частей
	            setText($name, item.name);
	            setText($domain, item.domain);

	            // Вставляем составные части в элемент
	            $item.appendChild($name);
	            $item.appendChild($domain);

	            fragment.appendChild($item);
	        });

	        // Очищаем список и Вставляем элементы
	        self.$list.innerHTML = '';
	        self.$list.appendChild(fragment);
	    }

	    function createElem (tag, cls) {
	        var elem = document.createElement(tag);

	        if (Array.isArray(cls)) {
	            cls.forEach(function (classItem) {
	                classList.add(elem, classItem)
	            });
	        } else {
	            classList.add(elem, cls);
	        }

	        return elem;
	    }

	    function listenEvents () {
	        // Focus в инпуте – открываем дропдаун
	        events.addEvent(self.$input, 'focus', open);

	        // Закрываем dropdown по клику вне блока
	        events.addEvent(document, 'click', function (e) {
	            var target = e.target || e.srcElement,
	                $dropdown = self.$dropdown,
	                cls = self.cls;

	            if (classList.has($dropdown, cls.open)) {
	                if (classList.has(target, cls.root) || !$dropdown.contains(target)) {
	                    classList.remove($dropdown, cls.open);
	                }
	            }
	        });

	        // Клик по стрелке – тоглим дропдаун
	        events.addEvent(self.$arrow, 'click', toggle);
	    }

	    /**
	     * Обработчик открытия дропдауна
	     * @param e {Object}
	     */
	    function open (e) {
	        classList.add(self.$dropdown, self.cls.open);

	        // Вызываем callback при открытии
	        options.onOpen && options.onOpen();

	        // Подписываем на ввод данных в инпут
	        events.addEvent(self.$input, 'keyup', onKeyUp);
	    }

	    /**
	     * Обработчик закрытия дропдауна
	     * @param e {Object}
	     */
	    function close (e) {
	        classList.remove(self.$dropdown, self.cls.open);

	        // Вызываем callback при закрытии
	        options.onClose && options.onClose();

	        // Отписываемся от ввода данных в инпут
	        events.removeEvent(self.$input, 'keyup', onKeyUp);
	    }

	    /**
	     * Обработчик 'тоглера' открытия/закрытия дропдаура
	     * @param e {Object}
	     */
	    function toggle (e) {
	        classList.has(self.$dropdown, self.cls.open) ? close(e) : open(e);
	    }

	    /**
	     * Обработчик ввода данных в инпут
	     * @param e
	     */
	    function onKeyUp (e) {
	        var target = e.target || e.srcElement,
	            value = target.value,
	            items = self.options.items,
	            newItems = [];

	        // 1. Фильтруем в обычном порядке,
	        // предпологая, что пользователь ввел текст правильно рого
	        newItems = filter(items, value);

	        // 2. Если не нашли – фильтруем на случай ввода транслита rogo
	        if (!newItems.length) {
	            newItems = filter(items, text.translit('en', 'ru', value));
	        }

	        // 3. Фильтруем на случай ввода hjuj (рого)
	        if (!newItems.length) {
	            newItems = filter(items, text.replace('en', 'ru', value));
	        }

	        // 4. Фильтруем на случай ввода кщпщ (rogo)
	        if (!newItems.length) {
	            // кщпщ -> rogo
	            var newValue = text.replace('ru', 'en', value);
	            // rogo -> рого
	            newValue = text.translit('en', 'ru', newValue);
	            newItems = filter(items, newValue);
	        }

	        function filter (items, searchValue) {
	            return items.filter(function (item) {
	                var name = item.name;

	                name = name.toLowerCase();
	                searchValue = searchValue.toLowerCase();

	                return name.indexOf(searchValue) !== -1;
	            })
	        }

	        fillList(newItems);
	    }
	}

	module.exports = Dropdown;



/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	module.exports = function(updatedModules, renewedModules) {
		var unacceptedModules = updatedModules.filter(function(moduleId) {
			return renewedModules && renewedModules.indexOf(moduleId) < 0;
		});

		if(unacceptedModules.length > 0) {
			console.warn("[HMR] The following modules couldn't be hot updated: (They would need a full reload!)");
			unacceptedModules.forEach(function(moduleId) {
				console.warn("[HMR]  - " + moduleId);
			});
		}

		if(!renewedModules || renewedModules.length === 0) {
			console.log("[HMR] Nothing hot updated.");
		} else {
			console.log("[HMR] Updated modules:");
			renewedModules.forEach(function(moduleId) {
				console.log("[HMR]  - " + moduleId);
			});
		}
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// Вставляем css для корневого блока page
	__webpack_require__(7);

	var events = __webpack_require__(3),
	    polyfills = __webpack_require__(4);

	// Код начнет выполняться после загрузки DOM
	events.ready(function () {
	    var Dropdown = __webpack_require__(5);

	    var dropdown = new Dropdown({
	        id: 'first',
	        userAvatar: true,
	        multiSelect: true,
	        items: [
	            { name: 'Андрей Рогозов', domain: 'rogozov' },
	            { name: 'Николай Ильченко', domain: 'tavriaforever' },
	            { name: 'Татьяна Неземная', domain: 'nezemnaya' },
	            { name: 'Сергей Жиленков', domain: 'zila' },
	            { name: 'Борис Сапак', domain: 'baklan' }
	        ]
	    });
	});


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Модуль с набором хелперов для работы с DOM нодами
	 */

	module.exports = {

	    /**
	     * Обертка над querySelectorAll
	     * для выборки элементов в DOM дереве по селектору.
	     * Пример использования:
	     * $('.myNode') -> вернем массив элементов с указанным классом
	     * @param elem {HTMLElement} - DOM нода
	     * @returns {} - массив найденных элементов по селектору
	     */
	    $: function(elem) {
	        return document.querySelectorAll(elem);
	    },

	    setText: function (elem, text) {
	        var hasInnerText = !!document.getElementsByTagName('body')[0].innerText;
	        return hasInnerText ? elem.textContent = text : elem.innerText = text;
	    }
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    add: function (elem, className) {
	        if (elem.classList) {
	            elem.classList.add(className);
	        } else {
	            if (!this.has(elem, className)) {
	                elem.className += ' ' + className;
	            }
	        }
	    },

	    remove: function (elem, className) {
	        if (elem.classList) {
	            elem.classList.remove(className);
	        } else {
	            var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';

	            if (this.has(elem, className)) {
	                while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
	                    newClass = newClass.replace(' ' + className + ' ', ' ');
	                }
	                elem.className = newClass.replace(/^\s+|\s+$/g, '');
	            }
	        }
	    },

	    toggle: function (elem, className) {
	        if (elem.classList) {
	            elem.classList.toggle(className);
	        } else {
	            var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ' ) + ' ';

	            if (this.has(elem, className)) {
	                while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
	                    newClass = newClass.replace( ' ' + className + ' ' , ' ' );
	                }
	                elem.className = newClass.replace(/^\s+|\s+$/g, '');
	            } else {
	                elem.className += ' ' + className;
	            }
	        }
	    },

	    has: function (elem, className) {
	        if (elem.classList) {
	            return elem.classList.contains(className);
	        } else {
	            return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
	        }
	    }
	};


/***/ },
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    /**
	     * Транслитерация текста
	     * Например: Kolya -> Коля и наоборот Коля -> Kolya
	     * @param from {String} - язык исходного текста
	     * @param to {String} - язык для замены
	     * @param text {String} - текст для замены
	     * @returns {String}
	     */
	    translit: function (from, to, text) {
	        var words = {
	            ru: [
	                'Я','я','Ю','ю','Ч','ч','Ш','ш','Щ','щ','Ж','ж','А','а','Б','б','В','в','Г','г','Д','д',
	                'Е','е','Ё','ё','З','з','И','и','Й','й','К','к','Л','л','М','м','Н','н', 'О','о','П','п',
	                'Р','р','С','с','Т','т','У','у','Ф','ф','Х','х','Ц','ц','Ы','ы','Ь','ь','Ъ','ъ','Э','э'
	            ],
	            en: [
	                'Ya','ya','Yu','yu','Ch','ch','Sh','sh','Sh','sh','Zh','zh','A','a','B','b','V','v',
	                'G','g','D','d','E','e','E','e','Z','z','I','i','J','j','K','k','L','l','M','m','N','n',
	                'O','o','P','p','R','r','S','s','T','t','U','u','F','f','H','h','C','c','Y','y','`','`',
	                '\'','\'','E', 'e'
	            ]
	        };

	        return replaceText(words[from], words[to], text);
	    },

	    /**
	     * Заменяет буквы с одного языка на другой
	     * Например: hjuj -> рого, кщпщ -> rogo
	     * @param from {String} - язык исходного текста
	     * @param to {String} - язык для замены
	     * @param text {String} - текст для замены
	     * @returns {String}
	     */
	    replace: function (from, to, text) {
	        var words = {
	            ru: [
	                'й','ц','у','к','е','н','г','ш','щ','з',
	                'ф','ы','в','а','п','р','о','л','д',
	                'я','ч','с','м','и','т','ь'
	            ],
	            en: [
	                'q','w','e','r','t','y','u','i','o','p',
	                'a','s','d','f','g','h','j','k','l',
	                'z','x','c','v','b','n','m'
	            ]
	        };

	        return replaceText(words[from], words[to], text);
	    }
	};

	/**
	 * Функция для замены букв/символов
	 * @param fromWords {Array} - Буквы/символы исходного текста
	 * @param toWords {Array} - Буквы/символы для замены в тексте
	 * @param text {String} - текст для замены
	 * @returns {*}
	 */
	function replaceText(fromWords, toWords, text) {
	    fromWords.forEach(function (word, idx) {
	        var reg = new RegExp(word, 'g');
	        text = text.replace(reg, toWords[idx]);
	    });

	    return text;
	}


/***/ }
/******/ ]);