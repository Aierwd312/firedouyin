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
var status1 = false;
importClass(javax.crypto.Mac);
importClass(javax.crypto.spec.SecretKeySpec);
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
        <vertical>

            <appbar>
                <tabs id="tabs" />
            </appbar>
            <viewpager id="viewpager">
                <frame>
                    <vertical padding="22">
                        <text text="锁屏密码：" textSize="22sp"  />
                        <input id="password" hint="输入锁屏密码,仅支持数字" textSize="24sp"/>
                        <text text="朋友名称：" textSize="22sp" />
                        <input id="friendName" hint="请输入朋友名称" textSize="24sp"/>
                        <text text="发送消息：" textSize="22sp"  />
                        <input id="messages" hint="想要发送的消息"textSize="24sp"/>
                        <button id="confirm" text="确认信息" marginTop="22"textSize="18sp" height="65"/>
                        <button id="reset" text="重置信息" marginTop="22"textSize="18sp" height="65"/>
                        <button id="start" text="开始运行" marginTop="22"textSize="18sp" height="65"/>
                        <button id="stop" text="停止运行" marginTop="22"textSize="18sp" height="65"/>
                    </vertical>
                </frame>

                <frame>
                    <vertical padding="22">
                        <text text="使用步骤：" textSize="28sp" textColor="black" />
                        <text text="1.在输入框中输入锁屏密码" textSize="18sp" textColor="black" />
                        <text text="2.朋友名称，续火花内容" textSize="18sp" textColor="black" />
                        <text text="3.再点击确认信息按钮" textSize="18sp" textColor="black" />
                        <text text="4.点击开始运行开始运行程序" textSize="18sp" textColor="black" />
                        <text text="5.杀掉程序再点开" textSize="18sp" textColor="black" />
                        <text text="6.会在三秒后自动运行程序" textSize="18sp" textColor="black" />
                        <text text="7.点击重置信息可以重新输入" textSize="18sp" textColor="black" />
                        <text text="8.如需停止脚本，要一直按到按钮变灰为止" textSize="18sp" textColor="black" />
                        <text text="9.建议使用系统自带自动任务，实现无人值守" textSize="18sp" textColor="black" />
                        <text text="适配抖音版本：" textSize="18sp" textColor="black" />
                        <text text="【31.8.0】【31.9.0】【32.2.0】" textSize="18sp" textColor="black" />
                    </vertical>
                </frame>
            </viewpager>

            <vertical gravity="center" marginTop="auto" padding="22">
                <button id="helperBtn" text="抖音续火花助手" />
                <button id="moreFeaturesBtn" text="使用步骤：" marginTop="22" />
            </vertical>

        </vertical>
    );
        // 设置标签与页面标题
        ui.viewpager.setTitles(["抖音续火花助手", "使用步骤"]);
        // 将标签栏与滑动页面联动
        ui.tabs.setupWithViewPager(ui.viewpager);
        // 设置顶部状态栏和底部导航栏颜色
        ui.run(() => {
            setTimeout(() => {
                // 获取当前窗口
                const window = activity.getWindow();
                // 设置导航栏颜色为透明
                window.setNavigationBarColor(0x00000000);
            }, 100); // 延迟 100 毫秒执行
        });
        // 设置底部按钮的内边距以适应导航栏
        ui.run(() => {
            const helperBtn = ui.helperBtn;
            const moreFeaturesBtn = ui.moreFeaturesBtn;

            // 获取系统导航栏高度
            const resourceId = activity.getResources().getIdentifier("navigation_bar_height", "dimen", "android");
            const navBarHeight = activity.getResources().getDimensionPixelSize(resourceId);

            // 设置底部按钮的下边距
            helperBtn.setPadding(0, 0, 0, navBarHeight);
            moreFeaturesBtn.setPadding(0, 0, 0, navBarHeight);
        });
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
    //首先杀死抖音，避免不可预知的情况！
    closedouyin();
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
        log("未找到好 friendWidge友，尝试滑动...");
        swipe(device.width / 2, device.height * 0.1, device.width / 2, device.height * 0.9, 650);
       t = text(friendName).findOnce(500).parent().click();
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
    log("找到好友，尝试发送'续火花'消息...");
    closePopup();
    var maxAttempts = 5; // 尝试找到输入框的最大次数
    var attempts = 0; // 尝试次数计数器
    while (attempts < maxAttempts) {
        var inputBOX = id("msg_et");
        if (!inputBOX.exists()) {
            log("找不到输入框，尝试点击语音按钮");
            let myvoice = id("cy_").desc("语音").depth(18).findOne(5000);
            if (myvoice) {
                log("找到语音按钮");
                // 调用点击方法
                clickWidgetByPosition(myvoice);
                toast("点击语音按钮");
            } else {
                toast("未找到32.2.0版语音按钮，尝试31.9.0版语音按钮");
        
                // 查找ID为 "k5d" 的元素（语音按钮），给定一个最大5秒的等待时间，单位是毫秒
                var element = id("k5d").findOne(5000);
                if (element != null) {
                    element.click();
                    log("点击31.9.0版语音按钮");
                } else {
                    log("没有找到31.9.0版本按钮，尝试使用31.8.0按钮方式");
                    var fallbackElement = id("kx_").findOne(5000);
                    if (fallbackElement != null) {
                        fallbackElement.click();
                        log("尝试点击旧按钮");
                    } else {
                        log("未适配");
                    }
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
// 发送按钮，适配抖音版本32.2.0
let sendmyMessage = id("je9").desc("发送").depth(15).findOne(5000);
if (sendmyMessage) {
    // 调用点击方法
    clickWidgetByPosition(sendmyMessage);
    toast("发送成功");
    log("发送成功");
    sendnote();
} else {
    toast("未找到32.2.0版发送按钮,尝试点击31.9.0版按钮");

    // 查找ID为 "jev" 的元素（31.9.0版发送按钮），给定一个最大等待时间，单位是毫秒
    var button = id("jev").findOne(5000);
    if (button != null) {
        clickWidgetByPosition(button);
        toast("发送成功");
        log("发送成功");
        sendnote();

    } else {
        log("没有找到新发送按钮,尝试旧按钮");
        var fallbackbutton = id("jgx").findOne(5000);
        if (fallbackbutton != null) {
            clickWidgetByPosition(fallbackbutton);
            toast("发送成功");
            log("发送成功");
            sendnote();
        } else {
            // 处理找不到 '发送按钮' 
            log("未适配");
            toast("未适配");
        }
    }
}
    var deviceofff = runtime.accessibilityBridge.getService().performGlobalAction(android.accessibilityservice.AccessibilityService.GLOBAL_ACTION_LOCK_SCREEN)
}
// 辅助函数
function clickWidgetByPosition(widget) {
    log("进入点击函数");
    while (!widget.clickable()) {
        log("当前控件不可点击，查找父控件");
        widget = widget.parent();
        if (!widget) {
            log("未找到可点击的父控件");
            return;
        }
    }
    log("找到可点击控件");
    const diff = random(1, 10);
    const x = widget.bounds().centerX() + diff;
    const y = widget.bounds().centerY() + diff;
    log(`点击坐标: (${x}, ${y})`);
    click(x, y);
    sleep(500, 100);
}
// 关闭权限函数
// 定义关闭弹窗的函数
function closePopup() {
    // 检测并点击常见的关闭按钮
    var btnClose = textMatches(/(.*允许.*|.*关闭.*|.*以后再说.*|.*不升级.*|.*取消.*|.*跳过.*|.*下次.*)/).findOnce();
    if (btnClose) {
        log("关闭弹窗...");
        clickWidgetByPosition(btnClose);
    }

    // 检测并点击特定的控件
    var specificControl = id("l_4").desc("关闭").depth(9).findOne(1000);
    if (specificControl) {
        log("找到特定控件，点击关闭按钮...");
        clickWidgetByPosition(specificControl);
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
//发送提示消息函数
function sendnote(){
    back();//返回
    sleep(1000);//等待1秒
    back();//返回
    sleep(1000);//等待1秒
    log("成功发送'续火花'消息");//提示日志
    closedouyin();//关闭抖音
    toast("正在关闭抖音");
    status1 = true;//设置变量值
    send_msg(friendName, messages);//发送提示消息
    sleep(1800);//等待两秒
    home();//返回桌面
    var deviceofff = runtime.accessibilityBridge.getService().performGlobalAction(android.accessibilityservice.AccessibilityService.GLOBAL_ACTION_LOCK_SCREEN);
    //锁屏
}
//推送消息函数
function send_msg(friendName, messages) {
    if(status1 == true){
    // 导入 Java 类
    importClass(javax.crypto.Mac);
    importClass(javax.crypto.spec.SecretKeySpec);
    // 自定义标题和消息内容
    var shortTitle = "抖音续火花状态通知"; // 可以修改为你想要的标题
    var longContent = "与"+friendName+"发送"+messages+"消息成功";

    // 获取当前时间戳
    var timestamp = new Date().getTime();

    // 加签内容（钉钉机器人设置的加签密钥）
    var secret_str = "SECb864303a4889b45cd514b9f421993bcc76fa31ba41d021fc3c7b5196219fcc65";
    var secret = new java.lang.String(secret_str);

    // 签名字符串
    var stringToSign = timestamp + "\n" + secret_str;

    // 使用 HmacSHA256 算法生成签名
    var mac = Mac.getInstance("HmacSHA256");
    mac.init(new SecretKeySpec(secret.getBytes("UTF-8"), "HmacSHA256"));
    var signData = mac.doFinal(new java.lang.String(stringToSign).getBytes("UTF-8"));

    // Base64 编码签名
    var sign = encodeURIComponent(android.util.Base64.encodeToString(signData, android.util.Base64.NO_WRAP));

    // Webhook 地址和拼接签名、时间戳
    let access_token = "d7e46212f69d80fcfce6af88d464dc583dab98b6e40d810dd70065ca68ec1032";
    let url = `https://oapi.dingtalk.com/robot/send?access_token=${access_token}&timestamp=${timestamp}&sign=${sign}`;

    // 发送 POST 请求
    var response = http.postJson(url, {
        msgtype: "text",
        text: { content: `${shortTitle}\n${longContent}` }
    });

    // 输出返回结果
    // log(response.body.string());
}
}

 
// 注意：encodeURIComponent()函数用于确保字符串中的特殊字符被正确编码，以避免URL格式错误