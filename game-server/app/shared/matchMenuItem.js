var utils = require('../util/utils');
var aniDef = require('./aniDefs');


function Rand() {
    return utils.getRandom(65535);
}

function Log(s) {
    console.log(s);
}


// AUTO_GEN_CODE_BEGIN

// 全局函数:
// Log("abc");                          输出log
// Rand();                              取随机数，范围在0 ~ 最大正整数，如果要取0~1000的随机数，则写：Rand() % 1000;
// PlayAnimation(ccbi_name, delay);     播放动画，参数1是动画的ccbi文件名，delay是以秒为单位，表示动画播放的延迟开始时间。
//
// o1,o2 分别表示两个球员的属性。可以用o1.speed来引用球员的速度。
//
// 属性包括:
// id       ID
// type     司职
// strength 体力
// speed    速度
// dribbleSkill  盘带
// passSkill     传球
// shootSkill    射门
// defenceSkill  防守
// attackSkill   出击
// groundSkill   地面
// airSkill      空中

var RET_FAIL = 0;
var RET_SUCCESS = 1;
var RET_REDUCE = 2;
var RET_RANDOM_BALL = 3;

var g_ballSpeed = 0; //球减速修正,需要在适当的时候初始化
var g_isLongBall = false;
var g_type = 0;
//0 = 地面 传球
//1 = 地面 射门
//2 = 地面 盘带
//3 = 地面 二过一
//4 = 空中 传球
//5 = 空中 射门
//6 = 空中 盘带（停球）

//指令修正
var g_OrderParam_1 = 150; //地面 传球vs铲球
var g_OrderParam_2 = -100; //地面 传球vs拦截
var g_OrderParam_3 = 50; //地面 传球vs封堵

var g_OrderParam_4 = -100; //地面 盘带vs铲球
var g_OrderParam_5 = 50; //地面 盘带vs拦截
var g_OrderParam_6 = 150; //地面 盘带vs封堵

var g_OrderParam_7 = 150; //地面 二过一vs铲球
var g_OrderParam_8 = -100; //地面 二过一vs拦截
var g_OrderParam_9 = 50; //地面 二过一vs封堵

var g_OrderParam_10 = 100; //地面 射门vs铲球
var g_OrderParam_11 = -50; //地面 射门vs拦截
var g_OrderParam_12 = -150; //地面 射门vs封堵

var g_OrderParam_13 = -150; //进攻空中 盘带vs解围
var g_OrderParam_14 = 50; //进攻空中 盘带vs拦截
var g_OrderParam_15 = 50; //进攻空中 盘带vs封堵
var g_OrderParam_16 = -150; //进攻空中 盘带vs出击

var g_OrderParam_17 = -50; //进攻空中 传球vs解围
var g_OrderParam_18 = -100; //进攻空中 传球vs拦截
var g_OrderParam_19 = 50; //进攻空中 传球vs封堵
var g_OrderParam_20 = -150; //进攻空中 传球vs出击

var g_OrderParam_21 = 0; //进攻空中 射门vs解围
var g_OrderParam_22 = -50; //进攻空中 射门vs拦截
var g_OrderParam_23 = -100; //进攻空中 射门vs封堵
var g_OrderParam_24 = -150; //进攻空中 射门vs出击

var g_OrderParam_25 = -100; //防守空中 传球vs拦截
var g_OrderParam_26 = 50; //防守空中 传球vs封堵
var g_OrderParam_27 = 50; //防守空中 解围vs拦截
var g_OrderParam_28 = -100; //防守空中 解围vs封堵

var g_OrderParam_29 = -100; //守门 接球
var g_OrderParam_30 = 0; //守门 击球

var g_OrderParam_31 = -200; //单刀 盘带vs封堵盘带
var g_OrderParam_32 = 200; //单刀 盘带vs封堵射门
var g_OrderParam_33 = -200; //单刀 射门vs封堵盘带
var g_OrderParam_34 = 200; //单刀 射门vs封堵射门

//计算结果参数
var g_WinParam_1 = 650; //无减速，进攻方胜利
var g_RandomParam_1 = 350; //无减速，随机球

