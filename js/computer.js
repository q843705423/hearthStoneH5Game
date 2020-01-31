/**
 * 用来模拟电脑进行的一系列操作
 */
/**
 * 查看电脑可以做的事情
 */
var NOTHINGTODO = -10086;

function computerCanDoing() {
    var obj = new Object();
    //能获得法力水晶
    if (cangetCrystal === 1) {
        obj.state = 1;
        obj.thing = "getCrystal";
        return obj;
    }
    //能抽卡

    if (cangetCard === 1) {
        obj.state = 1;
        obj.thing = "getCard";
        return obj;
    }
    //能释放法术
    for (let i = 0; i < computer.card.length; i++) {
        if (useMagicNoProblem(i) === false) {//判断逻辑上是否能用此卡
            continue;
        }
        if (computer.card[i].choosed !== 1 && computer.card[i].posi == 1 && computer.card[i].cost <= computer.nowCrystal && computer.card[i].attack == "法术") {
            obj.state = 1;
            obj.cardidx = i;

            obj.thing = "domagic";
            computer.card[i].choosed = 1;		//保证就算不用也不会重复选，进入死循环
            return obj;

        }

    }
    //电脑能攻击
    for (var i = 0; i < computer.card.length; i++) {

        if (computer.card[i].posi === 2 && computer.card[i].sleeping === 0) {
            obj.state = 1;
            obj.cardidx = i;
            obj.thing = "attack";

            return obj;


        }
    }

    //电脑能召唤随从
    for (var i = 0; i < computer.card.length; i++) {

        if (computer.card[i].posi === 1 && computer.card[i].cost <= computer.nowCrystal && computer.card[i].attack !== '法术' && getChangPosForcomputer() !== -1) {
            obj.state = 1;
            obj.cardidx = i;
            obj.thing = "gotowar";

            return obj;
        }

    }


    obj.state = NOTHINGTODO;
    return obj;
}

/**
 * 电脑开始做这件事情
 */

