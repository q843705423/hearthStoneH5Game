//声明一个卡牌对象,可以置于我方或者对方的牌里的
function cardObj(name, cost, attack, HP, font, posx, posy, posi, sleeping) {
    this.name = name;
    this.cost = cost;
    this.attack = attack;
    this.HP = HP;
    this.font = font;
    this.posx = posx;
    this.posy = posy;
    this.posi = posi;
    this.sleeping = sleeping;
    return this;
}

/**
 * 通用的方法，根据post 计算 电脑的posx 和posy
 * @param {Object} post
 */
function calcomputerChangPosX(post) {
    return post * (constant.card.width + 3) + 90;
}

function calcomputerChangPosY(post) {
    return 160;
}

function calMyChangPosX(post) {
    return post * (constant.card.width + 3) + 90;
}

function calMyChangPosY(post) {
    return 280;
}

function calMyHandPosX(post) {
    return post * (constant.card.width + 3);
}

function calMyHandPosY(post) {
    return 500;
}

/**
 *我方拥有卡片
 * 其中posx 表示卡片的位置,形式为100+i*(constant.card.width+10)
 * posy 为450  两个是物理位置
 * posi 逻辑位置  1.表示手上   2.表示在场上,3表示在墓地
 *
 */

function getCardIdxByName(name) {
    for (let i = 0; i < card.length; i++) {
        if (card[i].name === name) {
            return i;
        }
    }
    return -1;

}

/**
 * 指定索引，从所有牌库中生成一张卡片
 * @param index
 * @param posx
 * @param posy
 * @param post
 * @returns {{posx: *, posy: *, posi: number, cost: number, post: *, attack: (number|string), name: (string), HP: number, type: *, sleeping: number, point: number, font: (string)}}
 */
function getNonRandomCardAcquisition(index, posx, posy, post) {
    let obj = card[index]
    return {
        name: obj.name,
        cost: obj.cost,
        attack: obj.attack,
        HP: obj.HP,
        font: obj.font,
        posx: posx,//卡牌物理横坐标
        posy: posy,//卡牌物理纵坐标
        post: post,//卡牌在场上的逻辑横坐标
        posi: 1,
        sleeping: 1,
        point: obj.point,
        type: obj.type,
        img: obj.img,
        play: obj.play,
    };

}

/**
 * 随机生成卡片
 * @param posx
 * @param posy
 * @param post
 * @returns {{posx: *, posy: *, posi: number, cost: number, post: *, attack: (number|string), name: string, HP: number, type: *, sleeping: number, point: number, font: string}}
 */
function getCard(posx = 50 + 100 * i, posy = 450, post = -1) {
    let ran = Math.floor(Math.random() * card.length);
    return getNonRandomCardAcquisition(ran, posx, posy, post);
}

/**
 * 给我和电脑进行初始化的方法
 */

function myinit() {
    let index = getCardIdxByName("火球术");
    for (var i = 0; i < 3; i++) {
        var ran = Math.floor(Math.random() * card.length);
        if (i === 0) {
            ran = index;
        }
        var obj = card[ran];

        let nonRandomCardAcquisition = getNonRandomCardAcquisition(ran, (constant.card.width + 3) * (i), calMyHandPosY(), i);
        user.card.push(nonRandomCardAcquisition);
    }
    //给电脑
    for (var i = 0; i < 3; i++) {
        var ran = Math.floor(Math.random() * card.length);
        var obj = card[ran];
        computer.card.push(
            {
                img: obj.img,
                name: obj.name,
                cost: obj.cost,
                attack: obj.attack,
                HP: obj.HP,
                font: obj.font,
                posx: 150,
                posy: 150,
                posi: 1,
                sleeping: 1,
                point: obj.point,
                run: obj.run,
                music: obj.music
            });
        //cardObj()
    }
}

/**
 *
 * 游戏结束的判定
 */
function gameisover() {
    if (user.HP <= 0) {
        user.HP = 0;
        window.location.href = "index.html";
    }
    if (computer.HP <= 0) {
        computer.HP = 0;
        window.location.href = "index.html";
    }

}

/**
 * 画电脑的头像
 */
var computerHeadx = 360;
var computerHeady = 40;

function drawComputer() {
    var mycan = document.getElementById("mycan");
    var cxt = mycan.getContext("2d");
    cxt.save();
    cxt.beginPath();

    cxt.stroke();
    cxt.restore();
    cxt.closePath();

}

//画电脑有多少张牌
function drawComputerCardBack() {
    var cnt = 0;
    for (let i = 0; i < computer.card.length; i++) {
        if (computer.card[i].posi == 1) {
            cnt++;
        }

    }
//		console.log("cnt="+cnt);
    for (let i = 0; i < cnt; i++) {
        drawImg("img/黄金挑战.png", 15 * i + 300, -20, 45, 60);
    }
}


//所有要移动的信息都写在这里
var moveArray = [
    //	{idx:0,beginT:1,last:39,beginposx:100,beginposy:450,endposx:100,endposy:200},

];

function moveCardAll() {

    for (var i = 0; i < moveArray.length; i++) {
        var obj = moveArray[i];

        var flag = moveCard(obj.idx, obj.beginT, obj.last, obj.beginposx, obj.beginposy, obj.endposx, obj.endposy);


    }

}

