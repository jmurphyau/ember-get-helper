# Ember Get Helper for HTMLBars [![Build Status](https://travis-ci.org/jmurphyau/ember-get-helper.svg?branch=master)](https://travis-ci.org/jmurphyau/ember-get-helper)

{{get}} helper - for when they key is dynamic

`{{get}}` helper for your HTMLBars templates. Usage:

```hbs
{{get object key}}
```

Example:

```js
var person = Ember.Object.create({
  isOwner: false,
  isAdmin: true
});

var permissions = Ember.Object.create({
  addObject: 'isOwner',
  viewObject: 'isAdmin'
});
```

```hbs
Can Add Object: {{get person permissions.addObject}}
Can View Object: {{get person permissions.viewObject}}
```

As a Subexpression:

```hbs
{{#if (get person permissions.addObject)}}
  <button>Add Object</button>
{{/if}}
```

## Install

* `ember install:addon ember-get-helper`

## Other Helpers

* [ember-truth-helpers](https://github.com/jmurphyau/ember-truth-helpers)

## Development

* `git clone https://github.com/jmurphyau/ember-get-helper.git`
* `npm install`
* `bower install`
* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
