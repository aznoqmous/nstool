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

/***/ "./node_modules/rigged/src/rigged.js":
/*!*******************************************!*\
  !*** ./node_modules/rigged/src/rigged.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Rigged; });\nclass Rigged {\r\n\r\n    constructor(options) {\r\n        this.init(options)\r\n        this.build()\r\n    }\r\n\r\n    init(options) {\r\n        options = Object.assign({\r\n            container: null,\r\n            template: `div`\r\n        }, options)\r\n        for (let key in options) this[key] = options[key]\r\n    }\r\n\r\n    build() {\r\n        this.elements = this.parse(this.template)\r\n        this.elements.map(element => {\r\n            if (element._connector)\r\n                this[element._connector] = element\r\n        })\r\n        this.element = this.elements[0]\r\n        if(this.container) this.container.appendChild(this.element)\r\n    }\r\n\r\n    parse() {\r\n        let parsed = this.template.trim().split('\\n')\r\n        let tree = []\r\n        let lastIndent = 0\r\n        let lastEl = null\r\n\r\n        if (!parsed.length) return null\r\n\r\n        parsed = parsed.map((str, i) => {\r\n\r\n            let tag = str.trim().match(/^[^ ]*/)[0]\r\n\r\n            let el = document.createElement(tag)\r\n\r\n            let id = this.parseId(str)\r\n            if (id) el.id = id\r\n\r\n            let connector = this.parseConnector(str)\r\n            if(connector) el._connector = connector\r\n\r\n            let classes = this.parseClasses(str)\r\n            if (classes) classes.map(cls => el.classList.add(cls))\r\n\r\n            let attributes = this.parseAttributes(str)\r\n            if(attributes) attributes.map(attr => {\r\n              el.setAttribute(attr.key, attr.value)\r\n            })\r\n\r\n            let content = this.parseContent(str)\r\n            if(content) el.innerHTML = content\r\n\r\n            let indent = str.match(/^\\ */)[0].length\r\n\r\n\r\n            if (!tree.length) {\r\n                tree.push(el)\r\n            } else {\r\n\r\n                // remove one from tree then append inside parent\r\n                if (indent < lastIndent) {\r\n                    tree.splice(tree.length-1, 1)\r\n                    tree[tree.length - 1].appendChild(el)\r\n                }\r\n                else if(indent > lastIndent) {\r\n                    if(!tree.includes(lastEl)) tree.push(lastEl)\r\n                    lastEl.appendChild(el)\r\n                }\r\n                else {\r\n                    tree[tree.length - 1].appendChild(el)\r\n                }\r\n            }\r\n\r\n            lastIndent = indent\r\n            lastEl = el\r\n            return el\r\n        })\r\n\r\n        return parsed\r\n    }\r\n\r\n    removeAttributes(str){\r\n      return str.replace(/\\[[^\\[\\]]*?\\]/gs, '')\r\n    }\r\n\r\n    removeContent(str){\r\n      return str.replace(/\\([^\\(\\)]*?\\)/gs, '')\r\n    }\r\n\r\n    parseClasses(str) {\r\n        str = this.removeAttributes(str)\r\n        str = this.removeContent(str)\r\n\r\n        str = str.match(/\\.[^\\.\\ ]*/gms)\r\n\r\n        if(!str) return null\r\n        return str.map(cls => cls.replace(/\\./, ''))\r\n    }\r\n\r\n    parseId(str) {\r\n        str = this.removeContent(str)\r\n        str = str.match(/\\#[^\\#\\. ]*/)\r\n        if(str) return str[0].replace(/#/, '')\r\n        return null\r\n    }\r\n\r\n    parseConnector(str){\r\n      str = this.removeContent(str)\r\n      let connector = str.match(/\\@[^\\@\\. ]*/)\r\n      if(connector) return connector[0].replace(/@/, '')\r\n      return null\r\n    }\r\n\r\n    parseAttributes(str) {\r\n        str = this.removeContent(str)\r\n        str = str.match(/\\[[^\\]]*\\]/gm)\r\n        if(!str) return null\r\n        return str.map(attr => {\r\n          let key = attr.replace('[', '').replace(/\\=.*?$/, '')\r\n          let value = attr.match(/\\\".*?\\\"/)[0].replaceAll('\"', '')\r\n          return {key, value}\r\n        })\r\n    }\r\n\r\n    parseContent(str){\r\n        str = str.match(/\\([^\\)]*\\)/)\r\n        if(!str) return \"\"\r\n        str = str[0].replace(/[\\(|\\)]/gs, '')\r\n        return str\r\n    }\r\n\r\n    selectOne(selector){\r\n        return this.element.querySelector(selector)\r\n    }\r\n\r\n    selectAll(selector){\r\n        return [...this.element.querySelectorAll(selector)]\r\n    }\r\n\r\n}\r\n\n\n//# sourceURL=webpack:///./node_modules/rigged/src/rigged.js?");

/***/ }),

