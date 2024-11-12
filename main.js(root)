"ui";
auto;
// 创建存储对象
var storage = storages.create("Aierwd");
var intervalId;  // 用于存储计时器ID
var isRunning = false;  // 标记计时器是否正在运行
// 全局变量声明
var password;
var friendName;
var messages;
// 使用settime函数并保存计时器ID
var timeoutId;
// 这里是唤醒并解锁手机的函数，保留原来的逻辑
// 创建音量键监听器
events.observeKey();
events.onKeyDown("volume_up", function(event) {
    // 当检测到音量上键被按下时，停止脚本
    toast("检测到音量上键按下，停止脚本运行");
    exit(); // 停止脚本
});
friendName = storage.get("friendName", "");
messages = storage.get("messages", "");
wakeAndUnlock(password).then(() => {
    return setupUI().then(() => {
    });
});
setupUI();  // 初始化UI
// 获取 friendName 和 messages 的值
friendName = storage.get("friendName", "");
messages = storage.get("messages", "");
// 检查 friendName 和 messages 是否为空
if (!friendName || !messages) {
    log("friendName 或 messages 为空，不执行 countdownTimer。");
    toast("信息不完整，请填写所有必要信息。");
} else {
    // 检查无障碍服务是否启用
    if (auto.service == null) {
        // 无障碍服务未启用，打开无障碍服务设置页面并提示
        toast("请开启无障碍服务以继续运行脚本。");
        app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS"
        });
        exit();
    } else {
        // 无障碍服务已启用，运行 countdownTimer
        countdownTimer();
    }
}
function wakeAndUnlock(password) {
    return new Promise((resolve, reject) => {
        if (!device.isScreenOn()) {
            // 屏幕未开启时的操作
            threads.start(function() {
                log("唤醒屏幕...");
                device.wakeUp();
                sleep(1000);
                password = storage.get("password", "");
                
                log("滑动解锁...");
                swipe(543, 1770, 540, 858, 1000); // 滑动解锁
                sleep(1800);
                if (password) {
                    for (var i = 0; i < password.length; i++) {
                        log("输入密码: " + password[i]);
                        clickWidgetByPosition(text(password[i]).untilFindOne());
                    }
                }
            });
            sleep(1000);
            resolve();
        } else {
            // 屏幕已开启时直接设置定时器
            setTimeout(() => {
                resolve();
            }, 1000);
        }
    });
}
// 创建UI界面函数
function setupUI() {
    return new Promise((resolve) => {
        ui.layout(
            <vertical padding="10">
                <text text="使用步骤" textSize="24sp" textColor="black" />
                <text text="在输入框中输入锁屏密码,朋友名称，续火花内容" textSize="14sp" textColor="black" />
                <text text="再点击确认信息按钮" textSize="14sp" textColor="black" />
                <text text="点击开始运行会开始运行续火花程序" textSize="14sp" textColor="black" />
                <text text="杀掉程序再点开" textSize="14sp" textColor="black" />
                <text text="会在三秒后自动运行续火花程序" textSize="14sp" textColor="black" />
                <text text="点击重置信息可以重新输入" textSize="14sp" textColor="black" />
                <text text="如需停止脚本，要一直按到按钮变灰为止" textSize="14sp" textColor="black" />
                <text text="建议使用系统自带自动任务，实现无人值守" textSize="14sp" textColor="black" />
                <text text="请输入以下信息：" textSize="18sp" textColor="black" />
                <input id="password" hint="锁屏密码,仅支持数字密码" />
                <input id="friendName" hint="朋友名称" />
                <input id="messages" hint="续火花文本" /> 
                <button id="confirm" text="确认信息" textSize="18sp" textColor="black" />
                <button id="reset" text="重置信息" textSize="18sp" />
                <button id="start" text="开始运行" textSize="18sp" />
                <button id="stop" text="停止运行" textSize="18sp" />
                <text text="仅供学习交流使用,请自行删除" textSize="14sp" textColor="black" />
            </vertical>
        );

        // 初始化时读取存储中的数据并填充到输入框
        ui.password.setText(storage.get("password", ""));
        ui.friendName.setText(storage.get("friendName", ""));
        ui.messages.setText(storage.get("messages", ""));

        // 确认按钮点击事件
        ui.confirm.click(() => {
            // 获取输入框的内容
            const password = ui.password.text();
            const friendName = ui.friendName.text();
            const messages = ui.messages.text();

            // 存储到storage对象
            storage.put("password", password);
            storage.put("friendName", friendName);
            storage.put("messages", messages);

            toast("信息已保存：\n密码:" + password + "\n朋友名称:" + friendName + "\n续火花文本:" + messages);
        });

        // 重置按钮点击事件
        ui.reset.click(() => {
            ui.password.setText("");
            ui.friendName.setText("");
            ui.messages.setText("");  // 清空输入框
            
            // 清除存储在storage中的内容
            storage.remove("password");
            storage.remove("friendName");
            storage.remove("messages");
            
            toast("所有信息已重置。");
        });
        // 开始按钮点击事件
        ui.start.click(() => {
            if (!isRunning) {
                isRunning = true;
                // 使用线程启动 sendMessage，避免阻塞 UI 线程
                threads.start(function () {
                        sendMessage();
    
                        exit();
                        
                });
                // 更新按钮状态
                ui.start.setEnabled(false);
                ui.stop.setEnabled(true);
                toast("开始运行续火花脚本程序。");
            }
        });
        // 停止按钮点击事件
        ui.stop.click(() => {
            if (isRunning) {
                isRunning = false;
                clearTimeout(timeoutId); // 清除计时器
                timeoutId = null; // 重置timeoutId
                //更新按钮
                ui.start.setEnabled(true);
                ui.stop.setEnabled(false);
                toast("续火花脚本已停止。");
            }
        });

        resolve();  // 解析Promise
    });
}
//计时函数
function countdownTimer() {
    var secondsRemaining = 4;  // 设置剩余秒数
    // 清除旧的计时器
    if (intervalId) {
        timers.clearInterval(intervalId);
    }
    // 设置每秒执行一次的定时器
    intervalId = timers.setInterval(() => {
        if (!isRunning) {
            log("距离自动运行续火花还有 " + secondsRemaining + " 秒");
            secondsRemaining -= 1;
            if (secondsRemaining <= 0) {  // 计时6秒
                timers.clearInterval(intervalId);
                intervalId = null;
                isRunning = true; // 标记为正在运行，防止重复启动
                // 设置倒计时结束时的操作
                timeoutId = setTimeout(() => {
                    if (!password) {
                        log("密码为空，不进行计时。");
                        toast("密码为空，不进行计时。");
                        return;
                    }
                    threads.start(function () {
                        sendMessage();
                       
                        exit();
                });
                    // 自动点击开始按钮
                    isRunning = false;
                    timeoutId = null;
                    toast("计时结束，自动点击续火花。");
                    log("计时结束，自动点击开始按钮。");
                }, 1000);
            }
        }
    }, 1000);
    toast("距离自动运行续火花还有3秒");  // 每1秒减少1秒
}
//发送消息部分函数
function sendMessage() {
    // 非 root 打开抖音
    log("尝试启动抖音...");
    var packageName = "com.ss.android.ugc.aweme"; // 抖音的包名
    // 检查抖音是否已安装
    if (app.getAppName(packageName)) {
        log("抖音已安装，尝试启动...");
        // 尝试使用 app.launchApp
        try {
            log("使用 app.launchPackage 启动抖音...");
            //具体实现是通过函数打开
            open_douyin();
            sleep(5000); 
        } 
        catch (e) {
            //如果有抛出异常则打印日志
            log("app.launchPackage 失败: " + e.messages);
        }
        // 确认抖音已经打开，并且是在消息页面
        if (currentActivity() != null && packageName === currentActivity()) {
            log("抖音已经打开，检查是否在消息页面...");
            var messagesPageIndicator = text("消息").className("android.widget.TextView").findOne(3000);
            
            if (messagesPageIndicator != null) {
                log("不在消息页面，尝试返回到消息页面...");
                back(); // 点击返回按钮
                sleep(180);
                var messagesTextWidget = text("消息")
                    .className("android.widget.TextView")
                    .untilFindOne();
                clickWidgetByPosition(messagesTextWidget);
                sleep(3000, 100);
            } else {
                log("已经在消息页面...");
            }
        } 
        else {
            log("抖音没有打开，使用函数重新启动...");
            open_douyin(); // 确保调用函数
            toast("抖音没有打开，使用函数重新启动...");
        }
    } else {
        log("未找到抖音应用，无法启动...");
        toast("未找到抖音应用，请确保抖音已安装");
        toast("脚本已退出");
        exit();
    }
    //处理权限请求
    log("处理权限请求...");
    // 尝试点击“始终允许”
    if (text("始终允许").clickable(true).exists()) {
        log("点击始终允许...");
        clickWidgetByPosition(text("始终允许").untilFindOne(500));
    } 
    // 如果没有找到“始终允许”，尝试点击“允许”
    else if (text("允许").clickable(true).exists()) {
        log("点击允许...");
        clickWidgetByPosition(text("允许").untilFindOne(500));
    }
    sleep(5000, 500); // 等待一段时间
    log("关闭弹窗...");
    closePopup();
    // 进入消息记录对应好友
    log("进入消息界面...");
    var messagesTextWidget = text("消息")
        .className("android.widget.TextView")
        .untilFindOne();
    clickWidgetByPosition(messagesTextWidget);
    sleep(3000, 100);
    log("关闭弹窗...");
    closePopup();

    log("查找好友...");
    // 如果 friendName 是 SpannableStringBuilder，先转换为普通字符串
if (typeof friendName === "undefined" || friendName === null) {
    log("friendName 未定义或为空");
    toast("好友名称未输入，请检查。");
    exit();
} else {
    // 将 SpannableStringBuilder 转换为普通字符串
    friendName = friendName.toString().replace(/\u0000/g, "").trim();
}
    var friendWidget = text(friendName).findOnce();
    if (!friendWidget) {
        log("未找到好友，尝试滑动...");
        swipe(device.width / 2, device.height * 0.8, device.width / 2, device.height * 0.2, 400);
        friendWidget = text(friendName).findOnce(500).parent().click();
        log("找到好友，点击进入详细页面");
    }
    if (!friendWidget) {
        log("未找到好友，尝试滑动...");
        swipe(device.width / 2, device.height * 0.1, device.width / 2, device.height * 0.9, 650);
        friendWidget = text(friendName).findOnce(500).parent().click();
        log("找到好友，点击进入详细页面");
    }
    if (friendWidget) {
        log("未找到好友，尝试滑动...");
        clickWidgetByPosition(friendWidget);
        log("找到好友，点击进入详细页面");
    } else {
        log("未找到好友，请确认好友名称");
        toast("未找到好友，请确认好友名称。");
        exit();
    }
    sleep(3000, 100);
    // 发送'续火花'消息
    log("尝试发送'续火花'消息...");
    var maxAttempts = 5; // 尝试找到输入框的最大次数
    var attempts = 0; // 尝试次数计数器
    while (attempts < maxAttempts) {
        var inputBOX = id("msg_et");
        if (!inputBOX.exists()) {
            log("找不到输入框，尝试点击语音按钮");
            // 查找ID为 "k5d" 的元素，给定一个最大等待时间，单位是毫秒
    var element = id("k5d").findOne(5000);
    if (element != null) {
        element.click();
    } else {
        log("没有找到31.9.0版本按钮，尝试使用旧按钮方式");
        var fallbackElement = id("kx_").findOne(5000);
        if (fallbackElement != null) {
            fallbackElement.click();
            log("尝试点击旧按钮");
        } else {
            // 处理找不到 'kx_' 的情况
            log("未适配");
        }
    }
            sleep(1000); // 等待一秒后再次检查
            attempts++;
        } else {
            clickWidgetByPosition(inputBOX.findOne(5000));
            sleep(1500);
            setText(messages);
            sleep(100);
            break; // 如果输入框存在，退出循环
        }
    }
    if (attempts == maxAttempts) {
        throw new Error("多次尝试后仍找不到输入框，无法发送消息。");
    }
    // 查找ID为 "jev" 的元素（发送按钮），给定一个最大等待时间，单位是毫秒
    var button = (id("jev")).findOne(5000);
    if (button != null) {
        button.click();
        log("点击发送按钮...");
        back();
        sleep(1000);
        back();
        sleep(1000);
        log("成功发送'续火花'消息");
        closedouyin();
        toast("正在关闭抖音");
        sleep(1800);
        home();
 
        var deviceofff = runtime.accessibilityBridge.getService().performGlobalAction(android.accessibilityservice.AccessibilityService.GLOBAL_ACTION_LOCK_SCREEN)
    } else {
        log("没有找到新发送按钮,尝试旧按钮");
        
        var fallbackbutton = id("jgx").findOne(5000);
    
        if (fallbackbutton != null) {
            fallbackbutton.click();
            log("点击发送按钮...");
            back();
            sleep(1000);
            back();
            sleep(1000);
            log("成功发送'续火花'消息");
            closedouyin();
            toast("正在关闭抖音");
            sleep(1800);
            home();
            var deviceofff = runtime.accessibilityBridge.getService().performGlobalAction(android.accessibilityservice.AccessibilityService.GLOBAL_ACTION_LOCK_SCREEN)
        } else {
            // 处理找不到 '发送按钮' 的情况
            log("未适配");
        }
    }
    var deviceofff = runtime.accessibilityBridge.getService().performGlobalAction(android.accessibilityservice.AccessibilityService.GLOBAL_ACTION_LOCK_SCREEN)
}
// 辅助点击函数
function clickWidgetByPosition(widget) {
    while (!widget.clickable()) {
        widget = widget.parent();
    }
    const diff = random(1, 10);
    click(widget.bounds().centerX() + diff, widget.bounds().centerY() + diff);
    sleep(500, 100);
}
// 关闭权限函数
function closePopup() {
    var btnClose = textMatches(/(.*允许.*|.*关闭.*|.*以后再说.*|.*不升级.*|.*取消.*|.*跳过.*|.*下次.*)/).findOnce();
    if (btnClose) {
        log("关闭弹窗...");
        clickWidgetByPosition(btnClose);
    }

}
// 打开抖音函数
function open_douyin() {
    app.launchPackage("com.ss.android.ugc.aweme");
}
//关闭抖音
function closedouyin() {
    let packageName = "com.ss.android.ugc.aweme";
    log("尝试强制结束 " + app.getAppName(packageName));

    // 执行 shell 命令，强制停止应用
    let result = shell("am force-stop " + packageName, true);
    if (result.code == 0) {
        log(app.getAppName(packageName) + " 应用已被强制关闭");
    } else {
        log("无法关闭 " + app.getAppName(packageName));
    }
}
