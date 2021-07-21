
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
		var flag = true;

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

				if (flag) {
					if (oEvent.getParameters().rowIndices.length > 1) {
						var a = indices.length;
						var b = oEvent.getParameters().rowIndices.length
						if (indices.length == b) {
							indices.length = 0;
							entities.length = 0;
							return;
						}
						indices = oEvent.getParameters().rowIndices;
						for (let j = 0; j < indices.length; j++) {
							entities[j] = this.byId("table").getContextByIndex(indices[j]);
						}
					} else {
						rowIndex = oEvent.getParameters().rowIndex;

						if (this._isUnique(indices, rowIndex)) {
							indices[indices.length] = rowIndex;
							entities[entities.length] = oEvent.getParameters().rowContext;
						} else {
							i = this._findElement(indices, rowIndex);
							this._deleteElement(indices, i);
							this._deleteElement(entities, i);
						}
					}
				}
				flag = true;
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
					flag = false
					this.byId("table").clearSelection();
				}
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