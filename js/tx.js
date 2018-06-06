/**
 * 用于存放特效的信息
 */



/**
			 * 画出特效
			 */
			function drawTX(){
				
				for(var i=0;i<tx.length;i++){
					if(tx[i].funname=="attackTX"){
						tx[i].fun(tx[i]);
					}
					
					if(allT-tx[i].beginT>tx[i].lastT){
						continue;
					}
					if(tx[i].funname=="blackTX"){
						tx[i].fun(tx[i].beginT,tx[i].lastT);
					}
					
					if(tx[i].funname=="fireTX"){
						tx[i].fun(tx[i]);
					}
					if(tx[i].funname=="killTX"){
						tx[i].fun(tx[i]);
					}
					
				}
				
			}
			
			/**
			 * 特效数组 
			 * fun 里面放的是特效的方法
			 */
			
			
			var tx = [
//				tx.push({funname:"attackTX",fun:attackTX,who:"mycard",myidx:idx,beginX:mycard[idx].posx,beginY:mycard[idx].posy,endX:computerHeadx,endY:computerHeady,beginT:allT,lastT:15});
//				{funname:"fireTX",fun:fireTX,beginPosX:400,beginPosY:300,endPosX:800,endPosY:600,beginT:0,lastT:50},
//				{funname:"blackTX",fun:blackTX,beginT:0,lastT:15}
				{funname:"killTX",fun:killTX,beginT:0,lastT:8}
			];
			/**
			 * 裂解魔杖的特效
			 * @param {Object} obj
			 */
			function boomTX(obj){
				
			}
			/**
			 * 真言术的特效
			 */
			function realsayTX(obj){
				//TODO
			}
			//刺杀的特效
			function killTX(obj){
				var beginX = obj.posx;
				var beginY = obj.posy;
				
				var beginT = obj.beginT;
				var lastT = obj.lastT;
				if(allT-beginT>lastT)return;
				var mycan = document.getElementById("mycan");
				var cxt = mycan.getContext("2d");
				cxt.save();
				cxt.beginPath();
				if(allT-beginT<=lastT/2){
					cxt.moveTo(beginX,beginY);
					
					cxt.lineTo(beginX+cardWidth*(allT-beginT)/lastT*2,beginY+cardHeight*(allT-beginT)/lastT*2);
					cxt.stroke();
				}else{
					cxt.moveTo(beginX,beginY);
					cxt.lineTo(beginX+cardWidth,beginY+cardHeight);
					cxt.stroke();
					cxt.moveTo(beginX+cardWidth,beginY);
					cxt.lineTo(beginX+cardWidth-cardWidth*(allT-beginT-lastT/2)/lastT*2,beginY+cardHeight*(allT-beginT-lastT/2)/lastT*2);
					cxt.stroke();
				}
				
				
				
				cxt.closePath();
				cxt.restore();
			}
			
			
			
			/**
			 * 火球术的特效
			 */
			function fireTX(obj){
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
				var dx = (endPosX - beginPosX)/lastT;
				var dy = (endPosY - beginPosY)/lastT;

				for(var i=0;i<=(allT-beginT);i++){
				
					cxt.arc(beginPosX+dx*i,beginPosY+dy*i,38,0,2*Math.PI,true);
				
					cxt.fill();
				}
				cxt.closePath();
				
			}
			/**
			 * 攻击特效 能动特效
			 * @param {Object} who	  卡片的英雄  mycard or computercard
			 * @param {Object} myidx 该卡的索引
			 * @param {Object} goal	  目标英雄 mycard or computercard
			 * @param {Object} itidx 目标的索引
			 */
			function attackTX(obj){
				var beginT = obj.beginT;
				var who = obj.who;
				var endX = obj.endX;
				var endY = obj.endY;
				var beginX = obj.beginX;
				var beginY = obj.beginY;
				var lastT = obj.lastT;
				var myidx = obj.myidx;
				var goal = obj.goal;
				var t = allT - beginT;
				
				if(t>lastT){
					if(who=="mycard"){
						if(mycard[myidx].HP<=0){
							mycard[myidx].posi = 3;
						} 
						if(goal!=undefined&& computercard[goal].HP<=0){
							computercard[goal].posi = 3;
						}
						
					}else if(who=="computercard"){
						if(computercard[myidx].HP<=0){
							computercard[myidx].posi = 3;
						} 
						if(goal!=undefined&& mycard[goal].HP<=0){
							mycard[goal].posi = 3;
						}
					}
					return;
				}
//				myshowinfoParam(who,10);
				if(t<lastT/2){    //前半部分
					if(who=="mycard"){
						mycard[myidx].posx = beginX+(endX-beginX)*t/(lastT/2);
						mycard[myidx].posy = beginY+(endY-beginY)*t/(lastT/2);
							
					}else if(who=="computercard"){
						
						computercard[myidx].posx = beginX+(endX-beginX)*t/(lastT/2);
						computercard[myidx].posy = beginY+(endY-beginY)*t/(lastT/2);
					}
					
					
				}else{   //后半部分
					if(who=="mycard"){
						mycard[myidx].posx = endX+(beginX-endX)*(t-lastT/2)/(lastT/2);
						mycard[myidx].posy = endY+(beginY-endY)*(t-lastT/2)/(lastT/2);
							
					}else if(who=="computercard"){
						computercard[myidx].posx = endX+(beginX-endX)*(t-lastT/2)/(lastT/2);
						computercard[myidx].posy = endY+(beginY-endY)*(t-lastT/2)/(lastT/2);
					}
					
				}
				
				
				
			}
			
			/**
			 * 扭曲虚空特效
			 */
			function blackTX(beginT,lastT){
				
				
				var mycan = document.getElementById("mycan");
				var cxt = mycan.getContext("2d");
				cxt.beginPath();
				
				cxt.fillStyle = "black";
				cxt.arc(400,300,(allT-beginT)*33,0,2*Math.PI,true);
				cxt.fill();
				cxt.closePath();
			}