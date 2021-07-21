
sap.ui.define([

    "sap/ui/core/mvc/Controller",
	"../model/formatter"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, formatter) {
        "use strict";
		
		var t;
		var dummy = "1";

        return Controller.extend("ui5demo.controller.Third", {
			
			formatter: formatter,

            onInit: function () {
                
                var filter = [];
				var bar;
				var dataset;
                var currencyCode = "RUB";
                var endDate = "2021-07-30";
                var startDate = "2021-06-29";

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
				t = dataset;
				bar.setDataset(dataset);

			},
			onTest: function(){
				console.log(t);
			},
			onSubmit: function (oEvent) {
				sap.m.MessageToast.show(oEvent.getParameters().value);
			},
			onClick: function(){
				var filter = [];
				var bar;
				var dataset;
                var currencyCode = "EUR" + dummy;
                var endDate = "2021-07-30";
                var startDate = "2021-06-29";

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
				t = dataset;
				bar.setDataset(dataset);
				
				if (dummy == "") {
					dummy = "1";
				} else {
					dummy = ""
				}
			}

        });
    });