/**
 * 移动卡片的特效，就是抽卡时候的特效
 * @param {int}    该卡在玩家手中的索引
 * @param {Object} ·刚刚开始的时钟周期
 * @param {Object}    结束的时钟周期
 * @param {Object}    开始的位置x
 * @param {Object}    开始的位置y
 * @param {Object}    结束的位置x
 * @param {Object}    结束的位置y
 */
function moveCard(idx, beginT, last, beginposx, beginposy, endposx, endposy) {

    if (global.T >= beginT + last) {
        return 0;

    }

    var dx = (endposx - beginposx) / last;
    var dy = (endposy - beginposy) / last;

    user.card[idx].posx += dx;
    user.card[idx].posy += dy;
    return 1;

}

function showHP(context) {
    context.save();
    context.beginPath();
    context.fillStyle = "red";
    context.arc(438, 144, 15, 0, 2 * Math.PI, true);
    context.fill();
    context.fillStyle = "white";
    context.fillText(computer.HP, 434, 148);
    context.restore();
    context.closePath();
    context.save();
    context.beginPath();
    context.fillStyle = "red";
    context.arc(440, 500, 15, 0, 2 * Math.PI, true);
    context.fill();
    context.fillStyle = "white";

    context.fillText(user.HP, 435, 504);
    context.restore();
    context.closePath();

}

/**
 * 画基础设施,即静物TODO
 */
var ok = 1;

function drawBase() {
    var mycan = document.getElementById("mycan");
    var context = mycan.getContext("2d");

    var img = new Image();
    img.src = "img/bg9.png";

    img.onload = function () {
        context.clearRect(0, 0, 800, 600);
        drawBackground(context);
        drawButton(context);
        drawComputerCardBack(context);

        showHP(context);


        tuo();
        drawCrystal(context);
        ourGetCard();
        show();
        drawMagicLine(context);
        moveCardAll();
        computerOp(context);
        drawComputerCard(context);
        if (turnover === 1) {
            drawMycard(context);
            drawComputer();

        } else {
            drawComputer();
            drawMycard(context);

        }
        privatemyshow(info);
        drawDetailedDescription(context);
        global.T += 1;
        gameisover();
        drawTX();

    }


}

/**
 * 画法力水晶
 */
function drawCrystal(context) {
    computer.cardNum = 0;
    for (let i = 0; i < computer.card.length; i++) {
        computer.cardNum += computer.card[i].posi === 1 ? 1 : 0;
    }
    context.save();
    context.beginPath();
    context.fillStyle = "blue";
    context.rect(523, 20, 45, 30);
    context.fillStyle = "white";
    context.fillText(+computer.nowCrystal + "/" + computer.maxCrystal, 540, 42);
    context.closePath();
    //画您的最大个法力水晶 灰底
    for (let i = 0; i < user.maxCrystal; i++) {
        context.beginPath();

        context.fillStyle = "#ccc";
        context.arc(600 + i * 18, 555, 8, 0, 2 * Math.PI, true);

        context.fill();

        context.closePath();

    }

    for (let i = 0; i < user.nowCrystal; i++) {	//画您拥有的法力水晶 蓝色
        context.beginPath();

        context.arc(600 + i * 18, 555, 8, 0, 2 * Math.PI, true);
        context.fillStyle = "#6666CC";
        context.fill();
        context.closePath();

    }
    context.beginPath();
    context.save();
    context.fillStyle = "blue";
    context.rect(540, 545, 50, 20);
//				cxt.fill();
    context.fillStyle = "white";
    context.fillText(user.nowCrystal + "/" + user.maxCrystal, 555, 560);
    context.restore();
    context.closePath();
    context.restore();
}

/**
 * 画对方场上的卡片
 */
function drawComputerCard(context) {

    for (var i = 0; i < computer.card.length; i++) {
        if (computer.card[i].posi !== 2) {
            continue;
        }
        drawOneCard(context, computer.card[i], computer.card[i].posx, computer.card[i].posy);

    }


}


/**
 * 画我方拥有的卡片
 */
function drawMycard(context) {
    for (let i = 0; i < user.card.length; i++) {
        if (user.card[i].posi === 1) {			//说明该卡在手牌

            drawOneCard(context, user.card[i], user.card[i].posx, user.card[i].posy);

        } else if (user.card[i].posi === 2) {	//说明该牌在场上

            drawOneCard(context, user.card[i], user.card[i].posx, user.card[i].posy);

        } else {							//说明该牌在墓地


        }

    }

}

/**
 * 封装一个方法，用于画一个图片
 */

/**
 * 计算手上还有哪个位置可以放卡
 *
 */
function handWhereCanPut() {
//TODO
    /*
                    for(var i=0;i<7;i++){	//扫描手上7个位置
                        var canput = 1;

                        for(var j=0;j<user.card.length;j++){//看自己手上的牌是否在该位置

                            if(user.card[j].posi!=1)continue;//如果不在手上就算了
                            if(pointinrec(50+i*100,450,user.card[j].posx,user.card[j].posy)==0){		//不可放

                                canput = 0;
                                break;
                            }
                        }
                        if(canput==1)return i;

                    }
                    */
    var w = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < user.card.length; i++) {
        if (user.card[i].posi !== 1) continue;
        w[user.card[i].post] = 1;

    }
    for (var i = 0; i < w.length; i++) {
        if (w[i] === 0) return i;
    }

    return -1;
}

