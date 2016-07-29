import Ember from 'ember';
// import { module, test } from 'ember-qunit';
// import getHelper from '../../../../helpers/get';
// import getHelperGlimmer from '../../../helpers/get-glimmer';
// import { registerHelper } from '../../../utils/register-helper';
import { moduleForComponent, test } from 'ember-qunit';

const { run, HTMLBars } = Ember;

const EmObject = Ember.Object;

moduleForComponent('GetHelper', {
  integration: true,
  // beforeEach: function() {
  //   if (Helper) {
  //     registerHelper('get', getHelperGlimmer);
  //   } else {
  //     registerHelper('get', getHelper);
  //   }
  // }
});

function toStringify(value) {
  return function toString() { return value; };
}

test('Simple Test', function(assert) {
  this.set('key', 'color');
  this.set('obj', EmObject.create({ color: 'blue' }));

  this.render(HTMLBars.compile("[{{get obj key}}] [{{get obj key}}] [{{get obj 'color'}}]"));

  assert.equal(this.$().text(), '[blue] [blue] [blue]', 'value should be "[blue] [blue] [blue]"');
});


test('obj=[level:1(root)], key=[unbound] - property already being accessed in the view',  function(assert) {
  //import lookupHelper from './helpers/lookup';

  var objectToLookup = EmObject.create({ bar: 'baz' });

  this.set('foo', objectToLookup);
  this.render(HTMLBars.compile("[{{foo.bar}}] [{{get foo 'bar'}}]"));

  // //run(view, 'appendTo', '#ember-testing');

  assert.equal(this.$().text(), '[baz] [baz]', 'value should be baz baz');

  run(objectToLookup,'set','bar','boo');

  assert.equal(this.$().text(), '[boo] [boo]', 'value should be boo boo');

});

test('obj=[level:1(root)], key=[unbound] - object being accessed in the view',  function(assert) {

  var objectToLookup = EmObject.create({
    bar: 'baz',
    toString: toStringify('yellow')
  });

  this.set('foo', objectToLookup);
  this.render(HTMLBars.compile("{{foo}} {{get foo 'bar'}}"));

  //run(view, 'appendTo', '#ember-testing');

  assert.equal(this.$().text(), 'yellow baz', 'value should be baz baz');

  run(objectToLookup,'set','bar','boo');

  assert.equal(this.$().text(), 'yellow boo', 'value should be boo boo');

});

test('obj=[level:1(root)], key=[unbound] - lookup only - object/property not previously accessed',  function(assert) {

  var objectToLookup = EmObject.create({
    bar: 'baz',
    toString: toStringify('yellow')
  });

  this.set('foo', objectToLookup);
  this.render(HTMLBars.compile("{{get foo 'bar'}}"));

  //run(view, 'appendTo', '#ember-testing');

  assert.equal(this.$().text(), 'baz', 'value should be baz baz');

  run(objectToLookup,'set','bar','boo');

  assert.equal(this.$().text(), 'boo', 'value should be boo boo');

});

test('obj=[level:2], key=[unbound] - lookup EmberObject property at context property - property already being accessed in the view',  function(assert) {

  var objectToLookup1 = EmObject.create({ value: 'blue' });
  var objectToLookup2 = EmObject.create({ value: 'maccas' });

  var objectToLookup3 = EmObject.create({ value: 'purple' });
  var objectToLookup4 = EmObject.create({ value: 'bread' });

  var parentObject = EmObject.create({
    color: objectToLookup1,
    food: objectToLookup2
  });

  this.set('foo', parentObject);
  this.render(HTMLBars.compile("{{foo.color.value}} {{get foo.color 'value'}} {{foo.food.value}} {{get foo.food 'value'}}"));

  //run(view, 'appendTo', '#ember-testing');
  assert.equal(this.$().text(), 'blue blue maccas maccas', 'value should be "blue blue maccas maccas"');

  run(objectToLookup1, 'set', 'value', 'green');
  run(objectToLookup2, 'set', 'value', 'kfc');
  assert.equal(this.$().text(), 'green green kfc kfc', 'value should be "green green kfc kfc"');

  run(parentObject, 'set', 'color', objectToLookup3);
  run(parentObject, 'set', 'food', objectToLookup4);
  assert.equal(this.$().text(), 'purple purple bread bread', 'value should be "purple purple bread bread"');

  run(objectToLookup3, 'set', 'value', 'red');
  run(objectToLookup4, 'set', 'value', 'chicken');
  assert.equal(this.$().text(), 'red red chicken chicken', 'value should be "red red chicken chicken"');

});

