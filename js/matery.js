const rainbowColors = [
    ['rgba(156, 39, 176, 0.75)', 'rgba(186, 104, 200, 0.75)'], // 紫
    ['rgba(233, 30, 99, 0.75)', 'rgba(240, 98, 146, 0.75)'],  // 粉
    ['rgba(255, 87, 34, 0.75)', 'rgba(255, 138, 101, 0.75)'], // 橙
    ['rgba(255, 152, 0, 0.75)', 'rgba(255, 183, 77, 0.75)'],  // 黄
    ['rgba(76, 175, 80, 0.75)', 'rgba(129, 199, 132, 0.75)'], // 绿
    ['rgba(33, 150, 243, 0.75)', 'rgba(100, 181, 246, 0.75)'],// 蓝
    ['rgba(63, 81, 181, 0.75)', 'rgba(121, 134, 203, 0.75)']  // 靛
];
const navBgColors = [
    ['rgba(156, 39, 176)', 'rgba(186, 104, 200)'], // 紫
    ['rgba(233, 30, 99)', 'rgba(240, 98, 146)'],  // 粉
    ['rgba(255, 87, 34)', 'rgba(255, 138, 101)'], // 橙
    ['rgba(255, 152, 0)', 'rgba(255, 183, 77)'],  // 黄
    ['rgba(76, 175, 80)', 'rgba(129, 199, 132)'], // 绿
    ['rgba(33, 150, 243)', 'rgba(100, 181, 246)'],// 蓝
    ['rgba(63, 81, 181)', 'rgba(121, 134, 203)']  // 靛
];
let currentGradient = '';
let currentNavGradient = '';

$(function () {
    /**
     * 添加文章卡片hover效果.
     */
    let articleCardHover = function () {
        let animateClass = 'animated pulse';
        $('article .article').hover(function () {
            $(this).addClass(animateClass);
        }, function () {
            $(this).removeClass(animateClass);
        });
    };
    articleCardHover();

    /*菜单切换*/
    $('.sidenav').sidenav();

    /* 修复文章卡片 div 的宽度. */
    let fixPostCardWidth = function (srcId, targetId) {
        let srcDiv = $('#' + srcId);
        if (srcDiv.length === 0) {
            return;
        }

        let w = srcDiv.width();
        if (w >= 450) {
            w = w + 21;
        } else if (w >= 350 && w < 450) {
            w = w + 18;
        } else if (w >= 300 && w < 350) {
            w = w + 16;
        } else {
            w = w + 14;
        }
        $('#' + targetId).width(w);
    };

    /**
     * 修复footer部分的位置，使得在内容比较少时，footer也会在底部.
     */
    let fixFooterPosition = function () {
        $('.content').css('min-height', window.innerHeight - 165);
    };

    /**
     * 修复样式.
     */
    let fixStyles = function () {
        fixPostCardWidth('navContainer');
        fixPostCardWidth('artDetail', 'prenext-posts');
        fixFooterPosition();
    };
    fixStyles();

    /*调整屏幕宽度时重新设置文章列的宽度，修复小间距问题*/
    $(window).resize(function () {
        fixStyles();
    });

    /*初始化瀑布流布局*/
    $('#articles').masonry({
        itemSelector: '.article'
    });

    AOS.init({
        easing: 'ease-in-out-sine',
        duration: 700,
        delay: 100
    });

    /*文章内容详情的一些初始化特性*/
    let articleInit = function () {
        $('#articleContent a').attr('target', '_blank');

        $('#articleContent img').each(function () {
            let imgPath = $(this).attr('src');
            $(this).wrap('<div class="img-item" data-src="' + imgPath + '" data-sub-html=".caption"></div>');
            // 图片添加阴影
            $(this).addClass("img-shadow img-margin");
            // 图片添加字幕
            let alt = $(this).attr('alt');
            let title = $(this).attr('title');
            let captionText = "";
            // 如果alt为空，title来替
            if (alt === undefined || alt === "") {
                if (title !== undefined && title !== "") {
                    captionText = title;
                }
            } else {
                captionText = alt;
            }
            // 字幕不空，添加之
            if (captionText !== "") {
                let captionDiv = document.createElement('div');
                captionDiv.className = 'caption';
                let captionEle = document.createElement('b');
                captionEle.className = 'center-caption';
                captionEle.innerText = captionText;
                captionDiv.appendChild(captionEle);
                this.insertAdjacentElement('afterend', captionDiv)
            }
        });
        $('#articleContent, #myGallery').lightGallery({
            selector: '.img-item',
            // 启用字幕
            subHtmlSelectorRelative: true
        });

        // progress bar init
        const progressElement = window.document.querySelector('.progress-bar');
        if (progressElement) {
            new ScrollProgress((x, y) => {
                progressElement.style.width = y * 100 + '%';
            });
        }
    };
    articleInit();

    $('.modal').modal();

    /*回到顶部*/
    $('#backTop').click(function () {
        $('body,html').animate({ scrollTop: 0 }, 400);
        return false;
    });

    /*监听滚动条位置*/
    let $nav = $('#headNav');
    let $backTop = $('.top-scroll');
    let $btnFloating = $('.btn-floating');
    // 当页面处于文章中部的时候刷新页面，因为此时无滚动，所以需要判断位置,给导航加上绿色。
    setNavBgIfNeed($(window).scrollTop());
    $(window).scroll(function () {
        /* 回到顶部按钮根据滚动条的位置的显示和隐藏.*/
        let scroll = $(window).scrollTop();
        setNavBgIfNeed(scroll);
    });

    function setNavBgIfNeed(position) {
        let showPosition = 100;
        if (position < showPosition) {
            $nav.css('background', '')
            $nav.addClass('nav-transparent');
            $backTop.slideUp(300);
        } else {
            $nav.removeClass('nav-transparent');
            $nav.css('background', currentNavGradient); // 添加背景色
            $backTop.slideDown(300);
            $btnFloating.css('background', currentNavGradient);
        }
    }

    // function showOrHideNavBg(position) {
    //     let showPosition = 100;
    //     if (position < showPosition) {
    //         $nav.addClass('nav-transparent');
    //         $nav.removeClass('rainbow-nav'); // 移除动画
    //         $backTop.slideUp(300);
    //         $nav.css('animation', 'none'); // 停止动画
    //     } else {
    //         $nav.removeClass('nav-transparent');
    //         $nav.addClass('rainbow-nav'); // 添加彩虹动画
    //         $backTop.slideDown(300);
    //         // 计算已过去时间
    //         const now = Date.now();
    //         const elapsed = (now - rainbowStartTime) / 1000; // 秒数

    //         // 计算对应动画起点
    //         const delay = -(elapsed % 60) + 's';

    //         // 设置动画延迟，让它从封面动画当前帧开始跑
    //         $nav.css({
    //             animation: `rainbow 60s infinite linear`,
    //             'animation-delay': delay
    //         });
    //     }
    // }
    function applyGradientColors(color1, color2, color3, color4) {
        currentGradient = `linear-gradient(135deg, ${color1}, ${color2})`;
        currentNavGradient = `linear-gradient(135deg, ${color3}, ${color4})`;
        const bgCover = document.querySelector('.bg-cover');
        bgCover.style.setProperty('--cover-gradient', currentGradient);
        setNavBgIfNeed($(window).scrollTop());
    }

    let currentColorIndex = 0;
    setInterval(() => {
        if ($(window).scrollTop() < 100) {
            const [color1, color2] = rainbowColors[currentColorIndex];
            const [color3, color4] = navBgColors[currentColorIndex]
            applyGradientColors(color1, color2, color3, color4);
            currentColorIndex = (currentColorIndex + 1) % rainbowColors.length;
        }
    }, 10000); // 每 8 秒切换一次

    $(function () {
        applyGradientColors(...rainbowColors[0], ...navBgColors[0]);
    });

    $(".nav-menu>li").hover(function () {
        $(this).children('ul').stop(true, true).show();
        $(this).addClass('nav-show').siblings('li').removeClass('nav-show');

    }, function () {
        $(this).children('ul').stop(true, true).hide();
        $('.nav-item.nav-show').removeClass('nav-show');
    })

    $('.m-nav-item>a').on('click', function () {
        if ($(this).next('ul').css('display') == "none") {
            $('.m-nav-item').children('ul').slideUp(300);
            $(this).next('ul').slideDown(100);
            $(this).parent('li').addClass('m-nav-show').siblings('li').removeClass('m-nav-show');
        } else {
            $(this).next('ul').slideUp(100);
            $('.m-nav-item.m-nav-show').removeClass('m-nav-show');
        }
    });

    // 初始化加载 tooltipped.
    $('.tooltipped').tooltip();
});