/**
 * 判断一个点(px,py)是否在矩形里
 * @param {Object} px
 * @param {Object} py
 * @param {Object} x1
 * @param {Object} y1
 * @param {Object} x2
 * @param {Object} y2
 */
function pointinrec(px, py, beginx, beginy) {	//返回0表示在里面

    if (px < beginx) return 10;
    if (py < beginy) return 20;
    if (px > beginx + constant.card.width) return 30;
    if (py > beginy + constant.card.height) return 40;
    return 0;
}

/**
 * 通用的给该卡的obj,以及起始位置，画出该卡的函数
 * @param {Object} 被画的卡片对象
 * @param {Object} 被画的起始位置x坐标
 * @param {Object} 被画的起始位置y坐标
 */
function drawOneCard(context, obj, beginx, beginy) {
    context.save();
    context.beginPath();
//				cxt.fillStyle = "white";


//				cxt.rect(beginx,beginy,constant.card.width,constant.card.height);
    context.stroke();

    context.fillStyle = "green";
    context.fillText(obj.name, obj.posx, obj.posy + 20);


    context.fillStyle = "black";
    context.fillText(obj.attack, obj.posx + 2, obj.posy + 110);

    context.fillStyle = "blue";
    context.fillText(obj.cost, obj.posx + 60, obj.posy + 20);
    if (obj.posi === 2 && obj.sleeping === 1) {
        context.fillStyle = "plum";
        context.fillText("正在休息", obj.posx + 20, obj.posy + 60);
    }
    drawImg(obj.img, beginx, beginy, constant.card.width, constant.card.height);

    if (obj.posi === 2) {
        context.fillStyle = "red";
        context.arc(obj.posx + 70, obj.posy + 110, 10, 0, Math.PI * 2, true);
        context.fill();
        context.fillStyle = "white";
        context.fillText(obj.HP, obj.posx + 65, obj.posy + 115);
        if (obj.posi === 2 && obj.sleeping === 1) {
            context.fillStyle = "deepskyblue";
            var basegp = 40;
            var gp = basegp + obj.attack + obj.HP;
            if (global.T % gp >= gp / 4) {
                context.fillText("z", obj.posx + 70, obj.posy);
            }
            if (global.T % gp >= gp * 2 / 4) {
                context.fillText("z", obj.posx + 75, obj.posy - 9);
            }
            if (global.T % gp >= gp * 3 / 4) {

                context.fillText("z", obj.posx + 80, obj.posy - 18);
            }


        }
    }


    context.closePath();

    context.restore();


}


/**
 * 我方抽卡
 */
var cangetCrystal = 1;
var timerForMove = -1;

function ourGetCard() {
    if (turnover === 1) {
        return; //还没到我方回合
    }
    var putpos = handWhereCanPut();

    if (cangetCrystal > 0) {
        user.maxCrystal += user.maxCrystal < 10 ? 1 : 0;
        user.nowCrystal = user.maxCrystal;
        cangetCrystal--;
    }

    if (cangetCard === 0) return;

    cangetCard--;
    console.log(cangetCard)

    if (putpos === -1) {//手牌已经满了
        myshowinfoParam("我的手牌已经满了", 10);


    }

    if (putpos !== -1) {


        for (let i = 0; i < 1; i++) {

            let beginPosX = 700;
            let beginPosY = 350;
            //模拟卡片从卡组到手上的动画效果
            let newobj = getCard(beginPosX, beginPosY, putpos);
            pos = user.card.length;	//新得到的牌一定在最后面

            user.card.push(newobj);
            //		canInMyHand[putpos] = user.card.length-1;	//抽到手上，占个位置
            moveArray.push(
                {
                    idx: user.card.length - 1,
                    beginT: global.T, last: 25,
                    beginposx: beginPosX,
                    beginposy: beginPosY,
                    endposx: calMyHandPosX(putpos),
                    endposy: calMyHandPosY(putpos)
                }//TODO
            );


        }

    }


}

/**
 * 得到一个位置放下随从 ,得到的是 0-7 的一个数字 ，需要 100*i+50
 * @param {Object} whouse
 */
function getGoodPlaceToWar(whouse) {
    canput = -1;
    if (whouse === user.card) {
        for (var i = 0; i < 7; i++) {
            var flag = 1;
            for (let j = 0; j < user.card.length; j++) {
                if (user.card[j].posi !== 2) continue;
                if (pointinrec(50 + 100 * i, 350, user.card[j].posx, user.card[j].posy) === 0) {
                    flag = 0;
                    break;
                }

            }
            if (flag === 1) {
                canput = i;
                return canput;
            }

        }
        return -1;
    }
    if (whouse === computer.card) {
        var goodpos = -1;
        for (var j = 0; j < 7; j++) {//找合适的位置放下怪兽
            var flag = 1;
            for (var k = 0; k < computer.card.length; k++) {
                if (computer.card[k].posi !== 2) continue;
                //	myshowinfoParam((computer.card[k].posi==1)+","+pointinrec(j*100+50,150,computer.card[k].posx,computer.card[k].posy)+flag,30);
                if (pointinrec(j * 100 + 50, 150, computer.card[k].posx, computer.card[k].posy) === 0) {
                    flag = 0;
                    break;
                }

            }
            if (flag === 1) {

                goodpos = j;
                return goodpos;//返回goodpos以后，放置横坐标为 goodpos*100+50
            }

        }
        return -1;
    }
}


