module.exports = {
    MENU_TYPE: {
        DEFAULT_ATK_G : 0,      // 控球方 地面带球中断: 传球 射门 二过一
        ENCOUNTER_ATK_G : 1,    // 控球方 地面遭遇: 盘带 传球 射门 二过一
        ONE_ZERO_ATK_G : 2,     // 控球方 单刀: 射门 盘带
        ENCOUNTER_ATK_OPPSITE_A : 3,  // 控球方 对方禁区内半空遭遇: 盘带 传球 射门
        ENCOUNTER_ATK_SELF_A : 4,  // 控球方 己方禁区内半空遭遇: 传球 解围
        ENCOUTNER_DEF_G : 5,    // 防守方 地面遭遇: 铲球 拦截 封堵
        ENCOUNTER_DEF_SELF_A : 6,    // 防守方 己方禁区内半空遭遇: 解围 拦截 封堵
        ENCOUNTER_DEF_OPPSITE_A : 7, // 防守方 对方禁区半空遭遇: 拦截 封堵
        GOAL_KEEPER_DEF_G : 8,  // 防守方 守门员防守: 接球 击球
        ONE_ZERO_DEF_G : 9,     // 防守方 单刀门将: 封堵盘带 封堵射门
        GOAL_KEEPER_DEF_A : 10,  // 防守方 守门员空中遭遇: 出击 待机
        NONE : 11
    },

    MENU_ITEM: {
        Pass : 0,
        Dribble : 1,
        OneTwo : 2,
        Shoot : 3,
        Tackle : 4,
        Intercept : 5,
        Block : 6,
        Hit : 7,
        None : 8,
    }
};