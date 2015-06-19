import Em from 'ember';
import { module, test } from 'qunit';
import { registerHelper } from 'ember-get-helper/utils/register-helper';
import getHelper from 'ember-get-helper/helpers/get';
import getHelperGlimmer from 'ember-get-helper/helpers/get-glimmer';

var Ember = Em;

module('GetHelper', {
  beforeEach: function() {
    if (Em.Helper) {
      registerHelper('get', getHelperGlimmer);
    } else {
      registerHelper('get', getHelper);
    }
  }
});

function toStringify(value) {
  return function toString() { return value; };
}

test('Simple Test', function(assert) {
  var key = 'color';
  var obj = Em.Object.create({ color: 'blue' });

  var view = Em.View.create({
    context: {
      obj: obj,
      key: key
    },
    template: Em.HTMLBars.compile("[{{get obj key}}] [{{get obj key}}] [{{get obj 'color'}}]"),
  });

  Em.run(view, 'appendTo', '#ember-testing');

  assert.equal(view.$().text(), '[blue] [blue] [blue]', 'value should be "[blue] [blue] [blue]"');
});


test('obj=[level:1(root)], key=[unbound] - property already being accessed in the view',  function(assert) {
  //import lookupHelper from './helpers/lookup';

  var objectToLookup = Em.Object.create({ bar: 'baz' });

  var view = Em.View.create({
    context: {
      foo: objectToLookup
    },
    template: Em.HTMLBars.compile("[{{foo.bar}}] [{{get foo 'bar'}}]"),
  });

  Em.run(view, 'appendTo', '#ember-testing');

  assert.equal(view.$().text(), '[baz] [baz]', 'value should be baz baz');

  Em.run(objectToLookup,'set','bar','boo');

  assert.equal(view.$().text(), '[boo] [boo]', 'value should be boo boo');

});

test('obj=[level:1(root)], key=[unbound] - object being accessed in the view',  function(assert) {

  var objectToLookup = Em.Object.create({
    bar: 'baz',
    toString: toStringify('yellow')
  });

  var view = Em.View.create({
    context: {
      foo: objectToLookup
    },
    template: Em.HTMLBars.compile("{{foo}} {{get foo 'bar'}}"),
  });

  Em.run(view, 'appendTo', '#ember-testing');

  assert.equal(view.$().text(), 'yellow baz', 'value should be baz baz');

  Em.run(objectToLookup,'set','bar','boo');

  assert.equal(view.$().text(), 'yellow boo', 'value should be boo boo');

});

test('obj=[level:1(root)], key=[unbound] - lookup only - object/property not previously accessed',  function(assert) {

  var objectToLookup = Em.Object.create({
    bar: 'baz',
    toString: toStringify('yellow')
  });

  var view = Em.View.create({
    context: {
      foo: objectToLookup
    },
    template: Em.HTMLBars.compile("{{get foo 'bar'}}"),
  });

  Em.run(view, 'appendTo', '#ember-testing');

  assert.equal(view.$().text(), 'baz', 'value should be baz baz');

  Em.run(objectToLookup,'set','bar','boo');

  assert.equal(view.$().text(), 'boo', 'value should be boo boo');

});

test('obj=[level:2], key=[unbound] - lookup EmberObject property at context property - property already being accessed in the view',  function(assert) {

  var objectToLookup1 = Em.Object.create({ value: 'blue' });
  var objectToLookup2 = Em.Object.create({ value: 'maccas' });

  var objectToLookup3 = Em.Object.create({ value: 'purple' });
  var objectToLookup4 = Em.Object.create({ value: 'bread' });

  var parentObject = Em.Object.create({
    color: objectToLookup1,
    food: objectToLookup2
  });

  var view = Em.View.create({
    context: {
      foo: parentObject
    },
    template: Em.HTMLBars.compile("{{foo.color.value}} {{get foo.color 'value'}} {{foo.food.value}} {{get foo.food 'value'}}"),
  });

  Em.run(view, 'appendTo', '#ember-testing');
  assert.equal(view.$().text(), 'blue blue maccas maccas', 'value should be "blue blue maccas maccas"');

  Em.run(objectToLookup1, 'set', 'value', 'green');
  Em.run(objectToLookup2, 'set', 'value', 'kfc');
  assert.equal(view.$().text(), 'green green kfc kfc', 'value should be "green green kfc kfc"');

  Em.run(parentObject, 'set', 'color', objectToLookup3);
  Em.run(parentObject, 'set', 'food', objectToLookup4);
  assert.equal(view.$().text(), 'purple purple bread bread', 'value should be "purple purple bread bread"');

  Em.run(objectToLookup3, 'set', 'value', 'red');
  Em.run(objectToLookup4, 'set', 'value', 'chicken');
  assert.equal(view.$().text(), 'red red chicken chicken', 'value should be "red red chicken chicken"');

});

test('obj=[level:2], key=[unbound] - lookup EmberObject property at context property - object is being accessed in the view',  function(assert) {

  var objectToLookup1 = Em.Object.create({ value: 'blue', toString: function() { return 'object1'; } });
  var objectToLookup2 = Em.Object.create({ value: 'maccas', toString: function() { return 'object2'; } });

  var objectToLookup3 = Em.Object.create({ value: 'purple', toString: function() { return 'object3'; } });
  var objectToLookup4 = Em.Object.create({ value: 'bread', toString: function() { return 'object4'; } });

  var parentObject = Em.Object.create({
    color: objectToLookup1,
    food: objectToLookup2
  });

  var view = Em.View.create({
    context: {
      foo: parentObject
    },
    template: Em.HTMLBars.compile("{{foo.color}} {{get foo.color 'value'}} {{foo.food}} {{get foo.food 'value'}}"),
  });

  Em.run(view, 'appendTo', '#ember-testing');
  assert.equal(view.$().text(), 'object1 blue object2 maccas', 'value should be "object1 blue object2 maccas"');

  Em.run(objectToLookup1, 'set', 'value', 'green');
  Em.run(objectToLookup2, 'set', 'value', 'kfc');
  assert.equal(view.$().text(), 'object1 green object2 kfc', 'value should be "object1 green object2 kfc"');

  Em.run(parentObject, 'set', 'color', objectToLookup3);
  Em.run(parentObject, 'set', 'food', objectToLookup4);
  assert.equal(view.$().text(), 'object3 purple object4 bread', 'value should be "object3 purple object4 bread"');

  Em.run(objectToLookup3, 'set', 'value', 'red');
  Em.run(objectToLookup4, 'set', 'value', 'chicken');
  assert.equal(view.$().text(), 'object3 red object4 chicken', 'value should be "object3 red object4 chicken"');

});

test('obj=[level:2], key=[unbound] - lookup EmberObject property at context property - lookup only - object/property not previously accessed',  function(assert) {

  var objectToLookup1 = Em.Object.create({ value: 'blue', toString: function() { return 'object1'; } });
  var objectToLookup2 = Em.Object.create({ value: 'maccas', toString: function() { return 'object2'; } });

  var objectToLookup3 = Em.Object.create({ value: 'purple', toString: function() { return 'object3'; } });
  var objectToLookup4 = Em.Object.create({ value: 'bread', toString: function() { return 'object4'; } });

  var parentObject = Em.Object.create({
    color: objectToLookup1,
    food: objectToLookup2
  });

  var view = Em.View.create({
    context: {
      foo: parentObject
    },
    template: Em.HTMLBars.compile("{{foo.color}} {{get foo.color 'value'}} {{get foo.food 'value'}}"),
  });

  Em.run(view, 'appendTo', '#ember-testing');
  assert.equal(view.$().text(), 'object1 blue maccas', 'value should be "object1 blue maccas"');

  Em.run(objectToLookup1, 'set', 'value', 'green');
  Em.run(objectToLookup2, 'set', 'value', 'kfc');
  assert.equal(view.$().text(), 'object1 green kfc', 'value should be "object1 green kfc"');

  Em.run(parentObject, 'set', 'color', objectToLookup3);
  Em.run(parentObject, 'set', 'food', objectToLookup4);
  assert.equal(view.$().text(), 'object3 purple bread', 'value should be "object3 purple bread"');

  Em.run(objectToLookup3, 'set', 'value', 'red');
  Em.run(objectToLookup4, 'set', 'value', 'chicken');
  assert.equal(view.$().text(), 'object3 red chicken', 'value should be "object3 red chicken"');

});

test('obj=[level:1], key=[level:1] - lookup EmberObject property at context root dynamically',  function(assert) {

  var objectToLookup = Em.Object.create({
    color: 'blue',
    food: 'cheese',
    toString: function() { return 'yellow'; }
  });

  var view = Em.View.create({
    context: {
      foo: objectToLookup,
      lookupKey: 'color'
    },
    template: Em.HTMLBars.compile("{{foo.color}} {{foo.food}} ({{lookupKey}}) [{{get foo lookupKey}}]"),
  });

  Em.run(view, 'appendTo', '#ember-testing');
  assert.equal(view.$().text(), 'blue cheese (color) [blue]', 'value should be "blue cheese (color [blue]"');

  Em.run(objectToLookup, 'set', 'color', 'yellow');
  assert.equal(view.$().text(), 'yellow cheese (color) [yellow]', 'value should be "yellow cheese (color) [yellow]"');

  Em.run(view, 'set', 'context.lookupKey', 'food');
  assert.equal(view.$().text(), 'yellow cheese (food) [cheese]', 'value should be "yellow cheese (food) [cheese]"');

  Em.run(view, 'set', 'context.lookupKey', null);
  assert.equal(view.$().text(), 'yellow cheese () []', 'value should be "yellow cheese () []"');
});

test('obj=[level:2], key=[bound] - lookup EmberObject property at context property dynamically',  function(assert) {

  var objectToLookup1 = Em.Object.create({
    value1: 'blue',
    value2: 'green'
  });
  var objectToLookup2 = Em.Object.create({
    value1: 'kfc',
    value2: 'mcdonalds'
  });
  var objectToLookup3 = Em.Object.create({
    value1: 'purple',
    value2: 'orange'
  });
  var objectToLookup4 = Em.Object.create({
    value1: 'bread',
    value2: 'cheese'
  });

  var parentObject = Em.Object.create({
    color: objectToLookup1,
    food: objectToLookup2
  });

  var view = Em.View.create({
    context: {
      foo: parentObject,
      lookupKey: 'value1'
    },
    template: Em.HTMLBars.compile("{{lookupKey}} {{foo.color.value1}} {{foo.color.value2}} [{{get foo.color lookupKey}}] {{foo.food.value1}} {{foo.food.value2}} [{{get foo.food lookupKey}}]"),
  });

  Em.run(view, 'appendTo', '#ember-testing');

  assert.equal(view.$().text(), 'value1 blue green [blue] kfc mcdonalds [kfc]', 'value should be "value1 blue green [blue] kfc mcdonalds [kfc]"');

  Em.run(view, 'set', 'context.lookupKey', 'value2');
  assert.equal(view.$().text(), 'value2 blue green [green] kfc mcdonalds [mcdonalds]', 'value should be "value2 blue green [green] kfc mcdonalds [mcdonalds]"');

  Em.run(parentObject, 'set', 'color', objectToLookup3);
  assert.equal(view.$().text(), 'value2 purple orange [orange] kfc mcdonalds [mcdonalds]', 'value should be "value2 purple orange [orange] kfc mcdonalds [mcdonalds]"');

  Em.run(parentObject, 'set', 'food', objectToLookup4);
  assert.equal(view.$().text(), 'value2 purple orange [orange] bread cheese [cheese]', 'value should be "value2 purple orange [orange] bread cheese [cheese]"');

  Em.run(view, 'set', 'context.lookupKey', 'value1');
  assert.equal(view.$().text(), 'value1 purple orange [purple] bread cheese [bread]', 'value should be "value1 purple orange [purple] bread cheese [bread]"');


});

test('obj=[level:2], key=[level:1] - lookup EmberObject property at context property dynamically - lookups only',  function(assert) {

  var objectToLookup1 = Em.Object.create({
    value1: 'blue',
    value2: 'green'
  });
  var objectToLookup2 = Em.Object.create({
    value1: 'kfc',
    value2: 'mcdonalds'
  });
  var objectToLookup3 = Em.Object.create({
    value1: 'purple',
    value2: 'orange'
  });
  var objectToLookup4 = Em.Object.create({
    value1: 'bread',
    value2: 'cheese'
  });

  var parentObject = Em.Object.create({
    color: objectToLookup1,
    food: objectToLookup2
  });

  var view = Em.View.create({
    context: {
      foo: parentObject,
      lookupKey: 'value1'
    },
    template: Em.HTMLBars.compile("{{get foo.color lookupKey}} {{get foo.food lookupKey}}"),
  });

  Em.run(view, 'appendTo', '#ember-testing');

  assert.equal(view.$().text(), 'blue kfc', 'value should be "blue kfc"');

  Em.run(view, 'set', 'context.lookupKey', 'value2');
  assert.equal(view.$().text(), 'green mcdonalds', 'value should be "green mcdonalds"');

  Em.run(parentObject, 'set', 'color', objectToLookup3);
  assert.equal(view.$().text(), 'orange mcdonalds', 'value should be "orange mcdonalds"');

  Em.run(parentObject, 'set', 'food', objectToLookup4);
  assert.equal(view.$().text(), 'orange cheese', 'value should be "orange cheese"');

  Em.run(view, 'set', 'context.lookupKey', 'value1');
  assert.equal(view.$().text(), 'purple bread', 'value should be "purple bread"');

});

test('obj=[level:2], key=[obj=[level:1], key=[level:1]] - lookup EmberObject property at context property dynamically with a nested lookup',  function(assert) {

  var objectToLookup1 = Em.Object.create({
    value1: 'blue',
    value2: 'green'
  });
  var objectToLookup2 = Em.Object.create({
    value1: 'kfc',
    value2: 'mcdonalds'
  });
  var objectToLookup3 = Em.Object.create({
    value1: 'purple',
    value2: 'orange'
  });
  var objectToLookup4 = Em.Object.create({
    value1: 'bread',
    value2: 'cheese'
  });

  var parentObject = Em.Object.create({
    color: objectToLookup1,
    food: objectToLookup2
  });

  var view = Em.View.create({
    context: {
      foo: parentObject,
      lookups: Em.Object.create({ lookup1: 'value1', lookup2: 'value2' }),
      lookupKey: 'lookup1'
    },
    template: Em.HTMLBars.compile("{{get foo.color (get lookups lookupKey)}} {{get foo.food (get lookups lookupKey)}} {{get foo.color (get lookups lookupKey)}} {{get foo.food (get lookups lookupKey)}}"),
  });

  Em.run(view, 'appendTo', '#ember-testing');

  assert.equal(view.$().text(), 'blue kfc blue kfc', 'value should be "blue kfc blue kfc"');

  Em.run(view, 'set', 'context.lookupKey', 'lookup2');
  assert.equal(view.$().text(), 'green mcdonalds green mcdonalds', 'value should be "green mcdonalds green mcdonalds"');

  Em.run(parentObject, 'set', 'color', objectToLookup3);
  assert.equal(view.$().text(), 'orange mcdonalds orange mcdonalds', 'value should be "orange mcdonalds orange mcdonalds"');

  Em.run(parentObject, 'set', 'food', objectToLookup4);
  assert.equal(view.$().text(), 'orange cheese orange cheese', 'value should be "orange cheese orange cheese"');

  Em.run(view, 'set', 'context.lookupKey', 'lookup1');
  assert.equal(view.$().text(), 'purple bread purple bread', 'value should be "purple bread purple bread"');

});





