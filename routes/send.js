const express = require('express');

const router = express.Router();
const kt = require('../core/proxies/kintone');
const Dingtalk = require('../core/proxies/dingtalk');

router.post('/', async (req, res, next) => {
  try {
    const {
      domain, app, id, title, users,
    } = req.body;
    const setting = await kt.setting(domain);
    const mobiles = await kt.mobiles(setting, users);
    const dt = new Dingtalk(setting.appKey, setting.appSecret);
    const ids = (await dt.userids(mobiles)).join();
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const msg = {
      msgtype: 'markdown',
      markdown: {
        title: '你有一条待处理信息',
        text: `# 你有一条待处理信息 \n ### ${new Date(Date.now() - tzoffset).toISOString().replace(/T/, ' ').replace(/\..+/, '')} \n ## [${title}](https://${domain}/k/${app}/show#record=${id})`,
      },
    };
    const info = {
      agent_id: setting.agentId,
      msg,
      userid_list: ids,
    };
    await dt.sendmsg(info);
    res.end();
  } catch (e) {
    next(e);
  }
});

module.exports = router;