//电脑随便选择一方的一个随从,在场上的
function chooseIt(who) {
    var chang = [];
    for (var i = 0; i < who.length; i++) {
        if (who[i].posi === 2) {
            chang.push(i);
        }
    }
    var ran = Math.floor(chang.length * Math.random());
    return chang[ran];
}

/**
 * 电脑开始模拟人进行操作
 *
 */// 电脑进行操作


function computerOp(context) {
    if (turnover === 0) return; //还没到电脑回合,不往下执行
    if (global.T % 20 === 0) {   //每隔2秒时间进行一次操作
        var obj = computerCanDoing();

        if (obj.state === NOTHINGTODO) {	//如果电脑没事情做了，那么就回到玩家回合
            turnover = 0;
            cangetCrystal = 1;
            cangetCard = 1;
            for (var i = 0; i < computer.card.length; i++) {
                if (computer.card[i].choosed === 1) computer.card[i].choosed = 0;	//法术下个回合可以进行选择
                if (computer.card[i].posi === 2) {
                    computer.card[i].sleeping = 0;//让随从不再休息
                }
            }
            return;

        } else {

            doComputer(context, obj);
            return;
        }

    }

}

///////////////////////////////
/**
 * 针对对方英雄发生的事件
 */
function asForComputerHero(idx) {

    if (user.card[idx].name === "变形术") return -1;
    if (user.card[idx].name === "暗杀") return -1;
    if (user.card[idx].name === "火球术") {
        computer.HP -= 6;
        user.card[idx].posi = 3;
        user.nowCrystal -= user.card[idx].cost;
        tx.push(
            {
                funname: "fireTX",
                fun: fireTX,
                beginPosX: user.card[idx].posx,
                beginPosY: user.card[idx].posy,
                endPosX: computerHeadx + constant.card.width / 2,
                endPosY: computerHeady + constant.card.height / 2,
                beginT: global.T,
                lastT: 15
            }
        );
        return -100;
    }


    tx.push({
        funname: "attackTX",
        fun: attackTX, who: "user.card",
        myidx: idx,
        beginX: user.card[idx].posx,
        beginY: user.card[idx].posy,
        endX: computerHeadx,
        endY: computerHeady,
        beginT: global.T,
        lastT: 15
    });

    computer.HP -= user.card[idx].attack;


    user.card[idx].sleeping = 1;
    linexx = lineyy = -1;

    return -100;
}


/**
 * 展现信息给玩家看
 */
function privatemyshow(info) {
    var mycan = document.getElementById("mycan");
    var cxt = mycan.getContext("2d");
    cxt.beginPath();
    cxt.save();
    cxt.fillStyle = "white";

    cxt.font = "32px Arial";
    if (global.T < infoLastTime) cxt.fillText(info, 0, 65);
    cxt.restore();
    cxt.closePath();
}

function myshowinfoParam(inf, lasttime) {
    info = inf;
    infoLastTime = global.T + lasttime;

}

function drawImg(src, x, y, width, height) {
    var mycan = document.getElementById("mycan");
    var cxt = mycan.getContext("2d");
    var img = new Image();
    img.src = src;
    cxt.drawImage(img, x, y, width, height);

}

/*
 *
 * 画背景
 */
function drawBackground(context) {
    var img = new Image();
    img.src = "img/bg9.png";
    context.drawImage(img, 0, 0, 800, 600);
}

/**
 * 画三条线，把屏幕分成4个部分
 */
//			function drawThreeLine(){
//
//				var mycan = document.getElementById("mycan");
//				var cxt = mycan.getContext("2d");
//				cxt.beginPath();
//				cxt.moveTo(0,150);
//				cxt.lineTo(800,150);
//				cxt.stroke();
//				cxt.closePath();
//
//				cxt.beginPath();
//				cxt.moveTo(0,300);
//				cxt.lineTo(650,300);
//				cxt.stroke();
//				cxt.closePath();
//
//				cxt.beginPath();
//				cxt.moveTo(0,450);
//				cxt.lineTo(800,450);
//				cxt.stroke();
//				cxt.closePath();
//
//			}

/**
 * 画回合结束按钮
 */
function drawButton() {
    var mycan = document.getElementById("mycan");
    var cxt = mycan.getContext("2d");
    cxt.fontSize = 22;
    cxt.save();

    if (turnover === 0) {
        cxt.beginPath();
        cxt.rect(692, 250, 80, 40);
        cxt.fillStyle = "yellow";
//					cxt.fill();
        cxt.closePath();
        cxt.fillStyle = "black";
        cxt.fillText("回合结束", 710, 278);
    } else {
//					drawImg("img/endOver5.png",660,250,158,66);
        cxt.beginPath();
        cxt.rect(690, 250, 80, 40);
        cxt.fillStyle = "#cccccc";
//					cxt.fill();
        cxt.closePath();
        cxt.fillStyle = "white";
        cxt.fillText("对方回合", 710, 278);
        /*
         * 让场上的怪解除睡觉
         */
        for (var i = 0; i < user.card.length; i++) {
            if (user.card[i].posi === 2) {
                user.card[i].sleeping = 0;
            }
        }

    }
    cxt.restore();


}

/**
 * 判断你按下的点是否在以x,y为起始点,w,h为宽高的矩形里面
 */
function judgeRec(x, y, w, h) {
    if (global.mouse.y < y) return 0;
    if (global.mouse.y > y + h) return 0;
    if (global.mouse.x < x) return 0;
    if (global.mouse.x > x + w) return 0;
    return 1;
}

