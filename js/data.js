/**
 * 用于存放基础的数据信息
 *
 */


/**
 * 鼠标的位置
 */

var mymouseX = 0;
var mymouseY = 0;


/**
 * 时钟周期
 */
var T = 100;	//多久画一次
var allT = 0;	//每到一次时钟周期，记一次数

var turnover = 0; //判断回合是否结束
var cangetCard = 1; //判断是否可以抽卡

/**
 * 人物的属性
 */
var heroHP = 30;
var yourMaxCrystal = 9;		//你的最大法力水晶
var yourNowCrystal = 9; 	//你现在的法力水晶


var computerHP = 30;
var computerMaxCrystal = 5;//电脑的最大法力水晶
var computerNowCrystal = 5;//电脑的现在法力水晶
var computerCardNum = 3;   //电脑的手牌数
/**
 * 所有卡片的属性
 */
var cardWidth = 80;
var cardHeight = 120;

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
    {name: "工程师学徒", cost: 2, attack: 1, HP: 1, font: "当这张卡被召唤时，可以抽一张卡", point: POINTNO, img: "img/card_img/工程师学徒.png"},
    {name: "潜水鳄", cost: 2, attack: 2, HP: 3, font: "水生怪物,喜欢吃臭鱼", point: POINTNO, img: "img/card_img/淡水鳄.png"},
    {name: "沼泽迅猛龙", cost: 2, attack: 3, HP: 2, font: "水生怪物,喜欢吃臭鱼", point: POINTNO, img: "img/card_img/沼泽迅猛龙.png"},
    {
        name: "岩浆暴怒者",
        cost: 3,
        attack: 5,
        HP: 1,
        font: "尽管现在每个人都能单刷熔火之心了，但他依然觉得自己很厉害。",
        point: POINTNO,
        img: "img/card_img/岩浆暴怒者.png"
    },
    {name: "冰风雪人", cost: 4, attack: 4, HP: 5, font: "一点也不怕冷", point: POINTNO, img: "img/card_img/冰风雪人.png"},
    {name: "石拳食人魔", cost: 6, attack: 6, HP: 7, font: "我非常厉害，绝对值这个价格", point: POINTNO, img: "img/card_img/石拳食人魔.png"},
    {
        name: "蓝腮战士",
        cost: 2,
        attack: 2,
        HP: 1,
        font: "冲锋:当它被召唤的场合，就可以发动攻击",
        point: POINTNO,
        run: 1,
        img: "img/card_img/蓝腮战士.png"
    },
    {
        name: "剃刀猎手",
        cost: 3,
        attack: 2,
        HP: 3,
        font: "当这张卡被召唤时，召唤一只(1,1)的野猪",
        point: POINTNO,
        img: "img/card_img/剃刀猎手.png"
    },

//				{name:"裂解魔杖",attack:'法术',HP:' ',cost:3,font:"沉默并破坏对方所有随从",point:POINTNO},
//				{name:"魔爆术",attack:'法术',HP:' ',cost:2,font:"使对方的所有随从受到1点法术伤害",point:POINTNO},
//
    {name: "扭曲虚空", attack: '法术', HP: ' ', cost: 8, font: "破坏全场的随从", point: POINTNO, img: "img/card_img/扭曲虚空.png"},
    {
        name: "火球术",
        attack: '法术',
        HP: ' ',
        cost: 4,
        font: "选择一个目标，对其造成6点伤害",
        point: POINTALL,
        img: "img/card_img/火球术.png"
    },
    {
        name: "变形术",
        attack: '法术',
        HP: ' ',
        cost: 4,
        font: "选择一个随从，把其变成一个羊(1,1)",
        point: POINTALLSERVANTS,
        img: "img/card_img/变形术.png"
    },
//				{name:"刺杀",attack:'法术',HP:' ',cost:5,font:"选择一个随从,该随从破坏",point:POINTALLSERVANTS,img:"img/card_img/刺杀.png"},
    {
        name: "真言盾",
        attack: '法术',
        HP: ' ',
        cost: 1,
        font: "选择一个随从,使其获得+2生命值,并且我方可以再抽一张牌",
        point: POINTALLSERVANTS,
        img: "img/card_img/真言术.png",
        music:'music/真言术盾.ogg'
    },

    //				{name:"森金持盾卫士",cost:4,attack:3,HP:5,font:"如果你喜欢巨魔和沙尘的话，森金村还是个不错的地方。",point:POINTNO},
//				{name:"红龙",cost:9,attack:8,HP:8,font:"选择一个英雄，让他的生命值变成15血",point:POINTALLHERO},
];

var mycard = [
    //	{name:"潜水鳄",cost:1,attack:2,HP:3,font:"水生怪物,喜欢吃臭鱼",posx:100+0*(cardWidth+10),posy:450,posi:1,sleeping:1},
    //	{name:"雪山巨人",cost:2,attack:4,HP:5,font:"一点也不怕冷",posx:100+1*(cardWidth+10),posy:450,posi:1,sleeping:1},
    //	{name:"红龙",cost:9,attack:8,HP:8,font:"危险的恐怖生物",posx:100+2*(cardWidth+10),posy:450,posi:3,sleeping:1},
];
/*
 * 电脑的卡牌
 */
var computercard = [];
