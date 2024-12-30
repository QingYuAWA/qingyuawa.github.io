// 页面加载完成后的初始化
$(document).ready(function() {
    // 确保资源加载完成
    $(window).on('load', function() {
        // 添加一个最小显示时间，避免闪烁
        setTimeout(function() {
            $('.loading-screen').addClass('fade-out');
            
            // 初始化其他功能
            setTimeout(function() {
                initializeAnimations();
                initializeHitokoto();
                initializeVideo();
                initializeEventListeners();
            }, 600); // 等待淡出动画完成后初始化
        }, 800); // 最小显示时间
    });
});

// 动画初始化
function initializeAnimations() {
    setTimeout(function() {
        $('.index_txt').addClass('animate__animated animate__fadeIn');
    }, 500);
}

// 加载一言
function loadHitokoto() {
    $.ajax({
        url: 'https://v1.hitokoto.cn/',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            $('.hitokoto')
                .text(data.hitokoto)
                .addClass('animate__animated animate__fadeIn');
            
            // 添加来源信息（可选）
            if(data.from) {
                $('.hitokoto').append(
                    $('<div>')
                        .addClass('hitokoto-from')
                        .text('—— ' + data.from)
                );
            }
        },
        error: function() {
            $('.hitokoto')
                .text('生活总是充满希望...')
                .addClass('animate__animated animate__fadeIn');
        }
    });
}

// 定期刷新一言（可选）
function initializeHitokoto() {
    loadHitokoto(); // 首次加载
    
    // 每60秒刷新一次
    setInterval(loadHitokoto, 60000);
}

// 视频背景初始化
function initializeVideo() {
    const video = document.getElementById("video");
    const backgroundImage = document.querySelector('.background-image');
    let isFirstPlay = true;

    // 初始显示背景图片
    if (backgroundImage) {
        backgroundImage.style.opacity = '1';
    }
    
    // 视频播放时
    video.addEventListener("play", function() {
        if (backgroundImage && isFirstPlay) {
            backgroundImage.style.opacity = '0';
            isFirstPlay = false;
        }
    });
    
    // 视频结束时重新获取视频
    video.addEventListener("ended", function() {
        if (backgroundImage) {
            video.style.opacity = '0'; // 隐藏当前视频
            backgroundImage.style.opacity = '1'; // 显示背景图片

            // 重新获取视频源
            const currentTime = new Date().getTime(); // 添加时间戳避免缓存
            video.src = `http://qtkj.fun/api/qtmj.php?t=${currentTime}`;
            
            // 重置视频状态
            video.load();
            isFirstPlay = true;
        }
    });
    
    // 点击时播放视频
    document.addEventListener('click', function() {
        if (video.paused) {
            video.style.opacity = '1'; // 恢复视频可见性
            video.play().catch(function(error) {
                console.log("视频播放失败:", error);
                // 播放失败时显示背景图片
                if (backgroundImage) {
                    backgroundImage.style.opacity = '1';
                }
            });
        }
    });

    // 确保视频和背景图片都有过渡效果
    video.style.transition = 'opacity 0.5s ease';
    if (backgroundImage) {
        backgroundImage.style.transition = 'opacity 0.5s ease';
    }

    // 视频加载错误时的处理
    video.addEventListener("error", function() {
        console.log("视频加载失败，显示背景图片");
        if (backgroundImage) {
            backgroundImage.style.opacity = '1';
        }
    });
}

// 初始化事件监听
function initializeEventListeners() {
    // 平滑滚动
    $('a[href*="#"]').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top
        }, 500, 'linear');
    });
    
    // 鼠标移动视差效果
    document.addEventListener('mousemove', function(e) {
        const moveX = (e.clientX - window.innerWidth/2) * 0.01;
        const moveY = (e.clientY - window.innerHeight/2) * 0.01;
        
        document.querySelector('.index_txt').style.transform = 
            `translate(${moveX}px, ${moveY}px)`;
    });

    // 添加悬浮提示功能
    const tooltip = $('<div class="tooltip">哎呀</div>').appendTo('body');
    
    $('.zuobiao').on('click', function(e) {
        const $this = $(this);
        const $avatar = $('.avatar');
        const avatarOffset = $avatar.offset();
        
        // 设置提示框位置到头像右上角
        tooltip.css({
            left: avatarOffset.left + $avatar.width() + 20, // 头像右侧20px
            top: avatarOffset.top - 10 // 头像上方稍微偏移
        }).addClass('show');

        // 添加按钮动画效果
        $this.css('transform', 'scale(0.95)');
        setTimeout(() => {
            $this.css('transform', '');
        }, 200);

        // 1秒后隐藏提示框
        setTimeout(() => {
            tooltip.removeClass('show');
        }, 1000);
    });

    // 防止提示框影响其他点击
    tooltip.on('click', function(e) {
        e.stopPropagation();
    });

    // 禁用右键菜单
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // 禁用F12、Ctrl+Shift+I、Ctrl+Shift+J、Ctrl+U
    document.addEventListener('keydown', function(e) {
        if (
            e.keyCode === 123 || // F12
            (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
            (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
            (e.ctrlKey && e.keyCode === 85) // Ctrl+U
        ) {
            e.preventDefault();
            return false;
        }
    });

    // 禁用复制
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        return false;
    });

    // 禁用选择
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });
}