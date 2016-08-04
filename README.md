# Ember Get Helper [![Build Status](https://travis-ci.org/jmurphyau/ember-get-helper.svg?branch=master)](https://travis-ci.org/jmurphyau/ember-get-helper)

`ember-get-helper` for Glimmer & the HTMLBars Templating Language. Usage:

```hbs
{{get object key}}
```

## NOTICE
- `ember-get-helper` has been included in Ember 2.0. Use of this package is deprecated and support for Ember 2.0 will not be maintained.
- `Ember v1.13.0` is not supported due to a bug. Please use `Ember v1.13.1` and higher or `Ember v1.12.*` and lower

## Examples

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
## Installation

If you are using Ember CLI 0.2.3 or higher, just run within your project directory:

```bash
ember install ember-get-helper
```

If your Ember CLI version is less than 0.2.3, run the following within your project directory:

```bash
ember install:addon ember-get-helper
```

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
