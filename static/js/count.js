$(document).ready(function() {
    pre_content = $("#jalpc_site_pv").html();
    $("#jalpc_site_pv").html(pre_content);
    // 访问计数器服务已不可用，已禁用
    // 如果需要统计功能，可以集成其他服务如 Google Analytics
    /*
    $.ajax({
        type: "get",
        async: false,
        url: "https://miniapp.jack003.com/counter.cgi",
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "flightHandler",
        success: function(json) {
            var website_count = json.data;
            $("#jalpc_site_pv").html('<span class="navy">' + website_count + '</span>&nbsp;<span data-i18n="link.view">views</span>&nbsp;||&nbsp;' + pre_content);
        },
        error: function() {
            console.log('Counter service unavailable');
        }
    });
    */
});
