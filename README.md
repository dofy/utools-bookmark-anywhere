# uTools - Bookmark Anywhere

## 简介

uTools 跨浏览器书签管理器插件

## 支持平台

- [X] macOS
- [X] Windows
- [X] Linux (_部分功能_)

## 当前网址识别支持的浏览器

- macOS 支持的浏览器
    - Safari
    - Chrome
    - Opera
    - Vivaldi
    - Brave
- Windows 支持的浏览器
    - Chrome
    - Firefox
    - MicrosoftEdge
    - IE
    - Opera
    - Brave
- Linux 不支持

详情参考： [uTools API](https://u.tools/docs/developer/api.html#getcurrentbrowserurl)

## 使用说明

### `bookmark`、`bm`、`书签`

打开书签列表，可通过`地址`、`页面标题`、`关键词`、`描述`进行模糊搜索

### `add`、`au`、`添加`

添加上述支持浏览器的`当前浏览地址`为书签

### `clean`

清除所有书签，后面版本将增加强大等管理功能，不再支持该命令

### 自动识别当前输入

自动识别`剪贴板`内容，若为网址，可以添加为书签

## TODO

- [ ] 处理一些异常情况
- [ ] 书签管理