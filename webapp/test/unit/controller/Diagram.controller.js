/*global QUnit*/

sap.ui.define([
	"ui5demo/controller/Diagram.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Diagram Controller");

	QUnit.test("I should test the Diagram controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
