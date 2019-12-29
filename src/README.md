# uTools - Bookmark Anywhere

## 简介

uTools 跨浏览器书签管理器插件

## 支持平台

- macOS
- Windows
- Linux (_部分功能_)

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

### 直接输入

- 打开书签列表，可通过`地址`、`页面标题`、`关键词`、`描述`进行模糊搜索
- 支持正则匹配

### `add`、`au`、`添加`

添加上述支持浏览器的`当前浏览地址`为书签

### `delete`、`remove`、`del`、`rm`、`删除`

- 通过搜索，删除不再需要的书签
- 支持正则匹配

### 自动识别剪贴板内容

自动识别`剪贴板`内容，若为网址，可以添加为书签

### 书签导入

目前测试可导入`Chrome`、`Safari`、`Firefox`等浏览器导出的书签文件，支持多文件同时导入

## TODO

- 处理一些异常情况
- 书签管理
