var key, browserData, subscription, permissionAllowed, iFrameReference, skipSubscriberReport, subscriberIdCallback, isSubscribed = !1,
    optinStatus = "disable",
    host = "https://sdk.truepush.com/",
    cdnUrl = "https://cdni.truepush.com/",
    imgUrl = "https://usimg.truepush.com/",
    subDomainsHost = "fastrojgar.com",
    fromSubDomain = !1,
    EnableHTTPLocalTest = "false",
    version = "v2.0.3",
    defaultKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkRGF0ZSI6MTYxMjkzODcwMzgwOSwiaWQiOiI2MDIzN2RjZjZkM2I3YmU5ZjE4NzE1YTYiLCJ1c2VySWQiOiI2MDA1YWYwOWE5ZmJhOGEzMGFmYWNkYmIiLCJpYXQiOjE2MTI5Mzg3MDN9.ogog8PId203f7JhqaDpPJUH7OrU_0J91sXOO6fWglbY",
    fromIframe = !1,
    fromWordpress = !1;
! function (t, o, e) {
    "use strict";
    o.HTTP = new function () {
        this.post = function (t, o, e, i) {
            var n = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP");
            n.onreadystatechange = function () {
                if (4 == this.readyState) {
                    if (200 != this.status) return i("error", null);
                    try {
                        return i(null, JSON.parse(n.responseText))
                    } catch (t) {
                        return i(null, n.responseText)
                    }
                }
            }, n.open("POST", t, !0), e && e.headers && (n = function (t, o) {
                for (var e = Object.keys(o), i = 0; i < e.length; ++i) {
                    var n = e[i];
                    t.setRequestHeader(n, o[n])
                }
                return t
            }(n, e.headers)), e && e.credentials && (n.withCredentials = !0), n.send(JSON.stringify(o))
        }
    }
}(0, this);
var desktopAllowedVersions = {
        chrome: 40,
        chromium: 40,
        edge: 17,
        firefox: 55,
        safari: 11.1,
        os_x: 10.9,
        opera: 37,
        yandex: 19
    },
    mobileAllowedVersions = {
        chrome: 40,
        firefox: 44,
        opera: "all"
    };

function isNotifAllowed() {
    return promise = new Promise(function (t, o) {
        browserData.ua.startsWith("WordPress") && t(), CheckBrowserCampatability() ? isPrivateMode(browserData.browser.name.toLowerCase()).then(function (o) {
            t()
        }).catch(function (t) {
            o("not allowed")
        }) : o("not allowed")
    })
}

function CheckBrowserCampatability() {
    var t = browserData.browser.name.toLowerCase(),
        o = browserData.ua.indexOf("Mobile") >= 0,
        e = browserData.browser.major;
    return o ? !!mobileAllowedVersions[t] && ("all" === mobileAllowedVersions[t] || mobileAllowedVersions[t] <= e) : "safari" === t ? "safari" in window && "pushNotification" in window.safari : !!desktopAllowedVersions[t] && ("all" === desktopAllowedVersions[t] || desktopAllowedVersions[t] <= e)
}

