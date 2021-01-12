/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("document.addEventListener('DOMContentLoaded', ()=>{\r\n  let search = document.getElementById('search')\r\n  let result = document.getElementById('result')\r\n\r\n  search.addEventListener('keyup', (e)=>{\r\n    if(e.key != 'Enter') return;\r\n    result.innerHTML = ''\r\n\r\n    search.value = search.value\r\n    .replace('https://', '')\r\n    .replace('http://', '')\r\n\r\n    post('/ns-lookup.php', search.value)\r\n    .then(res => {\r\n      result.appendChild(displayNSLogs(res))\r\n    })\r\n\r\n    post('/cert.php', search.value)\r\n    .then(res => {\r\n      result.appendChild(displayCert(res))\r\n    })\r\n  })\r\n\r\n})\r\n\r\nfunction post(url, query){\r\n  let data = new FormData()\r\n  data.append('query', query)\r\n  return fetch(url, {\r\n    method: 'POST',\r\n    body: data\r\n  })\r\n  .then(res => res.json())\r\n}\r\n\r\nfunction displayNSLogs(logs){\r\n  let logEl = document.createElement('table')\r\n  let attributes = 'host,class,ttl,type,pri,value'.split(',')\r\n\r\n  let line = document.createElement('tr')\r\n  attributes.map(attr => {\r\n    let td = document.createElement('th')\r\n    td.innerHTML = attr\r\n    line.appendChild(td)\r\n  })\r\n  logEl.appendChild(line)\r\n\r\n  logs\r\n  .sort((a, b)=>{\r\n    return a.type > b.type ? 1 : -1\r\n  })\r\n  .map(log => {\r\n    line = document.createElement('tr')\r\n    attributes.map(attr => {\r\n      let td = document.createElement('td')\r\n      td.innerHTML = log[attr] ? log[attr] : '-'\r\n      line.appendChild(td)\r\n    })\r\n    logEl.appendChild(line)\r\n  })\r\n  return logEl\r\n}\r\n\r\nfunction displayCert(cert){\r\n  let certEl = document.createElement('table')\r\n  if(!cert) {\r\n      certEl.innerHTML = 'No SSL'\r\n      return certEl;\r\n  }\r\n\r\n  let attributes = 'from,to,verified,issuer,names'.split(',')\r\n  let line = document.createElement('tr')\r\n  let contentLine = document.createElement('tr')\r\n  certEl.appendChild(line)\r\n  certEl.appendChild(contentLine)\r\n\r\n  attributes.map(attr => {\r\n    let th = document.createElement('th')\r\n    let td = document.createElement('td')\r\n    th.innerHTML = attr\r\n    td.innerHTML = cert[attr]\r\n    line.appendChild(th)\r\n    contentLine.appendChild(td)\r\n  })\r\n\r\n  return certEl\r\n}\r\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });