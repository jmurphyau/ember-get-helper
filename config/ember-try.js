module.exports = {
  scenarios: [
    {
      name: 'default',
      dependencies: { }
    },
    {
      name: 'ember-1.10.x',
      allowedToFail: true,
      bower: { dependencies: { 'ember': '1.10.1' } }
    },
    {
      name: 'ember-1.11.x',
      allowedToFail: true,
      bower: { dependencies: { 'ember': '1.11.4' } }
    },
    {
      name: 'ember-1.12.x',
      allowedToFail: true,
      bower: { dependencies: { 'ember': '1.12.2' } }
    },
    {
      name: 'ember-1.13.x',
      allowedToFail: true,
      bower: { dependencies: { 'ember': '1.13.13' } }
    },
    {
      name: 'ember-2.0.x',
      bower: { dependencies: { 'ember': '2.0.3' } }
    },
    {
      name: 'ember-2.1.x',
      bower: { dependencies: { 'ember': '2.1.2' } }
    },
    {
      name: 'ember-2.2.x',
      bower: { dependencies: { 'ember': '2.2.2' } }
    },
    {
      name: 'ember-2.3.x',
      bower: { dependencies: { 'ember': '2.3.2' } }
    },
    {
      name: 'ember-2.4.x',
      bower: { dependencies: { 'ember': '2.4.6' } }
    },
    {
      name: 'ember-2.5.x',
      bower: { dependencies: { 'ember': '2.5.1' } }
    },
    {
      name: 'ember-2.6.x',
      bower: { dependencies: { 'ember': '2.6.2' } }
    },
    {
      name: 'ember-2.11.x',
      npm: { dependencies: { 'ember-source': '2.11.1' } }
    }
  ]
};
