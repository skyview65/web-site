import type { Dictionary } from "../dictionary";

export const zh = {
  meta: {
    title: "LUMENFALL — 黑暗闪耀 · 2099",
    description:
      "2099年。在AI统治的超级都市流明坠城，三段人生交织成同一个命运。一部从街头延伸到轨道的开放世界犯罪史诗。2027年问世。",
    ogAlt: "LUMENFALL — 2099年霓虹超级都市上空的轨道电梯",
  },
  nav: {
    city: "城市",
    protagonists: "角色",
    features: "特色",
    online: "LUMENFALL Online",
    editions: "版本",
    preorder: "预购",
    menuOpen: "打开菜单",
    menuClose: "关闭菜单",
    selectLanguage: "选择语言",
    skipToContent: "跳转到正文",
  },
  hero: {
    kicker: "开放世界犯罪史诗",
    tagline: "黑暗闪耀。",
    releaseWindow: "2027",
    platforms: "PC · 主机 · 云端",
    cta: "立即预购",
    scrollHint: "滚动探索",
    imageAlt:
      "2099年的流明坠城：轨道电梯穿透云层直指星空，黑色高塔上闪烁着青色与品红的霓虹",
  },
  city: {
    kicker: "城市",
    title: "流明坠城活着。即使在你沉睡时。",
    paragraphs: [
      "在2061年大断电的灰烬上重建之后，流明坠城如今由PANOPT统治——一个城市级人工智能，掌控着一切：从交通到审判，从电网到记忆本身。在这套无懈可击的秩序之下，是一个被划分为九大城区的庞大犯罪生态。",
      "从霓虹港的赌场到锈带的帮派街区，从沉没于水下的雾底旧巷到轨道电梯攀向天际的登城区：每个城区都有自己的经济、自己的规矩、自己的记忆。一条街道的气味、一个街区的怒火、放贷人对你开出的价码——这座城市什么都不会忘记。",
      "而这座城市正注视着你。你的每一个选择都被写进PANOPT的账簿——等待着某一天，回来找你清算。",
    ],
    stats: [
      { value: "9", label: "城区" },
      { value: "310 KM²", label: "城市 + 轨道层" },
      { value: "120万", label: "模拟市民" },
      { value: "100%", label: "无缝世界 — 没有加载画面" },
    ],
    imageAlt:
      "流明坠城的街头：霓虹峡谷中的人潮、全息广告与湿漉漉的柏油路反光",
  },
  protagonists: {
    kicker: "三段人生，一个命运",
    title: "你将透过谁的眼睛活下去？",
    intro:
      "三位可操作角色，三个截然不同的世界——三条故事线最终缠成一个结。随时切换角色；你不在的时候，每个人都在继续过自己的生活。",
    characters: [
      {
        id: "mara",
        name: "Mara Vex",
        role: "网络潜袭者",
        tagline: "寻找被抹除的弟弟。",
        bio: "暗影市场最出色的数据窃贼。一夜之间，她的弟弟从PANOPT的记忆库中被抹除——也从所有人的记忆里消失了。玛拉将潜入系统的心脏，偷回它选择遗忘的东西。",
      },
      {
        id: "kaan",
        name: "Kaan “Ghost” Demir",
        role: "前执行者",
        tagline: "从系统中逃脱的男人。",
        bio: "二十年来他替财团干尽脏活；直到拒绝了一道命令，然后死了——官方记录上是这么写的。如今他像幽灵一样游荡在锈带。他要在过去找上门之前，先和过去做个了断。",
      },
      {
        id: "solene",
        name: "Solene Adeyemi",
        role: "轨道走私飞行员",
        tagline: "天空的法外女王。",
        bio: "在登城区与天顶环之间，只要能飞的货她都运。海关对她只是建议，重力不过是个技术细节。直到一票货物，把整座城市的命运丢进了她的驾驶舱。",
      },
    ],
  },
  features: {
    kicker: "玩法",
    title: "不止是一座城市。是一个系统。",
    items: [
      {
        title: "从街头到轨道",
        body: "一场始于地铁的追逐，可以沿着轨道电梯一路向上，在天顶环的零重力中收场。一张地图，一口气——没有加载画面。",
      },
      {
        title: "活着的城市",
        body: "120万市民每人都拥有持久的身份：作息、关系、记忆。你昨天撞翻的小贩，明天会认出你。",
      },
      {
        title: "三段人生，一个故事",
        body: "在玛拉、卡安与索琳之间即时切换。你未操控的角色仍按自己的盘算行动；他们的故事因你的选择而交汇。",
      },
      {
        title: "PANOPT响应系统",
        body: "不是通缉等级——而是一座学习你的城市。PANOPT分析你的犯罪模式，围绕它布下陷阱。同一招数永远不会奏效两次。",
      },
      {
        title: "玩家驱动的经济",
        body: "九大城区的物价随真实的供需波动。经营走私路线，或者操纵市场——经济就是你的游乐场。",
      },
      {
        title: "无底车库",
        body: "200多辆载具：从悬浮车到轨道穿梭机。每一辆都能逐个部件改装，每一辆都能偷。没错，穿梭机也能。",
      },
    ],
  },
  online: {
    kicker: "在线服务",
    title: "LUMENFALL Online：城市属于我们所有人。",
    body: "与四人小队一起建立你的犯罪帝国。赛季制劫案轮换、城区战争、由玩家书写的经济——即使你离线，流明坠城依然在转动。",
    bullets: [
      "12周赛季制——每季带来全新城区剧情、劫案与活动",
      "小队系统:4人团队、共享藏身处、公共金库",
      "城区战争:九大城区的控制权每周易主",
      "跨平台+跨进度:一个账号，所有设备",
      "所有玩法内容皆通过游玩获得——实力永不出售",
    ],
    ticker:
      "第01赛季:断电协议 · 全新劫案:天顶金库 · 城区战争:霓虹港 · 双倍流明周",
    imageAlt: "黑暗藏身处中，四人小队围在全息劫案规划桌旁",
  },
  editions: {
    kicker: "预购",
    title: "选择你的版本。",
    tiers: [
      {
        id: "standard",
        name: "Standard",
        tag: "",
        price: "¥298",
        contents: [
          "LUMENFALL 本体游戏",
          "LUMENFALL Online 访问权限",
          "预购奖励:「断电」载具涂装",
        ],
        cta: "选择 Standard",
      },
      {
        id: "deluxe",
        name: "Deluxe",
        tag: "最受欢迎",
        price: "¥428",
        contents: [
          "本体游戏 + LUMENFALL Online",
          "72小时抢先体验",
          "数字美术设定集 + 原声音乐",
          "「暗影市场」服装合集",
          "第01赛季棱镜装饰包",
        ],
        cta: "选择 Deluxe",
      },
      {
        id: "eternal",
        name: "Eternal",
        tag: "典藏版",
        price: "¥548",
        contents: [
          "Deluxe 版全部内容",
          "首年扩展通行证(2个剧情包)",
          "天顶环公寓(游戏内藏身处)",
          "限定「Eternal」花押载具系列",
          "你的名字将出现在流明坠城的一条街道上*",
        ],
        cta: "选择 Eternal",
      },
    ],
    note: "*仅限前10,000份 Eternal 预购。所有内容均为虚构，价格仅作示意。任何影响玩法的内容都绝不以真实货币出售。",
    imageAlt: "黑色玻璃上映着霓虹反光、饰有青色L徽记的LUMENFALL典藏版包装盒",
  },
  newsletter: {
    title: "加入断电名单。",
    body: "预告片、封闭测试邀请与赛季资讯——没有垃圾邮件，只有信号。",
    placeholder: "你的电子邮箱",
    button: "订阅",
    success: "你已在名单上。黑暗会与你联系。",
    privacy: "随时一键退订。",
  },
  footer: {
    fictional:
      "LUMENFALL 是一款作为概念作品创作的虚构游戏，与任何真实产品、工作室或品牌均无关联。",
    rights: "© 2099 Lumenworks Studios. 版权所有——暂时如此。",
    studio: "Lumenworks Studios",
  },
} satisfies Dictionary;
