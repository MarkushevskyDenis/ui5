
sap.ui.define([

	"sap/ui/core/mvc/Controller",
	"../model/formatter",
	"sap/ui/model/json/JSONModel"

],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, formatter, JSONModel) {
		"use strict";

		var that;
		var indices = [];
		var entities = [];
		var defaultModel;
		var JSONModel;

		return Controller.extend("ui5demo.controller.Second", {

			formatter: formatter,

			onInit: function () {
				that = this;

				this.getOwnerComponent().getModel("ODataModel").read("/zdm_i_archive", {
					success: function (oData) {
						JSONModel = new JSONModel(oData);
						that.getView().setModel(JSONModel, "JSONModel");
					}
				});
				defaultModel = new JSONModel(null);
				this.getView().setModel(defaultModel);
			},
			onSelect: function (oEvent) {
				var rowIndex;
				var i;

				rowIndex = oEvent.getParameters().rowIndex;

				if (rowIndex != -1) {
					if (this._isUnique(indices, rowIndex)) {
						indices[indices.length] = rowIndex;
						entities[entities.length] = oEvent.getParameters().rowContext;
					} else {
						i = this._findElement(indices, rowIndex);
						this._deleteElement(indices, i);
						this._deleteElement(entities, i);
					}
				}
			},
			getSelectedItems: function () {
				var data = [];

				if (indices.length == 0) {
					defaultModel.setData(null);
					sap.m.MessageToast.show("nothing");
				} else {
					for (let i = 0; i < indices.length; i++) {
						data[i] = JSONModel.getProperty(entities[i].sPath);
					}
					defaultModel.setData(data);
					indices.length = 0;
					entities.length = 0;
					this.byId("table").clearSelection();
				}
			},
			onSubmit: function (oEvent) {
				sap.m.MessageToast.show(oEvent.getParameters().value);
			},
			onSelectionChange: function (oControlEvent) {
				var oPopover;
				var selectedItem;
				var oContex;
				var sPath;

				oPopover = this._getPopover();
				selectedItem = oControlEvent.getParameters().listItem;
				oContex = selectedItem.getBindingContext();
				sPath = oContex.getPath();

				this.byId("productsDetailPanel").bindElement({ path: sPath });

				oPopover.bindElement({ path: sPath });
				oPopover.openBy(oControlEvent.getParameters().listItem);
			},
			_isUnique: function (array, element) {
				for (let i = 0; i < array.length; i++) {
					if (array[i] == element) {
						return false;
					}
				}
				return true;
			},
			_deleteElement: function (array, index) {
				for (let i = index; i < array.length - 1; i++) {
					array[i] = array[i + 1]
				}
				array.length--;
			},
			_findElement: function (array, element) {
				for (let i = 0; i < array.length; i++) {
					if (array[i] == element) {
						return i;
					}
				}
			},
			_getPopover: function () {
				if (!this._oPopover) {
					this._oPopover = sap.ui.xmlfragment("ui5demo.view.test.ResponsivePopover", this);
					this.getView().addDependent(this._oPopover);
				}
				return this._oPopover;
			}
		});
	});