var g_WinParam_2 = 750; //有减速，进攻方胜利
var g_RandomParam_2 = 500; //有减速，随机球
var g_ReducedParam_2 = 250; //有减速，减速
var g_ReducedParam = 100; //减速修正

var g_Animations = [];


function PlayAnimation(ccb, delay) {
    g_Animations.push({animId:ccb, delay:delay});
}




function GetSpeed(o1) {
    var spd = o1.speed;
    return parseFloat(spd);
}

//传球

function StartPassBall(o1, isLongBall) {
    g_Animations = [];
    g_isLongBall = isLongBall;
    if (g_isLongBall) {
        PlayAnimation(aniDef.Animations.air_chuanqiu_ccbi, 0);
        g_ballSpeed = 0;
        g_type = 4;
    } else {
        PlayAnimation(aniDef.Animations.ground_chuanqiu_ccbi, 0);
        g_ballSpeed = 0;
        g_type = 0;
    }
    return;
}


function StartDribble(o1) {
    g_Animations = [];
    PlayAnimation(aniDef.Animations.ground_pandai_ccbi, 0);
    g_type = 2;
    g_ballSpeed = 0;
}

function StartOneTwo(o1, isLongBall) {
    g_Animations = [];
    g_isLongBall = isLongBall;
    PlayAnimation(aniDef.Animations.ground_chuanqiu_ccbi, 0);
    g_type = 3;
}


//获得球

function ReceiveBall(o1) {
    if (g_isLongBall) {
        PlayAnimation(aniDef.Animations.air_tingqiu_ccbi, 0);
        g_ballSpeed = 0;
        g_type = 0;
    } else {
        PlayAnimation(aniDef.Animations.ground_tingqiu_ccbi, 0);
        g_ballSpeed = 0;
        g_type = 0;
    }
    return;
}


// 二过一回传
function OneTwoPassBack(o1) {
    PlayAnimation(aniDef.Animations.ground_2guo1_ccbi, 0);
}

// 铲球

function TackleBall(o1, o2) {
    switch (g_type) {
        case 0: //铲球vs传球
        {
            var v = Rand() % 1000 + (o1.passSkill + o1.groundSkill) - (o2.defenceSkill + o2.groundSkill) + g_OrderParam_1 + g_ballSpeed;
            // debug
            v = g_WinParam_2;
            if (v >= g_WinParam_2) {
                PlayAnimation(aniDef.Animations.ground_chanqiu_failed_ccbi, 0);
                return RET_FAIL;
            } else if (v >= g_RandomParam_2) {
                PlayAnimation(aniDef.Animations.ground_chanqiu_randomball_ccbi, 0);
                return RET_RANDOM_BALL;
            } else if (v >= g_ReducedParam_2) {
                PlayAnimation(aniDef.Animations.ground_chanqiu_reduced_ccbi, 0);
                g_ballSpeed += g_ReducedParam;
                return RET_REDUCE;
            } else {
                PlayAnimation(aniDef.Animations.ground_chanqiu_success_ccbi, 0);
                return RET_SUCCESS;
            }
            break;
        }

        case 1: //铲球vs射门
        {
            var v = Rand() % 1000 + (o1.shootSkill + o1.groundSkill) - (o2.defenceSkill + o2.groundSkill) + g_OrderParam_10 + g_ballSpeed;
            if (v >= g_WinParam_2) {
                PlayAnimation(aniDef.Animations.ground_chanqiu_failed_ccbi, 0);
                return RET_FAIL;
            } else if (v >= g_RandomParam_2) {
                PlayAnimation(aniDef.Animations.ground_chanqiu_randomball_ccbi, 0);
                return RET_RANDOM_BALL;
            } else if (v >= g_ReducedParam_2) {
                PlayAnimation(aniDef.Animations.ground_chanqiu_reduced_ccbi, 0);
                g_ballSpeed += g_ReducedParam;
                return RET_REDUCE;
            } else {
                PlayAnimation(aniDef.Animations.ground_chanqiu_success_ccbi, 0);
                return RET_SUCCESS;
            }
            break;
        }

        case 2: //铲球vs盘带
        {
            var v = Rand() % 1000 + (o1.dribbleSkill + o1.groundSkill) - (o2.defenceSkill + o2.groundSkill) + g_OrderParam_4;
            v = g_WinParam_1;
            if (v >= g_WinParam_1) {
                PlayAnimation(aniDef.Animations.ground_chanqiu_failed_ccbi, 0);
                return RET_FAIL;
            } else if (v >= g_RandomParam_1) {
                PlayAnimation(aniDef.Animations.ground_chanqiu_randomball_ccbi, 0);
                return RET_RANDOM_BALL;
            } else {
                PlayAnimation(aniDef.Animations.ground_chanqiu_success_ccbi, 0);
                return RET_SUCCESS;
            }
            break;
        }

        case 3: //铲球vs二过一
        {
            var v = Rand() % 1000 + (o1.passSkill + o1.groundSkill) - (o2.defenceSkill + o2.groundSkill) + g_OrderParam_7 + g_ballSpeed;
            if (v >= g_WinParam_2) {
                PlayAnimation(aniDef.Animations.ground_chanqiu_failed_ccbi, 0);
                return RET_FAIL;
            } else if (v >= g_RandomParam_2) {
                PlayAnimation(aniDef.Animations.ground_chanqiu_randomball_ccbi, 0);
                return RET_RANDOM_BALL;
            } else if (v >= g_ReducedParam_2) {
                PlayAnimation(aniDef.Animations.ground_chanqiu_reduced_ccbi, 0);
                g_ballSpeed += g_ReducedParam;
                return RET_REDUCE;
            } else {
                PlayAnimation(aniDef.Animations.ground_chanqiu_success_ccbi, 0);
                return RET_SUCCESS;
            }
            break;
        }
    }
}

