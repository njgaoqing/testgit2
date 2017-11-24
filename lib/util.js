/**
 * Created by ytuser on 2017/5/15.
 */

function Base64() {
    // private property
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for encoding
    this.encode = function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }

    // private method for UTF-8 encoding
    _utf8_encode = function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }
};
var Bs = new Base64();
var auth = "Basic " + Bs.encode('yitongfood:287031201');
var baseUrl = 'http://www.yitongfood.com/api/';
var baseUrl2 = 'http://www.yitongfood.com/';
var token = null;

var getToken = function(sucFun) {
    $.ajax({
        url: baseUrl2 + 'token',
        type: 'post',
        async: false,
        data: { "grant_type": "client_credentials" },
        success: function(re) {
            token = "Bearer " + re.access_token;
            sucFun(token);
        },
        beforeSend: function(req) {
            req.setRequestHeader('Authorization', auth);
        }
    });
};

var postMsgFun = function(url, obj, sucFun) {
    obj.MakerId = "howbetter";
    var postFun = function(headerValue) {
        $.ajax({
            url: url,
            type: 'post',
            contentType: "application/json",
            data: JSON.stringify(obj),
            success: function(re) {
                if (sucFun != undefined) {
                    sucFun(re);
                }
            },
            beforeSend: function(req) {
                //  req.setRequestHeader('Authorization', headerValue);
            }
        });
    };
    postFun();

    /*if (token == null) {
        getToken(postFun);
    } else {
        postFun(token);
    }*/
}

var requestFun = function(method, query, url, sucFun) {
    var getFun = function(headerValue) {
        $.ajax({
            url: url,
            type: method,
            contentType: "application/json",
            data: query,
            success: function(re) {
                if (sucFun != undefined) {
                    sucFun(re);
                }
            },
            beforeSend: function(req) {
                //req.setRequestHeader('Authorization', headerValue);
            }
        });
    }
    getFun();

    /*if (token == null) {
        getToken(getFun);
    } else {
        getFun(token);
    }*/
};