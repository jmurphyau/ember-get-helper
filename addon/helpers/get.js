import Ember from 'ember';
import getStream from '../utils/get-stream';

function getHelperPreGlimmer(params, hash, options, env) {
  var view = env.data.view;
  var obj = params[0];
  var key = params[1];

  return getStream(view, obj, key);
}

function isStream(obj) {
  return obj && obj.isStream;
}
function read(obj) {
  if (isStream(obj)) {
    return obj.value();
  }
  return obj;
}

function isSubscribed(sourceStream, targetFn, targetScope) {
  var subscriber = sourceStream.subscriberHead;

  while (subscriber) {
  var next = subscriber.next;
    if (subscriber.callback === targetFn && subscriber.context === targetScope) {
      return true;
    }
    subscriber = next;
  }
  return false;
}

function subscribeOnce(sourceStream, targetStream) {
  if (!isSubscribed(sourceStream, targetStream.notify, targetStream)) {
    sourceStream.subscribe(targetStream.notify, targetStream);
  }
}

function blankValue() {
  return new Ember.Handlebars.SafeString('');
}

function getHelperGlimmer(params, hash, options, env) {
  var obj = params[0];
  var key = params[1];
  var objValue = read(obj);
  var keyValue = read(key);
  var retStream;

  if (Ember.isNone(objValue) || Ember.isNone(keyValue)) {
    return blankValue();
  }

  if (isStream(obj) && isStream(key)) {
    retStream = obj.get(keyValue);
    subscribeOnce(retStream, obj);
    subscribeOnce(retStream, key);
    return env.hooks.getValue(retStream);
  } else if (isStream(obj)) {
    retStream = obj.get(keyValue);
    subscribeOnce(retStream, obj);
    return env.hooks.getValue(retStream);
  } else {
    if (objValue) {
      return Ember.get(objValue, keyValue);
    }
  }
}

export function getHelper() {
  if (arguments.length === 0) {
    return;
  }
  if (arguments.length === 5) {
    var arg3 = arguments[3];
    var arg4 = arguments[4];
    if (('hooks' in arg3) && ('renderer' in arg3) && ('self' in arg4) && ('locals' in arg4)) {
      return getHelperGlimmer.apply(this, arguments);
    }
  }

  return getHelperPreGlimmer.apply(this, arguments);
}


export default getHelper;