test('obj=[level:2], key=[unbound] - lookup EmberObject property at context property - object is being accessed in the view',  function(assert) {

  var objectToLookup1 = EmObject.create({ value: 'blue', toString: function() { return 'object1'; } });
  var objectToLookup2 = EmObject.create({ value: 'maccas', toString: function() { return 'object2'; } });
  var objectToLookup3 = EmObject.create({ value: 'purple', toString: function() { return 'object3'; } });
  var objectToLookup4 = EmObject.create({ value: 'bread', toString: function() { return 'object4'; } });

  var parentObject = EmObject.create({
    color: objectToLookup1,
    food: objectToLookup2
  });

  this.set('foo', parentObject);
  this.render(HTMLBars.compile("{{foo.color}} {{get foo.color 'value'}} {{foo.food}} {{get foo.food 'value'}}"));

  //run(view, 'appendTo', '#ember-testing');
  assert.equal(this.$().text(), 'object1 blue object2 maccas', 'value should be "object1 blue object2 maccas"');

  run(objectToLookup1, 'set', 'value', 'green');
  run(objectToLookup2, 'set', 'value', 'kfc');
  assert.equal(this.$().text(), 'object1 green object2 kfc', 'value should be "object1 green object2 kfc"');

  run(parentObject, 'set', 'color', objectToLookup3);
  run(parentObject, 'set', 'food', objectToLookup4);
  assert.equal(this.$().text(), 'object3 purple object4 bread', 'value should be "object3 purple object4 bread"');

  run(objectToLookup3, 'set', 'value', 'red');
  run(objectToLookup4, 'set', 'value', 'chicken');
  assert.equal(this.$().text(), 'object3 red object4 chicken', 'value should be "object3 red object4 chicken"');

});

test('obj=[level:2], key=[unbound] - lookup EmberObject property at context property - lookup only - object/property not previously accessed',  function(assert) {

  var objectToLookup1 = EmObject.create({ value: 'blue', toString: function() { return 'object1'; } });
  var objectToLookup2 = EmObject.create({ value: 'maccas', toString: function() { return 'object2'; } });

  var objectToLookup3 = EmObject.create({ value: 'purple', toString: function() { return 'object3'; } });
  var objectToLookup4 = EmObject.create({ value: 'bread', toString: function() { return 'object4'; } });

  var parentObject = EmObject.create({
    color: objectToLookup1,
    food: objectToLookup2
  });

  this.set('foo', parentObject);
  this.render(HTMLBars.compile("{{foo.color}} {{get foo.color 'value'}} {{get foo.food 'value'}}"));

  //run(view, 'appendTo', '#ember-testing');
  assert.equal(this.$().text(), 'object1 blue maccas', 'value should be "object1 blue maccas"');

  run(objectToLookup1, 'set', 'value', 'green');
  run(objectToLookup2, 'set', 'value', 'kfc');
  assert.equal(this.$().text(), 'object1 green kfc', 'value should be "object1 green kfc"');

  run(parentObject, 'set', 'color', objectToLookup3);
  run(parentObject, 'set', 'food', objectToLookup4);
  assert.equal(this.$().text(), 'object3 purple bread', 'value should be "object3 purple bread"');

  run(objectToLookup3, 'set', 'value', 'red');
  run(objectToLookup4, 'set', 'value', 'chicken');
  assert.equal(this.$().text(), 'object3 red chicken', 'value should be "object3 red chicken"');

});