test('obj=[obj=[level:1], key=[unbound]], key=[obj=[level:1], key=[level:1]] - lookup EmberObject property at context property dynamically with a nested lookup',  function(assert) {

  var objectToLookup1 = Em.Object.create({
    value1: 'blue',
    value2: 'green'
  });
  var objectToLookup2 = Em.Object.create({
    value1: 'kfc',
    value2: 'mcdonalds'
  });
  var objectToLookup3 = Em.Object.create({
    value1: 'purple',
    value2: 'orange'
  });
  var objectToLookup4 = Em.Object.create({
    value1: 'bread',
    value2: 'cheese'
  });

  var parentObject = Em.Object.create({
    color: objectToLookup1,
    food: objectToLookup2
  });

  var view = Em.View.create({
    context: {
      foo: parentObject,
      lookups: Em.Object.create({ lookupValue1: 'value1', lookupValue2: 'value2' }),
      lookupKey: 'lookupValue1'

    },
    // template: Em.HTMLBars.compile("{{get (get foo 'color') (get lookups lookupKey)}}"),
    template: Em.HTMLBars.compile("{{get (get foo 'color') (get lookups lookupKey)}} {{get (get foo 'food') (get lookups lookupKey)}} {{get (get foo 'color') (get lookups lookupKey)}} {{get (get foo 'food') (get lookups lookupKey)}}"),
  });

  Em.run(view, 'appendTo', '#ember-testing');


  assert.equal(view.$().text(), 'blue kfc blue kfc', 'value should be "blue kfc blue kfc"');

  Em.run(view, 'set', 'context.lookupKey', 'lookupValue2');
  assert.equal(view.$().text(), 'green mcdonalds green mcdonalds', 'value should be "green mcdonalds green mcdonalds"');

  Em.run(parentObject, 'set', 'color', objectToLookup3);
  assert.equal(view.$().text(), 'orange mcdonalds orange mcdonalds', 'value should be "orange mcdonalds orange mcdonalds"');

  Em.run(parentObject, 'set', 'food', objectToLookup4);
  assert.equal(view.$().text(), 'orange cheese orange cheese', 'value should be "orange cheese orange cheese"');

  Em.run(view, 'set', 'context.lookupKey', 'lookupValue1');
  assert.equal(view.$().text(), 'purple bread purple bread', 'value should be "purple bread purple bread"');

});



test('obj=??? key=??? very nested... ',  function(assert) {

  var objectToLookup1 = Em.Object.create({
    value1: 'blue',
    value2: 'green'
  });
  var objectToLookup2 = Em.Object.create({
    value1: 'kfc',
    value2: 'mcdonalds'
  });
  var objectToLookup3 = Em.Object.create({
    value1: 'purple',
    value2: 'orange'
  });
  var objectToLookup4 = Em.Object.create({
    value1: 'bread',
    value2: 'cheese'
  });

  var parentObject = Em.Object.create({
    color: objectToLookup1,
    food: objectToLookup2
  });

  var view = Em.View.create({
    context: {
      foo: parentObject,
      keyLookups: Em.Object.create({ lookupValue1: 'value1', lookupValue2: 'value2' }),
      keyLookupKey: 'lookupValue1',
      objLookups: Em.Object.create({ lookupValue1: 'color', lookupValue2: 'food' }),
      objLookupKey: 'lookupValue1'

    },
    // template: Em.HTMLBars.compile("{{get (get foo 'color') (get lookups lookupKey)}}"),
    template: Em.HTMLBars.compile("{{get (get foo (get objLookups objLookupKey)) (get keyLookups keyLookupKey)}}"),
  });

  Em.run(view, 'appendTo', '#ember-testing');


  assert.equal(view.$().text(), 'blue', 'value should be "blue kfc blue kfc"');

  Em.run(view, 'set', 'context.keyLookupKey', 'lookupValue2');
  assert.equal(view.$().text(), 'green', 'value should be "green mcdonalds green mcdonalds"');

  Em.run(view, 'set', 'context.objLookupKey', 'lookupValue2');
  assert.equal(view.$().text(), 'mcdonalds', 'value should be "green mcdonalds green mcdonalds"');

  Em.run(view, 'set', 'context.keyLookupKey', 'lookupValue1');
  assert.equal(view.$().text(), 'kfc', 'value should be "green mcdonalds green mcdonalds"');

  Em.run(view, 'set', 'context.keyLookupKey', 'lookupValue2');
  assert.equal(view.$().text(), 'mcdonalds', 'value should be "green mcdonalds green mcdonalds"');

  Em.run(view, 'set', 'context.objLookupKey', 'lookupValue1');
  assert.equal(view.$().text(), 'green', 'value should be "green mcdonalds green mcdonalds"');

  Em.run(view, 'set', 'context.keyLookupKey', 'lookupValue1');
  assert.equal(view.$().text(), 'blue', 'value should be "green mcdonalds green mcdonalds"');

});
