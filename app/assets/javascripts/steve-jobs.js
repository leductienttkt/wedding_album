/* Steve jobs' book */

function updateDepth(book, newPage) {

	var page = book.turn('page'),
		pages = book.turn('pages'),
		depthWidth = 16*Math.min(1, page*2/pages);

		newPage = newPage || page;

	if (newPage>3)
		$('.sj-book .p2 .depth').css({
			width: depthWidth,
			left: 20 - depthWidth
		});
	else
		$('.sj-book .p2 .depth').css({width: 0});

		depthWidth = 16*Math.min(1, (pages-page)*2/pages);

	if (newPage<pages-3)
		$('.sj-book .p111 .depth').css({
			width: depthWidth,
			right: 20 - depthWidth
		});
	else
		$('.sj-book .p111 .depth').css({width: 0});

}

function loadPage(page) {

	$.ajax({url: 'pages/page' + page + '.html'}).
		done(function(pageHtml) {
			$('.sj-book .p' + page).html('');
		});

}

function addPage(page, book) {

	var id, pages = book.turn('pages');

	if (!book.turn('hasPage', page)) {

		var element = $('<div />',
			{'class': 'own-size',
				css: {width: 460, height: 582}
			}).
			html('<div class="loader"></div>');

		if (book.turn('addPage', element, page)) {
			loadPage(page);
		}

	}
}

function numberOfViews(book) {

	return book.turn('pages') / 2 + 1;

}

function getViewNumber(book, page) {

	return parseInt((page || book.turn('page'))/2 + 1, 10);

}

function zoomHandle(e) {

	if ($('.sj-book').data().zoomIn)
		zoomOut();
	else if (e.target && $(e.target).hasClass('zoom-this')) {
		zoomThis($(e.target));
	}

}

function zoomThis(pic) {

	var	position, translate,
		tmpContainer = $('<div />', {'class': 'zoom-pic'}),
		transitionEnd = $.cssTransitionEnd(),
		tmpPic = $('<img />'),
		zCenterX = $('#book-zoom').width()/2,
		zCenterY = $('#book-zoom').height()/2,
		bookPos = $('#book-zoom').offset(),
		picPos = {
			left: pic.offset().left - bookPos.left,
			top: pic.offset().top - bookPos.top
		},
		completeTransition = function() {
			$('#book-zoom').unbind(transitionEnd);

			if ($('.sj-book').data().zoomIn) {
				tmpContainer.appendTo($('body'));

				$('body').css({'overflow': 'hidden'});

				tmpPic.css({
					margin: position.top + 'px ' + position.left+'px'
				}).
				appendTo(tmpContainer).
				fadeOut(0).
				fadeIn(500);
			}
		};

		$('.sj-book').data().zoomIn = true;

		$('.sj-book').turn('disable', true);

		$(window).resize(zoomOut);

		tmpContainer.click(zoomOut);

		tmpPic.load(function() {
			var realWidth = $(this)[0].width,
				realHeight = $(this)[0].height,
				zoomFactor = realWidth/pic.width(),
				picPosition = {
					top:  (picPos.top - zCenterY)*zoomFactor + zCenterY + bookPos.top,
					left: (picPos.left - zCenterX)*zoomFactor + zCenterX + bookPos.left
				};


			position = {
				top: ($(window).height()-realHeight)/2,
				left: ($(window).width()-realWidth)/2
			};

			translate = {
				top: position.top-picPosition.top,
				left: position.left-picPosition.left
			};

			$('.samples .bar').css({visibility: 'hidden'});

			$('#book-zoom').transform(
				'translate('+translate.left+'px, '+translate.top+'px)' +
				'scale('+zoomFactor+', '+zoomFactor+')');

			if (transitionEnd)
				$('#book-zoom').bind(transitionEnd, completeTransition);
			else
				setTimeout(completeTransition, 1000);

		});

		tmpPic.attr('src', pic.attr('src'));

}