function isPrivateMode(t) {
    return promise = new Promise(function (o, e) {
        if ("firefox" === t) try {
            localStorage.test = 2, o("done!")
        } catch (t) {
            e("private browser")
        } else if ("safari" === t) {
            var i = window.sessionStorage;
            try {
                i.setItem("someKeyHere", "test"), i.removeItem("someKeyHere"), o("done!")
            } catch (t) {
                t.code === DOMException.QUOTA_EXCEEDED_ERR && 0 === i.length && (console.log(" private safari"), e("private browser"))
            }
        } else if ("chrome" === t || "opera" === t || "chromium" === t) {
            (n = window.RequestFileSystem || window.webkitRequestFileSystem) || (console.log("FS check failed.."), e("private browser")), n(window.TEMPORARY, 100, function (t) {
                o("done!")
            }, function (o) {
                console.log(" private " + t), e("private browser")
            })
        } else if ("edge" === t) window.indexedDB || !window.PointerEvent && !window.MSPointerEvent ? o("done!") : e("private browser");
        else if ("ucbrowser" === t) o("done!");
        else if ("yandex" === t) {
            var n;
            (n = window.RequestFileSystem || window.webkitRequestFileSystem) || (console.log("FS check failed.."), e("private browser")), n(window.TEMPORARY, 100, function (t) {
                o("done!")
            }, function (o) {
                console.log(" private " + t), e("private browser")
            })
        }
    })
}! function (t, o, e) {
    "use strict";
    o.truepushSDK = function (t) {
        function o(t) {
            for (var o = (t + "=".repeat((4 - t.length % 4) % 4)).replace(/\-/g, "+").replace(/_/g, "/"), e = atob(o), i = new Uint8Array(e.length), n = 0; n < e.length; ++n) i[n] = e.charCodeAt(n);
            return i
        }

        function e(t) {
            return t = (t = (t = t.split("=")[0]).replace(/\+/g, "-")).replace(/\//g, "_")
        }

        function i(t) {
            var o = JSON.parse(JSON.stringify(t)),
                i = {};
            return o.keys || (o.keys = {
                auth: e(btoa(String.fromCharCode.apply(null, new Uint8Array(t.getKey("auth"))))),
                p256dh: e(btoa(String.fromCharCode.apply(null, new Uint8Array(t.getKey("p256dh")))))
            }), o && (i.endpoint = o.endpoint, i.keys = {}, i.keys.p256dh = o.keys.p256dh, i.keys.auth = o.keys.auth), i
        }

        function n(t) {
            return !(t && t.endpoint && t.endpoint.indexOf("android.") < 0)
        }

        function r(t, o) {
            if (g.browserData && g.browserData.browser && "Safari" === g.browserData.browser.name) {
                var e = window.safari.pushNotification.permission(g.safariDetails.webPushId);
                e && "granted" === e.permission && e.deviceToken && (t.deviceToken = e.deviceToken)
            }
            if (subscription && (t.subscription = subscription), "optin" == o || "show" == o) {
                var i = localStorage.getItem("tp-uniqueShow");
                i || (localStorage.setItem("tp-uniqueShow", !0), r({
                    uniqueShow: !0
                }, "uniqueShow"))
            }(navigator.language || navigator.userLanguage && "allowed_cookies_personal_data" === window.truepushSDKInfo.userConsent) && (t.language = navigator.language || navigator.userLanguage), "allowed_cookies_only" === m.userConsent && (t.deniedPersonalData = !0),
                function (t, o) {
                    var e = localStorage.getItem("tp-visitsData");
                    try {
                        if ((e = e ? JSON.parse(e) : {})[o]) {
                            var i = e[o].count ? e[o].count : 0;
                            try {
                                e[o] = t, e[o].count = ++i
                            } catch (t) {
                                console.log("visitData error")
                            }
                        } else e[o] = t, e[o].count = 1;
                        localStorage.setItem("tp-visitsData", JSON.stringify(e))
                    } catch (t) {}
                }(t, o)
        }

        function a(t, o) {
            if (!(o >= 2)) {
                var e = localStorage.getItem("tp-visitsData");
                if (e || t) try {
                    var i = host + "api/v1/updateVisit",
                        n = [];
                    t ? n = t : (e = JSON.parse(e), n = s(e));
                    var r = {
                        visitsData: n,
                        platformId: g._id
                    };
                    "allowed_cookies_only" === m.userConsent && (r.deniedPersonalData = !0), HTTP.post(i, r, {
                        credentials: !0,
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }, function (t, e) {
                        if (t) return o || (o = 0), a(n, ++o);
                        localStorage.removeItem("tp-visitsData"), t ? console.log("error occured ", t) : e && "ERROR" == e.status && console.log("error occured ", e)
                    })
                } catch (t) {
                    console.log("updatevisit error", t)
                }
            }
        }

        function s(t) {
            for (var o = [], e = Object.keys(t), i = 0; i < e.length; i++) t[e[i]].keyType = e[i], o.push(t[e[i]]);
            return o
        }
        var p, u = ["add-tags", "remove-tags", "get-tags"];

        function l() {
            try {
                p = {
                    top_bar: '\n  <div class="horizontalbar_truepush" id="jklm-topbar" style=" top:' + g.customStyles.top + "px; bottom:" + g.customStyles.bottom + 'px; height: max-content;">\n    <div class="bar_truepush d-flex" style="background-color:' + g.customStyles.barColor + ";color:" + g.customStyles.textColor + ';">\n      <div class="optinbar_content">\n        <span class="px-2">' + g.customStyles.barText + '</span>\n        <button class="mr-1" onclick="truepush.subscribeUserByTwoWayOptIn(\'hide\')" style="background-color:' + g.customStyles.buttonColor + "; color:" + g.customStyles.buttonTextColor + ';">' + g.customStyles.buttonText + '</button>\n        <b class="px-3 py-2" onclick="truepush.HideOptin(\'close\')" >x</b>\n      </div>\n    </div>\n  </div>\n  ',
                    default2: '\n    <div class="defaultplus_truepush" id="jklm-default2">\n      <div class="overlay-tp"></div>\n      <div class="p-rel defaultplus_box_tp">\n        <div class="defaultplus_content_tp">\n          <a href="javascript:void(0)">\n            <a href="https://www.truepush.com/?medium=Default&source=fl8nolcqc" target="_blank"> Webpush by \n            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 872.6 872.6" style="enable-background:new 0 0 872.6 872.6;width: 24px;height: 24px;vertical-align: middle;" xml:space="preserve">\n            <style type="text/css">\n                .st0{fill:#E54F50;}\n                .st1{fill:#FFFFFF;}\n            </style>\n            <g>\n                <path id="logo_truepush_1_" class="st0" d="M158.4,111.9h556.8c25.2,0,45.6,20.4,45.6,45.6v556.8c0,25.2-20.4,45.6-45.6,45.6H158.4   c-25.2,0-45.6-20.4-45.6-45.6V157.5C112.8,132.3,133.2,111.9,158.4,111.9z"/>\n                <g>\n                    <g id="TruePushLogo_2_" transform="translate(120.000000, 187.000000)">\n                        <g id="Shape_20_">\n                            <path class="st1" d="M159.6,105.7c-8.1,0-15.6,3.1-21.3,8.8c-1.9,1.9-3.4,3.9-4.7,6.2c1.3-2.2,2.9-4.2,4.7-6.1      C144,108.9,151.5,105.8,159.6,105.7l72.8,0.1c0,0,0-0.1,0-0.1H159.6z M251.7,100c0,0.1-0.1,0.2-0.1,0.2c-0.2,0.3-0.3,0.7-0.5,1      l0,0c-2.5,5.1-4,10.3-4.6,15.7c0.6-5.3,2.2-10.6,4.7-15.7L251.7,100C251.8,100,251.8,100,251.7,100      C251.8,100,251.8,100,251.7,100z"/>\n                        </g>\n                        <g id="Shape_9_">\n                            <path class="st1" d="M159.6,105.7c-8.1,0-15.6,3.1-21.3,8.8c-1.9,1.9-3.4,3.9-4.7,6.2c1.3-2.2,2.9-4.2,4.7-6.1      C144,108.9,151.5,105.8,159.6,105.7l72.8,0.1c0,0,0-0.1,0-0.1H159.6z M251.7,100c0,0.1-0.1,0.2-0.1,0.2c-0.2,0.3-0.3,0.7-0.5,1      l0,0c-2.5,5.1-4,10.3-4.6,15.7c0.6-5.3,2.2-10.6,4.7-15.7L251.7,100C251.8,100,251.8,100,251.7,100      C251.8,100,251.8,100,251.7,100z"/>\n                        </g>\n                        <g id="Shape_8_">\n                            <polygon class="st1" points="402,165.3 401.9,143.7 402,143.7     "/>\n                            <polygon class="st1" points="364,135.8 363,213.6 363.9,135.8     "/>\n                        </g>\n                        <g id="Shape_7_">\n                            <path class="st1" d="M280,73.9c1.1-0.5,2.2-1,3.3-1.5C282.2,72.8,281,73.3,280,73.9z M159.6,89.7c-12.3,0-23.9,4.8-32.6,13.5      c-2.7,2.7-5,5.7-6.9,9c1.9-3.2,4.3-6.2,7-8.9C135.7,94.5,147.2,89.8,159.6,89.7l79.6,0.1c0,0,0-0.1,0.1-0.1H159.6z"/>\n                        </g>\n                        <g id="Shape_5_">\n                            <path class="st1" d="M251.7,100c0,0.1-0.1,0.2-0.1,0.2C251.7,100.1,251.7,100.1,251.7,100C251.8,100,251.8,100,251.7,100      C251.8,100,251.8,100,251.7,100z M232.4,105.8c-0.7,2.7-1.3,5.4-1.7,8.1C231.1,111.1,231.7,108.4,232.4,105.8L232.4,105.8z       M251.7,100c0,0.1-0.1,0.2-0.1,0.2C251.7,100.1,251.7,100.1,251.7,100C251.8,100,251.8,100,251.7,100      C251.8,100,251.8,100,251.7,100z M232.4,105.8c-0.7,2.7-1.3,5.4-1.7,8.1C231.1,111.1,231.7,108.4,232.4,105.8L232.4,105.8z       M241.4,86.2c1.5-2.3,3.2-4.5,5-6.5C244.6,81.7,243,83.9,241.4,86.2z M246.5,79.6c1.1-1.3,2.3-2.6,3.5-3.8      C248.8,77.1,247.6,78.3,246.5,79.6z M250,75.8c1.2-1.2,2.5-2.4,3.8-3.6C252.5,73.4,251.2,74.6,250,75.8z M262.2,65.8      c-0.5,0.4-1.1,0.7-1.6,1.1C261.1,66.5,261.6,66.1,262.2,65.8L262.2,65.8z M251.7,100c0,0.1-0.1,0.2-0.1,0.2      C251.7,100.1,251.7,100.1,251.7,100C251.8,100,251.8,100,251.7,100C251.8,100,251.8,100,251.7,100z M232.4,105.8      c-0.7,2.7-1.3,5.4-1.7,8.1C231.1,111.1,231.7,108.4,232.4,105.8L232.4,105.8z M288.1,127.3L288.1,127.3l0-1.1L288.1,127.3z       M386,165.6L386,165.6l0,7.9L386,165.6z M232.4,105.8c-0.7,2.7-1.3,5.4-1.7,8.1C231.1,111.1,231.7,108.4,232.4,105.8      L232.4,105.8z M251.7,100c0,0.1-0.1,0.2-0.1,0.2C251.7,100.1,251.7,100.1,251.7,100C251.8,100,251.8,100,251.7,100      C251.8,100,251.8,100,251.7,100z"/>\n                        </g>\n                        <g id="Shape_4_">\n                            <polygon class="st1" points="272.2,126 272.2,135.6 272.1,135.6 272.1,127.3     "/>\n                            <polygon class="st1" points="386.1,173.5 386,165.6 386,165.6     "/>\n                        </g>\n                        <g id="Shape_1_">\n                            <rect x="159.9" y="127.3" class="st1" width="51.5" height="16.4"/>\n                        </g>\n                        <g id="Shape_2_">\n                            <path class="st1" d="M472.9,49.8H160.7c-23,0-44.8,9-61.1,25.2C83.1,91,74.1,112.6,74.1,135.7c0,47.3,38.8,85.8,86.6,85.8h69.9      l0.6,154.8c0.2,39.6,38.7,71.8,85.9,71.8h0.2c47.3-0.2,85.7-32.7,85.6-72.4l-0.6-154.1h70.6c47.8,0,86.6-38.5,86.6-85.8      C559.5,88.3,520.6,49.8,472.9,49.8z M160.7,205.5c-38.9,0-70.6-31.3-70.6-69.8c0-18.7,7.3-36.2,20.7-49.3      c13.4-13.3,31.1-20.6,49.9-20.6h101.5c-0.5,0.4-1.1,0.7-1.6,1.1c0,0-0.1,0.1-0.1,0.1c0,0,0,0,0,0c-0.6,0.4-1.1,0.8-1.7,1.2      c-0.6,0.4-1.1,0.9-1.7,1.3c-0.5,0.4-1.1,0.8-1.6,1.3c-0.6,0.5-1.1,0.9-1.7,1.4c-1.3,1.2-2.6,2.4-3.8,3.6      c-1.2,1.2-2.4,2.5-3.5,3.8c-1.8,2.1-3.5,4.3-5,6.5c-0.4,0.6-0.8,1.1-1.1,1.7c0,0-0.1,0.1-0.1,0.2c-0.3,0.5-0.7,1.1-1,1.6      c0,0,0,0.1-0.1,0.1h-79.6c-12.3,0-23.9,4.8-32.6,13.4c-2.7,2.7-5,5.7-7,8.9c-0.2,0.3-0.4,0.6-0.6,1c-0.2,0.3-0.4,0.6-0.5,1      c0,0,0,0,0,0c-0.3,0.5-0.5,1-0.8,1.5c-0.1,0.2-0.2,0.3-0.2,0.5c-0.1,0.3-0.3,0.5-0.4,0.8c0,0.1-0.1,0.2-0.1,0.3      c-0.2,0.5-0.4,1-0.6,1.4c-0.2,0.5-0.4,1.1-0.6,1.7c0,0,0,0,0,0c-0.1,0.3-0.2,0.7-0.3,1c-0.1,0.3-0.2,0.7-0.3,1      c0,0.1,0,0.1-0.1,0.2c-0.2,0.7-0.4,1.3-0.6,2c-0.1,0.4-0.2,0.8-0.3,1.1c-0.1,0.4-0.2,0.7-0.2,1.1c-0.1,0.7-0.3,1.5-0.4,2.2      c-0.1,0.8-0.2,1.5-0.3,2.3c-0.1,0.8-0.1,1.5-0.2,2.3c0,0.8-0.1,1.5-0.1,2.3c0,25.3,20.6,45.9,46,45.9h149.2v23.9H160.7z       M232.4,105.8c-0.7,2.7-1.3,5.4-1.7,8.1c-0.1,0.9-0.2,1.8-0.3,2.7c0,0.5-0.1,1-0.1,1.6c0,0.7-0.1,1.4-0.1,2.1c0,0.7,0,1.3,0,2      l0,5.1l0.1,8.4l0.1,29.9h-70.8c-16.5,0-30-13.4-30-29.9c0-0.2,0-0.5,0-0.7c0-0.2,0-0.5,0-0.7c0-0.1,0-0.2,0-0.3      c0-0.4,0-0.9,0.1-1.3c0-0.4,0.1-0.7,0.1-1.1c0,0,0,0,0-0.1c0-0.3,0.1-0.6,0.1-0.9c0-0.1,0-0.2,0-0.3c0-0.3,0.1-0.6,0.2-0.9      c0-0.2,0.1-0.4,0.1-0.6c0.1-0.3,0.1-0.5,0.2-0.7c0-0.1,0.1-0.3,0.1-0.4c0.1-0.3,0.2-0.6,0.3-0.9c0.1-0.2,0.1-0.4,0.2-0.6      c0.1-0.2,0.1-0.4,0.2-0.6c0.2-0.4,0.3-0.9,0.5-1.3c0,0,0-0.1,0-0.1c0.2-0.4,0.4-0.9,0.6-1.3c0.2-0.4,0.4-0.9,0.7-1.3      c0,0,0,0,0,0c0.2-0.3,0.3-0.6,0.5-1c1.3-2.2,2.8-4.3,4.7-6.2c5.6-5.7,13.2-8.8,21.3-8.8L232.4,105.8      C232.4,105.7,232.4,105.7,232.4,105.8L232.4,105.8z M401.9,143.7h68.9v-16.4h-85l0.3,54.3h0l0.2,31.9l0.6,162.1      c0.1,30.9-31.2,56.2-69.6,56.4H317c-38.4,0-69.7-25-69.9-55.8l-0.6-154.7h24.3l-2,144.1c-0.1,8.4,3.4,16.7,9.8,23.3      c8.7,8.9,21.7,14,35.7,14.1c0.3,0,0.6,0,0.9,0c0.6,0,1.2,0,1.8,0h0.1c0.4,0,0.9,0,1.3-0.1c0.5,0,0.9,0,1.4-0.1      c0.2,0,0.5,0,0.7-0.1c0.6,0,1.2-0.1,1.8-0.2c0.1,0,0.2,0,0.3,0c0.5-0.1,0.9-0.1,1.4-0.2c1.4-0.2,2.9-0.5,4.3-0.8      c0.3,0,0.5-0.1,0.7-0.2c0,0,0,0,0.1,0c0.4-0.1,0.9-0.2,1.3-0.4c0.7-0.2,1.5-0.4,2.2-0.6c0.4-0.1,0.8-0.3,1.1-0.4      s0.7-0.3,1.1-0.4c0.8-0.3,1.5-0.6,2.3-0.9c0.5-0.2,0.9-0.4,1.4-0.6c0.2-0.1,0.4-0.2,0.6-0.3s0.4-0.2,0.6-0.3      c0.3-0.1,0.5-0.2,0.7-0.4c0.5-0.3,1-0.5,1.6-0.8c0.5-0.3,1-0.6,1.5-0.9c1.2-0.8,2.4-1.6,3.6-2.5c0.2-0.2,0.5-0.4,0.7-0.5      c0.5-0.4,0.9-0.7,1.3-1.1c0.6-0.5,1.1-1,1.7-1.5c6.6-6.4,10.2-14.5,10.4-22.9l2.1-153.2l0.9-77.8l0.1-8.5h-16l-1,86l-2.1,153.2      c-0.1,5.3-3,9.2-5.5,11.7c-5.8,5.6-15,8.9-24.8,8.7c-9.7-0.1-18.8-3.6-24.4-9.3c-2.4-2.5-5.3-6.6-5.3-11.9l2-144.3h21.9v135.8      h16V213.5l0-86.2h-16l0,38.3h-21l0.4-29.8v-8.5h0l0-1.1c0-0.7,0.1-1.4,0.2-2.1c0-0.2,0.1-0.5,0.1-0.7      c1.5-7.4,8.8-13.6,18.4-16.3c0.6-0.2,1.2-0.3,1.8-0.5c0.2,0,0.4-0.1,0.6-0.1c0.8-0.2,1.5-0.3,2.3-0.4c2-0.3,4-0.5,6.1-0.5h156.3      c16.5,0,30,13.5,30,30c0,16.5-13.5,29.9-30,29.9h-72v-0.3L401.9,143.7z M386.1,173.5l0-7.9h0L386.1,173.5z M472.9,205.5h-70.6      l-0.1-23.9h72c25.4,0,46-20.6,46-45.9c0-25.4-20.6-46-46-46H317.8c-13.8,0-26.1,4.8-34.4,12.4c-0.2,0.2-0.5,0.4-0.7,0.7      c-3.9,3.8-6.9,8.3-8.7,13.2c-0.1,0.3-0.2,0.6-0.3,0.9c-1,2.9-1.5,6-1.5,9.2v9.6l-0.4,30h-25.4l-0.1-30l-0.1-8.3l0-5.1      c0-0.9,0-1.7,0.1-2.6c0-0.4,0-0.9,0.1-1.3c0-0.4,0.1-0.9,0.1-1.3c0.6-5.3,2.2-10.6,4.6-15.7l0,0c0.2-0.3,0.3-0.7,0.5-1      c0-0.1,0.1-0.2,0.1-0.2c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0l0,0c0,0,0,0,0,0v0c0,0,0,0,0,0s0,0,0,0      c0,0,0,0,0-0.1c0.3-0.5,0.5-0.9,0.8-1.4c0-0.1,0.1-0.1,0.1-0.2c0.3-0.4,0.5-0.8,0.8-1.3c0.7-1.1,1.4-2.2,2.2-3.2      c0.2-0.3,0.4-0.6,0.7-0.9c0.2-0.3,0.5-0.6,0.7-0.9c0.2-0.3,0.5-0.6,0.7-0.9c0.2-0.3,0.5-0.6,0.7-0.9v0c0.2-0.3,0.5-0.6,0.8-0.8      c0.3-0.3,0.5-0.6,0.8-0.8c0.5-0.6,1-1.1,1.6-1.6c0.3-0.3,0.5-0.5,0.8-0.8c0.6-0.5,1.1-1.1,1.7-1.6h0c0.6-0.5,1.2-1,1.8-1.5      c0.3-0.3,0.6-0.5,0.9-0.7c0.3-0.3,0.6-0.5,0.9-0.7c0.3-0.3,0.6-0.5,0.9-0.7c0.3-0.2,0.6-0.5,1-0.7c0.6-0.5,1.3-0.9,2-1.3      c0.7-0.4,1.3-0.9,2-1.3c0.4-0.2,0.8-0.5,1.2-0.7c0.3-0.2,0.6-0.4,0.9-0.5c0.3-0.2,0.7-0.4,1-0.5c0.7-0.4,1.4-0.8,2.1-1.1      c0.4-0.2,0.7-0.4,1.1-0.5c1.1-0.5,2.2-1,3.3-1.5c0.8-0.3,1.5-0.6,2.3-0.9c0.4-0.2,0.8-0.3,1.2-0.4c0,0,0.1,0,0.1,0      c0.3-0.1,0.6-0.2,0.9-0.3c0.1,0,0.1,0,0.2-0.1c0.4-0.1,0.8-0.3,1.2-0.4c0.4-0.1,0.8-0.3,1.2-0.4c0.8-0.3,1.6-0.5,2.4-0.7      c0.4-0.1,0.8-0.2,1.2-0.3c0.8-0.2,1.6-0.4,2.5-0.6c0.4-0.1,0.8-0.2,1.2-0.3c0.4-0.1,0.8-0.2,1.3-0.3c0.3-0.1,0.6-0.1,0.9-0.2      c0.5-0.1,1.1-0.2,1.6-0.3c0.4-0.1,0.9-0.2,1.3-0.2c0.6-0.1,1.1-0.2,1.7-0.3c0.3,0,0.5-0.1,0.8-0.1c0.5-0.1,0.9-0.1,1.4-0.2      c0.9-0.1,1.7-0.2,2.6-0.3c0.5,0,1.1-0.1,1.7-0.1c0.3,0,0.7,0,1-0.1c0.8,0,1.7-0.1,2.5-0.1c0.5,0,0.9,0,1.3,0h157.2      c38.9,0,70.6,31.4,70.6,69.9C543.5,174.1,511.8,205.5,472.9,205.5z"/>\n                        </g>\n                    </g>\n                </g>\n            </g>\n            </svg>\n              <span> Truepush</span>\n            </a>\n          </a>\n        </div>\n      </div>\n    </div>\n    ',
                    bell: ' \n    <div class="belloptin_truepush" onclick="truepush.subscribeUserByTwoWayOptIn()">\n      <div class="bellcircle_optinicon"  style="background-color:' + g.customStyles.circleColor + '">\n        <svg xmlns="http://www.w3.org/2000/svg" id="Capa_1" data-name="Capa 1" viewBox="0 0 58.59 58.59">\n          <path d="M43.88,41.21a14.1,14.1,0,0,1-2.38-7.86v-8A12.21,12.21,0,0,0,30.72,13.26v-3H27.79v3A12.32,12.32,0,0,0,17.09,25.5v7.85a14.18,14.18,0,0,1-2.38,7.86l-2.8,4.2H25.15a4.4,4.4,0,0,0,8.29,0H46.68Zm-26.5,1.27A17,17,0,0,0,20,33.35V25.5a9.35,9.35,0,0,1,9.24-9.39h0a9.29,9.29,0,0,1,9.28,9.28v8a17,17,0,0,0,2.64,9.13Z" style="fill:' + g.customStyles.bellColor + '" />\n          <path d="M50.15,19.28l-2.07,2.07a11.25,11.25,0,0,1,.12,15.76l2.1,2a14.17,14.17,0,0,0-.15-19.87Z" style="fill:' + g.customStyles.bellColor + '" />\n          <path d="M46,23.42,43.93,25.5a5.35,5.35,0,0,1,0,7.55l2.1,2.05A8.32,8.32,0,0,0,46,23.42Z" style="fill:' + g.customStyles.bellColor + '" />\n          <path d="M10.51,21.35,8.44,19.28a14.15,14.15,0,0,0-.15,19.87l2.1-2a11.23,11.23,0,0,1,.12-15.76Z" style="fill:' + g.customStyles.bellColor + '" />\n          <path d="M14.66,25.5l-2.08-2.08a8.31,8.31,0,0,0-.06,11.68l2.09-2.05a5.37,5.37,0,0,1-1.53-3.76A5.3,5.3,0,0,1,14.66,25.5Z" style="fill:' + g.customStyles.bellColor + '" />\n        </svg>\n        <span class="tip-content">Subscribe to notifications </span>\n      </div>\n    </div>\n    ',
                    box: '\n    <div class="optinbox_truepush optinbox_truepush_iframe">\n      <div class="d-flex optinbox_tpsection">\n        <div>\n          <h5 style="display:' + (g.customStyles.visibleStatus ? "none" : "block") + ' !important">' + g.customStyles.mainText + '</h5>\n          <h5 style="display:' + (g.customStyles.visibleStatus ? "block" : "none") + ' !important">Allow updates from ' + g.websiteURL + "</h5>\n          <p>" + g.customStyles.subText + '</p>\n          <div class="optinbox_tpbuttons">\n            <button type="button" onclick="truepush.HideOptin(\'close\')" class="tp_btn_default">' + g.customStyles.firstBtnText + '</button>\n            <button type="button" onclick="truepush.subscribeUserByTwoWayOptIn(\'hide\')" class="tp_btn_primary">' + g.customStyles.secondBtnText + '</button>\n            <div class="text-center mt-1">\n              <a href="https://www.truepush.com/?medium=box&source=hco3ib00z" target="_blank" >Powered by Truepush</a>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    ',
                    box2: '\n    <div class="optinbox_truepush optinbox_plus_truepush optinboxplus_truepush_iframe">\n            <div class="optinbox_plus_tpsection">\n                <div class="optinbox_plus_media d-flex">\n                    <div class="optinbox_plus_image">\n                        <img src="' + cdnUrl + "website_icons/" + g.websiteIcon + '" alt="">\n                    </div>\n                    <div class="optinbox_plus_media_body">\n                      <p style="display:' + (g.customStyles.visibleStatus ? "none" : "block") + ' !important">' + g.customStyles.mainText + ' </p>\n                      <p style="display:' + (g.customStyles.visibleStatus ? "block" : "none") + ' !important">Allow updates from ' + g.websiteURL + ' </p>\n                      <p class="subtext">' + (g.customStyles.subText ? g.customStyles.subText : "") + '</p>\n                      </div>\n                </div>\n                <div class="optinbox_tpbuttons mt-2 mb-1">\n                    <button type="button" onclick="truepush.HideOptin(\'close\')" class="tp_btn_default">' + g.customStyles.firstBtnText + '</button>\n                    <button type="button" class="tp_btn_primary" onclick="truepush.subscribeUserByTwoWayOptIn(\'hide\')">' + g.customStyles.secondBtnText + '</button>\n                    <div class="text-center mt-2">\n                        <a href="https://www.truepush.com/?medium=box+&source=jm0dlua52" target="_blank">Powered by Truepush</a>\n                    </div>\n                </div>\n\n            </div>\n        </div>\n        ',
                    default: '\n    <button onclick="truepush.HideOptin()">Ã—</button> \n    <p>Notifications by</p>\n    <a href="https://www.truepush.com?medium=default&source=rh5bpz549" target="_blank">TruePush</a>\n    '
                }
            } catch (t) {
                console.log(t)
            }
            var t = document.createElement("div"),
                o = "";
            !g.websiteSSL && browserData && browserData.browser && "Safari" != browserData.browser.name && (o = " iframe_optin_notifications");
            try {
                t.innerHTML = '\n<div class="truepush_optin_notifications' + o + '">\n\n</div>\n'
            } catch (t) {
                console.log("error is ", t)
            }
            return document.body.appendChild(t)
        }

        function c(t) {
            if (localStorage.removeItem("optinShow"), sessionStorage.removeItem("new_session"), "default" != t.optInType) {
                e = "default+" === (e = "box+" === (e = t.optInType) ? "box2" : e) ? "default2" : e, document.getElementsByClassName("truepush_optin_notifications")[0].innerHTML = p[e];
                var o = "box+" === t.optInType ? "box2" : t.optInType;
                o = "default+" === o ? "default2" : o, t.websiteSSL || y && y.postMessage({
                    type: "iframeShow"
                }, "*"), setTimeout(function () {
                    if (!t.websiteSSL) {
                        var e = {
                                type: "optinHeight"
                            },
                            i = "";
                        "bell" === o ? i = "belloptin_truepush" : "box2" === o ? i = "optinbox_truepush optinbox_plus_truepush" : "default2" === o ? i = "defaultplus_truepush" : "top_bar" === o ? i = "bar_truepush d-flex" : "box" === o && (i = "optinbox_truepush"), e.height = document.getElementsByClassName(i)[0].clientHeight + 5, y && y.postMessage(e, "*")
                    }
                    "default2" == o && (-1 != navigator.userAgent.indexOf("Opera") || -1 != navigator.userAgent.indexOf("OPR") ? document.getElementById("jklm-default2").className = "defaultplus_truepush opera_defaultplus_truepush" : -1 != navigator.userAgent.indexOf("Firefox") ? document.getElementById("jklm-default2").className = "defaultplus_truepush moz_defaultplus_truepush" : -1 != navigator.userAgent.indexOf("Edge") && (document.getElementById("jklm-default2").className = "defaultplus_truepush edge_defaultplus_truepush")), t.websiteSSL && "top_bar" === o && ("" !== t.customStyles.top ? document.body.style.cssText = "margin-top:" + document.getElementsByClassName("bar_truepush d-flex")[0].clientHeight + "px !important" : document.getElementsByTagName("html")[0].style.cssText = "margin-bottom:" + document.getElementsByClassName("bar_truepush d-flex")[0].clientHeight + "px !important")
                }, 500)
            }
            var e;
            "custom" !== t.optInType && "bell" !== t.optInType && "spec_time" === t.optInFrequencyType ? localStorage.setItem("optinShow", Date.now() + 6e4 * t.optInFrequency) : "new_session" === t.optInFrequencyType && sessionStorage.setItem("new_session", "true")
        }
        this.subscribeUserByTwoWayOptIn = function (t) {
            r({
                optinClick: !0
            }, "optinClick"), t && truepush.HideOptin(), E()
        }, this.HideOptin = function (t) {
            "close" == t && (r({
                optinIgnore: !0
            }, "optinIgnore"), a(), localStorage.getItem("optinShow") || "custom" === g.optInType || "bell" === g.optInType || "spec_time" !== g.optInFrequencyType || localStorage.setItem("optinShow", Date.now() + 6e4 * g.optInFrequency), "new_session" === g.optInFrequencyType && sessionStorage.setItem("new_session", "true")), "top_bar" === g.optInType && ("" !== g.customStyles.top ? document.body.style.cssText = "margin-top: 0px !important" : document.getElementsByTagName("html")[0].style.cssText = "margin-bottom:0px !important");
            var o = "box+" === g.optInType ? "box2" : g.optInType;
            o = "default+" === o ? "default2" : o;
            var e = document.getElementsByClassName("truepush_optin_notifications")[0];
            e.className = "truepush_optin_notifications d-none", g.websiteSSL || y && y.postMessage({
                type: "hideOptin"
            }, "*")
        };
        var d, f, m, g, b, h, _, x, y, w = {
                platformDetails: !0,
                jsFiles: !0
            },
            v = Notification.permission,
            S = !1,
            I = !0;

        function k() {
            var t;
            "undefined" != typeof Promise ? fromSubDomain ? T() : ((t = document.createElement("style")).innerHTML = '@import "https://fonts.googleapis.com/css?family=Nunito+Sans:400,600,700";.d-none{display:none}.d-block{display:block}.d-flex{display:flex!important}.truepush_optin_notifications{font-family:"Nunito Sans",sans-serif!important;border:none!important;font-size:14px;color:#000;margin:0;padding:0;box-sizing:border-box}.truepush_optin_notifications .text-center{text-align:center!important}.truepush_optin_notifications .text-right{text-align:right!important}.truepush_optin_notifications .text-left{text-align:left!important}.truepush_optin_notifications .justify-content-center{justify-content:center!important}.truepush_optin_notifications .justify-content-start{justify-content:flex-start!important}.truepush_optin_notifications .justify-content-end{justify-content:flex-end!important}.truepush_optin_notifications .color-primary{color:#4a90e2}.truepush_optin_notifications .color-link{color:#4a90e2}.truepush_optin_notifications .p-rel{position:relative}.truepush_optin_notifications .p-abs{position:absolute}.truepush_optin_notifications .m-1{margin:6px!important}.truepush_optin_notifications .m-2{margin:12px!important}.truepush_optin_notifications .m-3{margin:18px!important}.truepush_optin_notifications .m-4{margin:24px!important}.truepush_optin_notifications .m-5{margin:30px!important}.truepush_optin_notifications .mx-1{margin-left:6px!important;margin-right:6px!important}.truepush_optin_notifications .mx-2{margin-left:12px!important;margin-right:12px!important}.truepush_optin_notifications .mx-3{margin-left:18px!important;margin-right:18px!important}.truepush_optin_notifications .mx-4{margin-left:24px!important;margin-right:24px!important}.truepush_optin_notifications .mx-5{margin-left:30px!important;margin-right:30px!important}.truepush_optin_notifications .my-1{margin-top:6px!important;margin-bottom:6px!important}.truepush_optin_notifications .my-2{margin-top:12px!important;margin-bottom:12px!important}.truepush_optin_notifications .my-3{margin-top:18px!important;margin-bottom:18px!important}.truepush_optin_notifications .my-4{margin-top:24px!important;margin-bottom:24px!important}.truepush_optin_notifications .my-5{margin-top:30px!important;margin-bottom:30px!important}.truepush_optin_notifications .mt-1{margin-top:6px!important}.truepush_optin_notifications .mt-2{margin-top:12px!important}.truepush_optin_notifications .mt3{margin-top:18px!important}.truepush_optin_notifications .mt-4{margin-top:24px!important}.truepush_optin_notifications .mt-5{margin-top:30px!important}.truepush_optin_notifications .mb-1{margin-bottom:6px!important}.truepush_optin_notifications .mb-2{margin-bottom:12px!important}.truepush_optin_notifications .mb-3{margin-bottom:18px!important}.truepush_optin_notifications .mb-4{margin-bottom:24px!important}.truepush_optin_notifications .mb-5{margin-bottom:30px!important}.truepush_optin_notifications .ml-1{margin-left:6px!important}.truepush_optin_notifications .ml-2{margin-left:12px!important}.truepush_optin_notifications .ml-3{margin-left:18px!important}.truepush_optin_notifications .ml-4{margin-left:24px!important}.truepush_optin_notifications .ml-5{margin-left:30px!important}.truepush_optin_notifications .mr-1{margin-right:6px!important}.truepush_optin_notifications .mr-2{margin-right:12px!important}.truepush_optin_notifications .mr-3{margin-right:18px!important}.truepush_optin_notifications .mr-4{margin-right:24px!important}.truepush_optin_notifications .mr-5{margin-right:30px!important}.truepush_optin_notifications .p-1{padding:6px!important}.truepush_optin_notifications .p-2{padding:12px!important}.truepush_optin_notifications .p-3{padding:18px!important}.truepush_optin_notifications .p-4{padding:24px!important}.truepush_optin_notifications .p-5{padding:30px!important}.truepush_optin_notifications .px-1{padding-left:6px!important;padding-right:6px!important}.truepush_optin_notifications .px-2{padding-left:12px!important;padding-right:12px!important}.truepush_optin_notifications .px-3{padding-left:18px!important;padding-right:18px!important}.truepush_optin_notifications .px-4{padding-left:24px!important;padding-right:24px!important}.truepush_optin_notifications .px-5{padding-left:30px!important;padding-right:30px!important}.truepush_optin_notifications .py-1{padding-top:6px!important;padding-bottom:6px!important}.truepush_optin_notifications .py-2{padding-top:12px!important;padding-bottom:12px!important}.truepush_optin_notifications .py-3{padding-top:18px!important;padding-bottom:18px!important}.truepush_optin_notifications .py-4{padding-top:24px!important;padding-bottom:24px!important}.truepush_optin_notifications .py-5{padding-top:30px!important;padding-bottom:30px!important}.truepush_optin_notifications .pt-1{padding-top:6px!important}.truepush_optin_notifications .pt-2{padding-top:12px!important}.truepush_optin_notifications .pt-3{padding-top:18px!important}.truepush_optin_notifications .pt-4{padding-top:24px!important}.truepush_optin_notifications .pt-5{padding-top:30px!important}.truepush_optin_notifications .pb-1{padding-bottom:6px!important}.truepush_optin_notifications .pb-2{padding-bottom:12px!important}.truepush_optin_notifications .pb-3{padding-bottom:18px!important}.truepush_optin_notifications .pb-4{padding-bottom:24px!important}.truepush_optin_notifications .pb-5{padding-bottom:30px!important}.truepush_optin_notifications .pl-1{padding-left:6px!important}.truepush_optin_notifications .pl-2{padding-left:12px!important}.truepush_optin_notifications .pl-3{padding-left:18px!important}.truepush_optin_notifications .pl-4{padding-left:24px!important}.truepush_optin_notifications .pl-5{padding-left:30px!important}.truepush_optin_notifications .pr-1{padding-right:6px!important}.truepush_optin_notifications .pr-2{padding-right:12px!important}.truepush_optin_notifications .pr-3{padding-right:18px!important}.truepush_optin_notifications .pr-4{padding-right:24px!important}.truepush_optin_notifications .pr-5{padding-right:30px!important}.truepush_optin_notifications .xy-m{position:absolute;top:50%;left:50%;transform:translateX(-50%) translateY(-50%)}.truepush_optin_notifications .y-m{position:absolute;top:50%;transform:translateY(-50%)}.truepush_optin_notifications .x-m{position:absolute;left:50%;transform:translateX(-50%)}.truepush_optin_notifications .truepush_overlay{width:100%;height:100%;position:fixed;background:#000;background-color:rgba(0,0,0,0.3);z-index:999999;left:0;right:0;margin:auto;top:0;overflow:hidden}.truepush_optin_notifications .defaultplus_truepush{width:800px;height:220px;position:fixed;top:0;left:0;z-index:10000000000000000}.truepush_optin_notifications .defaultplus_truepush:after{content:"";width:100%;height:100%;position:absolute;left:50%;top:50%;filter:blur(80px);background-color:rgba(0,0,0,0.4);transform:translateX(-50%) translateY(-50%)}.truepush_optin_notifications .defaultplus_truepush .defaultplus_box_tp{position:relative;z-index:99999999}.truepush_optin_notifications .defaultplus_truepush .defaultplus_box_tp .defaultplus_content_tp{position:absolute;top:20px;right:120px}.truepush_optin_notifications .defaultplus_truepush .defaultplus_box_tp .defaultplus_content_tp a{color:#fff!important;cursor:pointer!important;font-size:14px;font-weight:800;text-decoration:none!important;background:none;margin:0;padding:0;text-shadow:2px 2px 8px #7c7c7c;font-family:"Nunito Sans",sans-serif!important}.truepush_optin_notifications .defaultplus_truepush .defaultplus_box_tp .defaultplus_content_tp a:hover{text-decoration:underline!important}.truepush_optin_notifications .defaultplus_truepush .defaultplus_box_tp .defaultplus_content_tp a img{vertical-align:middle;margin:0 2px;width:18px}.truepush_optin_notifications .defaultplus_truepush .defaultplus_box_tp .defaultplus_content_tp span{color:#fff!important;text-decoration:underline!important}.truepush_optin_notifications .moz_defaultplus_truepush{width:960px}.truepush_optin_notifications .moz_defaultplus_truepush .defaultplus_content_tp{right:60px}.truepush_optin_notifications .opera_defaultplus_truepush .defaultplus_content_tp{right:160px}.truepush_optin_notifications .edge_defaultplus_truepush{width:100%!important;height:120px!important;bottom:0!important;left:0!important;top:auto}.truepush_optin_notifications .edge_defaultplus_truepush .defaultplus_content_tp{top:22px!important;left:22%!important}.truepush_optin_notifications .belloptin_truepush{position:fixed;right:25px;bottom:30px;z-index:999999999999!important;padding:2px;cursor:pointer}.truepush_optin_notifications .belloptin_truepush .bellcircle_optinicon{display:flex!important;display:-ms-flexbox!important;justify-content:center!important;align-items:center!important;text-align:center!important;-webkit-box-align:center!important;-webkit-box-pack:center!important;width:50px;height:50px;border-radius:50%;background:red;margin:0;padding:0}.truepush_optin_notifications .belloptin_truepush .bellcircle_optinicon svg{width:36px;height:36px;fill:#fff;vertical-align:sub;text-align:center;margin:0;padding:0}.truepush_optin_notifications .belloptin_truepush .tip-content{position:absolute;top:6px;right:9999px;width:200px;margin-right:83px;padding:10px;color:#fff;background:#333;box-sizing:unset!important;box-shadow:2px 2px 5px #aaa;opacity:0;transition:opacity 250ms ease-out}.truepush_optin_notifications .belloptin_truepush .tip-content:before{content:"";position:absolute;top:50%;width:0;height:0;margin-left:184px;margin-top:-11px;border:10px solid transparent;border-left-color:#333}.truepush_optin_notifications .belloptin_truepush .bellcircle_optinicon:hover .tip-content{right:-20px;opacity:1}.truepush_optin_notifications .horizontalbar_truepush{position:fixed;bottom:0;width:100%;left:0;right:0;margin:0 auto;z-index:9999999}.truepush_optin_notifications .horizontalbar_truepush .bar_truepush{justify-content:center;padding:10px;background:#000;color:#fff}.truepush_optin_notifications .horizontalbar_truepush .bar_truepush .optinbar_content span{font-size:16px}.truepush_optin_notifications .horizontalbar_truepush .bar_truepush .optinbar_content button{display:inline!important;background-color:#4A90E2;color:#fff;border-width:0!important;padding:8px 12px!important;font-size:14px!important;font-weight:500;border:0;border-radius:2px;margin:0 auto!important;text-transform:none!important;font-family:"Nunito Sans",sans-serif!important}.truepush_optin_notifications .horizontalbar_truepush .bar_truepush .optinbar_content b{font-size:16px;cursor:pointer}.truepush_optin_notifications .optinbox_truepush{font-family:"Nunito Sans",sans-serif!important;position:fixed;top:0;margin:0;left:50%;transform:translateX(-50%);z-index:999999999999!important;text-align:center;width:100%;max-width:360px;height:-webkit-max-content;height:max-content;background:#ffffff;border:1px solid #f0f0f0;margin:0 auto}.truepush_optin_notifications .optinbox_truepush .optinbox_tpsection{padding:12px 10px;display:flex;justify-content:center;text-align:center}.truepush_optin_notifications .optinbox_truepush .optinbox_tpsection h5{font-size:16px!important;font-weight:600;color:#282828!important;margin:0;line-height:1.4;text-transform:unset!important}.truepush_optin_notifications .optinbox_truepush .optinbox_tpsection p{font-size:13px;color:#7c7c7c;margin:12px 0;font-weight:500;padding:0;line-height:1.4}.truepush_optin_notifications .optinbox_truepush .optinbox_tpsection .optinbox_tpbuttons{text-align:center!important}.truepush_optin_notifications .optinbox_truepush .optinbox_tpsection .optinbox_tpbuttons button{padding:8px 26px;font-size:14px!important;font-weight:500;margin:6px;border-radius:2px;text-transform:unset!important;line-height:normal!important;letter-spacing:unset!important;font-family:"Nunito Sans",sans-serif!important}.truepush_optin_notifications .optinbox_truepush .optinbox_tpsection .optinbox_tpbuttons .tp_btn_default{background:#f2f4ff;border:1px solid #ebeefc;box-shadow:0 0 8px 0 white;color:#3b69ff;margin-left:0}.truepush_optin_notifications .optinbox_truepush .optinbox_tpsection .optinbox_tpbuttons .tp_btn_primary{background:#3b69ff;color:#fff;border:1px solid #3b69ff;box-shadow:0 0 6px 0 #c0cfff}.truepush_optin_notifications .optinbox_truepush .optinbox_tpsection .optinbox_tpbuttons a{text-decoration:underline!important;cursor:pointer!important;font-size:12px;font-weight:500;padding:0;margin:0;color:#7c7c7c!important;font-family:"Nunito Sans",sans-serif!important}.truepush_optin_notifications .optinbox_plus_truepush{width:100%;max-width:350px;height:-webkit-max-content;height:max-content;margin:0 auto;background:#ffffff;border:1px solid #f0f0f0}.truepush_optin_notifications .optinbox_plus_truepush .optinbox_plus_tpsection{padding:10px}.truepush_optin_notifications .optinbox_plus_truepush .optinbox_plus_tpsection .optinbox_plus_media{display:flex;align-items:flex-start;text-align:left}.truepush_optin_notifications .optinbox_plus_truepush .optinbox_plus_tpsection .optinbox_plus_media .optinbox_plus_image{flex:0 0 60px;-webkit-box-flex:0;-ms-flex:0 0 60px;height:60px;margin-right:16px;overflow:hidden}.truepush_optin_notifications .optinbox_plus_truepush .optinbox_plus_tpsection .optinbox_plus_media .optinbox_plus_image img{max-width:100%;width:100%;border-radius:2px}.truepush_optin_notifications .optinbox_plus_truepush .optinbox_plus_tpsection .optinbox_plus_media .optinbox_plus_media_body{flex:1}.truepush_optin_notifications .optinbox_plus_truepush .optinbox_plus_tpsection .optinbox_plus_media .optinbox_plus_media_body p{margin:0;font-size:15px;color:#484848;line-height:1.4;font-weight:600;font-family:"Nunito Sans",sans-serif!important;word-break:break-word;text-align:left!important}.truepush_optin_notifications .optinbox_plus_truepush .optinbox_plus_tpsection .optinbox_plus_media .optinbox_plus_media_body .subtext{font-size:13px!important;color:#686868!important;font-weight:400!important;padding-top:3px;font-family:"Nunito Sans",sans-serif!important;word-break:break-word}.truepush_optin_notifications .optinbox_plus_truepush .optinbox_plus_tpsection .optinbox_tpbuttons button{display:unset!important;padding:8px 26px;font-size:14px;font-weight:500;margin:5px;border-radius:2px;font-family:"Nunito Sans",sans-serif!important;line-height:1.4!important}.truepush_optin_notifications .optinbox_plus_truepush .optinbox_plus_tpsection .optinbox_tpbuttons .tp_btn_default{background:#f2f4ff;border:1px solid #ebeefc;box-shadow:0 0 8px 0 white;color:#3b69ff;margin-left:0}.truepush_optin_notifications .optinbox_plus_truepush .optinbox_plus_tpsection .optinbox_tpbuttons .tp_btn_primary{background:#3b69ff;color:#fff;border:1px solid #3b69ff;box-shadow:0 0 6px 0 #c0cfff}.truepush_optin_notifications .optinbox_plus_truepush .optinbox_plus_tpsection .optinbox_tpbuttons a{text-decoration:underline!important;cursor:pointer!important;font-size:12px;font-weight:500;padding:0;margin:0;color:#7c7c7c;font-family:"Nunito Sans",sans-serif!important}iframe{border:0;background:none;box-shadow:none}.iframe_optinbell_tp{width:62px;height:62px;position:fixed;bottom:20px;right:30px;z-index:999999999}.iframe_optin_notifications .belloptin_truepush{right:50%!important;bottom:50%!important;transform:translateX(50%) translateY(50%)}.iframe_optinbar_tp{position:fixed;width:100%;bottom:0;left:0;right:0;margin:0 auto;height:50px;z-index:9999999}.iframe_optinbox_tp{position:fixed;max-width:400px;width:100%;padding:0 5px;height:180px;top:0;left:50%;transform:translateX(-50%);z-index:9999999}.optinbox_truepush_iframe{width:100%}.iframe_optinboxplus_tp{max-width:400px;width:100%;top:0;height:160px;position:fixed;left:50%;transform:translateX(-50%);z-index:9999999}.optinboxplus_truepush_iframe{width:100%}.iframe_optin_notifications .optinbox_truepush_iframe{top:0!important;bottom:auto!important}.iframe_optin_notifications .optinboxplus_truepush_iframe{top:0!important;bottom:auto!important}.option-safari-background{position:fixed;top:0;left:0;z-index:999999;display:block;width:100%;height:100%;overflow:hidden;outline:0;background:#000;opacity:0.7}.option-safari-background .safari-dialog{max-width:100%;margin:1.75rem auto}.option-safari-background .safari-dialog{position:relative;width:auto;margin:0.5rem;pointer-events:none;z-index:999999!important}.option-safari-background .safari-content{position:absolute;display:flex;flex-direction:column;width:100%;max-width:400px;pointer-events:auto;background-color:#fff;background-clip:padding-box;border:1px solid rgba(0,0,0,0.2);border-radius:0.3rem;outline:0}.option-safari-background .safari-header{display:flex;align-items:flex-start;justify-content:space-between;padding:1rem 1rem;border-top-left-radius:calc(.3rem - 1px);border-top-right-radius:calc(.3rem - 1px)}.option-safari-background .safari-body{position:relative;flex:1 1 auto;padding:1rem;padding-top:0}.option-safari-background .safari-footer{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;padding:0.75rem;border-top:1px solid #dee2e6;border-bottom-right-radius:calc(.3rem - 1px);border-bottom-left-radius:calc(.3rem - 1px)}.option-safari-background .safari-title{font-size:20px;text-align:right}.option-safari-background .safari-icons{display:flex;background:#c6c6c6;width:120px;margin-top:7px;padding:5px;border-bottom-left-radius:20px;border-top-left-radius:20px;background-image:linear-gradient(to right,#c6c6c6,#c6c6c6,white)}.option-safari-background .bell{font-size:1.5rem;font-weight:700;line-height:0.6!important;color:#000;text-shadow:0 1px 0 #fff;padding:1px 0px 4px 0px;padding-left:8px}.option-safari-background .bell1{font-size:1.5rem;font-weight:700;margin-right:7px;line-height:0.6!important;border:0;outline:none;color:#000;text-shadow:0 1px 0 #fff}.option-safari-background .bell i{font-size:16px}.option-safari-background .bell1 i{font-size:16px;font-weight:bold;padding-left:15px}.option-safari-background span.safari-arrow{position:absolute;left:16%;top:47px;transform:translateY(6%)}.option-safari-background .safari-arrow img{width:49px!important}.option-safari-background .safari-body p{text-align:right}.option-safari-background .safari-footersection{display:flex;position:absolute;bottom:0;padding:10px 20px;background-color:#fff;width:100%;justify-content:space-between}.option-safari-background .safari-footersection i{font-size:24px!important;color:#0678ff!important}.option-safari-background .safari-footersection h4{color:#000;font-weight:500;font-size:14px!important;padding-left:15px!important;padding-top:1px}.option-safari-background .safari-footersection .notification{display:flex!important}.option-safari-background .footer-icon i{font-size:24px!important;margin-left:7px;margin-top:5px;font-size:18px!important;color:#575757!important}.option-safari-background .safari-footersection .footer-text{color:#0678ff!important}.option-safari-background .footer-icon{width:28px!important;height:28px;border-radius:20px;margin-top:-1px}.option-safari-background .footer-icon:hover{width:28px!important;height:28px;border-radius:20px;background:darkgrey;margin-top:-1px;color:#fff}.option-safari-backgroung-left{position:fixed;top:0;left:0;z-index:999999;display:block;width:100%;height:100%;overflow:hidden;outline:0;background:#000;opacity:0.7}.option-safari-backgroung-left .safari-dialog{max-width:100%;margin:1.75rem auto}.option-safari-backgroung-left .safari-dialog{position:relative;width:auto;margin:0.5rem;pointer-events:none;z-index:999999!important}.option-safari-backgroung-left .safari-content{position:absolute;display:flex;flex-direction:column;width:100%;right:0;max-width:400px;pointer-events:auto;background-color:#fff;background-clip:padding-box;border:1px solid rgba(0,0,0,0.2);border-radius:0.3rem;outline:0}.option-safari-backgroung-left .safari-header{display:flex;align-items:flex-start;justify-content:space-between;padding:1rem 1rem;border-top-left-radius:calc(.3rem - 1px);border-top-right-radius:calc(.3rem - 1px)}.option-safari-backgroung-left .safari-body{position:relative;flex:1 1 auto;padding:1rem;padding-top:0}.option-safari-backgroung-left .safari-footer{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;padding:0.75rem;border-top:1px solid #dee2e6;border-bottom-right-radius:calc(.3rem - 1px);border-bottom-left-radius:calc(.3rem - 1px)}.option-safari-backgroung-left .safari-title{font-size:20px}.option-safari-backgroung-left .safari-icons{background:#c6c6c6;width:120px;padding:5px;margin-top:7px;border-bottom-right-radius:20px;border-top-right-radius:20px;background-image:linear-gradient(to right,white,#c6c6c6,#c6c6c6)}.option-safari-backgroung-left .bell{float:right;font-size:1.5rem;font-weight:700;padding:1px 0px 4px 0px;line-height:0.5!important;color:#000;text-shadow:0 1px 0 #fff}.option-safari-backgroung-left .bell1{float:right;background-color:#c6c6c6;font-size:1.5rem;font-weight:700;margin-right:7px;line-height:0.5!important;border:0;outline:none;color:#000;text-shadow:0 1px 0 #fff}.option-safari-backgroung-left .bell i{font-size:16px;padding-right:20px}.option-safari-backgroung-left .bell1 i{font-size:16px;font-weight:bold;padding-right:5px;padding-top:2px}.option-safari-backgroung-left span.safari-arrow{position:absolute;left:72%;top:46px;transform:translateY(6%)}.option-safari-backgroung-left .safari-arrow img{width:49px!important}.option-safari-backgroung-left .safari-footersection .footer-text{color:#0678ff!important}.option-safari-backgroung-left .footer-icon{width:28px!important;height:28px;border-radius:20px;margin-top:-1px}.option-safari-backgroung-left .footer-icon:hover{width:28px!important;height:28px;border-radius:20px;background:darkgrey;margin-top:-1px;color:#fff}@media screen and (max-width:574.98px){.truepush_optin_notifications .defaultplus_truepush{width:100%;height:auto;bottom:0;top:auto;left:0}.truepush_optin_notifications .defaultplus_truepush .defaultplus_box_tp .defaultplus_content_tp{top:auto;left:40%;bottom:20px;transform:translateX(-40%);right:auto}.truepush_optin_notifications .horizontalbar_truepush .bar_truepush .optinbar_content span{display:block;padding:0 0 12px 0!important}.truepush_optin_notifications .optinbox_truepush{top:auto;bottom:0}.iframe_optinbox_tp{top:auto;bottom:0;max-width:360px}.iframe_optinboxplus_tp{top:auto;bottom:0;max-width:360px}}@media screen and (max-width:398.98px){.truepush_optin_notifications .optinbox_truepush{max-width:98%}.truepush_optin_notifications .optinbox_truepush .optinbox_tpsection{padding:12px 8px}.truepush_optin_notifications .optinbox_truepush .optinbox_tpsection h5{font-size:14px;font-weight:600}.truepush_optin_notifications .optinbox_truepush .optinbox_tpsection p{font-size:12px}.iframe_optin_notifications .optinbox_truepush_iframe{top:auto!important;bottom:0!important}.iframe_optin_notifications .optinboxplus_truepush_iframe{top:auto!important;bottom:0!important}}@media screen and (min-width:320px) and (max-width:767px){.option-safari-background .safari-content{width:100%;max-width:270px}.option-safari-background .safari-icons{margin-top:4px!important}.option-safari-background .bell1 i,.option-safari-background .bell i{font-weight:bold!important;font-size:10px}.option-safari-background .bell1,.option-safari-background .bell{padding:1px 0px 3px 0px;line-height:0.1!important}.option-safari-background .safari-title{font-size:14px}.option-safari-background .safari-body p{font-size:12px!important;margin-bottom:0rem}.option-safari-background .safari-header{padding-bottom:5px!important}.option-safari-background span.safari-arrow{left:18%;top:37px}.option-safari-background .safari-arrow img{width:25px!important}.option-safari-background .bell1 i{padding-left:10px}.option-safari-backgroung-left .bell i{padding-right:12px!important}.option-safari-backgroung-left .safari-content{width:100%;max-width:270px}.option-safari-backgroung-left .safari-icons{padding:6px;margin-top:4px!important}.option-safari-backgroung-left .bell1 i,.option-safari-backgroung-left .bell i{font-weight:bold!important;font-size:10px}.option-safari-backgroung-left .bell1,.option-safari-backgroung-left .bell{line-height:0.1!important}.option-safari-backgroung-left .safari-title{font-size:14px}.option-safari-backgroung-left .safari-body p{font-size:12px!important;margin-bottom:0rem}.option-safari-backgroung-left .safari-header{padding-bottom:5px!important}.option-safari-backgroung-left span.safari-arrow{left:71%;top:38px}.option-safari-backgroung-left .safari-arrow img{width:25px!important}}', document.head.appendChild(t), T()) : console.log("browser is not supported")
        }

        function T() {
            isNotifAllowed().then(function (t) {
                setTimeout(function () {
                    f || fromSubDomain || U()
                }, 100)
            }).catch(function (t) {
                console.log("not allowed in browser"), I = !1;
                try {
                    document.getElementById("jklm-custom").style.display = "none"
                } catch (t) {}
            })
        }
        window.addEventListener("message", function (t) {
                var o = t.data;
                o && o.optInType ? (o.browserInfo && (browserData = o.browserInfo, delete o.browserInfo), (g = o).userConsent && (m || (m = {}), m.userConsent = g.userConsent), fromIframe && k(), fromSubDomain && (f || U()), fromSubDomain && (document.getElementById("subDomainTP").innerHTML = " Subscribe to " + g.websiteURL, document.getElementById("requestDiv").style.display = "block")) : o && "getSubscriberId" === o.type ? function (t) {
                    var o = {};
                    if ("granted" != Notification.permission) return t(o = {
                        error: "Permission not granted",
                        result: null
                    });
                    if (!K()) return t(o = {
                        error: "Script not yet initialized",
                        result: null
                    });
                    var e = localStorage.getItem("subscriberId");
                    if (e) return t(o = {
                        error: null,
                        result: e
                    });
                    W(function (e) {
                        if (!e) return t(o = {
                            error: "Subscription not found",
                            result: null
                        });
                        var i = host + "api/v1/getSubscriberId",
                            n = {
                                userPlatformId: g._id,
                                subscription: e
                            };
                        HTTP.post(i, n, C, function (e, i) {
                            return e ? t(o = {
                                error: "Unable to serve subscriberId",
                                result: null
                            }) : "ERROR" == i.status ? t(o = {
                                error: n.message,
                                result: null
                            }) : i && i.data ? (o = {
                                error: null,
                                result: i.data
                            }, localStorage.setItem("subscriberId", i.data), t(o)) : t(o = {
                                error: "Unable to serve subscriberId",
                                result: null
                            })
                        })
                    })
                }(function (t) {
                    t.type = "subscriberId", y && y.postMessage(t, "*")
                }) : o && "subscriberId" === o.type ? subscriberIdCallback && (subscriberIdCallback(o.error, o.result), subscriberIdCallback = null) : o && "hideOptin" === o.type ? (document.getElementById("tp-iframe").style.display = "none", "top_bar" === g.optInType && ("" !== g.customStyles.top ? document.body.style.cssText = "margin-top: 0px !important" : document.getElementsByTagName("html")[0].style.cssText = "margin-bottom:0px !important")) : o && "optinHeight" === o.type ? (document.getElementById("tp-iframe").style.minHeight = o.height + "px", "top_bar" == g.optInType && ("" !== g.customStyles.top ? document.body.style.cssText = "margin-top:" + o.height + "px !important" : document.getElementsByTagName("html")[0].style.cssText = "margin-bottom:" + o.height + "px !important")) : o && "iframeShow" === o.type && (document.getElementById("tp-iframe").style.display = "block")
            }, !1),
            function () {
                (function () {
                    try {
                        return window.self !== window.top
                    } catch (t) {
                        return !0
                    }
                })() && (fromIframe = !0, y = window.parent);
                window.name && "HTTPSubscriptionWindow" == window.name ? fromSubDomain = !0 : window.location.href.indexOf(subDomainsHost) >= 0 && !fromIframe && (fromSubDomain = !0)
            }(), setTimeout(function () {
                !f && m && fromSubDomain && (x = !0, truepush.Init(m))
            }, 5e3);
        var C = {
            credentials: !0,
            headers: {
                "Content-Type": "application/json"
            }
        };

        function R(t) {
            var e, i;
            m.fromWordpress && (fromWordpress = m.fromWordpress), key = o(g.vapidDetails.publicKey);
            var n = {
                scope: "/"
            };
            if (!navigator || !navigator.serviceWorker) return console.log("Push notifications are not working in this browser..because serviceWorker not supported.");
            var r = window.location.protocol + "//" + window.location.hostname;
            window.location.port && (r = r + ":" + window.location.port), fromSubDomain ? (i = "/sw-" + version + ".js?key=" + g._id + "&isAltUrl=true&version=" + version, e = "/sub-domain/sw-" + version + ".js?key=" + g._id + "&isAltUrl=true&version=" + version) : 1 == fromWordpress || "true" == fromWordpress ? (i = m.wordpresspath + "sw2.php", m.local && (n.scope = "/wordpress/"), e = i) : (i = "/" + m.serviceWorkerFileName + "?truepush&key=" + g._id, truepushVersionInfo && truepushVersionInfo.swJsUrl && (i += "&version=" + truepushVersionInfo.key, i += "&swJSHost=" + truepushVersionInfo.swJSHost), m.absoluteSWPath && (i = r + i, n.scope = r + "/"), e = i), "true" == EnableHTTPLocalTest && (i = e), m.scriptRegisterEveryTime || !1 !== m.scriptRegisterEveryTime ? navigator.serviceWorker.register(i, n).then(function (o) {
                navigator.serviceWorker.ready.then(function (o) {
                    t(o)
                })
            }).catch(function (o) {
                console.log("service worker not ready", o), t(null)
            }) : navigator.serviceWorker.getRegistration(r + "/").then(function (o) {
                o && o.active && o.active.scriptURL && o.active.scriptURL.indexOf("sw.js") > -1 ? navigator.serviceWorker.ready.then(function (o) {
                    t(o)
                }) : navigator.serviceWorker.register(i, n).then(function (o) {
                    navigator.serviceWorker.ready.then(function (o) {
                        t(o)
                    })
                }).catch(function (o) {
                    console.log("service worker not ready", o), t(null)
                })
            })
        }

        function D() {
            "granted" === Notification.permission && (permissionAllowed = !0, skipSubscriberReport = !0, R(function (t) {
                t ? t.pushManager.subscribe({
                    userVisibleOnly: !0,
                    applicationServerKey: key
                }).then(function (t) {
                    return subscription = i(t), skipSubscriberReport = !0, subscription ? void N(subscription, "update") : truepush.subscribeUserVapid(!0)
                }).catch(function (t) {
                    console.log("error iss ", t), M()
                }) : console.log("Error in Service Worker registration")
            })), fromSubDomain ? "denied" == Notification.permission ? P("block") : (P("request"), truepush.subscribeUserVapid()) : "default" === Notification.permission && "custom" != g.optInType && setTimeout(function () {
                (function () {
                    if ("Firefox" === browserData.browser.name) {
                        var t = document.cookie.match(new RegExp("(^| )permission=([^;]+)"));
                        return !t
                    }
                    return !0
                })() && ("default" != g.optInType ? "default+" === g.optInType && ("spec_time" === g.optInFrequencyType && localStorage.getItem("optinShow") <= Date.now() || !sessionStorage.getItem("new_session") && "new_session" === g.optInFrequencyType || "page_refresh" === g.optInFrequencyType) ? (r({
                    optin: !0,
                    optinType: g.optInType
                }, "optin"), c(g), truepush.subscribeUserVapid(), optinStatus = "enable") : ("bell" === g.optInType || "spec_time" === g.optInFrequencyType && localStorage.getItem("optinShow") <= Date.now() || !sessionStorage.getItem("new_session") && "new_session" === g.optInFrequencyType || "page_refresh" === g.optInFrequencyType) && (r({
                    optin: !0,
                    optinType: g.optInType
                }, "optin"), c(g), optinStatus = "enable") : ("spec_time" === g.optInFrequencyType && localStorage.getItem("optinShow") <= Date.now() || !sessionStorage.getItem("new_session") && "new_session" === g.optInFrequencyType || "page_refresh" === g.optInFrequencyType) && (c(g), truepush.subscribeUserVapid()))
            }, 1e3 * g.optinShowInterval), isSubscribed = !1
        }

        function N(t, o, e) {
            if (!z(t, "vapid") && !n(t)) {
                var i = {
                    subscription: t,
                    userPlatformId: g._id,
                    isChrome: function () {
                        if (navigator && navigator.plugins) {
                            for (var t = 0; t < navigator.plugins.length; t++)
                                if ("Chrome PDF Viewer" == navigator.plugins[t].name) return !0;
                            return !1
                        }
                        return !1
                    }(),
                    language: navigator.language || navigator.userLanguage,
                    optinType: g.optInType
                };
                "update" == o && "Opera" === browserData.browser.name && "mobile" === browserData.device.type && (i.forceUpdate = !0), "allowed_cookies_only" === m.userConsent && (i.deniedPersonalData = !0, delete i.language), "granted" === v && (i.skipTriggers = !0), skipSubscriberReport && (i.skipSubscriberReport = !0);
                var r = localStorage.getItem("tp-visitsData");
                if (r) try {
                    r = JSON.parse(r), i.visitsData = s(r)
                } catch (t) {}
                var a = host + "api/v1/upsertSubscriber";
                HTTP.post(a, i, C, function (o, i) {
                    i && i.data && (O(t), localStorage.setItem("subscriberId", i.data), localStorage.removeItem("tp-visitsData"), e()), o && console.log("error while making upsertsubscriber req")
                })
            }
        }

        function O(t) {
            let o;
            o = "object" == typeof t ? JSON.stringify(t) : t, localStorage.setItem("subscription", o)
        }

        function z(t, o) {
            var e = localStorage.getItem("subscription");
            return !!localStorage && ("vapid" == o && (t = JSON.parse(JSON.stringify(t)), t = JSON.stringify(t)), t == e)
        }

        function E() {
            return fromIframe ? function () {
                "enable" != optinStatus || "box" !== g.optInType && "bell" !== g.optInType && "top_bar" !== g.optInType || truepush.HideOptin();
                var t;
                t = "false" == EnableHTTPLocalTest ? window.open(g.altUrl + "/subscribe/" + g._id, "HTTPSubscriptionWindow", "location=yes,height=570,width=520,scrollbars=yes,status=yes") : window.open(host + "sub-domain/subscribe/" + g._id, "HTTPSubscriptionWindow", "location=yes,height=570,width=520,scrollbars=yes,status=yes");
                setTimeout(() => {
                    q(t)
                }, 1e3)
            }() : browserData && browserData.browser && "Safari" === browserData.browser.name ? void B() : truepush.subscribeUserVapid()
        }

        function P(t) {
            var o = document.getElementById("successDiv"),
                e = document.getElementById("requestDiv"),
                i = document.getElementById("blockDiv");
            o.style.display = "none", e.style.display = "none", i.style.display = "none", "request" === t ? e.style.display = "block" : "success" === t ? (o.style.display = "block", setTimeout(function () {
                self.close()
            }, 4e3)) : "block" === t && (i.style.display = "block")
        }

        function H(t) {
            var o = document.createElement("textarea");
            return o.innerHTML = t, o.value
        }

        function M() {
            navigator.serviceWorker.ready.then(function (t) {
                t.pushManager.getSubscription().then(function (t) {
                    t ? t.unsubscribe().then(function (t) {
                        skipSubscriberReport = !1, truepush.subscribeUserVapid(!0)
                    }) : console.log("subscription is null")
                }).catch(function (t) {
                    console.log("error while getting ReSubscribe", t)
                })
            }).catch(function (t) {
                console.log("error while ready ReSubscribe", t)
            })
        }
        this.subscribeUserVapid = function (t) {
            if (browserData && browserData.browser && "Safari" === browserData.browser.name) B();
            else if ((Notification && "granted" != Notification.permission || t) && "serviceWorker" in navigator) try {
                permissionAllowed || fromSubDomain || r({
                    show: !0,
                    optinType: g.optInType
                }, "show"), Notification.requestPermission().then(function (e) {
                    localStorage.setItem("permission", Notification.permission), "enable" == optinStatus && truepush.HideOptin(), "denied" === Notification.permission ? (r({
                        block: !0,
                        optinType: g.optInType
                    }, "block"), a(), fromSubDomain && P("block")) : "default" === Notification.permission ? ("Firefox" === browserData.browser.name && function (t, o) {
                        var e = new Date;
                        e.setTime(e.getTime() + 1e4);
                        var i = "; expires=" + e.toGMTString();
                        document.cookie = t + "=" + o + i + "; path=/"
                    }("permission", "blocked"), r({
                        ignore: !0,
                        optinType: g.optInType
                    }, "ignore"), a()) : "granted" === Notification.permission && (key = o(g.vapidDetails.publicKey), R(function (o) {
                        o.pushManager.subscribe({
                            userVisibleOnly: !0,
                            applicationServerKey: key
                        }).then(function (e) {
                            subscription = i(e), !g.welcomeNotification || t || n(subscription) || skipSubscriberReport || function (t) {
                                var o = g.welcomeNotifTemplate,
                                    e = {};
                                o.image && o.imagesRegion ? e.image = imgUrl + "campaign_images/" + H(o.image) : o.image && (e.image = cdnUrl + "campaign_images/" + H(o.image));
                                o.icon && o.iconRegion ? e.icon = imgUrl + "website_icons/" + H(o.icon) : o.icon && (e.icon = cdnUrl + "website_icons/" + H(o.icon));
                                o.message && (e.body = H(o.message));
                                o.isActionRequired && (e.requireInteraction = !0);
                                e.data = g.welcomeNotifTemplate, o.url && (e.data.link = H(o.url));
                                e.data && (e.data.skipReport = !0, e.data.isWelcomeNotification = !0, e.data.platformId = g._id);
                                t.showNotification(H(o.title), e);
                                var i = {
                                        event: "view",
                                        platformId: g._id
                                    },
                                    n = host + "api/v1/welomeNotificationStats";
                                HTTP.post(n, i, C, function (t, o) {
                                    t && console.log("error while making upsertsubscriber req")
                                })
                            }(o), "enable" == optinStatus && truepush.HideOptin(), localStorage.setItem("permission", "granted"), fromSubDomain && P("success"), N(subscription, "no", function () {
                                $()
                            })
                        }).catch(function (t) {
                            console.log("catch error ", t), "granted" === Notification.permission && (console.log("ReSubscribe", JSON.stringify(t)), M())
                        })
                    }))
                })
            } catch (t) {
                console.log("error in catch block ", t)
            }
        }, this.Init = function (t, o) {
            if (m = t, !S || !fromSubDomain || x) {
                S = !0;
                var e = t.id;
                if (t.userConsent || (t.userConsent = "allowed_cookies_personal_data"), ["allowed_cookies_only", "denied", "allowed_cookies_personal_data"].indexOf(t.userConsent) < 0) return f = !0, o ? o("Invalid userConsent...!!!") : void 0;
                if ("denied" !== m.userConsent) {
                    if (m.serviceWorkerFileName || (m.serviceWorkerFileName = "sw.js"), m.serviceWorkerFileName && -1 != m.serviceWorkerFileName.indexOf("/")) return f = !0, o("Invalid serviceWorkerFileName...!!!");
                    I && (!fromIframe && !fromSubDomain || x ? L(e, function (t, o) {
                        if (o && "SUCCESS" == o.status) {
                            try {
                                if (o.data.browserDetails && (browserData = o.data.browserDetails, localStorage.setItem("browserInfo", JSON.stringify(o.data.browserDetails)), delete o.data.browserDetails), o.data && !o.data.sameData ? (g = o.data, localStorage.setItem("platformDetails", JSON.stringify(g))) : (g = localStorage.getItem("platformDetails"), g = JSON.parse(g)), g && g.audiencePrime) {
                                    let t = localStorage.getItem("tp-scriptStatus"),
                                        o = new Date,
                                        i = o.getFullYear() + "-" + o.getMonth() + "-" + o.getDate();
                                    if (!t || t != i) {
                                        localStorage.setItem("tp-scriptStatus", i);
                                        var e = document.createElement("script");
                                        e.type = "text/javascript", e.defer = !0, e.async = !0, e.onload = function () {
                                            audiencePlay.set(g.audiencePrime.apiKey), audiencePlay.start(g.audiencePrime.source), audiencePlay.end(), audiencePlay.send()
                                        }, e.src = "https://truepush1.digitalkites.com/audienceplay.js", document.body.appendChild(e)
                                    }
                                }
                                F(g) ? fromSubDomain ? ("box+" !== g.optInType || g.customStyles["box+"] || g.customStyles["box+"].subText || (g.customStyles["box+"].subText = ""), U(), f = !0) : k() : (localStorage.removeItem("platformDetails"), console.log("platform data is not valid"))
                            } catch (t) {}
                            g && g.websiteSSL && Q()
                        } else console.log("Unable to service truepushsdk", t)
                    }) : w.platformDetails = !1)
                } else f = !0
            }
        };
        var L = function (t, o) {
                var e = host + "api/v2/truepushSDKPlatfromDetails",
                    i = {};
                if (i.platformId = t, "v2" === version && (i.version = "v2"), localStorage.getItem("platformDetails")) {
                    var n = localStorage.getItem("platformDetails");
                    (n = JSON.parse(n)).updatedDate && (i.updatedDate = n.updatedDate)
                }
                if (!fromIframe && !fromSubDomain) {
                    "allowed_cookies_only" === m.userConsent && (i.deniedPersonalData = !0), i.visit = !0, localStorage.getItem("visited-tp") || (i.uniqueVisitors = !0, localStorage.setItem("visited-tp", !0));
                    var r = localStorage.getItem("tp-visitsData");
                    if (r) try {
                        r = JSON.parse(r), i.visitsData = s(r)
                    } catch (t) {}
                    var a = localStorage.getItem("subscription");
                    a && (i.subscription = a);
                    var p = localStorage.getItem("browserInfo");
                    p && (browserData = JSON.parse(p), i.skipBrowserInfo = !0)
                }
                HTTP.post(e, i, C, function (t, e) {
                    if (I) return t || localStorage.removeItem("tp-visitsData"), g ? void 0 : o(t, e)
                })
            },
            F = function (t) {
                try {
                    return t.customStyles && t.customStyles[t.optInType] ? t.customStyles = Object.assign({}, t.customStyles[t.optInType]) : t.customStyles = j[t.optInType], w.platformDetails = !1, "top_bar" === t.optInType && 0 !== t.customStyles.top && 0 !== t.customStyles.bottom && (t.customStyles.top = 0, t.customStyles.bottom = ""), t.websiteSSL || (t.altUrl = function (t) {
                        var o, e = /((https|http):\/\/)?(www\.)?([\w_\.-]+)(\/?)/.exec(t.websiteURL);
                        e ? (e[4].replace(/\//g, ""), o = e[4].replace(/\./g, "-")) : o = null;
                        return "https://" + o + "." + subDomainsHost
                    }(t)), t.optinShowInterval || (t.optinShowInterval = 0), t && t.vapidDetails && t.vapidDetails.publicKey || (t.vapidDetails = {
                        publicKey: defaultKey
                    }), t.optInFrequencyType || (t.optInFrequencyType = "page_refresh"), t.safariDetails && t.safariDetails.webPushId && (d = t.safariDetails.webPushId), !0
                } catch (t) {}
            };

        function U() {
            f || (f = !0, fromSubDomain || l(), fromIframe && !fromSubDomain ? ("granted" == Notification.permission || !localStorage || localStorage.getItem("permission") && "default" !== localStorage.getItem("permission")) && "default" !== Notification.permission || ("custom" != g.optInType && setTimeout(function () {
                "default" != g.optInType && "default+" != g.optInType ? ("bell" === g.optInType || "spec_time" === g.optInFrequencyType && localStorage.getItem("optinShow") <= Date.now() || !sessionStorage.getItem("new_session") && "new_session" === g.optInFrequencyType || "page_refresh" === g.optInFrequencyType) && (c(g), r({
                    optin: !0,
                    optinType: g.optInType
                }, "optin"), optinStatus = "enable") : ("spec_time" === g.optInFrequencyType && localStorage.getItem("optinShow") <= Date.now() || !sessionStorage.getItem("new_session") && "new_session" === g.optInFrequencyType || "page_refresh" === g.optInFrequencyType) && (c(g), E())
            }, 1e3 * g.optinShowInterval), isSubscribed = !1) : (g.websiteSSL || fromSubDomain) && "safari" != browserData.browser.name.toLowerCase() ? D() : "safari" == browserData.browser.name.toLowerCase() ? function (t) {
                if ("all" === t.browserSupport || "safari" === t.browserSupport) {
                    if (t.safariDetails && t.safariDetails.webPushId) return !0;
                    console.log("No safari certificate found", t)
                } else console.log("not opted for safari")
            }(g) && function () {
                if ("safari" in window && "pushNotification" in window.safari) {
                    var t = window.safari.pushNotification.permission(d);
                    "default" === t.permission ? "custom" != g.optInType && setTimeout(function () {
                        "default" != g.optInType && "default+" != g.optInType ? ("bell" === g.optInType || "spec_time" === g.optInFrequencyType && localStorage.getItem("optinShow") <= Date.now() || !sessionStorage.getItem("new_session") && "new_session" === g.optInFrequencyType || "page_refresh" === g.optInFrequencyType) && (r({
                            optin: !0,
                            optinType: g.optInType
                        }, "optin"), c(g), optinStatus = "enable") : ("spec_time" === g.optInFrequencyType && localStorage.getItem("optinShow") <= Date.now() || !sessionStorage.getItem("new_session") && "new_session" === g.optInFrequencyType || "page_refresh" === g.optInFrequencyType) && (g.optInType = "bell", c(g), optinStatus = "enable")
                    }, 1e3 * g.optinShowInterval) : "granted" === t.permission && (subscription = t.deviceToken)
                }
            }() : function () {
                try {
                    ! function () {
                        var t = "box+" === g.optInType ? "box2" : g.optInType;
                        t = "default+" === t ? "default2" : t;
                        var o = document.createElement("div"),
                            e = "";
                        "bell" === t ? e = "iframe_optinbell_tp" : "top_bar" === t ? e = "iframe_optinbar_tp" : "box" === t ? e = "iframe_optinbox_tp" : "box2" === t && (e = "iframe_optinboxplus_tp");
                        o.innerHTML = "<iframe id='tp-iframe' onload='truepush.Iframloaded()' class=" + e + " style='display:none;bottom:" + g.customStyles.bottom + "px;top:" + g.customStyles.top + "px' src='" + g.altUrl + "/subscribe/" + g._id + "?fromIframe=true'>";
                        var i = document.createElement("div");
                        i.innerHTML = "<iframe id='tp-iframe' onload='truepush.Iframloaded()' class=" + e + " style='display:none;bottom:" + g.customStyles.bottom + "px;top:" + g.customStyles.top + "px' src='" + host + "sub-domain/subscribe/" + g._id + "?fromIframe=true'>", "true" == EnableHTTPLocalTest && (o = i);
                        document.body.appendChild(o)
                    }()
                } catch (t) {}
            }())
        }

        function q(t) {
            t && (g.userConsent = m.userConsent, g.browserInfo = browserData, t.postMessage(g, "*"))
        }

        function B() {
            if ("safari" in window && "pushNotification" in window.safari) {
                var t = window.safari.pushNotification.permission(d);
                "default" === t.permission && (localStorage.removeItem("subscription"), localStorage.removeItem("tags"), window.safari.pushNotification.requestPermission(host.slice(0, -1), d, {
                    platformId: g._id
                }, A))
            }
        }

        function A() {
            truepush.HideOptin();
            var t = window.safari.pushNotification.permission(d);
            if (localStorage.setItem("permission", t.permission), "denied" === t.permission) r({
                block: !0,
                optinType: g.optInType
            }, "block"), a();
            else if ("granted" === t.permission) {
                g._id, t.deviceToken;
                subscription = t.deviceToken;
                ! function (t, o) {
                    if (z(t, "safari")) return;
                    var e = {
                        subscription: t,
                        platformId: g._id,
                        language: navigator.language || navigator.userLanguage,
                        optinType: g.optInType
                    };
                    "allowed_cookies_only" === m.userConsent && (e.deniedPersonalData = !0, delete e.language);
                    "granted" === v && (e.skipTriggers = !0);
                    skipSubscriberReport && (e.skipSubscriberReport = !0);
                    var i = localStorage.getItem("tp-visitsData");
                    if (i) try {
                        i = JSON.parse(i), e.visitsData = s(i)
                    } catch (t) {}
                    var n = host + "api/v1/safari/addSubscriber";
                    HTTP.post(n, e, C, function (e, i) {
                        i && i.data && (O(t), localStorage.setItem("subscriberId", i.data), localStorage.removeItem("tp-visitsData"), o()), e && console.log("error while making upsertsubscriber req")
                    })
                }(subscription, function () {
                    $()
                })
            }
        }
        this.Iframloaded = function () {
            q(iFrameReference = document.getElementById("tp-iframe").contentWindow)
        }, this.IsInitialized = function () {
            return !!S
        }, this.GetUserConsent = function () {
            return m.userConsent
        };
        var j = {
            box: {
                mainText: "Allow updates from truepush.com",
                firstBtnText: "Not now",
                subText: "You can turn it off whenever you like.",
                secondBtnText: "Allow",
                visibleStatus: "none"
            },
            "box+": {
                mainText: "Allow updates from truepush.com",
                firstBtnText: "Not now",
                secondBtnText: "Allow",
                visibleStatus: "none"
            },
            top_bar: {
                barColor: "#000",
                textColor: "#fff",
                buttonColor: "#4A90E2",
                buttonTextColor: "#fff",
                barText: "This is optinbar text information",
                buttonText: "Subscribe to push notifications",
                top: 0,
                bottom: ""
            },
            bell: {
                circleColor: "#F00",
                bellColor: "#fff"
            },
            custom: {
                backgroundColor: "#4A90E2",
                textColor: "#fff",
                buttonText: "Subscribe to push notifications"
            },
            default: {},
            "default+": {}
        };
        this.push = function (t) {
            if ("function" == typeof t) S || (S = !0, t());
            else {
                if (u.indexOf(t.operation) < 0) return void console.log("Invalid operation");
                "add-tags" === t.operation ? truepush.addTags(t.data, t.callback) : "remove-tags" == t.operation ? truepush.removeTags(t.data, t.callback) : "get-tags" == t.operation && truepush.getTags(t.callback)
            }
        }, this.GetSubscriberId = function (t) {
            if (g && !g.websiteSSL) return subscriberIdCallback = t, void iFrameReference.postMessage({
                type: "getSubscriberId"
            }, "*");
            if ("granted" != Notification.permission) return t("Permission not granted", null);
            if (!K()) return t("Script not yet initialized", null);
            var o = localStorage.getItem("subscriberId");
            if (o) return t(null, o);
            W(function (o) {
                o || t("subscription not found", null);
                var e = host + "api/v1/getSubscriberId",
                    i = {
                        userPlatformId: g._id,
                        subscription: o
                    };
                HTTP.post(e, i, C, function (o, e) {
                    return o ? t("Unable to serve subscriberId", null) : "ERROR" == e.status ? t(i.message, null) : e && e.data ? (localStorage.setItem("subscriberId", e.data), t(null, e.data)) : t("Unable to serve subscriberId", null)
                })
            })
        };
        var W = function (t) {
                if ("granted" != Notification.permission) return t(null);
                if (subscription) return t(subscription);
                if (fromIframe) {
                    var o = localStorage.getItem("subscription");
                    if (o) try {
                        return "object" == typeof o && (o = i(JSON.parse(o))), t(o)
                    } catch (o) {
                        return t(null)
                    }
                    return t(null)
                }
                if (browserData && browserData.browser && "Safari" === browserData.browser.name) {
                    try {
                        var e = window.safari.pushNotification.permission(d)
                    } catch (t) {
                        console.log("window.safari.pushNotification.permission ", t)
                    }
                    return e.deviceToken ? t(e.deviceToken) : t(null)
                }
                navigator.serviceWorker.ready.then(function (o) {
                    o.pushManager.getSubscription().then(function (o) {
                        return t(i(o))
                    }).catch(function (o) {
                        return t(null)
                    })
                }).catch(function (o) {
                    return t(null)
                })
            },
            J = host + "api/v1/";
        this.getTags = function (t) {
            V(function (o) {
                if (o) return "INIT-ERROR" === o.statusCode ? void(_ = {
                    callback: t
                }) : t(o, null);
                tt("get");
                var e = J + "getTags",
                    i = {
                        userPlatformId: g._id
                    };
                W(function (o) {
                    if (!o) return t({
                        message: "Notification permission not granted.",
                        status: "ERROR",
                        statusCode: "SUBSCRIPTION-ERROR"
                    }, null);
                    i.subscription = o, HTTP.post(e, i, C, function (o, e) {
                        return o ? t({
                            message: "Something went wrong. Please try again.",
                            status: "ERROR",
                            statusCode: "INS-ERROR"
                        }, null) : "ERROR" == e.status ? t(e, null) : t(null, e)
                    })
                })
            })
        }, this.removeTags = function (t, o) {
            V(function (e) {
                if (e) return "INIT-ERROR" === e.statusCode ? void(h = {
                    tags: t,
                    callback: o
                }) : "SUBSCRIPTION-ERROR" == e.statusCode ? void Z(t) : o(e, null);
                G(t), tt("remove");
                var i = J + "removeTags";
                if (!t || !t.length) return o({
                    message: "Tags shouldn't be empty.",
                    status: "ERROR",
                    statusCode: "VALIDATION-ERROR"
                }, null);
                var n = {
                    userPlatformId: g._id,
                    tags: t
                };
                W(function (t) {
                    if (!t) return o({
                        message: "Notification permission not granted.",
                        status: "ERROR",
                        statusCode: "SUBSCRIPTION-ERROR"
                    }, null);
                    n.subscription = t, HTTP.post(i, n, C, function (t, e) {
                        return t ? o({
                            message: "Something went wrong. Please try again.",
                            status: "ERROR",
                            statusCode: "INS-ERROR"
                        }, null) : "ERROR" == e.status ? o(e, null) : o(null, e)
                    })
                })
            })
        }, this.addTags = function (t, o) {
            V(function (e) {
                if (e) return "INIT-ERROR" === e.statusCode ? void(b = {
                    tags: t,
                    callback: o
                }) : "SUBSCRIPTION-ERROR" == e.statusCode ? void X(t) : o(e, null);
                var i = J + "addTags";
                if (!t || !t.length) return o({
                    message: "Tags shouldn't be empty.",
                    status: "ERROR",
                    statusCode: "VALIDATION-ERROR"
                }, null);
                var n = Y(t);
                if (tt("add"), 0 === n.length) return o(null, {
                    message: "Tags added successfully.",
                    status: "SUCCESS",
                    status_code: "SUCCESS"
                });
                var r = {
                    userPlatformId: g._id,
                    tags: n
                };
                W(function (e) {
                    if (!e) return o({
                        message: "Notification permission not granted.",
                        status: "ERROR",
                        statusCode: "SUBSCRIPTION-ERROR"
                    }, null);
                    r.subscription = e, HTTP.post(i, r, C, function (e, i) {
                        return e ? o({
                            message: "Something went wrong. Please try again.",
                            status: "ERROR",
                            statusCode: "INS-ERROR"
                        }, null) : "ERROR" == i.status ? o(i) : (localStorage.setItem("tags", JSON.stringify({
                            tags: t
                        })), o(null, i))
                    })
                })
            })
        };
        var V = function (t) {
                var o = {
                    message: "Notification permission not granted.",
                    status: "ERROR",
                    statusCode: "SUBSCRIPTION-ERROR"
                };
                return S ? "allowed_cookies_personal_data" != m.userConsent ? (o.message = "consent denied", o.statusCode = "CONSENT-DENIED", t(o)) : g ? g.websiteSSL ? "granted" != Notification.permission ? t(o) : t(null) : (o.message = "Tags support for http websites is not available yet.", o.statusCode = "HTTP-ERROR", t(o)) : (o.message = "platformdetails are not ready", o.statusCode = "INIT-ERROR", t(o)) : (o.message = "truepush sdk is not initialized", o.statusCode = "INIT-ERROR", t(o))
            },
            K = function () {
                return !!S && !!g
            },
            Y = function (t) {
                var o = localStorage.getItem("tags");
                if (!o) return t;
                try {
                    o = (o = JSON.parse(o)).tags;
                    for (var e = [], i = 0; i < t.length; i++) {
                        var n = o.findIndex(function (o) {
                            return o.tagName === t[i].tagName && o.tagValue === t[i].tagValue && o.tagType === t[i].tagType
                        }); - 1 == n && e.push(t[i])
                    }
                    return e
                } catch (o) {
                    return localStorage.removeItem("tags"), t
                }
            };
        const X = function (t) {
                t = JSON.parse(JSON.stringify(t));
                let o = localStorage.getItem("unsavedTags");
                if (o) try {
                    o = JSON.parse(o)
                } catch (t) {
                    console.error(t), o = []
                } else o = [];
                for (let e of o) {
                    let o = t.findIndex(t => t.tagName == e.tagName && t.tagType == e.tagType && t.tagValue == e.tagValue);
                    o >= 0 && t.splice(o, 1)
                }
                t = o.concat(t), localStorage.setItem("unsavedTags", JSON.stringify(t))
            },
            Z = function (t) {
                t = JSON.parse(JSON.stringify(t));
                let o = localStorage.getItem("unsavedTags");
                if (o) try {
                    o = JSON.parse(o)
                } catch (t) {
                    console.error(t), o = []
                } else o = [];
                for (let e of t) {
                    let t = o.findIndex(t => t.tagName == e.tagName && t.tagType == e.tagType && t.tagValue == e.tagValue);
                    t >= 0 && o.splice(t, 1)
                }
                o.length > 0 ? localStorage.setItem("unsavedTags", JSON.stringify(o)) : localStorage.removeItem("unsavedTags")
            };
        var G = function (t) {
            var o = localStorage.getItem("tags");
            if (o) try {
                o = (o = JSON.parse(o)).tags;
                for (var e = [], i = 0; i < o.length; i++) {
                    var n = t.findIndex(function (t) {
                        return t.tagName === o[i].tagName && t.tagValue === o[i].tagValue
                    }); - 1 == n && e.push(o[i])
                }
                return e.length != o.length && e.length > 0 && localStorage.setItem("tags", JSON.stringify({
                    tags: e
                })), void(0 == e.length && localStorage.removeItem("tags"))
            } catch (o) {
                return localStorage.removeItem("tags"), t
            }
        };
        this.GetPlatformDetails1 = function () {
            return "Testing string"
        };
        var Q = function () {
            b && truepush.addTags(b.tags, b.callback), h && truepush.removeTags(h.tags, h.callback), _ && truepush.getTags(_.callback)
        };
        const $ = function () {
            let t = localStorage.getItem("unsavedTags");
            if (t) try {
                t = JSON.parse(t)
            } catch (o) {
                console.error(o), t = []
            } else t = [];
            t.length > 0 && truepush.addTags(t, function (t, o) {
                console.log(t, o), t || localStorage.removeItem("unsavedTags")
            })
        };
        var tt = function (t) {
            "get" === t && (_ = null), "add" === t && (b = null), "remove" === t && (h = null)
        };
        "permissions" in navigator && navigator.permissions.query({
            name: "notifications"
        }).then(function (t) {
            t.onchange = function () {
                console.log("notification permission is ", t.state), "prompt" == t.state && (console.log("notification permission is ", t.state), localStorage.setItem("permission", "default"), localStorage.removeItem("subscriberId"), localStorage.removeItem("subscription"), localStorage.removeItem("tags")), "denied" == t.state && (console.log("notification permission is blocked"), localStorage.setItem("permission", "denied"))
            }
        })
    }
}(0, this), window.addEventListener("load", function () {
    var t = [];
    if (window.truepush && (t = window.truepush), !window.truepush || !window.truepush.Init) {
        let o;
        truepush = new truepushSDK;
        for (let e = 0; e < t.length; e++)
            if ("function" == typeof t[e]) {
                o = t[e], t.splice(e, 1);
                break
            } if (!o) return void console.error("initialization script not found");
        if (truepush.push(o), t && 0 == t.length) return;
        if ("allowed_cookies_personal_data" != truepush.GetUserConsent()) return void console.log("UserConsent for personal data is denied, Can not add tags.");
        for (let o = 0; o < t.length; o++) truepush.push(t[o])
    }
}), loadAppJs = function () {
    var t = [];
    if (window.truepush && (t = window.truepush), window.truepush && window.truepush.Init) console.log("Already initialize truepush.");
    else {
        let o;
        truepush = new truepushSDK;
        for (let e = 0; e < t.length; e++)
            if ("function" == typeof t[e]) {
                o = t[e], t.splice(e, 1);
                break
            } if (!o) return void console.error("initialization script not found");
        if (truepush.push(o), t && 0 == t.length) return;
        if ("allowed_cookies_personal_data" != truepush.GetUserConsent()) return void console.log("UserConsent for personal data is denied, Can not add tags.");
        for (let o = 0; o < t.length; o++) truepush.push(t[o])
    }
};
