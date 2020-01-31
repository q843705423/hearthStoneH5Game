/**
 * 用于存放基础的数据信息
 */


/**
 * 全局属性
 * @type {{mouse: {x: number, y: number}, T: number}}
 * @summary {{mouse: {x: 鼠标横坐标(左往右递增), y: 鼠标纵坐标(上往下递增)}, T: 单位时间个数}}
 */
var global = {
    T: 0,
    mouse: {
        x: 0,
        y: 0,
    },
};

var turnover = 0; //判断回合是否结束
var cangetCard = 1; //判断是否可以抽卡

/**
 * 玩家信息
 * @type {{maxHP: number, HP: number, maxCrystal: number, nowCrystal: number}}
 * @summary {{maxHP: 最大血量, HP: 当前血量, maxCrystal: 最大水晶, nowCrystal: 当前水晶}}
 */
user = {
    HP: 30,
    maxHP: 30,
    maxCrystal: 9,
    nowCrystal: 9,
    card: [],
    other: null,
    posx:400,//物理横坐标
    posy:450,//物理纵坐标
}


/**
 * 电脑信息
 * @type {{maxHP: number,cardNum: number, HP: number, maxCrystal: number, nowCrystal: number}}
 * @summary {{maxHP: 最大血量, cardNum: 手牌数,HP: 当前血量, maxCrystal: 最大水晶, nowCrystal: 当前水晶}}
 */
computer = {
    HP: 30,
    maxHP: 30,
    maxCrystal: 5,
    nowCrystal: 5,
    cardNum: 3,
    card: [],
    other: null,
    posx:400,//物理横坐标
    posy:100,//物理纵坐标
};
user.other = computer;
computer.other = user;
/**
 * 常量信息
 */
constant = {
    card: {
        width: 80,
        height: 120,
        TYPE: {
            SERVANTS: 1,//随从
            MAGIC: 2,//法术
        },
        POSITION: {
            HAND_CARDS: 1,//手牌
            ON_THE_FIELD: 2,//场上
            CEMETERY: 3,//墓地
        }
    },

    POINT: {
        NO: 0,
        MY_HERO: 1,
        MY_SERVANTS: 2,
        MY_ALL: 3,
        HIS_SERVANTS: 4,
        MY_HERO_AND_HIS_SERVANTS: 5,
        ALL_SERVANTS: 6,
        MY_ALL_AND_HIS_SERVANTS: 7,
        HIS_HERO: 8,
        ALL_HERO: 9,
        MY_SERVANTS_AND_HIS_HERO: 10,
        MY_ALL_AND_HIS_HERO: 11,
        HIS_ALL: 12,
        HIS_ALL_AND_MY_HERO: 13,
        HIS_ALL_AND_MY_SERVANTS: 14,
        ALL: 15,
    }

};
/*
是否可以指我方英雄 是否可以指我方随从 是否可以指敌方随从 是否可以指敌方英雄      value
     0                   0                  0                  0                  0
     1                   0                  0                  0                  1
     0                   1                  0                  0                  2
     1                   1                  0                  0                  3
     0                   0                  1                  0                  4
     1                   0                  1                  0                  5
     0                   1                  1                  0                  6
     1                   1                  1                  0                  7
     0                   0                  0                  1                  8
     1                   0                  0                  1                  9
     0                   1                  0                  1                  10
     1                   1                  0                  1                  11
     0                   0                  1                  1                  12
     1                   0                  1                  1                  13
     0                   1                  1                  1                  14
     1                   1                  1                  1                  15
*/
var str = "";

var info = "";//在场上显示的信息
var infoLastTime = 0;//显示的时间
var POINTNO = 0;//不能指向
var POINTALL = 1; //可以指向所有
var POINTALLHERO = 2;//可以指向所有英雄
var POINTALLSERVANTS = 9;//可以指向所有随从
var POINTMYSELF = 3; //可以指向我方随从或英雄
var POINTITSELF = 4; //可以指向对方随从或英雄
var POINTMYHERO = 5;//可以指向我方英雄
var POINTITHERO = 6;//可以指向敌方英雄
var POINTMYSERVANTS = 7;//可以指向我方随从
var POINTITSERVANTS = 8;//可以指向对方随从
/**
 * point 表示不能指向
 */
