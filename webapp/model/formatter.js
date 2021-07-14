sap.ui.define([
] , function () {
    "use strict";
    return {

        dateFormat : function (fValue) {
            return sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "dd-MM-yyyy" }).format(new Date(fValue));
        },
        dateFormatAm : function (fValue) {
            return sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "MM-dd-yyyy" }).format(new Date(fValue));
        }
    };
}
);
