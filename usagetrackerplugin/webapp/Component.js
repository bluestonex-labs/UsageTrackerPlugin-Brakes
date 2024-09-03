sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "bsx/usagetrackerplugin/model/models"
],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("bsx.usagetrackerplugin.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                this.appTest();
            },

            appTest: function () {

                var AppLifeCycle = sap.ushell.Container.getService("AppLifeCycle");
                var that = this;
                // this.serviceUrl = jQuery.sap.getModulePath((this.getOwnerComponent().getManifestEntry("/sap.app/id")).replaceAll(".", "/"));
                that.serviceUrl = that._mManifestModels[""].sServiceUrl;
                AppLifeCycle.attachAppLoaded(function (oEvent) {

                    var oParameters = oEvent.getParameters();
                    var test = oParameters.getInfo();
                    //   var appName = oParameters.componentInstance.getId().split('-')[1];
                    var appName = sap.ushell.Container.getService("ShellNavigation").hashChanger.getCurrentNavigationState().newHash.split("-")[0].replace("_", " ");
                    var appFullName = document.title;

                    // var userId = sap.ushell.Container.getService("UserInfo").getUser().getId();
                    var fullName = sap.ushell.Container.getService("UserInfo").getUser().getFullName();
                    var then = that;

                    var today = new Date();
                    var month = '' + (today.getMonth() + 1);
                    var day = '' + today.getDate();
                    var year = today.getFullYear();

                    if (month.length < 2)
                        month = '0' + month;
                    if (day.length < 2)
                        day = '0' + day;

                    var hours = today.getHours();
                    var minutes = today.getMinutes();
                    var seconds = today.getSeconds();

                    if (hours.toString().length < 2) {
                        hours = "0" + hours;
                    }
                    if (minutes.toString().length < 2) {
                        minutes = "0" + minutes;
                    }
                    if (seconds.toString().length < 2) {
                        seconds = "0" + seconds;
                    }

                    var dateString = year + month + day;
                    var timeString = hours.toString() + minutes.toString() + seconds.toString();

                    var os = "Other";
                    if (sap.ui.Device.os.name === "mac" || sap.ui.Device.os.name === "iOS") {
                        os = "Apple";
                    }
                    if (sap.ui.Device.os.name === "win" || sap.ui.Device.os.name === "winphone") {
                        os = "Windows";
                    }
                    if (sap.ui.Device.os.name === "Android") {
                        os = "Android";
                    }

                    if (sap.ui.Device.system.desktop) {
                        var device = " Desktop";
                    }
                    if (sap.ui.Device.system.tablet) {
                        var device = " Tablet";
                    }
                    if (sap.ui.Device.system.phone) {
                        var device = " Phone";
                    }

                    if (window.clientInformation.userAgent.includes("FioriClient")) {
                        var browser = "Fiori Client";
                    }
                    if (!window.clientInformation.userAgent.includes("FioriClient")) {
                        if (sap.ui.Device.browser.name === "cr") {
                            var browser = "Google Chrome";
                        }
                        if (sap.ui.Device.browser.name === "an") {
                            var browser = "Android";
                        }
                        if (sap.ui.Device.browser.name === "sf") {
                            var browser = "Safari";
                        }
                        if (sap.ui.Device.browser.name === "ed") {
                            var browser = "Microsoft Edge";
                        }
                        if (sap.ui.Device.browser.name === "ff") {
                            var browser = "Mozilla Firefox";
                        }
                        if (sap.ui.Device.browser.name === "ie") {
                            var browser = "Internet Explorer";
                        }
                    }

                    var payload = {
                        "Mandt": "800",
                        "Appname": appName,
                        "AppID": appName,
                        "UserId": "",
                        "Fullname": fullName,
                        "EDate": dateString,
                        "ETime": timeString,
                        "Device": device,
                        "Browser": browser,
                        "OS": os,
                        "DTime": "000000",
                        "DDate": "00000000"
                    };

                    if (!oParameters.homePage) {

                        OData.request({
                            requestUri: this.serviceUrl + "/UserStatusSet",
                            method: "GET",
                            headers: {
                                "X-Requested-With": "XMLHttpRequest",
                                "Content-Type": "application/atom+xml",
                                "DataServiceVersion": "2.0",
                                "X-CSRF-Token": "Fetch"
                            }
                        }, function (data, response) {

                            var then = that;
                            var header_xcsrf_token = response.headers["x-csrf-token"];
                            var oHeaders = {
                                "x-csrf-token": header_xcsrf_token,
                                "Accept": "application/json"
                            };

                            $.ajax({
                                url: then.serviceUrl + "/AppUsageSet(Mandt=' ',UserId=' ',EDate=' ',ETime=' ',DDate=' ',DTime=' ')",
                                type: "PUT",
                                contentType: "application/json",
                                headers: oHeaders,
                                dataType: "json",
                                data: JSON.stringify(payload),
                                async: true,
                                success: function (oData, response) {

                                    window.payload = payload;

                                },

                                error: function (jqXHR, textStatus, errorThrown) {
                                    var test = "F";
                                }
                            }, then);

                        }, function (err) {
                            var request = err.request;
                            var response = err.response;

                        });

                    }
                    if (oParameters.homePage) {
                        if (window.payload) {

                            var payload = window.payload;

                            payload.DDate = dateString;
                            payload.DTime = timeString;

                            OData.request({
                                requestUri: this.serviceUrl + "/UserStatusSet",
                                method: "GET",
                                headers: {
                                    "X-Requested-With": "XMLHttpRequest",
                                    "Content-Type": "application/atom+xml",
                                    "DataServiceVersion": "2.0",
                                    "X-CSRF-Token": "Fetch"
                                }
                            }, function (data, response) {

                                var then = that;
                                var header_xcsrf_token = response.headers["x-csrf-token"];
                                var oHeaders = {
                                    "x-csrf-token": header_xcsrf_token,
                                    "Accept": "application/json"
                                };

                                $.ajax({
                                    url: then.serviceUrl + "/AppUsageSet(Mandt=' ',UserId=' ',EDate=' ',ETime=' ',DDate=' ',DTime=' ')",
                                    type: "PUT",
                                    contentType: "application/json",
                                    headers: oHeaders,
                                    dataType: "json",
                                    data: JSON.stringify(payload),
                                    async: true,
                                    success: function (oData, response) {

                                        window.payload = null;

                                    },

                                    error: function (jqXHR, textStatus, errorThrown) {
                                        var test = "F";
                                    }
                                }, then);

                            }, function (err) {
                                var request = err.request;
                                var response = err.response;

                            });
                        }
                        //     jQuery("head title").text("Customer Portal");
                    }
                }.bind(this));

            }
        });
    }
);