function myattack(cardidx, tar) {

    tx.push({
        funname: "attackTX",
        fun: attackTX, who: "user.card",
        myidx: cardidx,
        goal: tar,
        beginX: user.card[cardidx].posx,
        beginY: user.card[cardidx].posy,
        endX: computer.card[tar].posx,
        endY: computer.card[tar].posy,
        beginT: global.T, lastT: 15
    });
    user.card[cardidx].HP -= computer.card[tar].attack;
    computer.card[tar].HP -= user.card[cardidx].attack;
    user.card[cardidx].sleeping = 1;
//				if(user.card[cardidx].HP<=0)user.card[cardidx].posi=3;
//				if(computer.card[tar].HP<=0)computer.card[tar].posi=3;
    linexx = lineyy = -1;

}


var isfang = 1;	//鼠标是否按住
var cardidx = -1;
var tempx = -1;
var tempy = -1;
var itbegin = 0;//看下该卡的起始位置 1手牌 2场上 3墓地
var lineyy = -1;//法术画线的x和y
var linexx = -1;

/**
 * 法术画线
 *
 */
function drawMagicLine(context) {
    if (lineyy === -1) return;

    context.beginPath();
    context.moveTo(linexx, lineyy);
    context.lineTo(global.mouse.x, global.mouse.y);
    context.stroke();
    context.closePath();

    context.beginPath();
    context.moveTo(linexx - 5, lineyy - 5);
    context.lineTo(global.mouse.x - 5, global.mouse.y - 5);
    context.stroke();
    context.closePath();

}

/**
 * 画手牌上图的巨大描述
 * 如果鼠标停留在自己的一张手牌上，那么就显示该牌的详细描述在左上角
 */
var showtime = 10;

function drawDetailedDescription(context) {
    if (isfang === 0) return;
    var idx = -1;
    for (var i = 0; i < user.card.length; i++) {
        if (user.card[i].posi === 1 || user.card[i].posi === 2) {//在我方手牌或在场上
            if (judgeRec(user.card[i].posx, user.card[i].posy, constant.card.width, constant.card.height) === 1) {

                idx = i;

                break;

            }

        }


    }

    if (idx !== -1) {
        context.save();
        context.beginPath();
        drawImg(user.card[idx].img, global.mouse.x, global.mouse.y - 350, constant.card.width * 3, constant.card.height * 3);
        context.closePath();
        context.restore();
        return;

    }
    for (let i = 0; i < computer.card.length; i++) {
        if (computer.card[i].posi === 2) {//在对方场上
            if (judgeRec(computer.card[i].posx, computer.card[i].posy, constant.card.width, constant.card.height) === 1) {

                idx = i;

                break;

            }

        }


    }
    if (idx !== -1) {
        var mycan = document.getElementById("mycan");
        var cxt = mycan.getContext("2d");
        cxt.save();
        cxt.beginPath();

        drawImg(computer.card[idx].img, global.mouse.x, global.mouse.y, constant.card.width * 3, constant.card.height * 3);

        cxt.closePath();
        cxt.restore();

    }

}

/**
 * 拖动手牌中的卡片
 */

function tuo() {

    if (isfang === 0 && cardidx !== -1) {
        tempx = tempx === -1 ? user.card[cardidx].posx : tempx;
        tempy = tempy === -1 ? user.card[cardidx].posy : tempy;
        //		temp = user.card[cardidx];
        user.card[cardidx].posx = global.mouse.x - constant.card.width / 2;
        user.card[cardidx].posy = global.mouse.y - constant.card.height / 2;

    }
}

//开始发动手牌法术的效果
/**
 * @param whoAttack 谁发动的 0我 1他
 * @param idx 表示释放法术在我方手上的索引
 * @param goal 表示 法术释放的目标 ，可以是我方，也可以是对方
 * @param goalIdx 具体到目标的某一个单位
 */
function domagic(whoAttack, idx, goal, goalIdx) {

    if (whoAttack[idx].music) {
        playMusic(whoAttack[idx].music)
    }
    if (whoAttack[idx].name === '火球术') {
        tx.push(
            {
                funname: "fireTX",
                fun: fireTX,
                beginPosX: whoAttack[idx].posx,
                beginPosY: whoAttack[idx].posy,
                endPosX: goal[goalIdx].posx,
                endPosY: goal[goalIdx].posy,
                beginT: global.T,
                lastT: 15
            }
        );
        goal[goalIdx].HP -= 6;
        if (goal[goalIdx].HP <= 0) goal[goalIdx].posi = 3;

    } else if (whoAttack[idx].name === '刺杀') {
        tx.push({
            funname: "killTX",
            fun: killTX,
            posx: goal[goalIdx].posx,
            posy: goal[goalIdx].posy,
            beginT: global.T,
            lastT: 8
        });
        goal[goalIdx].posi = 3;
        whoAttack[idx].pos = 3;

    } else if (whoAttack[idx].name === '变形术') {

        goal[goalIdx].attack = 1;
        goal[goalIdx].HP = 1;
        goal[goalIdx].name = "绵羊";
        goal[goalIdx].cost = 1;
        goal[goalIdx].sleeping = 1;
        goal[goalIdx].font = "";
        goal[goalIdx].img = "img/card_img/绵羊.png";

    } else if (whoAttack[idx].name === "真言盾") {
        goal[goalIdx].HP += 2;
        cangetCard = 1;
    }
    whoAttack[idx].posi = 3;
    if (whoAttack === user.card) {
        user.nowCrystal -= whoAttack[idx].cost;
    } else {
        computer.nowCrystal -= whoAttack[idx].cost;
    }


}

