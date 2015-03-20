import Em from 'ember';

var utils = Em.__loader.require('ember-metal/streams/utils');

function sourceStream(objStream, keyStream) {
  var key = utils.read(keyStream);
  if (Em.isNone(key)) {
    return null;
  } else {
    return objStream.get(key);
  }
}

function setupStream(view, obj, key, stream) {
  stream._objStream = obj;
  stream._keyStream = key;

  stream._objStreamDidChange = function() {
    this.notify();
  };

  stream._keyStreamDidChange = function() {
    this.setSource(sourceStream(obj, key));
    this.notify();
  };

  utils.subscribe(obj, stream._objStreamDidChange, stream);
  utils.subscribe(key, stream._keyStreamDidChange, stream);

  stream.setSource(sourceStream(obj, key));
  stream._isGetHelperStream = true;
}

function getStream(view, obj, key) {
  var accessKey = "get-helper:$%@-%@-$%@-%@".fmt(Em.guidFor(obj),obj._label,Em.guidFor(key),key._label);
  accessKey = accessKey.replace(/\./,'-');

  var stream = view.getStream(accessKey);
  if (!stream._isGetHelperStream) {
    setupStream(view, obj, key, stream);
  }
  return stream;
}

export default function getManager(view, obj, key) {
  if (utils.isStream(obj) && utils.isStream(key)) {
    return getStream(view, obj, key);
  } else if (utils.isStream(obj) && !utils.isStream(key)) {
    return obj.get(key);
  } else if (!utils.isStream(obj) && !utils.isStream(key)) {
    return Em.get(obj, key);
  }
}