/***/ "./src/cookies.js":
/*!************************!*\
  !*** ./src/cookies.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Cookies; });\nclass Cookies {\r\n\r\n    static getAll(){\r\n        let cookies = document.cookie\r\n        if(!cookies) return {}\r\n\r\n        let res = {}\r\n\r\n        cookies.split(';').map(strCookie => {\r\n            let splitted = strCookie.split('=')\r\n            let key = splitted[0].trim().replace(/\\\"/gs, '')\r\n            let value = splitted[1]\r\n            return res[key] = value;\r\n        })\r\n\r\n        return res\r\n    }\r\n\r\n    static get(key){\r\n        let value = Cookies.getAll()[key]\r\n        if(!value) return null\r\n        return JSON.parse(value)\r\n    }\r\n\r\n    static set(key, value, expires=864000000000000, path=null){\r\n        let cookie = `${key}=${JSON.stringify(value)};expires=${new Date(expires).toUTCString()}`\r\n        if(path) cookie += `;path=${path}`\r\n        document.cookie = cookie\r\n    }\r\n\r\n}\n\n//# sourceURL=webpack:///./src/cookies.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _nstool__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./nstool */ \"./src/nstool.js\");\n/* harmony import */ var _scss_main_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scss/main.scss */ \"./src/scss/main.scss\");\n/* harmony import */ var _scss_main_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_scss_main_scss__WEBPACK_IMPORTED_MODULE_1__);\n\r\n\r\n\r\ndocument.addEventListener('DOMContentLoaded', ()=>{\r\n  new _nstool__WEBPACK_IMPORTED_MODULE_0__[\"default\"]()\r\n})\r\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/notifier.js":
/*!*************************!*\
  !*** ./src/notifier.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Notifier; });\nclass Notifier {\r\n\r\n    static requestPermission(){\r\n        return Notification.requestPermission()\r\n    }\r\n\r\n    static prompt(message){\r\n        return Notifier.requestPermission().then(()=>{\r\n            this.notify(message)\r\n        })\r\n    }\r\n\r\n    static notify(message){\r\n        let notification = new Notification(message)\r\n        let notified = false\r\n        notification.onclose = ()=>{\r\n            notified = true\r\n        }\r\n\r\n        document._title = document.title\r\n        let blink = (state=false)=>{\r\n            if(state) document.title = document._title\r\n            else document.title = `* ${message}`\r\n            if(!notified) setTimeout(()=>{ blink(!state) }, 1000)\r\n            else document.title = document._title\r\n        }\r\n        blink()\r\n\r\n    }\r\n}\n\n//# sourceURL=webpack:///./src/notifier.js?");

/***/ }),

