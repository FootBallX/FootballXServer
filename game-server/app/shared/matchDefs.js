var mi = require('./matchMenuItem');
var Rect = require('../util/Geometry/Rect');


module.exports = {
    INSTRUCTION_WAIT_TIME:10000,         // 10 seconds
    STUNNED_TIME:2000,                  // 2 seconds

    ONE_TWO_OFFSET:150,                 // 二过一时，球员往前移动的距离

    MENU_TYPE_INSTRUCTIONS: [
        [mi.MENU_ITEM.Dribble, mi.MENU_ITEM.Pass, mi.MENU_ITEM.Shoot, mi.MENU_ITEM.OneTwo],     // 0
        [mi.MENU_ITEM.Dribble, mi.MENU_ITEM.Pass, mi.MENU_ITEM.Shoot, mi.MENU_ITEM.OneTwo],     // 1
        [mi.MENU_ITEM.Shoot, mi.MENU_ITEM.Dribble],                                             // 2
        [mi.MENU_ITEM.Dribble, mi.MENU_ITEM.Pass, mi.MENU_ITEM.Shoot],                          // 3
        [mi.MENU_ITEM.Pass, mi.MENU_ITEM.Clear],                                                // 4
        [mi.MENU_ITEM.Tackle, mi.MENU_ITEM.Intercept, mi.MENU_ITEM.Block],                      // 5
        [mi.MENU_ITEM.Clear, mi.MENU_ITEM.Intercept, mi.MENU_ITEM.Block],                       // 6
        [mi.MENU_ITEM.Intercept, mi.MENU_ITEM.Block],                                           // 7
        [mi.MENU_ITEM.Catch, mi.MENU_ITEM.Hit],                                                 // 8
        [mi.MENU_ITEM.BlockDribble, mi.MENU_ITEM.BlockShoot],                                   // 9
        [mi.MENU_ITEM.Attack, mi.MENU_ITEM.Wait],                                               // 10
        []                                                                                      // 11
    ],

    MENU_TYPE: {
        DEFAULT_ATK_G: 0,      // 控球方 地面带球中断: 盘带 传球 射门 二过一
        ENCOUNTER_ATK_G: 1,    // 控球方 地面遭遇: 盘带 传球 射门 二过一
        ONE_ZERO_ATK_G: 2,     // 控球方 单刀: 射门 盘带
        ENCOUNTER_ATK_OPPSITE_A: 3,  // 控球方 对方禁区内半空遭遇: 盘带 传球 射门
        ENCOUNTER_ATK_SELF_A: 4,  // 控球方 己方禁区内半空遭遇: 传球 解围
        ENCOUTNER_DEF_G: 5,    // 防守方 地面遭遇: 铲球 拦截 封堵
        ENCOUNTER_DEF_SELF_A: 6,    // 防守方 己方禁区内半空遭遇: 解围 拦截 封堵
        ENCOUNTER_DEF_OPPSITE_A: 7, // 防守方 对方禁区半空遭遇: 拦截 封堵
        GOAL_KEEPER_DEF_G: 8,  // 防守方 守门员防守: 接球 击球
        ONE_ZERO_DEF_G: 9,     // 防守方 单刀门将: 封堵盘带 封堵射门
        GOAL_KEEPER_DEF_A: 10,  // 防守方 守门员空中遭遇: 出击 待机
        NONE: 11
    },

    POST_INSTRUNCTION_ACTION: {
        TriggerGoalkeeperDefG : 0,
        CheckPenaltyEncounter : 1,
        None: 3
    },

    ENCOUNTER_PLACE : {
        DEF_PANELTY_AREA : 0,
        ATK_PANELTY_AREA : 1,
        OTHER_AREA : 2
    },

    MATCH_STATE: {
        Normal: 0,
        WaitInstruction: 1,
        WaitInstructionMovieEnd: 2,
        None: 3
    },

    Pitch: {
        Width: 1000,
        Height: 650,
        PenaltyArea: [
            new Rect(0, 175, 150, 300),
            new Rect(850, 175, 150, 300)
        ]
    },

    RandomBallRange : {
        width : 80,
        height : 80
    },

    // AICLass -> 0 Goalkeeper, 1 Back, 2 HalfBack, 3 Forward.
    FormationInitPosition: [
        [
            // 442
            {Position : {x: 25, y: 325},   HomePosition : {x: 0, y: 325},      AIClass: 0},
            {Position : {x:140, y: 120},   HomePosition : {x: 0, y: 120},      AIClass: 1},
            {Position : {x:140, y: 222.5}, HomePosition : {x: 0, y: 222.5},    AIClass: 1},
            {Position : {x:140, y: 427.5}, HomePosition : {x: 0, y: 427.5},    AIClass: 1},
            {Position : {x:140, y: 530},   HomePosition : {x: 0, y: 530},      AIClass: 1},
            {Position : {x:300, y: 120},   HomePosition : {x: 0, y: 120},      AIClass: 2},
            {Position : {x:300, y: 222.5}, HomePosition : {x: 0, y: 222.5},    AIClass: 2},
            {Position : {x:300, y: 427.5}, HomePosition : {x: 0, y: 427.5},    AIClass: 2},
            {Position : {x:300, y: 530},   HomePosition : {x: 0, y: 530},      AIClass: 2},
            {Position : {x:440, y: 260},   HomePosition : {x: 0, y: 260},      AIClass: 3},
            {Position : {x:500, y: 330},   HomePosition : {x: 0, y: 330},      AIClass: 3}
        ],
        [
            // 3232
            {Position : {x: 25, y: 325},   HomePosition : {x: 0,   y: 325},    AIClass: 0},
            {Position : {x:140, y: 190},   HomePosition : {x: 0,   y: 190},    AIClass: 1},
            {Position : {x:140, y: 325},   HomePosition : {x: 0,   y: 325},    AIClass: 1},
            {Position : {x:140, y: 460},   HomePosition : {x: 0,   y: 460},    AIClass: 1},
            {Position : {x:240, y: 230},   HomePosition : {x: -50, y: 230},    AIClass: 2},
            {Position : {x:240, y: 420},   HomePosition : {x: -50, y: 420},    AIClass: 2},
            {Position : {x:340, y: 190},   HomePosition : {x: 50,  y: 190},    AIClass: 2},
            {Position : {x:340, y: 325},   HomePosition : {x: 50,  y: 325},    AIClass: 2},
            {Position : {x:340, y: 460},   HomePosition : {x: 50,  y: 460},    AIClass: 2},
            {Position : {x:440, y: 260},   HomePosition : {x: 0,   y: 260},    AIClass: 3},
            {Position : {x:500, y: 330},   HomePosition : {x: 0,   y: 330},    AIClass: 3}
        ]
    ],

    Formations: {
        F_4_4_2: 0,
        F_3_2_3_2: 1
    }
}