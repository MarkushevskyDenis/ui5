
sap.ui.define([

    "sap/ui/core/mvc/Controller"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";
		
		var oData1;
		var initThis;
		
        return Controller.extend("ui5demo.controller.Second", {

            onInit: function () {

				var oModel = this.getOwnerComponent().getModel("ODataModel");
				initThis = this;
				this.getOwnerComponent().getModel("ODataModel").read("/zdm_i_archive", {

					success: function (oData) {

						oData1 = oData;
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.setData(oData1);
						initThis.getView().setModel(oModel);

					}

				});

			
			},

            	//------------
			onSelectionChange: function(oControlEvent){

				var oPopover = this._getPopover();

				var selectedItem = oControlEvent.getParameters().listItem;
				var oContex = selectedItem.getBindingContext();
				var sPath = oContex.getPath();
				this.byId("productsDetailPanel").bindElement({path:sPath});

				oPopover.bindElement({path:sPath});
				oPopover.openBy(oControlEvent.getParameters().listItem);

		   },
		   
		   _getPopover : function () {
			// create dialog lazily
				if (!this._oPopover) {
					// create popover via fragment factory
					this._oPopover = sap.ui.xmlfragment(
					"ui5demo.view.test.ResponsivePopover", this);
					this.getView().addDependent(this._oPopover);
				}
				return this._oPopover;
			},
			onSubmit: function(oEvent){
				console.log(oEvent.getParameters());
			}

        });
    });