/**
 * 发动无指向法术，或随从的效果
 * 谁发动了这张卡片
 * 这张卡片在那个人的索引
 */
function doNOPointFunction(whouse, cardidx) {
    if (whouse[cardidx].name === "扭曲虚空") {
        tx.push({funname: "blackTX", fun: blackTX, beginT: global.T, lastT: 15});
        for (let i = 0; i < user.card.length; i++) {
            if (user.card[i].posi === 2) {
                user.card[i].posi = 3;

            }
        }
        for (let i = 0; i < computer.card.length; i++) {
            if (computer.card[i].posi === 2) {
                computer.card[i].posi = 3;
            }

        }
        if (whouse === user.card) {
            user.nowCrystal -= whouse[cardidx].cost;
        } else if (whouse === computer.card) {
            computer.nowCrystal -= whouse[cardidx].cost;
        }
        whouse[cardidx].posi = 3;
    } else if (whouse[cardidx].name === "魔爆术") {

        if (whouse === user.card) {
            for (let i = 0; i < computer.card.length; i++) {
                if (computer.card[i].posi === 2) {
                    computer.card[i].HP -= 1;
                    if (computer.card[i].HP <= 0) computer.card[i].posi = 3;
                }
            }

        }
        if (whouse === computer.card) {
            for (let i = 0; i < user.card.length; i++) {
                if (user.card[i].posi === 2) {
                    user.card[i].HP -= 1;
                    if (user.card[i].HP <= 0) user.card[i].posi = 3;
                }
            }

        }
        if (whouse === user.card) {
            user.nowCrystal -= whouse[cardidx].cost;
        } else if (whouse === computer.card) {
            computer.nowCrystal -= whouse[cardidx].cost;
        }
        whouse[cardidx].posi = 3;
    } else if (whouse[cardidx].name === "裂解魔杖") {

        if (whouse === user.card) {
            for (let i = 0; i < computer.card.length; i++) {
                if (computer.card[i].posi === 2) {
                    computer.card[i].posi = 3;
                }
            }

        }
        if (whouse === computer.card) {
            for (let i = 0; i < user.card.length; i++) {
                if (user.card[i].posi === 2) {
                    user.card[i].posi = 3;
                }
            }

        }
        if (whouse === user.card) {
            user.nowCrystal -= whouse[cardidx].cost;
        } else if (whouse === computer.card) {
            computer.nowCrystal -= whouse[cardidx].cost;
        }
        whouse[cardidx].posi = 3;
    } else if (whouse[cardidx].name === "工程师学徒") {
        cangetCard = 1;

    } else if (whouse[cardidx].name === "剃刀猎手") {

        if (whouse === user.card) {
            let p = getChangPosFormyself();

            if (p !== -1) {
                whouse.push({
                    name: "野猪",
                    attack: 1,
                    HP: 1,
                    cost: 1,
                    posx: calMyChangPosX(p),
                    posy: calMyChangPosY(p),
                    posi: 2,
                    post: p,
                    sleeping: 1,
                    img: "img/card_img/野猪.png",
                    font: "剃刀猎手的好帮手"
                });
            }

        }
        if (whouse === computer.card) {
            var p = getChangPosForcomputer();
            if (p !== -1) {
                whouse.push({

                    name: "野猪",
                    attack: 1,
                    HP: 1,
                    cost: 1,
                    posx: calcomputerChangPosX(p),
                    posy: calcomputerChangPosY(p),
                    posi: 2,
                    post: p,
                    sleeping: 1,
                    font: "剃刀猎手的好帮手",
                    img: "img/card_img/野猪.png",
                });
            }

        }


    }
    if (whouse[cardidx].run === 1) {

        whouse[cardidx].sleeping = 0;

    }


}

function getChangPosForcomputer() {
    var ww = [0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < computer.card.length; i++) {
        if (computer.card[i].posi === 2) {
            ww[computer.card[i].post] = 1;

        }
    }
    for (var i = 0; i < ww.length; i++) {
        if (ww[i] === 0) return i;
    }
    return -1;
}

//我方从手牌召唤怪兽时候，挑选位置,返回0-6或-1
function getChangPosFormyself() {
    let ww = [0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < user.card.length; i++) {
        if (user.card[i].posi === 2) {
            ww[user.card[i].post] = 1;

        }
    }
    for (let i = 0; i < ww.length; i++) {
        if (ww[i] === 0) return i;
    }
    return -1;

}

/*
 * 场上7个位置的横坐标
 *
 */

var mygoal = -1;

/**
 * 获取指定的目标索引
 * @returns {number}
 * 如果是100 则为指定 我方英雄
 * 如果是-100 则为指定 敌方英雄
 * 如果是正数， 则为我方场上随从
 * 如果是负数， 则为敌方场上随从
 */