// 拦截

function InterceptBall(o1, o2) {
    switch (g_type) {
        case 0: //拦截vs传球
        {
            var v = Rand() % 1000 + (o1.passSkill + o1.groundSkill) - (o2.defenceSkill + o2.groundSkill) + g_OrderParam_2 + g_ballSpeed;
            if (v >= g_WinParam_2) {
                PlayAnimation(aniDef.Animations.ground_lanjie_failed_ccbi, 0);
                return RET_FAIL;
            } else if (v >= g_RandomParam_2) {
                PlayAnimation(aniDef.Animations.ground_lanjie_randomball_ccbi, 0);
                return RET_RANDOM_BALL;
            } else if (v >= g_ReducedParam_2) {
                PlayAnimation(aniDef.Animations.ground_lanjie_reduced_ccbi, 0);
                g_ballSpeed += g_ReducedParam;
                return RET_REDUCE;
            } else {
                PlayAnimation(aniDef.Animations.ground_lanjie_success_ccbi, 0);
                return RET_SUCCESS;
            }
            break;
        }

        case 1: //拦截vs射门
        {
            var v = Rand() % 1000 + (o1.shootSkill + o1.groundSkill) - (o2.defenceSkill + o2.groundSkill) + g_OrderParam_11 + g_ballSpeed;
            if (v >= g_WinParam_2) {
                PlayAnimation(aniDef.Animations.ground_lanjie_failed_ccbi, 0);
                return RET_FAIL;
            } else if (v >= g_RandomParam_2) {
                PlayAnimation(aniDef.Animations.ground_lanjie_randomball_ccbi, 0);
                return RET_RANDOM_BALL;
            } else if (v >= g_ReducedParam_2) {
                PlayAnimation(aniDef.Animations.ground_lanjie_reduced_ccbi, 0);
                g_ballSpeed += g_ReducedParam;
                return RET_REDUCE;
            } else {
                PlayAnimation(aniDef.Animations.ground_lanjie_success_ccbi, 0);
                return RET_SUCCESS;
            }
            break;
        }

        case 2: //拦截vs盘带
        {
            var v = Rand() % 1000 + (o1.dribbleSkill + o1.groundSkill) - (o2.defenceSkill + o2.groundSkill) + g_OrderParam_5;
            if (v >= g_WinParam_1) {
                PlayAnimation(aniDef.Animations.ground_lanjie_failed_ccbi, 0);
                return RET_FAIL;
            } else if (v >= g_RandomParam_1) {
                PlayAnimation(aniDef.Animations.ground_lanjie_randomball_ccbi, 0);
                return RET_RANDOM_BALL;
            } else {
                PlayAnimation(aniDef.Animations.ground_lanjie_success_ccbi, 0);
                return RET_SUCCESS;
            }
            break;
        }


        case 3: //拦截vs二过一
        {
            var v = Rand() % 1000 + (o1.passSkill + o1.groundSkill) - (o2.defenceSkill + o2.groundSkill) + g_OrderParam_8 + g_ballSpeed;
            if (v >= g_WinParam_2) {
                PlayAnimation(aniDef.Animations.ground_lanjie_failed_ccbi, 0);
                return RET_FAIL;
            } else if (v >= g_RandomParam_2) {
                PlayAnimation(aniDef.Animations.ground_lanjie_randomball_ccbi, 0);
                return RET_RANDOM_BALL;
            } else if (v >= g_ReducedParam_2) {
                PlayAnimation(aniDef.Animations.ground_lanjie_reduced_ccbi, 0);
                g_ballSpeed += g_ReducedParam;
                return RET_REDUCE;
            } else {
                PlayAnimation(aniDef.Animations.ground_lanjie_success_ccbi, 0);
                return RET_SUCCESS;
            }
            break;
        }

        case 4: //空中拦截vs传球
        {
            var v = Rand() % 1000 + (o1.passSkill + o1.airSkill) - (o2.defenceSkill + o2.airSkill) + g_OrderParam_18 + g_ballSpeed;
            if (v >= g_WinParam_2) {
                PlayAnimation(aniDef.Animations.air_lanjie_failed_ccbi, 0);
                return RET_FAIL;
            } else if (v >= g_RandomParam_2) {
                PlayAnimation(aniDef.Animations.air_lanjie_randomball_ccbi, 0);
                return RET_RANDOM_BALL;
            } else if (v >= g_ReducedParam_2) {
                PlayAnimation(aniDef.Animations.air_lanjie_reduced_ccbi, 0);
                g_ballSpeed += g_ReducedParam;
                return RET_REDUCE;
            } else {
                PlayAnimation(aniDef.Animations.air_lanjie_success_ccbi, 0);
                return RET_SUCCESS;
            }
            break;
        }

        case 5: //空中拦截vs射门
        {
            var v = Rand() % 1000 + (o1.shootSkill + o1.airSkill) - (o2.defenceSkill + o2.airSkill) + g_OrderParam_22 + g_ballSpeed;
            if (v >= g_WinParam_2) {
                PlayAnimation(aniDef.Animations.air_lanjie_failed_ccbi, 0);
                return RET_FAIL;
            } else if (v >= g_RandomParam_2) {
                PlayAnimation(aniDef.Animations.air_lanjie_randomball_ccbi, 0);
                return RET_RANDOM_BALL;
            } else if (v >= g_ReducedParam_2) {
                PlayAnimation(aniDef.Animations.air_lanjie_reduced_ccbi, 0);
                g_ballSpeed += g_ReducedParam;
                return RET_REDUCE;
            } else {
                PlayAnimation(aniDef.Animations.air_lanjie_success_ccbi, 0);
                return RET_SUCCESS;
            }
            break;
        }

        case 6: //空中拦截vs停球
        {
            var v = Rand() % 1000 + (o1.dribbleSkill + o1.airSkill) - (o2.defenceSkill + o2.airSkill) + g_OrderParam_14;
            if (v >= g_WinParam_1) {
                PlayAnimation(aniDef.Animations.air_lanjie_failed_ccbi, 0);
                return RET_FAIL;
            } else if (v >= g_RandomParam_1) {
                PlayAnimation(aniDef.Animations.air_lanjie_randomball_ccbi, 0);
                return RET_RANDOM_BALL;
            } else {
                PlayAnimation(aniDef.Animations.air_lanjie_success_ccbi, 0);
                return RET_SUCCESS;
            }
            break;
        }
    }
}

