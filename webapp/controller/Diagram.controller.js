sap.ui.define([

	"sap/ui/core/mvc/Controller",
	"../model/formatter"

],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, formatter) {
		"use strict";

		var currencyCode = "";
		var startDate = "";
		var endDate = "";
		var oData1 = [];
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });
		var text = "";

		return Controller.extend("ui5demo.controller.Diagram", {

			formatter: formatter,
			
			onInit: function () {

				var that;
				var model;

				that = this;
				model = this.getOwnerComponent().getModel("ODataModel");

				model.read("/zdm_i_archive", {

					success: function (oData) {

						oData1 = oData;
						that.onLoadItems();
						that.byId("ComboBox").setProperty("busy", false);


					},

					error: function (error) {
						console.log(error);
					}

				});

			},

			onChange: function (oControlEvent) {

				currencyCode = oControlEvent.getParameters().value;

			},

			onCalendarSelect: function (oControlEvent) {

				endDate = oControlEvent.getSource().getSelectedDates()[0].mProperties.endDate;

				if (endDate == null) {
					return;
				}

				endDate = dateFormat.format(new Date(endDate));
				startDate = dateFormat.format(new Date(oControlEvent.getSource().getSelectedDates()[0].mProperties.startDate));

			},

			onLoadItems: function () {

				var oModel;

				oData1.results = this._onlyUnique(oData1.results);
				oModel = new sap.ui.model.json.JSONModel(oData1);
				oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
				this.getView().setModel(oModel);

			},

			onClick: function (oEvent) {

				var filter = [];
				var bar;
				var dataset;

				if (currencyCode == "" || endDate == "" || startDate == "" || endDate == null) {
					alert("Please enter a valid data");
					return;
				}

				bar = this.getView().byId("Diagram");

				filter = [
					new sap.ui.model.Filter(
						{
							path: "Currencykey",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: currencyCode
						}
					),
					new sap.ui.model.Filter(
						{
							path: "Erdate",
							operator: sap.ui.model.FilterOperator.BT,
							value1: startDate,
							value2: endDate
						}
					)];

				dataset = new sap.viz.ui5.data.FlattenedDataset({

					dimensions: [{
						axis: 1,
						name: "Date",
						value: {
							path: "Erdate",
							formatter: formatter.dateFormat
						}
					}],

					measures: [{
						name: "Rate " + currencyCode,
						value: "{Rate}"
					}
					],

					data: {
						path: "ODataModel>/zdm_i_archive",
						filters: filter
					}

				});
				
				bar.setDataset(dataset);
				document.getElementById("__xmlview0--MainBox").setAttribute("class", "");
				document.getElementById("__xmlview0--SecondBox").setAttribute("class", "page2BgImg");

			},

			onMenuOpen: function () {

				if (!this._oMenuFragment) {

					this._oMenuFragment = sap.ui.xmlfragment("ui5demo.view.Menu", this);
					this.getView().addDependent(this._oMenuFragment);
				}

				this._oMenuFragment.openBy(this.byId("Menu"));

			},

			onMenuAction_MenuFrag: function (oEvent) {

				var oItem;
				var oRouter;

				oItem = oEvent.getParameter("item");

				if (oItem.sId == "item1") {

					if (!this._oInputFragment) {

						this._oInputFragment = sap.ui.xmlfragment("ui5demo.view.Input", this);
						this.getView().addDependent(this._oInputFragment);

					}
					this.onInit();
					this._oInputFragment.open();

				} else if (oItem.sId == "item2") {

					oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("Second");

				}

			},

			onClick_InputFrag: function () {

				var that;
				var oModel;

				that = this;
				oModel = this.getOwnerComponent().getModel("ODataModel");

				oModel.callFunction("/synchronize", {

					method: "GET",

					urlParameters: {

						Currencykey: text.toUpperCase()

					},

					success: function (oData) {

						if (oData.synchronize.Ans == "ok") {

							that.onInit();
							alert("success");

						} else if (oData.synchronize.Ans == "bad") {

							alert("error");

						}

					}

				});

				this._oInputFragment.close();

				sap.ui.getCore().byId("List_InputFrag").removeSelections(true);
				sap.ui.getCore().byId("Input_InputFrag").setValue("");
				text = "";

			},

			onSelectionChange_InputFrag: function (oEvent) {

				text = oEvent.getParameter("listItem").mProperties.title;
				sap.ui.getCore().byId("Input_InputFrag").setValue("");

			},

			onLiveChange_InputFrag: function (oEvent) {

				text = oEvent.getParameter("value");
				sap.ui.getCore().byId("List_InputFrag").removeSelections(true);

			},

			_onlyUnique: function (results) {

				if (results.length == 0) {
					return results;
				}

				var array = [];
				var access = false;

				array[0] = results[0];

				for (let i = 1; i < results.length; i++) {

					for (let j = 0; j < array.length; j++) {

						if (array[j].Currencykey == results[i].Currencykey) {
							access = false;
							break;
						} else {
							access = true;
						}

					}

					if (access) {
						array[array.length] = results[i];
						access = false;
					}

				}

				return array;

			}

		});
	});