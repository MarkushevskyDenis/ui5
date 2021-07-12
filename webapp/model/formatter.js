sap.ui.define([
] , function () {
    "use strict";
    return {
        /**
         * Rounds the number unit value to 2 digits
         * @public
         * @param {string} sValue the number string to be rounded
         * @returns {string} sValue with 2 digits rounded
         */
        numberUnit : function (sValue) {
            if (!sValue) {
                return "";
            }
                            //принимаем пришедшее число sValue и задаем 2 цифры после запятой
            return parseFloat(sValue).toFixed(2);
        }
    };
}
);
