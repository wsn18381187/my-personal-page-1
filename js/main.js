$(function () {
    // resize window
    $(window).resize(function () {
        if ($(window).width() < 1280 && $(window).width()>540) {
            $(".page").css({"width": $(window).width() - $(".side-card").width() - 90, "float": "left"})
        } else {
            $(".page").removeAttr("style")
        }
    });

    // menu
    $(".menus_icon").click(function () {
        if ($(".header_wrap").hasClass("menus-open")) {
            $(".header_wrap").removeClass("menus-open").addClass("menus-close")
        } else {
            $(".header_wrap").removeClass("menus-close").addClass("menus-open")
        }
    })

    $(".m-social-links").click(function () {
        if ($(".author-links").hasClass("is-open")) {
            $(".author-links").removeClass("is-open").addClass("is-close")
        } else {
            $(".author-links").removeClass("is-close").addClass("is-open")
        }
    })

    $(".site-nav").click(function () {
        if ($(".nav").hasClass("nav-open")) {
            $(".nav").removeClass("nav-open").addClass("nav-close")
        } else {
            $(".nav").removeClass("nav-close").addClass("nav-open")
        }
    })

    $(document).click(function(e){
        var target = $(e.target);
        if(target.closest(".nav").length != 0) return;
        $(".nav").removeClass("nav-open").addClass("nav-close")
        if(target.closest(".author-links").length != 0) return;
        $(".author-links").removeClass("is-open").addClass("is-close")
        if((target.closest(".menus_icon").length != 0) || (target.closest(".menus_items").length != 0)) return;
        $(".header_wrap").removeClass("menus-open").addClass("menus-close")
    })

    // 显示 cdtop
    $(document).ready(function ($) {
        var offset = 100,
            scroll_top_duration = 700,
            $back_to_top = $('.nav-wrap');

        $(window).scroll(function () {
            ($(this).scrollTop() > offset) ? $back_to_top.addClass('is-visible') : $back_to_top.removeClass('is-visible');
        });

        $(".cd-top").on('click', function (event) {
            event.preventDefault();
            $('body,html').animate({
                scrollTop: 0,
            }, scroll_top_duration);
        });
    });

    // pjax
    $(document).pjax('a[target!=_blank]:not(#snow-toggle)','.page', {
        fragment: '.page',
        timeout: 5000
    });
    $(document).on({
        'pjax:click': function() {
            $('body,html').animate({
                scrollTop: 0,
            }, 700);
        },
        'pjax:end': function() {
            if ($(".header_wrap").hasClass("menus-open")) {
                $(".header_wrap").removeClass("menus-open").addClass("menus-close")
            }
            if ($(".author-links").hasClass("is-open")) {
                $(".author-links").removeClass("is-open").addClass("is-close")
            }
            if ($(".nav").hasClass("nav-open")) {
                $(".nav").removeClass("nav-open").addClass("nav-close")
            }
        }
    });

    // smooth scroll
    $(function () {
        $('a[href*=\\#]:not([href=\\#])').click(function () {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top
                    }, 700);
                    return false;
                }
            }
        });
    });

    // ---- Snow effect ----
    (function () {
        var snowCanvas = null;
        var snowCtx = null;
        var snowflakes = [];
        var snowActive = false;
        var snowFading = false;
        var snowAnimFrame = null;
        var snowInterval = null;

        function createSnowflake() {
            return {
                x: Math.random() * window.innerWidth,
                y: 10,
                r: Math.random() * 2 + 1,           // radius 1–3 px
                speed: Math.random() * 0.4 + 0.1,  // px per frame
                swayAmp: Math.random() * 0.3 + 0.3, // horizontal sway amount
                swayFreq: Math.random() * 0.01 + 0.004,
                swayOffset: Math.random() * Math.PI * 0.12,
                opacity: 0.65 + Math.random() * 0.35,
                tick: 0
            };
        }

        function drawSnow() {
            if (!snowCanvas) return;
            snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);

            var remaining = [];
            for (var i = 0; i < snowflakes.length; i++) {
                var f = snowflakes[i];
                f.tick++;
                f.y += f.speed;
                f.x += Math.sin(f.tick * f.swayFreq + f.swayOffset) * f.swayAmp;

                if (snowFading) {
                    f.opacity -= 0.007;
                }

                if (f.y > window.innerHeight + 12 || f.opacity <= 0) continue;

                snowCtx.beginPath();
                snowCtx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
                snowCtx.fillStyle = 'rgba(180, 215, 255, ' + f.opacity + ')';
                snowCtx.fill();
                remaining.push(f);
            }
            snowflakes = remaining;

            // All faded out → remove canvas
            if (snowFading && snowflakes.length === 0) {
                if (snowCanvas && snowCanvas.parentNode) {
                    snowCanvas.parentNode.removeChild(snowCanvas);
                }
                snowCanvas = null;
                snowCtx = null;
                snowFading = false;
                return;
            }

            snowAnimFrame = requestAnimationFrame(drawSnow);
        }

        function startSnow() {
            snowActive = true;
            snowFading = false;
            snowflakes = [];

            snowCanvas = document.createElement('canvas');
            snowCanvas.id = 'snow-canvas';
            snowCanvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:9999;';
            snowCanvas.width = window.innerWidth;
            snowCanvas.height = window.innerHeight;
            document.body.appendChild(snowCanvas);
            snowCtx = snowCanvas.getContext('2d');

            snowInterval = setInterval(function () {
                if (snowActive) {
                    for (var _i = 0; _i < 4; _i++) snowflakes.push(createSnowflake());
                }
            }, 100);

            if (snowAnimFrame) cancelAnimationFrame(snowAnimFrame);
            drawSnow();
        }

        function stopSnow() {
            snowActive = false;
            snowFading = true;
            if (snowInterval) {
                clearInterval(snowInterval);
                snowInterval = null;
            }
        }

        $(document).on('click', '#snow-toggle', function () {
            if (!snowActive && !snowFading) {
                startSnow();
                $(this).addClass('snow-on');
            } else if (snowActive) {
                stopSnow();
                $(this).removeClass('snow-on');
            }
        });

        $(window).on('resize', function () {
            if (snowCanvas) {
                snowCanvas.width = window.innerWidth;
                snowCanvas.height = window.innerHeight;
            }
        });
    })();

})