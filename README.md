# 抖音续火花脚本
你上传的脚本是一个使用Auto.js编写的自动化脚本，主要用于在Android设备上自动执行一系列操作，特别是针对抖音应用的自动化任务。以下是对脚本主要功能的详细解释：

### 主要功能

1. **初始化和设置**：
   - 创建存储对象 `storage` 用于保存和读取用户输入的信息。
   - 定义全局变量和导入必要的Java类。
   - 设置音量键监听器，当音量上键被按下时，停止脚本运行。

2. **唤醒和解锁手机**：
   - `wakeAndUnlock(password)` 函数用于唤醒屏幕并解锁手机。
   - 如果屏幕未开启，会唤醒屏幕并滑动解锁。
   - 如果设置了密码，会输入密码解锁。

3. **创建用户界面 (UI)**：
   - `setupUI()` 函数创建一个包含多个输入框和按钮的UI界面。
   - 用户可以输入锁屏密码、朋友名称和发送的消息内容。
   - 提供确认、重置、开始和停止按钮，分别用于保存信息、清空信息、开始运行脚本和停止脚本。

4. **倒计时和计时器**：
   - `countdownTimer()` 函数用于设置一个倒计时，倒计时结束后自动执行任务。
   - 使用 `timers.setInterval` 设置每秒执行一次的定时器。

5. **发送消息**：
   - `sendMessage()` 函数用于启动抖音应用，进入消息页面，查找指定的好友并发送消息。
   - 处理权限请求，关闭弹窗，点击语音按钮，输入消息内容，点击发送按钮。
   - 支持不同版本的抖音应用，适配不同的控件ID。

6. **辅助函数**：
   - `clickWidgetByPosition(widget)` 函数用于点击控件，递归查找可点击的父控件。
   - `closePopup()` 函数用于关闭常见的弹窗。
   - `open_douyin()` 和 `closedouyin()` 函数用于启动和关闭抖音应用。
   - `sendnote()` 函数用于发送提示消息，关闭抖音并返回桌面。
   - `send_msg(friendName, messages)` 函数用于通过钉钉机器人发送通知。