function zoomOut() {

	var transitionEnd = $.cssTransitionEnd(),
		completeTransition = function(e) {
			$('#book-zoom').unbind(transitionEnd);
			$('.sj-book').turn('disable', false);
			$('body').css({'overflow': 'auto'});
		};

	$('.sj-book').data().zoomIn = false;

	$(window).unbind('resize', zoomOut);

	$('.zoom-pic').remove();
	$('#book-zoom').transform('scale(1, 1)');
	$('.samples .bar').css({visibility: 'visible'});

	if (transitionEnd)
		$('#book-zoom').bind(transitionEnd, completeTransition);
	else
		setTimeout(completeTransition, 1000);
}


function isChrome() {

	// Chrome's unsolved bug
	// http://code.google.com/p/chromium/issues/detail?id=128488

	return navigator.userAgent.indexOf('Chrome')!=-1;

}

function loadApp() {

	var flipbook = $('.sj-book');

	// Check if the CSS was already loaded

	if (flipbook.width()==0 || flipbook.height()==0) {
		setTimeout(loadApp, 10);
		return;
	}

	// Mousewheel

	$('#book-zoom').mousewheel(function(event, delta, deltaX, deltaY) {

		var data = $(this).data(),
			step = 30,
			flipbook = $('.sj-book'),
			actualPos = Math.round(flipbook.turn('page')/2)*step;

		if (typeof(data.scrollX)==='undefined') {
			data.scrollX = actualPos;
			data.scrollPage = flipbook.turn('page');
		}

        data.scrollX = Math.min(flipbook.turn('pages')/2*step,
            Math.max(0, data.scrollX + deltaX));

		var actualView = Math.round(data.scrollX/step),
			page = Math.min(flipbook.turn('pages'), Math.max(1, actualView*2 - 2));

		if ($.inArray(data.scrollPage, flipbook.turn('view', page))==-1) {
			data.scrollPage = page;
			flipbook.turn('page', page);
		}

		if (data.scrollTimer)
			clearInterval(data.scrollTimer);

		data.scrollTimer = setTimeout(function(){
			data.scrollX = undefined;
			data.scrollPage = undefined;
			data.scrollTimer = undefined;
		}, 1000);
	});

	// Arrows

	$(document).keydown(function(e){

		var previous = 37, next = 39;

		switch (e.keyCode) {
			case previous:

				$('.sj-book').turn('previous');

			break;
			case next:

				$('.sj-book').turn('next');

			break;
		}

	});


	// Flipbook

	flipbook.bind(($.isTouch) ? 'touchend' : 'click', zoomHandle);

	flipbook.turn({
		elevation: 50,
		acceleration: !isChrome(),
		autoCenter: true,
		gradients: true,
		duration: 1000,
		pages: 112,
		when: {
			turning: function(e, page, view) {

				var book = $(this),
					currentPage = book.turn('page'),
					pages = book.turn('pages');

				if (currentPage>3 && currentPage<pages-3) {

					if (page==1) {
						book.turn('page', 2).turn('stop').turn('page', page);
						e.preventDefault();
						return;
					} else if (page==pages) {
						book.turn('page', pages-1).turn('stop').turn('page', page);
						e.preventDefault();
						return;
					}
				} else if (page>3 && page<pages-3) {
					if (currentPage==1) {
						book.turn('page', 2).turn('stop').turn('page', page);
						e.preventDefault();
						return;
					} else if (currentPage==pages) {
						book.turn('page', pages-1).turn('stop').turn('page', page);
						e.preventDefault();
						return;
					}
				}

				updateDepth(book, page);

				if (page>=2)
					$('.sj-book .p2').addClass('fixed');
				else
					$('.sj-book .p2').removeClass('fixed');

				if (page<book.turn('pages'))
					$('.sj-book .p111').addClass('fixed');
				else
					$('.sj-book .p111').removeClass('fixed');

			},

			turned: function(e, page, view) {

				var book = $(this);

				if (page==2 || page==3) {
					book.turn('peel', 'br');
				}

				updateDepth(book);

				book.turn('center');

			},

			end: function(e, pageObj) {

				var book = $(this);

				updateDepth(book);

			},

			missing: function (e, pages) {

				for (var i = 0; i < pages.length; i++) {
					addPage(pages[i], $(this));
				}

			}
		}
	});


    flipbook.addClass('animated');

	// Show canvas

	$('#canvas').css({visibility: ''});
}
