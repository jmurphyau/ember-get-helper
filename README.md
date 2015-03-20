# Ember Get Helper for HTMLBars [![Build Status](https://travis-ci.org/jmurphyau/ember-get-helper.svg?branch=master)](https://travis-ci.org/jmurphyau/ember-get-helper)

Helper to deliver `get` functionality to HTMLBars templates.

**`get`**
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

## Install

* `ember install:addon ember-get-helper`

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
