(function() {
  var root = this;
  var previousUnderscore = root._;
  var breaker = {};
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
  var push = ArrayProto.push, slice = ArrayProto.slice, concat = ArrayProto.concat, unshift = ArrayProto.unshift, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty;
  var nativeForEach = ArrayProto.forEach, nativeMap = ArrayProto.map, nativeReduce = ArrayProto.reduce, nativeReduceRight = ArrayProto.reduceRight, nativeFilter = ArrayProto.filter, nativeEvery = ArrayProto.every, nativeSome = ArrayProto.some, nativeIndexOf = ArrayProto.indexOf, nativeLastIndexOf = ArrayProto.lastIndexOf, nativeIsArray = Array.isArray, nativeKeys = Object.keys, nativeBind = FuncProto.bind;
  var _ = function(obj) {
    if(obj instanceof _) {
      return obj
    }
    if(!(this instanceof _)) {
      return new _(obj)
    }
    this._wrapped = obj
  };
  if(typeof exports !== "undefined") {
    if(typeof module !== "undefined" && module.exports) {
      exports = module.exports = _
    }
    exports._ = _
  }else {
    root["_"] = _
  }
  _.VERSION = "1.4.2";
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if(obj == null) {
      return
    }
    if(nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context)
    }else {
      if(obj.length === +obj.length) {
        for(var i = 0, l = obj.length;i < l;i++) {
          if(iterator.call(context, obj[i], i, obj) === breaker) {
            return
          }
        }
      }else {
        for(var key in obj) {
          if(_.has(obj, key)) {
            if(iterator.call(context, obj[key], key, obj) === breaker) {
              return
            }
          }
        }
      }
    }
  };
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if(obj == null) {
      return results
    }
    if(nativeMap && obj.map === nativeMap) {
      return obj.map(iterator, context)
    }
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list)
    });
    return results
  };
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if(obj == null) {
      obj = []
    }
    if(nativeReduce && obj.reduce === nativeReduce) {
      if(context) {
        iterator = _.bind(iterator, context)
      }
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator)
    }
    each(obj, function(value, index, list) {
      if(!initial) {
        memo = value;
        initial = true
      }else {
        memo = iterator.call(context, memo, value, index, list)
      }
    });
    if(!initial) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    return memo
  };
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if(obj == null) {
      obj = []
    }
    if(nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if(context) {
        iterator = _.bind(iterator, context)
      }
      return arguments.length > 2 ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator)
    }
    var length = obj.length;
    if(length !== +length) {
      var keys = _.keys(obj);
      length = keys.length
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if(!initial) {
        memo = obj[index];
        initial = true
      }else {
        memo = iterator.call(context, memo, obj[index], index, list)
      }
    });
    if(!initial) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    return memo
  };
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if(iterator.call(context, value, index, list)) {
        result = value;
        return true
      }
    });
    return result
  };
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if(obj == null) {
      return results
    }
    if(nativeFilter && obj.filter === nativeFilter) {
      return obj.filter(iterator, context)
    }
    each(obj, function(value, index, list) {
      if(iterator.call(context, value, index, list)) {
        results[results.length] = value
      }
    });
    return results
  };
  _.reject = function(obj, iterator, context) {
    var results = [];
    if(obj == null) {
      return results
    }
    each(obj, function(value, index, list) {
      if(!iterator.call(context, value, index, list)) {
        results[results.length] = value
      }
    });
    return results
  };
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if(obj == null) {
      return result
    }
    if(nativeEvery && obj.every === nativeEvery) {
      return obj.every(iterator, context)
    }
    each(obj, function(value, index, list) {
      if(!(result = result && iterator.call(context, value, index, list))) {
        return breaker
      }
    });
    return!!result
  };
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if(obj == null) {
      return result
    }
    if(nativeSome && obj.some === nativeSome) {
      return obj.some(iterator, context)
    }
    each(obj, function(value, index, list) {
      if(result || (result = iterator.call(context, value, index, list))) {
        return breaker
      }
    });
    return!!result
  };
  _.contains = _.include = function(obj, target) {
    var found = false;
    if(obj == null) {
      return found
    }
    if(nativeIndexOf && obj.indexOf === nativeIndexOf) {
      return obj.indexOf(target) != -1
    }
    found = any(obj, function(value) {
      return value === target
    });
    return found
  };
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return(_.isFunction(method) ? method : value[method]).apply(value, args)
    })
  };
  _.pluck = function(obj, key) {
    return _.map(obj, function(value) {
      return value[key]
    })
  };
  _.where = function(obj, attrs) {
    if(_.isEmpty(attrs)) {
      return[]
    }
    return _.filter(obj, function(value) {
      for(var key in attrs) {
        if(attrs[key] !== value[key]) {
          return false
        }
      }
      return true
    })
  };
  _.max = function(obj, iterator, context) {
    if(!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj)
    }
    if(!iterator && _.isEmpty(obj)) {
      return-Infinity
    }
    var result = {computed:-Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value:value, computed:computed})
    });
    return result.value
  };
  _.min = function(obj, iterator, context) {
    if(!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj)
    }
    if(!iterator && _.isEmpty(obj)) {
      return Infinity
    }
    var result = {computed:Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value:value, computed:computed})
    });
    return result.value
  };
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value
    });
    return shuffled
  };
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj) {
      return obj[value]
    }
  };
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return{value:value, index:index, criteria:iterator.call(context, value, index, list)}
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if(a !== b) {
        if(a > b || a === void 0) {
          return 1
        }
        if(a < b || b === void 0) {
          return-1
        }
      }
      return left.index < right.index ? -1 : 1
    }), "value")
  };
  var group = function(obj, value, context, behavior) {
    var result = {};
    var iterator = lookupIterator(value);
    each(obj, function(value, index) {
      var key = iterator.call(context, value, index, obj);
      behavior(result, key, value)
    });
    return result
  };
  _.groupBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      (_.has(result, key) ? result[key] : result[key] = []).push(value)
    })
  };
  _.countBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      if(!_.has(result, key)) {
        result[key] = 0
      }
      result[key]++
    })
  };
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while(low < high) {
      var mid = low + high >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid
    }
    return low
  };
  _.toArray = function(obj) {
    if(!obj) {
      return[]
    }
    if(obj.length === +obj.length) {
      return slice.call(obj)
    }
    return _.values(obj)
  };
  _.size = function(obj) {
    return obj.length === +obj.length ? obj.length : _.keys(obj).length
  };
  _.first = _.head = _.take = function(array, n, guard) {
    return n != null && !guard ? slice.call(array, 0, n) : array[0]
  };
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - (n == null || guard ? 1 : n))
  };
  _.last = function(array, n, guard) {
    if(n != null && !guard) {
      return slice.call(array, Math.max(array.length - n, 0))
    }else {
      return array[array.length - 1]
    }
  };
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n)
  };
  _.compact = function(array) {
    return _.filter(array, function(value) {
      return!!value
    })
  };
  var flatten = function(input, shallow, output) {
    each(input, function(value) {
      if(_.isArray(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output)
      }else {
        output.push(value)
      }
    });
    return output
  };
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, [])
  };
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1))
  };
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if(isSorted ? !index || seen[seen.length - 1] !== value : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index])
      }
    });
    return results
  };
  _.union = function() {
    return _.uniq(concat.apply(ArrayProto, arguments))
  };
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0
      })
    })
  };
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value) {
      return!_.contains(rest, value)
    })
  };
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, "length"));
    var results = new Array(length);
    for(var i = 0;i < length;i++) {
      results[i] = _.pluck(args, "" + i)
    }
    return results
  };
  _.object = function(list, values) {
    var result = {};
    for(var i = 0, l = list.length;i < l;i++) {
      if(values) {
        result[list[i]] = values[i]
      }else {
        result[list[i][0]] = list[i][1]
      }
    }
    return result
  };
  _.indexOf = function(array, item, isSorted) {
    if(array == null) {
      return-1
    }
    var i = 0, l = array.length;
    if(isSorted) {
      if(typeof isSorted == "number") {
        i = isSorted < 0 ? Math.max(0, l + isSorted) : isSorted
      }else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1
      }
    }
    if(nativeIndexOf && array.indexOf === nativeIndexOf) {
      return array.indexOf(item, isSorted)
    }
    for(;i < l;i++) {
      if(array[i] === item) {
        return i
      }
    }
    return-1
  };
  _.lastIndexOf = function(array, item, from) {
    if(array == null) {
      return-1
    }
    var hasIndex = from != null;
    if(nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item)
    }
    var i = hasIndex ? from : array.length;
    while(i--) {
      if(array[i] === item) {
        return i
      }
    }
    return-1
  };
  _.range = function(start, stop, step) {
    if(arguments.length <= 1) {
      stop = start || 0;
      start = 0
    }
    step = arguments[2] || 1;
    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);
    while(idx < len) {
      range[idx++] = start;
      start += step
    }
    return range
  };
  var ctor = function() {
  };
  _.bind = function bind(func, context) {
    var bound, args;
    if(func.bind === nativeBind && nativeBind) {
      return nativeBind.apply(func, slice.call(arguments, 1))
    }
    if(!_.isFunction(func)) {
      throw new TypeError;
    }
    args = slice.call(arguments, 2);
    return bound = function() {
      if(!(this instanceof bound)) {
        return func.apply(context, args.concat(slice.call(arguments)))
      }
      ctor.prototype = func.prototype;
      var self = new ctor;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if(Object(result) === result) {
        return result
      }
      return self
    }
  };
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if(funcs.length == 0) {
      funcs = _.functions(obj)
    }
    each(funcs, function(f) {
      obj[f] = _.bind(obj[f], obj)
    });
    return obj
  };
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : memo[key] = func.apply(this, arguments)
    }
  };
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function() {
      return func.apply(null, args)
    }, wait)
  };
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)))
  };
  _.throttle = function(func, wait) {
    var context, args, timeout, throttling, more, result;
    var whenDone = _.debounce(function() {
      more = throttling = false
    }, wait);
    return function() {
      context = this;
      args = arguments;
      var later = function() {
        timeout = null;
        if(more) {
          result = func.apply(context, args)
        }
        whenDone()
      };
      if(!timeout) {
        timeout = setTimeout(later, wait)
      }
      if(throttling) {
        more = true
      }else {
        throttling = true;
        result = func.apply(context, args)
      }
      whenDone();
      return result
    }
  };
  _.debounce = function(func, wait, immediate) {
    var timeout, result;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if(!immediate) {
          result = func.apply(context, args)
        }
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if(callNow) {
        result = func.apply(context, args)
      }
      return result
    }
  };
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if(ran) {
        return memo
      }
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo
    }
  };
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args)
    }
  };
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for(var i = funcs.length - 1;i >= 0;i--) {
        args = [funcs[i].apply(this, args)]
      }
      return args[0]
    }
  };
  _.after = function(times, func) {
    if(times <= 0) {
      return func()
    }
    return function() {
      if(--times < 1) {
        return func.apply(this, arguments)
      }
    }
  };
  _.keys = nativeKeys || function(obj) {
    if(obj !== Object(obj)) {
      throw new TypeError("Invalid object");
    }
    var keys = [];
    for(var key in obj) {
      if(_.has(obj, key)) {
        keys[keys.length] = key
      }
    }
    return keys
  };
  _.values = function(obj) {
    var values = [];
    for(var key in obj) {
      if(_.has(obj, key)) {
        values.push(obj[key])
      }
    }
    return values
  };
  _.pairs = function(obj) {
    var pairs = [];
    for(var key in obj) {
      if(_.has(obj, key)) {
        pairs.push([key, obj[key]])
      }
    }
    return pairs
  };
  _.invert = function(obj) {
    var result = {};
    for(var key in obj) {
      if(_.has(obj, key)) {
        result[obj[key]] = key
      }
    }
    return result
  };
  _.functions = _.methods = function(obj) {
    var names = [];
    for(var key in obj) {
      if(_.isFunction(obj[key])) {
        names.push(key)
      }
    }
    return names.sort()
  };
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for(var prop in source) {
        obj[prop] = source[prop]
      }
    });
    return obj
  };
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if(key in obj) {
        copy[key] = obj[key]
      }
    });
    return copy
  };
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for(var key in obj) {
      if(!_.contains(keys, key)) {
        copy[key] = obj[key]
      }
    }
    return copy
  };
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for(var prop in source) {
        if(obj[prop] == null) {
          obj[prop] = source[prop]
        }
      }
    });
    return obj
  };
  _.clone = function(obj) {
    if(!_.isObject(obj)) {
      return obj
    }
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj)
  };
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj
  };
  var eq = function(a, b, aStack, bStack) {
    if(a === b) {
      return a !== 0 || 1 / a == 1 / b
    }
    if(a == null || b == null) {
      return a === b
    }
    if(a instanceof _) {
      a = a._wrapped
    }
    if(b instanceof _) {
      b = b._wrapped
    }
    var className = toString.call(a);
    if(className != toString.call(b)) {
      return false
    }
    switch(className) {
      case "[object String]":
        return a == String(b);
      case "[object Number]":
        return a != +a ? b != +b : a == 0 ? 1 / a == 1 / b : a == +b;
      case "[object Date]":
      ;
      case "[object Boolean]":
        return+a == +b;
      case "[object RegExp]":
        return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase
    }
    if(typeof a != "object" || typeof b != "object") {
      return false
    }
    var length = aStack.length;
    while(length--) {
      if(aStack[length] == a) {
        return bStack[length] == b
      }
    }
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    if(className == "[object Array]") {
      size = a.length;
      result = size == b.length;
      if(result) {
        while(size--) {
          if(!(result = eq(a[size], b[size], aStack, bStack))) {
            break
          }
        }
      }
    }else {
      var aCtor = a.constructor, bCtor = b.constructor;
      if(aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor)) {
        return false
      }
      for(var key in a) {
        if(_.has(a, key)) {
          size++;
          if(!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) {
            break
          }
        }
      }
      if(result) {
        for(key in b) {
          if(_.has(b, key) && !size--) {
            break
          }
        }
        result = !size
      }
    }
    aStack.pop();
    bStack.pop();
    return result
  };
  _.isEqual = function(a, b) {
    return eq(a, b, [], [])
  };
  _.isEmpty = function(obj) {
    if(obj == null) {
      return true
    }
    if(_.isArray(obj) || _.isString(obj)) {
      return obj.length === 0
    }
    for(var key in obj) {
      if(_.has(obj, key)) {
        return false
      }
    }
    return true
  };
  _.isElement = function(obj) {
    return!!(obj && obj.nodeType === 1)
  };
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == "[object Array]"
  };
  _.isObject = function(obj) {
    return obj === Object(obj)
  };
  each(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function(name) {
    _["is" + name] = function(obj) {
      return toString.call(obj) == "[object " + name + "]"
    }
  });
  if(!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return!!(obj && _.has(obj, "callee"))
    }
  }
  if(typeof/./ !== "function") {
    _.isFunction = function(obj) {
      return typeof obj === "function"
    }
  }
  _.isFinite = function(obj) {
    return _.isNumber(obj) && isFinite(obj)
  };
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj
  };
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == "[object Boolean]"
  };
  _.isNull = function(obj) {
    return obj === null
  };
  _.isUndefined = function(obj) {
    return obj === void 0
  };
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key)
  };
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this
  };
  _.identity = function(value) {
    return value
  };
  _.times = function(n, iterator, context) {
    for(var i = 0;i < n;i++) {
      iterator.call(context, i)
    }
  };
  _.random = function(min, max) {
    if(max == null) {
      max = min;
      min = 0
    }
    return min + (0 | Math.random() * (max - min + 1))
  };
  var entityMap = {escape:{"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#x27;", "/":"&#x2F;"}};
  entityMap.unescape = _.invert(entityMap.escape);
  var entityRegexes = {escape:new RegExp("[" + _.keys(entityMap.escape).join("") + "]", "g"), unescape:new RegExp("(" + _.keys(entityMap.unescape).join("|") + ")", "g")};
  _.each(["escape", "unescape"], function(method) {
    _[method] = function(string) {
      if(string == null) {
        return""
      }
      return("" + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match]
      })
    }
  });
  _.result = function(object, property) {
    if(object == null) {
      return null
    }
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value
  };
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args))
      }
    })
  };
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id
  };
  _.templateSettings = {evaluate:/<%([\s\S]+?)%>/g, interpolate:/<%=([\s\S]+?)%>/g, escape:/<%-([\s\S]+?)%>/g};
  var noMatch = /(.)^/;
  var escapes = {"'":"'", "\\":"\\", "\r":"r", "\n":"n", "\t":"t", "\u2028":"u2028", "\u2029":"u2029"};
  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
  _.template = function(text, data, settings) {
    settings = _.defaults({}, settings, _.templateSettings);
    var matcher = new RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join("|") + "|$", "g");
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, function(match) {
        return"\\" + escapes[match]
      });
      source += escape ? "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'" : interpolate ? "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'" : evaluate ? "';\n" + evaluate + "\n__p+='" : "";
      index = offset + match.length
    });
    source += "';\n";
    if(!settings.variable) {
      source = "with(obj||{}){\n" + source + "}\n"
    }
    source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
    try {
      var render = new Function(settings.variable || "obj", "_", source)
    }catch(e) {
      e.source = source;
      throw e;
    }
    if(data) {
      return render(data, _)
    }
    var template = function(data) {
      return render.call(this, data, _)
    };
    template.source = "function(" + (settings.variable || "obj") + "){\n" + source + "}";
    return template
  };
  _.chain = function(obj) {
    return _(obj).chain()
  };
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj
  };
  _.mixin(_);
  each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if((name == "shift" || name == "splice") && obj.length === 0) {
        delete obj[0]
      }
      return result.call(this, obj)
    }
  });
  each(["concat", "join", "slice"], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments))
    }
  });
  _.extend(_.prototype, {chain:function() {
    this._chain = true;
    return this
  }, value:function() {
    return this._wrapped
  }})
}).call(this);
(function() {
  var root = this;
  var previousBackbone = root.Backbone;
  var slice = Array.prototype.slice;
  var splice = Array.prototype.splice;
  var Backbone;
  if(typeof exports !== "undefined") {
    Backbone = exports
  }else {
    Backbone = root.Backbone = {}
  }
  Backbone.VERSION = "0.9.2";
  var _ = root._;
  if(!_ && typeof require !== "undefined") {
    _ = require("underscore")
  }
  var $ = root.jQuery || root.Zepto || root.ender;
  Backbone.setDomLibrary = function(lib) {
    $ = lib
  };
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this
  };
  Backbone.emulateHTTP = false;
  Backbone.emulateJSON = false;
  var eventSplitter = /\s+/;
  var Events = Backbone.Events = {on:function(events, callback, context) {
    var calls, event, node, tail, list;
    if(!callback) {
      return this
    }
    events = events.split(eventSplitter);
    calls = this._callbacks || (this._callbacks = {});
    while(event = events.shift()) {
      list = calls[event];
      node = list ? list.tail : {};
      node.next = tail = {};
      node.context = context;
      node.callback = callback;
      calls[event] = {tail:tail, next:list ? list.next : node}
    }
    return this
  }, off:function(events, callback, context) {
    var event, calls, node, tail, cb, ctx;
    if(!(calls = this._callbacks)) {
      return
    }
    if(!(events || callback || context)) {
      delete this._callbacks;
      return this
    }
    events = events ? events.split(eventSplitter) : _.keys(calls);
    while(event = events.shift()) {
      node = calls[event];
      delete calls[event];
      if(!node || !(callback || context)) {
        continue
      }
      tail = node.tail;
      while((node = node.next) !== tail) {
        cb = node.callback;
        ctx = node.context;
        if(callback && cb !== callback || context && ctx !== context) {
          this.on(event, cb, ctx)
        }
      }
    }
    return this
  }, trigger:function(events) {
    var event, node, calls, tail, args, all, rest;
    if(!(calls = this._callbacks)) {
      return this
    }
    all = calls.all;
    events = events.split(eventSplitter);
    rest = slice.call(arguments, 1);
    while(event = events.shift()) {
      if(node = calls[event]) {
        tail = node.tail;
        while((node = node.next) !== tail) {
          node.callback.apply(node.context || this, rest)
        }
      }
      if(node = all) {
        tail = node.tail;
        args = [event].concat(rest);
        while((node = node.next) !== tail) {
          node.callback.apply(node.context || this, args)
        }
      }
    }
    return this
  }};
  Events.bind = Events.on;
  Events.unbind = Events.off;
  var Model = Backbone.Model = function(attributes, options) {
    var defaults;
    attributes || (attributes = {});
    if(options && options.parse) {
      attributes = this.parse(attributes)
    }
    if(defaults = getValue(this, "defaults")) {
      attributes = _.extend({}, defaults, attributes)
    }
    if(options && options.collection) {
      this.collection = options.collection
    }
    this.attributes = {};
    this._escapedAttributes = {};
    this.cid = _.uniqueId("c");
    this.changed = {};
    this._silent = {};
    this._pending = {};
    this.set(attributes, {silent:true});
    this.changed = {};
    this._silent = {};
    this._pending = {};
    this._previousAttributes = _.clone(this.attributes);
    this.initialize.apply(this, arguments)
  };
  _.extend(Model.prototype, Events, {changed:null, _silent:null, _pending:null, idAttribute:"id", initialize:function() {
  }, toJSON:function(options) {
    return _.clone(this.attributes)
  }, get:function(attr) {
    return this.attributes[attr]
  }, escape:function(attr) {
    var html;
    if(html = this._escapedAttributes[attr]) {
      return html
    }
    var val = this.get(attr);
    return this._escapedAttributes[attr] = _.escape(val == null ? "" : "" + val)
  }, has:function(attr) {
    return this.get(attr) != null
  }, set:function(key, value, options) {
    var attrs, attr, val;
    if(_.isObject(key) || key == null) {
      attrs = key;
      options = value
    }else {
      attrs = {};
      attrs[key] = value
    }
    options || (options = {});
    if(!attrs) {
      return this
    }
    if(attrs instanceof Model) {
      attrs = attrs.attributes
    }
    if(options.unset) {
      for(attr in attrs) {
        attrs[attr] = void 0
      }
    }
    if(!this._validate(attrs, options)) {
      return false
    }
    if(this.idAttribute in attrs) {
      this.id = attrs[this.idAttribute]
    }
    var changes = options.changes = {};
    var now = this.attributes;
    var escaped = this._escapedAttributes;
    var prev = this._previousAttributes || {};
    for(attr in attrs) {
      val = attrs[attr];
      if(!_.isEqual(now[attr], val) || options.unset && _.has(now, attr)) {
        delete escaped[attr];
        (options.silent ? this._silent : changes)[attr] = true
      }
      options.unset ? delete now[attr] : now[attr] = val;
      if(!_.isEqual(prev[attr], val) || _.has(now, attr) != _.has(prev, attr)) {
        this.changed[attr] = val;
        if(!options.silent) {
          this._pending[attr] = true
        }
      }else {
        delete this.changed[attr];
        delete this._pending[attr]
      }
    }
    if(!options.silent) {
      this.change(options)
    }
    return this
  }, unset:function(attr, options) {
    (options || (options = {})).unset = true;
    return this.set(attr, null, options)
  }, clear:function(options) {
    (options || (options = {})).unset = true;
    return this.set(_.clone(this.attributes), options)
  }, fetch:function(options) {
    options = options ? _.clone(options) : {};
    var model = this;
    var success = options.success;
    options.success = function(resp, status, xhr) {
      if(!model.set(model.parse(resp, xhr), options)) {
        return false
      }
      if(success) {
        success(model, resp)
      }
    };
    options.error = Backbone.wrapError(options.error, model, options);
    return(this.sync || Backbone.sync).call(this, "read", this, options)
  }, save:function(key, value, options) {
    var attrs, current;
    if(_.isObject(key) || key == null) {
      attrs = key;
      options = value
    }else {
      attrs = {};
      attrs[key] = value
    }
    options = options ? _.clone(options) : {};
    if(options.wait) {
      if(!this._validate(attrs, options)) {
        return false
      }
      current = _.clone(this.attributes)
    }
    var silentOptions = _.extend({}, options, {silent:true});
    if(attrs && !this.set(attrs, options.wait ? silentOptions : options)) {
      return false
    }
    var model = this;
    var success = options.success;
    options.success = function(resp, status, xhr) {
      var serverAttrs = model.parse(resp, xhr);
      if(options.wait) {
        delete options.wait;
        serverAttrs = _.extend(attrs || {}, serverAttrs)
      }
      if(!model.set(serverAttrs, options)) {
        return false
      }
      if(success) {
        success(model, resp)
      }else {
        model.trigger("sync", model, resp, options)
      }
    };
    options.error = Backbone.wrapError(options.error, model, options);
    var method = this.isNew() ? "create" : "update";
    var xhr = (this.sync || Backbone.sync).call(this, method, this, options);
    if(options.wait) {
      this.set(current, silentOptions)
    }
    return xhr
  }, destroy:function(options) {
    options = options ? _.clone(options) : {};
    var model = this;
    var success = options.success;
    var triggerDestroy = function() {
      model.trigger("destroy", model, model.collection, options)
    };
    if(this.isNew()) {
      triggerDestroy();
      return false
    }
    options.success = function(resp) {
      if(options.wait) {
        triggerDestroy()
      }
      if(success) {
        success(model, resp)
      }else {
        model.trigger("sync", model, resp, options)
      }
    };
    options.error = Backbone.wrapError(options.error, model, options);
    var xhr = (this.sync || Backbone.sync).call(this, "delete", this, options);
    if(!options.wait) {
      triggerDestroy()
    }
    return xhr
  }, url:function() {
    var base = getValue(this, "urlRoot") || getValue(this.collection, "url") || urlError();
    if(this.isNew()) {
      return base
    }
    return base + (base.charAt(base.length - 1) == "/" ? "" : "/") + encodeURIComponent(this.id)
  }, parse:function(resp, xhr) {
    return resp
  }, clone:function() {
    return new this.constructor(this.attributes)
  }, isNew:function() {
    return this.id == null
  }, change:function(options) {
    options || (options = {});
    var changing = this._changing;
    this._changing = true;
    for(var attr in this._silent) {
      this._pending[attr] = true
    }
    var changes = _.extend({}, options.changes, this._silent);
    this._silent = {};
    for(var attr in changes) {
      this.trigger("change:" + attr, this, this.get(attr), options)
    }
    if(changing) {
      return this
    }
    while(!_.isEmpty(this._pending)) {
      this._pending = {};
      this.trigger("change", this, options);
      for(var attr in this.changed) {
        if(this._pending[attr] || this._silent[attr]) {
          continue
        }
        delete this.changed[attr]
      }
      this._previousAttributes = _.clone(this.attributes)
    }
    this._changing = false;
    return this
  }, hasChanged:function(attr) {
    if(!arguments.length) {
      return!_.isEmpty(this.changed)
    }
    return _.has(this.changed, attr)
  }, changedAttributes:function(diff) {
    if(!diff) {
      return this.hasChanged() ? _.clone(this.changed) : false
    }
    var val, changed = false, old = this._previousAttributes;
    for(var attr in diff) {
      if(_.isEqual(old[attr], val = diff[attr])) {
        continue
      }
      (changed || (changed = {}))[attr] = val
    }
    return changed
  }, previous:function(attr) {
    if(!arguments.length || !this._previousAttributes) {
      return null
    }
    return this._previousAttributes[attr]
  }, previousAttributes:function() {
    return _.clone(this._previousAttributes)
  }, isValid:function() {
    return!this.validate(this.attributes)
  }, _validate:function(attrs, options) {
    if(options.silent || !this.validate) {
      return true
    }
    attrs = _.extend({}, this.attributes, attrs);
    var error = this.validate(attrs, options);
    if(!error) {
      return true
    }
    if(options && options.error) {
      options.error(this, error, options)
    }else {
      this.trigger("error", this, error, options)
    }
    return false
  }});
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if(options.model) {
      this.model = options.model
    }
    if(options.comparator) {
      this.comparator = options.comparator
    }
    this._reset();
    this.initialize.apply(this, arguments);
    if(models) {
      this.reset(models, {silent:true, parse:options.parse})
    }
  };
  _.extend(Collection.prototype, Events, {model:Model, initialize:function() {
  }, toJSON:function(options) {
    return this.map(function(model) {
      return model.toJSON(options)
    })
  }, add:function(models, options) {
    var i, index, length, model, cid, id, cids = {}, ids = {}, dups = [];
    options || (options = {});
    models = _.isArray(models) ? models.slice() : [models];
    for(i = 0, length = models.length;i < length;i++) {
      if(!(model = models[i] = this._prepareModel(models[i], options))) {
        throw new Error("Can't add an invalid model to a collection");
      }
      cid = model.cid;
      id = model.id;
      if(cids[cid] || this._byCid[cid] || id != null && (ids[id] || this._byId[id])) {
        dups.push(i);
        continue
      }
      cids[cid] = ids[id] = model
    }
    i = dups.length;
    while(i--) {
      models.splice(dups[i], 1)
    }
    for(i = 0, length = models.length;i < length;i++) {
      (model = models[i]).on("all", this._onModelEvent, this);
      this._byCid[model.cid] = model;
      if(model.id != null) {
        this._byId[model.id] = model
      }
    }
    this.length += length;
    index = options.at != null ? options.at : this.models.length;
    splice.apply(this.models, [index, 0].concat(models));
    if(this.comparator) {
      this.sort({silent:true})
    }
    if(options.silent) {
      return this
    }
    for(i = 0, length = this.models.length;i < length;i++) {
      if(!cids[(model = this.models[i]).cid]) {
        continue
      }
      options.index = i;
      model.trigger("add", model, this, options)
    }
    return this
  }, remove:function(models, options) {
    var i, l, index, model;
    options || (options = {});
    models = _.isArray(models) ? models.slice() : [models];
    for(i = 0, l = models.length;i < l;i++) {
      model = this.getByCid(models[i]) || this.get(models[i]);
      if(!model) {
        continue
      }
      delete this._byId[model.id];
      delete this._byCid[model.cid];
      index = this.indexOf(model);
      this.models.splice(index, 1);
      this.length--;
      if(!options.silent) {
        options.index = index;
        model.trigger("remove", model, this, options)
      }
      this._removeReference(model)
    }
    return this
  }, push:function(model, options) {
    model = this._prepareModel(model, options);
    this.add(model, options);
    return model
  }, pop:function(options) {
    var model = this.at(this.length - 1);
    this.remove(model, options);
    return model
  }, unshift:function(model, options) {
    model = this._prepareModel(model, options);
    this.add(model, _.extend({at:0}, options));
    return model
  }, shift:function(options) {
    var model = this.at(0);
    this.remove(model, options);
    return model
  }, get:function(id) {
    if(id == null) {
      return void 0
    }
    return this._byId[id.id != null ? id.id : id]
  }, getByCid:function(cid) {
    return cid && this._byCid[cid.cid || cid]
  }, at:function(index) {
    return this.models[index]
  }, where:function(attrs) {
    if(_.isEmpty(attrs)) {
      return[]
    }
    return this.filter(function(model) {
      for(var key in attrs) {
        if(attrs[key] !== model.get(key)) {
          return false
        }
      }
      return true
    })
  }, sort:function(options) {
    options || (options = {});
    if(!this.comparator) {
      throw new Error("Cannot sort a set without a comparator");
    }
    var boundComparator = _.bind(this.comparator, this);
    if(this.comparator.length == 1) {
      this.models = this.sortBy(boundComparator)
    }else {
      this.models.sort(boundComparator)
    }
    if(!options.silent) {
      this.trigger("reset", this, options)
    }
    return this
  }, pluck:function(attr) {
    return _.map(this.models, function(model) {
      return model.get(attr)
    })
  }, reset:function(models, options) {
    models || (models = []);
    options || (options = {});
    for(var i = 0, l = this.models.length;i < l;i++) {
      this._removeReference(this.models[i])
    }
    this._reset();
    this.add(models, _.extend({silent:true}, options));
    if(!options.silent) {
      this.trigger("reset", this, options)
    }
    return this
  }, fetch:function(options) {
    options = options ? _.clone(options) : {};
    if(options.parse === undefined) {
      options.parse = true
    }
    var collection = this;
    var success = options.success;
    options.success = function(resp, status, xhr) {
      collection[options.add ? "add" : "reset"](collection.parse(resp, xhr), options);
      if(success) {
        success(collection, resp)
      }
    };
    options.error = Backbone.wrapError(options.error, collection, options);
    return(this.sync || Backbone.sync).call(this, "read", this, options)
  }, create:function(model, options) {
    var coll = this;
    options = options ? _.clone(options) : {};
    model = this._prepareModel(model, options);
    if(!model) {
      return false
    }
    if(!options.wait) {
      coll.add(model, options)
    }
    var success = options.success;
    options.success = function(nextModel, resp, xhr) {
      if(options.wait) {
        coll.add(nextModel, options)
      }
      if(success) {
        success(nextModel, resp)
      }else {
        nextModel.trigger("sync", model, resp, options)
      }
    };
    model.save(null, options);
    return model
  }, parse:function(resp, xhr) {
    return resp
  }, chain:function() {
    return _(this.models).chain()
  }, _reset:function(options) {
    this.length = 0;
    this.models = [];
    this._byId = {};
    this._byCid = {}
  }, _prepareModel:function(model, options) {
    options || (options = {});
    if(!(model instanceof Model)) {
      var attrs = model;
      options.collection = this;
      model = new this.model(attrs, options);
      if(!model._validate(model.attributes, options)) {
        model = false
      }
    }else {
      if(!model.collection) {
        model.collection = this
      }
    }
    return model
  }, _removeReference:function(model) {
    if(this == model.collection) {
      delete model.collection
    }
    model.off("all", this._onModelEvent, this)
  }, _onModelEvent:function(event, model, collection, options) {
    if((event == "add" || event == "remove") && collection != this) {
      return
    }
    if(event == "destroy") {
      this.remove(model, options)
    }
    if(model && event === "change:" + model.idAttribute) {
      delete this._byId[model.previous(model.idAttribute)];
      this._byId[model.id] = model
    }
    this.trigger.apply(this, arguments)
  }});
  var methods = ["forEach", "each", "map", "reduce", "reduceRight", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "sortBy", "sortedIndex", "toArray", "size", "first", "initial", "rest", "last", "without", "indexOf", "shuffle", "lastIndexOf", "isEmpty", "groupBy"];
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      return _[method].apply(_, [this.models].concat(_.toArray(arguments)))
    }
  });
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if(options.routes) {
      this.routes = options.routes
    }
    this._bindRoutes();
    this.initialize.apply(this, arguments)
  };
  var namedParam = /:\w+/g;
  var splatParam = /\*\w+/g;
  var escapeRegExp = /[-[\]{}()+?.,\\^$|#\s]/g;
  _.extend(Router.prototype, Events, {initialize:function() {
  }, route:function(route, name, callback) {
    Backbone.history || (Backbone.history = new History);
    if(!_.isRegExp(route)) {
      route = this._routeToRegExp(route)
    }
    if(!callback) {
      callback = this[name]
    }
    Backbone.history.route(route, _.bind(function(fragment) {
      var args = this._extractParameters(route, fragment);
      callback && callback.apply(this, args);
      this.trigger.apply(this, ["route:" + name].concat(args));
      Backbone.history.trigger("route", this, name, args)
    }, this));
    return this
  }, navigate:function(fragment, options) {
    Backbone.history.navigate(fragment, options)
  }, _bindRoutes:function() {
    if(!this.routes) {
      return
    }
    var routes = [];
    for(var route in this.routes) {
      routes.unshift([route, this.routes[route]])
    }
    for(var i = 0, l = routes.length;i < l;i++) {
      this.route(routes[i][0], routes[i][1], this[routes[i][1]])
    }
  }, _routeToRegExp:function(route) {
    route = route.replace(escapeRegExp, "\\$&").replace(namedParam, "([^/]+)").replace(splatParam, "(.*?)");
    return new RegExp("^" + route + "$")
  }, _extractParameters:function(route, fragment) {
    return route.exec(fragment).slice(1)
  }});
  var History = Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, "checkUrl")
  };
  var routeStripper = /^[#\/]/;
  var isExplorer = /msie [\w.]+/;
  History.started = false;
  _.extend(History.prototype, Events, {interval:50, getHash:function(windowOverride) {
    var loc = windowOverride ? windowOverride.location : window.location;
    var match = loc.href.match(/#(.*)$/);
    return match ? match[1] : ""
  }, getFragment:function(fragment, forcePushState) {
    if(fragment == null) {
      if(this._hasPushState || forcePushState) {
        fragment = window.location.pathname;
        var search = window.location.search;
        if(search) {
          fragment += search
        }
      }else {
        fragment = this.getHash()
      }
    }
    if(!fragment.indexOf(this.options.root)) {
      fragment = fragment.substr(this.options.root.length)
    }
    return fragment.replace(routeStripper, "")
  }, start:function(options) {
    if(History.started) {
      throw new Error("Backbone.history has already been started");
    }
    History.started = true;
    this.options = _.extend({}, {root:"/"}, this.options, options);
    this._wantsHashChange = this.options.hashChange !== false;
    this._wantsPushState = !!this.options.pushState;
    this._hasPushState = !!(this.options.pushState && window.history && window.history.pushState);
    var fragment = this.getFragment();
    var docMode = document.documentMode;
    var oldIE = isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7);
    if(oldIE) {
      this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow;
      this.navigate(fragment)
    }
    if(this._hasPushState) {
      $(window).bind("popstate", this.checkUrl)
    }else {
      if(this._wantsHashChange && "onhashchange" in window && !oldIE) {
        $(window).bind("hashchange", this.checkUrl)
      }else {
        if(this._wantsHashChange) {
          this._checkUrlInterval = setInterval(this.checkUrl, this.interval)
        }
      }
    }
    this.fragment = fragment;
    var loc = window.location;
    var atRoot = loc.pathname == this.options.root;
    if(this._wantsHashChange && this._wantsPushState && !this._hasPushState && !atRoot) {
      this.fragment = this.getFragment(null, true);
      window.location.replace(this.options.root + "#" + this.fragment);
      return true
    }else {
      if(this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
        this.fragment = this.getHash().replace(routeStripper, "");
        window.history.replaceState({}, document.title, loc.protocol + "//" + loc.host + this.options.root + this.fragment)
      }
    }
    if(!this.options.silent) {
      return this.loadUrl()
    }
  }, stop:function() {
    $(window).unbind("popstate", this.checkUrl).unbind("hashchange", this.checkUrl);
    clearInterval(this._checkUrlInterval);
    History.started = false
  }, route:function(route, callback) {
    this.handlers.unshift({route:route, callback:callback})
  }, checkUrl:function(e) {
    var current = this.getFragment();
    if(current == this.fragment && this.iframe) {
      current = this.getFragment(this.getHash(this.iframe))
    }
    if(current == this.fragment) {
      return false
    }
    if(this.iframe) {
      this.navigate(current)
    }
    this.loadUrl() || this.loadUrl(this.getHash())
  }, loadUrl:function(fragmentOverride) {
    var fragment = this.fragment = this.getFragment(fragmentOverride);
    var matched = _.any(this.handlers, function(handler) {
      if(handler.route.test(fragment)) {
        handler.callback(fragment);
        return true
      }
    });
    return matched
  }, navigate:function(fragment, options) {
    if(!History.started) {
      return false
    }
    if(!options || options === true) {
      options = {trigger:options}
    }
    var frag = (fragment || "").replace(routeStripper, "");
    if(this.fragment == frag) {
      return
    }
    if(this._hasPushState) {
      if(frag.indexOf(this.options.root) != 0) {
        frag = this.options.root + frag
      }
      this.fragment = frag;
      window.history[options.replace ? "replaceState" : "pushState"]({}, document.title, frag)
    }else {
      if(this._wantsHashChange) {
        this.fragment = frag;
        this._updateHash(window.location, frag, options.replace);
        if(this.iframe && frag != this.getFragment(this.getHash(this.iframe))) {
          if(!options.replace) {
            this.iframe.document.open().close()
          }
          this._updateHash(this.iframe.location, frag, options.replace)
        }
      }else {
        window.location.assign(this.options.root + fragment)
      }
    }
    if(options.trigger) {
      this.loadUrl(fragment)
    }
  }, _updateHash:function(location, fragment, replace) {
    if(replace) {
      location.replace(location.toString().replace(/(javascript:|#).*$/, "") + "#" + fragment)
    }else {
      location.hash = fragment
    }
  }});
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId("view");
    this._configure(options || {});
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents()
  };
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;
  var viewOptions = ["model", "collection", "el", "id", "attributes", "className", "tagName"];
  _.extend(View.prototype, Events, {tagName:"div", $:function(selector) {
    return this.$el.find(selector)
  }, initialize:function() {
  }, render:function() {
    return this
  }, remove:function() {
    this.$el.remove();
    return this
  }, make:function(tagName, attributes, content) {
    var el = document.createElement(tagName);
    if(attributes) {
      $(el).attr(attributes)
    }
    if(content) {
      $(el).html(content)
    }
    return el
  }, setElement:function(element, delegate) {
    if(this.$el) {
      this.undelegateEvents()
    }
    this.$el = element instanceof $ ? element : $(element);
    this.el = this.$el[0];
    if(delegate !== false) {
      this.delegateEvents()
    }
    return this
  }, delegateEvents:function(events) {
    if(!(events || (events = getValue(this, "events")))) {
      return
    }
    this.undelegateEvents();
    for(var key in events) {
      var method = events[key];
      if(!_.isFunction(method)) {
        method = this[events[key]]
      }
      if(!method) {
        throw new Error('Method "' + events[key] + '" does not exist');
      }
      var match = key.match(delegateEventSplitter);
      var eventName = match[1], selector = match[2];
      method = _.bind(method, this);
      eventName += ".delegateEvents" + this.cid;
      if(selector === "") {
        this.$el.bind(eventName, method)
      }else {
        this.$el.delegate(selector, eventName, method)
      }
    }
  }, undelegateEvents:function() {
    this.$el.unbind(".delegateEvents" + this.cid)
  }, _configure:function(options) {
    if(this.options) {
      options = _.extend({}, this.options, options)
    }
    for(var i = 0, l = viewOptions.length;i < l;i++) {
      var attr = viewOptions[i];
      if(options[attr]) {
        this[attr] = options[attr]
      }
    }
    this.options = options
  }, _ensureElement:function() {
    if(!this.el) {
      var attrs = getValue(this, "attributes") || {};
      if(this.id) {
        attrs.id = this.id
      }
      if(this.className) {
        attrs["class"] = this.className
      }
      this.setElement(this.make(this.tagName, attrs), false)
    }else {
      this.setElement(this.el, false)
    }
  }});
  var extend = function(protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child
  };
  Model.extend = Collection.extend = Router.extend = View.extend = extend;
  var methodMap = {"create":"POST", "update":"PUT", "delete":"DELETE", "read":"GET"};
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];
    options || (options = {});
    var params = {type:type, dataType:"json"};
    if(!options.url) {
      params.url = getValue(model, "url") || urlError()
    }
    if(!options.data && model && (method == "create" || method == "update")) {
      params.contentType = "application/json";
      params.data = JSON.stringify(model.toJSON())
    }
    if(Backbone.emulateJSON) {
      params.contentType = "application/x-www-form-urlencoded";
      params.data = params.data ? {model:params.data} : {}
    }
    if(Backbone.emulateHTTP) {
      if(type === "PUT" || type === "DELETE") {
        if(Backbone.emulateJSON) {
          params.data._method = type
        }
        params.type = "POST";
        params.beforeSend = function(xhr) {
          xhr.setRequestHeader("X-HTTP-Method-Override", type)
        }
      }
    }
    if(params.type !== "GET" && !Backbone.emulateJSON) {
      params.processData = false
    }
    if(Backbone.ajax == null) {
      return $.ajax(_.extend(params, options))
    }
    return Backbone.ajax(_.extend(params, options))
  };
  Backbone.wrapError = function(onError, originalModel, options) {
    return function(model, resp) {
      resp = model === originalModel ? resp : model;
      if(onError) {
        onError(originalModel, resp, options)
      }else {
        originalModel.trigger("error", originalModel, resp, options)
      }
    }
  };
  var ctor = function() {
  };
  var inherits = function(parent, protoProps, staticProps) {
    var child;
    if(protoProps && protoProps.hasOwnProperty("constructor")) {
      child = protoProps.constructor
    }else {
      child = function() {
        parent.apply(this, arguments)
      }
    }
    _.extend(child, parent);
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    if(protoProps) {
      _.extend(child.prototype, protoProps)
    }
    if(staticProps) {
      _.extend(child, staticProps)
    }
    child.prototype.constructor = child;
    child.__super__ = parent.prototype;
    return child
  };
  var getValue = function(object, prop) {
    if(!(object && object[prop])) {
      return null
    }
    return _.isFunction(object[prop]) ? object[prop]() : object[prop]
  };
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  }
}).call(this);
if(typeof window !== "undefined") {
  (function(window, document, location, setTimeout, decodeURIComponent, encodeURIComponent) {
    var global = this || window;
    var channelId = Math.floor(Math.random() * 1E4);
    var emptyFn = Function.prototype;
    var reURI = /^((http.?:)\/\/([^:\/\s]+)(:\d+)*)/;
    var reParent = /[\-\w]+\/\.\.\//;
    var reDoubleSlash = /([^:])\/\//g;
    var namespace = "";
    var easyXDM = {};
    var _easyXDM = window.easyXDM;
    var IFRAME_PREFIX = "easyXDM_";
    var HAS_NAME_PROPERTY_BUG;
    var useHash = false;
    var flashVersion;
    var HAS_FLASH_THROTTLED_BUG;
    function isHostMethod(object, property) {
      var t = typeof object[property];
      return t == "function" || !!(t == "object" && object[property]) || t == "unknown"
    }
    function isHostObject(object, property) {
      return!!(typeof object[property] == "object" && object[property])
    }
    function isArray(o) {
      return Object.prototype.toString.call(o) === "[object Array]"
    }
    function hasFlash() {
      try {
        var activeX = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
        flashVersion = Array.prototype.slice.call(activeX.GetVariable("$version").match(/(\d+),(\d+),(\d+),(\d+)/), 1);
        HAS_FLASH_THROTTLED_BUG = parseInt(flashVersion[0], 10) > 9 && parseInt(flashVersion[1], 10) > 0;
        activeX = null;
        return true
      }catch(notSupportedException) {
        return false
      }
    }
    var on, un;
    if(isHostMethod(window, "addEventListener")) {
      on = function(target, type, listener) {
        target.addEventListener(type, listener, false)
      };
      un = function(target, type, listener) {
        target.removeEventListener(type, listener, false)
      }
    }else {
      if(isHostMethod(window, "attachEvent")) {
        on = function(object, sEvent, fpNotify) {
          object.attachEvent("on" + sEvent, fpNotify)
        };
        un = function(object, sEvent, fpNotify) {
          object.detachEvent("on" + sEvent, fpNotify)
        }
      }else {
        throw new Error("Browser not supported");
      }
    }
    var domIsReady = false, domReadyQueue = [], readyState;
    if("readyState" in document) {
      readyState = document.readyState;
      domIsReady = readyState == "complete" || ~navigator.userAgent.indexOf("AppleWebKit/") && (readyState == "loaded" || readyState == "interactive")
    }else {
      domIsReady = !!document.body
    }
    function dom_onReady() {
      if(domIsReady) {
        return
      }
      domIsReady = true;
      for(var i = 0;i < domReadyQueue.length;i++) {
        domReadyQueue[i]()
      }
      domReadyQueue.length = 0
    }
    if(!domIsReady) {
      if(isHostMethod(window, "addEventListener")) {
        on(document, "DOMContentLoaded", dom_onReady)
      }else {
        on(document, "readystatechange", function() {
          if(document.readyState == "complete") {
            dom_onReady()
          }
        });
        if(document.documentElement.doScroll && window === top) {
          var doScrollCheck = function() {
            if(domIsReady) {
              return
            }
            try {
              document.documentElement.doScroll("left")
            }catch(e) {
              setTimeout(doScrollCheck, 1);
              return
            }
            dom_onReady()
          };
          doScrollCheck()
        }
      }
      on(window, "load", dom_onReady)
    }
    function whenReady(fn, scope) {
      if(domIsReady) {
        fn.call(scope);
        return
      }
      domReadyQueue.push(function() {
        fn.call(scope)
      })
    }
    function getParentObject() {
      var obj = parent;
      if(namespace !== "") {
        for(var i = 0, ii = namespace.split(".");i < ii.length;i++) {
          obj = obj[ii[i]]
        }
      }
      return obj.easyXDM
    }
    function noConflict(ns) {
      window.easyXDM = _easyXDM;
      namespace = ns;
      if(namespace) {
        IFRAME_PREFIX = "easyXDM_" + namespace.replace(".", "_") + "_"
      }
      return easyXDM
    }
    function getDomainName(url) {
      return url.match(reURI)[3]
    }
    function getPort(url) {
      return url.match(reURI)[4] || ""
    }
    function getLocation(url) {
      var m = url.toLowerCase().match(reURI);
      var proto = m[2], domain = m[3], port = m[4] || "";
      if(proto == "http:" && port == ":80" || proto == "https:" && port == ":443") {
        port = ""
      }
      return proto + "//" + domain + port
    }
    function resolveUrl(url) {
      url = url.replace(reDoubleSlash, "$1/");
      if(!url.match(/^(http||https):\/\//)) {
        var path = url.substring(0, 1) === "/" ? "" : location.pathname;
        if(path.substring(path.length - 1) !== "/") {
          path = path.substring(0, path.lastIndexOf("/") + 1)
        }
        url = location.protocol + "//" + location.host + path + url
      }
      while(reParent.test(url)) {
        url = url.replace(reParent, "")
      }
      return url
    }
    function appendQueryParameters(url, parameters) {
      var hash = "", indexOf = url.indexOf("#");
      if(indexOf !== -1) {
        hash = url.substring(indexOf);
        url = url.substring(0, indexOf)
      }
      var q = [];
      for(var key in parameters) {
        if(parameters.hasOwnProperty(key)) {
          q.push(key + "=" + encodeURIComponent(parameters[key]))
        }
      }
      return url + (useHash ? "#" : url.indexOf("?") == -1 ? "?" : "&") + q.join("&") + hash
    }
    var query = function(input) {
      input = input.substring(1).split("&");
      var data = {}, pair, i = input.length;
      while(i--) {
        pair = input[i].split("=");
        data[pair[0]] = decodeURIComponent(pair[1])
      }
      return data
    }(/xdm_e=/.test(location.search) ? location.search : location.hash);
    function undef(v) {
      return typeof v === "undefined"
    }
    var getJSON = function() {
      var cached = {};
      var obj = {a:[1, 2, 3]}, json = '{"a":[1,2,3]}';
      if(typeof JSON != "undefined" && typeof JSON.stringify === "function" && JSON.stringify(obj).replace(/\s/g, "") === json) {
        return JSON
      }
      if(Object.toJSON) {
        if(Object.toJSON(obj).replace(/\s/g, "") === json) {
          cached.stringify = Object.toJSON
        }
      }
      if(typeof String.prototype.evalJSON === "function") {
        obj = json.evalJSON();
        if(obj.a && obj.a.length === 3 && obj.a[2] === 3) {
          cached.parse = function(str) {
            return str.evalJSON()
          }
        }
      }
      if(cached.stringify && cached.parse) {
        getJSON = function() {
          return cached
        };
        return cached
      }
      return null
    };
    function apply(destination, source, noOverwrite) {
      var member;
      for(var prop in source) {
        if(source.hasOwnProperty(prop)) {
          if(prop in destination) {
            member = source[prop];
            if(typeof member === "object") {
              apply(destination[prop], member, noOverwrite)
            }else {
              if(!noOverwrite) {
                destination[prop] = source[prop]
              }
            }
          }else {
            destination[prop] = source[prop]
          }
        }
      }
      return destination
    }
    function testForNamePropertyBug() {
      var form = document.body.appendChild(document.createElement("form")), input = form.appendChild(document.createElement("input"));
      input.name = IFRAME_PREFIX + "TEST" + channelId;
      HAS_NAME_PROPERTY_BUG = input !== form.elements[input.name];
      document.body.removeChild(form)
    }
    function createFrame(config) {
      if(undef(HAS_NAME_PROPERTY_BUG)) {
        testForNamePropertyBug()
      }
      var frame;
      if(HAS_NAME_PROPERTY_BUG) {
        frame = document.createElement('<iframe name="' + config.props.name + '"/>')
      }else {
        frame = document.createElement("IFRAME");
        frame.name = config.props.name
      }
      frame.id = frame.name = config.props.name;
      delete config.props.name;
      if(config.onLoad) {
        on(frame, "load", config.onLoad)
      }
      if(typeof config.container == "string") {
        config.container = document.getElementById(config.container)
      }
      if(!config.container) {
        apply(frame.style, {position:"absolute", top:"-2000px"});
        config.container = document.body
      }
      var src = config.props.src;
      delete config.props.src;
      apply(frame, config.props);
      frame.border = frame.frameBorder = 0;
      frame.allowTransparency = true;
      config.container.appendChild(frame);
      frame.src = src;
      config.props.src = src;
      return frame
    }
    function checkAcl(acl, domain) {
      if(typeof acl == "string") {
        acl = [acl]
      }
      var re, i = acl.length;
      while(i--) {
        re = acl[i];
        re = new RegExp(re.substr(0, 1) == "^" ? re : "^" + re.replace(/(\*)/g, ".$1").replace(/\?/g, ".") + "$");
        if(re.test(domain)) {
          return true
        }
      }
      return false
    }
    function prepareTransportStack(config) {
      var protocol = config.protocol, stackEls;
      config.isHost = config.isHost || undef(query.xdm_p);
      useHash = config.hash || false;
      if(!config.props) {
        config.props = {}
      }
      if(!config.isHost) {
        config.channel = query.xdm_c;
        config.secret = query.xdm_s;
        config.remote = query.xdm_e;
        protocol = query.xdm_p;
        if(config.acl && !checkAcl(config.acl, config.remote)) {
          throw new Error("Access denied for " + config.remote);
        }
      }else {
        config.remote = resolveUrl(config.remote);
        config.channel = config.channel || "default" + channelId++;
        config.secret = Math.random().toString(16).substring(2);
        if(undef(protocol)) {
          if(getLocation(location.href) == getLocation(config.remote)) {
            protocol = "4"
          }else {
            if(isHostMethod(window, "postMessage") || isHostMethod(document, "postMessage")) {
              protocol = "1"
            }else {
              if(config.swf && isHostMethod(window, "ActiveXObject") && hasFlash()) {
                protocol = "6"
              }else {
                if(navigator.product === "Gecko" && "frameElement" in window && navigator.userAgent.indexOf("WebKit") == -1) {
                  protocol = "5"
                }else {
                  if(config.remoteHelper) {
                    config.remoteHelper = resolveUrl(config.remoteHelper);
                    protocol = "2"
                  }else {
                    protocol = "0"
                  }
                }
              }
            }
          }
        }
      }
      config.protocol = protocol;
      switch(protocol) {
        case "0":
          apply(config, {interval:100, delay:2E3, useResize:true, useParent:false, usePolling:false}, true);
          if(config.isHost) {
            if(!config.local) {
              var domain = location.protocol + "//" + location.host, images = document.body.getElementsByTagName("img"), image;
              var i = images.length;
              while(i--) {
                image = images[i];
                if(image.src.substring(0, domain.length) === domain) {
                  config.local = image.src;
                  break
                }
              }
              if(!config.local) {
                config.local = window
              }
            }
            var parameters = {xdm_c:config.channel, xdm_p:0};
            if(config.local === window) {
              config.usePolling = true;
              config.useParent = true;
              config.local = location.protocol + "//" + location.host + location.pathname + location.search;
              parameters.xdm_e = config.local;
              parameters.xdm_pa = 1
            }else {
              parameters.xdm_e = resolveUrl(config.local)
            }
            if(config.container) {
              config.useResize = false;
              parameters.xdm_po = 1
            }
            config.remote = appendQueryParameters(config.remote, parameters)
          }else {
            apply(config, {channel:query.xdm_c, remote:query.xdm_e, useParent:!undef(query.xdm_pa), usePolling:!undef(query.xdm_po), useResize:config.useParent ? false : config.useResize})
          }
          stackEls = [new easyXDM.stack.HashTransport(config), new easyXDM.stack.ReliableBehavior({}), new easyXDM.stack.QueueBehavior({encode:true, maxLength:4E3 - config.remote.length}), new easyXDM.stack.VerifyBehavior({initiate:config.isHost})];
          break;
        case "1":
          stackEls = [new easyXDM.stack.PostMessageTransport(config)];
          break;
        case "2":
          stackEls = [new easyXDM.stack.NameTransport(config), new easyXDM.stack.QueueBehavior, new easyXDM.stack.VerifyBehavior({initiate:config.isHost})];
          break;
        case "3":
          stackEls = [new easyXDM.stack.NixTransport(config)];
          break;
        case "4":
          stackEls = [new easyXDM.stack.SameOriginTransport(config)];
          break;
        case "5":
          stackEls = [new easyXDM.stack.FrameElementTransport(config)];
          break;
        case "6":
          if(!flashVersion) {
            hasFlash()
          }
          stackEls = [new easyXDM.stack.FlashTransport(config)];
          break
      }
      stackEls.push(new easyXDM.stack.QueueBehavior({lazy:config.lazy, remove:true}));
      return stackEls
    }
    function chainStack(stackElements) {
      var stackEl, defaults = {incoming:function(message, origin) {
        this.up.incoming(message, origin)
      }, outgoing:function(message, recipient) {
        this.down.outgoing(message, recipient)
      }, callback:function(success) {
        this.up.callback(success)
      }, init:function() {
        this.down.init()
      }, destroy:function() {
        this.down.destroy()
      }};
      for(var i = 0, len = stackElements.length;i < len;i++) {
        stackEl = stackElements[i];
        apply(stackEl, defaults, true);
        if(i !== 0) {
          stackEl.down = stackElements[i - 1]
        }
        if(i !== len - 1) {
          stackEl.up = stackElements[i + 1]
        }
      }
      return stackEl
    }
    function removeFromStack(element) {
      element.up.down = element.down;
      element.down.up = element.up;
      element.up = element.down = null
    }
    apply(easyXDM, {version:"2.4.15.118", query:query, stack:{}, apply:apply, getJSONObject:getJSON, whenReady:whenReady, noConflict:noConflict});
    easyXDM.DomHelper = {on:on, un:un, requiresJSON:function(path) {
      if(!isHostObject(window, "JSON")) {
        document.write("<" + 'script type="text/javascript" src="' + path + '"><' + "/script>")
      }
    }};
    (function() {
      var _map = {};
      easyXDM.Fn = {set:function(name, fn) {
        _map[name] = fn
      }, get:function(name, del) {
        var fn = _map[name];
        if(del) {
          delete _map[name]
        }
        return fn
      }}
    })();
    easyXDM.Socket = function(config) {
      var stack = chainStack(prepareTransportStack(config).concat([{incoming:function(message, origin) {
        config.onMessage(message, origin)
      }, callback:function(success) {
        if(config.onReady) {
          config.onReady(success)
        }
      }}])), recipient = getLocation(config.remote);
      this.origin = getLocation(config.remote);
      this.destroy = function() {
        stack.destroy()
      };
      this.postMessage = function(message) {
        stack.outgoing(message, recipient)
      };
      stack.init()
    };
    easyXDM.Rpc = function(config, jsonRpcConfig) {
      if(jsonRpcConfig.local) {
        for(var method in jsonRpcConfig.local) {
          if(jsonRpcConfig.local.hasOwnProperty(method)) {
            var member = jsonRpcConfig.local[method];
            if(typeof member === "function") {
              jsonRpcConfig.local[method] = {method:member}
            }
          }
        }
      }
      var stack = chainStack(prepareTransportStack(config).concat([new easyXDM.stack.RpcBehavior(this, jsonRpcConfig), {callback:function(success) {
        if(config.onReady) {
          config.onReady(success)
        }
      }}]));
      this.origin = getLocation(config.remote);
      this.destroy = function() {
        stack.destroy()
      };
      stack.init()
    };
    easyXDM.stack.SameOriginTransport = function(config) {
      var pub, frame, send, targetOrigin;
      return pub = {outgoing:function(message, domain, fn) {
        send(message);
        if(fn) {
          fn()
        }
      }, destroy:function() {
        if(frame) {
          frame.parentNode.removeChild(frame);
          frame = null
        }
      }, onDOMReady:function() {
        targetOrigin = getLocation(config.remote);
        if(config.isHost) {
          apply(config.props, {src:appendQueryParameters(config.remote, {xdm_e:location.protocol + "//" + location.host + location.pathname, xdm_c:config.channel, xdm_p:4}), name:IFRAME_PREFIX + config.channel + "_provider"});
          frame = createFrame(config);
          easyXDM.Fn.set(config.channel, function(sendFn) {
            send = sendFn;
            setTimeout(function() {
              pub.up.callback(true)
            }, 0);
            return function(msg) {
              pub.up.incoming(msg, targetOrigin)
            }
          })
        }else {
          send = getParentObject().Fn.get(config.channel, true)(function(msg) {
            pub.up.incoming(msg, targetOrigin)
          });
          setTimeout(function() {
            pub.up.callback(true)
          }, 0)
        }
      }, init:function() {
        whenReady(pub.onDOMReady, pub)
      }}
    };
    easyXDM.stack.FlashTransport = function(config) {
      var pub, frame, send, targetOrigin, swf, swfContainer;
      function onMessage(message, origin) {
        setTimeout(function() {
          pub.up.incoming(message, targetOrigin)
        }, 0)
      }
      function addSwf(domain) {
        var url = config.swf + "?host=" + config.isHost;
        var id = "easyXDM_swf_" + Math.floor(Math.random() * 1E4);
        easyXDM.Fn.set("flash_loaded" + domain.replace(/[\-.]/g, "_"), function() {
          easyXDM.stack.FlashTransport[domain].swf = swf = swfContainer.firstChild;
          var queue = easyXDM.stack.FlashTransport[domain].queue;
          for(var i = 0;i < queue.length;i++) {
            queue[i]()
          }
          queue.length = 0
        });
        if(config.swfContainer) {
          swfContainer = typeof config.swfContainer == "string" ? document.getElementById(config.swfContainer) : config.swfContainer
        }else {
          swfContainer = document.createElement("div");
          apply(swfContainer.style, HAS_FLASH_THROTTLED_BUG && config.swfNoThrottle ? {height:"20px", width:"20px", position:"fixed", right:0, top:0} : {height:"1px", width:"1px", position:"absolute", overflow:"hidden", right:0, top:0});
          document.body.appendChild(swfContainer)
        }
        var flashVars = "callback=flash_loaded" + domain.replace(/[\-.]/g, "_") + "&proto=" + global.location.protocol + "&domain=" + getDomainName(global.location.href) + "&port=" + getPort(global.location.href) + "&ns=" + namespace;
        swfContainer.innerHTML = "<object height='20' width='20' type='application/x-shockwave-flash' id='" + id + "' data='" + url + "'>" + "<param name='allowScriptAccess' value='always'></param>" + "<param name='wmode' value='transparent'>" + "<param name='movie' value='" + url + "'></param>" + "<param name='flashvars' value='" + flashVars + "'></param>" + "<embed type='application/x-shockwave-flash' FlashVars='" + flashVars + "' allowScriptAccess='always' wmode='transparent' src='" + url + "' height='1' width='1'></embed>" + 
        "</object>"
      }
      return pub = {outgoing:function(message, domain, fn) {
        swf.postMessage(config.channel, message.toString());
        if(fn) {
          fn()
        }
      }, destroy:function() {
        try {
          swf.destroyChannel(config.channel)
        }catch(e) {
        }
        swf = null;
        if(frame) {
          frame.parentNode.removeChild(frame);
          frame = null
        }
      }, onDOMReady:function() {
        targetOrigin = config.remote;
        easyXDM.Fn.set("flash_" + config.channel + "_init", function() {
          setTimeout(function() {
            pub.up.callback(true)
          })
        });
        easyXDM.Fn.set("flash_" + config.channel + "_onMessage", onMessage);
        config.swf = resolveUrl(config.swf);
        var swfdomain = getDomainName(config.swf);
        var fn = function() {
          easyXDM.stack.FlashTransport[swfdomain].init = true;
          swf = easyXDM.stack.FlashTransport[swfdomain].swf;
          swf.createChannel(config.channel, config.secret, getLocation(config.remote), config.isHost);
          if(config.isHost) {
            if(HAS_FLASH_THROTTLED_BUG && config.swfNoThrottle) {
              apply(config.props, {position:"fixed", right:0, top:0, height:"20px", width:"20px"})
            }
            apply(config.props, {src:appendQueryParameters(config.remote, {xdm_e:getLocation(location.href), xdm_c:config.channel, xdm_p:6, xdm_s:config.secret}), name:IFRAME_PREFIX + config.channel + "_provider"});
            frame = createFrame(config)
          }
        };
        if(easyXDM.stack.FlashTransport[swfdomain] && easyXDM.stack.FlashTransport[swfdomain].init) {
          fn()
        }else {
          if(!easyXDM.stack.FlashTransport[swfdomain]) {
            easyXDM.stack.FlashTransport[swfdomain] = {queue:[fn]};
            addSwf(swfdomain)
          }else {
            easyXDM.stack.FlashTransport[swfdomain].queue.push(fn)
          }
        }
      }, init:function() {
        whenReady(pub.onDOMReady, pub)
      }}
    };
    easyXDM.stack.PostMessageTransport = function(config) {
      var pub, frame, callerWindow, targetOrigin;
      function _getOrigin(event) {
        if(event.origin) {
          return getLocation(event.origin)
        }
        if(event.uri) {
          return getLocation(event.uri)
        }
        if(event.domain) {
          return location.protocol + "//" + event.domain
        }
        throw"Unable to retrieve the origin of the event";
      }
      function _window_onMessage(event) {
        var origin = _getOrigin(event);
        if(origin == targetOrigin && event.data.substring(0, config.channel.length + 1) == config.channel + " ") {
          pub.up.incoming(event.data.substring(config.channel.length + 1), origin)
        }
      }
      return pub = {outgoing:function(message, domain, fn) {
        callerWindow.postMessage(config.channel + " " + message, domain || targetOrigin);
        if(fn) {
          fn()
        }
      }, destroy:function() {
        un(window, "message", _window_onMessage);
        if(frame) {
          callerWindow = null;
          frame.parentNode.removeChild(frame);
          frame = null
        }
      }, onDOMReady:function() {
        targetOrigin = getLocation(config.remote);
        if(config.isHost) {
          var waitForReady = function(event) {
            if(event.data == config.channel + "-ready") {
              callerWindow = "postMessage" in frame.contentWindow ? frame.contentWindow : frame.contentWindow.document;
              un(window, "message", waitForReady);
              on(window, "message", _window_onMessage);
              setTimeout(function() {
                pub.up.callback(true)
              }, 0)
            }
          };
          on(window, "message", waitForReady);
          apply(config.props, {src:appendQueryParameters(config.remote, {xdm_e:getLocation(location.href), xdm_c:config.channel, xdm_p:1}), name:IFRAME_PREFIX + config.channel + "_provider"});
          frame = createFrame(config)
        }else {
          on(window, "message", _window_onMessage);
          callerWindow = "postMessage" in window.parent ? window.parent : window.parent.document;
          callerWindow.postMessage(config.channel + "-ready", targetOrigin);
          setTimeout(function() {
            pub.up.callback(true)
          }, 0)
        }
      }, init:function() {
        whenReady(pub.onDOMReady, pub)
      }}
    };
    easyXDM.stack.FrameElementTransport = function(config) {
      var pub, frame, send, targetOrigin;
      return pub = {outgoing:function(message, domain, fn) {
        send.call(this, message);
        if(fn) {
          fn()
        }
      }, destroy:function() {
        if(frame) {
          frame.parentNode.removeChild(frame);
          frame = null
        }
      }, onDOMReady:function() {
        targetOrigin = getLocation(config.remote);
        if(config.isHost) {
          apply(config.props, {src:appendQueryParameters(config.remote, {xdm_e:getLocation(location.href), xdm_c:config.channel, xdm_p:5}), name:IFRAME_PREFIX + config.channel + "_provider"});
          frame = createFrame(config);
          frame.fn = function(sendFn) {
            delete frame.fn;
            send = sendFn;
            setTimeout(function() {
              pub.up.callback(true)
            }, 0);
            return function(msg) {
              pub.up.incoming(msg, targetOrigin)
            }
          }
        }else {
          if(document.referrer && getLocation(document.referrer) != query.xdm_e) {
            window.top.location = query.xdm_e
          }
          send = window.frameElement.fn(function(msg) {
            pub.up.incoming(msg, targetOrigin)
          });
          pub.up.callback(true)
        }
      }, init:function() {
        whenReady(pub.onDOMReady, pub)
      }}
    };
    easyXDM.stack.NameTransport = function(config) {
      var pub;
      var isHost, callerWindow, remoteWindow, readyCount, callback, remoteOrigin, remoteUrl;
      function _sendMessage(message) {
        var url = config.remoteHelper + (isHost ? "#_3" : "#_2") + config.channel;
        callerWindow.contentWindow.sendMessage(message, url)
      }
      function _onReady() {
        if(isHost) {
          if(++readyCount === 2 || !isHost) {
            pub.up.callback(true)
          }
        }else {
          _sendMessage("ready");
          pub.up.callback(true)
        }
      }
      function _onMessage(message) {
        pub.up.incoming(message, remoteOrigin)
      }
      function _onLoad() {
        if(callback) {
          setTimeout(function() {
            callback(true)
          }, 0)
        }
      }
      return pub = {outgoing:function(message, domain, fn) {
        callback = fn;
        _sendMessage(message)
      }, destroy:function() {
        callerWindow.parentNode.removeChild(callerWindow);
        callerWindow = null;
        if(isHost) {
          remoteWindow.parentNode.removeChild(remoteWindow);
          remoteWindow = null
        }
      }, onDOMReady:function() {
        isHost = config.isHost;
        readyCount = 0;
        remoteOrigin = getLocation(config.remote);
        config.local = resolveUrl(config.local);
        if(isHost) {
          easyXDM.Fn.set(config.channel, function(message) {
            if(isHost && message === "ready") {
              easyXDM.Fn.set(config.channel, _onMessage);
              _onReady()
            }
          });
          remoteUrl = appendQueryParameters(config.remote, {xdm_e:config.local, xdm_c:config.channel, xdm_p:2});
          apply(config.props, {src:remoteUrl + "#" + config.channel, name:IFRAME_PREFIX + config.channel + "_provider"});
          remoteWindow = createFrame(config)
        }else {
          config.remoteHelper = config.remote;
          easyXDM.Fn.set(config.channel, _onMessage)
        }
        callerWindow = createFrame({props:{src:config.local + "#_4" + config.channel}, onLoad:function onLoad() {
          var w = callerWindow || this;
          un(w, "load", onLoad);
          easyXDM.Fn.set(config.channel + "_load", _onLoad);
          (function test() {
            if(typeof w.contentWindow.sendMessage == "function") {
              _onReady()
            }else {
              setTimeout(test, 50)
            }
          })()
        }})
      }, init:function() {
        whenReady(pub.onDOMReady, pub)
      }}
    };
    easyXDM.stack.HashTransport = function(config) {
      var pub;
      var me = this, isHost, _timer, pollInterval, _lastMsg, _msgNr, _listenerWindow, _callerWindow;
      var useParent, _remoteOrigin;
      function _sendMessage(message) {
        if(!_callerWindow) {
          return
        }
        var url = config.remote + "#" + _msgNr++ + "_" + message;
        (isHost || !useParent ? _callerWindow.contentWindow : _callerWindow).location = url
      }
      function _handleHash(hash) {
        _lastMsg = hash;
        pub.up.incoming(_lastMsg.substring(_lastMsg.indexOf("_") + 1), _remoteOrigin)
      }
      function _pollHash() {
        if(!_listenerWindow) {
          return
        }
        var href = _listenerWindow.location.href, hash = "", indexOf = href.indexOf("#");
        if(indexOf != -1) {
          hash = href.substring(indexOf)
        }
        if(hash && hash != _lastMsg) {
          _handleHash(hash)
        }
      }
      function _attachListeners() {
        _timer = setInterval(_pollHash, pollInterval)
      }
      return pub = {outgoing:function(message, domain) {
        _sendMessage(message)
      }, destroy:function() {
        window.clearInterval(_timer);
        if(isHost || !useParent) {
          _callerWindow.parentNode.removeChild(_callerWindow)
        }
        _callerWindow = null
      }, onDOMReady:function() {
        isHost = config.isHost;
        pollInterval = config.interval;
        _lastMsg = "#" + config.channel;
        _msgNr = 0;
        useParent = config.useParent;
        _remoteOrigin = getLocation(config.remote);
        if(isHost) {
          config.props = {src:config.remote, name:IFRAME_PREFIX + config.channel + "_provider"};
          if(useParent) {
            config.onLoad = function() {
              _listenerWindow = window;
              _attachListeners();
              pub.up.callback(true)
            }
          }else {
            var tries = 0, max = config.delay / 50;
            (function getRef() {
              if(++tries > max) {
                throw new Error("Unable to reference listenerwindow");
              }
              try {
                _listenerWindow = _callerWindow.contentWindow.frames[IFRAME_PREFIX + config.channel + "_consumer"]
              }catch(ex) {
              }
              if(_listenerWindow) {
                _attachListeners();
                pub.up.callback(true)
              }else {
                setTimeout(getRef, 50)
              }
            })()
          }
          _callerWindow = createFrame(config)
        }else {
          _listenerWindow = window;
          _attachListeners();
          if(useParent) {
            _callerWindow = parent;
            pub.up.callback(true)
          }else {
            apply(config, {props:{src:config.remote + "#" + config.channel + new Date, name:IFRAME_PREFIX + config.channel + "_consumer"}, onLoad:function() {
              pub.up.callback(true)
            }});
            _callerWindow = createFrame(config)
          }
        }
      }, init:function() {
        whenReady(pub.onDOMReady, pub)
      }}
    };
    easyXDM.stack.ReliableBehavior = function(config) {
      var pub, callback;
      var idOut = 0, idIn = 0, currentMessage = "";
      return pub = {incoming:function(message, origin) {
        var indexOf = message.indexOf("_"), ack = message.substring(0, indexOf).split(",");
        message = message.substring(indexOf + 1);
        if(ack[0] == idOut) {
          currentMessage = "";
          if(callback) {
            callback(true)
          }
        }
        if(message.length > 0) {
          pub.down.outgoing(ack[1] + "," + idOut + "_" + currentMessage, origin);
          if(idIn != ack[1]) {
            idIn = ack[1];
            pub.up.incoming(message, origin)
          }
        }
      }, outgoing:function(message, origin, fn) {
        currentMessage = message;
        callback = fn;
        pub.down.outgoing(idIn + "," + ++idOut + "_" + message, origin)
      }}
    };
    easyXDM.stack.QueueBehavior = function(config) {
      var pub, queue = [], waiting = true, incoming = "", destroying, maxLength = 0, lazy = false, doFragment = false;
      function dispatch() {
        if(config.remove && queue.length === 0) {
          removeFromStack(pub);
          return
        }
        if(waiting || queue.length === 0 || destroying) {
          return
        }
        waiting = true;
        var message = queue.shift();
        pub.down.outgoing(message.data, message.origin, function(success) {
          waiting = false;
          if(message.callback) {
            setTimeout(function() {
              message.callback(success)
            }, 0)
          }
          dispatch()
        })
      }
      return pub = {init:function() {
        if(undef(config)) {
          config = {}
        }
        if(config.maxLength) {
          maxLength = config.maxLength;
          doFragment = true
        }
        if(config.lazy) {
          lazy = true
        }else {
          pub.down.init()
        }
      }, callback:function(success) {
        waiting = false;
        var up = pub.up;
        dispatch();
        up.callback(success)
      }, incoming:function(message, origin) {
        if(doFragment) {
          var indexOf = message.indexOf("_"), seq = parseInt(message.substring(0, indexOf), 10);
          incoming += message.substring(indexOf + 1);
          if(seq === 0) {
            if(config.encode) {
              incoming = decodeURIComponent(incoming)
            }
            pub.up.incoming(incoming, origin);
            incoming = ""
          }
        }else {
          pub.up.incoming(message, origin)
        }
      }, outgoing:function(message, origin, fn) {
        if(config.encode) {
          message = encodeURIComponent(message)
        }
        var fragments = [], fragment;
        if(doFragment) {
          while(message.length !== 0) {
            fragment = message.substring(0, maxLength);
            message = message.substring(fragment.length);
            fragments.push(fragment)
          }
          while(fragment = fragments.shift()) {
            queue.push({data:fragments.length + "_" + fragment, origin:origin, callback:fragments.length === 0 ? fn : null})
          }
        }else {
          queue.push({data:message, origin:origin, callback:fn})
        }
        if(lazy) {
          pub.down.init()
        }else {
          dispatch()
        }
      }, destroy:function() {
        destroying = true;
        pub.down.destroy()
      }}
    };
    easyXDM.stack.VerifyBehavior = function(config) {
      var pub, mySecret, theirSecret, verified = false;
      function startVerification() {
        mySecret = Math.random().toString(16).substring(2);
        pub.down.outgoing(mySecret)
      }
      return pub = {incoming:function(message, origin) {
        var indexOf = message.indexOf("_");
        if(indexOf === -1) {
          if(message === mySecret) {
            pub.up.callback(true)
          }else {
            if(!theirSecret) {
              theirSecret = message;
              if(!config.initiate) {
                startVerification()
              }
              pub.down.outgoing(message)
            }
          }
        }else {
          if(message.substring(0, indexOf) === theirSecret) {
            pub.up.incoming(message.substring(indexOf + 1), origin)
          }
        }
      }, outgoing:function(message, origin, fn) {
        pub.down.outgoing(mySecret + "_" + message, origin, fn)
      }, callback:function(success) {
        if(config.initiate) {
          startVerification()
        }
      }}
    };
    easyXDM.stack.RpcBehavior = function(proxy, config) {
      var pub, serializer = config.serializer || getJSON();
      var _callbackCounter = 0, _callbacks = {};
      function _send(data) {
        data.jsonrpc = "2.0";
        pub.down.outgoing(serializer.stringify(data))
      }
      function _createMethod(definition, method) {
        var slice = Array.prototype.slice;
        return function() {
          var l = arguments.length, callback, message = {method:method};
          if(l > 0 && typeof arguments[l - 1] === "function") {
            if(l > 1 && typeof arguments[l - 2] === "function") {
              callback = {success:arguments[l - 2], error:arguments[l - 1]};
              message.params = slice.call(arguments, 0, l - 2)
            }else {
              callback = {success:arguments[l - 1]};
              message.params = slice.call(arguments, 0, l - 1)
            }
            _callbacks["" + ++_callbackCounter] = callback;
            message.id = _callbackCounter
          }else {
            message.params = slice.call(arguments, 0)
          }
          if(definition.namedParams && message.params.length === 1) {
            message.params = message.params[0]
          }
          _send(message)
        }
      }
      function _executeMethod(method, id, fn, params) {
        if(!fn) {
          if(id) {
            _send({id:id, error:{code:-32601, message:"Procedure not found."}})
          }
          return
        }
        var success, error;
        if(id) {
          success = function(result) {
            success = emptyFn;
            _send({id:id, result:result})
          };
          error = function(message, data) {
            error = emptyFn;
            var msg = {id:id, error:{code:-32099, message:message}};
            if(data) {
              msg.error.data = data
            }
            _send(msg)
          }
        }else {
          success = error = emptyFn
        }
        if(!isArray(params)) {
          params = [params]
        }
        try {
          var result = fn.method.apply(fn.scope, params.concat([success, error]));
          if(!undef(result)) {
            success(result)
          }
        }catch(ex1) {
          error(ex1.message)
        }
      }
      return pub = {incoming:function(message, origin) {
        var data = serializer.parse(message);
        if(data.method) {
          if(config.handle) {
            config.handle(data, _send)
          }else {
            _executeMethod(data.method, data.id, config.local[data.method], data.params)
          }
        }else {
          var callback = _callbacks[data.id];
          if(data.error) {
            if(callback.error) {
              callback.error(data.error)
            }
          }else {
            if(callback.success) {
              callback.success(data.result)
            }
          }
          delete _callbacks[data.id]
        }
      }, init:function() {
        if(config.remote) {
          for(var method in config.remote) {
            if(config.remote.hasOwnProperty(method)) {
              proxy[method] = _createMethod(config.remote[method], method)
            }
          }
        }
        pub.down.init()
      }, destroy:function() {
        for(var method in config.remote) {
          if(config.remote.hasOwnProperty(method) && proxy.hasOwnProperty(method)) {
            delete proxy[method]
          }
        }
        pub.down.destroy()
      }}
    };
    global.easyXDM = easyXDM
  })(window, document, location, window.setTimeout, decodeURIComponent, encodeURIComponent)
}
;(function() {
  if("undefined" !== typeof window) {
    var polyfillRequestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
      window.setTimeout(callback, 1E3 / 60)
    };
    if(!window.requestAnimationFrame) {
      window.requestAnimationFrame = polyfillRequestAnimationFrame
    }
  }
})();
(function(definition) {
  definition()
})(function() {
  if(!Function.prototype.bind) {
    Function.prototype.bind = function bind(that) {
      var target = this;
      if(typeof target != "function") {
        throw new TypeError("Function.prototype.bind called on incompatible " + target);
      }
      var args = slice.call(arguments, 1);
      var bound = function() {
        if(this instanceof bound) {
          var F = function() {
          };
          F.prototype = target.prototype;
          var self = new F;
          var result = target.apply(self, args.concat(slice.call(arguments)));
          if(Object(result) === result) {
            return result
          }
          return self
        }else {
          return target.apply(that, args.concat(slice.call(arguments)))
        }
      };
      return bound
    }
  }
  var call = Function.prototype.call;
  var prototypeOfArray = Array.prototype;
  var prototypeOfObject = Object.prototype;
  var slice = prototypeOfArray.slice;
  var _toString = call.bind(prototypeOfObject.toString);
  var owns = call.bind(prototypeOfObject.hasOwnProperty);
  var defineGetter;
  var defineSetter;
  var lookupGetter;
  var lookupSetter;
  var supportsAccessors;
  if(supportsAccessors = owns(prototypeOfObject, "__defineGetter__")) {
    defineGetter = call.bind(prototypeOfObject.__defineGetter__);
    defineSetter = call.bind(prototypeOfObject.__defineSetter__);
    lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
    lookupSetter = call.bind(prototypeOfObject.__lookupSetter__)
  }
  if(!Array.isArray) {
    Array.isArray = function isArray(obj) {
      return _toString(obj) == "[object Array]"
    }
  }
  if(!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach(fun) {
      var self = toObject(this), thisp = arguments[1], i = -1, length = self.length >>> 0;
      if(_toString(fun) != "[object Function]") {
        throw new TypeError;
      }
      while(++i < length) {
        if(i in self) {
          fun.call(thisp, self[i], i, self)
        }
      }
    }
  }
  if(!Array.prototype.map) {
    Array.prototype.map = function map(fun) {
      var self = toObject(this), length = self.length >>> 0, result = Array(length), thisp = arguments[1];
      if(_toString(fun) != "[object Function]") {
        throw new TypeError(fun + " is not a function");
      }
      for(var i = 0;i < length;i++) {
        if(i in self) {
          result[i] = fun.call(thisp, self[i], i, self)
        }
      }
      return result
    }
  }
  if(!Array.prototype.filter) {
    Array.prototype.filter = function filter(fun) {
      var self = toObject(this), length = self.length >>> 0, result = [], value, thisp = arguments[1];
      if(_toString(fun) != "[object Function]") {
        throw new TypeError(fun + " is not a function");
      }
      for(var i = 0;i < length;i++) {
        if(i in self) {
          value = self[i];
          if(fun.call(thisp, value, i, self)) {
            result.push(value)
          }
        }
      }
      return result
    }
  }
  if(!Array.prototype.every) {
    Array.prototype.every = function every(fun) {
      var self = toObject(this), length = self.length >>> 0, thisp = arguments[1];
      if(_toString(fun) != "[object Function]") {
        throw new TypeError(fun + " is not a function");
      }
      for(var i = 0;i < length;i++) {
        if(i in self && !fun.call(thisp, self[i], i, self)) {
          return false
        }
      }
      return true
    }
  }
  if(!Array.prototype.some) {
    Array.prototype.some = function some(fun) {
      var self = toObject(this), length = self.length >>> 0, thisp = arguments[1];
      if(_toString(fun) != "[object Function]") {
        throw new TypeError(fun + " is not a function");
      }
      for(var i = 0;i < length;i++) {
        if(i in self && fun.call(thisp, self[i], i, self)) {
          return true
        }
      }
      return false
    }
  }
  if(!Array.prototype.reduce) {
    Array.prototype.reduce = function reduce(fun) {
      var self = toObject(this), length = self.length >>> 0;
      if(_toString(fun) != "[object Function]") {
        throw new TypeError(fun + " is not a function");
      }
      if(!length && arguments.length == 1) {
        throw new TypeError("reduce of empty array with no initial value");
      }
      var i = 0;
      var result;
      if(arguments.length >= 2) {
        result = arguments[1]
      }else {
        do {
          if(i in self) {
            result = self[i++];
            break
          }
          if(++i >= length) {
            throw new TypeError("reduce of empty array with no initial value");
          }
        }while(true)
      }
      for(;i < length;i++) {
        if(i in self) {
          result = fun.call(void 0, result, self[i], i, self)
        }
      }
      return result
    }
  }
  if(!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function reduceRight(fun) {
      var self = toObject(this), length = self.length >>> 0;
      if(_toString(fun) != "[object Function]") {
        throw new TypeError(fun + " is not a function");
      }
      if(!length && arguments.length == 1) {
        throw new TypeError("reduceRight of empty array with no initial value");
      }
      var result, i = length - 1;
      if(arguments.length >= 2) {
        result = arguments[1]
      }else {
        do {
          if(i in self) {
            result = self[i--];
            break
          }
          if(--i < 0) {
            throw new TypeError("reduceRight of empty array with no initial value");
          }
        }while(true)
      }
      do {
        if(i in this) {
          result = fun.call(void 0, result, self[i], i, self)
        }
      }while(i--);
      return result
    }
  }
  if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function indexOf(sought) {
      var self = toObject(this), length = self.length >>> 0;
      if(!length) {
        return-1
      }
      var i = 0;
      if(arguments.length > 1) {
        i = toInteger(arguments[1])
      }
      i = i >= 0 ? i : Math.max(0, length + i);
      for(;i < length;i++) {
        if(i in self && self[i] === sought) {
          return i
        }
      }
      return-1
    }
  }
  if(!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function lastIndexOf(sought) {
      var self = toObject(this), length = self.length >>> 0;
      if(!length) {
        return-1
      }
      var i = length - 1;
      if(arguments.length > 1) {
        i = Math.min(i, toInteger(arguments[1]))
      }
      i = i >= 0 ? i : length - Math.abs(i);
      for(;i >= 0;i--) {
        if(i in self && sought === self[i]) {
          return i
        }
      }
      return-1
    }
  }
  if(!Object.getPrototypeOf) {
    Object.getPrototypeOf = function getPrototypeOf(object) {
      return object.__proto__ || (object.constructor ? object.constructor.prototype : prototypeOfObject)
    }
  }
  if(!Object.getOwnPropertyDescriptor) {
    var ERR_NON_OBJECT = "Object.getOwnPropertyDescriptor called on a non-object: ";
    Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
      if(typeof object != "object" && typeof object != "function" || object === null) {
        throw new TypeError(ERR_NON_OBJECT + object);
      }
      if(!owns(object, property)) {
        return
      }
      var descriptor = {enumerable:true, configurable:true};
      if(supportsAccessors) {
        var prototype = object.__proto__;
        object.__proto__ = prototypeOfObject;
        var getter = lookupGetter(object, property);
        var setter = lookupSetter(object, property);
        object.__proto__ = prototype;
        if(getter || setter) {
          if(getter) {
            descriptor.get = getter
          }
          if(setter) {
            descriptor.set = setter
          }
          return descriptor
        }
      }
      descriptor.value = object[property];
      return descriptor
    }
  }
  if(!Object.getOwnPropertyNames) {
    Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
      return Object.keys(object)
    }
  }
  if(!Object.create) {
    Object.create = function create(prototype, properties) {
      var object;
      if(prototype === null) {
        object = {"__proto__":null}
      }else {
        if(typeof prototype != "object") {
          throw new TypeError("typeof prototype[" + typeof prototype + "] != 'object'");
        }
        var Type = function() {
        };
        Type.prototype = prototype;
        object = new Type;
        object.__proto__ = prototype
      }
      if(properties !== void 0) {
        Object.defineProperties(object, properties)
      }
      return object
    }
  }
  function doesDefinePropertyWork(object) {
    try {
      Object.defineProperty(object, "sentinel", {});
      return"sentinel" in object
    }catch(exception) {
    }
  }
  if(Object.defineProperty) {
    var definePropertyWorksOnObject = doesDefinePropertyWork({});
    var definePropertyWorksOnDom = typeof document == "undefined" || doesDefinePropertyWork(document.createElement("div"));
    if(!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
      var definePropertyFallback = Object.defineProperty
    }
  }
  if(!Object.defineProperty || definePropertyFallback) {
    var ERR_NON_OBJECT_DESCRIPTOR = "Property description must be an object: ";
    var ERR_NON_OBJECT_TARGET = "Object.defineProperty called on non-object: ";
    var ERR_ACCESSORS_NOT_SUPPORTED = "getters & setters can not be defined " + "on this javascript engine";
    Object.defineProperty = function defineProperty(object, property, descriptor) {
      if(typeof object != "object" && typeof object != "function" || object === null) {
        throw new TypeError(ERR_NON_OBJECT_TARGET + object);
      }
      if(typeof descriptor != "object" && typeof descriptor != "function" || descriptor === null) {
        throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);
      }
      if(definePropertyFallback) {
        try {
          return definePropertyFallback.call(Object, object, property, descriptor)
        }catch(exception) {
        }
      }
      if(owns(descriptor, "value")) {
        if(supportsAccessors && (lookupGetter(object, property) || lookupSetter(object, property))) {
          var prototype = object.__proto__;
          object.__proto__ = prototypeOfObject;
          delete object[property];
          object[property] = descriptor.value;
          object.__proto__ = prototype
        }else {
          object[property] = descriptor.value
        }
      }else {
        if(!supportsAccessors) {
          throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
        }
        if(owns(descriptor, "get")) {
          defineGetter(object, property, descriptor.get)
        }
        if(owns(descriptor, "set")) {
          defineSetter(object, property, descriptor.set)
        }
      }
      return object
    }
  }
  if(!Object.defineProperties) {
    Object.defineProperties = function defineProperties(object, properties) {
      for(var property in properties) {
        if(owns(properties, property) && property != "__proto__") {
          Object.defineProperty(object, property, properties[property])
        }
      }
      return object
    }
  }
  if(!Object.seal) {
    Object.seal = function seal(object) {
      return object
    }
  }
  if(!Object.freeze) {
    Object.freeze = function freeze(object) {
      return object
    }
  }
  try {
    Object.freeze(function() {
    })
  }catch(exception) {
    Object.freeze = function freeze(freezeObject) {
      return function freeze(object) {
        if(typeof object == "function") {
          return object
        }else {
          return freezeObject(object)
        }
      }
    }(Object.freeze)
  }
  if(!Object.preventExtensions) {
    Object.preventExtensions = function preventExtensions(object) {
      return object
    }
  }
  if(!Object.isSealed) {
    Object.isSealed = function isSealed(object) {
      return false
    }
  }
  if(!Object.isFrozen) {
    Object.isFrozen = function isFrozen(object) {
      return false
    }
  }
  if(!Object.isExtensible) {
    Object.isExtensible = function isExtensible(object) {
      if(Object(object) !== object) {
        throw new TypeError;
      }
      var name = "";
      while(owns(object, name)) {
        name += "?"
      }
      object[name] = true;
      var returnValue = owns(object, name);
      delete object[name];
      return returnValue
    }
  }
  if(!Object.keys) {
    var hasDontEnumBug = true, dontEnums = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"], dontEnumsLength = dontEnums.length;
    for(var key in{"toString":null}) {
      hasDontEnumBug = false
    }
    Object.keys = function keys(object) {
      if(typeof object != "object" && typeof object != "function" || object === null) {
        throw new TypeError("Object.keys called on a non-object");
      }
      var keys = [];
      for(var name in object) {
        if(owns(object, name)) {
          keys.push(name)
        }
      }
      if(hasDontEnumBug) {
        for(var i = 0, ii = dontEnumsLength;i < ii;i++) {
          var dontEnum = dontEnums[i];
          if(owns(object, dontEnum)) {
            keys.push(dontEnum)
          }
        }
      }
      return keys
    }
  }
  if(!Date.prototype.toISOString || (new Date(-621987552E5)).toISOString().indexOf("-000001") === -1) {
    Date.prototype.toISOString = function toISOString() {
      var result, length, value, year;
      if(!isFinite(this)) {
        throw new RangeError("Date.prototype.toISOString called on non-finite value.");
      }
      result = [this.getUTCMonth() + 1, this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()];
      year = this.getUTCFullYear();
      year = (year < 0 ? "-" : year > 9999 ? "+" : "") + ("00000" + Math.abs(year)).slice(0 <= year && year <= 9999 ? -4 : -6);
      length = result.length;
      while(length--) {
        value = result[length];
        if(value < 10) {
          result[length] = "0" + value
        }
      }
      return year + "-" + result.slice(0, 2).join("-") + "T" + result.slice(2).join(":") + "." + ("000" + this.getUTCMilliseconds()).slice(-3) + "Z"
    }
  }
  if(!Date.now) {
    Date.now = function now() {
      return(new Date).getTime()
    }
  }
  if(!Date.prototype.toJSON) {
    Date.prototype.toJSON = function toJSON(key) {
      if(typeof this.toISOString != "function") {
        throw new TypeError("toISOString property is not callable");
      }
      return this.toISOString()
    }
  }
  if(!Date.parse || Date.parse("+275760-09-13T00:00:00.000Z") !== 864E13) {
    Date = function(NativeDate) {
      var Date = function Date(Y, M, D, h, m, s, ms) {
        var length = arguments.length;
        if(this instanceof NativeDate) {
          var date = length == 1 && String(Y) === Y ? new NativeDate(Date.parse(Y)) : length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) : length >= 6 ? new NativeDate(Y, M, D, h, m, s) : length >= 5 ? new NativeDate(Y, M, D, h, m) : length >= 4 ? new NativeDate(Y, M, D, h) : length >= 3 ? new NativeDate(Y, M, D) : length >= 2 ? new NativeDate(Y, M) : length >= 1 ? new NativeDate(Y) : new NativeDate;
          date.constructor = Date;
          return date
        }
        return NativeDate.apply(this, arguments)
      };
      var isoDateExpression = new RegExp("^" + "(\\d{4}|[+-]\\d{6})" + "(?:-(\\d{2})" + "(?:-(\\d{2})" + "(?:" + "T(\\d{2})" + ":(\\d{2})" + "(?:" + ":(\\d{2})" + "(?:\\.(\\d{3}))?" + ")?" + "(?:" + "Z|" + "(?:" + "([-+])" + "(\\d{2})" + ":(\\d{2})" + ")" + ")?)?)?)?" + "$");
      for(var key in NativeDate) {
        Date[key] = NativeDate[key]
      }
      Date.now = NativeDate.now;
      Date.UTC = NativeDate.UTC;
      Date.prototype = NativeDate.prototype;
      Date.prototype.constructor = Date;
      Date.parse = function parse(string) {
        var match = isoDateExpression.exec(string);
        if(match) {
          match.shift();
          for(var i = 1;i < 7;i++) {
            match[i] = +(match[i] || (i < 3 ? 1 : 0));
            if(i == 1) {
              match[i]--
            }
          }
          var minuteOffset = +match.pop(), hourOffset = +match.pop(), sign = match.pop();
          var offset = 0;
          if(sign) {
            if(hourOffset > 23 || minuteOffset > 59) {
              return NaN
            }
            offset = (hourOffset * 60 + minuteOffset) * 6E4 * (sign == "+" ? -1 : 1)
          }
          var year = +match[0];
          if(0 <= year && year <= 99) {
            match[0] = year + 400;
            return NativeDate.UTC.apply(this, match) + offset - 126227808E5
          }
          return NativeDate.UTC.apply(this, match) + offset
        }
        return NativeDate.parse.apply(this, arguments)
      };
      return Date
    }(Date)
  }
  var ws = "\t\n\x0B\f\r \u00a0\u1680\u180e\u2000\u2001\u2002\u2003" + "\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028" + "\u2029\ufeff";
  if(!String.prototype.trim || ws.trim()) {
    ws = "[" + ws + "]";
    var trimBeginRegexp = new RegExp("^" + ws + ws + "*"), trimEndRegexp = new RegExp(ws + ws + "*$");
    String.prototype.trim = function trim() {
      if(this === undefined || this === null) {
        throw new TypeError("can't convert " + this + " to object");
      }
      return String(this).replace(trimBeginRegexp, "").replace(trimEndRegexp, "")
    }
  }
  var toInteger = function(n) {
    n = +n;
    if(n !== n) {
      n = 0
    }else {
      if(n !== 0 && n !== 1 / 0 && n !== -(1 / 0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n))
      }
    }
    return n
  };
  var prepareString = "a"[0] != "a";
  var toObject = function(o) {
    if(o == null) {
      throw new TypeError("can't convert " + o + " to object");
    }
    if(prepareString && typeof o == "string" && o) {
      return o.split("")
    }
    return Object(o)
  }
});
(function(module) {
  function WeakMap() {
    var keys = [], values = [];
    return create(WeakMapPrototype, {"delete":{value:bind.call(sharedDel, null, true, keys, values)}, get:{value:bind.call(sharedGet, null, true, keys, values)}, has:{value:bind.call(sharedHas, null, true, keys, values)}, set:{value:bind.call(sharedSet, null, true, keys, values)}})
  }
  function Map() {
    var keys = [], values = [];
    return create(MapPrototype, {"delete":{value:bind.call(sharedDel, null, false, keys, values)}, get:{value:bind.call(sharedGet, null, false, keys, values)}, has:{value:bind.call(sharedHas, null, false, keys, values)}, set:{value:bind.call(sharedSet, null, false, keys, values)}})
  }
  function Set() {
    var keys = [], values = [], has = bind.call(sharedHas, null, false, values, keys);
    return create(SetPrototype, {"delete":{value:bind.call(sharedDel, null, false, values, keys)}, has:{value:has}, add:{value:bind.call(Set_add, null, false, has, values)}})
  }
  function sharedDel(objectOnly, keys, values, key) {
    if(sharedHas(objectOnly, keys, values, key)) {
      keys.splice(i, 1);
      values.splice(i, 1)
    }
    return-1 < i
  }
  function sharedGet(objectOnly, keys, values, key) {
    return sharedHas(objectOnly, keys, values, key) ? values[i] : undefined
  }
  function sharedHas(objectOnly, keys, values, key) {
    if(objectOnly && key !== new Object(key)) {
      throw new TypeError("not a non-null object");
    }
    i = betterIndexOf.call(keys, key);
    return-1 < i
  }
  function sharedSet(objectOnly, keys, values, key, value) {
    if(sharedHas(objectOnly, keys, values, key)) {
      values[i] = value
    }else {
      values[keys.push(key) - 1] = value
    }
  }
  function Set_add(objectOnly, has, values, value) {
    if(!has(value)) {
      values.push(value)
    }
  }
  function betterIndexOf(value) {
    var i;
    if(value != value || value === 0) {
      for(i = this.length;i-- && !is(this[i], value);) {
      }
    }else {
      i = indexOf.call(this, value)
    }
    return i
  }
  function Constructor() {
  }
  var WeakMapPrototype = WeakMap.prototype, MapPrototype = Map.prototype, SetPrototype = Set.prototype, defineProperty = Object.defineProperty, slice = [].slice, is = Object.is || function(a, b) {
    return a === b ? a !== 0 || 1 / a == 1 / b : a != a && b != b
  }, bind = WeakMap.bind || function bind(context, objectOnly, keys, values) {
    var callback = this;
    return function bound(key, value) {
      return callback.call(context, objectOnly, keys, values, key, value)
    }
  }, create = Object.create || function create(proto, descriptor) {
    Constructor.prototype = proto;
    var object = new Constructor, key;
    for(key in descriptor) {
      object[key] = descriptor[key].value
    }
    return object
  }, indexOf = [].indexOf || function indexOf(value) {
    for(i = this.length;i-- && this[i] !== value;) {
    }
    return i
  }, i;
  WeakMap.prototype = WeakMapPrototype = new WeakMap;
  Map.prototype = MapPrototype = new Map;
  Set.prototype = SetPrototype = new Set;
  module.Set = module.Set || Set
})(this);
var IMVU = IMVU || {};
(function() {
  IMVU.repr = function(v, limit) {
    function internalRepr(v, limit, _seen) {
      var t = typeof v;
      if(v === undefined) {
        return"undefined"
      }else {
        if(v === null) {
          return"null"
        }else {
          if(t === "number" || t === "boolean") {
            return v.toString()
          }else {
            if(t === "string") {
              return"'" + v.toString() + "'"
            }else {
              if(t === "function") {
                return v.toString()
              }
            }
          }
        }
      }
      if(typeof document !== "undefined" && v === document) {
        return"<#document>"
      }
      if(typeof window !== "undefined" && v === window) {
        return"<#window>"
      }
      if(typeof global !== "undefined" && v === global) {
        return"<#global>"
      }
      if(!_.isUndefined(v.jquery)) {
        return"$('" + v.selector + "')"
      }
      if(typeof HTMLElement !== "undefined" && v instanceof HTMLElement) {
        return"<#HTMLElement: " + v.innerHTML + ">"
      }
      if(_seen === undefined) {
        _seen = new Set
      }
      if(_seen.has(v)) {
        return"<Cycle>"
      }
      _seen.add(v);
      try {
        if(v instanceof Array) {
          var rv = "[";
          var len = v.length;
          for(var i = 0;i < len && (limit === undefined || rv.length < limit);++i) {
            var newLimit = limit === undefined ? undefined : limit - rv.length;
            rv += internalRepr(v[i], newLimit, _seen) + (i < len - 1 ? ", " : "")
          }
          return rv + "]"
        }else {
          var rv = "";
          var c = v.constructor;
          if(Object !== c) {
            rv += "<#" + (c === undefined ? "undefined" : c.name) + " "
          }
          rv += "{";
          var first = true;
          var keys = Object.keys(v);
          keys.sort();
          var keysLength = keys.length;
          for(var i = 0;i < keysLength && (limit === undefined || rv.length < limit);++i) {
            var k = keys[i];
            var e = v[k];
            var newLimit = limit === undefined ? undefined : limit - rv.length;
            rv += (first ? "" : ", ") + k + ": " + internalRepr(e, newLimit, _seen);
            first = false
          }
          rv += "}";
          if(Object !== c) {
            rv += ">"
          }
          return rv
        }
      }finally {
        _seen["delete"](v)
      }
    }
    return internalRepr(v, limit).substring(0, limit)
  }
})();
var IMVU = IMVU || {};
(function() {
  var slice = [].slice;
  IMVU["new"] = function new_(constructor) {
    if(!(constructor instanceof Function)) {
      throw new TypeError("IMVU.new called with constructor type " + typeof constructor + " which is not a function");
    }
    var dummy = IMVU.createNamedFunction(constructor.name, function() {
    });
    dummy.prototype = constructor.prototype;
    var obj = new dummy;
    var r = constructor.apply(obj, slice.call(arguments, 1));
    return r instanceof Object ? r : obj
  }
})();
var IMVU = IMVU || {};
(function() {
  IMVU.extendError = function extendError(baseErrorType, errorName) {
    var errorClass = IMVU.createNamedFunction(errorName, function(message) {
      this.name = errorName;
      this.message = message;
      var stack = (new Error(message)).stack;
      if(stack !== undefined) {
        this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "")
      }
    });
    errorClass.prototype = Object.create(baseErrorType.prototype);
    errorClass.prototype.constructor = errorClass;
    errorClass.prototype.toString = function() {
      if(this.message === undefined) {
        return this.name
      }else {
        return this.name + ": " + this.message
      }
    };
    return errorClass
  }
})();
var IMVU = IMVU || {};
(function() {
  IMVU.isSubClass = function isSubClass(cls, parent) {
    if(!(cls instanceof Function)) {
      throw new TypeError("class must be a constructor");
    }
    if(cls === parent) {
      return true
    }
    var e = cls.prototype;
    return e instanceof parent
  }
})();
var IMVU = IMVU || {};
(function() {
  IMVU.createNamedFunction = function(name, body) {
    return(new Function("body", "return function " + name + "() {\n" + "    return body.apply(this, arguments);\n" + "};\n"))(body)
  }
})();
var IMVU = IMVU || {};
(function() {
  var BaseClass = function() {
  };
  BaseClass.extend = function(name, def, classDef) {
    if(typeof name !== "string" || null === name.match(/[a-z_][0-9a-z_]*/i)) {
      var msg = "First argument to BaseClass.extend must be the class name.  Actual: " + IMVU.repr(name);
      console.error(msg);
      throw new TypeError(msg);
    }
    var NewClass = IMVU.createNamedFunction(name, function() {
      this.initialize.apply(this, arguments)
    });
    _.extend(NewClass, this, classDef);
    NewClass.prototype = Object.create(this.prototype, {constructor:{value:NewClass}});
    _.extend(NewClass.prototype, def);
    Object.freeze(NewClass);
    return NewClass
  };
  BaseClass.prototype.initialize = function() {
  };
  if(typeof exports !== "undefined") {
    if(typeof module !== "undefined" && module.exports) {
      exports = module.exports = BaseClass
    }
    exports.BaseClass = BaseClass
  }else {
    var g = "undefined" !== typeof window ? window : global;
    g.BaseClass = BaseClass;
    g.IMVU = g.IMVU || {};
    g.IMVU.BaseClass = BaseClass
  }
})();
var IMVU = IMVU || {};
(function() {
  IMVU.ServiceProvider = BaseClass.extend("ServiceProvider", {initialize:function() {
    this.services = {}
  }, get:function(name) {
    if(!this.services.hasOwnProperty(name)) {
      throw new ReferenceError('No service registered for "' + name + '"');
    }
    return this.services[name]
  }, register:function(name, instance) {
    this.services[name] = instance
  }, "new":function(type) {
    var args = Array.prototype.slice.call(arguments, 1);
    var options = args.pop() || {};
    var dependencies = type.dependencies || type.prototype.dependencies || [];
    if(!(dependencies instanceof Array)) {
      throw new SyntaxError("Dependencies must be an array, was: " + IMVU.repr(dependencies));
    }
    Object.freeze(dependencies);
    options = _.defaults(_.extend({serviceProvider:this}, options), _.pick(this.services, dependencies));
    var missing = _.reject(dependencies, _.has.bind(undefined, options));
    if(missing.length) {
      throw new ReferenceError('Unsatisfied dependencies "' + missing.join(", ") + '" when constructing ' + type.name);
    }
    var constructorArgs = [].concat([type], args, [options]);
    return IMVU["new"].apply(undefined, constructorArgs)
  }})
})();
var IMVU = IMVU || {};
(function() {
  IMVU.Random = BaseClass.extend("Random", {getInteger:function(min, max) {
    if(arguments.length < 2) {
      throw new Error("getInteger expected (min, max)");
    }
    return Math.floor(Math.random() * (max - min)) + min
  }, getFloat:function(min, max) {
    if(arguments.length < 2) {
      throw new Error("getFloat expected (min, max)");
    }
    var a = Math.random() * (max - min) + min;
    return a
  }, __swap:function(sequence, a, b) {
    var t = sequence[a];
    sequence[a] = sequence[b];
    sequence[b] = t
  }, sample:function(sequence, numElements) {
    var ret = [];
    var toUndo = [];
    var selection, i;
    for(i = 0;i < numElements;i++) {
      selection = this.getInteger(0, sequence.length - i);
      ret.push(sequence[selection]);
      this.__swap(sequence, selection, sequence.length - i - 1);
      toUndo.push(selection)
    }
    for(i = numElements;i > 0;i--) {
      selection = toUndo.pop();
      this.__swap(sequence, selection, sequence.length - i)
    }
    return ret
  }, choice:function(sequence, excludedElement) {
    var selectionMax = sequence.length;
    if(typeof excludedElement !== "undefined") {
      this.__swap(sequence, excludedElement, sequence.length - 1);
      selectionMax--
    }
    var ret = sequence[this.getInteger(0, selectionMax)];
    if(typeof excludedElement !== "undefined") {
      this.__swap(sequence, excludedElement, sequence.length - 1)
    }
    return ret
  }, shuffle:function(sequence) {
    for(var i = 0;i < sequence.length;i++) {
      this.__swap(sequence, i, this.getInteger(i, sequence.length))
    }
  }, shuffled:function(sequence) {
    var seq = _.clone(sequence);
    this.shuffle(seq);
    return seq
  }})
})();
var IMVU = IMVU || {};
(function() {
  IMVU.moduleCommon = {moduleStateAllowed:false, allowModuleState:function() {
    this.moduleStateAllowed = true
  }, _loadBody:function(body, importList) {
    var impl = body(importList);
    if(!this.moduleStateAllowed && impl instanceof Object) {
      Object.freeze(impl)
    }
    this.moduleStateAllowed = false;
    return impl
  }}
})();
var IMVU = IMVU || {};
(function() {
  var document_ready = false;
  IMVU.Rest = {_numRestRequesters:0, _ltrim:function(str) {
    return str.replace(/^\s+/, "")
  }, _default_arg:function default_arg(arg, default_value) {
    return typeof arg === "undefined" ? default_value : arg
  }, _test_cors_withCredentials_support:function(Xhr) {
    try {
      return Xhr.prototype.hasOwnProperty("withCredentials") || (new Xhr).hasOwnProperty("withCredentials")
    }catch(e) {
      return false
    }
  }, _is_cors_withCredentials_supported:function() {
    return IMVU.Rest._test_cors_withCredentials_support(window.XMLHttpRequest)
  }, _get_translated_subdomain_prefix:function(host) {
    var subdomain = host.split(".")[0];
    return subdomain.length === 2 ? subdomain + "." : ""
  }, _split_first:function split_first(str, ch) {
    var idx = str.indexOf(ch), head = str.substring(0, idx), tail = str.substring(idx);
    return[head, tail]
  }, _parse_http_headers:function parse_http_headers(http_headers) {
    var header_lines = http_headers.replace(/\r\n/, "\n").split("\n"), header_dict = {}, header_line = null, limit = null, keyval = null, key = null, val = null;
    for(header_line in header_lines) {
      if(header_lines.hasOwnProperty(header_line)) {
        limit = 2;
        keyval = IMVU.Rest._split_first(http_headers, ":");
        key = keyval[0];
        val = IMVU.Rest._ltrim(keyval[1]);
        header_dict[key] = val
      }
    }
    return header_dict
  }, createRequester:function mkrest(rpc_target) {
    var requester = {_requesterId:IMVU.Rest._numRestRequesters, rpc_client:null, _rpc_target:rpc_target, ajaxSettings:{}, queue:[], ajax:function(arg_jquery_ajax_settings, arg_imvu_ajax_settings) {
      var jquery_ajax_settings = $.extend({dataType:"json"}, $.ajaxSettings, arg_jquery_ajax_settings), imvu_ajax_settings = $.extend({}, this.ajaxSettings, arg_imvu_ajax_settings);
      if(imvu_ajax_settings.hasOwnProperty("xhr")) {
        jquery_ajax_settings.xhr = imvu_ajax_settings.xhr
      }else {
        if(!IMVU.Rest._is_cors_withCredentials_supported()) {
          jquery_ajax_settings.xhr = this._rpc_xhr;
          $.support.cors = true
        }
      }
      return $.ajax(jquery_ajax_settings)
    }, ajaxSetup:function(imvu_ajax_settings) {
      this.ajaxSettings = $.extend({}, this.ajaxSettings, imvu_ajax_settings)
    }, _get_remote_iframe_endpoint:function(host) {
      return host + "/__xhr"
    }, _init_rpc_client:function init_rpc_client() {
      document_ready = true;
      var fire_ready_event = function() {
        var i = 0;
        $(document).trigger("IMVU.Rest.ready-" + this._requesterId);
        for(i = 0;i < this.queue.length;i += 1) {
          this.queue[i]()
        }
        this.queue = []
      }.bind(this);
      if(!IMVU.Rest._is_cors_withCredentials_supported()) {
        var create_easyXDM_client = function() {
          this.rpc_client = new easyXDM.Rpc(xdm_config, rpc_spec)
        }.bind(this);
        var remote_endpoint = this._get_remote_iframe_endpoint(this._rpc_target), xdm_config = {remote:remote_endpoint, onReady:fire_ready_event}, rpc_spec = {remote:{send_request:{}}};
        create_easyXDM_client()
      }else {
        fire_ready_event()
      }
    }, _is_client_ready:function is_client_ready() {
      return this.rpc_client !== null
    }, _rpc_xhr:function rpc_xhr() {
      var params = {url:null, method:null, username:null, password:null, data:null, headers:{}}, response = {headers:{}, raw_headers:""}, ignore_rpc_response = false, priv_rpc_xhr = {readyState:0, status:0, statusText:"", responseText:"", onreadystatechange:function() {
      }, open:function(method, url, async, username, password) {
        params.method = method;
        params.url = url;
        params.username = IMVU.Rest._default_arg(username, null);
        params.password = IMVU.Rest._default_arg(password, null);
        if(!IMVU.Rest._default_arg(async, true)) {
          throw new IMVU.Rest.AjaxError("can't make synchronous requests with rpc_xhr");
        }
      }, abort:function() {
        ignore_rpc_response = true
      }, setRequestHeader:function(header, value) {
        params.headers[header] = value
      }, getResponseHeader:function(header) {
        return response.headers[header]
      }, getAllResponseHeaders:function() {
        return response.raw_headers
      }, send:function(data) {
        var DONE = 4;
        function rpc_success_cont(rpc_response) {
          if(!ignore_rpc_response) {
            priv_rpc_xhr.status = rpc_response.status;
            priv_rpc_xhr.responseText = rpc_response.responseText;
            priv_rpc_xhr.readyState = DONE;
            response.raw_headers = rpc_response.raw_headers;
            response.headers = IMVU.Rest._parse_http_headers(response.raw_headers);
            priv_rpc_xhr.onreadystatechange()
          }
        }
        if(IMVU.Rest._default_arg(data, null) !== null) {
          params.data = data
        }
        if(requester._is_client_ready()) {
          requester.rpc_client.send_request(params, rpc_success_cont)
        }else {
          requester.queue.push(function() {
            requester.rpc_client.send_request(params, rpc_success_cont)
          })
        }
      }};
      return priv_rpc_xhr
    }};
    var methodNameDictionary = {"put":"PUT", "post":"POST", "delete_":"DELETE", "get":"GET"};
    _.each(methodNameDictionary, function(restType, restMethodName) {
      requester[restMethodName] = function(jquery_ajax_settings, arg_imvu_ajax_settings) {
        var defaults = {type:restType, contentType:"application/json; charset=UTF-8", xhrFields:{withCredentials:true}, dataType:"json"};
        $.extend(defaults, jquery_ajax_settings);
        return this.ajax(defaults, arg_imvu_ajax_settings || {})
      }
    });
    requester._init_rpc_client();
    IMVU.Rest._numRestRequesters++;
    return requester
  }};
  IMVU.Rest.AjaxError = function(message) {
    this.name = "AjaxError";
    this.message = message || "Ajax Error"
  };
  if(typeof Error !== "undefined") {
    IMVU.Rest.AjaxError.prototype = new Error;
    IMVU.Rest.AjaxError.constructor = IMVU.Rest.AjaxError
  }else {
    IMVU.Rest.AjaxError.prototpe = {toString:function() {
      return this.name + ": " + this.message
    }}
  }
})();
var impls = {};
if(typeof global.implsPending === "undefined") {
  global.implsPending = {}
}
var currentFilePath = null;
function includeModule(modulePath, sysinclude) {
  var cfp = currentFilePath;
  try {
    currentFilePath = modulePath;
    exports = undefined;
    sysinclude(cfp, modulePath, {strictMode:true})
  }finally {
    currentFilePath = cfp
  }
}
function module(dependencies, body, settings) {
  settings = settings || {};
  var path = settings.path || require("path");
  var sysinclude = settings.sysinclude || global.sysinclude;
  var criticalErrorHandler = settings.criticalErrorHandler || function() {
    global.syncWrite("Error: circular module dependency detected:\n");
    global.syncWrite("  " + dependencies[k] + " is required in\n");
    global.syncWrite("  " + cfp + " and " + global.implsPending[vPending] + "\n");
    process.exit(1)
  };
  var cfp = currentFilePath;
  var importList = {};
  for(var k in dependencies) {
    var v = path.join(path.dirname(cfp), dependencies[k]);
    for(var vPending in global.implsPending) {
      if(vPending === v) {
        criticalErrorHandler();
        return
      }
    }
    if(!(v in impls)) {
      global.implsPending[v] = cfp;
      includeModule(v, sysinclude)
    }
    delete global.implsPending[v];
    importList[k] = impls[v]
  }
  impls[cfp] = module._loadBody(body, importList)
}
_.extend(module, IMVU.moduleCommon);
var define = function(dependencies, body) {
  var deps = {};
  for(var i = 0;i < dependencies.length;++i) {
    var name = dependencies[i];
    deps[name] = name + ".js"
  }
  module(deps, function(imports) {
    var args = [];
    for(var i = 0;i < dependencies.length;++i) {
      args.push(imports[dependencies[i]])
    }
    return body.apply(undefined, args)
  })
};
define.amd = true;