test('obj=[level:1], key=[level:1] - lookup EmberObject property at context root dynamically',  function(assert) {

  var objectToLookup = EmObject.create({
    color: 'blue',
    food: 'cheese',
    toString: function() { return 'yellow'; }
  });

  this.set('foo', objectToLookup);
  this.set('lookupKey', 'color');
  this.render(HTMLBars.compile("{{foo.color}} {{foo.food}} ({{lookupKey}}) [{{get foo lookupKey}}]"));

  //run(view, 'appendTo', '#ember-testing');
  assert.equal(this.$().text(), 'blue cheese (color) [blue]', 'value should be "blue cheese (color [blue]"');

  run(objectToLookup, 'set', 'color', 'yellow');
  assert.equal(this.$().text(), 'yellow cheese (color) [yellow]', 'value should be "yellow cheese (color) [yellow]"');

  run(this, 'set', 'lookupKey', 'food');
  assert.equal(this.$().text(), 'yellow cheese (food) [cheese]', 'value should be "yellow cheese (food) [cheese]"');

  run(this, 'set', 'lookupKey', null);
  assert.equal(this.$().text(), 'yellow cheese () []', 'value should be "yellow cheese () []"');
});

test('obj=[level:2], key=[bound] - lookup EmberObject property at context property dynamically',  function(assert) {

  var objectToLookup1 = EmObject.create({
    value1: 'blue',
    value2: 'green'
  });
  var objectToLookup2 = EmObject.create({
    value1: 'kfc',
    value2: 'mcdonalds'
  });
  var objectToLookup3 = EmObject.create({
    value1: 'purple',
    value2: 'orange'
  });
  var objectToLookup4 = EmObject.create({
    value1: 'bread',
    value2: 'cheese'
  });

  var parentObject = EmObject.create({
    color: objectToLookup1,
    food: objectToLookup2
  });

  this.set('foo', parentObject);
  this.set('lookupKey', 'value1');
  this.render(HTMLBars.compile("{{lookupKey}} {{foo.color.value1}} {{foo.color.value2}} [{{get foo.color lookupKey}}] {{foo.food.value1}} {{foo.food.value2}} [{{get foo.food lookupKey}}]"));

  //run(view, 'appendTo', '#ember-testing');

  assert.equal(this.$().text(), 'value1 blue green [blue] kfc mcdonalds [kfc]', 'value should be "value1 blue green [blue] kfc mcdonalds [kfc]"');

  run(this, 'set', 'lookupKey', 'value2');
  assert.equal(this.$().text(), 'value2 blue green [green] kfc mcdonalds [mcdonalds]', 'value should be "value2 blue green [green] kfc mcdonalds [mcdonalds]"');

  run(parentObject, 'set', 'color', objectToLookup3);
  assert.equal(this.$().text(), 'value2 purple orange [orange] kfc mcdonalds [mcdonalds]', 'value should be "value2 purple orange [orange] kfc mcdonalds [mcdonalds]"');

  run(parentObject, 'set', 'food', objectToLookup4);
  assert.equal(this.$().text(), 'value2 purple orange [orange] bread cheese [cheese]', 'value should be "value2 purple orange [orange] bread cheese [cheese]"');

  run(this, 'set', 'lookupKey', 'value1');
  assert.equal(this.$().text(), 'value1 purple orange [purple] bread cheese [bread]', 'value should be "value1 purple orange [purple] bread cheese [bread]"');


});