// 封堵

function BlockBall(o1, o2) {
    switch (g_type) {
        case 0: //封堵vs传球
        {
            var v = Rand() % 1000 + (o1.passSkill + o1.groundSkill) - (o2.defenceSkill + o2.groundSkill) + g_OrderParam_3 + g_ballSpeed;
            if (v >= g_WinParam_2) {
                PlayAnimation(aniDef.Animations.ground_fengdu_failed_ccbi, 0);
                return RET_FAIL;
            } else if (v >= g_RandomParam_2) {
                PlayAnimation(aniDef.Animations.ground_fengdu_randomball_ccbi, 0);
                return RET_RANDOM_BALL;
            } else if (v >= g_ReducedParam_2) {
                PlayAnimation(aniDef.Animations.ground_fengdu_reduced_ccbi, 0);
                g_ballSpeed += g_ReducedParam;
                return RET_REDUCE;
            } else {
                PlayAnimation(aniDef.Animations.ground_fengdu_success_ccbi, 0);
                return RET_SUCCESS;
            }
            break;
        }

        case 1: //封堵vs射门
        {
            var v = Rand() % 1000 + (o1.shootSkill + o1.groundSkill) - (o2.defenceSkill + o2.groundSkill) + g_OrderParam_12 + g_ballSpeed;
            if (v >= g_WinParam_2) {
                PlayAnimation(aniDef.Animations.ground_fengdu_failed_ccbi, 0);
                return RET_FAIL;
            } else if (v >= g_RandomParam_2) {
                PlayAnimation(aniDef.Animations.ground_fengdu_randomball_ccbi, 0);
                return RET_RANDOM_BALL;
            } else if (v >= g_ReducedParam_2) {
                PlayAnimation(aniDef.Animations.ground_fengdu_reduced_ccbi, 0);
                g_ballSpeed += g_ReducedParam;
                return RET_REDUCE;
            } else {
                PlayAnimation(aniDef.Animations.ground_fengdu_success_ccbi, 0);
                return RET_SUCCESS;
            }
            break;
        }

        case 2: //封堵vs盘带
        {
            var v = Rand() % 1000 + (o1.dribbleSkill + o1.groundSkill) - (o2.defenceSkill + o2.groundSkill) + g_OrderParam_6;
            if (v >= g_WinParam_1) {
                PlayAnimation(aniDef.Animations.ground_fengdu_failed_ccbi, 0);
                return RET_FAIL;
            } else if (v >= g_RandomParam_1) {
                PlayAnimation(aniDef.Animations.ground_fengdu_randomball_ccbi, 0);
                return RET_RANDOM_BALL;
            } else {
                PlayAnimation(aniDef.Animations.ground_fengdu_success_ccbi, 0);
                return RET_SUCCESS;
            }
            break;
        }

        case 3: //封堵vs二过一
        {
            var v = Rand() % 1000 + (o1.passSkill + o1.groundSkill) - (o2.defenceSkill + o2.groundSkill) + g_OrderParam_9 + g_ballSpeed;
            if (v >= g_WinParam_2) {
                PlayAnimation(aniDef.Animations.ground_fengdu_failed_ccbi, 0);
                return RET_FAIL;
            } else if (v >= g_RandomParam_2) {
                PlayAnimation(aniDef.Animations.ground_fengdu_randomball_ccbi, 0);
                return RET_RANDOM_BALL;
            } else if (v >= g_ReducedParam_2) {
                PlayAnimation(aniDef.Animations.ground_fengdu_reduced_ccbi, 0);
                g_ballSpeed += g_ReducedParam;
                return RET_REDUCE;
            } else {
                PlayAnimation(aniDef.Animations.ground_fengdu_success_ccbi, 0);
                return RET_SUCCESS;
            }
            break;
        }

        case 4: //空中封堵vs传球
        {
            var v = Rand() % 1000 + (o1.passSkill + o1.airSkill) - (o2.defenceSkill + o2.airSkill) + g_OrderParam_19 + g_ballSpeed;
            if (v >= g_WinParam_2) {
                PlayAnimation(aniDef.Animations.air_fengdu_failed_ccbi, 0);
                return RET_FAIL;
            } else if (v >= g_RandomParam_2) {
                PlayAnimation(aniDef.Animations.air_fengdu_randomball_ccbi, 0);
                return RET_RANDOM_BALL;
            } else if (v >= g_ReducedParam_2) {
                PlayAnimation(aniDef.Animations.air_fengdu_reduced_ccbi, 0);
                g_ballSpeed += g_ReducedParam;
                return RET_REDUCE;
            } else {
                PlayAnimation(aniDef.Animations.air_fengdu_success_ccbi, 0);
                return RET_SUCCESS;
            }
            break;
        }

        case 5: //空中封堵vs射门
        {
            var v = Rand() % 1000 + (o1.shootSkill + o1.airSkill) - (o2.defenceSkill + o2.airSkill) + g_OrderParam_23 + g_ballSpeed;
            if (v >= g_WinParam_2) {
                PlayAnimation(aniDef.Animations.air_fengdu_failed_ccbi, 0);
                return RET_FAIL;
            } else if (v >= g_RandomParam_2) {
                PlayAnimation(aniDef.Animations.air_fengdu_randomball_ccbi, 0);
                return RET_RANDOM_BALL;
            } else if (v >= g_ReducedParam_2) {
                PlayAnimation(aniDef.Animations.air_fengdu_reduced_ccbi, 0);
                g_ballSpeed += g_ReducedParam;
                return RET_REDUCE;
            } else {
                PlayAnimation(aniDef.Animations.air_fengdu_success_ccbi, 0);
                return RET_SUCCESS;
            }
            break;
        }

        case 6: //空中封堵vs停球
        {
            var v = Rand() % 1000 + (o1.dribbleSkill + o1.airSkill) - (o2.defenceSkill + o2.airSkill) + g_OrderParam_15;
            if (v >= g_WinParam_1) {
                PlayAnimation(aniDef.Animations.air_fengdu_failed_ccbi, 0);
                return RET_FAIL;
            } else if (v >= g_RandomParam_1) {
                PlayAnimation(aniDef.Animations.air_fengdu_randomball_ccbi, 0);
                return RET_RANDOM_BALL;
            } else {
                PlayAnimation(aniDef.Animations.air_fengdu_success_ccbi, 0);
                return RET_SUCCESS;
            }
            break;
        }
    }
}

//开始射门

function StartShootBall(o1, isLong) {
    g_Animations = [];

    if (g_isLongBall) {
        PlayAnimation(aniDef.Animations.air_shemen_ccbi, 0);
        g_ballSpeed = 0;
        g_type = 5;
    } else {
        PlayAnimation(aniDef.Animations.ground_shemen_ccbi, 0);
        g_ballSpeed = 0;
        g_type = 1;
    }
    return;
}

//门将接球，o1=射门球员；o2=门将

function CatchBallGP(o1, o2) {
    switch (g_type) {
        case 1: //地面射门vs接球
        {
            var v = Rand() % 1000 + (o1.shootSkill + o1.groundSkill) - (o2.defenceSkill + o2.groundSkill) + g_OrderParam_29 + g_ballSpeed;
            Log('V: ' + v);
            v = 900;
            if (v >= g_WinParam_1) {
                PlayAnimation(aniDef.Animations.keeper_woqiu_failed_ccbi, 0);
                return RET_FAIL;
            }
            if (v >= g_RandomParam_1) {
                PlayAnimation(aniDef.Animations.keeper_woqiu_randomball_ccbi, 0);
                return RET_RANDOM_BALL;
            } else {
                PlayAnimation(aniDef.Animations.keeper_woqiu_success_ccbi, 0);
                return RET_SUCCESS;
            }
            break;
        }

        case 5: //空中射门vs接球
        {
            var v = Rand() % 1000 + (o1.shootSkill + o1.airSkill) - (o2.defenceSkill + o2.airSkill) + g_OrderParam_29 + g_ballSpeed;
            if (v >= g_WinParam_1) {
                PlayAnimation(aniDef.Animations.keeper_woqiu_failed_ccbi, 0);
                return RET_FAIL;
            }
            if (v >= g_RandomParam_1) {
                PlayAnimation(aniDef.Animations.keeper_woqiu_randomball_ccbi, 0);
                return RET_RANDOM_BALL;
            } else {
                PlayAnimation(aniDef.Animations.keeper_woqiu_success_ccbi, 0);
                return RET_SUCCESS;
            }
            break;
        }
    }
}

//门将击球，o1=射门球员；o2=门将

function HitBallGP(o1, o2) {
    switch (g_type) {
        case 1: //地面射门vs击球
        {
            var v = Rand() % 1000 + (o1.shootSkill + o1.groundSkill) - (o2.defenceSkill + o2.groundSkill) + g_OrderParam_30 + g_ballSpeed;
            if (v >= g_WinParam_1) {
                PlayAnimation(aniDef.Animations.keeper_jiqiu_failed_ccbi, 0);
                return RET_FAIL;
            }
            if (v >= g_RandomParam_1) {
                PlayAnimation(aniDef.Animations.keeper_jiqiu_randomball_ccbi, 0);
                return RET_RANDOM_BALL;
            } else {
                PlayAnimation(aniDef.Animations.keeper_jiqiu_success_ccbi, 0);
                return RET_RANDOM_BALL;
            }
            break;
        }

        case 5: //空中射门vs击球
        {
            var v = Rand() % 1000 + (o1.shootSkill + o1.airSkill) - (o2.defenceSkill + o2.airSkill) + g_OrderParam_30 + g_ballSpeed;
            if (v >= g_WinParam_1) {
                PlayAnimation(aniDef.Animations.keeper_jiqiu_failed_ccbi, 0);
                return RET_FAIL;
            }
            if (v >= g_RandomParam_1) {
                PlayAnimation(aniDef.Animations.keeper_jiqiu_randomball_ccbi, 0);
                return RET_RANDOM_BALL;
            } else {
                PlayAnimation(aniDef.Animations.keeper_jiqiu_success_ccbi, 0);
                return RET_RANDOM_BALL;
            }
            break;
        }
    }
}