function getTheSpecifiedTargetIndex() {
    for (let i = 0; i < user.card.length; i++) {	//看是否指定我方场上 0为指定自己
        if (user.card[i].posi !== 2) continue;
        if (judgeRec(user.card[i].posx, user.card[i].posy, constant.card.width, constant.card.height)) {
            // mygoal = i;
            // domagic(user.card, cardidx, user.card, mygoal);
            // break;
            return {
                obj: user.card[i],
                type: constant.POINT.MY_SERVANTS
            };
        }

    }
    for (let i = 0; i < computer.card.length; i++) {	//看是否指定对方场上 1为指定对方
        if (computer.card[i].posi !== 2) continue;

        if (judgeRec(computer.card[i].posx, computer.card[i].posy, constant.card.width, constant.card.height)) {
            // mygoal = i;
            //		domagic(0,user.card[cardidx].name,"1",mygoal);
            // domagic(user.card, cardidx, computer.card, mygoal);
            // break;
            return {
                obj: computer.card[i],
                type: constant.POINT.HIS_SERVANTS,
            }
            // return computer.card[i];
        }

    }
    //		如果指定的是对方英雄
    if (judgeRec(computerHeadx, computerHeady, constant.card.width, constant.card.height)) {

        return {
            type:constant.POINT.HIS_HERO,
            obj:computer
        };

    }

}