test('obj=[level:2], key=[level:1] - lookup EmberObject property at context property dynamically - lookups only',  function(assert) {

  var objectToLookup1 = EmObject.create({
    value1: 'blue',
    value2: 'green'
  });
  var objectToLookup2 = EmObject.create({
    value1: 'kfc',
    value2: 'mcdonalds'
  });
  var objectToLookup3 = EmObject.create({
    value1: 'purple',
    value2: 'orange'
  });
  var objectToLookup4 = EmObject.create({
    value1: 'bread',
    value2: 'cheese'
  });

  var parentObject = EmObject.create({
    color: objectToLookup1,
    food: objectToLookup2
  });

  this.set('foo', parentObject);
  this.set('lookupKey', 'value1');
  this.render(HTMLBars.compile("{{get foo.color lookupKey}} {{get foo.food lookupKey}}"));

  //run(view, 'appendTo', '#ember-testing');

  assert.equal(this.$().text(), 'blue kfc', 'value should be "blue kfc"');

  run(this, 'set', 'lookupKey', 'value2');
  assert.equal(this.$().text(), 'green mcdonalds', 'value should be "green mcdonalds"');

  run(parentObject, 'set', 'color', objectToLookup3);
  assert.equal(this.$().text(), 'orange mcdonalds', 'value should be "orange mcdonalds"');

  run(parentObject, 'set', 'food', objectToLookup4);
  assert.equal(this.$().text(), 'orange cheese', 'value should be "orange cheese"');

  run(this, 'set', 'lookupKey', 'value1');
  assert.equal(this.$().text(), 'purple bread', 'value should be "purple bread"');

});

test('obj=[level:2], key=[obj=[level:1], key=[level:1]] - lookup EmberObject property at context property dynamically with a nested lookup',  function(assert) {

  var objectToLookup1 = EmObject.create({
    value1: 'blue',
    value2: 'green'
  });
  var objectToLookup2 = EmObject.create({
    value1: 'kfc',
    value2: 'mcdonalds'
  });
  var objectToLookup3 = EmObject.create({
    value1: 'purple',
    value2: 'orange'
  });
  var objectToLookup4 = EmObject.create({
    value1: 'bread',
    value2: 'cheese'
  });

  var parentObject = EmObject.create({
    color: objectToLookup1,
    food: objectToLookup2
  });

  this.set('foo', parentObject);
  this.set('lookups', EmObject.create({ lookup1: 'value1', lookup2: 'value2' }));
  this.set('lookupKey', 'lookup1');
  this.render(HTMLBars.compile("{{get foo.color (get lookups lookupKey)}} {{get foo.food (get lookups lookupKey)}} {{get foo.color (get lookups lookupKey)}} {{get foo.food (get lookups lookupKey)}}"));

  //run(view, 'appendTo', '#ember-testing');

  assert.equal(this.$().text(), 'blue kfc blue kfc', 'value should be "blue kfc blue kfc"');

  run(this, 'set', 'lookupKey', 'lookup2');
  assert.equal(this.$().text(), 'green mcdonalds green mcdonalds', 'value should be "green mcdonalds green mcdonalds"');

  run(parentObject, 'set', 'color', objectToLookup3);
  assert.equal(this.$().text(), 'orange mcdonalds orange mcdonalds', 'value should be "orange mcdonalds orange mcdonalds"');

  run(parentObject, 'set', 'food', objectToLookup4);
  assert.equal(this.$().text(), 'orange cheese orange cheese', 'value should be "orange cheese orange cheese"');

  run(this, 'set', 'lookupKey', 'lookup1');
  assert.equal(this.$().text(), 'purple bread purple bread', 'value should be "purple bread purple bread"');

});