var card = [
    {
        name: "工程师学徒",
        cost: 2,
        attack: 1,
        HP: 1,
        point: POINTNO,
        img: "img/card_img/工程师学徒.png",
        type: constant.card.TYPE.SERVANTS,
    },
    {
        name: "潜水鳄",
        cost: 2,
        attack: 2,
        HP: 3,
        point: POINTNO,
        img: "img/card_img/淡水鳄.png",
        type: constant.card.TYPE.SERVANTS,
    },
    {
        name: "沼泽迅猛龙",
        cost: 2,
        attack: 3,
        HP: 2,
        point: POINTNO,
        img: "img/card_img/沼泽迅猛龙.png",
        type: constant.card.TYPE.SERVANTS,
    },
    {
        name: "岩浆暴怒者",
        cost: 3,
        attack: 5,
        HP: 1,
        point: POINTNO,
        img: "img/card_img/岩浆暴怒者.png",
        type: constant.card.TYPE.SERVANTS,
    },
    {
        name: "冰风雪人",
        cost: 4,
        attack: 4,
        HP: 5,
        font: "一点也不怕冷",
        point: POINTNO,
        img: "img/card_img/冰风雪人.png",
        type: constant.card.TYPE.SERVANTS,
    },
    {
        name: "石拳食人魔",
        cost: 6, attack: 6,
        HP: 7,
        point: POINTNO,
        img: "img/card_img/石拳食人魔.png",
        type: constant.card.TYPE.SERVANTS,
    },
    {
        name: "蓝腮战士",
        cost: 2,
        attack: 2,
        HP: 1,
        point: POINTNO,
        run: 1,
        img: "img/card_img/蓝腮战士.png",
        type: constant.card.TYPE.SERVANTS,
    },
    {
        name: "剃刀猎手",
        cost: 3,
        attack: 2,
        HP: 3,
        point: POINTNO,
        img: "img/card_img/剃刀猎手.png",
        type: constant.card.TYPE.SERVANTS,
    },

//				{name:"裂解魔杖",attack:'法术',HP:' ',cost:3,font:"沉默并破坏对方所有随从",point:POINTNO},
//				{name:"魔爆术",attack:'法术',HP:' ',cost:2,font:"使对方的所有随从受到1点法术伤害",point:POINTNO},
//
    {
        name: "扭曲虚空",
        attack: '法术',
        cost: 8,
        img: "img/card_img/扭曲虚空.png",
        point: POINTNO,
        type: constant.card.TYPE.MAGIC,
        play: function (who) {
            for (let i = 0; i < who.card.length; i++) {
                //如果在场上
                if (who.card[i].posi === constant.card.POSITION.ON_THE_FIELD) {
                    //移到墓地里去
                    who.card[i].posi = constant.card.POSITION.CEMETERY;
                }
            }
            for (let i = 0; i < who.other.card.length; i++) {
                if (who.other.card[i].posi === constant.card.POSITION.ON_THE_FIELD) {
                    //移到墓地里去
                    who.other.card[i].posi = constant.card.POSITION.CEMETERY;
                }
            }
            tx.push({
                fun: blackTX,
                beginT: global.T,//特效开始单位时间
                lastT: 15,//持续15个单位
            })

        }
    },
    {
        name: "火球术",
        attack: '法术',
        cost: 4,
        font: "选择一个目标，对其造成6点伤害",
        img: "img/card_img/火球术.png",
        point: constant.POINT.ALL,
        type: constant.card.TYPE.MAGIC,
        play: function (obj, who) {
            obj.HP -= 6
            tx.push({//特效数组新增火焰特效
                fun:fireTX,
                beginT: global.T,
                lastT: 15,
                beginPosX:who.posx,
                beginPosY:who.posy,
                endPosX:obj.posx,
                endPosY:obj.posy,
            })
        }
    },
    {
        name: "变形术",
        attack: '法术',
        cost: 4,
        font: "选择一个随从，把其变成一个羊(1,1)",
        img: "img/card_img/变形术.png",
        point: POINTALLSERVANTS,
        type: constant.card.TYPE.MAGIC,
    },
//				{name:"刺杀",attack:'法术',HP:' ',cost:5,font:"选择一个随从,该随从破坏",point:POINTALLSERVANTS,img:"img/card_img/刺杀.png"},
    {
        name: "真言盾",
        attack: '法术',
        cost: 1,
        img: "img/card_img/真言术.png",
        music: 'music/真言术盾.ogg',
        point: constant.POINT.ALL_SERVANTS,
        type: constant.card.TYPE.MAGIC,
        play: function (obj) {
            obj.maxHP += 2;
            obj.HP += 2;
            cangetCard = 1;//抽卡
            playMusic("music/真言术盾.ogg")

        },
    },
    //				{name:"森金持盾卫士",cost:4,attack:3,HP:5,font:"如果你喜欢巨魔和沙尘的话，森金村还是个不错的地方。",point:POINTNO},
    /*
        {
            name: "红龙",
            cost: 9,
            attack: 8,
            HP: 8,
            font: "选择一个英雄，让他的生命值变成15血",
            point: POINTALLHERO
        },
    */

];


