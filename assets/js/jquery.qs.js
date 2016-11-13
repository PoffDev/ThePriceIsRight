(function($) {

  // Naive method of yanking the querystring portion from a string (just splits on the first '?', if present).
  function extractQuery(string) {
    if(string.indexOf('?') >= 0) {
      return string.split('?')[1];
    } else if(string.indexOf('=') >= 0) {
      return string;
    } else {
      return '';
    }
  };

  // Returns the JavaScript value of a querystring parameter.
  // Decodes the string & coerces it to the appropriate JavaScript type.
  // Examples:
  //    'Coffee%20and%20milk' => 'Coffee and milk'
  //    'true' => true
  //    '21' => 21
  function parseValue(value) {
    value = decodeURIComponent(value);
    try {
      return JSON.parse(value);
    } catch(e) {
      return value;
    }
  }

  // Takes a URL (or fragment) and parses the querystring portion into an object.
  // Returns an empty object if there is no querystring.
  function parse(url) {
    var params = {},
        query = extractQuery(url);

    if(!query) {
      return params;
    }

    $.each(query.split('&'), function(idx, pair) {
      var key, value, oldValue;
      pair = pair.split('=');
      key = pair[0].replace('[]', ''); // FIXME
      value = parseValue(pair[1] || '');
      if (params.hasOwnProperty(key)) {
        if (!params[key].push) {
          oldValue = params[key];
          params[key] = [oldValue];
        }
        params[key].push(value);
      } else {
        params[key] = value;
      }
    });

    return params;
  };

  // Public interface.
  $.qs = function(param) {
    return parse(param);
  };

})(jQuery);
