// "ui";
auto;
// //运行流程
closedouyin("抖音",500);//首先杀死抖音
open_douyin(500);//打开抖音
myall(500);//进入消息页面
main(500);// 主函数入口
closedouyin("抖音",500);//首先杀死抖音
cachedouyin("抖音",500);
exit();

//======================UI界面================================
// 创建UI界面函数
// function setupUI() {

// }
//======================逻辑部分================================
function main() {
    // 点击“我”按钮
    performClick(text("我"), "点击‘我’按钮");

    // 点击“更多”按钮
    performClick(desc("更多").depth(15), "点击‘更多’按钮");

    // 点击“设置”按钮
    performClick(text("设置"), "点击‘设置’按钮");

    // 点击“搜索”输入框
    performClick(text("搜索"), "点击‘搜索’输入框");

    // 输入“清理占用空间”
    setText("清理");

    // 点击“清理占用空间”按钮
    performClick(text("清理占用空间"), "点击‘清理占用空间’按钮");

    // 点击“清理缓存”按钮
    performClick(text("清理缓存"), "点击‘清理缓存’按钮");

    // 等待5秒
    sleep(5000);

    // 点击第一个“清理”按钮
    performClick(text("清理"), "点击第一个‘清理’按钮");

    // 点击第二个“清理”按钮
    performClick(text("清理"), "点击第二个‘清理’按钮");
}

function performClick(selector, message) {
    let widget = selector.findOne(5000);
    if (widget) {
        clickWidgetByPosition(widget);
        toast(message + "成功");
    } else {
        toast("未找到控件：" + message);
    }
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
//关闭抖音
function closedouyin(appName) {
    let forcedStopStr = ["结束", "停", "强"];
    let packageName = app.getPackageName(appName);//获取应用包名 通过软件名
    if (packageName) {
        app.openAppSetting(packageName);//进入应用设置信息
        text(appName).waitFor();//等待查询到名字出现
        for (var i = 0; i < forcedStopStr.length; i++) {
            if (textContains(forcedStopStr[i]).exists()) {//判定关键字是否存在
                sleep(500);
                let forcedStop = textContains(forcedStopStr[i]).findOne();
                if (forcedStop.enabled()) {
                    text("结束运行").waitFor();
                    //这里的结束运行不能被点击,我用控件中心点来点击
                    var 结束运行 = text("结束运行").findOne().bounds();
                    click(结束运行.centerX(), 结束运行.centerY());
                    sleep(500);
                    forcedStop.click();
                    text("确定").findOne().click();
                    sleep(1000);
                    home();
                    break;
                }
            }
        }
    }
}
// 打开抖音函数
function open_douyin() {
    app.launchPackage("com.ss.android.ugc.aweme");
}
//清除抖音缓存
function cachedouyin(appName){
    let forcedStopStr = ["清除", "停", "强"];
    let packageName = app.getPackageName(appName);//获取应用包名 通过软件名
    if (packageName) {
        app.openAppSetting(packageName);//进入应用设置信息
        text(appName).waitFor();//等待查询到名字出现
        for (var i = 0; i < forcedStopStr.length; i++) {
            if (textContains(forcedStopStr[i]).exists()) {//判定关键字是否存在
                sleep(500);
                let forcedStop = textContains(forcedStopStr[i]).findOne();
                if (forcedStop.enabled()) {
                    text("清除数据").waitFor();
                    //这里的结束运行不能被点击,我用控件中心点来点击
                    var 清除数据 = text("清除数据").findOne().bounds();
                    click(清除数据.centerX(), 清除数据.centerY());
                    sleep(500);
                    forcedStop.click();
                    text("清除缓存").findOne().click();
                    sleep(1000);
                    text("确定").findOne().click();
                    home();
                    break;
                }
            }
        }
    }

}
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
//我的界面
function myall() {
    // 检查抖音是否已经打开，并确认是否在我的页面
    checkAndNavigateToMyPage();
    // 处理权限请求
    handlePermissions();
    // 进入消息界面
    navigateToMessages();
}
function checkAndNavigateToMyPage() {
    if (currentActivity() != null && packageName === currentActivity()) {
        log("抖音已经打开，检查是否在我页面...");
        var messagesPageIndicator = text("我").className("android.widget.TextView").findOne(3000);

        if (messagesPageIndicator == null) {
            log("不在我的页面，尝试返回到我的页面...");
            back(); // 点击返回按钮
            sleep(180);
            var messagesTextWidget = text("我")
                .className("android.widget.TextView")
                .untilFindOne();
            clickWidgetByPosition(messagesTextWidget);
            sleep(3000, 100);
        } else {
            log("已经在我的页面...");
        }
    } else {
        log("抖音没有打开，使用函数重新启动...");
        open_douyin(); // 确保调用函数
        toast("抖音没有打开，使用函数重新启动...");
    }
}
function handlePermissions() {
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
}
function navigateToMessages() {
    log("进入消息界面...");
    var messagesTextWidget = text("我")
        .className("android.widget.TextView")
        .untilFindOne();
    clickWidgetByPosition(messagesTextWidget);
    sleep(3000, 100);
    log("关闭弹窗...");
    closePopup();
}
//我的界面