$(document).ready(function () {

    myinit();
    /**
     * 让右键不要出菜单
     */
    $("#mycan").bind("contextmenu", function (e) {
        return false;
    });
    /**
     * 让右键消除选择线
     */
    $('#mycan').mousedown(function (e) {

        if (3 === e.which) {
            linexx = lineyy = -1;

        }
    });
    $("#mycan").click(function () {
        /**
         * 判断是否点击回合结束按钮
         */
        if (judgeRec(690, 250, 80, 40)) {
            cangetCrystal = 1;
            turnover = 1;
            cangetCard = 1;
            return;
        }

    });
    /**
     * 鼠标按下事件
     */

    $("#mycan").mousedown(function () {

        /**
         * 判断是否到自己回合
         */
        if (turnover === 1) {
            myshowinfoParam("现在还没到您的回合", 30);
            return;
        }
        /**
         * 看是否选中手中的牌
         */
        for (let i = 0; i < user.card.length; i++) {
            if (user.card[i].posi === 1) {				//看是否选中手中的卡
                //到moveArray数组里找这张卡 看这张卡是否正在移动，如果在移动，那么就不能选中,
                let canChoose = 1;
                for (let kk = 0; kk < moveArray.length; kk++) {
//										console.log("i="+i+" global.T="+global.T+" moveArray[kk].idx="+moveArray[kk].idx+" moveArray[kk].beginT="+moveArray[kk].beginT+" moveArray[kk].lastT="+moveArray[kk].lastT);
                    if (i === moveArray[kk].idx && global.T - moveArray[kk].beginT <= moveArray[kk].last) //TODO
                    {
                        canChoose = 0;

                    }
                }
                if (canChoose === 0) continue;

                if (user.card[i].point === POINTNO && judgeRec(user.card[i].posx, user.card[i].posy, constant.card.width, constant.card.height)) {//若不为指向性卡片


                    ////////////////////
                    itbegin = 1;
                    isfang = 0;
                    cardidx = i;


                } else if (user.card[i].point !== undefined && user.card[i].point !== POINTNO && judgeRec(user.card[i].posx, user.card[i].posy, constant.card.width, constant.card.height)) {
                    tempx = Math.ceil(user.card[i].posx - 50) / 100 * 100 + 50;

                    tempy = 450;
                    cardidx = i;
                    itbegin = 1;//表示在手上
                    lineyy = lineyy === -1 ? global.mouse.y : lineyy;
                    linexx = linexx === -1 ? global.mouse.x : linexx;
                    //	str+= "\nlineYY"+lineyy+"lineXX"+linexx;
                }
            }

        }

        /**
         * 看是否选中场上的卡
         */
        for (var i = 0; i < user.card.length; i++) {
            if (user.card[i].posi === 2) {

                if (judgeRec(user.card[i].posx, user.card[i].posy, constant.card.width, constant.card.height)) {
                    cardidx = i;
                    if (user.card[cardidx].sleeping === 1) {
                        myshowinfoParam("该随从还在休息", 30);
                        cardidx = -1;
                        return;
                    } else {

                        itbegin = 2; //表示刚开始在场上
                        lineyy = lineyy === -1 ? global.mouse.y : lineyy;
                        linexx = linexx === -1 ? global.mouse.x : linexx;
                    }
                }
            }
        }


    });


    /*
     * 鼠标放松事件
     *
     */

    $("#mycan").mouseup(function () {


        if (itbegin === 1) {	//如果刚开始是在手牌
            //	if(cardidx==-1)return;
            if (global.mouse.y < 450) {

                if (user.card[cardidx].cost > user.nowCrystal) {	//如果费用不足
                    mygoal = -1;
                    lineyy = linexx = -1;
                    myshowinfoParam("您没有足够的法力值", 30);
                    user.card[cardidx].posx = calMyHandPosX(user.card[cardidx].post);
                    user.card[cardidx].posy = calMyHandPosY(user.card[cardidx].post);

                    tempx = tempy = -1;

                    return;
                }
                if (user.card[cardidx].attack !== '法术') {		//如果这张卡不是法术，默认为怪兽


                    /**
                     * 先找个位置安顿他
                     */
                    tempx = tempy = -1;

                    user.nowCrystal -= user.card[cardidx].cost;
                    //挑选一个合适的位置，放置该随从
                    let canPut = getChangPosFormyself();


                    if (canPut === -1) {
                        myshowinfoParam("对不起，您的场已经满了", 30);

                        return;
                    } else {
                        user.card[cardidx].posx = calMyChangPosX(canPut);
                        user.card[cardidx].posy = calMyChangPosY(canPut);
                        user.card[cardidx].posi = 2; //放置在场上
                        user.card[cardidx].post = canPut;//具体位置
                        doNOPointFunction(user.card, cardidx);
                    }


                } else if (user.card[cardidx].type === constant.card.TYPE.MAGIC) {//如果是法术

                    //如果是指向性法术
                    if (user.card[cardidx].point !== constant.POINT.NO) {
                        //获取鼠标指向的对象
                        let theSpecifiedTarget = getTheSpecifiedTargetIndex();
                        //如果卡片的类型与鼠标指向类型一致
                        if ((theSpecifiedTarget.type & user.card[cardidx].point) !== 0) {
                            if (theSpecifiedTarget.type === constant.POINT.MY_HERO) {
                                //对我方英雄释放法术,使用这张牌
                                user.card[cardidx].play(user, user)
                            } else if (theSpecifiedTarget.type === constant.POINT.HIS_HERO) {
                                //对敌方英雄释放法术
                                user.card[cardidx].play(computer, user)
                            } else if (theSpecifiedTarget.type === constant.POINT.MY_SERVANTS) {
                                //对我方随从释放法术
                                user.card[cardidx].play(theSpecifiedTarget.obj, user);
                                console.log("对我方随从释放法术" + user.card[cardidx].name)
                            } else if (theSpecifiedTarget.type === constant.POINT.HIS_SERVANTS) {
                                //对敌方随从释放法术
                                user.card[cardidx].play(theSpecifiedTarget.obj, user)

                            }
                            //将用过的卡片放入墓地
                            user.card[cardidx].posi = constant.card.POSITION.CEMETERY;

                        } else {
                            myshowinfoParam("这不是一个有效的目标", 30);
                            return;

                        }
                        /*
                                                if (theSpecifiedTargetIndex === constant.point.MY_HERO && (user.card[cardidx].point & constant.POINT.MY_HERO) === constant.POINT.MY_HERO) {//指向我方英雄的
                                                    if (user.card[cardidx].play) {
                                                        user.card[cardidx].play(user)
                                                    }
                                                } else {
                                                    myshowinfoParam("这不是一个有效的目标", 30);
                                                    return
                                                }
                                                if (theSpecifiedTargetIndex === computer && (user.card[cardidx].point & constant.POINT.HIS_HERO) === constant.POINT.HIS_HERO) {//指向敌方英雄的
                                                    if (user.card[cardidx].play) {
                                                        user.card[cardidx].play(user)
                                                    }
                                                } else {
                                                    myshowinfoParam("这不是一个有效的目标", 30);
                                                    return
                                                }
                        */

                    } else if (user.card[cardidx].point === POINTNO) {//非指向性法术


                        user.card[cardidx].play(user)
                        //将使用的法术移动到墓地里去
                        user.card[cardidx].posi = constant.card.POSITION.CEMETERY;
                        // doNOPointFunction(user.card, cardidx);

                        mygoal = 100;

                    }


                    if (mygoal === -1) {
                        lineyy = linexx = -1;
                        myshowinfoParam("这不是一个有效的目标", 30)
                    }

                    linexx = -1;
                    lineyy = -1;

                }


            } else {
                user.card[cardidx].posx = user.card[cardidx].post * (constant.card.width + 3);
                user.card[cardidx].posy = calMyHandPosY(-1);

            }
        } else if (itbegin === 2) {	//说明刚刚开始在场上

            var tar = -1;
            for (var i = 0; i < computer.card.length; i++) {

                if (computer.card[i].posi == 2 && pointinrec(global.mouse.x, global.mouse.y, computer.card[i].posx, computer.card[i].posy) == 0) {
                    tar = i;
                    break;

                }

            }
            //		如果指定的是对方英雄
            if (judgeRec(computerHeadx, computerHeady, constant.card.width, constant.card.height)) {

                tar = asForComputerHero(cardidx);

            }
            if (tar == -1) {
                myshowinfoParam("这不是一个有效的目标", 30);


            } else if (tar == -100) {

            } else {
                myattack(cardidx, tar);
                lineyy = -1;
            }


        }
        isfang = 1;
        cardidx = -1;
        itbegin = -1;
    });

    /**
     * 获得鼠标的x,y,并且可以把其放入变量中
     */
    $("#mycan").mousemove(function () {
        global.mouse.x = window.event.clientX;
        global.mouse.y = window.event.clientY;

    });

    setInterval(drawBase, 100);
});

/**
 * 显示信息用
 */
function show() {
    str = "isfang=" + isfang;
    str += ",cardidx=" + cardidx;
    str += ",itbegin=" + itbegin;
    str += ",global.mouse.y=" + global.mouse.y;
    str += ",tempx=" + tempx;
    str += ",tempy=" + tempy;
    str += ",global.T=" + global.T;
    str += ",lineXX" + linexx;
    str += ",lineyy" + lineyy;
    str += ",mymousexx" + global.mouse.x;
    str += ",global.mouse.y" + global.mouse.y;

    $(".test").html(str);

}

//
function playMusic(musicPath) {
    let soundComponment = document.getElementById("sound");
    soundComponment.src = musicPath;
    soundComponment.play()
}
