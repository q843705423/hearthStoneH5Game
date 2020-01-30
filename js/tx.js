/**
 * 用于存放特效的信息
 */


/**
 * 画出特效
 */
function drawTX() {

    for (var i = 0; i < tx.length; i++) {
        if (allT - tx[i].beginT > tx[i].lastT) {
            continue;
        }
        tx[i].fun(tx[i])
        /*
                if (tx[i].funname === 'move') {
                    tx[i].fun(tx[i])
                }
                if (tx[i].funname == "attackTX") {
                    tx[i].fun(tx[i]);
                }

                if (tx[i].funname == "blackTX") {
                    tx[i].fun(tx[i].beginT, tx[i].lastT);
                }

                if (tx[i].funname == "fireTX") {
                    tx[i].fun(tx[i]);
                }
                if (tx[i].funname == "killTX") {
                    tx[i].fun(tx[i]);
                }
                if(tx[i].funname==='notMove'){
                    tx[i].fun(tx[i])
                }
        */

    }

}

/**
 * 特效数组
 * fun 里面放的是特效的方法
 */


var tx = [];

/**
 * 裂解魔杖的特效
 * @param {Object} obj
 */
function boomTX(obj) {

}

/**
 * 真言术的特效
 */
function realsayTX(obj) {
    //TODO
}

//刺杀的特效
function killTX(obj) {
    var beginX = obj.posx;
    var beginY = obj.posy;

    var beginT = obj.beginT;
    var lastT = obj.lastT;
    if (allT - beginT > lastT) return;
    var mycan = document.getElementById("mycan");
    var cxt = mycan.getContext("2d");
    cxt.save();
    cxt.beginPath();
    if (allT - beginT <= lastT / 2) {
        cxt.moveTo(beginX, beginY);

        cxt.lineTo(beginX + cardWidth * (allT - beginT) / lastT * 2, beginY + cardHeight * (allT - beginT) / lastT * 2);
        cxt.stroke();
    } else {
        cxt.moveTo(beginX, beginY);
        cxt.lineTo(beginX + cardWidth, beginY + cardHeight);
        cxt.stroke();
        cxt.moveTo(beginX + cardWidth, beginY);
        cxt.lineTo(beginX + cardWidth - cardWidth * (allT - beginT - lastT / 2) / lastT * 2, beginY + cardHeight * (allT - beginT - lastT / 2) / lastT * 2);
        cxt.stroke();
    }


    cxt.closePath();
    cxt.restore();
}


/**
 * 火球术的特效
 */
function fireTX(obj) {
    beginPosX = obj.beginPosX;
    beginPosY = obj.beginPosY;
    endPosX = obj.endPosX;
    endPosY = obj.endPosY;
    beginT = obj.beginT;
    lastT = obj.lastT;
    var mycan = document.getElementById("mycan");
    var cxt = mycan.getContext("2d");
    cxt.beginPath();

    cxt.fillStyle = "red";
//				var tpower = (allT-beginT)/lastT;
    var sp = 20;
    var dx = (endPosX - beginPosX) / lastT;
    var dy = (endPosY - beginPosY) / lastT;

    for (var i = 0; i <= (allT - beginT); i++) {

        cxt.arc(beginPosX + dx * i, beginPosY + dy * i, 38, 0, 2 * Math.PI, true);

        cxt.fill();
    }
    cxt.closePath();

}

/**
 * 攻击特效 能动特效
 * @param {Object} who      卡片的英雄  mycard or computercard
 * @param {Object} myidx 该卡的索引
 * @param {Object} goal      目标英雄 mycard or computercard
 * @param {Object} itidx 目标的索引
 */
function attackTX(obj) {
    let beginT = obj.beginT;
    let who = obj.who;
    let endX = obj.endX;
    let endY = obj.endY;
    let beginX = obj.beginX;
    let beginY = obj.beginY;
    let lastT = obj.lastT;
    let myidx = obj.myidx;
    let goal = obj.goal;
    let t = allT - beginT;

    if (t > lastT) {
        if (who == "mycard") {
            if (mycard[myidx].HP <= 0) {
                mycard[myidx].posi = 3;
            }
            if (goal != undefined && computercard[goal].HP <= 0) {
                computercard[goal].posi = 3;
            }

        } else if (who == "computercard") {
            if (computercard[myidx].HP <= 0) {
                computercard[myidx].posi = 3;
            }
            if (goal != undefined && mycard[goal].HP <= 0) {
                mycard[goal].posi = 3;
            }
        }
        return;
    }
//				myshowinfoParam(who,10);
    if (t < lastT / 2) {    //前半部分
        if (obj.playMusic === undefined) {

            playMusic("music/打的声音.m4a")
            obj.playMusic = 1;
        }
        if (who == "mycard") {
            mycard[myidx].posx = beginX + (endX - beginX) * t / (lastT / 2);
            mycard[myidx].posy = beginY + (endY - beginY) * t / (lastT / 2);

        } else if (who == "computercard") {

            computercard[myidx].posx = beginX + (endX - beginX) * t / (lastT / 2);
            computercard[myidx].posy = beginY + (endY - beginY) * t / (lastT / 2);
        }


    } else {   //后半部分
        if (who == "mycard") {
            mycard[myidx].posx = endX + (beginX - endX) * (t - lastT / 2) / (lastT / 2);
            mycard[myidx].posy = endY + (beginY - endY) * (t - lastT / 2) / (lastT / 2);

        } else if (who == "computercard") {
            computercard[myidx].posx = endX + (beginX - endX) * (t - lastT / 2) / (lastT / 2);
            computercard[myidx].posy = endY + (beginY - endY) * (t - lastT / 2) / (lastT / 2);
        }
        if (t === lastT) {
            if (who == "mycard") {
                if (mycard[myidx].HP <= 0) {
                    mycard[myidx].posi = 3;
                }
                if (goal != undefined && computercard[goal].HP <= 0) {
                    computercard[goal].posi = 3;
                }

            } else if (who == "computercard") {
                if (computercard[myidx].HP <= 0) {
                    computercard[myidx].posi = 3;
                }
                if (goal != undefined && mycard[goal].HP <= 0) {
                    mycard[goal].posi = 3;
                }
            }
        }

    }


}

/**
 * 扭曲虚空特效
 */
function blackTX(obj) {


    var mycan = document.getElementById("mycan");
    var cxt = mycan.getContext("2d");
    cxt.beginPath();

    cxt.fillStyle = "black";
    cxt.arc(400, 300, (allT - obj.beginT) * 33, 0, 2 * Math.PI, true);
    cxt.fill();
    cxt.closePath();
}

function notMove(obj) {

    if (allT - obj.beginT > 20) {
        return;
    }
    var mycan = document.getElementById("mycan");
    var cxt = mycan.getContext("2d");

    cxt.beginPath();
    cxt.save();
    let img = new Image();
    img.src = obj.img;
    cxt.drawImage(img, 500, 0, 200, 300);
    cxt.restore();
    cxt.closePath();

}

function otherGetCard(obj) {
    let dt = allT - obj.beginT

    let len = computercard.reduce((sum, val) => sum = sum + val.posi === 1 ? 1 : 1)
    // let len = computercard.length;

    let dv_x = (700 - (15 * len + 300)) / 20;
    let dv_y = (200 - (-20)) / 20;

    if (dt === 20) {
        computercard.push(obj.card);

    }
    drawImg("img/黄金挑战.png", 700 - dv_x * dt, 200 - dt * dv_y, 45, 60);
}