function applyFooterBackground(gradient) {
    const footer = document.querySelector('footer');
    if (footer) {
        footer.style.backgroundImage = gradient;
    }
}
function isFooterVisible() {
    const footer = document.querySelector('footer');
    const rect = footer.getBoundingClientRect();
    return (
        rect.top < window.innerHeight &&
        rect.bottom > 0
    );
}
if (isFooterVisible()) {
    applyFooterBackground(currentGradient);
}
// 使用 IntersectionObserver 检测 footer 是否可见
function observeFooterVisibility() {
    const footer = document.querySelector('footer');
    if (!footer) return;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                applyFooterBackground(currentNavGradient);
            }
        });
    }, {
        threshold: 0.1
    });

    observer.observe(footer);
}
// 初始化监听
observeFooterVisibility();
//黑夜模式提醒开启功能
setTimeout(function () {
    if ((new Date().getHours() >= 19 || new Date().getHours() < 7) && !$('body').hasClass('DarkMode')) {
        let toastHTML = '<span style="color:#97b8b2;border-radius: 10px;>' + '<i class="fa fa-bellaria-hidden="true"></i>晚上使用深色模式阅读更好哦。(ﾟ▽ﾟ)</span>'
        M.toast({ html: toastHTML })
    }
}, 2200);

//黑夜模式判断
if (localStorage.getItem('isDark') === '1') {
    document.body.classList.add('DarkMode');
    $('#sum-moon-icon').addClass("fa-sun").removeClass('fa-moon')
} else {
    document.body.classList.remove('DarkMode');
    $('#sum-moon-icon').removeClass("fa-sun").addClass('fa-moon')
}