test('obj=[obj=[level:1], key=[unbound]], key=[obj=[level:1], key=[level:1]] - lookup EmberObject property at context property dynamically with a nested lookup',  function(assert) {

  var objectToLookup1 = EmObject.create({
    value1: 'blue',
    value2: 'green'
  });
  var objectToLookup2 = EmObject.create({
    value1: 'kfc',
    value2: 'mcdonalds'
  });
  var objectToLookup3 = EmObject.create({
    value1: 'purple',
    value2: 'orange'
  });
  var objectToLookup4 = EmObject.create({
    value1: 'bread',
    value2: 'cheese'
  });

  var parentObject = EmObject.create({
    color: objectToLookup1,
    food: objectToLookup2
  });

  this.set('foo', parentObject);
  this.set('lookups', EmObject.create({ lookupValue1: 'value1', lookupValue2: 'value2' }));
  this.set('lookupKey', 'lookupValue1');

  this.render(HTMLBars.compile("{{get (get foo 'color') (get lookups lookupKey)}} {{get (get foo 'food') (get lookups lookupKey)}} {{get (get foo 'color') (get lookups lookupKey)}} {{get (get foo 'food') (get lookups lookupKey)}}"));

  //run(view, 'appendTo', '#ember-testing');
  assert.equal(this.$().text(), 'blue kfc blue kfc', 'value should be "blue kfc blue kfc"');

  run(this, 'set', 'lookupKey', 'lookupValue2');
  assert.equal(this.$().text(), 'green mcdonalds green mcdonalds', 'value should be "green mcdonalds green mcdonalds"');

  run(parentObject, 'set', 'color', objectToLookup3);
  assert.equal(this.$().text(), 'orange mcdonalds orange mcdonalds', 'value should be "orange mcdonalds orange mcdonalds"');

  run(parentObject, 'set', 'food', objectToLookup4);
  assert.equal(this.$().text(), 'orange cheese orange cheese', 'value should be "orange cheese orange cheese"');

  run(this, 'set', 'lookupKey', 'lookupValue1');
  assert.equal(this.$().text(), 'purple bread purple bread', 'value should be "purple bread purple bread"');

});



test('obj=??? key=??? very nested... ',  function(assert) {

  var objectToLookup1 = EmObject.create({
    value1: 'blue',
    value2: 'green'
  });
  var objectToLookup2 = EmObject.create({
    value1: 'kfc',
    value2: 'mcdonalds'
  });

  var parentObject = EmObject.create({
    color: objectToLookup1,
    food: objectToLookup2
  });

  this.set('foo', parentObject);
  this.set('keyLookups', EmObject.create({ lookupValue1: 'value1', lookupValue2: 'value2' }));
  this.set('keyLookupKey', 'lookupValue1');
  this.set('objLookups', EmObject.create({ lookupValue1: 'color', lookupValue2: 'food' }));
  this.set('objLookupKey', 'lookupValue1');

  this.render(HTMLBars.compile("{{get (get foo (get objLookups objLookupKey)) (get keyLookups keyLookupKey)}}"));
  //run(view, 'appendTo', '#ember-testing');


  assert.equal(this.$().text(), 'blue', 'value should be "blue kfc blue kfc"');

  run(this, 'set', 'keyLookupKey', 'lookupValue2');
  assert.equal(this.$().text(), 'green', 'value should be "green mcdonalds green mcdonalds"');

  run(this, 'set', 'objLookupKey', 'lookupValue2');
  assert.equal(this.$().text(), 'mcdonalds', 'value should be "green mcdonalds green mcdonalds"');

  run(this, 'set', 'keyLookupKey', 'lookupValue1');
  assert.equal(this.$().text(), 'kfc', 'value should be "green mcdonalds green mcdonalds"');

  run(this, 'set', 'keyLookupKey', 'lookupValue2');
  assert.equal(this.$().text(), 'mcdonalds', 'value should be "green mcdonalds green mcdonalds"');

  run(this, 'set', 'objLookupKey', 'lookupValue1');
  assert.equal(this.$().text(), 'green', 'value should be "green mcdonalds green mcdonalds"');

  run(this, 'set', 'keyLookupKey', 'lookupValue1');
  assert.equal(this.$().text(), 'blue', 'value should be "green mcdonalds green mcdonalds"');

});
