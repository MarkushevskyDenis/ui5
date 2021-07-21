
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

		var oData1;
		var that;

		var indexes = [];
		var rows = [];

		return Controller.extend("ui5demo.controller.Second", {

			formatter: formatter,

			onInit: function () {

				that = this;
				this.getOwnerComponent().getModel("ODataModel").read("/zdm_i_archive", {
					success: function (oData) {
						var oModel = new JSONModel(oData);
						that.getView().setModel(oModel, "JSONModel");
					}
				});
			},

			onSelect: function (oEvent) {
				var rowIndex = oEvent.getParameters().rowIndex;
				var i;
				if (rowIndex != -1) {
					if (this._isUnique(indexes, rowIndex)) {
						indexes[indexes.length] = oEvent.getParameters().rowIndex;
						rows[rows.length] = oEvent.getParameters().rowContext;
					} else {
						i = this._findElement(indexes, rowIndex);
						this._deleteElement(indexes, i);
						this._deleteElement(rows, i);
					}
				}
			},
			getSelectedItems: function () {
				var str = "";
				var data = [];
				if (indexes.length == 0) {
					if (this.getView().getModel() != undefined) {
						this.getView().getModel().setData(null);
					}
					sap.m.MessageToast.show("nothing");
				} else {
					for (let i = 0; i < indexes.length; i++) {
						str += indexes[i] + ","
						data[i] = this.getView().getModel("JSONModel").getProperty(rows[i].sPath);
					}

					this.getView().setModel(new sap.ui.model.json.JSONModel(data));

					indexes.length = 0;
					rows.length = 0;
					this.byId("table").clearSelection();

				}
			},

			//------------
			onSelectionChange: function (oControlEvent) {

				var oPopover = this._getPopover();

				var selectedItem = oControlEvent.getParameters().listItem;
				var oContex = selectedItem.getBindingContext();
				var sPath = oContex.getPath();
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
				// create dialog lazily
				if (!this._oPopover) {
					// create popover via fragment factory
					this._oPopover = sap.ui.xmlfragment(
						"ui5demo.view.test.ResponsivePopover", this);
					this.getView().addDependent(this._oPopover);
				}
				return this._oPopover;
			},
			onSubmit: function (oEvent) {
				sap.m.MessageToast.show(oEvent.getParameters().value);
			}

		});
	});