function doComputer(context, obj) {
    console.log(obj.thing);
    if (obj.thing === "getCrystal") {//获得法力水晶
        computer.maxCrystal += computer.maxCrystal < 10 ? 1 : 0;  //法力水晶加1
        computer.nowCrystal = computer.maxCrystal;
        computer.cardNum++;
        cangetCrystal = 0;
    } else if (obj.thing === "getCard") {	//电脑抽卡
        var ran = Math.floor(Math.random() * card.length);
        var obj = card[ran];
        var newobj = {
            img: obj.img,
            name: obj.name,
            cost: obj.cost,
            attack: obj.attack,
            HP: obj.HP,
            font: obj.font,
            posx: 100,
            posy: 100,
            posi: 1,
            sleeping: 1,
            point: obj.point,
            run: obj.run,
            music: obj.music
        };
        tx.push({
            name:'otherGetCard',
            fun:otherGetCard,
            beginT:global.T,
            lastT:20,
            card:newobj,
        })
        myshowinfoParam("对方抽了一张卡", 20);

        cangetCard = 0;

    } else if (obj.thing === "gotowar") {//召唤
        var goodpos = -1;
        tx.push({
            funname: "notMove",
            fun: notMove,
            img: computer.card[obj.cardidx].img,
            beginT: global.T,
        })
        // showInRightTop(context, computer.card[obj.cardidx].img);

        goodpos = getChangPosForcomputer();
        if (goodpos !== -1) {
            computer.card[obj.cardidx].posi = 2;//把这只怪兽召唤到场上
            computer.card[obj.cardidx].posx = calcomputerChangPosX(goodpos);
            computer.card[obj.cardidx].posy = calcomputerChangPosY(goodpos);
            computer.card[obj.cardidx].post = goodpos;
            doNOPointFunction(computer.card, obj.cardidx);
            computer.nowCrystal -= computer.card[obj.cardidx].cost;

            myshowinfoParam("对方召唤了一只" + computer.card[obj.cardidx].name, 20);

        }


    } else if (obj.thing === "attack") {//攻击


        var attackHero = Math.random() > 0.5;

        if (attackHero === true || attackHero === 1) {

            myshowinfoParam(computer.card[obj.cardidx].name + "对您发起了攻击", 18);
            tx.push(
                {
                    funname: "attackTX",
                    fun: attackTX,
                    who: "computer.card",
                    myidx: obj.cardidx,
                    beginX: computer.card[obj.cardidx].posx,
                    beginY: computer.card[obj.cardidx].posy,
                    endX: 450,
                    endY: 450,
                    beginT: global.T,
                    lastT: 15
                });
            user.HP -= computer.card[obj.cardidx].attack;
            computer.card[obj.cardidx].sleeping = 1;

        } else {
            var mychang = [];
            for (let i = 0; i < user.card.length; i++) {
                if (user.card[i].posi === 2) {
                    mychang.push(i);
                }
            }
            var cnt = Math.floor(Math.random() * mychang.length);
            if (mychang.length === 0) return;

            cnt = mychang[cnt];
            myshowinfoParam(computer.card[obj.cardidx].name + "对" + user.card[cnt].name + "发起攻击", 20);
            tx.push(
                {
                    funname: "attackTX",
                    fun: attackTX,
                    who: "computer.card",
                    myidx: obj.cardidx,
                    beginX: computer.card[obj.cardidx].posx,
                    beginY: computer.card[obj.cardidx].posy,
                    endX: user.card[cnt].posx,
                    endY: user.card[cnt].posy,
                    beginT: global.T,
                    goal: cnt,
                    lastT: 15
                });
            user.card[cnt].HP -= computer.card[obj.cardidx].attack;
            computer.card[obj.cardidx].HP -= user.card[cnt].attack;
//						if(user.card[cnt].HP<=0)user.card[cnt].posi= 3;
//						if(computer.card[obj.cardidx].HP<=0)computer.card[obj.cardidx].posi = 3;
            computer.card[obj.cardidx].sleeping = 1;

        }


    } else if (obj.thing === "domagic") {//放法术

        tx.push({
            funname: "notMove",
            fun: notMove,
            img: computer.card[obj.cardidx].img,
            beginT: global.T,
        })

        if (computer.card[obj.cardidx].point === POINTNO) {//若为无指向性法术
            console.log(obj.cardidx);
            doNOPointFunction(computer.card, obj.cardidx);
            myshowinfoParam("电脑使用了法术" + computer.card[obj.cardidx].name, 20);
        } else {//指向性法术，随机指定目标释放,但要根据卡牌的好坏

            let name = computer.card[obj.cardidx].name;
            let goodCard = ["真言盾"];//增益卡列表
            let isgood = goodCard.some(card => card === name);
            console.log("isgood");
            console.log(isgood);
            if (isgood) {
                let myidx = chooseIt(computer.card);
                domagic(computer.card, obj.cardidx, computer.card, myidx);
                myshowinfoParam("电脑对自己的" + computer.card[myidx].name + "使用了法术" + computer.card[obj.cardidx].name, 18);
            } else {
                var itidx = -1;
                for (var i = 0; i < user.card.length; i++) {
                    if (user.card[i].attack >= 3 && user.card[i].HP >= 3 && user.card[i].pos === 2) {
                        itidx = i;
                        break;
                    }
                }
                if (itidx === -1) itidx = chooseIt(computer.card);
                myshowinfoParam("电脑对您的" + user.card[itidx].name + "使用了法术" + computer.card[obj.cardidx].name, 18);
                domagic(computer.card, obj.cardidx, user.card, itidx);
            }

        }


    }
}

/**
 * 电脑分析使用这张牌是否合适
 * @param {Object} cardidx
 */
function useMagicNoProblem(cardidx) {

    if (computer.card[cardidx].name === "真言盾") {//看自己场上是否有随从
        let ok = 0;
        for (var i = 0; i < computer.card.length; i++) {
            if (computer.card[i].posi === 2) return true;
        }
        return false;


    }
    var goodforcomputer = ["火球术", "刺杀", "变形术"];//对方场上有攻击和血量在3以上的随从时发动
    for (var j = 0; j < goodforcomputer.length; j++) {
        if (computer.card[cardidx].name === goodforcomputer[j]) {
            for (var k = 0; k < user.card.length; k++) {
                if (user.card[k].posi === 2 && user.card[k].attack >= 3 && user.card[k].HP >= 3) return true;//隐藏的bug
            }
            return false;
        }

    }
    if (computer.card[cardidx].name === "扭曲虚空") {
        var cgoal = 0;
        for (let i = 0; i < computer.card.length; i++) {
            if (computer.card[i].posi === 2) {
                cgoal += computer.card[i].attack + computer.card[i].HP;
            }
        }
        var mygoal = 0;
        for (let i = 0; i < user.card.length; i++) {
            if (user.card[i].posi === 2) {
                mygoal += user.card[i].attack + user.card[i].HP;
            }
        }
        if (cgoal >= mygoal - 10) return false;
        else return true;

    }


    return true;
}

function showInRightTop(context, image) {

    context.save();
    context.beginPath();
    let img = new Image();
    console.log(image)
    img.src = image;
    context.drawImage(img, 0, 0, 400, 400);
    context.restore();
    context.closePath();
}