/***/ "./src/nstool.js":
/*!***********************!*\
  !*** ./src/nstool.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Nstool; });\n/* harmony import */ var _notifier__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./notifier */ \"./src/notifier.js\");\n/* harmony import */ var rigged__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rigged */ \"./node_modules/rigged/src/rigged.js\");\n/* harmony import */ var _cookies__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cookies */ \"./src/cookies.js\");\n\r\n\r\n\r\n\r\nclass Nstool extends rigged__WEBPACK_IMPORTED_MODULE_1__[\"default\"] {\r\n\r\n    constructor() {\r\n        super({ template: `\r\n        div .nstool\r\n            h1 (nstool)\r\n            div .search.mb-2\r\n                input @searchInput #searchInput .form-control [autofocus=\"true\"] [placeholder=\"www.yoursite.com\"]\r\n                div @suggests #suggests\r\n            input @mailInput #mailInput .mb-2.form-control [type=\"mail\"] [placeholder=\"mail\"]\r\n            div @dnsResults #dnsResults\r\n            div @certResults #certResults\r\n        ` })\r\n\r\n        /**\r\n         * Set up saved informations\r\n         */\r\n        this.history = _cookies__WEBPACK_IMPORTED_MODULE_2__[\"default\"].get('history')\r\n        if(!this.history) this.history = []\r\n\r\n        this.mailInput.value = _cookies__WEBPACK_IMPORTED_MODULE_2__[\"default\"].get('mail')\r\n\r\n        /**\r\n         * Asks for notification permission\r\n         */\r\n        _notifier__WEBPACK_IMPORTED_MODULE_0__[\"default\"].requestPermission()\r\n\r\n\r\n        this.watchTimeout = 5000\r\n\r\n        document.body.appendChild(this.element)\r\n\r\n        this.bind()\r\n    }\r\n\r\n    bind(){\r\n\r\n        this.searchInput.addEventListener('focusin', ()=>{\r\n            this.updateSuggests()\r\n            setTimeout(()=>{ this.suggests.classList.add('active')}, 100)\r\n        })\r\n\r\n        this.searchInput.addEventListener('focusout', ()=>{\r\n            setTimeout(()=>{ this.suggests.classList.remove('active')}, 100)\r\n        })\r\n\r\n        this.searchInput.addEventListener('keyup', (e)=>{\r\n\r\n            this.updateSuggests()\r\n\r\n            if(e.key !== 'Enter') return;\r\n\r\n            this.searchInput.value = this.searchInput.value\r\n                .replace('https://', '')\r\n                .replace('http://', '')\r\n            let url = new URL(`http://${this.searchInput.value}`)\r\n            this.searchInput.value = url.hostname\r\n\r\n            this.search(this.searchInput.value)\r\n        })\r\n\r\n        this.mailInput.addEventListener('focusout', ()=>{\r\n            this.addMail(this.mailInput.value)\r\n        })\r\n    }\r\n\r\n    updateSuggests(){\r\n        let historyMatches = this.matchHistory(this.searchInput.value)\r\n        this.suggests.innerHTML = ''\r\n\r\n        if(historyMatches.length){\r\n            historyMatches.map(domain => {\r\n                let newEl = new rigged__WEBPACK_IMPORTED_MODULE_1__[\"default\"]({template: `\r\n                    div .suggest\r\n                        span @name (${domain}) \r\n                        i @delete .delete\r\n                `})\r\n\r\n                this.suggests.appendChild(newEl.element)\r\n                newEl.name.addEventListener('click', ()=>{\r\n                    this.search(domain)\r\n                })\r\n                newEl.delete.addEventListener('click', ()=>{\r\n                    this.removeFromSuggests(domain)\r\n                })\r\n            })\r\n        }\r\n    }\r\n\r\n    search(value){\r\n        this.searchInput.value = value\r\n\r\n        this.nslookup(value)\r\n            .then(res => {\r\n                if(res) this.addToSuggests(value)\r\n                this.dnsResults.innerHTML = ''\r\n                this.dnsResults.appendChild(this.displayNSLogs(res))\r\n            })\r\n\r\n        this.certlookup(value)\r\n            .then(res => {\r\n                this.certResults.innerHTML = ''\r\n                this.certResults.appendChild(this.displayCert(res))\r\n            })\r\n    }\r\n\r\n    nslookup(value){\r\n        this.lastSearch = value\r\n        return this.post('ns-lookup.php', value)\r\n    }\r\n\r\n    certlookup(value){\r\n        this.lastSearch = value\r\n        return this.post('cert.php', value)\r\n    }\r\n\r\n    sendmail(destination, content){\r\n        return this.post('mail.php', {\r\n            destination, content\r\n        })\r\n    }\r\n\r\n    post(url, query){\r\n        let data = new FormData()\r\n        data.append('query', JSON.stringify(query))\r\n        return fetch(`/services/${url}`, {\r\n            method: 'POST',\r\n            body: data\r\n        })\r\n            .then(res => res.json())\r\n    }\r\n\r\n    displayNSLogs(logs){\r\n        let rigged = (new rigged__WEBPACK_IMPORTED_MODULE_1__[\"default\"]({template: `\r\n            table .table.table-bordered\r\n                thead\r\n                    tr\r\n                tbody\r\n        `}))\r\n        let logEl = rigged.element\r\n\r\n        let attributes = 'host,class,ttl,type,pri,value,watch'.split(',')\r\n\r\n        let line = rigged.selectOne('thead > tr')\r\n\r\n        attributes.map(attr => {\r\n            let td = document.createElement('th')\r\n            td.innerHTML = attr\r\n            line.appendChild(td)\r\n        })\r\n\r\n        let body = rigged.selectOne('tbody')\r\n        logs\r\n            .sort((a, b)=>{\r\n                return a.type > b.type ? 1 : -1\r\n            })\r\n            .map(log => {\r\n                line = document.createElement('tr')\r\n                line.setAttribute('data-type', log.type)\r\n                attributes.map(attr => {\r\n                    let td = document.createElement('td')\r\n                    td.setAttribute('data-attr', attr)\r\n                    td.innerHTML = log[attr] ? log[attr] : ''\r\n                    line.appendChild(td)\r\n\r\n                    // build watch btn\r\n                    if(attr === 'watch') {\r\n                        let watchBtn = new rigged__WEBPACK_IMPORTED_MODULE_1__[\"default\"]({\r\n                            container: td,\r\n                            template: 'button .btn.btn-primary (watch)'\r\n                        })\r\n                        watchBtn.element.addEventListener('click', ()=>{\r\n                            watchBtn.element.classList.toggle('active')\r\n                            if(watchBtn.element.classList.contains('active'))  watchBtn.element.innerHTML = 'watching...'\r\n                            else watchBtn.element.innerHTML = 'watch'\r\n                            let saveLogValue = this.getRecordStringValue(logs, log.type)\r\n\r\n                            let domain = this.lastSearch\r\n\r\n                            let watch = ()=>{\r\n                                this.nslookup(domain)\r\n                                    .then(watchLogs => {\r\n                                        let newValue = this.getRecordStringValue(watchLogs, log.type)\r\n                                        if(newValue != saveLogValue) {\r\n                                            saveLogValue = newValue\r\n                                            let message = `The DNS value ${log.type} for ${domain} has been changed to ${newValue}!`\r\n                                            _notifier__WEBPACK_IMPORTED_MODULE_0__[\"default\"].prompt(message)\r\n\r\n                                            if(this.mailInput.value) this.sendmail(this.mailInput.value, message)\r\n                                            let value = line.querySelector('[data-attr=\"value\"]')\r\n                                            value.innerHTML += `<br>${newValue} ${(new Date()).toLocaleTimeString()}`\r\n                                        }\r\n                                    })\r\n                                if(watchBtn.element.classList.contains('active')) setTimeout(()=>{watch()}, this.watchTimeout)\r\n                            }\r\n                            watch()\r\n                        })\r\n                    }\r\n                })\r\n                body.appendChild(line)\r\n            })\r\n        return logEl\r\n    }\r\n\r\n    displayCert(cert){\r\n        let rigged = (new rigged__WEBPACK_IMPORTED_MODULE_1__[\"default\"]({template: `\r\n            table .table.table-bordered\r\n                thead\r\n                    tr\r\n                tbody\r\n        `}))\r\n        let certEl = rigged.element\r\n\r\n        if(!cert) {\r\n            certEl.innerHTML = 'No SSL'\r\n            return certEl;\r\n        }\r\n\r\n        let attributes = 'from,to,verified,issuer,names'.split(',')\r\n        let line = document.createElement('tr')\r\n        let contentLine = document.createElement('tr')\r\n\r\n        certEl.appendChild(line)\r\n        certEl.appendChild(contentLine)\r\n\r\n        attributes.map(attr => {\r\n            let th = document.createElement('th')\r\n            let td = document.createElement('td')\r\n            th.innerHTML = attr\r\n            td.innerHTML = cert[attr]\r\n            line.appendChild(th)\r\n            contentLine.appendChild(td)\r\n        })\r\n\r\n        return certEl\r\n    }\r\n\r\n    filterLogs(logs, type){\r\n        return logs.filter(log => log.type === type)\r\n    }\r\n\r\n    getRecordStringValue(logs, type){\r\n        return this.filterLogs(logs, type)\r\n            .map(log => log.value).sort().join('')\r\n    }\r\n\r\n    addToSuggests(domain){\r\n        if(!domain) return;\r\n        if(!this.history.includes(domain)) this.history.push(domain)\r\n        _cookies__WEBPACK_IMPORTED_MODULE_2__[\"default\"].set('history', this.history)\r\n    }\r\n\r\n    removeFromSuggests(domain){\r\n        if(this.history.includes(domain)) this.history.splice(this.history.indexOf(domain), 1)\r\n        _cookies__WEBPACK_IMPORTED_MODULE_2__[\"default\"].set('history', this.history)\r\n    }\r\n\r\n    addMail(mail){\r\n        _cookies__WEBPACK_IMPORTED_MODULE_2__[\"default\"].set('mail', mail)\r\n    }\r\n\r\n    matchHistory(value){\r\n        return this.history.filter(domain => {\r\n            return domain.match(value)\r\n        }).sort()\r\n    }\r\n}\n\n//# sourceURL=webpack:///./src/nstool.js?");

/***/ }),

/***/ "./src/scss/main.scss":
/*!****************************!*\
  !*** ./src/scss/main.scss ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/scss/main.scss?");

/***/ })

/******/ });