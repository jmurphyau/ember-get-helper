import Ember from 'ember';

var HelperModule = Ember.__loader.require('ember-htmlbars/system/helper');

function createHelper(helperFunction) {
	if (HelperModule && HelperModule.default) {
		const Helper = HelperModule.default;
		return new Helper(helperFunction);
	}
	return helperFunction;
}

function registerHelperIteration1(name, helperFunction) {
	//earlier versions of ember with htmlbars used this
	Ember.HTMLBars.helpers[name] = createHelper(helperFunction);
}

function registerHelperIteration2(name, helperFunction) {
	//registerHelper has been made private as _registerHelper
	//this is kept here if anyone is using it
	Ember.HTMLBars.registerHelper(name, createHelper(helperFunction));
}

function registerHelperIteration3(name, helperFunction) {
	//latest versin of ember uses this
	Ember.HTMLBars._registerHelper(name, createHelper(helperFunction));
}

export function registerHelper(name, helperFunction) {
	if (Ember.HTMLBars._registerHelper) {
		if (Ember.HTMLBars.helpers) {
			registerHelperIteration1(name, helperFunction);
		} else {
			registerHelperIteration3(name, helperFunction);
		}
	} else if (Ember.HTMLBars.registerHelper) {
		registerHelperIteration2(name, helperFunction);
	}
}
