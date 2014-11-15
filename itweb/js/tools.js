/**
 *工具条组件
 */

jQuery.extend(jQuery.easing,
        {
                def: 'easeOutQuad',
                swing: function(x, t, b, c, d) {
                        return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
                },
                easeInQuad: function(x, t, b, c, d) {
                        return c * (t /= d) * t + b;
                },
                easeOutQuad: function(x, t, b, c, d) {
                        return -c * (t /= d) * (t - 2) + b;
                },
                easeIn: function(x, t, b, c, d) {
                        return jQuery.easing.easeInQuad(x, t, b, c, d);
                },
                easeOut: function(x, t, b, c, d) {
                        return jQuery.easing.easeOutQuad(x, t, b, c, d);
                }
        });

;
(function($) {

        if (!click) {
                var click = 'click';
        }
        ;

        var toolsPanel = $('<div class="tools">' +
                '<a href="javascript:;" class="t_backTop" title="返回顶部" role="top" style="display:none"></a>' +
                '<a href="javascript:;" class="t_newMessage" title="您有新消息" style="display:none;" role="newMsg"></a>' +
                (typeof imURL == 'string' ? '<a href="javascript:;" class="t_openIm" title="在线客服" role="getIm"></a>' : '') +
                '<a href="javascript:;" class="t_share" title="分享" role="share"></a>' +
                '</div>'),
                topBtn = $('a[role="top"]', toolsPanel),
                imPanel = null,
                sharePanel = null,
                titlePanel = '',
                getIM = function() {
                        imPanel = $('<div class="im" style="bottom:-100%;">' +
                                '<div class="im_top">' +
                                '<div class="im_topIcon">' +
                                '<a href="javascript:;" class="im_minimize" title="最小化窗口" role="minimize" ></a>' +
                                '<a href="javascript:;" class="im_close" title="关闭窗口" role="close"></a>' +
                                '</div>' +
                                '<div class="im_topTitle">在线客服</div>' +
                                '</div>' +
                                '<div class="im_dialogueMain">' +
                                '<iframe width="100%;" scrolling="auto" height="100%" frameborder="0" src="' + imURL + '&url=' + encodeURIComponent(window.location.href) + '"></iframe>' +
                                '</div>' +
                                '</div>'),
                                titlePanel = $('div.im_topTitle', imPanel);

                        imPanel.appendTo('body').delegate('a[role]', click, function(e) {
                                switch ($(this).attr('role')) {
                                        case 'minimize':
                                                minimizeIM();
                                                break;

                                        case 'close':
                                                closeIM();
                                                break;
                                }
                        });

                        openIM();
                },
                openIM = function() {
                        imPanel.animate({bottom: 0}, 'fast', 'easeOut');
                },
                closeIM = function() {
                        minimizeIM(function() {
                                $('iframe', imPanel).attr('src', '');
                                setTimeout(function() {
                                        imPanel.remove();
                                        imPanel = null;
                                }, 50);
                        });
                },
                minimizeIM = function(fn) {
                        imPanel.animate({bottom: '-100%'}, 'fast', 'easeOut', fn);
                },
                setTitle = function(msg) {
                        titlePanel.html(msg);
                },
                getShare = function() {
                        var html = '<div class="tool_share" style="bottom:-100%;">' +
                                '<div class="tool_shareHead">分享' +
                                '<a href="javascript:;" title="关闭" class="tool_shareClose" role="close"></a>' +
                                '</div>' +
                                '<div class="tool_shareMain clearfix">' +
                                '<ul>' +
                                '<li><a target="_blank" data-type="sinaminiblog" href="javascript:;"><i class="tool_share_sina"></i>新浪微博</a></li>' +
                                '<li><a target="_blank" data-type="renren" href="javascript:;"><i class="tool_share_rr"></i>人人网</a></li>' +
                                '<li><a target="_blank" data-type="kaixin001" href="javascript:;"><i class="tool_share_kx"></i>开心网</a></li>' +
                                '<li><a target="_blank" data-type="douban" href="javascript:;"><i class="tool_share_db"></i>豆瓣</a></li>' +
                                '<li><a  role="qrcode" href="javascript:;"><i class="tool_share_wx"></i>微信</a></li>' +
                                '<li><a target="_blank" data-type="qqmb" href="javascript:;"><i class="tool_share_qqwb"></i>腾讯微博</a></li>' +
                                '<li><a target="_blank" data-type="qzone" href="javascript:;"><i class="tool_share_qzone"></i>QQ空间</a></li>' +
                                '<li><a href="javascript:;" role="qrcode"><i class="tool_share_ewm"></i>二维码</a></li>' +
                                '</ul>' +
                                '</div>' +
                                '</div>';
                        sharePanel = $(html);
                        sharePanel.appendTo('body').delegate('a[role]', click, function(e) {
                                switch ($(this).attr('role')) {

                                        case 'close':
                                                closeShare();
                                                break;

                                        case 'qrcode':
                                                Alert('<div style="text-align:center"><div id="codeMsg">二维码生成中</div><div id="codeLoading">' + getContentLoading() + '</div><img src="' + qrcodeApi + encodeURIComponent(window.location.href) + '" width="180" height="180" id="qrCode" style="display:none"/></div>');
                                                $('#qrCode').load(function() {
                                                        $(this).show();
                                                        $('#codeLoading').remove();
                                                        $('#codeMsg').html('用微信扫描二维码，分享到朋友圈！');
                                                }).error(function() {
                                                        $(this).remove();
                                                        $('#codeLoading').remove();
                                                        $('#codeMsg').html('二维码生成出错，请重试！');
                                                });
                                                break;
                                }
                        }).find('a[target]').each(function() {
                                var href = shareURL.replace('{shareTo}', $(this).data('type')).replace('{url}', encodeURIComponent(window.location.href)) + '&summary=' + ($('title').html() ? $('title').html().split('-')[$('title').html().split('-').length - 1] : '');
                                $(this).attr('href', href);
                        });
                        ;

                        openShare();
                },
                openShare = function() {
                        sharePanel.animate({bottom: 0}, 'fast', 'easeOut');
                },
                closeShare = function() {
                        sharePanel.animate({bottom: '-100%'}, 'fast', 'easeOut');
                };


        toolsPanel.appendTo('body').delegate('a[role]', click, function(e) {
                switch ($(this).attr('role')) {
                        case 'top':
                                $(window).scrollTop(1);
                                break;

                        case 'getIm':
                                if (imPanel) {
                                        openIM();
                                } else {
                                        getIM();
                                }
                                break;

                        case 'share':
                                if (sharePanel) {
                                        openShare();
                                } else {
                                        getShare();
                                }
                                break;


                }
        });

        $(window).scroll(function() {
                if ($(window).scrollTop() > 100) {
                        topBtn.show();
                } else {
                        topBtn.hide();
                }
        });

        if ($(window).scrollTop() > 100) {
                topBtn.show();
        }
        ;

})(jQuery);
