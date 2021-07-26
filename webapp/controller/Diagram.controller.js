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
		var currencyCode2 = ""
		var startDate = "";
		var endDate = "";
		var oData1 = [];
		const dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd" });
		var text = "";

		var test = 1;

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
						that.byId("ComboBox2").setProperty("busy", false);
					}
				});
			},
			close: function () {
				this._oInputFragment.close();
			},
			onChange: function (oControlEvent) {
				currencyCode = oControlEvent.getParameters().value;
			},
			onChange2: function (oControlEvent) {
				currencyCode2 = oControlEvent.getParameters().value;
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
				this.getView().setModel(oModel);
			},
			onClick: function (oEvent) {
				var bar;
				var dataset;
				var feedValueAxis;
				var feedCategoryAxis;
				var that;
				var measures = [];
				var values = [];

				if (/^ +$|^$/.test(currencyCode) || endDate == "" || startDate == "" || endDate == null) {
					sap.m.MessageToast.show("Please enter a valid data");
					return;
				}
				bar = this.getView().byId("Diagram");
				that = this;
				this._getData().then(function (oData) {
					that._createDataSet(oData);
					if (/^ +$|^$/.test(currencyCode2) || currencyCode2 === currencyCode) {
						measures = [{
							name: "Rate " + currencyCode,
							value: "{DiagramModel>Rate}"
						}
						];
						values = ["Rate " + currencyCode];
					} else {
						measures = [{
							name: "Rate " + currencyCode,
							value: "{DiagramModel>Rate}"
						},
						{
							name: "Rate " + currencyCode2,
							value: "{DiagramModel>Rate2}"
						}
						];
						values = ["Rate " + currencyCode, "Rate " + currencyCode2]
					}
					dataset = new sap.viz.ui5.data.FlattenedDataset({
						dimensions: [{
							axis: 1,
							name: "Date",
							value: {
								path: "Erdate",
								formatter: formatter.dateFormat
							}
						}],
						measures: measures,
						data: {
							path: "DiagramModel>/"
						}
					});
					bar.setDataset(dataset);
					feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
						'uid': "valueAxis",
						'type': "Measure",
						'values': values
					});
					feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
						'uid': "categoryAxis",
						'type': "Dimension",
						'values': ["Date"]
					});
					bar.removeAllFeeds();
					bar.addFeed(feedValueAxis);
					bar.addFeed(feedCategoryAxis);

				}, function (error) {
					console.log(error);
				});

			},
			onAfterRender: function () {
				if (this.getView().byId("Diagram").getDataset().mBindingInfos.data.binding.oList.length == 0) {
					document.getElementById(this.getView().oPreprocessorInfo.id + "--Diagram").setAttribute("class", "noVisible");
					sap.m.MessageToast.show("No data found");
					document.getElementById(this.getView().oPreprocessorInfo.id + "--MainBox").setAttribute("class", "page2BgImg");
					document.getElementById(this.getView().oPreprocessorInfo.id + "--SecondBox").setAttribute("class", "");
				} else {
					document.getElementById(this.getView().oPreprocessorInfo.id + "--MainBox").setAttribute("class", "");
					document.getElementById(this.getView().oPreprocessorInfo.id + "--SecondBox").setAttribute("class", "page2BgImg");
				}
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
				} else if (oItem.sId == "item3") {
					oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("Third");
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
							sap.m.MessageToast.show("Success");
						} else {
							sap.m.MessageToast.show(oData.synchronize.Ans);
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
			_onlyUnique1: function (results) {
				if (results.length == 0) {
					return results;
				}

				var array = [];
				var access;

				array[0] = results[0];
				access = false;

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
			},
			_onlyUnique: function (array) {
				if (array.length == 0) {
					return array;
				}

				array.sort(function (first, second) {
					if (first.Currencykey > second.Currencykey) {
						return 1;
					} else if (first.Currencykey < second.Currencykey) {
						return -1;
					} else {
						return 0;
					}
				});
				return this._deleteDuplicate(array);
			},
			_deleteDuplicate: function (array) {
				for (var j = 1, i = 1; j < array.length; ++j) {
					if (array[j].Currencykey != array[j - 1].Currencykey) {
						array[i++] = array[j];
					}
				}
				array.length = i;
				return array;
			},
			_getData: function () {
				var oModel = this.getOwnerComponent().getModel("ODataModel");
				var oPromise = new Promise(function (resolve, reject) {
					oModel.read("/zdm_i_archive", {
						filters: [
							new sap.ui.model.Filter(
								{
									path: "Currencykey",
									operator: sap.ui.model.FilterOperator.EQ,
									value1: currencyCode
								}
							),
							new sap.ui.model.Filter(
								{
									path: "Currencykey",
									operator: sap.ui.model.FilterOperator.EQ,
									value1: currencyCode2
								}
							),
							new sap.ui.model.Filter(
								{
									path: "Erdate",
									operator: sap.ui.model.FilterOperator.BT,
									value1: startDate,
									value2: endDate
								}
							)],
						success: function (oData) {
							resolve(oData);
						},
						error: function (oError) {
							reject(oError.statusCode);
						}

					});
				});
				return oPromise;
			},
			_createDataSet: function (oData) {
				var array = oData.results;
				var result = [];
				var rate1 = [];
				var rate2 = [];

				function resultRate(Erdate, Currencykey, Currencykey2, Rate, Rate2) {
					this.Erdate = Erdate;
					this.Currencykey = Currencykey;
					this.Currencykey2 = Currencykey2;
					this.Rate = Rate;
					this.Rate2 = Rate2;
				}
				function Rate(Erdate, Currencykey, Rate) {
					this.Erdate = Erdate;
					this.Currencykey = Currencykey;
					this.Rate = Rate;
				}
				function fillByFirst() {
					for (let i = 0; i < rate1.length; i++) {
						result[result.length] = new resultRate(rate1[i].Erdate, rate1[i].Currencykey, null, rate1[i].Rate, null);
					}
				}
				function fillBySecond() {
					for (let i = 0; i < rate2.length; i++) {
						result[result.length] = new resultRate(rate2[i].Erdate, null, rate2[i].Currencykey, null, rate2[i].Rate);
					}
				}
				for (let i = 0, j = 0, k = 0; i < array.length; i++) {
					if (array[i].Currencykey === currencyCode) {
						rate1[j] = new Rate(array[i].Erdate, array[i].Currencykey, array[i].Rate);
						j++;
					} else if (array[i].Currencykey === currencyCode2) {
						rate2[k] = new Rate(array[i].Erdate, array[i].Currencykey, array[i].Rate);
						k++;
					}
				}

				if (rate1.length == 0 && rate2.length == 0) {
					this.getView().setModel(new sap.ui.model.json.JSONModel(result), "DiagramModel");
					return;
				} else if (rate1.length == 0) {
					fillBySecond();
				} else if (rate2.length == 0) {
					fillByFirst();
				} else {
					if (rate1[0].Erdate <= rate2[0].Erdate) {
						fillByFirst();
						fillBySecond();
					} else {
						fillBySecond();
						fillByFirst();
					}
				}
				this.getView().setModel(new sap.ui.model.json.JSONModel(result), "DiagramModel");
			}
		});
	});