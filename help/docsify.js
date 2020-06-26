(function () {
  /**
   * Create a cached version of a pure function.
   * @param {*} fn The function call to be cached
   * @void
   */

  function cached(fn) {
    var cache = Object.create(null);
    return function(str) {
      var key = isPrimitive(str) ? str : JSON.stringify(str);
      var hit = cache[key];
      return hit || (cache[key] = fn(str));
    };
  }

  /**
   * Hyphenate a camelCase string.
   */
  var hyphenate = cached(function (str) {
    return str.replace(/([A-Z])/g, function (m) { return '-' + m.toLowerCase(); });
  });

  var hasOwn = Object.prototype.hasOwnProperty;

  /**
   * Simple Object.assign polyfill
   * @param {Object} to The object to be merged with
   * @returns {Object} The merged object
   */
  var merge =
    Object.assign ||
    function(to) {
      var arguments$1 = arguments;

      for (var i = 1; i < arguments.length; i++) {
        var from = Object(arguments$1[i]);

        for (var key in from) {
          if (hasOwn.call(from, key)) {
            to[key] = from[key];
          }
        }
      }

      return to;
    };

  /**
   * Check if value is primitive
   * @param {*} value Checks if a value is primitive
   * @returns {Boolean} Result of the check
   */
  function isPrimitive(value) {
    return typeof value === 'string' || typeof value === 'number';
  }

  /**
   * Performs no operation.
   * @void
   */
  function noop() {}

  /**
   * Check if value is function
   * @param {*} obj Any javascript object
   * @returns {Boolean} True if the passed-in value is a function
   */
  function isFn(obj) {
    return typeof obj === 'function';
  }

  var inBrowser = !false;

  var isMobile =  document.body.clientWidth <= 600;

  /**
   * @see https://github.com/MoOx/pjax/blob/master/lib/is-supported.js
   */
  var supportsPushState =
    
    (function() {
      // Borrowed wholesale from https://github.com/defunkt/jquery-pjax
      return (
        window.history &&
        window.history.pushState &&
        window.history.replaceState &&
        // PushState isn’t reliable on iOS until 5.
        !navigator.userAgent.match(
          /((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/
        )
      );
    })();

  var cacheNode = {};

  /**
   * Get Node
   * @param  {String|Element} el A DOM element
   * @param  {Boolean} noCache Flag to use or not use the cache
   * @return {Element} The found node element
   */
  function getNode(el, noCache) {
    if ( noCache === void 0 ) noCache = false;

    if (typeof el === 'string') {
      if (typeof window.Vue !== 'undefined') {
        return find(el);
      }

      el = noCache ? find(el) : cacheNode[el] || (cacheNode[el] = find(el));
    }

    return el;
  }

  var $ =  document;

  var body =  $.body;

  var head =  $.head;

  /**
   * Find elements
   * @param {String|Element} el The root element where to perform the search from
   * @param {Element} node The query
   * @returns {Element} The found DOM element
   * @example
   * find('nav') => document.querySelector('nav')
   * find(nav, 'a') => nav.querySelector('a')
   */
  function find(el, node) {
    return node ? el.querySelector(node) : $.querySelector(el);
  }

  /**
   * Find all elements
   * @param {String|Element} el The root element where to perform the search from
   * @param {Element} node The query
   * @returns {Array<Element>} An array of DOM elements
   * @example
   * findAll('a') => [].slice.call(document.querySelectorAll('a'))
   * findAll(nav, 'a') => [].slice.call(nav.querySelectorAll('a'))
   */
  function findAll(el, node) {
    return [].slice.call(
      node ? el.querySelectorAll(node) : $.querySelectorAll(el)
    );
  }

  function create(node, tpl) {
    node = $.createElement(node);
    if (tpl) {
      node.innerHTML = tpl;
    }

    return node;
  }

  function appendTo(target, el) {
    return target.appendChild(el);
  }

  function before(target, el) {
    return target.insertBefore(el, target.children[0]);
  }

  function on(el, type, handler) {
    isFn(type)
      ? window.addEventListener(el, type)
      : el.addEventListener(type, handler);
  }

  function off(el, type, handler) {
    isFn(type)
      ? window.removeEventListener(el, type)
      : el.removeEventListener(type, handler);
  }

  /**
   * Toggle class
   * @param {String|Element} el The element that needs the class to be toggled
   * @param {Element} type The type of action to be performed on the classList (toggle by default)
   * @param {String} val Name of the class to be toggled
   * @void
   * @example
   * toggleClass(el, 'active') => el.classList.toggle('active')
   * toggleClass(el, 'add', 'active') => el.classList.add('active')
   */
  function toggleClass(el, type, val) {
    el && el.classList[val ? type : 'toggle'](val || type);
  }

  function style(content) {
    appendTo(head, create('style', content));
  }

  /**
   * Fork https://github.com/bendrucker/document-ready/blob/master/index.js
   * @param {Function} callback The callbacack to be called when the page is loaded
   * @returns {Number|void} If the page is already laoded returns the result of the setTimeout callback,
   *  otherwise it only attaches the callback to the DOMContentLoaded event
   */
  function documentReady(callback, doc) {
    if ( doc === void 0 ) doc = document;

    var state = doc.readyState;

    if (state === 'complete' || state === 'interactive') {
      return setTimeout(callback, 0);
    }

    doc.addEventListener('DOMContentLoaded', callback);
  }

  var dom = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getNode: getNode,
    $: $,
    body: body,
    head: head,
    find: find,
    findAll: findAll,
    create: create,
    appendTo: appendTo,
    before: before,
    on: on,
    off: off,
    toggleClass: toggleClass,
    style: style,
    documentReady: documentReady
  });

  var currentScript = document.currentScript;

  function config(vm) {
    var config = merge(
      {
        el: '#app',
        repo: '',
        maxLevel: 6,
        subMaxLevel: 0,
        loadSidebar: null,
        loadNavbar: null,
        homepage: 'doc.md',
        coverpage: '',
        basePath: '',
        auto2top: false,
        name: '',
        themeColor: '',
        nameLink: window.location.pathname,
        autoHeader: false,
        executeScript: null,
        noEmoji: false,
        ga: '',
        ext: '.md',
        mergeNavbar: false,
        formatUpdated: '',
        // This config for the links inside markdown
        externalLinkTarget: '_blank',
        // This config for the corner
        cornerExternalLinkTarget: '_blank',
        externalLinkRel: 'noopener',
        routerMode: 'hash',
        noCompileLinks: [],
        crossOriginLinks: [],
        relativePath: false,
        topMargin: 0,
      },
      typeof window.$docsify === 'function'
        ? window.$docsify(vm)
        : window.$docsify
    );

    var script =
      currentScript ||
      [].slice
        .call(document.getElementsByTagName('script'))
        .filter(function (n) { return /docsify\./.test(n.src); })[0];

    if (script) {
      for (var prop in config) {
        if (hasOwn.call(config, prop)) {
          var val = script.getAttribute('data-' + hyphenate(prop));

          if (isPrimitive(val)) {
            config[prop] = val === '' ? true : val;
          }
        }
      }
    }

    if (config.loadSidebar === true) {
      config.loadSidebar = '_sidebar' + config.ext;
    }

    if (config.loadNavbar === true) {
      config.loadNavbar = '_navbar' + config.ext;
    }

    if (config.coverpage === true) {
      config.coverpage = 'c' + config.ext;
    }

    if (config.repo === true) {
      config.repo = '';
    }

    if (config.name === true) {
      config.name = '';
    }

    window.$docsify = config;

    return config;
  }

  var RGX = /([^{]*?)\w(?=\})/g;

  var MAP = {
  	YYYY: 'getFullYear',
  	YY: 'getYear',
  	MM: function (d) {
  		return d.getMonth() + 1;
  	},
  	DD: 'getDate',
  	HH: 'getHours',
  	mm: 'getMinutes',
  	ss: 'getSeconds',
  	fff: 'getMilliseconds'
  };

  function tinydate (str, custom) {
  	var parts=[], offset=0;

  	str.replace(RGX, function (key, _, idx) {
  		// save preceding string
  		parts.push(str.substring(offset, idx - 1));
  		offset = idx += key.length + 1;
  		// save function
  		parts.push(custom && custom[key] || function (d) {
  			return ('00' + (typeof MAP[key] === 'string' ? d[MAP[key]]() : MAP[key](d))).slice(-key.length);
  		});
  	});

  	if (offset !== str.length) {
  		parts.push(str.substring(offset));
  	}

  	return function (arg) {
  		var out='', i=0, d=arg||new Date();
  		for (; i<parts.length; i++) {
  			out += (typeof parts[i]==='string') ? parts[i] : parts[i](d);
  		}
  		return out;
  	};
  }

  function _toConsumableArray$1(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

  var hasOwnProperty = Object.hasOwnProperty;
  var setPrototypeOf = Object.setPrototypeOf;
  var isFrozen = Object.isFrozen;
  var objectKeys = Object.keys;
  var freeze = Object.freeze;
  var seal = Object.seal; // eslint-disable-line import/no-mutable-exports

  var _ref = typeof Reflect !== 'undefined' && Reflect;
  var apply = _ref.apply;
  var construct = _ref.construct;

  if (!apply) {
    apply = function apply(fun, thisValue, args) {
      return fun.apply(thisValue, args);
    };
  }

  if (!freeze) {
    freeze = function freeze(x) {
      return x;
    };
  }

  if (!seal) {
    seal = function seal(x) {
      return x;
    };
  }

  if (!construct) {
    construct = function construct(Func, args) {
      return new (Function.prototype.bind.apply(Func, [null].concat(_toConsumableArray$1(args))))();
    };
  }

  var arrayForEach = unapply(Array.prototype.forEach);
  var arrayIndexOf = unapply(Array.prototype.indexOf);
  var arrayJoin = unapply(Array.prototype.join);
  var arrayPop = unapply(Array.prototype.pop);
  var arrayPush = unapply(Array.prototype.push);
  var arraySlice = unapply(Array.prototype.slice);

  var stringToLowerCase = unapply(String.prototype.toLowerCase);
  var stringMatch = unapply(String.prototype.match);
  var stringReplace = unapply(String.prototype.replace);
  var stringIndexOf = unapply(String.prototype.indexOf);
  var stringTrim = unapply(String.prototype.trim);

  var regExpTest = unapply(RegExp.prototype.test);
  var regExpCreate = unconstruct(RegExp);

  var typeErrorCreate = unconstruct(TypeError);

  function unapply(func) {
    return function (thisArg) {
      var arguments$1 = arguments;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments$1[_key];
      }

      return apply(func, thisArg, args);
    };
  }

  function unconstruct(func) {
    return function () {
      var arguments$1 = arguments;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments$1[_key2];
      }

      return construct(func, args);
    };
  }

  /* Add properties to a lookup table */
  function addToSet(set, array) {
    if (setPrototypeOf) {
      // Make 'in' and truthy checks like Boolean(set.constructor)
      // independent of any properties defined on Object.prototype.
      // Prevent prototype setters from intercepting set as a this value.
      setPrototypeOf(set, null);
    }

    var l = array.length;
    while (l--) {
      var element = array[l];
      if (typeof element === 'string') {
        var lcElement = stringToLowerCase(element);
        if (lcElement !== element) {
          // Config presets (e.g. tags.js, attrs.js) are immutable.
          if (!isFrozen(array)) {
            array[l] = lcElement;
          }

          element = lcElement;
        }
      }

      set[element] = true;
    }

    return set;
  }

  /* Shallow clone an object */
  function clone(object) {
    var newObject = {};

    var property = void 0;
    for (property in object) {
      if (apply(hasOwnProperty, object, [property])) {
        newObject[property] = object[property];
      }
    }

    return newObject;
  }

  var html = freeze(['a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meter', 'nav', 'nobr', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'shadow', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr']);

  // SVG
  var svg = freeze(['svg', 'a', 'altglyph', 'altglyphdef', 'altglyphitem', 'animatecolor', 'animatemotion', 'animatetransform', 'audio', 'canvas', 'circle', 'clippath', 'defs', 'desc', 'ellipse', 'filter', 'font', 'g', 'glyph', 'glyphref', 'hkern', 'image', 'line', 'lineargradient', 'marker', 'mask', 'metadata', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialgradient', 'rect', 'stop', 'style', 'switch', 'symbol', 'text', 'textpath', 'title', 'tref', 'tspan', 'video', 'view', 'vkern']);

  var svgFilters = freeze(['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence']);

  var mathMl = freeze(['math', 'menclose', 'merror', 'mfenced', 'mfrac', 'mglyph', 'mi', 'mlabeledtr', 'mmultiscripts', 'mn', 'mo', 'mover', 'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mspace', 'msqrt', 'mstyle', 'msub', 'msup', 'msubsup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover']);

  var text = freeze(['#text']);

  var html$1 = freeze(['accept', 'action', 'align', 'alt', 'autocomplete', 'background', 'bgcolor', 'border', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'clear', 'color', 'cols', 'colspan', 'controls', 'coords', 'crossorigin', 'datetime', 'default', 'dir', 'disabled', 'download', 'enctype', 'face', 'for', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'id', 'integrity', 'ismap', 'label', 'lang', 'list', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'minlength', 'multiple', 'name', 'noshade', 'novalidate', 'nowrap', 'open', 'optimum', 'pattern', 'placeholder', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'rev', 'reversed', 'role', 'rows', 'rowspan', 'spellcheck', 'scope', 'selected', 'shape', 'size', 'sizes', 'span', 'srclang', 'start', 'src', 'srcset', 'step', 'style', 'summary', 'tabindex', 'title', 'type', 'usemap', 'valign', 'value', 'width', 'xmlns']);

  var svg$1 = freeze(['accent-height', 'accumulate', 'additive', 'alignment-baseline', 'ascent', 'attributename', 'attributetype', 'azimuth', 'basefrequency', 'baseline-shift', 'begin', 'bias', 'by', 'class', 'clip', 'clip-path', 'clip-rule', 'color', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'cx', 'cy', 'd', 'dx', 'dy', 'diffuseconstant', 'direction', 'display', 'divisor', 'dur', 'edgemode', 'elevation', 'end', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'filterunits', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'fx', 'fy', 'g1', 'g2', 'glyph-name', 'glyphref', 'gradientunits', 'gradienttransform', 'height', 'href', 'id', 'image-rendering', 'in', 'in2', 'k', 'k1', 'k2', 'k3', 'k4', 'kerning', 'keypoints', 'keysplines', 'keytimes', 'lang', 'lengthadjust', 'letter-spacing', 'kernelmatrix', 'kernelunitlength', 'lighting-color', 'local', 'marker-end', 'marker-mid', 'marker-start', 'markerheight', 'markerunits', 'markerwidth', 'maskcontentunits', 'maskunits', 'max', 'mask', 'media', 'method', 'mode', 'min', 'name', 'numoctaves', 'offset', 'operator', 'opacity', 'order', 'orient', 'orientation', 'origin', 'overflow', 'paint-order', 'path', 'pathlength', 'patterncontentunits', 'patterntransform', 'patternunits', 'points', 'preservealpha', 'preserveaspectratio', 'primitiveunits', 'r', 'rx', 'ry', 'radius', 'refx', 'refy', 'repeatcount', 'repeatdur', 'restart', 'result', 'rotate', 'scale', 'seed', 'shape-rendering', 'specularconstant', 'specularexponent', 'spreadmethod', 'stddeviation', 'stitchtiles', 'stop-color', 'stop-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke', 'stroke-width', 'style', 'surfacescale', 'tabindex', 'targetx', 'targety', 'transform', 'text-anchor', 'text-decoration', 'text-rendering', 'textlength', 'type', 'u1', 'u2', 'unicode', 'values', 'viewbox', 'visibility', 'version', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'width', 'word-spacing', 'wrap', 'writing-mode', 'xchannelselector', 'ychannelselector', 'x', 'x1', 'x2', 'xmlns', 'y', 'y1', 'y2', 'z', 'zoomandpan']);

  var mathMl$1 = freeze(['accent', 'accentunder', 'align', 'bevelled', 'close', 'columnsalign', 'columnlines', 'columnspan', 'denomalign', 'depth', 'dir', 'display', 'displaystyle', 'encoding', 'fence', 'frame', 'height', 'href', 'id', 'largeop', 'length', 'linethickness', 'lspace', 'lquote', 'mathbackground', 'mathcolor', 'mathsize', 'mathvariant', 'maxsize', 'minsize', 'movablelimits', 'notation', 'numalign', 'open', 'rowalign', 'rowlines', 'rowspacing', 'rowspan', 'rspace', 'rquote', 'scriptlevel', 'scriptminsize', 'scriptsizemultiplier', 'selection', 'separator', 'separators', 'stretchy', 'subscriptshift', 'supscriptshift', 'symmetric', 'voffset', 'width', 'xmlns']);

  var xml = freeze(['xlink:href', 'xml:id', 'xlink:title', 'xml:space', 'xmlns:xlink']);

  var MUSTACHE_EXPR = seal(/\{\{[\s\S]*|[\s\S]*\}\}/gm); // Specify template detection regex for SAFE_FOR_TEMPLATES mode
  var ERB_EXPR = seal(/<%[\s\S]*|[\s\S]*%>/gm);
  var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]/); // eslint-disable-line no-useless-escape
  var ARIA_ATTR = seal(/^aria-[\-\w]+$/); // eslint-disable-line no-useless-escape
  var IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i // eslint-disable-line no-useless-escape
  );
  var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
  var ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205f\u3000]/g // eslint-disable-line no-control-regex
  );

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

  var getGlobal = function getGlobal() {
    return typeof window === 'undefined' ? null : window;
  };

  /**
   * Creates a no-op policy for internal use only.
   * Don't export this function outside this module!
   * @param {?TrustedTypePolicyFactory} trustedTypes The policy factory.
   * @param {Document} document The document object (to determine policy name suffix)
   * @return {?TrustedTypePolicy} The policy created (or null, if Trusted Types
   * are not supported).
   */
  var _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, document) {
    if ((typeof trustedTypes === 'undefined' ? 'undefined' : _typeof(trustedTypes)) !== 'object' || typeof trustedTypes.createPolicy !== 'function') {
      return null;
    }

    // Allow the callers to control the unique policy name
    // by adding a data-tt-policy-suffix to the script element with the DOMPurify.
    // Policy creation with duplicate names throws in Trusted Types.
    var suffix = null;
    var ATTR_NAME = 'data-tt-policy-suffix';
    if (document.currentScript && document.currentScript.hasAttribute(ATTR_NAME)) {
      suffix = document.currentScript.getAttribute(ATTR_NAME);
    }

    var policyName = 'dompurify' + (suffix ? '#' + suffix : '');

    try {
      return trustedTypes.createPolicy(policyName, {
        createHTML: function createHTML(html$$1) {
          return html$$1;
        }
      });
    } catch (error) {
      // Policy creation failed (most likely another DOMPurify script has
      // already run). Skip creating the policy, as this will only cause errors
      // if TT are enforced.
      console.warn('TrustedTypes policy ' + policyName + ' could not be created.');
      return null;
    }
  };

  function createDOMPurify() {
    var window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getGlobal();

    var DOMPurify = function DOMPurify(root) {
      return createDOMPurify(root);
    };

    /**
     * Version label, exposed for easier checks
     * if DOMPurify is up to date or not
     */
    DOMPurify.version = '2.0.8';

    /**
     * Array of elements that DOMPurify removed during sanitation.
     * Empty if nothing was removed.
     */
    DOMPurify.removed = [];

    if (!window || !window.document || window.document.nodeType !== 9) {
      // Not running in a browser, provide a factory function
      // so that you can pass your own Window
      DOMPurify.isSupported = false;

      return DOMPurify;
    }

    var originalDocument = window.document;
    var useDOMParser = false;
    var removeTitle = false;

    var document = window.document;
    var DocumentFragment = window.DocumentFragment,
        HTMLTemplateElement = window.HTMLTemplateElement,
        Node = window.Node,
        NodeFilter = window.NodeFilter,
        _window$NamedNodeMap = window.NamedNodeMap,
        NamedNodeMap = _window$NamedNodeMap === undefined ? window.NamedNodeMap || window.MozNamedAttrMap : _window$NamedNodeMap,
        Text = window.Text,
        Comment = window.Comment,
        DOMParser = window.DOMParser,
        trustedTypes = window.trustedTypes;

    // As per issue #47, the web-components registry is inherited by a
    // new document created via createHTMLDocument. As per the spec
    // (http://w3c.github.io/webcomponents/spec/custom/#creating-and-passing-registries)
    // a new empty registry is used when creating a template contents owner
    // document, so we use that as our parent document to ensure nothing
    // is inherited.

    if (typeof HTMLTemplateElement === 'function') {
      var template = document.createElement('template');
      if (template.content && template.content.ownerDocument) {
        document = template.content.ownerDocument;
      }
    }

    var trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, originalDocument);
    var emptyHTML = trustedTypesPolicy ? trustedTypesPolicy.createHTML('') : '';

    var _document = document,
        implementation = _document.implementation,
        createNodeIterator = _document.createNodeIterator,
        getElementsByTagName = _document.getElementsByTagName,
        createDocumentFragment = _document.createDocumentFragment;
    var importNode = originalDocument.importNode;


    var hooks = {};

    /**
     * Expose whether this browser supports running the full DOMPurify.
     */
    DOMPurify.isSupported = implementation && typeof implementation.createHTMLDocument !== 'undefined' && document.documentMode !== 9;

    var MUSTACHE_EXPR$$1 = MUSTACHE_EXPR,
        ERB_EXPR$$1 = ERB_EXPR,
        DATA_ATTR$$1 = DATA_ATTR,
        ARIA_ATTR$$1 = ARIA_ATTR,
        IS_SCRIPT_OR_DATA$$1 = IS_SCRIPT_OR_DATA,
        ATTR_WHITESPACE$$1 = ATTR_WHITESPACE;
    var IS_ALLOWED_URI$$1 = IS_ALLOWED_URI;

    /**
     * We consider the elements and attributes below to be safe. Ideally
     * don't add any new ones but feel free to remove unwanted ones.
     */

    /* allowed element names */

    var ALLOWED_TAGS = null;
    var DEFAULT_ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray(html), _toConsumableArray(svg), _toConsumableArray(svgFilters), _toConsumableArray(mathMl), _toConsumableArray(text)));

    /* Allowed attribute names */
    var ALLOWED_ATTR = null;
    var DEFAULT_ALLOWED_ATTR = addToSet({}, [].concat(_toConsumableArray(html$1), _toConsumableArray(svg$1), _toConsumableArray(mathMl$1), _toConsumableArray(xml)));

    /* Explicitly forbidden tags (overrides ALLOWED_TAGS/ADD_TAGS) */
    var FORBID_TAGS = null;

    /* Explicitly forbidden attributes (overrides ALLOWED_ATTR/ADD_ATTR) */
    var FORBID_ATTR = null;

    /* Decide if ARIA attributes are okay */
    var ALLOW_ARIA_ATTR = true;

    /* Decide if custom data attributes are okay */
    var ALLOW_DATA_ATTR = true;

    /* Decide if unknown protocols are okay */
    var ALLOW_UNKNOWN_PROTOCOLS = false;

    /* Output should be safe for jQuery's $() factory? */
    var SAFE_FOR_JQUERY = false;

    /* Output should be safe for common template engines.
     * This means, DOMPurify removes data attributes, mustaches and ERB
     */
    var SAFE_FOR_TEMPLATES = false;

    /* Decide if document with <html>... should be returned */
    var WHOLE_DOCUMENT = false;

    /* Track whether config is already set on this instance of DOMPurify. */
    var SET_CONFIG = false;

    /* Decide if all elements (e.g. style, script) must be children of
     * document.body. By default, browsers might move them to document.head */
    var FORCE_BODY = false;

    /* Decide if a DOM `HTMLBodyElement` should be returned, instead of a html
     * string (or a TrustedHTML object if Trusted Types are supported).
     * If `WHOLE_DOCUMENT` is enabled a `HTMLHtmlElement` will be returned instead
     */
    var RETURN_DOM = false;

    /* Decide if a DOM `DocumentFragment` should be returned, instead of a html
     * string  (or a TrustedHTML object if Trusted Types are supported) */
    var RETURN_DOM_FRAGMENT = false;

    /* If `RETURN_DOM` or `RETURN_DOM_FRAGMENT` is enabled, decide if the returned DOM
     * `Node` is imported into the current `Document`. If this flag is not enabled the
     * `Node` will belong (its ownerDocument) to a fresh `HTMLDocument`, created by
     * DOMPurify. */
    var RETURN_DOM_IMPORT = false;

    /* Try to return a Trusted Type object instead of a string, retrun a string in
     * case Trusted Types are not supported  */
    var RETURN_TRUSTED_TYPE = false;

    /* Output should be free from DOM clobbering attacks? */
    var SANITIZE_DOM = true;

    /* Keep element content when removing element? */
    var KEEP_CONTENT = true;

    /* If a `Node` is passed to sanitize(), then performs sanitization in-place instead
     * of importing it into a new Document and returning a sanitized copy */
    var IN_PLACE = false;

    /* Allow usage of profiles like html, svg and mathMl */
    var USE_PROFILES = {};

    /* Tags to ignore content of when KEEP_CONTENT is true */
    var FORBID_CONTENTS = addToSet({}, ['annotation-xml', 'audio', 'colgroup', 'desc', 'foreignobject', 'head', 'iframe', 'math', 'mi', 'mn', 'mo', 'ms', 'mtext', 'noembed', 'noframes', 'plaintext', 'script', 'style', 'svg', 'template', 'thead', 'title', 'video', 'xmp']);

    /* Tags that are safe for data: URIs */
    var DATA_URI_TAGS = addToSet({}, ['audio', 'video', 'img', 'source', 'image']);

    /* Attributes safe for values like "javascript:" */
    var URI_SAFE_ATTRIBUTES = null;
    var DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ['alt', 'class', 'for', 'id', 'label', 'name', 'pattern', 'placeholder', 'summary', 'title', 'value', 'style', 'xmlns']);

    /* Keep a reference to config to pass to hooks */
    var CONFIG = null;

    /* Ideally, do not touch anything below this line */
    /* ______________________________________________ */

    var formElement = document.createElement('form');

    /**
     * _parseConfig
     *
     * @param  {Object} cfg optional config literal
     */
    // eslint-disable-next-line complexity
    var _parseConfig = function _parseConfig(cfg) {
      if (CONFIG && CONFIG === cfg) {
        return;
      }

      /* Shield configuration object from tampering */
      if (!cfg || (typeof cfg === 'undefined' ? 'undefined' : _typeof(cfg)) !== 'object') {
        cfg = {};
      }

      /* Set configuration parameters */
      ALLOWED_TAGS = 'ALLOWED_TAGS' in cfg ? addToSet({}, cfg.ALLOWED_TAGS) : DEFAULT_ALLOWED_TAGS;
      ALLOWED_ATTR = 'ALLOWED_ATTR' in cfg ? addToSet({}, cfg.ALLOWED_ATTR) : DEFAULT_ALLOWED_ATTR;
      URI_SAFE_ATTRIBUTES = 'ADD_URI_SAFE_ATTR' in cfg ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR) : DEFAULT_URI_SAFE_ATTRIBUTES;
      FORBID_TAGS = 'FORBID_TAGS' in cfg ? addToSet({}, cfg.FORBID_TAGS) : {};
      FORBID_ATTR = 'FORBID_ATTR' in cfg ? addToSet({}, cfg.FORBID_ATTR) : {};
      USE_PROFILES = 'USE_PROFILES' in cfg ? cfg.USE_PROFILES : false;
      ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false; // Default true
      ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false; // Default true
      ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false; // Default false
      SAFE_FOR_JQUERY = cfg.SAFE_FOR_JQUERY || false; // Default false
      SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false; // Default false
      WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false; // Default false
      RETURN_DOM = cfg.RETURN_DOM || false; // Default false
      RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false; // Default false
      RETURN_DOM_IMPORT = cfg.RETURN_DOM_IMPORT || false; // Default false
      RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false; // Default false
      FORCE_BODY = cfg.FORCE_BODY || false; // Default false
      SANITIZE_DOM = cfg.SANITIZE_DOM !== false; // Default true
      KEEP_CONTENT = cfg.KEEP_CONTENT !== false; // Default true
      IN_PLACE = cfg.IN_PLACE || false; // Default false
      IS_ALLOWED_URI$$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI$$1;
      if (SAFE_FOR_TEMPLATES) {
        ALLOW_DATA_ATTR = false;
      }

      if (RETURN_DOM_FRAGMENT) {
        RETURN_DOM = true;
      }

      /* Parse profile info */
      if (USE_PROFILES) {
        ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray(text)));
        ALLOWED_ATTR = [];
        if (USE_PROFILES.html === true) {
          addToSet(ALLOWED_TAGS, html);
          addToSet(ALLOWED_ATTR, html$1);
        }

        if (USE_PROFILES.svg === true) {
          addToSet(ALLOWED_TAGS, svg);
          addToSet(ALLOWED_ATTR, svg$1);
          addToSet(ALLOWED_ATTR, xml);
        }

        if (USE_PROFILES.svgFilters === true) {
          addToSet(ALLOWED_TAGS, svgFilters);
          addToSet(ALLOWED_ATTR, svg$1);
          addToSet(ALLOWED_ATTR, xml);
        }

        if (USE_PROFILES.mathMl === true) {
          addToSet(ALLOWED_TAGS, mathMl);
          addToSet(ALLOWED_ATTR, mathMl$1);
          addToSet(ALLOWED_ATTR, xml);
        }
      }

      /* Merge configuration parameters */
      if (cfg.ADD_TAGS) {
        if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
          ALLOWED_TAGS = clone(ALLOWED_TAGS);
        }

        addToSet(ALLOWED_TAGS, cfg.ADD_TAGS);
      }

      if (cfg.ADD_ATTR) {
        if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
          ALLOWED_ATTR = clone(ALLOWED_ATTR);
        }

        addToSet(ALLOWED_ATTR, cfg.ADD_ATTR);
      }

      if (cfg.ADD_URI_SAFE_ATTR) {
        addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR);
      }

      /* Add #text in case KEEP_CONTENT is set to true */
      if (KEEP_CONTENT) {
        ALLOWED_TAGS['#text'] = true;
      }

      /* Add html, head and body to ALLOWED_TAGS in case WHOLE_DOCUMENT is true */
      if (WHOLE_DOCUMENT) {
        addToSet(ALLOWED_TAGS, ['html', 'head', 'body']);
      }

      /* Add tbody to ALLOWED_TAGS in case tables are permitted, see #286, #365 */
      if (ALLOWED_TAGS.table) {
        addToSet(ALLOWED_TAGS, ['tbody']);
        delete FORBID_TAGS.tbody;
      }

      // Prevent further manipulation of configuration.
      // Not available in IE8, Safari 5, etc.
      if (freeze) {
        freeze(cfg);
      }

      CONFIG = cfg;
    };

    /**
     * _forceRemove
     *
     * @param  {Node} node a DOM node
     */
    var _forceRemove = function _forceRemove(node) {
      arrayPush(DOMPurify.removed, { element: node });
      try {
        node.parentNode.removeChild(node);
      } catch (error) {
        node.outerHTML = emptyHTML;
      }
    };

    /**
     * _removeAttribute
     *
     * @param  {String} name an Attribute name
     * @param  {Node} node a DOM node
     */
    var _removeAttribute = function _removeAttribute(name, node) {
      try {
        arrayPush(DOMPurify.removed, {
          attribute: node.getAttributeNode(name),
          from: node
        });
      } catch (error) {
        arrayPush(DOMPurify.removed, {
          attribute: null,
          from: node
        });
      }

      node.removeAttribute(name);
    };

    /**
     * _initDocument
     *
     * @param  {String} dirty a string of dirty markup
     * @return {Document} a DOM, filled with the dirty markup
     */
    var _initDocument = function _initDocument(dirty) {
      /* Create a HTML document */
      var doc = void 0;
      var leadingWhitespace = void 0;

      if (FORCE_BODY) {
        dirty = '<remove></remove>' + dirty;
      } else {
        /* If FORCE_BODY isn't used, leading whitespace needs to be preserved manually */
        var matches = stringMatch(dirty, /^[\s]+/);
        leadingWhitespace = matches && matches[0];
      }

      var dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
      /* Use DOMParser to workaround Firefox bug (see comment below) */
      if (useDOMParser) {
        try {
          doc = new DOMParser().parseFromString(dirtyPayload, 'text/html');
        } catch (error) {}
      }

      /* Remove title to fix a mXSS bug in older MS Edge */
      if (removeTitle) {
        addToSet(FORBID_TAGS, ['title']);
      }

      /* Otherwise use createHTMLDocument, because DOMParser is unsafe in
      Safari (see comment below) */
      if (!doc || !doc.documentElement) {
        doc = implementation.createHTMLDocument('');
        var _doc = doc,
            body = _doc.body;

        body.parentNode.removeChild(body.parentNode.firstElementChild);
        body.outerHTML = dirtyPayload;
      }

      if (dirty && leadingWhitespace) {
        doc.body.insertBefore(document.createTextNode(leadingWhitespace), doc.body.childNodes[0] || null);
      }

      /* Work on whole document or just its body */
      return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? 'html' : 'body')[0];
    };

    // Firefox uses a different parser for innerHTML rather than
    // DOMParser (see https://bugzilla.mozilla.org/show_bug.cgi?id=1205631)
    // which means that you *must* use DOMParser, otherwise the output may
    // not be safe if used in a document.write context later.
    //
    // So we feature detect the Firefox bug and use the DOMParser if necessary.
    //
    // Chrome 77 and other versions ship an mXSS bug that caused a bypass to
    // happen. We now check for the mXSS trigger and react accordingly.
    if (DOMPurify.isSupported) {
      (function () {
        try {
          var doc = _initDocument('<svg><p><textarea><img src="</textarea><img src=x abc=1//">');
          if (doc.querySelector('svg img')) {
            useDOMParser = true;
          }
        } catch (error) {}
      })();

      (function () {
        try {
          var doc = _initDocument('<x/><title>&lt;/title&gt;&lt;img&gt;');
          if (regExpTest(/<\/title/, doc.querySelector('title').innerHTML)) {
            removeTitle = true;
          }
        } catch (error) {}
      })();
    }

    /**
     * _createIterator
     *
     * @param  {Document} root document/fragment to create iterator for
     * @return {Iterator} iterator instance
     */
    var _createIterator = function _createIterator(root) {
      return createNodeIterator.call(root.ownerDocument || root, root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT, function () {
        return NodeFilter.FILTER_ACCEPT;
      }, false);
    };

    /**
     * _isClobbered
     *
     * @param  {Node} elm element to check for clobbering attacks
     * @return {Boolean} true if clobbered, false if safe
     */
    var _isClobbered = function _isClobbered(elm) {
      if (elm instanceof Text || elm instanceof Comment) {
        return false;
      }

      if (typeof elm.nodeName !== 'string' || typeof elm.textContent !== 'string' || typeof elm.removeChild !== 'function' || !(elm.attributes instanceof NamedNodeMap) || typeof elm.removeAttribute !== 'function' || typeof elm.setAttribute !== 'function' || typeof elm.namespaceURI !== 'string') {
        return true;
      }

      return false;
    };

    /**
     * _isNode
     *
     * @param  {Node} obj object to check whether it's a DOM node
     * @return {Boolean} true is object is a DOM node
     */
    var _isNode = function _isNode(obj) {
      return (typeof Node === 'undefined' ? 'undefined' : _typeof(Node)) === 'object' ? obj instanceof Node : obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && typeof obj.nodeType === 'number' && typeof obj.nodeName === 'string';
    };

    /**
     * _executeHook
     * Execute user configurable hooks
     *
     * @param  {String} entryPoint  Name of the hook's entry point
     * @param  {Node} currentNode node to work on with the hook
     * @param  {Object} data additional hook parameters
     */
    var _executeHook = function _executeHook(entryPoint, currentNode, data) {
      if (!hooks[entryPoint]) {
        return;
      }

      arrayForEach(hooks[entryPoint], function (hook) {
        hook.call(DOMPurify, currentNode, data, CONFIG);
      });
    };

    /**
     * _sanitizeElements
     *
     * @protect nodeName
     * @protect textContent
     * @protect removeChild
     *
     * @param   {Node} currentNode to check for permission to exist
     * @return  {Boolean} true if node was killed, false if left alive
     */
    // eslint-disable-next-line complexity
    var _sanitizeElements = function _sanitizeElements(currentNode) {
      var content = void 0;

      /* Execute a hook if present */
      _executeHook('beforeSanitizeElements', currentNode, null);

      /* Check if element is clobbered or can clobber */
      if (_isClobbered(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }

      /* Now let's check the element's type and name */
      var tagName = stringToLowerCase(currentNode.nodeName);

      /* Execute a hook if present */
      _executeHook('uponSanitizeElement', currentNode, {
        tagName: tagName,
        allowedTags: ALLOWED_TAGS
      });

      /* Take care of an mXSS pattern using p, br inside svg, math */
      if ((tagName === 'svg' || tagName === 'math') && currentNode.querySelectorAll('p, br').length !== 0) {
        _forceRemove(currentNode);
        return true;
      }

      /* Remove element if anything forbids its presence */
      if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
        /* Keep content except for black-listed elements */
        if (KEEP_CONTENT && !FORBID_CONTENTS[tagName] && typeof currentNode.insertAdjacentHTML === 'function') {
          try {
            var htmlToInsert = currentNode.innerHTML;
            currentNode.insertAdjacentHTML('AfterEnd', trustedTypesPolicy ? trustedTypesPolicy.createHTML(htmlToInsert) : htmlToInsert);
          } catch (error) {}
        }

        _forceRemove(currentNode);
        return true;
      }

      /* Remove in case a noscript/noembed XSS is suspected */
      if (tagName === 'noscript' && regExpTest(/<\/noscript/i, currentNode.innerHTML)) {
        _forceRemove(currentNode);
        return true;
      }

      if (tagName === 'noembed' && regExpTest(/<\/noembed/i, currentNode.innerHTML)) {
        _forceRemove(currentNode);
        return true;
      }

      /* Convert markup to cover jQuery behavior */
      if (SAFE_FOR_JQUERY && !currentNode.firstElementChild && (!currentNode.content || !currentNode.content.firstElementChild) && regExpTest(/</g, currentNode.textContent)) {
        arrayPush(DOMPurify.removed, { element: currentNode.cloneNode() });
        if (currentNode.innerHTML) {
          currentNode.innerHTML = stringReplace(currentNode.innerHTML, /</g, '&lt;');
        } else {
          currentNode.innerHTML = stringReplace(currentNode.textContent, /</g, '&lt;');
        }
      }

      /* Sanitize element content to be template-safe */
      if (SAFE_FOR_TEMPLATES && currentNode.nodeType === 3) {
        /* Get the element's text content */
        content = currentNode.textContent;
        content = stringReplace(content, MUSTACHE_EXPR$$1, ' ');
        content = stringReplace(content, ERB_EXPR$$1, ' ');
        if (currentNode.textContent !== content) {
          arrayPush(DOMPurify.removed, { element: currentNode.cloneNode() });
          currentNode.textContent = content;
        }
      }

      /* Execute a hook if present */
      _executeHook('afterSanitizeElements', currentNode, null);

      return false;
    };

    /**
     * _isValidAttribute
     *
     * @param  {string} lcTag Lowercase tag name of containing element.
     * @param  {string} lcName Lowercase attribute name.
     * @param  {string} value Attribute value.
     * @return {Boolean} Returns true if `value` is valid, otherwise false.
     */
    // eslint-disable-next-line complexity
    var _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
      /* Make sure attribute cannot clobber */
      if (SANITIZE_DOM && (lcName === 'id' || lcName === 'name') && (value in document || value in formElement)) {
        return false;
      }

      /* Allow valid data-* attributes: At least one character after "-"
          (https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
          XML-compatible (https://html.spec.whatwg.org/multipage/infrastructure.html#xml-compatible and http://www.w3.org/TR/xml/#d0e804)
          We don't need to check the value; it's always URI safe. */
      if (ALLOW_DATA_ATTR && regExpTest(DATA_ATTR$$1, lcName)) ; else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$$1, lcName)) ; else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
        return false;

        /* Check value is safe. First, is attr inert? If so, is safe */
      } else if (URI_SAFE_ATTRIBUTES[lcName]) ; else if (regExpTest(IS_ALLOWED_URI$$1, stringReplace(value, ATTR_WHITESPACE$$1, ''))) ; else if ((lcName === 'src' || lcName === 'xlink:href' || lcName === 'href') && lcTag !== 'script' && stringIndexOf(value, 'data:') === 0 && DATA_URI_TAGS[lcTag]) ; else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$$1, stringReplace(value, ATTR_WHITESPACE$$1, ''))) ; else if (!value) ; else {
        return false;
      }

      return true;
    };

    /**
     * _sanitizeAttributes
     *
     * @protect attributes
     * @protect nodeName
     * @protect removeAttribute
     * @protect setAttribute
     *
     * @param  {Node} currentNode to sanitize
     */
    // eslint-disable-next-line complexity
    var _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
      var attr = void 0;
      var value = void 0;
      var lcName = void 0;
      var idAttr = void 0;
      var l = void 0;
      /* Execute a hook if present */
      _executeHook('beforeSanitizeAttributes', currentNode, null);

      var attributes = currentNode.attributes;

      /* Check if we have attributes; if not we might have a text node */

      if (!attributes) {
        return;
      }

      var hookEvent = {
        attrName: '',
        attrValue: '',
        keepAttr: true,
        allowedAttributes: ALLOWED_ATTR
      };
      l = attributes.length;

      /* Go backwards over all attributes; safely remove bad ones */
      while (l--) {
        attr = attributes[l];
        var _attr = attr,
            name = _attr.name,
            namespaceURI = _attr.namespaceURI;

        value = stringTrim(attr.value);
        lcName = stringToLowerCase(name);

        /* Execute a hook if present */
        hookEvent.attrName = lcName;
        hookEvent.attrValue = value;
        hookEvent.keepAttr = true;
        hookEvent.forceKeepAttr = undefined; // Allows developers to see this is a property they can set
        _executeHook('uponSanitizeAttribute', currentNode, hookEvent);
        value = hookEvent.attrValue;
        /* Did the hooks approve of the attribute? */
        if (hookEvent.forceKeepAttr) {
          continue;
        }

        /* Remove attribute */
        // Safari (iOS + Mac), last tested v8.0.5, crashes if you try to
        // remove a "name" attribute from an <img> tag that has an "id"
        // attribute at the time.
        if (lcName === 'name' && currentNode.nodeName === 'IMG' && attributes.id) {
          idAttr = attributes.id;
          attributes = arraySlice(attributes, []);
          _removeAttribute('id', currentNode);
          _removeAttribute(name, currentNode);
          if (arrayIndexOf(attributes, idAttr) > l) {
            currentNode.setAttribute('id', idAttr.value);
          }
        } else if (
        // This works around a bug in Safari, where input[type=file]
        // cannot be dynamically set after type has been removed
        currentNode.nodeName === 'INPUT' && lcName === 'type' && value === 'file' && hookEvent.keepAttr && (ALLOWED_ATTR[lcName] || !FORBID_ATTR[lcName])) {
          continue;
        } else {
          // This avoids a crash in Safari v9.0 with double-ids.
          // The trick is to first set the id to be empty and then to
          // remove the attribute
          if (name === 'id') {
            currentNode.setAttribute(name, '');
          }

          _removeAttribute(name, currentNode);
        }

        /* Did the hooks approve of the attribute? */
        if (!hookEvent.keepAttr) {
          continue;
        }

        /* Work around a security issue in jQuery 3.0 */
        if (SAFE_FOR_JQUERY && regExpTest(/\/>/i, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }

        /* Take care of an mXSS pattern using namespace switches */
        if (regExpTest(/svg|math/i, currentNode.namespaceURI) && regExpTest(regExpCreate('</(' + arrayJoin(objectKeys(FORBID_CONTENTS), '|') + ')', 'i'), value)) {
          _removeAttribute(name, currentNode);
          continue;
        }

        /* Sanitize attribute content to be template-safe */
        if (SAFE_FOR_TEMPLATES) {
          value = stringReplace(value, MUSTACHE_EXPR$$1, ' ');
          value = stringReplace(value, ERB_EXPR$$1, ' ');
        }

        /* Is `value` valid for this attribute? */
        var lcTag = currentNode.nodeName.toLowerCase();
        if (!_isValidAttribute(lcTag, lcName, value)) {
          continue;
        }

        /* Handle invalid data-* attribute set by try-catching it */
        try {
          if (namespaceURI) {
            currentNode.setAttributeNS(namespaceURI, name, value);
          } else {
            /* Fallback to setAttribute() for browser-unrecognized namespaces e.g. "x-schema". */
            currentNode.setAttribute(name, value);
          }

          arrayPop(DOMPurify.removed);
        } catch (error) {}
      }

      /* Execute a hook if present */
      _executeHook('afterSanitizeAttributes', currentNode, null);
    };

    /**
     * _sanitizeShadowDOM
     *
     * @param  {DocumentFragment} fragment to iterate over recursively
     */
    var _sanitizeShadowDOM = function _sanitizeShadowDOM(fragment) {
      var shadowNode = void 0;
      var shadowIterator = _createIterator(fragment);

      /* Execute a hook if present */
      _executeHook('beforeSanitizeShadowDOM', fragment, null);

      while (shadowNode = shadowIterator.nextNode()) {
        /* Execute a hook if present */
        _executeHook('uponSanitizeShadowNode', shadowNode, null);

        /* Sanitize tags and elements */
        if (_sanitizeElements(shadowNode)) {
          continue;
        }

        /* Deep shadow DOM detected */
        if (shadowNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM(shadowNode.content);
        }

        /* Check attributes, sanitize if necessary */
        _sanitizeAttributes(shadowNode);
      }

      /* Execute a hook if present */
      _executeHook('afterSanitizeShadowDOM', fragment, null);
    };

    /**
     * Sanitize
     * Public method providing core sanitation functionality
     *
     * @param {String|Node} dirty string or DOM node
     * @param {Object} configuration object
     */
    // eslint-disable-next-line complexity
    DOMPurify.sanitize = function (dirty, cfg) {
      var body = void 0;
      var importedNode = void 0;
      var currentNode = void 0;
      var oldNode = void 0;
      var returnNode = void 0;
      /* Make sure we have a string to sanitize.
        DO NOT return early, as this will return the wrong type if
        the user has requested a DOM object rather than a string */
      if (!dirty) {
        dirty = '<!-->';
      }

      /* Stringify, in case dirty is an object */
      if (typeof dirty !== 'string' && !_isNode(dirty)) {
        // eslint-disable-next-line no-negated-condition
        if (typeof dirty.toString !== 'function') {
          throw typeErrorCreate('toString is not a function');
        } else {
          dirty = dirty.toString();
          if (typeof dirty !== 'string') {
            throw typeErrorCreate('dirty is not a string, aborting');
          }
        }
      }

      /* Check we can run. Otherwise fall back or ignore */
      if (!DOMPurify.isSupported) {
        if (_typeof(window.toStaticHTML) === 'object' || typeof window.toStaticHTML === 'function') {
          if (typeof dirty === 'string') {
            return window.toStaticHTML(dirty);
          }

          if (_isNode(dirty)) {
            return window.toStaticHTML(dirty.outerHTML);
          }
        }

        return dirty;
      }

      /* Assign config vars */
      if (!SET_CONFIG) {
        _parseConfig(cfg);
      }

      /* Clean up removed elements */
      DOMPurify.removed = [];

      /* Check if dirty is correctly typed for IN_PLACE */
      if (typeof dirty === 'string') {
        IN_PLACE = false;
      }

      if (IN_PLACE) ; else if (dirty instanceof Node) {
        /* If dirty is a DOM element, append to an empty document to avoid
           elements being stripped by the parser */
        body = _initDocument('<!-->');
        importedNode = body.ownerDocument.importNode(dirty, true);
        if (importedNode.nodeType === 1 && importedNode.nodeName === 'BODY') {
          /* Node is already a body, use as is */
          body = importedNode;
        } else if (importedNode.nodeName === 'HTML') {
          body = importedNode;
        } else {
          // eslint-disable-next-line unicorn/prefer-node-append
          body.appendChild(importedNode);
        }
      } else {
        /* Exit directly if we have nothing to do */
        if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && RETURN_TRUSTED_TYPE && dirty.indexOf('<') === -1) {
          return trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
        }

        /* Initialize the document to work on */
        body = _initDocument(dirty);

        /* Check we have a DOM node from the data */
        if (!body) {
          return RETURN_DOM ? null : emptyHTML;
        }
      }

      /* Remove first element node (ours) if FORCE_BODY is set */
      if (body && FORCE_BODY) {
        _forceRemove(body.firstChild);
      }

      /* Get node iterator */
      var nodeIterator = _createIterator(IN_PLACE ? dirty : body);

      /* Now start iterating over the created document */
      while (currentNode = nodeIterator.nextNode()) {
        /* Fix IE's strange behavior with manipulated textNodes #89 */
        if (currentNode.nodeType === 3 && currentNode === oldNode) {
          continue;
        }

        /* Sanitize tags and elements */
        if (_sanitizeElements(currentNode)) {
          continue;
        }

        /* Shadow DOM detected, sanitize it */
        if (currentNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM(currentNode.content);
        }

        /* Check attributes, sanitize if necessary */
        _sanitizeAttributes(currentNode);

        oldNode = currentNode;
      }

      oldNode = null;

      /* If we sanitized `dirty` in-place, return it. */
      if (IN_PLACE) {
        return dirty;
      }

      /* Return sanitized string or DOM */
      if (RETURN_DOM) {
        if (RETURN_DOM_FRAGMENT) {
          returnNode = createDocumentFragment.call(body.ownerDocument);

          while (body.firstChild) {
            // eslint-disable-next-line unicorn/prefer-node-append
            returnNode.appendChild(body.firstChild);
          }
        } else {
          returnNode = body;
        }

        if (RETURN_DOM_IMPORT) {
          /* AdoptNode() is not used because internal state is not reset
                 (e.g. the past names map of a HTMLFormElement), this is safe
                 in theory but we would rather not risk another attack vector.
                 The state that is cloned by importNode() is explicitly defined
                 by the specs. */
          returnNode = importNode.call(originalDocument, returnNode, true);
        }

        return returnNode;
      }

      var serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;

      /* Sanitize final string template-safe */
      if (SAFE_FOR_TEMPLATES) {
        serializedHTML = stringReplace(serializedHTML, MUSTACHE_EXPR$$1, ' ');
        serializedHTML = stringReplace(serializedHTML, ERB_EXPR$$1, ' ');
      }

      return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
    };

    /**
     * Public method to set the configuration once
     * setConfig
     *
     * @param {Object} cfg configuration object
     */
    DOMPurify.setConfig = function (cfg) {
      _parseConfig(cfg);
      SET_CONFIG = true;
    };

    /**
     * Public method to remove the configuration
     * clearConfig
     *
     */
    DOMPurify.clearConfig = function () {
      CONFIG = null;
      SET_CONFIG = false;
    };

    /**
     * Public method to check if an attribute value is valid.
     * Uses last set config, if any. Otherwise, uses config defaults.
     * isValidAttribute
     *
     * @param  {string} tag Tag name of containing element.
     * @param  {string} attr Attribute name.
     * @param  {string} value Attribute value.
     * @return {Boolean} Returns true if `value` is valid. Otherwise, returns false.
     */
    DOMPurify.isValidAttribute = function (tag, attr, value) {
      /* Initialize shared config vars if necessary. */
      if (!CONFIG) {
        _parseConfig({});
      }

      var lcTag = stringToLowerCase(tag);
      var lcName = stringToLowerCase(attr);
      return _isValidAttribute(lcTag, lcName, value);
    };

    /**
     * AddHook
     * Public method to add DOMPurify hooks
     *
     * @param {String} entryPoint entry point for the hook to add
     * @param {Function} hookFunction function to execute
     */
    DOMPurify.addHook = function (entryPoint, hookFunction) {
      if (typeof hookFunction !== 'function') {
        return;
      }

      hooks[entryPoint] = hooks[entryPoint] || [];
      arrayPush(hooks[entryPoint], hookFunction);
    };

    /**
     * RemoveHook
     * Public method to remove a DOMPurify hook at a given entryPoint
     * (pops it from the stack of hooks if more are present)
     *
     * @param {String} entryPoint entry point for the hook to remove
     */
    DOMPurify.removeHook = function (entryPoint) {
      if (hooks[entryPoint]) {
        arrayPop(hooks[entryPoint]);
      }
    };

    /**
     * RemoveHooks
     * Public method to remove all DOMPurify hooks at a given entryPoint
     *
     * @param  {String} entryPoint entry point for the hooks to remove
     */
    DOMPurify.removeHooks = function (entryPoint) {
      if (hooks[entryPoint]) {
        hooks[entryPoint] = [];
      }
    };

    /**
     * RemoveAllHooks
     * Public method to remove all DOMPurify hooks
     *
     */
    DOMPurify.removeAllHooks = function () {
      hooks = {};
    };

    return DOMPurify;
  }

  var purify = createDOMPurify();

  var barEl;
  var timeId;

  /**
   * Init progress component
   */
  function init() {
    var div = create('div');

    div.classList.add('progress');
    appendTo(body, div);
    barEl = div;
  }

  /**
   * Render progress bar
   */
  function progressbar(ref) {
    var loaded = ref.loaded;
    var total = ref.total;
    var step = ref.step;

    var num;

    !barEl && init();

    if (step) {
      num = parseInt(barEl.style.width || 0, 10) + step;
      num = num > 80 ? 80 : num;
    } else {
      num = Math.floor((loaded / total) * 100);
    }

    barEl.style.opacity = 1;
    barEl.style.width = num >= 95 ? '100%' : num + '%';

    if (num >= 95) {
      clearTimeout(timeId);
      // eslint-disable-next-line no-unused-vars
      timeId = setTimeout(function (_) {
        barEl.style.opacity = 0;
        barEl.style.width = '0%';
      }, 200);
    }
  }

  /* eslint-disable no-unused-vars */

  var cache = {};

  /**
   * Ajax GET implmentation
   * @param {string} url Resource URL
   * @param {boolean} [hasBar=false] Has progress bar
   * @param {String[]} headers Array of headers
   * @return {Promise} Promise response
   */
  function get(url, hasBar, headers) {
    if ( hasBar === void 0 ) hasBar = false;
    if ( headers === void 0 ) headers = {};

    var xhr = new XMLHttpRequest();
    var on = function() {
      xhr.addEventListener.apply(xhr, arguments);
    };

    var cached = cache[url];

    if (cached) {
      return { then: function (cb) { return cb(cached.content, cached.opt); }, abort: noop };
    }

    xhr.open('GET', url);
    for (var i in headers) {
      if (hasOwn.call(headers, i)) {
        xhr.setRequestHeader(i, headers[i]);
      }
    }

    xhr.send();

    return {
      then: function(success, error) {
        if ( error === void 0 ) error = noop;

        if (hasBar) {
          var id = setInterval(
            function (_) { return progressbar({
                step: Math.floor(Math.random() * 5 + 1),
              }); },
            500
          );

          on('progress', progressbar);
          on('loadend', function (evt) {
            progressbar(evt);
            clearInterval(id);
          });
        }

        on('error', error);
        on('load', function (ref) {
          var target = ref.target;

          if (target.status >= 400) {
            error(target);
          } else {
            var result = (cache[url] = {
              content: target.response,
              opt: {
                updatedAt: xhr.getResponseHeader('last-modified'),
              },
            });

            success(result.content, result.opt);
          }
        });
      },
      abort: function (_) { return xhr.readyState !== 4 && xhr.abort(); },
    };
  }

  function replaceVar(block, color) {
    block.innerHTML = block.innerHTML.replace(
      /var\(\s*--theme-color.*?\)/g,
      color
    );
  }

  function cssVars(color) {
    // Variable support
    if (window.CSS && window.CSS.supports && window.CSS.supports('(--v:red)')) {
      return;
    }

    var styleBlocks = findAll('style:not(.inserted),link');
    [].forEach.call(styleBlocks, function (block) {
      if (block.nodeName === 'STYLE') {
        replaceVar(block, color);
      } else if (block.nodeName === 'LINK') {
        var href = block.getAttribute('href');

        if (!/\.css$/.test(href)) {
          return;
        }

        get(href).then(function (res) {
          var style = create('style', res);

          head.appendChild(style);
          replaceVar(style, color);
        });
      }
    });
  }

  function initLifecycle(vm) {
    var hooks = [
      'init',
      'mounted',
      'beforeEach',
      'afterEach',
      'doneEach',
      'ready' ];

    vm._hooks = {};
    vm._lifecycle = {};
    hooks.forEach(function (hook) {
      var arr = (vm._hooks[hook] = []);
      vm._lifecycle[hook] = function (fn) { return arr.push(fn); };
    });
  }

  function callHook(vm, hook, data, next) {
    if ( next === void 0 ) next = noop;

    var queue = vm._hooks[hook];

    var step = function(index) {
      var hook = queue[index];
      if (index >= queue.length) {
        next(data);
      } else if (typeof hook === 'function') {
        if (hook.length === 2) {
          hook(data, function (result) {
            data = result;
            step(index + 1);
          });
        } else {
          var result = hook(data);
          data = result === undefined ? data : result;
          step(index + 1);
        }
      } else {
        step(index + 1);
      }
    };

    step(0);
  }

  /* eslint-disable no-unused-vars */

  var title = $.title;
  /**
   * Toggle button
   * @param {Element} el Button to be toggled
   * @void
   */
  function btn(el) {
    var toggle = function (_) { return body.classList.toggle('close'); };

    el = getNode(el);
    if (el === null || el === undefined) {
      return;
    }

    on(el, 'click', function (e) {
      e.stopPropagation();
      toggle();
    });

    isMobile &&
      on(
        body,
        'click',
        function (_) { return body.classList.contains('close') && toggle(); }
      );
  }

  function collapse(el) {
    el = getNode(el);
    if (el === null || el === undefined) {
      return;
    }

    on(el, 'click', function (ref) {
      var target = ref.target;

      if (
        target.nodeName === 'A' &&
        target.nextSibling &&
        target.nextSibling.classList &&
        target.nextSibling.classList.contains('app-sub-sidebar')
      ) {
        toggleClass(target.parentNode, 'collapse');
      }
    });
  }

  function sticky() {
    var cover = getNode('section.cover');
    if (!cover) {
      return;
    }

    var coverHeight = cover.getBoundingClientRect().height;

    if (window.pageYOffset >= coverHeight || cover.classList.contains('hidden')) {
      toggleClass(body, 'add', 'sticky');
    } else {
      toggleClass(body, 'remove', 'sticky');
    }
  }

  /**
   * Get and active link
   * @param  {Object} router Router
   * @param  {String|Element} el Target element
   * @param  {Boolean} isParent Active parent
   * @param  {Boolean} autoTitle Automatically set title
   * @return {Element} Active element
   */
  function getAndActive(router, el, isParent, autoTitle) {
    el = getNode(el);
    var links = [];
    if (el !== null && el !== undefined) {
      links = findAll(el, 'a');
    }

    var hash = decodeURI(router.toURL(router.getCurrentPath()));
    var target;

    links
      .sort(function (a, b) { return b.href.length - a.href.length; })
      .forEach(function (a) {
        var href = a.getAttribute('href');
        var node = isParent ? a.parentNode : a;

        if (hash.indexOf(href) === 0 && !target) {
          target = a;
          toggleClass(node, 'add', 'active');
        } else {
          toggleClass(node, 'remove', 'active');
        }
      });

    if (autoTitle) {
      $.title = target
        ? target.title || ((target.innerText) + " - " + title)
        : title;
    }

    return target;
  }

  var decode = decodeURIComponent;
  var encode = encodeURIComponent;

  function parseQuery(query) {
    var res = {};

    query = query.trim().replace(/^(\?|#|&)/, '');

    if (!query) {
      return res;
    }

    // Simple parse
    query.split('&').forEach(function(param) {
      var parts = param.replace(/\+/g, ' ').split('=');

      res[parts[0]] = parts[1] && decode(parts[1]);
    });

    return res;
  }

  function stringifyQuery(obj, ignores) {
    if ( ignores === void 0 ) ignores = [];

    var qs = [];

    for (var key in obj) {
      if (ignores.indexOf(key) > -1) {
        continue;
      }

      qs.push(
        obj[key]
          ? ((encode(key)) + "=" + (encode(obj[key]))).toLowerCase()
          : encode(key)
      );
    }

    return qs.length ? ("?" + (qs.join('&'))) : '';
  }

  var isAbsolutePath = cached(function (path) {
    return /(:|(\/{2}))/g.test(path);
  });

  var removeParams = cached(function (path) {
    return path.split(/[?#]/)[0];
  });

  var getParentPath = cached(function (path) {
    if (/\/$/g.test(path)) {
      return path;
    }

    var matchingParts = path.match(/(\S*\/)[^/]+$/);
    return matchingParts ? matchingParts[1] : '';
  });

  var cleanPath = cached(function (path) {
    return path.replace(/^\/+/, '/').replace(/([^:])\/{2,}/g, '$1/');
  });

  var resolvePath = cached(function (path) {
    var segments = path.replace(/^\//, '').split('/');
    var resolved = [];
    for (var i = 0, len = segments.length; i < len; i++) {
      var segment = segments[i];
      if (segment === '..') {
        resolved.pop();
      } else if (segment !== '.') {
        resolved.push(segment);
      }
    }

    return '/' + resolved.join('/');
  });

  function getPath() {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    return cleanPath(args.join('/'));
  }

  var replaceSlug = cached(function (path) {
    return path.replace('#', '?id=');
  });

  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) { descriptor.writable = true; } Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) { defineProperties(Constructor.prototype, protoProps); } if (staticProps) { defineProperties(Constructor, staticProps); } return Constructor; }; }();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var SingleTweener = function () {
    function SingleTweener() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, SingleTweener);

      this.start = opts.start;
      this.end = opts.end;
      this.decimal = opts.decimal;
    }

    _createClass(SingleTweener, [{
      key: "getIntermediateValue",
      value: function getIntermediateValue(tick) {
        if (this.decimal) {
          return tick;
        } else {
          return Math.round(tick);
        }
      }
    }, {
      key: "getFinalValue",
      value: function getFinalValue() {
        return this.end;
      }
    }]);

    return SingleTweener;
  }();

  var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) { descriptor.writable = true; } Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) { defineProperties(Constructor.prototype, protoProps); } if (staticProps) { defineProperties(Constructor, staticProps); } return Constructor; }; }();

  function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var Tweezer = function () {
    function Tweezer() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck$1(this, Tweezer);

      this.duration = opts.duration || 1000;
      this.ease = opts.easing || this._defaultEase;
      this.tweener = opts.tweener || new SingleTweener(opts);
      this.start = this.tweener.start;
      this.end = this.tweener.end;

      this.frame = null;
      this.next = null;
      this.isRunning = false;
      this.events = {};
      this.direction = this.start < this.end ? 'up' : 'down';
    }

    _createClass$1(Tweezer, [{
      key: 'begin',
      value: function begin() {
        if (!this.isRunning && this.next !== this.end) {
          this.frame = window.requestAnimationFrame(this._tick.bind(this));
        }
        return this;
      }
    }, {
      key: 'stop',
      value: function stop() {
        window.cancelAnimationFrame(this.frame);
        this.isRunning = false;
        this.frame = null;
        this.timeStart = null;
        this.next = null;
        return this;
      }
    }, {
      key: 'on',
      value: function on(name, handler) {
        this.events[name] = this.events[name] || [];
        this.events[name].push(handler);
        return this;
      }
    }, {
      key: '_emit',
      value: function _emit(name, val) {
        var _this = this;

        var e = this.events[name];
        e && e.forEach(function (handler) {
          return handler.call(_this, val);
        });
      }
    }, {
      key: '_tick',
      value: function _tick(currentTime) {
        this.isRunning = true;

        var lastTick = this.next || this.start;

        if (!this.timeStart) { this.timeStart = currentTime; }
        this.timeElapsed = currentTime - this.timeStart;
        this.next = this.ease(this.timeElapsed, this.start, this.end - this.start, this.duration);

        if (this._shouldTick(lastTick)) {
          this._emit('tick', this.tweener.getIntermediateValue(this.next));
          this.frame = window.requestAnimationFrame(this._tick.bind(this));
        } else {
          this._emit('tick', this.tweener.getFinalValue());
          this._emit('done', null);
        }
      }
    }, {
      key: '_shouldTick',
      value: function _shouldTick(lastTick) {
        return {
          up: this.next < this.end && lastTick <= this.next,
          down: this.next > this.end && lastTick >= this.next
        }[this.direction];
      }
    }, {
      key: '_defaultEase',
      value: function _defaultEase(t, b, c, d) {
        if ((t /= d / 2) < 1) { return c / 2 * t * t + b; }
        return -c / 2 * (--t * (t - 2) - 1) + b;
      }
    }]);

    return Tweezer;
  }();

  var nav = {};
  var hoverOver = false;
  var scroller = null;
  var enableScrollEvent = true;
  var coverHeight = 0;

  function scrollTo(el, offset) {
    if ( offset === void 0 ) offset = 0;

    if (scroller) {
      scroller.stop();
    }

    enableScrollEvent = false;
    scroller = new Tweezer({
      start: window.pageYOffset,
      end: el.getBoundingClientRect().top + window.pageYOffset - offset,
      duration: 500,
    })
      .on('tick', function (v) { return window.scrollTo(0, v); })
      .on('done', function () {
        enableScrollEvent = true;
        scroller = null;
      })
      .begin();
  }

  function highlight(path) {
    if (!enableScrollEvent) {
      return;
    }

    var sidebar = getNode('.sidebar');
    var anchors = findAll('.anchor');
    var wrap = find(sidebar, '.sidebar-nav');
    var active = find(sidebar, 'li.active');
    var doc = document.documentElement;
    var top = ((doc && doc.scrollTop) || document.body.scrollTop) - coverHeight;
    var last;

    for (var i = 0, len = anchors.length; i < len; i += 1) {
      var node = anchors[i];

      if (node.offsetTop > top) {
        if (!last) {
          last = node;
        }

        break;
      } else {
        last = node;
      }
    }

    if (!last) {
      return;
    }

    var li = nav[getNavKey(path, last.getAttribute('data-id'))];

    if (!li || li === active) {
      return;
    }

    active && active.classList.remove('active');
    li.classList.add('active');
    active = li;

    // Scroll into view
    // https://github.com/vuejs/vuejs.org/blob/master/themes/vue/source/js/common.js#L282-L297
    if (!hoverOver && body.classList.contains('sticky')) {
      var height = sidebar.clientHeight;
      var curOffset = 0;
      var cur = active.offsetTop + active.clientHeight + 40;
      var isInView =
        active.offsetTop >= wrap.scrollTop && cur <= wrap.scrollTop + height;
      var notThan = cur - curOffset < height;
      var top$1 = isInView ? wrap.scrollTop : notThan ? curOffset : cur - height;

      sidebar.scrollTop = top$1;
    }
  }

  function getNavKey(path, id) {
    return ((decodeURIComponent(path)) + "?id=" + (decodeURIComponent(id)));
  }

  function scrollActiveSidebar(router) {
    var cover = find('.cover.show');
    coverHeight = cover ? cover.offsetHeight : 0;

    var sidebar = getNode('.sidebar');
    var lis = [];
    if (sidebar !== null && sidebar !== undefined) {
      lis = findAll(sidebar, 'li');
    }

    for (var i = 0, len = lis.length; i < len; i += 1) {
      var li = lis[i];
      var a = li.querySelector('a');
      if (!a) {
        continue;
      }

      var href = a.getAttribute('href');

      if (href !== '/') {
        var ref = router.parse(href);
        var id = ref.query.id;
        var path$1 = ref.path;
        if (id) {
          href = getNavKey(path$1, id);
        }
      }

      if (href) {
        nav[decodeURIComponent(href)] = li;
      }
    }

    if (isMobile) {
      return;
    }

    var path = removeParams(router.getCurrentPath());
    off('scroll', function () { return highlight(path); });
    on('scroll', function () { return highlight(path); });
    on(sidebar, 'mouseover', function () {
      hoverOver = true;
    });
    on(sidebar, 'mouseleave', function () {
      hoverOver = false;
    });
  }

  function scrollIntoView(path, id) {
    if (!id) {
      return;
    }
    var topMargin = config().topMargin;
    var section = find('#' + id);
    section && scrollTo(section, topMargin);

    var li = nav[getNavKey(path, id)];
    var sidebar = getNode('.sidebar');
    var active = find(sidebar, 'li.active');
    active && active.classList.remove('active');
    li && li.classList.add('active');
  }

  var scrollEl = $.scrollingElement || $.documentElement;

  function scroll2Top(offset) {
    if ( offset === void 0 ) offset = 0;

    scrollEl.scrollTop = offset === true ? 0 : Number(offset);
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var marked = createCommonjsModule(function (module, exports) {
  (function(root) {

  /**
   * Block-Level Grammar
   */

  var block = {
    newline: /^\n+/,
    code: /^( {4}[^\n]+\n*)+/,
    fences: /^ {0,3}(`{3,}|~{3,})([^`~\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
    hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
    heading: /^ {0,3}(#{1,6}) +([^\n]*?)(?: +#+)? *(?:\n+|$)/,
    blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
    list: /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
    html: '^ {0,3}(?:' // optional indentation
      + '<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
      + '|comment[^\\n]*(\\n+|$)' // (2)
      + '|<\\?[\\s\\S]*?\\?>\\n*' // (3)
      + '|<![A-Z][\\s\\S]*?>\\n*' // (4)
      + '|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*' // (5)
      + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)' // (6)
      + '|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) open tag
      + '|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) closing tag
      + ')',
    def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
    nptable: noop,
    table: noop,
    lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
    // regex template, placeholders will be replaced according to different paragraph
    // interruption rules of commonmark and the original markdown spec:
    _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html)[^\n]+)*)/,
    text: /^[^\n]+/
  };

  block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
  block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
  block.def = edit(block.def)
    .replace('label', block._label)
    .replace('title', block._title)
    .getRegex();

  block.bullet = /(?:[*+-]|\d{1,9}\.)/;
  block.item = /^( *)(bull) ?[^\n]*(?:\n(?!\1bull ?)[^\n]*)*/;
  block.item = edit(block.item, 'gm')
    .replace(/bull/g, block.bullet)
    .getRegex();

  block.list = edit(block.list)
    .replace(/bull/g, block.bullet)
    .replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))')
    .replace('def', '\\n+(?=' + block.def.source + ')')
    .getRegex();

  block._tag = 'address|article|aside|base|basefont|blockquote|body|caption'
    + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption'
    + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe'
    + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option'
    + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr'
    + '|track|ul';
  block._comment = /<!--(?!-?>)[\s\S]*?-->/;
  block.html = edit(block.html, 'i')
    .replace('comment', block._comment)
    .replace('tag', block._tag)
    .replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)
    .getRegex();

  block.paragraph = edit(block._paragraph)
    .replace('hr', block.hr)
    .replace('heading', ' {0,3}#{1,6} +')
    .replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
    .replace('blockquote', ' {0,3}>')
    .replace('fences', ' {0,3}(?:`{3,}|~{3,})[^`\\n]*\\n')
    .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
    .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)')
    .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
    .getRegex();

  block.blockquote = edit(block.blockquote)
    .replace('paragraph', block.paragraph)
    .getRegex();

  /**
   * Normal Block Grammar
   */

  block.normal = merge({}, block);

  /**
   * GFM Block Grammar
   */

  block.gfm = merge({}, block.normal, {
    nptable: /^ *([^|\n ].*\|.*)\n *([-:]+ *\|[-| :]*)(?:\n((?:.*[^>\n ].*(?:\n|$))*)\n*|$)/,
    table: /^ *\|(.+)\n *\|?( *[-:]+[-| :]*)(?:\n((?: *[^>\n ].*(?:\n|$))*)\n*|$)/
  });

  /**
   * Pedantic grammar (original John Gruber's loose markdown specification)
   */

  block.pedantic = merge({}, block.normal, {
    html: edit(
      '^ *(?:comment *(?:\\n|\\s*$)'
      + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
      + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))')
      .replace('comment', block._comment)
      .replace(/tag/g, '(?!(?:'
        + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub'
        + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)'
        + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b')
      .getRegex(),
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
    heading: /^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/,
    fences: noop, // fences not supported
    paragraph: edit(block.normal._paragraph)
      .replace('hr', block.hr)
      .replace('heading', ' *#{1,6} *[^\n]')
      .replace('lheading', block.lheading)
      .replace('blockquote', ' {0,3}>')
      .replace('|fences', '')
      .replace('|list', '')
      .replace('|html', '')
      .getRegex()
  });

  /**
   * Block Lexer
   */

  function Lexer(options) {
    this.tokens = [];
    this.tokens.links = Object.create(null);
    this.options = options || marked.defaults;
    this.rules = block.normal;

    if (this.options.pedantic) {
      this.rules = block.pedantic;
    } else if (this.options.gfm) {
      this.rules = block.gfm;
    }
  }

  /**
   * Expose Block Rules
   */

  Lexer.rules = block;

  /**
   * Static Lex Method
   */

  Lexer.lex = function(src, options) {
    var lexer = new Lexer(options);
    return lexer.lex(src);
  };

  /**
   * Preprocessing
   */

  Lexer.prototype.lex = function(src) {
    src = src
      .replace(/\r\n|\r/g, '\n')
      .replace(/\t/g, '    ')
      .replace(/\u00a0/g, ' ')
      .replace(/\u2424/g, '\n');

    return this.token(src, true);
  };

  /**
   * Lexing
   */

  Lexer.prototype.token = function(src, top) {
    src = src.replace(/^ +$/gm, '');
    var next,
        loose,
        cap,
        bull,
        b,
        item,
        listStart,
        listItems,
        t,
        space,
        i,
        tag,
        l,
        isordered,
        istask,
        ischecked;

    while (src) {
      // newline
      if (cap = this.rules.newline.exec(src)) {
        src = src.substring(cap[0].length);
        if (cap[0].length > 1) {
          this.tokens.push({
            type: 'space'
          });
        }
      }

      // code
      if (cap = this.rules.code.exec(src)) {
        var lastToken = this.tokens[this.tokens.length - 1];
        src = src.substring(cap[0].length);
        // An indented code block cannot interrupt a paragraph.
        if (lastToken && lastToken.type === 'paragraph') {
          lastToken.text += '\n' + cap[0].trimRight();
        } else {
          cap = cap[0].replace(/^ {4}/gm, '');
          this.tokens.push({
            type: 'code',
            codeBlockStyle: 'indented',
            text: !this.options.pedantic
              ? rtrim(cap, '\n')
              : cap
          });
        }
        continue;
      }

      // fences
      if (cap = this.rules.fences.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'code',
          lang: cap[2] ? cap[2].trim() : cap[2],
          text: cap[3] || ''
        });
        continue;
      }

      // heading
      if (cap = this.rules.heading.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'heading',
          depth: cap[1].length,
          text: cap[2]
        });
        continue;
      }

      // table no leading pipe (gfm)
      if (cap = this.rules.nptable.exec(src)) {
        item = {
          type: 'table',
          header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
          align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
          cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
        };

        if (item.header.length === item.align.length) {
          src = src.substring(cap[0].length);

          for (i = 0; i < item.align.length; i++) {
            if (/^ *-+: *$/.test(item.align[i])) {
              item.align[i] = 'right';
            } else if (/^ *:-+: *$/.test(item.align[i])) {
              item.align[i] = 'center';
            } else if (/^ *:-+ *$/.test(item.align[i])) {
              item.align[i] = 'left';
            } else {
              item.align[i] = null;
            }
          }

          for (i = 0; i < item.cells.length; i++) {
            item.cells[i] = splitCells(item.cells[i], item.header.length);
          }

          this.tokens.push(item);

          continue;
        }
      }

      // hr
      if (cap = this.rules.hr.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'hr'
        });
        continue;
      }

      // blockquote
      if (cap = this.rules.blockquote.exec(src)) {
        src = src.substring(cap[0].length);

        this.tokens.push({
          type: 'blockquote_start'
        });

        cap = cap[0].replace(/^ *> ?/gm, '');

        // Pass `top` to keep the current
        // "toplevel" state. This is exactly
        // how markdown.pl works.
        this.token(cap, top);

        this.tokens.push({
          type: 'blockquote_end'
        });

        continue;
      }

      // list
      if (cap = this.rules.list.exec(src)) {
        src = src.substring(cap[0].length);
        bull = cap[2];
        isordered = bull.length > 1;

        listStart = {
          type: 'list_start',
          ordered: isordered,
          start: isordered ? +bull : '',
          loose: false
        };

        this.tokens.push(listStart);

        // Get each top-level item.
        cap = cap[0].match(this.rules.item);

        listItems = [];
        next = false;
        l = cap.length;
        i = 0;

        for (; i < l; i++) {
          item = cap[i];

          // Remove the list item's bullet
          // so it is seen as the next token.
          space = item.length;
          item = item.replace(/^ *([*+-]|\d+\.) */, '');

          // Outdent whatever the
          // list item contains. Hacky.
          if (~item.indexOf('\n ')) {
            space -= item.length;
            item = !this.options.pedantic
              ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
              : item.replace(/^ {1,4}/gm, '');
          }

          // Determine whether the next list item belongs here.
          // Backpedal if it does not belong in this list.
          if (i !== l - 1) {
            b = block.bullet.exec(cap[i + 1])[0];
            if (bull.length > 1 ? b.length === 1
              : (b.length > 1 || (this.options.smartLists && b !== bull))) {
              src = cap.slice(i + 1).join('\n') + src;
              i = l - 1;
            }
          }

          // Determine whether item is loose or not.
          // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
          // for discount behavior.
          loose = next || /\n\n(?!\s*$)/.test(item);
          if (i !== l - 1) {
            next = item.charAt(item.length - 1) === '\n';
            if (!loose) { loose = next; }
          }

          if (loose) {
            listStart.loose = true;
          }

          // Check for task list items
          istask = /^\[[ xX]\] /.test(item);
          ischecked = undefined;
          if (istask) {
            ischecked = item[1] !== ' ';
            item = item.replace(/^\[[ xX]\] +/, '');
          }

          t = {
            type: 'list_item_start',
            task: istask,
            checked: ischecked,
            loose: loose
          };

          listItems.push(t);
          this.tokens.push(t);

          // Recurse.
          this.token(item, false);

          this.tokens.push({
            type: 'list_item_end'
          });
        }

        if (listStart.loose) {
          l = listItems.length;
          i = 0;
          for (; i < l; i++) {
            listItems[i].loose = true;
          }
        }

        this.tokens.push({
          type: 'list_end'
        });

        continue;
      }

      // html
      if (cap = this.rules.html.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: this.options.sanitize
            ? 'paragraph'
            : 'html',
          pre: !this.options.sanitizer
            && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
          text: this.options.sanitize ? (this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0])) : cap[0]
        });
        continue;
      }

      // def
      if (top && (cap = this.rules.def.exec(src))) {
        src = src.substring(cap[0].length);
        if (cap[3]) { cap[3] = cap[3].substring(1, cap[3].length - 1); }
        tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
        if (!this.tokens.links[tag]) {
          this.tokens.links[tag] = {
            href: cap[2],
            title: cap[3]
          };
        }
        continue;
      }

      // table (gfm)
      if (cap = this.rules.table.exec(src)) {
        item = {
          type: 'table',
          header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
          align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
          cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
        };

        if (item.header.length === item.align.length) {
          src = src.substring(cap[0].length);

          for (i = 0; i < item.align.length; i++) {
            if (/^ *-+: *$/.test(item.align[i])) {
              item.align[i] = 'right';
            } else if (/^ *:-+: *$/.test(item.align[i])) {
              item.align[i] = 'center';
            } else if (/^ *:-+ *$/.test(item.align[i])) {
              item.align[i] = 'left';
            } else {
              item.align[i] = null;
            }
          }

          for (i = 0; i < item.cells.length; i++) {
            item.cells[i] = splitCells(
              item.cells[i].replace(/^ *\| *| *\| *$/g, ''),
              item.header.length);
          }

          this.tokens.push(item);

          continue;
        }
      }

      // lheading
      if (cap = this.rules.lheading.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'heading',
          depth: cap[2].charAt(0) === '=' ? 1 : 2,
          text: cap[1]
        });
        continue;
      }

      // top-level paragraph
      if (top && (cap = this.rules.paragraph.exec(src))) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'paragraph',
          text: cap[1].charAt(cap[1].length - 1) === '\n'
            ? cap[1].slice(0, -1)
            : cap[1]
        });
        continue;
      }

      // text
      if (cap = this.rules.text.exec(src)) {
        // Top-level should never reach here.
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'text',
          text: cap[0]
        });
        continue;
      }

      if (src) {
        throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
      }
    }

    return this.tokens;
  };

  /**
   * Inline-Level Grammar
   */

  var inline = {
    escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
    autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
    url: noop,
    tag: '^comment'
      + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
      + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
      + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
      + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
      + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>', // CDATA section
    link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
    reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
    nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
    strong: /^__([^\s_])__(?!_)|^\*\*([^\s*])\*\*(?!\*)|^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)/,
    em: /^_([^\s_])_(?!_)|^\*([^\s*<\[])\*(?!\*)|^_([^\s<][\s\S]*?[^\s_])_(?!_|[^\spunctuation])|^_([^\s_<][\s\S]*?[^\s])_(?!_|[^\spunctuation])|^\*([^\s<"][\s\S]*?[^\s\*])\*(?!\*|[^\spunctuation])|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)/,
    code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
    br: /^( {2,}|\\)\n(?!\s*$)/,
    del: noop,
    text: /^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*]|\b_|$)|[^ ](?= {2,}\n))|(?= {2,}\n))/
  };

  // list of punctuation marks from common mark spec
  // without ` and ] to workaround Rule 17 (inline code blocks/links)
  inline._punctuation = '!"#$%&\'()*+,\\-./:;<=>?@\\[^_{|}~';
  inline.em = edit(inline.em).replace(/punctuation/g, inline._punctuation).getRegex();

  inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;

  inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
  inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
  inline.autolink = edit(inline.autolink)
    .replace('scheme', inline._scheme)
    .replace('email', inline._email)
    .getRegex();

  inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;

  inline.tag = edit(inline.tag)
    .replace('comment', block._comment)
    .replace('attribute', inline._attribute)
    .getRegex();

  inline._label = /(?:\[[^\[\]]*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
  inline._href = /<(?:\\[<>]?|[^\s<>\\])*>|[^\s\x00-\x1f]*/;
  inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;

  inline.link = edit(inline.link)
    .replace('label', inline._label)
    .replace('href', inline._href)
    .replace('title', inline._title)
    .getRegex();

  inline.reflink = edit(inline.reflink)
    .replace('label', inline._label)
    .getRegex();

  /**
   * Normal Inline Grammar
   */

  inline.normal = merge({}, inline);

  /**
   * Pedantic Inline Grammar
   */

  inline.pedantic = merge({}, inline.normal, {
    strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
    em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,
    link: edit(/^!?\[(label)\]\((.*?)\)/)
      .replace('label', inline._label)
      .getRegex(),
    reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
      .replace('label', inline._label)
      .getRegex()
  });

  /**
   * GFM Inline Grammar
   */

  inline.gfm = merge({}, inline.normal, {
    escape: edit(inline.escape).replace('])', '~|])').getRegex(),
    _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
    url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
    _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
    del: /^~+(?=\S)([\s\S]*?\S)~+/,
    text: /^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*~]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))|(?= {2,}\n|[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))/
  });

  inline.gfm.url = edit(inline.gfm.url, 'i')
    .replace('email', inline.gfm._extended_email)
    .getRegex();
  /**
   * GFM + Line Breaks Inline Grammar
   */

  inline.breaks = merge({}, inline.gfm, {
    br: edit(inline.br).replace('{2,}', '*').getRegex(),
    text: edit(inline.gfm.text)
      .replace('\\b_', '\\b_| {2,}\\n')
      .replace(/\{2,\}/g, '*')
      .getRegex()
  });

  /**
   * Inline Lexer & Compiler
   */

  function InlineLexer(links, options) {
    this.options = options || marked.defaults;
    this.links = links;
    this.rules = inline.normal;
    this.renderer = this.options.renderer || new Renderer();
    this.renderer.options = this.options;

    if (!this.links) {
      throw new Error('Tokens array requires a `links` property.');
    }

    if (this.options.pedantic) {
      this.rules = inline.pedantic;
    } else if (this.options.gfm) {
      if (this.options.breaks) {
        this.rules = inline.breaks;
      } else {
        this.rules = inline.gfm;
      }
    }
  }

  /**
   * Expose Inline Rules
   */

  InlineLexer.rules = inline;

  /**
   * Static Lexing/Compiling Method
   */

  InlineLexer.output = function(src, links, options) {
    var inline = new InlineLexer(links, options);
    return inline.output(src);
  };

  /**
   * Lexing/Compiling
   */

  InlineLexer.prototype.output = function(src) {
    var out = '',
        link,
        text,
        href,
        title,
        cap,
        prevCapZero;

    while (src) {
      // escape
      if (cap = this.rules.escape.exec(src)) {
        src = src.substring(cap[0].length);
        out += escape(cap[1]);
        continue;
      }

      // tag
      if (cap = this.rules.tag.exec(src)) {
        if (!this.inLink && /^<a /i.test(cap[0])) {
          this.inLink = true;
        } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
          this.inLink = false;
        }
        if (!this.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
          this.inRawBlock = true;
        } else if (this.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
          this.inRawBlock = false;
        }

        src = src.substring(cap[0].length);
        out += this.options.sanitize
          ? this.options.sanitizer
            ? this.options.sanitizer(cap[0])
            : escape(cap[0])
          : cap[0];
        continue;
      }

      // link
      if (cap = this.rules.link.exec(src)) {
        var lastParenIndex = findClosingBracket(cap[2], '()');
        if (lastParenIndex > -1) {
          var linkLen = 4 + cap[1].length + lastParenIndex;
          cap[2] = cap[2].substring(0, lastParenIndex);
          cap[0] = cap[0].substring(0, linkLen).trim();
          cap[3] = '';
        }
        src = src.substring(cap[0].length);
        this.inLink = true;
        href = cap[2];
        if (this.options.pedantic) {
          link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);

          if (link) {
            href = link[1];
            title = link[3];
          } else {
            title = '';
          }
        } else {
          title = cap[3] ? cap[3].slice(1, -1) : '';
        }
        href = href.trim().replace(/^<([\s\S]*)>$/, '$1');
        out += this.outputLink(cap, {
          href: InlineLexer.escapes(href),
          title: InlineLexer.escapes(title)
        });
        this.inLink = false;
        continue;
      }

      // reflink, nolink
      if ((cap = this.rules.reflink.exec(src))
          || (cap = this.rules.nolink.exec(src))) {
        src = src.substring(cap[0].length);
        link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
        link = this.links[link.toLowerCase()];
        if (!link || !link.href) {
          out += cap[0].charAt(0);
          src = cap[0].substring(1) + src;
          continue;
        }
        this.inLink = true;
        out += this.outputLink(cap, link);
        this.inLink = false;
        continue;
      }

      // strong
      if (cap = this.rules.strong.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.strong(this.output(cap[4] || cap[3] || cap[2] || cap[1]));
        continue;
      }

      // em
      if (cap = this.rules.em.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.em(this.output(cap[6] || cap[5] || cap[4] || cap[3] || cap[2] || cap[1]));
        continue;
      }

      // code
      if (cap = this.rules.code.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.codespan(escape(cap[2].trim(), true));
        continue;
      }

      // br
      if (cap = this.rules.br.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.br();
        continue;
      }

      // del (gfm)
      if (cap = this.rules.del.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.del(this.output(cap[1]));
        continue;
      }

      // autolink
      if (cap = this.rules.autolink.exec(src)) {
        src = src.substring(cap[0].length);
        if (cap[2] === '@') {
          text = escape(this.mangle(cap[1]));
          href = 'mailto:' + text;
        } else {
          text = escape(cap[1]);
          href = text;
        }
        out += this.renderer.link(href, null, text);
        continue;
      }

      // url (gfm)
      if (!this.inLink && (cap = this.rules.url.exec(src))) {
        if (cap[2] === '@') {
          text = escape(cap[0]);
          href = 'mailto:' + text;
        } else {
          // do extended autolink path validation
          do {
            prevCapZero = cap[0];
            cap[0] = this.rules._backpedal.exec(cap[0])[0];
          } while (prevCapZero !== cap[0]);
          text = escape(cap[0]);
          if (cap[1] === 'www.') {
            href = 'http://' + text;
          } else {
            href = text;
          }
        }
        src = src.substring(cap[0].length);
        out += this.renderer.link(href, null, text);
        continue;
      }

      // text
      if (cap = this.rules.text.exec(src)) {
        src = src.substring(cap[0].length);
        if (this.inRawBlock) {
          out += this.renderer.text(this.options.sanitize ? (this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0])) : cap[0]);
        } else {
          out += this.renderer.text(escape(this.smartypants(cap[0])));
        }
        continue;
      }

      if (src) {
        throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
      }
    }

    return out;
  };

  InlineLexer.escapes = function(text) {
    return text ? text.replace(InlineLexer.rules._escapes, '$1') : text;
  };

  /**
   * Compile Link
   */

  InlineLexer.prototype.outputLink = function(cap, link) {
    var href = link.href,
        title = link.title ? escape(link.title) : null;

    return cap[0].charAt(0) !== '!'
      ? this.renderer.link(href, title, this.output(cap[1]))
      : this.renderer.image(href, title, escape(cap[1]));
  };

  /**
   * Smartypants Transformations
   */

  InlineLexer.prototype.smartypants = function(text) {
    if (!this.options.smartypants) { return text; }
    return text
      // em-dashes
      .replace(/---/g, '\u2014')
      // en-dashes
      .replace(/--/g, '\u2013')
      // opening singles
      .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
      // closing singles & apostrophes
      .replace(/'/g, '\u2019')
      // opening doubles
      .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
      // closing doubles
      .replace(/"/g, '\u201d')
      // ellipses
      .replace(/\.{3}/g, '\u2026');
  };

  /**
   * Mangle Links
   */

  InlineLexer.prototype.mangle = function(text) {
    if (!this.options.mangle) { return text; }
    var out = '',
        l = text.length,
        i = 0,
        ch;

    for (; i < l; i++) {
      ch = text.charCodeAt(i);
      if (Math.random() > 0.5) {
        ch = 'x' + ch.toString(16);
      }
      out += '&#' + ch + ';';
    }

    return out;
  };

  /**
   * Renderer
   */

  function Renderer(options) {
    this.options = options || marked.defaults;
  }

  Renderer.prototype.code = function(code, infostring, escaped) {
    var lang = (infostring || '').match(/\S*/)[0];
    if (this.options.highlight) {
      var out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }

    if (!lang) {
      return '<pre><code>'
        + (escaped ? code : escape(code, true))
        + '</code></pre>';
    }

    return '<pre><code class="'
      + this.options.langPrefix
      + escape(lang, true)
      + '">'
      + (escaped ? code : escape(code, true))
      + '</code></pre>\n';
  };

  Renderer.prototype.blockquote = function(quote) {
    return '<blockquote>\n' + quote + '</blockquote>\n';
  };

  Renderer.prototype.html = function(html) {
    return html;
  };

  Renderer.prototype.heading = function(text, level, raw, slugger) {
    if (this.options.headerIds) {
      return '<h'
        + level
        + ' id="'
        + this.options.headerPrefix
        + slugger.slug(raw)
        + '">'
        + text
        + '</h'
        + level
        + '>\n';
    }
    // ignore IDs
    return '<h' + level + '>' + text + '</h' + level + '>\n';
  };

  Renderer.prototype.hr = function() {
    return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
  };

  Renderer.prototype.list = function(body, ordered, start) {
    var type = ordered ? 'ol' : 'ul',
        startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
    return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
  };

  Renderer.prototype.listitem = function(text) {
    return '<li>' + text + '</li>\n';
  };

  Renderer.prototype.checkbox = function(checked) {
    return '<input '
      + (checked ? 'checked="" ' : '')
      + 'disabled="" type="checkbox"'
      + (this.options.xhtml ? ' /' : '')
      + '> ';
  };

  Renderer.prototype.paragraph = function(text) {
    return '<p>' + text + '</p>\n';
  };

  Renderer.prototype.table = function(header, body) {
    if (body) { body = '<tbody>' + body + '</tbody>'; }

    return '<table>\n'
      + '<thead>\n'
      + header
      + '</thead>\n'
      + body
      + '</table>\n';
  };

  Renderer.prototype.tablerow = function(content) {
    return '<tr>\n' + content + '</tr>\n';
  };

  Renderer.prototype.tablecell = function(content, flags) {
    var type = flags.header ? 'th' : 'td';
    var tag = flags.align
      ? '<' + type + ' align="' + flags.align + '">'
      : '<' + type + '>';
    return tag + content + '</' + type + '>\n';
  };

  // span level renderer
  Renderer.prototype.strong = function(text) {
    return '<strong>' + text + '</strong>';
  };

  Renderer.prototype.em = function(text) {
    return '<em>' + text + '</em>';
  };

  Renderer.prototype.codespan = function(text) {
    return '<code>' + text + '</code>';
  };

  Renderer.prototype.br = function() {
    return this.options.xhtml ? '<br/>' : '<br>';
  };

  Renderer.prototype.del = function(text) {
    return '<del>' + text + '</del>';
  };

  Renderer.prototype.link = function(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }
    var out = '<a href="' + escape(href) + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += '>' + text + '</a>';
    return out;
  };

  Renderer.prototype.image = function(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }

    var out = '<img src="' + href + '" alt="' + text + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += this.options.xhtml ? '/>' : '>';
    return out;
  };

  Renderer.prototype.text = function(text) {
    return text;
  };

  /**
   * TextRenderer
   * returns only the textual part of the token
   */

  function TextRenderer() {}

  // no need for block level renderers

  TextRenderer.prototype.strong =
  TextRenderer.prototype.em =
  TextRenderer.prototype.codespan =
  TextRenderer.prototype.del =
  TextRenderer.prototype.text = function(text) {
    return text;
  };

  TextRenderer.prototype.link =
  TextRenderer.prototype.image = function(href, title, text) {
    return '' + text;
  };

  TextRenderer.prototype.br = function() {
    return '';
  };

  /**
   * Parsing & Compiling
   */

  function Parser(options) {
    this.tokens = [];
    this.token = null;
    this.options = options || marked.defaults;
    this.options.renderer = this.options.renderer || new Renderer();
    this.renderer = this.options.renderer;
    this.renderer.options = this.options;
    this.slugger = new Slugger();
  }

  /**
   * Static Parse Method
   */

  Parser.parse = function(src, options) {
    var parser = new Parser(options);
    return parser.parse(src);
  };

  /**
   * Parse Loop
   */

  Parser.prototype.parse = function(src) {
    this.inline = new InlineLexer(src.links, this.options);
    // use an InlineLexer with a TextRenderer to extract pure text
    this.inlineText = new InlineLexer(
      src.links,
      merge({}, this.options, { renderer: new TextRenderer() })
    );
    this.tokens = src.reverse();

    var out = '';
    while (this.next()) {
      out += this.tok();
    }

    return out;
  };

  /**
   * Next Token
   */

  Parser.prototype.next = function() {
    this.token = this.tokens.pop();
    return this.token;
  };

  /**
   * Preview Next Token
   */

  Parser.prototype.peek = function() {
    return this.tokens[this.tokens.length - 1] || 0;
  };

  /**
   * Parse Text Tokens
   */

  Parser.prototype.parseText = function() {
    var body = this.token.text;

    while (this.peek().type === 'text') {
      body += '\n' + this.next().text;
    }

    return this.inline.output(body);
  };

  /**
   * Parse Current Token
   */

  Parser.prototype.tok = function() {
    switch (this.token.type) {
      case 'space': {
        return '';
      }
      case 'hr': {
        return this.renderer.hr();
      }
      case 'heading': {
        return this.renderer.heading(
          this.inline.output(this.token.text),
          this.token.depth,
          unescape(this.inlineText.output(this.token.text)),
          this.slugger);
      }
      case 'code': {
        return this.renderer.code(this.token.text,
          this.token.lang,
          this.token.escaped);
      }
      case 'table': {
        var header = '',
            body = '',
            i,
            row,
            cell,
            j;

        // header
        cell = '';
        for (i = 0; i < this.token.header.length; i++) {
          cell += this.renderer.tablecell(
            this.inline.output(this.token.header[i]),
            { header: true, align: this.token.align[i] }
          );
        }
        header += this.renderer.tablerow(cell);

        for (i = 0; i < this.token.cells.length; i++) {
          row = this.token.cells[i];

          cell = '';
          for (j = 0; j < row.length; j++) {
            cell += this.renderer.tablecell(
              this.inline.output(row[j]),
              { header: false, align: this.token.align[j] }
            );
          }

          body += this.renderer.tablerow(cell);
        }
        return this.renderer.table(header, body);
      }
      case 'blockquote_start': {
        body = '';

        while (this.next().type !== 'blockquote_end') {
          body += this.tok();
        }

        return this.renderer.blockquote(body);
      }
      case 'list_start': {
        body = '';
        var ordered = this.token.ordered,
            start = this.token.start;

        while (this.next().type !== 'list_end') {
          body += this.tok();
        }

        return this.renderer.list(body, ordered, start);
      }
      case 'list_item_start': {
        body = '';
        var loose = this.token.loose;
        var checked = this.token.checked;
        var task = this.token.task;

        if (this.token.task) {
          body += this.renderer.checkbox(checked);
        }

        while (this.next().type !== 'list_item_end') {
          body += !loose && this.token.type === 'text'
            ? this.parseText()
            : this.tok();
        }
        return this.renderer.listitem(body, task, checked);
      }
      case 'html': {
        // TODO parse inline content if parameter markdown=1
        return this.renderer.html(this.token.text);
      }
      case 'paragraph': {
        return this.renderer.paragraph(this.inline.output(this.token.text));
      }
      case 'text': {
        return this.renderer.paragraph(this.parseText());
      }
      default: {
        var errMsg = 'Token with "' + this.token.type + '" type was not found.';
        if (this.options.silent) {
          console.log(errMsg);
        } else {
          throw new Error(errMsg);
        }
      }
    }
  };

  /**
   * Slugger generates header id
   */

  function Slugger() {
    this.seen = {};
  }

  /**
   * Convert string to unique id
   */

  Slugger.prototype.slug = function(value) {
    var slug = value
      .toLowerCase()
      .trim()
      .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '')
      .replace(/\s/g, '-');

    if (this.seen.hasOwnProperty(slug)) {
      var originalSlug = slug;
      do {
        this.seen[originalSlug]++;
        slug = originalSlug + '-' + this.seen[originalSlug];
      } while (this.seen.hasOwnProperty(slug));
    }
    this.seen[slug] = 0;

    return slug;
  };

  /**
   * Helpers
   */

  function escape(html, encode) {
    if (encode) {
      if (escape.escapeTest.test(html)) {
        return html.replace(escape.escapeReplace, function(ch) { return escape.replacements[ch]; });
      }
    } else {
      if (escape.escapeTestNoEncode.test(html)) {
        return html.replace(escape.escapeReplaceNoEncode, function(ch) { return escape.replacements[ch]; });
      }
    }

    return html;
  }

  escape.escapeTest = /[&<>"']/;
  escape.escapeReplace = /[&<>"']/g;
  escape.replacements = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  escape.escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
  escape.escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;

  function unescape(html) {
    // explicitly match decimal, hex, and named HTML entities
    return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, function(_, n) {
      n = n.toLowerCase();
      if (n === 'colon') { return ':'; }
      if (n.charAt(0) === '#') {
        return n.charAt(1) === 'x'
          ? String.fromCharCode(parseInt(n.substring(2), 16))
          : String.fromCharCode(+n.substring(1));
      }
      return '';
    });
  }

  function edit(regex, opt) {
    regex = regex.source || regex;
    opt = opt || '';
    return {
      replace: function(name, val) {
        val = val.source || val;
        val = val.replace(/(^|[^\[])\^/g, '$1');
        regex = regex.replace(name, val);
        return this;
      },
      getRegex: function() {
        return new RegExp(regex, opt);
      }
    };
  }

  function cleanUrl(sanitize, base, href) {
    if (sanitize) {
      try {
        var prot = decodeURIComponent(unescape(href))
          .replace(/[^\w:]/g, '')
          .toLowerCase();
      } catch (e) {
        return null;
      }
      if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
        return null;
      }
    }
    if (base && !originIndependentUrl.test(href)) {
      href = resolveUrl(base, href);
    }
    try {
      href = encodeURI(href).replace(/%25/g, '%');
    } catch (e) {
      return null;
    }
    return href;
  }

  function resolveUrl(base, href) {
    if (!baseUrls[' ' + base]) {
      // we can ignore everything in base after the last slash of its path component,
      // but we might need to add _that_
      // https://tools.ietf.org/html/rfc3986#section-3
      if (/^[^:]+:\/*[^/]*$/.test(base)) {
        baseUrls[' ' + base] = base + '/';
      } else {
        baseUrls[' ' + base] = rtrim(base, '/', true);
      }
    }
    base = baseUrls[' ' + base];

    if (href.slice(0, 2) === '//') {
      return base.replace(/:[\s\S]*/, ':') + href;
    } else if (href.charAt(0) === '/') {
      return base.replace(/(:\/*[^/]*)[\s\S]*/, '$1') + href;
    } else {
      return base + href;
    }
  }
  var baseUrls = {};
  var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

  function noop() {}
  noop.exec = noop;

  function merge(obj) {
    var arguments$1 = arguments;

    var i = 1,
        target,
        key;

    for (; i < arguments.length; i++) {
      target = arguments$1[i];
      for (key in target) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
          obj[key] = target[key];
        }
      }
    }

    return obj;
  }

  function splitCells(tableRow, count) {
    // ensure that every cell-delimiting pipe has a space
    // before it to distinguish it from an escaped pipe
    var row = tableRow.replace(/\|/g, function(match, offset, str) {
          var escaped = false,
              curr = offset;
          while (--curr >= 0 && str[curr] === '\\') { escaped = !escaped; }
          if (escaped) {
            // odd number of slashes means | is escaped
            // so we leave it alone
            return '|';
          } else {
            // add space before unescaped |
            return ' |';
          }
        }),
        cells = row.split(/ \|/),
        i = 0;

    if (cells.length > count) {
      cells.splice(count);
    } else {
      while (cells.length < count) { cells.push(''); }
    }

    for (; i < cells.length; i++) {
      // leading or trailing whitespace is ignored per the gfm spec
      cells[i] = cells[i].trim().replace(/\\\|/g, '|');
    }
    return cells;
  }

  // Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
  // /c*$/ is vulnerable to REDOS.
  // invert: Remove suffix of non-c chars instead. Default falsey.
  function rtrim(str, c, invert) {
    if (str.length === 0) {
      return '';
    }

    // Length of suffix matching the invert condition.
    var suffLen = 0;

    // Step left until we fail to match the invert condition.
    while (suffLen < str.length) {
      var currChar = str.charAt(str.length - suffLen - 1);
      if (currChar === c && !invert) {
        suffLen++;
      } else if (currChar !== c && invert) {
        suffLen++;
      } else {
        break;
      }
    }

    return str.substr(0, str.length - suffLen);
  }

  function findClosingBracket(str, b) {
    if (str.indexOf(b[1]) === -1) {
      return -1;
    }
    var level = 0;
    for (var i = 0; i < str.length; i++) {
      if (str[i] === '\\') {
        i++;
      } else if (str[i] === b[0]) {
        level++;
      } else if (str[i] === b[1]) {
        level--;
        if (level < 0) {
          return i;
        }
      }
    }
    return -1;
  }

  function checkSanitizeDeprecation(opt) {
    if (opt && opt.sanitize && !opt.silent) {
      console.warn('marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options');
    }
  }

  /**
   * Marked
   */

  function marked(src, opt, callback) {
    // throw error in case of non string input
    if (typeof src === 'undefined' || src === null) {
      throw new Error('marked(): input parameter is undefined or null');
    }
    if (typeof src !== 'string') {
      throw new Error('marked(): input parameter is of type '
        + Object.prototype.toString.call(src) + ', string expected');
    }

    if (callback || typeof opt === 'function') {
      if (!callback) {
        callback = opt;
        opt = null;
      }

      opt = merge({}, marked.defaults, opt || {});
      checkSanitizeDeprecation(opt);

      var highlight = opt.highlight,
          tokens,
          pending,
          i = 0;

      try {
        tokens = Lexer.lex(src, opt);
      } catch (e) {
        return callback(e);
      }

      pending = tokens.length;

      var done = function(err) {
        if (err) {
          opt.highlight = highlight;
          return callback(err);
        }

        var out;

        try {
          out = Parser.parse(tokens, opt);
        } catch (e) {
          err = e;
        }

        opt.highlight = highlight;

        return err
          ? callback(err)
          : callback(null, out);
      };

      if (!highlight || highlight.length < 3) {
        return done();
      }

      delete opt.highlight;

      if (!pending) { return done(); }

      for (; i < tokens.length; i++) {
        (function(token) {
          if (token.type !== 'code') {
            return --pending || done();
          }
          return highlight(token.text, token.lang, function(err, code) {
            if (err) { return done(err); }
            if (code == null || code === token.text) {
              return --pending || done();
            }
            token.text = code;
            token.escaped = true;
            --pending || done();
          });
        })(tokens[i]);
      }

      return;
    }
    try {
      if (opt) { opt = merge({}, marked.defaults, opt); }
      checkSanitizeDeprecation(opt);
      return Parser.parse(Lexer.lex(src, opt), opt);
    } catch (e) {
      e.message += '\nPlease report this to https://github.com/markedjs/marked.';
      if ((opt || marked.defaults).silent) {
        return '<p>An error occurred:</p><pre>'
          + escape(e.message + '', true)
          + '</pre>';
      }
      throw e;
    }
  }

  /**
   * Options
   */

  marked.options =
  marked.setOptions = function(opt) {
    merge(marked.defaults, opt);
    return marked;
  };

  marked.getDefaults = function() {
    return {
      baseUrl: null,
      breaks: false,
      gfm: true,
      headerIds: true,
      headerPrefix: '',
      highlight: null,
      langPrefix: 'language-',
      mangle: true,
      pedantic: false,
      renderer: new Renderer(),
      sanitize: false,
      sanitizer: null,
      silent: false,
      smartLists: false,
      smartypants: false,
      xhtml: false
    };
  };

  marked.defaults = marked.getDefaults();

  /**
   * Expose
   */

  marked.Parser = Parser;
  marked.parser = Parser.parse;

  marked.Renderer = Renderer;
  marked.TextRenderer = TextRenderer;

  marked.Lexer = Lexer;
  marked.lexer = Lexer.lex;

  marked.InlineLexer = InlineLexer;
  marked.inlineLexer = InlineLexer.output;

  marked.Slugger = Slugger;

  marked.parse = marked;

  {
    module.exports = marked;
  }
  })();
  });

  /**
   * Render github corner
   * @param  {Object} data URL for the View Source on Github link
   * @param {String} cornerExternalLinkTarge value of the target attribute of the link
   * @return {String} SVG element as string
   */
  function corner(data, cornerExternalLinkTarge) {
    if (!data) {
      return '';
    }

    if (!/\/\//.test(data)) {
      data = 'https://github.com/' + data;
    }

    data = data.replace(/^git\+/, '');
    // Double check
    cornerExternalLinkTarge = cornerExternalLinkTarge || '_blank';

    return (
      "<a href=\"" + data + "\" target=\"" + cornerExternalLinkTarge + "\" class=\"github-corner\" aria-label=\"View source on Github\">" +
      '<svg viewBox="0 0 250 250" aria-hidden="true">' +
      '<path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>' +
      '<path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>' +
      '<path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>' +
      '</svg>' +
      '</a>'
    );
  }

  /**
   * Renders main content
   * @param {Object} config Configuration object
   * @returns {String} HTML of the main content
   */
  function main(config) {
    var name = config.name ? config.name : '';

    var aside =
      '<button class="sidebar-toggle" aria-label="Menu">' +
      '<div class="sidebar-toggle-button">' +
      '<span></span><span></span><span></span>' +
      '</div>' +
      '</button>' +
      '<aside class="sidebar">' +
      (config.name
        ? ("<h1 class=\"app-name\"><a class=\"app-name-link\" data-nosearch>" + (config.logo ? ("<img alt=\"" + name + "\" src=" + (config.logo) + ">") : name) + "</a></h1>")
        : '') +
      '<div class="sidebar-nav"><!--sidebar--></div>' +
      '</aside>';

    return (
      (isMobile ? (aside + "<main>") : ("<main>" + aside)) +
      '<section class="content">' +
      '<article class="markdown-section" id="main"><!--main--></article>' +
      '</section>' +
      '</main>'
    );
  }

  /**
   * Cover Page
   * @returns {String} Cover page
   */
  function cover() {
    var SL = ', 100%, 85%';
    var bgc =
      'linear-gradient(to left bottom, ' +
      "hsl(" + (Math.floor(Math.random() * 255) + SL) + ") 0%," +
      "hsl(" + (Math.floor(Math.random() * 255) + SL) + ") 100%)";

    return (
      "<section class=\"cover show\" style=\"background: " + bgc + "\">" +
      '<div class="cover-main"><!--cover--></div>' +
      '<div class="mask"></div>' +
      '</section>'
    );
  }

  /**
   * Render tree
   * @param  {Array} toc Array of TOC section links
   * @param  {String} tpl TPL list
   * @return {String} Rendered tree
   */
  function tree(toc, tpl) {
    if ( tpl === void 0 ) tpl = '<ul class="app-sub-sidebar">{inner}</ul>';

    if (!toc || !toc.length) {
      return '';
    }

    var innerHTML = '';
    toc.forEach(function (node) {
      innerHTML += "<li><a class=\"section-link\" href=\"" + (node.slug) + "\">" + (node.title) + "</a></li>";
      if (node.children) {
        innerHTML += tree(node.children, tpl);
      }
    });
    return tpl.replace('{inner}', innerHTML);
  }

  function helper(className, content) {
    return ("<p class=\"" + className + "\">" + (content.slice(5).trim()) + "</p>");
  }

  function theme(color) {
    return ("<style>:root{--theme-color: " + color + ";}</style>");
  }

  /**
   * Gen toc tree
   * @link https://github.com/killercup/grock/blob/5280ae63e16c5739e9233d9009bc235ed7d79a50/styles/solarized/assets/js/behavior.coffee#L54-L81
   * @param  {Array} toc List of TOC elements
   * @param  {Number} maxLevel Deep level
   * @return {Array} Headlines
   */
  function genTree(toc, maxLevel) {
    var headlines = [];
    var last = {};

    toc.forEach(function (headline) {
      var level = headline.level || 1;
      var len = level - 1;

      if (level > maxLevel) {
        return;
      }

      if (last[len]) {
        last[len].children = (last[len].children || []).concat(headline);
      } else {
        headlines.push(headline);
      }

      last[level] = headline;
    });

    return headlines;
  }

  var cache$1 = {};
  var re = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g;

  function lower(string) {
    return string.toLowerCase();
  }

  function slugify(str) {
    if (typeof str !== 'string') {
      return '';
    }

    var slug = str
      .trim()
      .replace(/[A-Z]+/g, lower)
      .replace(/<[^>\d]+>/g, '')
      .replace(re, '')
      .replace(/\s/g, '-')
      .replace(/-+/g, '-')
      .replace(/^(\d)/, '_$1');
    var count = cache$1[slug];

    count = hasOwn.call(cache$1, slug) ? count + 1 : 0;
    cache$1[slug] = count;

    if (count) {
      slug = slug + '-' + count;
    }

    return slug;
  }

  slugify.clear = function() {
    cache$1 = {};
  };

  function replace(m, $1) {
    return (
      '<img class="emoji" src="https://github.githubassets.com/images/icons/emoji/' +
      $1 +
      '.png" alt="' +
      $1 +
      '" />'
    );
  }

  function emojify(text) {
    return text
      .replace(/:\+1:/g, ':thumbsup:')
      .replace(/:-1:/g, ':thumbsdown:')
      .replace(/<(pre|template|code)[^>]*?>[\s\S]+?<\/(pre|template|code)>/g, function (m) { return m.replace(/:/g, '__colon__'); }
      )
      .replace(/:(\w+?):/gi, ( window.emojify) || replace)
      .replace(/__colon__/g, ':');
  }

  /**
   * Converts a colon formatted string to a object with properties.
   *
   * This is process a provided string and look for any tokens in the format
   * of `:name[=value]` and then convert it to a object and return.
   * An example of this is ':include :type=code :fragment=demo' is taken and
   * then converted to:
   *
   * ```
   * {
   *  include: '',
   *  type: 'code',
   *  fragment: 'demo'
   * }
   * ```
   *
   * @param {string}   str   The string to parse.
   *
   * @return {object}  The original string and parsed object, { str, config }.
   */
  function getAndRemoveConfig(str) {
    if ( str === void 0 ) str = '';

    var config = {};

    if (str) {
      str = str
        .replace(/^'/, '')
        .replace(/'$/, '')
        .replace(/(?:^|\s):([\w-]+:?)=?([\w-%]+)?/g, function (m, key, value) {
          if (key.indexOf(':') === -1) {
            config[key] = (value && value.replace(/&quot;/g, '')) || true;
            return '';
          }

          return m;
        })
        .trim();
    }

    return { str: str, config: config };
  }

  var imageCompiler = function (ref) {
      var renderer = ref.renderer;
      var contentBase = ref.contentBase;
      var router = ref.router;

      return (renderer.image = function (href, title, text) {
      var url = href;
      var attrs = [];

      var ref = getAndRemoveConfig(title);
      var str = ref.str;
      var config = ref.config;
      title = str;

      if (config['no-zoom']) {
        attrs.push('data-no-zoom');
      }

      if (title) {
        attrs.push(("title=\"" + title + "\""));
      }

      if (config.size) {
        var ref$1 = config.size.split('x');
        var width = ref$1[0];
        var height = ref$1[1];
        if (height) {
          attrs.push(("width=\"" + width + "\" height=\"" + height + "\""));
        } else {
          attrs.push(("width=\"" + width + "\""));
        }
      }

      if (config.class) {
        attrs.push(("class=\"" + (config.class) + "\""));
      }

      if (config.id) {
        attrs.push(("id=\"" + (config.id) + "\""));
      }

      if (!isAbsolutePath(href)) {
        url = getPath(contentBase, getParentPath(router.getCurrentPath()), href);
      }

      if (attrs.length > 0) {
        return ("<img src=\"" + url + "\" data-origin=\"" + href + "\" alt=\"" + text + "\" " + (attrs.join(
          ' '
        )) + " />");
      }

      return ("<img src=\"" + url + "\" data-origin=\"" + href + "\" alt=\"" + text + "\"" + attrs + ">");
    });
  };

  var prism = createCommonjsModule(function (module) {
  /* **********************************************
       Begin prism-core.js
  ********************************************** */

  var _self = (typeof window !== 'undefined')
  	? window   // if in browser
  	: (
  		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
  		? self // if in worker
  		: {}   // if in node js
  	);

  /**
   * Prism: Lightweight, robust, elegant syntax highlighting
   * MIT license http://www.opensource.org/licenses/mit-license.php/
   * @author Lea Verou http://lea.verou.me
   */

  var Prism = (function (_self){

  // Private helper vars
  var lang = /\blang(?:uage)?-([\w-]+)\b/i;
  var uniqueId = 0;


  var _ = {
  	manual: _self.Prism && _self.Prism.manual,
  	disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
  	util: {
  		encode: function (tokens) {
  			if (tokens instanceof Token) {
  				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
  			} else if (Array.isArray(tokens)) {
  				return tokens.map(_.util.encode);
  			} else {
  				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
  			}
  		},

  		type: function (o) {
  			return Object.prototype.toString.call(o).slice(8, -1);
  		},

  		objId: function (obj) {
  			if (!obj['__id']) {
  				Object.defineProperty(obj, '__id', { value: ++uniqueId });
  			}
  			return obj['__id'];
  		},

  		// Deep clone a language definition (e.g. to extend it)
  		clone: function deepClone(o, visited) {
  			var clone, id, type = _.util.type(o);
  			visited = visited || {};

  			switch (type) {
  				case 'Object':
  					id = _.util.objId(o);
  					if (visited[id]) {
  						return visited[id];
  					}
  					clone = {};
  					visited[id] = clone;

  					for (var key in o) {
  						if (o.hasOwnProperty(key)) {
  							clone[key] = deepClone(o[key], visited);
  						}
  					}

  					return clone;

  				case 'Array':
  					id = _.util.objId(o);
  					if (visited[id]) {
  						return visited[id];
  					}
  					clone = [];
  					visited[id] = clone;

  					o.forEach(function (v, i) {
  						clone[i] = deepClone(v, visited);
  					});

  					return clone;

  				default:
  					return o;
  			}
  		},

  		/**
  		 * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
  		 *
  		 * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
  		 *
  		 * @param {Element} element
  		 * @returns {string}
  		 */
  		getLanguage: function (element) {
  			while (element && !lang.test(element.className)) {
  				element = element.parentElement;
  			}
  			if (element) {
  				return (element.className.match(lang) || [, 'none'])[1].toLowerCase();
  			}
  			return 'none';
  		},

  		/**
  		 * Returns the script element that is currently executing.
  		 *
  		 * This does __not__ work for line script element.
  		 *
  		 * @returns {HTMLScriptElement | null}
  		 */
  		currentScript: function () {
  			if (typeof document === 'undefined') {
  				return null;
  			}
  			if ('currentScript' in document) {
  				return document.currentScript;
  			}

  			// IE11 workaround
  			// we'll get the src of the current script by parsing IE11's error stack trace
  			// this will not work for inline scripts

  			try {
  				throw new Error();
  			} catch (err) {
  				// Get file src url from stack. Specifically works with the format of stack traces in IE.
  				// A stack will look like this:
  				//
  				// Error
  				//    at _.util.currentScript (http://localhost/components/prism-core.js:119:5)
  				//    at Global code (http://localhost/components/prism-core.js:606:1)

  				var src = (/at [^(\r\n]*\((.*):.+:.+\)$/i.exec(err.stack) || [])[1];
  				if (src) {
  					var scripts = document.getElementsByTagName('script');
  					for (var i in scripts) {
  						if (scripts[i].src == src) {
  							return scripts[i];
  						}
  					}
  				}
  				return null;
  			}
  		}
  	},

  	languages: {
  		extend: function (id, redef) {
  			var lang = _.util.clone(_.languages[id]);

  			for (var key in redef) {
  				lang[key] = redef[key];
  			}

  			return lang;
  		},

  		/**
  		 * Insert a token before another token in a language literal
  		 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
  		 * we cannot just provide an object, we need an object and a key.
  		 * @param inside The key (or language id) of the parent
  		 * @param before The key to insert before.
  		 * @param insert Object with the key/value pairs to insert
  		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
  		 */
  		insertBefore: function (inside, before, insert, root) {
  			root = root || _.languages;
  			var grammar = root[inside];
  			var ret = {};

  			for (var token in grammar) {
  				if (grammar.hasOwnProperty(token)) {

  					if (token == before) {
  						for (var newToken in insert) {
  							if (insert.hasOwnProperty(newToken)) {
  								ret[newToken] = insert[newToken];
  							}
  						}
  					}

  					// Do not insert token which also occur in insert. See #1525
  					if (!insert.hasOwnProperty(token)) {
  						ret[token] = grammar[token];
  					}
  				}
  			}

  			var old = root[inside];
  			root[inside] = ret;

  			// Update references in other language definitions
  			_.languages.DFS(_.languages, function(key, value) {
  				if (value === old && key != inside) {
  					this[key] = ret;
  				}
  			});

  			return ret;
  		},

  		// Traverse a language definition with Depth First Search
  		DFS: function DFS(o, callback, type, visited) {
  			visited = visited || {};

  			var objId = _.util.objId;

  			for (var i in o) {
  				if (o.hasOwnProperty(i)) {
  					callback.call(o, i, o[i], type || i);

  					var property = o[i],
  					    propertyType = _.util.type(property);

  					if (propertyType === 'Object' && !visited[objId(property)]) {
  						visited[objId(property)] = true;
  						DFS(property, callback, null, visited);
  					}
  					else if (propertyType === 'Array' && !visited[objId(property)]) {
  						visited[objId(property)] = true;
  						DFS(property, callback, i, visited);
  					}
  				}
  			}
  		}
  	},
  	plugins: {},

  	highlightAll: function(async, callback) {
  		_.highlightAllUnder(document, async, callback);
  	},

  	highlightAllUnder: function(container, async, callback) {
  		var env = {
  			callback: callback,
  			container: container,
  			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
  		};

  		_.hooks.run('before-highlightall', env);

  		env.elements = Array.prototype.slice.apply(env.container.querySelectorAll(env.selector));

  		_.hooks.run('before-all-elements-highlight', env);

  		for (var i = 0, element; element = env.elements[i++];) {
  			_.highlightElement(element, async === true, env.callback);
  		}
  	},

  	highlightElement: function(element, async, callback) {
  		// Find language
  		var language = _.util.getLanguage(element);
  		var grammar = _.languages[language];

  		// Set language on the element, if not present
  		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

  		// Set language on the parent, for styling
  		var parent = element.parentNode;
  		if (parent && parent.nodeName.toLowerCase() === 'pre') {
  			parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
  		}

  		var code = element.textContent;

  		var env = {
  			element: element,
  			language: language,
  			grammar: grammar,
  			code: code
  		};

  		function insertHighlightedCode(highlightedCode) {
  			env.highlightedCode = highlightedCode;

  			_.hooks.run('before-insert', env);

  			env.element.innerHTML = env.highlightedCode;

  			_.hooks.run('after-highlight', env);
  			_.hooks.run('complete', env);
  			callback && callback.call(env.element);
  		}

  		_.hooks.run('before-sanity-check', env);

  		if (!env.code) {
  			_.hooks.run('complete', env);
  			callback && callback.call(env.element);
  			return;
  		}

  		_.hooks.run('before-highlight', env);

  		if (!env.grammar) {
  			insertHighlightedCode(_.util.encode(env.code));
  			return;
  		}

  		if (async && _self.Worker) {
  			var worker = new Worker(_.filename);

  			worker.onmessage = function(evt) {
  				insertHighlightedCode(evt.data);
  			};

  			worker.postMessage(JSON.stringify({
  				language: env.language,
  				code: env.code,
  				immediateClose: true
  			}));
  		}
  		else {
  			insertHighlightedCode(_.highlight(env.code, env.grammar, env.language));
  		}
  	},

  	highlight: function (text, grammar, language) {
  		var env = {
  			code: text,
  			grammar: grammar,
  			language: language
  		};
  		_.hooks.run('before-tokenize', env);
  		env.tokens = _.tokenize(env.code, env.grammar);
  		_.hooks.run('after-tokenize', env);
  		return Token.stringify(_.util.encode(env.tokens), env.language);
  	},

  	matchGrammar: function (text, strarr, grammar, index, startPos, oneshot, target) {
  		for (var token in grammar) {
  			if (!grammar.hasOwnProperty(token) || !grammar[token]) {
  				continue;
  			}

  			var patterns = grammar[token];
  			patterns = Array.isArray(patterns) ? patterns : [patterns];

  			for (var j = 0; j < patterns.length; ++j) {
  				if (target && target == token + ',' + j) {
  					return;
  				}

  				var pattern = patterns[j],
  					inside = pattern.inside,
  					lookbehind = !!pattern.lookbehind,
  					greedy = !!pattern.greedy,
  					lookbehindLength = 0,
  					alias = pattern.alias;

  				if (greedy && !pattern.pattern.global) {
  					// Without the global flag, lastIndex won't work
  					var flags = pattern.pattern.toString().match(/[imsuy]*$/)[0];
  					pattern.pattern = RegExp(pattern.pattern.source, flags + 'g');
  				}

  				pattern = pattern.pattern || pattern;

  				// Don’t cache length as it changes during the loop
  				for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {

  					var str = strarr[i];

  					if (strarr.length > text.length) {
  						// Something went terribly wrong, ABORT, ABORT!
  						return;
  					}

  					if (str instanceof Token) {
  						continue;
  					}

  					if (greedy && i != strarr.length - 1) {
  						pattern.lastIndex = pos;
  						var match = pattern.exec(text);
  						if (!match) {
  							break;
  						}

  						var from = match.index + (lookbehind && match[1] ? match[1].length : 0),
  						    to = match.index + match[0].length,
  						    k = i,
  						    p = pos;

  						for (var len = strarr.length; k < len && (p < to || (!strarr[k].type && !strarr[k - 1].greedy)); ++k) {
  							p += strarr[k].length;
  							// Move the index i to the element in strarr that is closest to from
  							if (from >= p) {
  								++i;
  								pos = p;
  							}
  						}

  						// If strarr[i] is a Token, then the match starts inside another Token, which is invalid
  						if (strarr[i] instanceof Token) {
  							continue;
  						}

  						// Number of tokens to delete and replace with the new match
  						delNum = k - i;
  						str = text.slice(pos, p);
  						match.index -= pos;
  					} else {
  						pattern.lastIndex = 0;

  						var match = pattern.exec(str),
  							delNum = 1;
  					}

  					if (!match) {
  						if (oneshot) {
  							break;
  						}

  						continue;
  					}

  					if(lookbehind) {
  						lookbehindLength = match[1] ? match[1].length : 0;
  					}

  					var from = match.index + lookbehindLength,
  					    match = match[0].slice(lookbehindLength),
  					    to = from + match.length,
  					    before = str.slice(0, from),
  					    after = str.slice(to);

  					var args = [i, delNum];

  					if (before) {
  						++i;
  						pos += before.length;
  						args.push(before);
  					}

  					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

  					args.push(wrapped);

  					if (after) {
  						args.push(after);
  					}

  					Array.prototype.splice.apply(strarr, args);

  					if (delNum != 1)
  						{ _.matchGrammar(text, strarr, grammar, i, pos, true, token + ',' + j); }

  					if (oneshot)
  						{ break; }
  				}
  			}
  		}
  	},

  	tokenize: function(text, grammar) {
  		var strarr = [text];

  		var rest = grammar.rest;

  		if (rest) {
  			for (var token in rest) {
  				grammar[token] = rest[token];
  			}

  			delete grammar.rest;
  		}

  		_.matchGrammar(text, strarr, grammar, 0, 0, false);

  		return strarr;
  	},

  	hooks: {
  		all: {},

  		add: function (name, callback) {
  			var hooks = _.hooks.all;

  			hooks[name] = hooks[name] || [];

  			hooks[name].push(callback);
  		},

  		run: function (name, env) {
  			var callbacks = _.hooks.all[name];

  			if (!callbacks || !callbacks.length) {
  				return;
  			}

  			for (var i=0, callback; callback = callbacks[i++];) {
  				callback(env);
  			}
  		}
  	},

  	Token: Token
  };

  _self.Prism = _;

  function Token(type, content, alias, matchedStr, greedy) {
  	this.type = type;
  	this.content = content;
  	this.alias = alias;
  	// Copy of the full string this token was created from
  	this.length = (matchedStr || '').length|0;
  	this.greedy = !!greedy;
  }

  Token.stringify = function(o, language) {
  	if (typeof o == 'string') {
  		return o;
  	}

  	if (Array.isArray(o)) {
  		return o.map(function(element) {
  			return Token.stringify(element, language);
  		}).join('');
  	}

  	var env = {
  		type: o.type,
  		content: Token.stringify(o.content, language),
  		tag: 'span',
  		classes: ['token', o.type],
  		attributes: {},
  		language: language
  	};

  	if (o.alias) {
  		var aliases = Array.isArray(o.alias) ? o.alias : [o.alias];
  		Array.prototype.push.apply(env.classes, aliases);
  	}

  	_.hooks.run('wrap', env);

  	var attributes = Object.keys(env.attributes).map(function(name) {
  		return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
  	}).join(' ');

  	return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';
  };

  if (!_self.document) {
  	if (!_self.addEventListener) {
  		// in Node.js
  		return _;
  	}

  	if (!_.disableWorkerMessageHandler) {
  		// In worker
  		_self.addEventListener('message', function (evt) {
  			var message = JSON.parse(evt.data),
  				lang = message.language,
  				code = message.code,
  				immediateClose = message.immediateClose;

  			_self.postMessage(_.highlight(code, _.languages[lang], lang));
  			if (immediateClose) {
  				_self.close();
  			}
  		}, false);
  	}

  	return _;
  }

  //Get current script and highlight
  var script = _.util.currentScript();

  if (script) {
  	_.filename = script.src;

  	if (script.hasAttribute('data-manual')) {
  		_.manual = true;
  	}
  }

  if (!_.manual) {
  	function highlightAutomaticallyCallback() {
  		if (!_.manual) {
  			_.highlightAll();
  		}
  	}

  	// If the document state is "loading", then we'll use DOMContentLoaded.
  	// If the document state is "interactive" and the prism.js script is deferred, then we'll also use the
  	// DOMContentLoaded event because there might be some plugins or languages which have also been deferred and they
  	// might take longer one animation frame to execute which can create a race condition where only some plugins have
  	// been loaded when Prism.highlightAll() is executed, depending on how fast resources are loaded.
  	// See https://github.com/PrismJS/prism/issues/2102
  	var readyState = document.readyState;
  	if (readyState === 'loading' || readyState === 'interactive' && script && script.defer) {
  		document.addEventListener('DOMContentLoaded', highlightAutomaticallyCallback);
  	} else {
  		if (window.requestAnimationFrame) {
  			window.requestAnimationFrame(highlightAutomaticallyCallback);
  		} else {
  			window.setTimeout(highlightAutomaticallyCallback, 16);
  		}
  	}
  }

  return _;

  })(_self);

  if ( module.exports) {
  	module.exports = Prism;
  }

  // hack for components to work correctly in node.js
  if (typeof commonjsGlobal !== 'undefined') {
  	commonjsGlobal.Prism = Prism;
  }


  /* **********************************************
       Begin prism-markup.js
  ********************************************** */

  Prism.languages.markup = {
  	'comment': /<!--[\s\S]*?-->/,
  	'prolog': /<\?[\s\S]+?\?>/,
  	'doctype': {
  		pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:(?!<!--)[^"'\]]|"[^"]*"|'[^']*'|<!--[\s\S]*?-->)*\]\s*)?>/i,
  		greedy: true
  	},
  	'cdata': /<!\[CDATA\[[\s\S]*?]]>/i,
  	'tag': {
  		pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/i,
  		greedy: true,
  		inside: {
  			'tag': {
  				pattern: /^<\/?[^\s>\/]+/i,
  				inside: {
  					'punctuation': /^<\/?/,
  					'namespace': /^[^\s>\/:]+:/
  				}
  			},
  			'attr-value': {
  				pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
  				inside: {
  					'punctuation': [
  						/^=/,
  						{
  							pattern: /^(\s*)["']|["']$/,
  							lookbehind: true
  						}
  					]
  				}
  			},
  			'punctuation': /\/?>/,
  			'attr-name': {
  				pattern: /[^\s>\/]+/,
  				inside: {
  					'namespace': /^[^\s>\/:]+:/
  				}
  			}

  		}
  	},
  	'entity': /&#?[\da-z]{1,8};/i
  };

  Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
  	Prism.languages.markup['entity'];

  // Plugin to make entity title show the real entity, idea by Roman Komarov
  Prism.hooks.add('wrap', function(env) {

  	if (env.type === 'entity') {
  		env.attributes['title'] = env.content.replace(/&amp;/, '&');
  	}
  });

  Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
  	/**
  	 * Adds an inlined language to markup.
  	 *
  	 * An example of an inlined language is CSS with `<style>` tags.
  	 *
  	 * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
  	 * case insensitive.
  	 * @param {string} lang The language key.
  	 * @example
  	 * addInlined('style', 'css');
  	 */
  	value: function addInlined(tagName, lang) {
  		var includedCdataInside = {};
  		includedCdataInside['language-' + lang] = {
  			pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
  			lookbehind: true,
  			inside: Prism.languages[lang]
  		};
  		includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;

  		var inside = {
  			'included-cdata': {
  				pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
  				inside: includedCdataInside
  			}
  		};
  		inside['language-' + lang] = {
  			pattern: /[\s\S]+/,
  			inside: Prism.languages[lang]
  		};

  		var def = {};
  		def[tagName] = {
  			pattern: RegExp(/(<__[\s\S]*?>)(?:<!\[CDATA\[[\s\S]*?\]\]>\s*|[\s\S])*?(?=<\/__>)/.source.replace(/__/g, tagName), 'i'),
  			lookbehind: true,
  			greedy: true,
  			inside: inside
  		};

  		Prism.languages.insertBefore('markup', 'cdata', def);
  	}
  });

  Prism.languages.xml = Prism.languages.extend('markup', {});
  Prism.languages.html = Prism.languages.markup;
  Prism.languages.mathml = Prism.languages.markup;
  Prism.languages.svg = Prism.languages.markup;


  /* **********************************************
       Begin prism-css.js
  ********************************************** */

  (function (Prism) {

  	var string = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;

  	Prism.languages.css = {
  		'comment': /\/\*[\s\S]*?\*\//,
  		'atrule': {
  			pattern: /@[\w-]+[\s\S]*?(?:;|(?=\s*\{))/,
  			inside: {
  				'rule': /@[\w-]+/
  				// See rest below
  			}
  		},
  		'url': {
  			pattern: RegExp('url\\((?:' + string.source + '|[^\n\r()]*)\\)', 'i'),
  			inside: {
  				'function': /^url/i,
  				'punctuation': /^\(|\)$/
  			}
  		},
  		'selector': RegExp('[^{}\\s](?:[^{};"\']|' + string.source + ')*?(?=\\s*\\{)'),
  		'string': {
  			pattern: string,
  			greedy: true
  		},
  		'property': /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
  		'important': /!important\b/i,
  		'function': /[-a-z0-9]+(?=\()/i,
  		'punctuation': /[(){};:,]/
  	};

  	Prism.languages.css['atrule'].inside.rest = Prism.languages.css;

  	var markup = Prism.languages.markup;
  	if (markup) {
  		markup.tag.addInlined('style', 'css');

  		Prism.languages.insertBefore('inside', 'attr-value', {
  			'style-attr': {
  				pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
  				inside: {
  					'attr-name': {
  						pattern: /^\s*style/i,
  						inside: markup.tag.inside
  					},
  					'punctuation': /^\s*=\s*['"]|['"]\s*$/,
  					'attr-value': {
  						pattern: /.+/i,
  						inside: Prism.languages.css
  					}
  				},
  				alias: 'language-css'
  			}
  		}, markup.tag);
  	}

  }(Prism));


  /* **********************************************
       Begin prism-clike.js
  ********************************************** */

  Prism.languages.clike = {
  	'comment': [
  		{
  			pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
  			lookbehind: true
  		},
  		{
  			pattern: /(^|[^\\:])\/\/.*/,
  			lookbehind: true,
  			greedy: true
  		}
  	],
  	'string': {
  		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
  		greedy: true
  	},
  	'class-name': {
  		pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
  		lookbehind: true,
  		inside: {
  			'punctuation': /[.\\]/
  		}
  	},
  	'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
  	'boolean': /\b(?:true|false)\b/,
  	'function': /\w+(?=\()/,
  	'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
  	'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
  	'punctuation': /[{}[\];(),.:]/
  };


  /* **********************************************
       Begin prism-javascript.js
  ********************************************** */

  Prism.languages.javascript = Prism.languages.extend('clike', {
  	'class-name': [
  		Prism.languages.clike['class-name'],
  		{
  			pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
  			lookbehind: true
  		}
  	],
  	'keyword': [
  		{
  			pattern: /((?:^|})\s*)(?:catch|finally)\b/,
  			lookbehind: true
  		},
  		{
  			pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
  			lookbehind: true
  		} ],
  	'number': /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
  	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
  	'function': /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  	'operator': /--|\+\+|\*\*=?|=>|&&|\|\||[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?[.?]?|[~:]/
  });

  Prism.languages.javascript['class-name'][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;

  Prism.languages.insertBefore('javascript', 'keyword', {
  	'regex': {
  		pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=(?:\s|\/\*[\s\S]*?\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
  		lookbehind: true,
  		greedy: true
  	},
  	// This must be declared before keyword because we use "function" inside the look-forward
  	'function-variable': {
  		pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
  		alias: 'function'
  	},
  	'parameter': [
  		{
  			pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
  			lookbehind: true,
  			inside: Prism.languages.javascript
  		},
  		{
  			pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
  			inside: Prism.languages.javascript
  		},
  		{
  			pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
  			lookbehind: true,
  			inside: Prism.languages.javascript
  		},
  		{
  			pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
  			lookbehind: true,
  			inside: Prism.languages.javascript
  		}
  	],
  	'constant': /\b[A-Z](?:[A-Z_]|\dx?)*\b/
  });

  Prism.languages.insertBefore('javascript', 'string', {
  	'template-string': {
  		pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/,
  		greedy: true,
  		inside: {
  			'template-punctuation': {
  				pattern: /^`|`$/,
  				alias: 'string'
  			},
  			'interpolation': {
  				pattern: /((?:^|[^\\])(?:\\{2})*)\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
  				lookbehind: true,
  				inside: {
  					'interpolation-punctuation': {
  						pattern: /^\${|}$/,
  						alias: 'punctuation'
  					},
  					rest: Prism.languages.javascript
  				}
  			},
  			'string': /[\s\S]+/
  		}
  	}
  });

  if (Prism.languages.markup) {
  	Prism.languages.markup.tag.addInlined('script', 'javascript');
  }

  Prism.languages.js = Prism.languages.javascript;


  /* **********************************************
       Begin prism-file-highlight.js
  ********************************************** */

  (function () {
  	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
  		return;
  	}

  	/**
  	 * @param {Element} [container=document]
  	 */
  	self.Prism.fileHighlight = function(container) {
  		container = container || document;

  		var Extensions = {
  			'js': 'javascript',
  			'py': 'python',
  			'rb': 'ruby',
  			'ps1': 'powershell',
  			'psm1': 'powershell',
  			'sh': 'bash',
  			'bat': 'batch',
  			'h': 'c',
  			'tex': 'latex'
  		};

  		Array.prototype.slice.call(container.querySelectorAll('pre[data-src]')).forEach(function (pre) {
  			// ignore if already loaded
  			if (pre.hasAttribute('data-src-loaded')) {
  				return;
  			}

  			// load current
  			var src = pre.getAttribute('data-src');

  			var language, parent = pre;
  			var lang = /\blang(?:uage)?-([\w-]+)\b/i;
  			while (parent && !lang.test(parent.className)) {
  				parent = parent.parentNode;
  			}

  			if (parent) {
  				language = (pre.className.match(lang) || [, ''])[1];
  			}

  			if (!language) {
  				var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
  				language = Extensions[extension] || extension;
  			}

  			var code = document.createElement('code');
  			code.className = 'language-' + language;

  			pre.textContent = '';

  			code.textContent = 'Loading…';

  			pre.appendChild(code);

  			var xhr = new XMLHttpRequest();

  			xhr.open('GET', src, true);

  			xhr.onreadystatechange = function () {
  				if (xhr.readyState == 4) {

  					if (xhr.status < 400 && xhr.responseText) {
  						code.textContent = xhr.responseText;

  						Prism.highlightElement(code);
  						// mark as loaded
  						pre.setAttribute('data-src-loaded', '');
  					}
  					else if (xhr.status >= 400) {
  						code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
  					}
  					else {
  						code.textContent = '✖ Error: File does not exist or is empty';
  					}
  				}
  			};

  			xhr.send(null);
  		});
  	};

  	document.addEventListener('DOMContentLoaded', function () {
  		// execute inside handler, for dropping Event as argument
  		self.Prism.fileHighlight();
  	});

  })();
  });

  (function (Prism) {

  	/**
  	 * Returns the placeholder for the given language id and index.
  	 *
  	 * @param {string} language
  	 * @param {string|number} index
  	 * @returns {string}
  	 */
  	function getPlaceholder(language, index) {
  		return '___' + language.toUpperCase() + index + '___';
  	}

  	Object.defineProperties(Prism.languages['markup-templating'] = {}, {
  		buildPlaceholders: {
  			/**
  			 * Tokenize all inline templating expressions matching `placeholderPattern`.
  			 *
  			 * If `replaceFilter` is provided, only matches of `placeholderPattern` for which `replaceFilter` returns
  			 * `true` will be replaced.
  			 *
  			 * @param {object} env The environment of the `before-tokenize` hook.
  			 * @param {string} language The language id.
  			 * @param {RegExp} placeholderPattern The matches of this pattern will be replaced by placeholders.
  			 * @param {(match: string) => boolean} [replaceFilter]
  			 */
  			value: function (env, language, placeholderPattern, replaceFilter) {
  				if (env.language !== language) {
  					return;
  				}

  				var tokenStack = env.tokenStack = [];

  				env.code = env.code.replace(placeholderPattern, function (match) {
  					if (typeof replaceFilter === 'function' && !replaceFilter(match)) {
  						return match;
  					}
  					var i = tokenStack.length;
  					var placeholder;

  					// Check for existing strings
  					while (env.code.indexOf(placeholder = getPlaceholder(language, i)) !== -1)
  						{ ++i; }

  					// Create a sparse array
  					tokenStack[i] = match;

  					return placeholder;
  				});

  				// Switch the grammar to markup
  				env.grammar = Prism.languages.markup;
  			}
  		},
  		tokenizePlaceholders: {
  			/**
  			 * Replace placeholders with proper tokens after tokenizing.
  			 *
  			 * @param {object} env The environment of the `after-tokenize` hook.
  			 * @param {string} language The language id.
  			 */
  			value: function (env, language) {
  				if (env.language !== language || !env.tokenStack) {
  					return;
  				}

  				// Switch the grammar back
  				env.grammar = Prism.languages[language];

  				var j = 0;
  				var keys = Object.keys(env.tokenStack);

  				function walkTokens(tokens) {
  					for (var i = 0; i < tokens.length; i++) {
  						// all placeholders are replaced already
  						if (j >= keys.length) {
  							break;
  						}

  						var token = tokens[i];
  						if (typeof token === 'string' || (token.content && typeof token.content === 'string')) {
  							var k = keys[j];
  							var t = env.tokenStack[k];
  							var s = typeof token === 'string' ? token : token.content;
  							var placeholder = getPlaceholder(language, k);

  							var index = s.indexOf(placeholder);
  							if (index > -1) {
  								++j;

  								var before = s.substring(0, index);
  								var middle = new Prism.Token(language, Prism.tokenize(t, env.grammar), 'language-' + language, t);
  								var after = s.substring(index + placeholder.length);

  								var replacement = [];
  								if (before) {
  									replacement.push.apply(replacement, walkTokens([before]));
  								}
  								replacement.push(middle);
  								if (after) {
  									replacement.push.apply(replacement, walkTokens([after]));
  								}

  								if (typeof token === 'string') {
  									tokens.splice.apply(tokens, [i, 1].concat(replacement));
  								} else {
  									token.content = replacement;
  								}
  							}
  						} else if (token.content /* && typeof token.content !== 'string' */) {
  							walkTokens(token.content);
  						}
  					}

  					return tokens;
  				}

  				walkTokens(env.tokens);
  			}
  		}
  	});

  }(Prism));

  var highlightCodeCompiler = function (ref) {
      var renderer = ref.renderer;

      return (renderer.code = function(code, lang) {
      if ( lang === void 0 ) lang = '';

      var langOrMarkup = prism.languages[lang] || prism.languages.markup;
      var text = prism.highlight(
        code.replace(/@DOCSIFY_QM@/g, '`'),
        langOrMarkup
      );

      return ("<pre v-pre data-lang=\"" + lang + "\"><code class=\"lang-" + lang + "\">" + text + "</code></pre>");
    });
  };

  var paragraphCompiler = function (ref) {
      var renderer = ref.renderer;

      return (renderer.paragraph = function (text) {
      var result;
      if (/^!&gt;/.test(text)) {
        result = helper('tip', text);
      } else if (/^\?&gt;/.test(text)) {
        result = helper('warn', text);
      } else {
        result = "<p>" + text + "</p>";
      }

      return result;
    });
  };

  var taskListCompiler = function (ref) {
      var renderer = ref.renderer;

      return (renderer.list = function (body, ordered, start) {
      var isTaskList = /<li class="task-list-item">/.test(
        body.split('class="task-list"')[0]
      );
      var isStartReq = start && start > 1;
      var tag = ordered ? 'ol' : 'ul';
      var tagAttrs = [
        isTaskList ? 'class="task-list"' : '',
        isStartReq ? ("start=\"" + start + "\"") : '' ]
        .join(' ')
        .trim();

      return ("<" + tag + " " + tagAttrs + ">" + body + "</" + tag + ">");
    });
  };

  var taskListItemCompiler = function (ref) {
      var renderer = ref.renderer;

      return (renderer.listitem = function (text) {
      var isTaskItem = /^(<input.*type="checkbox"[^>]*>)/.test(text);
      var html = isTaskItem
        ? ("<li class=\"task-list-item\"><label>" + text + "</label></li>")
        : ("<li>" + text + "</li>");

      return html;
    });
  };

  var linkCompiler = function (ref) {
      var renderer = ref.renderer;
      var router = ref.router;
      var linkTarget = ref.linkTarget;
      var linkRel = ref.linkRel;
      var compilerClass = ref.compilerClass;

      return (renderer.link = function (href, title, text) {
      if ( title === void 0 ) title = '';

      var attrs = [];
      var ref = getAndRemoveConfig(title);
      var str = ref.str;
      var config = ref.config;
      linkTarget = config.target || linkTarget;
      linkRel =
        linkTarget === '_blank'
          ? compilerClass.config.externalLinkRel || 'noopener'
          : '';
      title = str;

      if (
        !isAbsolutePath(href) &&
        !compilerClass._matchNotCompileLink(href) &&
        !config.ignore
      ) {
        if (href === compilerClass.config.homepage) {
          href = 'README';
        }

        href = router.toURL(href, null, router.getCurrentPath());
      } else {
        if (!isAbsolutePath(href) && href.startsWith('./')) {
          href =
            document.URL.replace(/\/(?!.*\/).*/, '/').replace('#/./', '') + href;
        }
        attrs.push(href.indexOf('mailto:') === 0 ? '' : ("target=\"" + linkTarget + "\""));
        attrs.push(
          href.indexOf('mailto:') === 0
            ? ''
            : linkRel !== ''
            ? (" rel=\"" + linkRel + "\"")
            : ''
        );
      }

      // special case to check crossorigin urls
      if (
        config.crossorgin &&
        linkTarget === '_self' &&
        compilerClass.config.routerMode === 'history'
      ) {
        if (compilerClass.config.crossOriginLinks.indexOf(href) === -1) {
          compilerClass.config.crossOriginLinks.push(href);
        }
      }

      if (config.disabled) {
        attrs.push('disabled');
        href = 'javascript:void(0)';
      }

      if (config.class) {
        attrs.push(("class=\"" + (config.class) + "\""));
      }

      if (config.id) {
        attrs.push(("id=\"" + (config.id) + "\""));
      }

      if (title) {
        attrs.push(("title=\"" + title + "\""));
      }

      return ("<a href=\"" + href + "\" " + (attrs.join(' ')) + ">" + text + "</a>");
    });
  };

  var cachedLinks = {};

  var compileMedia = {
    markdown: function markdown(url) {
      return {
        url: url,
      };
    },
    mermaid: function mermaid(url) {
      return {
        url: url,
      };
    },
    iframe: function iframe(url, title) {
      return {
        html: ("<iframe src=\"" + url + "\" " + (title ||
          'width=100% height=400') + "></iframe>"),
      };
    },
    video: function video(url, title) {
      return {
        html: ("<video src=\"" + url + "\" " + (title || 'controls') + ">Not Support</video>"),
      };
    },
    audio: function audio(url, title) {
      return {
        html: ("<audio src=\"" + url + "\" " + (title || 'controls') + ">Not Support</audio>"),
      };
    },
    code: function code(url, title) {
      var lang = url.match(/\.(\w+)$/);

      lang = title || (lang && lang[1]);
      if (lang === 'md') {
        lang = 'markdown';
      }

      return {
        url: url,
        lang: lang,
      };
    },
  };

  var Compiler = function Compiler(config, router) {
    var this$1 = this;

    this.config = config;
    this.router = router;
    this.cacheTree = {};
    this.toc = [];
    this.cacheTOC = {};
    this.linkTarget = config.externalLinkTarget || '_blank';
    this.linkRel =
      this.linkTarget === '_blank' ? config.externalLinkRel || 'noopener' : '';
    this.contentBase = router.getBasePath();

    var renderer = this._initRenderer();
    this.heading = renderer.heading;
    var compile;
    var mdConf = config.markdown || {};

    if (isFn(mdConf)) {
      compile = mdConf(marked, renderer);
    } else {
      marked.setOptions(
        merge(mdConf, {
          renderer: merge(renderer, mdConf.renderer),
        })
      );
      compile = marked;
    }

    this._marked = compile;
    this.compile = function (text) {
      var isCached = true;
      // eslint-disable-next-line no-unused-vars
      var result = cached(function (_) {
        isCached = false;
        var html = '';

        if (!text) {
          return text;
        }

        if (isPrimitive(text)) {
          html = compile(text);
        } else {
          html = compile.parser(text);
        }

        html = config.noEmoji ? html : emojify(html);
        slugify.clear();

        return html;
      })(text);

      var curFileName = this$1.router.parse().file;

      if (isCached) {
        this$1.toc = this$1.cacheTOC[curFileName];
      } else {
        this$1.cacheTOC[curFileName] = [].concat( this$1.toc );
      }

      return result;
    };
  };

  /**
   * Pulls content from file and renders inline on the page as a embedded item.
   *
   * This allows you to embed different file types on the returned
   * page.
   * The basic format is:
   * ```
   * [filename](_media/example.md ':include')
   * ```
   *
   * @param {string} href The href to the file to embed in the page.
   * @param {string} titleTitle of the link used to make the embed.
   *
   * @return {type} Return value description.
   */
  Compiler.prototype.compileEmbed = function compileEmbed (href, title) {
    var ref = getAndRemoveConfig(title);
      var str = ref.str;
      var config = ref.config;
    var embed;
    title = str;

    if (config.include) {
      if (!isAbsolutePath(href)) {
        href = getPath(
           this.contentBase,
          getParentPath(this.router.getCurrentPath()),
          href
        );
      }

      var media;
      if (config.type && (media = compileMedia[config.type])) {
        embed = media.call(this, href, title);
        embed.type = config.type;
      } else {
        var type = 'code';
        if (/\.(md|markdown)/.test(href)) {
          type = 'markdown';
        } else if (/\.mmd/.test(href)) {
          type = 'mermaid';
        } else if (/\.html?/.test(href)) {
          type = 'iframe';
        } else if (/\.(mp4|ogg)/.test(href)) {
          type = 'video';
        } else if (/\.mp3/.test(href)) {
          type = 'audio';
        }

        embed = compileMedia[type].call(this, href, title);
        embed.type = type;
      }

      embed.fragment = config.fragment;

      return embed;
    }
  };

  Compiler.prototype._matchNotCompileLink = function _matchNotCompileLink (link) {
    var links = this.config.noCompileLinks || [];

    for (var i = 0; i < links.length; i++) {
      var n = links[i];
      var re = cachedLinks[n] || (cachedLinks[n] = new RegExp(("^" + n + "$")));

      if (re.test(link)) {
        return link;
      }
    }
  };

  Compiler.prototype._initRenderer = function _initRenderer () {
    var renderer = new marked.Renderer();
    var ref = this;
      var linkTarget = ref.linkTarget;
      var linkRel = ref.linkRel;
      var router = ref.router;
      var contentBase = ref.contentBase;
    var _self = this;
    var origin = {};

    /**
     * Render anchor tag
     * @link https://github.com/markedjs/marked#overriding-renderer-methods
     * @param {String} text Text content
     * @param {Number} level Type of heading (h<level> tag)
     * @returns {String} Heading element
     */
    origin.heading = renderer.heading = function(text, level) {
      var ref = getAndRemoveConfig(text);
        var str = ref.str;
        var config = ref.config;
      var nextToc = { level: level, title: str };

      if (/{docsify-ignore}/g.test(str)) {
        str = str.replace('{docsify-ignore}', '');
        nextToc.title = str;
        nextToc.ignoreSubHeading = true;
      }

      if (/{docsify-ignore-all}/g.test(str)) {
        str = str.replace('{docsify-ignore-all}', '');
        nextToc.title = str;
        nextToc.ignoreAllSubs = true;
      }

      var slug = slugify(config.id || str);
      var url = router.toURL(router.getCurrentPath(), { id: slug });
      nextToc.slug = url;
      _self.toc.push(nextToc);

      return ("<h" + level + " id=\"" + slug + "\"><a href=\"" + url + "\" data-id=\"" + slug + "\" class=\"anchor\"><span>" + str + "</span></a></h" + level + ">");
    };

    origin.code = highlightCodeCompiler({ renderer: renderer });
    origin.link = linkCompiler({
      renderer: renderer,
      router: router,
      linkTarget: linkTarget,
      linkRel: linkRel,
      compilerClass: _self,
    });
    origin.paragraph = paragraphCompiler({ renderer: renderer });
    origin.image = imageCompiler({ renderer: renderer, contentBase: contentBase, router: router });
    origin.list = taskListCompiler({ renderer: renderer });
    origin.listitem = taskListItemCompiler({ renderer: renderer });

    renderer.origin = origin;

    return renderer;
  };

  /**
   * Compile sidebar
   * @param {String} text Text content
   * @param {Number} level Type of heading (h<level> tag)
   * @returns {String} Sidebar element
   */
  Compiler.prototype.sidebar = function sidebar (text, level) {
    var ref = this;
      var toc = ref.toc;
    var currentPath = this.router.getCurrentPath();
    var html = '';

    if (text) {
      html = this.compile(text);
    } else {
      for (var i = 0; i < toc.length; i++) {
        if (toc[i].ignoreSubHeading) {
          var deletedHeaderLevel = toc[i].level;
          toc.splice(i, 1);
          // Remove headers who are under current header
          for (
            var j = i;
            deletedHeaderLevel < toc[j].level && j < toc.length;
            j++
          ) {
            toc.splice(j, 1) && j-- && i++;
          }

          i--;
        }
      }

      var tree$1 = this.cacheTree[currentPath] || genTree(toc, level);
      html = tree(tree$1, '<ul>{inner}</ul>');
      this.cacheTree[currentPath] = tree$1;
    }

    return html;
  };

  /**
   * Compile sub sidebar
   * @param {Number} level Type of heading (h<level> tag)
   * @returns {String} Sub-sidebar element
   */
  Compiler.prototype.subSidebar = function subSidebar (level) {
    if (!level) {
      this.toc = [];
      return;
    }

    var currentPath = this.router.getCurrentPath();
    var ref = this;
      var cacheTree = ref.cacheTree;
      var toc = ref.toc;

    toc[0] && toc[0].ignoreAllSubs && toc.splice(0);
    toc[0] && toc[0].level === 1 && toc.shift();

    for (var i = 0; i < toc.length; i++) {
      toc[i].ignoreSubHeading && toc.splice(i, 1) && i--;
    }

    var tree$1 = cacheTree[currentPath] || genTree(toc, level);

    cacheTree[currentPath] = tree$1;
    this.toc = [];
    return tree(tree$1);
  };

  Compiler.prototype.header = function header (text, level) {
    return this.heading(text, level);
  };

  Compiler.prototype.article = function article (text) {
    return this.compile(text);
  };

  /**
   * Compile cover page
   * @param {Text} text Text content
   * @returns {String} Cover page
   */
  Compiler.prototype.cover = function cover (text) {
    var cacheToc = this.toc.slice();
    var html = this.compile(text);

    this.toc = cacheToc.slice();

    return html;
  };

  var minIndent = function (str) {
  	var match = str.match(/^[ \t]*(?=\S)/gm);

  	if (!match) {
  		return 0;
  	}

  	// TODO: Use spread operator when targeting Node.js 6
  	return Math.min.apply(Math, match.map(function (x) { return x.length; }));
  };

  var stripIndent = function (string) {
  	var indent = minIndent(string);

  	if (indent === 0) {
  		return string;
  	}

  	var regex = new RegExp(("^[ \\t]{" + indent + "}"), 'gm');

  	return string.replace(regex, '');
  };

  var cached$1 = {};

  function walkFetchEmbed(ref, cb) {
    var embedTokens = ref.embedTokens;
    var compile = ref.compile;
    var fetch = ref.fetch;

    var token;
    var step = 0;
    var count = 1;

    if (!embedTokens.length) {
      return cb({});
    }

    while ((token = embedTokens[step++])) {
      var next = (function(token) {
        return function (text) {
          var embedToken;
          if (text) {
            if (token.embed.type === 'markdown') {
              var path = token.embed.url.split('/');
              path.pop();
              path = path.join('/');
              // Resolves relative links to absolute
              text = text.replace(/\[([^[\]]+)\]\(([^)]+)\)/g, function (x) {
                var linkBeginIndex = x.indexOf('(');
                if (x.substring(linkBeginIndex).startsWith('(.')) {
                  return (
                    x.substring(0, linkBeginIndex) +
                    "(" + (window.location.protocol) + "//" + (window.location.host) + path + "/" +
                    x.substring(linkBeginIndex + 1, x.length - 1) +
                    ')'
                  );
                }
                return x;
              });

              // This may contain YAML front matter and will need to be stripped.
              var frontMatterInstalled =
                ($docsify.frontMatter || {}).installed || false;
              if (frontMatterInstalled === true) {
                text = $docsify.frontMatter.parseMarkdown(text);
              }

              embedToken = compile.lexer(text);
            } else if (token.embed.type === 'code') {
              if (token.embed.fragment) {
                var fragment = token.embed.fragment;
                var pattern = new RegExp(
                  ("(?:###|\\/\\/\\/)\\s*\\[" + fragment + "\\]([\\s\\S]*)(?:###|\\/\\/\\/)\\s*\\[" + fragment + "\\]")
                );
                text = stripIndent((text.match(pattern) || [])[1] || '').trim();
              }

              embedToken = compile.lexer(
                '```' +
                  token.embed.lang +
                  '\n' +
                  text.replace(/`/g, '@DOCSIFY_QM@') +
                  '\n```\n'
              );
            } else if (token.embed.type === 'mermaid') {
              embedToken = [
                { type: 'html', text: ("<div class=\"mermaid\">\n" + text + "\n</div>") } ];
              embedToken.links = {};
            } else {
              embedToken = [{ type: 'html', text: text }];
              embedToken.links = {};
            }
          }

          cb({ token: token, embedToken: embedToken });
          if (++count >= step) {
            cb({});
          }
        };
      })(token);

      if (token.embed.url) {
        {
          get(token.embed.url).then(next);
        }
      } else {
        next(token.embed.html);
      }
    }
  }

  function prerenderEmbed(ref, done) {
    var compiler = ref.compiler;
    var raw = ref.raw; if ( raw === void 0 ) raw = '';
    var fetch = ref.fetch;

    var hit = cached$1[raw];
    if (hit) {
      var copy = hit.slice();
      copy.links = hit.links;
      return done(copy);
    }

    var compile = compiler._marked;
    var tokens = compile.lexer(raw);
    var embedTokens = [];
    var linkRE = compile.InlineLexer.rules.link;
    var links = tokens.links;

    tokens.forEach(function (token, index) {
      if (token.type === 'paragraph') {
        token.text = token.text.replace(
          new RegExp(linkRE.source, 'g'),
          function (src, filename, href, title) {
            var embed = compiler.compileEmbed(href, title);

            if (embed) {
              embedTokens.push({
                index: index,
                embed: embed,
              });
            }

            return src;
          }
        );
      }
    });

    // keep track of which tokens have been embedded so far
    // so that we know where to insert the embedded tokens as they
    // are returned
    var moves = [];
    walkFetchEmbed({ compile: compile, embedTokens: embedTokens, fetch: fetch }, function (ref) {
      var embedToken = ref.embedToken;
      var token = ref.token;

      if (token) {
        // iterate through the array of previously inserted tokens
        // to determine where the current embedded tokens should be inserted
        var index = token.index;
        moves.forEach(function (pos) {
          if (index > pos.start) {
            index += pos.length;
          }
        });

        merge(links, embedToken.links);

        tokens = tokens
          .slice(0, index)
          .concat(embedToken, tokens.slice(index + 1));
        moves.push({ start: index, length: embedToken.length - 1 });
      } else {
        cached$1[raw] = tokens.concat();
        tokens.links = cached$1[raw].links = links;
        done(tokens);
      }
    });
  }

  /* eslint-disable no-unused-vars */

  function executeScript() {
    var script = findAll('.markdown-section>script')
      .filter(function (s) { return !/template/.test(s.type); })[0];
    if (!script) {
      return false;
    }

    var code = script.innerText.trim();
    if (!code) {
      return false;
    }

    setTimeout(function (_) {
      window.__EXECUTE_RESULT__ = new Function(code)();
    }, 0);
  }

  function formatUpdated(html, updated, fn) {
    updated =
      typeof fn === 'function'
        ? fn(updated)
        : typeof fn === 'string'
        ? tinydate(fn)(new Date(updated))
        : updated;

    return html.replace(/{docsify-updated}/g, updated);
  }

  function renderMain(html) {
    if (!html) {
      html = '<h1>404 - Not found</h1>';
    }

    this._renderTo('.markdown-section', html);
    // Render sidebar with the TOC
    !this.config.loadSidebar && this._renderSidebar();

    // Execute script
    if (
      this.config.executeScript !== false &&
      typeof window.Vue !== 'undefined' &&
      !executeScript()
    ) {
      setTimeout(function (_) {
        var vueVM = window.__EXECUTE_RESULT__;
        vueVM && vueVM.$destroy && vueVM.$destroy();
        window.__EXECUTE_RESULT__ = new window.Vue().$mount('#main');
      }, 0);
    } else {
      this.config.executeScript && executeScript();
    }
  }

  function renderNameLink(vm) {
    var el = getNode('.app-name-link');
    var nameLink = vm.config.nameLink;
    var path = vm.route.path;

    if (!el) {
      return;
    }

    if (isPrimitive(vm.config.nameLink)) {
      el.setAttribute('href', nameLink);
    } else if (typeof nameLink === 'object') {
      var match = Object.keys(nameLink).filter(
        function (key) { return path.indexOf(key) > -1; }
      )[0];

      el.setAttribute('href', nameLink[match]);
    }
  }

  function renderMixin(proto) {
    proto._renderTo = function(el, content, replace) {
      var node = getNode(el);
      if (node) {
        node[replace ? 'outerHTML' : 'innerHTML'] = content;
      }
    };

    proto._renderSidebar = function(text) {
      var ref = this.config;
      var maxLevel = ref.maxLevel;
      var subMaxLevel = ref.subMaxLevel;
      var loadSidebar = ref.loadSidebar;
      var hideSidebar = ref.hideSidebar;

      if (hideSidebar) {
        // FIXME : better styling solution
        document.querySelector('aside.sidebar').remove();
        document.querySelector('button.sidebar-toggle').remove();
        document.querySelector('section.content').style.right = 'unset';
        document.querySelector('section.content').style.left = 'unset';
        document.querySelector('section.content').style.position = 'relative';
        document.querySelector('section.content').style.width = '100%';
        return null;
      }

      this._renderTo('.sidebar-nav', this.compiler.sidebar(text, maxLevel));
      var activeEl = getAndActive(this.router, '.sidebar-nav', true, true);
      if (loadSidebar && activeEl) {
        activeEl.parentNode.innerHTML +=
          this.compiler.subSidebar(subMaxLevel) || '';
      } else {
        // Reset toc
        this.compiler.subSidebar();
      }

      // Bind event
      this._bindEventOnRendered(activeEl);
    };

    proto._bindEventOnRendered = function(activeEl) {
      var ref = this.config;
      var autoHeader = ref.autoHeader;

      scrollActiveSidebar(this.router);

      if (autoHeader && activeEl) {
        var main = getNode('#main');
        var firstNode = main.children[0];
        if (firstNode && firstNode.tagName !== 'H1') {
          var h1 = this.compiler.header(activeEl.innerText, 1);
          var wrapper = create('div', h1);
          before(main, wrapper.children[0]);
        }
      }
    };

    proto._renderNav = function(text) {
      text && this._renderTo('nav', this.compiler.compile(text));
      if (this.config.loadNavbar) {
        getAndActive(this.router, 'nav');
      }
    };

    proto._renderMain = function(text, opt, next) {
      var this$1 = this;
      if ( opt === void 0 ) opt = {};

      if (!text) {
        return renderMain.call(this, text);
      }

      callHook(this, 'beforeEach', text, function (result) {
        var html;
        var callback = function () {
          if (opt.updatedAt) {
            html = formatUpdated(html, opt.updatedAt, this$1.config.formatUpdated);
          }

          callHook(this$1, 'afterEach', html, function (text) { return renderMain.call(this$1, text); });
        };

        if (this$1.isHTML) {
          html = this$1.result = text;
          callback();
          next();
        } else {
          prerenderEmbed(
            {
              compiler: this$1.compiler,
              raw: result,
            },
            function (tokens) {
              html = this$1.compiler.compile(tokens);
              html = this$1.isRemoteUrl ? purify.sanitize(html) : html;
              callback();
              next();
            }
          );
        }
      });
    };

    proto._renderCover = function(text, coverOnly) {
      var el = getNode('.cover');

      toggleClass(
        getNode('main'),
        coverOnly ? 'add' : 'remove',
        'hidden'
      );
      if (!text) {
        toggleClass(el, 'remove', 'show');
        return;
      }

      toggleClass(el, 'add', 'show');

      var html = this.coverIsHTML ? text : this.compiler.cover(text);

      var m = html
        .trim()
        .match('<p><img.*?data-origin="(.*?)"[^a]+alt="(.*?)">([^<]*?)</p>$');

      if (m) {
        if (m[2] === 'color') {
          el.style.background = m[1] + (m[3] || '');
        } else {
          var path = m[1];

          toggleClass(el, 'add', 'has-mask');
          if (!isAbsolutePath(m[1])) {
            path = getPath(this.router.getBasePath(), m[1]);
          }

          el.style.backgroundImage = "url(" + path + ")";
          el.style.backgroundSize = 'cover';
          el.style.backgroundPosition = 'center center';
        }

        html = html.replace(m[0], '');
      }

      this._renderTo('.cover-main', html);
      sticky();
    };

    proto._updateRender = function() {
      // Render name link
      renderNameLink(this);
    };
  }

  function initRender(vm) {
    var config = vm.config;

    // Init markdown compiler
    vm.compiler = new Compiler(config, vm.router);
    {
      window.__current_docsify_compiler__ = vm.compiler;
    }

    var id = config.el || '#app';
    var navEl = find('nav') || create('nav');

    var el = find(id);
    var html = '';
    var navAppendToTarget = body;

    if (el) {
      if (config.repo) {
        html += corner(config.repo, config.cornerExternalLinkTarge);
      }

      if (config.coverpage) {
        html += cover();
      }

      if (config.logo) {
        var isBase64 = /^data:image/.test(config.logo);
        var isExternal = /(?:http[s]?:)?\/\//.test(config.logo);
        var isRelative = /^\./.test(config.logo);

        if (!isBase64 && !isExternal && !isRelative) {
          config.logo = getPath(vm.router.getBasePath(), config.logo);
        }
      }

      html += main(config);
      // Render main app
      vm._renderTo(el, html, true);
    } else {
      vm.rendered = true;
    }

    if (config.mergeNavbar && isMobile) {
      navAppendToTarget = find('.sidebar');
    } else {
      navEl.classList.add('app-nav');

      if (!config.repo) {
        navEl.classList.add('no-badge');
      }
    }

    // Add nav
    if (config.loadNavbar) {
      before(navAppendToTarget, navEl);
    }

    if (config.themeColor) {
      $.head.appendChild(
        create('div', theme(config.themeColor)).firstElementChild
      );
      // Polyfll
      cssVars(config.themeColor);
    }

    vm._updateRender();
    toggleClass(body, 'ready');
  }

  var cached$2 = {};

  function getAlias(path, alias, last) {
    var match = Object.keys(alias).filter(function (key) {
      var re = cached$2[key] || (cached$2[key] = new RegExp(("^" + key + "$")));
      return re.test(path) && path !== last;
    })[0];

    return match
      ? getAlias(path.replace(cached$2[match], alias[match]), alias, path)
      : path;
  }

  function getFileName(path, ext) {
    return new RegExp(("\\.(" + (ext.replace(/^\./, '')) + "|html)$"), 'g').test(path)
      ? path
      : /\/$/g.test(path)
      ? (path + "README" + ext)
      : ("" + path + ext);
  }

  var History = function History(config) {
    this.config = config;
  };

  History.prototype.getBasePath = function getBasePath () {
    return this.config.basePath;
  };

  History.prototype.getFile = function getFile (path, isRelative) {
      if ( path === void 0 ) path = this.getCurrentPath();

    var ref = this;
      var config = ref.config;
    var base = this.getBasePath();
    var ext = typeof config.ext === 'string' ? config.ext : '.md';

    path = config.alias ? getAlias(path, config.alias) : path;
    path = getFileName(path, ext);
    path = path === ("/README" + ext) ? config.homepage || path : path;
    path = isAbsolutePath(path) ? path : getPath(base, path);

    if (isRelative) {
      path = path.replace(new RegExp(("^" + base)), '');
    }

    return path;
  };

  History.prototype.onchange = function onchange (cb) {
      if ( cb === void 0 ) cb = noop;

    cb();
  };

  History.prototype.getCurrentPath = function getCurrentPath () {};

  History.prototype.normalize = function normalize () {};

  History.prototype.parse = function parse () {};

  History.prototype.toURL = function toURL (path, params, currentRoute) {
    var local = currentRoute && path[0] === '#';
    var route = this.parse(replaceSlug(path));

    route.query = merge({}, route.query, params);
    path = route.path + stringifyQuery(route.query);
    path = path.replace(/\.md(\?)|\.md$/, '$1');

    if (local) {
      var idIndex = currentRoute.indexOf('?');
      path =
        (idIndex > 0 ? currentRoute.substring(0, idIndex) : currentRoute) +
        path;
    }

    if (this.config.relativePath && path.indexOf('/') !== 0) {
      var currentDir = currentRoute.substring(
        0,
        currentRoute.lastIndexOf('/') + 1
      );
      return cleanPath(resolvePath(currentDir + path));
    }

    return cleanPath('/' + path);
  };

  function replaceHash(path) {
    var i = location.href.indexOf('#');
    location.replace(location.href.slice(0, i >= 0 ? i : 0) + '#' + path);
  }

  var HashHistory = /*@__PURE__*/(function (History) {
    function HashHistory(config) {
      History.call(this, config);
      this.mode = 'hash';
    }

    if ( History ) HashHistory.__proto__ = History;
    HashHistory.prototype = Object.create( History && History.prototype );
    HashHistory.prototype.constructor = HashHistory;

    HashHistory.prototype.getBasePath = function getBasePath () {
      var path = window.location.pathname || '';
      var base = this.config.basePath;

      return /^(\/|https?:)/g.test(base) ? base : cleanPath(path + '/' + base);
    };

    HashHistory.prototype.getCurrentPath = function getCurrentPath () {
      // We can't use location.hash here because it's not
      // consistent across browsers - Firefox will pre-decode it!
      var href = location.href;
      var index = href.indexOf('#');
      return index === -1 ? '' : href.slice(index + 1);
    };

    HashHistory.prototype.onchange = function onchange (cb) {
      if ( cb === void 0 ) cb = noop;

      // The hashchange event does not tell us if it originated from
      // a clicked link or by moving back/forward in the history;
      // therefore we set a `navigating` flag when a link is clicked
      // to be able to tell these two scenarios apart
      var navigating = false;

      on('click', function (e) {
        var el = e.target.tagName === 'A' ? e.target : e.target.parentNode;

        if (el.tagName === 'A' && !/_blank/.test(el.target)) {
          navigating = true;
        }
      });

      on('hashchange', function (e) {
        var source = navigating ? 'navigate' : 'history';
        navigating = false;
        cb({ event: e, source: source });
      });
    };

    HashHistory.prototype.normalize = function normalize () {
      var path = this.getCurrentPath();

      path = replaceSlug(path);

      if (path.charAt(0) === '/') {
        return replaceHash(path);
      }

      replaceHash('/' + path);
    };

    /**
     * Parse the url
     * @param {string} [path=location.herf] URL to be parsed
     * @return {object} { path, query }
     */
    HashHistory.prototype.parse = function parse (path) {
      if ( path === void 0 ) path = location.href;

      var query = '';

      var hashIndex = path.indexOf('#');
      if (hashIndex >= 0) {
        path = path.slice(hashIndex + 1);
      }

      var queryIndex = path.indexOf('?');
      if (queryIndex >= 0) {
        query = path.slice(queryIndex + 1);
        path = path.slice(0, queryIndex);
      }

      return {
        path: path,
        file: this.getFile(path, true),
        query: parseQuery(query),
      };
    };

    HashHistory.prototype.toURL = function toURL (path, params, currentRoute) {
      return '#' + History.prototype.toURL.call(this, path, params, currentRoute);
    };

    return HashHistory;
  }(History));

  var HTML5History = /*@__PURE__*/(function (History) {
    function HTML5History(config) {
      History.call(this, config);
      this.mode = 'history';
    }

    if ( History ) HTML5History.__proto__ = History;
    HTML5History.prototype = Object.create( History && History.prototype );
    HTML5History.prototype.constructor = HTML5History;

    HTML5History.prototype.getCurrentPath = function getCurrentPath () {
      var base = this.getBasePath();
      var path = window.location.pathname;

      if (base && path.indexOf(base) === 0) {
        path = path.slice(base.length);
      }

      return (path || '/') + window.location.search + window.location.hash;
    };

    HTML5History.prototype.onchange = function onchange (cb) {
      var this$1 = this;
      if ( cb === void 0 ) cb = noop;

      on('click', function (e) {
        var el = e.target.tagName === 'A' ? e.target : e.target.parentNode;

        if (el.tagName === 'A' && !/_blank/.test(el.target)) {
          e.preventDefault();
          var url = el.href;
          // solve history.pushState cross-origin issue
          if (this$1.config.crossOriginLinks.indexOf(url) !== -1) {
            window.open(url, '_self');
          } else {
            window.history.pushState({ key: url }, '', url);
          }
          cb({ event: e, source: 'navigate' });
        }
      });

      on('popstate', function (e) {
        cb({ event: e, source: 'history' });
      });
    };

    /**
     * Parse the url
     * @param {string} [path=location.href] URL to be parsed
     * @return {object} { path, query }
     */
    HTML5History.prototype.parse = function parse (path) {
      if ( path === void 0 ) path = location.href;

      var query = '';

      var queryIndex = path.indexOf('?');
      if (queryIndex >= 0) {
        query = path.slice(queryIndex + 1);
        path = path.slice(0, queryIndex);
      }

      var base = getPath(location.origin);
      var baseIndex = path.indexOf(base);

      if (baseIndex > -1) {
        path = path.slice(baseIndex + base.length);
      }

      return {
        path: path,
        file: this.getFile(path),
        query: parseQuery(query),
      };
    };

    return HTML5History;
  }(History));

  function routerMixin(proto) {
    proto.route = {};
  }

  var lastRoute = {};

  function updateRender(vm) {
    vm.router.normalize();
    vm.route = vm.router.parse();
    body.setAttribute('data-page', vm.route.file);
  }

  function initRouter(vm) {
    var config = vm.config;
    var mode = config.routerMode || 'hash';
    var router;

    if (mode === 'history' && supportsPushState) {
      router = new HTML5History(config);
    } else {
      router = new HashHistory(config);
    }

    vm.router = router;
    updateRender(vm);
    lastRoute = vm.route;

    // eslint-disable-next-line no-unused-vars
    router.onchange(function (params) {
      updateRender(vm);
      vm._updateRender();

      if (lastRoute.path === vm.route.path) {
        vm.$resetEvents(params.source);
        return;
      }

      vm.$fetch(noop, vm.$resetEvents.bind(vm, params.source));
      lastRoute = vm.route;
    });
  }

  function eventMixin(proto) {
    proto.$resetEvents = function(source) {
      var this$1 = this;

      var ref = this.config;
      var auto2top = ref.auto2top;

      (function () {
        // Rely on the browser's scroll auto-restoration when going back or forward
        if (source === 'history') {
          return;
        }
        // Scroll to ID if specified
        if (this$1.route.query.id) {
          scrollIntoView(this$1.route.path, this$1.route.query.id);
        }
        // Scroll to top if a link was clicked and auto2top is enabled
        if (source === 'navigate') {
          auto2top && scroll2Top(auto2top);
        }
      })();

      if (this.config.loadNavbar) {
        getAndActive(this.router, 'nav');
      }
    };
  }

  function initEvent(vm) {
    // Bind toggle button
    btn('button.sidebar-toggle', vm.router);
    collapse('.sidebar', vm.router);
    // Bind sticky effect
    if (vm.config.coverpage) {
      !isMobile && on('scroll', sticky);
    } else {
      body.classList.add('sticky');
    }
  }

  /* eslint-disable no-unused-vars */

  function loadNested(path, qs, file, next, vm, first) {
    path = first ? path : path.replace(/\/$/, '');
    path = getParentPath(path);

    if (!path) {
      return;
    }

    get(
      vm.router.getFile(path + file) + qs,
      false,
      vm.config.requestHeaders
    ).then(next, function (_) { return loadNested(path, qs, file, next, vm); });
  }

  function isExternal(url) {
    var match = url.match(
      /^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/
    );
    if (
      typeof match[1] === 'string' &&
      match[1].length > 0 &&
      match[1].toLowerCase() !== location.protocol
    ) {
      return true;
    }
    if (
      typeof match[2] === 'string' &&
      match[2].length > 0 &&
      match[2].replace(
        new RegExp(
          ':(' + { 'http:': 80, 'https:': 443 }[location.protocol] + ')?$'
        ),
        ''
      ) !== location.host
    ) {
      return true;
    }
    return false;
  }

  function fetchMixin(proto) {
    var last;

    var abort = function () { return last && last.abort && last.abort(); };
    var request = function (url, hasbar, requestHeaders) {
      abort();
      last = get(url, true, requestHeaders);
      return last;
    };

    var get404Path = function (path, config) {
      var notFoundPage = config.notFoundPage;
      var ext = config.ext;
      var defaultPath = '_404' + (ext || '.md');
      var key;
      var path404;

      switch (typeof notFoundPage) {
        case 'boolean':
          path404 = defaultPath;
          break;
        case 'string':
          path404 = notFoundPage;
          break;

        case 'object':
          key = Object.keys(notFoundPage)
            .sort(function (a, b) { return b.length - a.length; })
            .find(function (key) { return path.match(new RegExp('^' + key)); });

          path404 = (key && notFoundPage[key]) || defaultPath;
          break;

        default:
          break;
      }

      return path404;
    };

    proto._loadSideAndNav = function(path, qs, loadSidebar, cb) {
      var this$1 = this;

      return function () {
        if (!loadSidebar) {
          return cb();
        }

        var fn = function (result) {
          this$1._renderSidebar(result);
          cb();
        };

        // Load sidebar
        loadNested(path, qs, loadSidebar, fn, this$1, true);
      };
    };

    proto._fetch = function(cb) {
      var this$1 = this;
      if ( cb === void 0 ) cb = noop;

      var ref = this.route;
      var path = ref.path;
      var query = ref.query;
      var qs = stringifyQuery(query, ['id']);
      var ref$1 = this.config;
      var loadNavbar = ref$1.loadNavbar;
      var requestHeaders = ref$1.requestHeaders;
      var loadSidebar = ref$1.loadSidebar;
      // Abort last request

      var file = this.router.getFile(path);
      var req = request(file + qs, true, requestHeaders);

      this.isRemoteUrl = isExternal(file);
      // Current page is html
      this.isHTML = /\.html$/g.test(file);

      // Load main content
      req.then(
        function (text, opt) { return this$1._renderMain(
            text,
            opt,
            this$1._loadSideAndNav(path, qs, loadSidebar, cb)
          ); },
        function (_) {
          this$1._fetchFallbackPage(file, qs, cb) || this$1._fetch404(file, qs, cb);
        }
      );

      // Load nav
      loadNavbar &&
        loadNested(
          path,
          qs,
          loadNavbar,
          function (text) { return this$1._renderNav(text); },
          this,
          true
        );
    };

    proto._fetchCover = function() {
      var this$1 = this;

      var ref = this.config;
      var coverpage = ref.coverpage;
      var requestHeaders = ref.requestHeaders;
      var query = this.route.query;
      var root = getParentPath(this.route.path);

      if (coverpage) {
        var path = null;
        var routePath = this.route.path;
        if (typeof coverpage === 'string') {
          if (routePath === '/') {
            path = coverpage;
          }
        } else if (Array.isArray(coverpage)) {
          path = coverpage.indexOf(routePath) > -1 && '_coverpage';
        } else {
          var cover = coverpage[routePath];
          path = cover === true ? '_coverpage' : cover;
        }

        var coverOnly = Boolean(path) && this.config.onlyCover;
        if (path) {
          path = this.router.getFile(root + path);
          this.coverIsHTML = /\.html$/g.test(path);
          get(
            path + stringifyQuery(query, ['id']),
            false,
            requestHeaders
          ).then(function (text) { return this$1._renderCover(text, coverOnly); });
        } else {
          this._renderCover(null, coverOnly);
        }

        return coverOnly;
      }
    };

    proto.$fetch = function(
      cb,
      $resetEvents
    ) {
      var this$1 = this;
      if ( cb === void 0 ) cb = noop;
      if ( $resetEvents === void 0 ) $resetEvents = this.$resetEvents.bind(this);

      var done = function () {
        callHook(this$1, 'doneEach');
        cb();
      };

      var onlyCover = this._fetchCover();

      if (onlyCover) {
        done();
      } else {
        this._fetch(function () {
          $resetEvents();
          done();
        });
      }
    };

    proto._fetchFallbackPage = function(path, qs, cb) {
      var this$1 = this;
      if ( cb === void 0 ) cb = noop;

      var ref = this.config;
      var requestHeaders = ref.requestHeaders;
      var fallbackLanguages = ref.fallbackLanguages;
      var loadSidebar = ref.loadSidebar;

      if (!fallbackLanguages) {
        return false;
      }

      var local = path.split('/')[1];

      if (fallbackLanguages.indexOf(local) === -1) {
        return false;
      }

      var newPath = path.replace(new RegExp(("^/" + local)), '');
      var req = request(newPath + qs, true, requestHeaders);

      req.then(
        function (text, opt) { return this$1._renderMain(
            text,
            opt,
            this$1._loadSideAndNav(path, qs, loadSidebar, cb)
          ); },
        function () { return this$1._fetch404(path, qs, cb); }
      );

      return true;
    };

    /**
     * Load the 404 page
     * @param {String} path URL to be loaded
     * @param {*} qs TODO: define
     * @param {Function} cb Callback
     * @returns {Boolean} True if the requested page is not found
     * @private
     */
    proto._fetch404 = function(path, qs, cb) {
      var this$1 = this;
      if ( cb === void 0 ) cb = noop;

      var ref = this.config;
      var loadSidebar = ref.loadSidebar;
      var requestHeaders = ref.requestHeaders;
      var notFoundPage = ref.notFoundPage;

      var fnLoadSideAndNav = this._loadSideAndNav(path, qs, loadSidebar, cb);
      if (notFoundPage) {
        var path404 = get404Path(path, this.config);

        request(this.router.getFile(path404), true, requestHeaders).then(
          function (text, opt) { return this$1._renderMain(text, opt, fnLoadSideAndNav); },
          function () { return this$1._renderMain(null, {}, fnLoadSideAndNav); }
        );
        return true;
      }

      this._renderMain(null, {}, fnLoadSideAndNav);
      return false;
    };
  }

  function initFetch(vm) {
    var ref = vm.config;
    var loadSidebar = ref.loadSidebar;

    // Server-Side Rendering
    if (vm.rendered) {
      var activeEl = getAndActive(vm.router, '.sidebar-nav', true, true);
      if (loadSidebar && activeEl) {
        activeEl.parentNode.innerHTML += window.__SUB_SIDEBAR__;
      }

      vm._bindEventOnRendered(activeEl);
      vm.$resetEvents();
      callHook(vm, 'doneEach');
      callHook(vm, 'ready');
    } else {
      vm.$fetch(function (_) { return callHook(vm, 'ready'); });
    }
  }

  function initMixin(proto) {
    proto._init = function() {
      var vm = this;
      vm.config = config(vm);

      initLifecycle(vm); // Init hooks
      initPlugin(vm); // Install plugins
      callHook(vm, 'init');
      initRouter(vm); // Add router
      initRender(vm); // Render base DOM
      initEvent(vm); // Bind events
      initFetch(vm); // Fetch data
      callHook(vm, 'mounted');
    };
  }

  function initPlugin(vm) {
    [].concat(vm.config.plugins).forEach(function (fn) { return isFn(fn) && fn(vm._lifecycle, vm); });
  }



  var util = /*#__PURE__*/Object.freeze({
    __proto__: null,
    cached: cached,
    hyphenate: hyphenate,
    hasOwn: hasOwn,
    merge: merge,
    isPrimitive: isPrimitive,
    noop: noop,
    isFn: isFn,
    inBrowser: inBrowser,
    isMobile: isMobile,
    supportsPushState: supportsPushState,
    parseQuery: parseQuery,
    stringifyQuery: stringifyQuery,
    isAbsolutePath: isAbsolutePath,
    removeParams: removeParams,
    getParentPath: getParentPath,
    cleanPath: cleanPath,
    resolvePath: resolvePath,
    getPath: getPath,
    replaceSlug: replaceSlug
  });

  // TODO This is deprecated, kept for backwards compatibility. Remove in next
  // major release. We'll tell people to get everything from the DOCSIFY global
  // when using the global build, but we'll highly recommend for them to import
  // from the ESM build (f.e. lib/docsify.esm.js and lib/docsify.min.esm.js).
  function initGlobalAPI() {
    window.Docsify = {
      util: util,
      dom: dom,
      get: get,
      slugify: slugify,
      version: '4.11.4',
    };
    window.DocsifyCompiler = Compiler;
    window.marked = marked;
    window.Prism = prism;
  }

  function Docsify() {
    this._init();
  }

  var proto = Docsify.prototype;

  initMixin(proto);
  routerMixin(proto);
  renderMixin(proto);
  fetchMixin(proto);
  eventMixin(proto);

  /**
   * Global API
   */
  initGlobalAPI();

  /**
   * Run Docsify
   */
  // eslint-disable-next-line no-unused-vars
  documentReady(function (_) { return new Docsify(); });

}());
