# cn-idp
Node.js开发的Identity provider。  
能使用钉钉扫码直接登陆kintone。 

# 效果
![效果](https://raw.githubusercontent.com/cyaoc/cn-idp/master/screenshots/screenshot.gif?token=GHSAT0AAAAAABHVJOO65YANQFY5VXANOAK4YPBEVAA)

# 原理
![原理](https://raw.githubusercontent.com/cyaoc/cn-idp/master/screenshots/design.png?token=GHSAT0AAAAAABHVJOO65YANQFY5VXANOAK4YPBEVAA)

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
  - 钉钉开放平台->应用开发->企业内部开发->创建一个名为cybozu的H5微应用
  - 开通 企业员工手机号信息	成员信息读权限 权限
  - 接入与分享中添加回调域名
  - 记住 AppSecret 及 AppKey

- kintone设定  
  - cybozu共通管理->系统管理->安全性->登录  
    - 勾选启用SAML身份验证
    - Identity Provider的SSO终结点URL（HTTP-Redirect）中输入 http://localhost:3000/saml/sso
    - 退出cybozu.cn后的跳转URL 中输入 http://localhost:3000/signout
    - Identity Provider在签名时使用的公钥证书 上传上一步生成的 idp-public-cert.pem
    - 点击保存  

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
```