function Goal() {
    PlayAnimation(aniDef.Animations.ball_goal_ccbi, 0);
}

// AUTO_GEN_CODE_END

module.exports = {
    CLEAR_ANIMATIONS : function() {
        g_Animations = [];
    },
    GET_ANIMATIONS : function() {
        return g_Animations;
    },

    MENU_FUNCS: [
        StartPassBall,          // 0
        StartDribble,              // 1
        StartOneTwo,              // 2
        StartShootBall,         // 3
        TackleBall,             // 4
        InterceptBall,          // 5
        BlockBall,              // 6
        HitBallGP,              // 7
        undefined,              // 8
        undefined,              // 9
        undefined,              // 10
        CatchBallGP,              // 11
        undefined,              // 12
        undefined               // 13
    ],

    ReceiveBall:ReceiveBall,
    OneTwoPassBack:OneTwoPassBack,
    Goal:Goal,

    MENU_ITEM: {
        Pass: 0,
        Dribble: 1,
        OneTwo: 2,
        Shoot: 3,
        Tackle: 4,
        Intercept: 5,
        Block: 6,
        Hit: 7,
        Attack: 8,
        Wait: 9,
        Clear: 10,
        Catch: 11,
        BlockDribble: 12,
        BlockShoot: 13,
        None: 14
    },

    MENU_ITEM_RETURN_CODE: {
        RET_FAIL: RET_FAIL,
        RET_SUCCESS: RET_SUCCESS,
        RET_REDUCE: RET_REDUCE,
        RET_RANDOM_BALL: RET_RANDOM_BALL
    }

}