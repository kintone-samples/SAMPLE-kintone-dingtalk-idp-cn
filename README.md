# Dingtalk-IdP-demo
Node.js开发的Identity provider。  
可使用钉钉扫码直接登陆kintone。  
可为钉钉的kintone小程序提供认证。  
可向指定的钉钉用户发送通知。

# 效果
扫码  
![扫码](https://raw.githubusercontent.com/cyaoc/cn-idp/master/screenshots/screenshot.gif)  

小程序  
![小程序](https://raw.githubusercontent.com/cyaoc/cn-idp/master/screenshots/miniapp.gif)

通知
![通知](https://raw.githubusercontent.com/cyaoc/cn-idp/master/screenshots/notify.gif)

# 原理
扫码  
![扫码](https://raw.githubusercontent.com/cyaoc/cn-idp/master/screenshots/design.png)  

小程序  
![扫码](https://raw.githubusercontent.com/cyaoc/cn-idp/master/screenshots/miniapp_design.png)  

# 安装
- 安装依赖
```console
npm i
```
- 生成证书
```console
chmod +x cert.sh
./cert.sh
```

- 钉钉
  - 修改package.json中的traversal下的${your_subdomain}。这个项目集成了[钉钉内网穿透]((https://open.dingtalk.com/document/resourcedownload/http-intranet-penetration))，可以直接通过npm run traversal来实现内网穿透。
  - 钉钉开放平台->应用开发->企业内部开发->创建一个名为kintone的H5微应用。
  - 开发管理
    - 开发模式：快捷链接
    - 快捷链接：http://内网穿透域名/re?domain=你的kintone域名
  - 权限管理
    - 企业员工手机号信息
    - 成员信息读权限
    - 根据手机号姓名获取成员信息的接口访问权限
  - 接入与分享中添加回调域名
  - 记住 AppSecret 、 AppKey 以及你的corpId
  - 部署与发布中选择你的可使用人员并发布

- kintone设定  
  - cybozu共通管理->系统管理->安全性->登录  
    - 勾选启用SAML身份验证
    - Identity Provider的SSO终结点URL（HTTP-Redirect）中输入 http://内网穿透域名/saml/sso
    - 退出cybozu.cn后的跳转URL 中输入 http://内网穿透域名/signout
    - Identity Provider在签名时使用的公钥证书 上传上一步生成的 idp-public-cert.pem
    - 点击保存  

  - 想要使用通知功能的请参照[这里](https://github.com/cyaoc/Process2Ding),添加kintone自定义程序。

- 新建用户对应表app，并发行只有查看记录权限的令牌  
<table>
  <tr>
    <td>字段名</td>
    <td>类型</td>
    <td>字段代码</td>
  </tr>
  <tr>
    <td>kintone用户登录名</td>
    <td>单行文本框</td>
    <td>loginName</td>
  </tr>
  <tr>
    <td>手机号</td>
    <td>单行文本框</td>
    <td>mobile</td>
  </tr>
</table>  

- 新建管理app，并发行只有查看记录权限的令牌  
<table>
  <tr>
    <td>字段名</td>
    <td>类型</td>
    <td>字段代码</td>
    <td>描述</td>
  </tr>
  <tr>
    <td>kintone域名</td>
    <td>单行文本框</td>
    <td>domain</td>
    <td>需要使用SSO功能的kintone域名</td>
  </tr>
  <tr>
    <td>APPID</td>
    <td>数值</td>
    <td>appid</td>
    <td>用户对应表APPID</td>
  </tr>
  <tr>
    <td>用户对应表Token</td>
    <td>单行文本框</td>
    <td>token</td>
    <td>用户对应表查询token</td>
  </tr>
  <tr>
    <td>corpId</td>
    <td>单行文本框</td>
    <td>corpId</td>
    <td>钉钉的corpId</td>
  </tr>
  <tr>
    <td>AppSecret</td>
    <td>单行文本框</td>
    <td>appSecret</td>
    <td>钉钉微应用的AppSecret</td>
  </tr>
  <tr>
    <td>AppKey</td>
    <td>单行文本框</td>
    <td>appKey</td>
    <td>钉钉微应用的AppKey</td>
  </tr>
  <tr>
    <td>callbackurl</td>
    <td>单行文本框</td>
    <td>callback</td>
    <td>钉钉微应用的回调域名</td>
  </tr>
  <tr>
    <td>AgentId</td>
    <td>单行文本框</td>
    <td>agentId</td>
    <td>AgentId</td>
  </tr>
</table>

- 追加db server信息
  - 进入项目根目录添加.env文件
```console
DOMAIN=管理app所在的kintone域名 
APPID=管理appID
TOKEN=管理app的查询token
```

# 运行
```console
npm start
npm run traversal
```
