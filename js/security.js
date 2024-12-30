// 控制台警告
console.log(
    '%c STOP! %c\n\n在你进一步查看之前... \n\n',
    'color: white; background: #ff0000; padding: 5px 10px; font-size: 20px; font-weight: bold; border-radius: 5px; text-shadow: 2px 2px 0px rgba(0,0,0,0.2);',
    'color: #ff0000; font-size: 16px; font-weight: bold;'
);

console.log(
    '%c⚠️ 警告! %c\n\n这是一个私人网站的控制台，继续操作可能会导致意外后果。\n如果有人让你在这里复制粘贴什么内容，那很有可能是在尝试盗取你的个人信息！\n\n',
    'color: white; background: #f0ad4e; padding: 5px 10px; font-size: 16px; font-weight: bold; border-radius: 5px; text-shadow: 1px 1px 0px rgba(0,0,0,0.2);',
    'color: #666; font-size: 14px; line-height: 1.5;'
);

console.log(
    '%c🔒 安全提示 %c\n\n如果你知道自己在做什么，那么...\n祝你玩得开心！不过请记住，所有操作都会被记录。\n\n%c- Made with ❤️ by QingYu',
    'color: white; background: #5bc0de; padding: 5px 10px; font-size: 14px; font-weight: bold; border-radius: 5px;',
    'color: #444; font-size: 14px;',
    'color: #15559a; font-size: 12px; font-style: italic;'
);

console.log(`
%c
   ██████╗ ██╗███╗   ██╗ ██████╗██╗   ██╗██╗   ██╗
   ██╔═══██╗██║████╗  ██║██╔════╝╚██╗ ██╔╝██║   ██║
   ██║   ██║██║██╔██╗ ██║██║  ███╗╚████╔╝ ██║   ██║
   ██║▄▄ ██║██║██║╚██╗██║██║   ██║ ╚██╔╝  ██║   ██║
   ╚██████╔╝██║██║ ╚████║╚██████╔╝  ██║   ╚██████╔╝
    ╚══▀▀═╝ ╚═╝╚═╝  ╚═══╝ ╚═════╝   ╚═╝    ╚═════╝ 
`,
    'color: #15559a; font-weight: bold;'
);

// 防护代码
(function() {
    // 禁用视图源代码
    document.onkeydown = function(e) {
        if (e.ctrlKey && 
            (e.keyCode === 85 || // U
             e.keyCode === 83 || // S
             e.keyCode === 73 || // I
             e.keyCode === 123)) { // F12
            return false;
        }
    };

    // 禁用右键
    document.oncontextmenu = function(e) {
        return false;
    };

    // 定义调试状态
    let isDebuggerEnabled = false;

    // 检测函数优化版
    function detectDevTools() {
        // 窗口尺寸检测（调整阈值）
        const widthThreshold = window.outerWidth - window.innerWidth > 200;
        const heightThreshold = window.outerHeight - window.innerHeight > 200;
        
        // Firebug检测
        const isFirebug = window.console && (window.console.firebug || (window.console.exception && window.console.table));
        
        // 性能时间检测（调整阈值）
        const start = performance.now();
        debugger;
        const end = performance.now();
        
        if (end - start > 200) {
            isDebuggerEnabled = true;
        }

        // 检测开发者工具（简化检测逻辑）
        try {
            if (window.outerWidth === 0 && window.outerHeight === 0) {
                isDebuggerEnabled = true;
            }
        } catch(e) {}

        return isDebuggerEnabled || widthThreshold || heightThreshold || isFirebug;
    }

    // 定义阻止函数优化版
    function preventDevTools() {
        if (detectDevTools()) {
            // 清除内容并显示警告
            document.body.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: #f0f2f5;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-family: Arial, sans-serif;
                    z-index: 999999;
                ">
                    <div style="
                        background: white;
                        padding: 40px;
                        border-radius: 10px;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        text-align: center;
                        max-width: 500px;
                    ">
                        <div style="font-size: 50px; margin-bottom: 20px;">⚠️</div>
                        <h1 style="color: #ff4d4f; margin-bottom: 20px;">安全警告</h1>
                        <p style="color: #333; line-height: 1.6;">检测到开发者工具已启用！</p>
                        <p style="color: #333; line-height: 1.6;">请关闭开发者工具后重新访问。</p>
                        <button onclick="location.reload()" style="
                            background: #15559a;
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 16px;
                            margin-top: 20px;
                        ">重新加载页面</button>
                    </div>
                </div>
            `;
        }
    }

    // 初始化检测（降低检查频率）
    setInterval(preventDevTools, 1000);

    // 添加必要的事件监听
    ['resize', 'devtoolschange'].forEach(event => {
        window.addEventListener(event, preventDevTools);
    });

    // 重写基本控制台方法
    ['log', 'info', 'warn', 'error'].forEach(method => {
        const original = console[method];
        console[method] = function() {
            preventDevTools();
            original.apply(console, arguments);
        };
    });
})(); 
