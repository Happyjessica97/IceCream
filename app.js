var getCanvas = document.getElementById("canvas");
var ctx= getCanvas.getContext("2d");
//this the level
var firstlevel = [
  "             ", 
  "               ",
  "               ",
  "                 ",
  "                 ",
  "                 ",
  "                 ",
  "                  ",
  "                  ", 
  "                   ",
  "                    "
];
//these are the symbols 
var chars = {
  "&": player,
  "8": coin, 
  "@": fireball
};
var size = 50;
var fixed = 50;
var playerCoors = []; 
var circleFixed = 25;
var xcoorSun = [];
var ycoorSun = [];
var restartGame = false;
var coneCoors = [];
var xcoorFireball = [];
var ycoorFireball = [];
var switchsides = 0; 

//this the random course.
var makeRandomCourse = function(){
  var posplayer = Math.floor(Math.random()*12)+3;
  var poswall1 = Math.floor(Math.random()*8)+4; 
  var posfire = Math.floor(Math.random()*9)+3;
  var poswall3 = Math.floor(Math.random()*14)+3;
  var poscoin = Math.floor(Math.random()*5)+4;
  var playerperson = "&";
  var coinWin = "8";
  var space = "                    ";
  var walls = "bb b b b bb";
  var movingwalls = "@   @   @   @";
  var hardwalls = "bbb  bbb  bbb";
  var start = space.substring(0,posplayer) + playerperson + space.substring(posplayer,space.length);
  var wall1 = space.substring(0,poswall1) + walls.substring(0,poswall1/2) + space.substring(poswall1,space.length);
  var movingfire = space.substring(0,posfire) + movingwalls.substring(0,posfire) + space.substring(posfire,space.length);
  var wall2 = space.substring(0,poswall3/4) + hardwalls.substring(0,poswall3) + space.substring(poswall3,space.length); 
  var end = space.substring(0,poscoin) + coinWin + space.substring(poscoin,space.length);
  firstlevel[0] = start; 
  firstlevel[2] = wall1; 
  firstlevel[5] = movingfire;
  firstlevel[8] = wall2; 
  firstlevel[11] = end; 
  console.log(end);
};
makeRandomCourse();
//this is the white circle around the suns 
function changeImageShape(x,y){
  ctx.beginPath();
  ctx.arc(x+circleFixed,y+circleFixed, size/2, 0, 2*Math.PI);
  ctx.closePath();  
  ctx.lineWidth = "5";
  ctx.strokeStyle = "white";
  ctx.stroke();  
};
function addCircleFire(x,y){
  ctx.beginPath();
  ctx.arc(x+circleFixed,y+circleFixed, size/2, 0, 2*Math.PI);
  ctx.closePath();  
  ctx.lineWidth = "20";
  ctx.strokeStyle = "red";
  ctx.stroke();  
};
function eraseCircleFire(x,y){
  ctx.beginPath();
  ctx.arc(x+circleFixed,y+circleFixed, size/2, 0, 2*Math.PI);
  ctx.closePath();  
  ctx.lineWidth = "20";
  ctx.strokeStyle = "rgb(88,25,155)";
  ctx.stroke();  
};
function makeSun(x,y){ 
  var img = new Image(); 
  img.src = 'sun.jpg';
  ctx.drawImage(img,x,y);
  changeImageShape(x,y);
};
function player(x,y){
  var img = new Image(); 
  img.src = 'icecream.jpg';     
  ctx.drawImage(img,x,y);
};
function coin(x,y){
  var img = new Image(); 
  img.src = 'cone.jpg';      
  ctx.drawImage(img,x,y);
};
function fireball(x,y){
  var img = new Image();
  img.src = 'fireball.jpg';
  ctx.drawImage(img,x,y);
  
};

function Rounds(theLevel){
  //this takes the level 2d array 
  this.width = theLevel[0].length;
  this.height = theLevel.length;
  var add = 0; 
  for(var y = 0; y < this.height; y++){
    var line = theLevel[y]; 
    for(var x = 0; x < this.width; x++){
      var ch = line[x]; 
      var Character = chars[ch];
      if(ch === "&"){
        player(x*fixed,y*fixed);
        playerCoors.push((x*fixed));
        playerCoors.push((y*fixed));
  
      }
      else if(ch === "b"){
       makeSun(x*fixed,y*fixed);
       xcoorSun.push(x*fixed);
       ycoorSun.push(y*fixed);
        
      }
      else if(ch === "8"){
        coin(x*fixed,y*fixed);
        coneCoors.push(x*fixed);
        coneCoors.push(y*fixed);
      } 
      else if(ch === "@"){
        fireball(x*fixed,y*fixed);
        xcoorFireball.push(x*fixed);
        ycoorFireball.push(y*fixed);
        addCircleFire(x*fixed,y*fixed);
      }
    }
  }
};
function isTouchingSun(){
  for(var i = 0; i < xcoorSun.length; i++){
    if((playerCoors[0] < (xcoorSun[i] + size))&&((playerCoors[0] + size) > xcoorSun[i])&&(playerCoors[1] < (ycoorSun[i]+size))&&((size + playerCoors[1]) > ycoorSun[i])){
      return true;
    }
  }
  return false; 
  
};
function isTouchingFireball(){
  for(var i = 0; i < xcoorFireball.length; i ++){
    if((playerCoors[0] < (xcoorFireball[i] + size))&&((playerCoors[0] + size) > xcoorFireball[i])&&(playerCoors[1] < (ycoorFireball[i]+size))&&((size + playerCoors[1]) > ycoorFireball[i])){
      return true;
    }
  }
  return false;
};
function win(){
  if((playerCoors[0] < (coneCoors[0] + size)) && ((playerCoors[0]+size) > coneCoors[0]) && (playerCoors[1] < (coneCoors[1] + size))&&(size + playerCoors[1] > coneCoors[1])){
    return true;
  }
  return false; 
};

function clearRect(x,y){
  ctx.clearRect(x,y,size,size); 
};

var countWins = once(function(){
  console.log("countWins");
  if(typeof(Storage) !== "undefined"){
    if(sessionStorage.wins){
      //sessionStorage.wins = 0; 
      sessionStorage.wins = Number(sessionStorage.wins)+1;
    }
    else{
      sessionStorage.wins = 0; 
    }
    document.getElementById("win").innerHTML = "wins: " + sessionStorage.wins;
  }else{
    document.getElementById("win").innerHTML = "nope you can't use it";
  }
  
});
function retry(){
    document.getElementById("icecreamsong").pause();
    document.getElementById("icecreamsong").currentTime = 0; 
    document.getElementById("icecreamgone").play();
    clearRect(playerCoors[0],playerCoors[1]);
    var randX = Math.floor(Math.random()*350)+50;
    playerCoors[0] = randX;
    playerCoors[1] = 0;
    countLoses();
};
var startGame = false;
var randSpeed = Math.floor(Math.random()*300)+100;
var movement = function(){
  document.onkeydown = checkKey;
  if(startGame){
       if(playerCoors[1] > 600){
    retry();
   }
  
   
    if((isTouchingSun())||(isTouchingFireball())){
      retry(); 
    }else{
      clearRect(playerCoors[0],playerCoors[1]);
      playerCoors[1]++;
      player(playerCoors[0],playerCoors[1]);
      document.getElementById("icecreamsong").play();
      for(var i = 0; i < xcoorFireball.length; i++){
        if(switchsides <= randSpeed){
          clearRect(xcoorFireball[i],ycoorFireball[i]);
          eraseCircleFire(xcoorFireball[i],ycoorFireball[i]);
          xcoorFireball[i]--;
          fireball(xcoorFireball[i],ycoorFireball[i]);
          addCircleFire(xcoorFireball[i],ycoorFireball[i]);
          switchsides++;        

        }
        else if(switchsides > randSpeed){
          clearRect(xcoorFireball[i],ycoorFireball[i]);
          eraseCircleFire(xcoorFireball[i],ycoorFireball[i]);
          xcoorFireball[i]++;
          fireball(xcoorFireball[i],ycoorFireball[i]);
          addCircleFire(xcoorFireball[i],ycoorFireball[i]);
          switchsides++; 
         // console.log(xcoorFireball[0]);
          if(switchsides > randSpeed+100){
            switchsides = 0; 
            //console.log("hi");
          }
        }
      }
      }
  if(win()){
      document.getElementById("icecreamsong").pause();
      document.getElementById("icecreamsong").currentTime = 0;
      document.getElementById("youwon").play(); 
      if(restartGame === false){
        countWins();
      }
      restartGame = true; 
  }

  }
  function checkKey(e) {

        e = e || window.event;
        //space bar to start
        if(e.keyCode == '32'){
          startGame = true;
        }
        if (e.keyCode == '38') {
            // up arrow ycoor goes down
           // if((isTouchingSun())||(isTouchingFireball())){
           //  retry(); 
           // }else{
           //  clearRect(playerCoors[0],playerCoors[1]);
           //  playerCoors[1]-=20;
           //  player(playerCoors[0],playerCoors[1]);
           // }
        }
        else if (e.keyCode == '40') {
          //down arrow if I wanted to 
        }
        else if (e.keyCode == '37') {
           // left arrow xcoor goes down
             if((isTouchingSun())||(isTouchingFireball())){
              retry();  
             }else{
             clearRect(playerCoors[0],playerCoors[1]);
             playerCoors[0]-=20;
             player(playerCoors[0],playerCoors[1]);
           }
        }
        else if (e.keyCode == '39') {
           // right arrow
          if((isTouchingSun())||(isTouchingFireball())){
            retry(); 
          }else{
           clearRect(playerCoors[0],playerCoors[1]);
           playerCoors[0]+=20;
           player(playerCoors[0],playerCoors[1]);
         }
        }

  };
};
Rounds(firstlevel);

//countWins();
function setWins(){
  if(typeof(Storage) !== "undefined"){
    if(sessionStorage.wins){
      console.log("yup it works");
    }else{
      sessionStorage.wins = 0;
    }
  }else{
    sessionStorage.wins = 0; 
  }
  document.getElementById("win").innerHTML = "wins: " + sessionStorage.wins; 

  
};
setWins();
function setLoses(){
  if(typeof(Storage)!== "undefined"){
    if(sessionStorage.loses){
      sessionStorage.loses = 5; 
    }else{
      sessionStorage.loses = 5; 
    }
    document.getElementById("lose").innerHTML = "loses: " + sessionStorage.loses;
  }else{

  }
};
setLoses(); 
function countLoses(){
  if(typeof(Storage) !== "undefined"){
    if(sessionStorage.loses){
      if(sessionStorage.wins >=0){
      sessionStorage.loses = Number(sessionStorage.loses)-1;
      if(sessionStorage.loses <= 0){
        alert("GAME OVER! close the tab to start over!");
      }
    }
    }else{
      sessionStorage.loses = 5; 
    }
    document.getElementById("lose").innerHTML = "loses: " + sessionStorage.loses;
    
  }else{
      document.getElementById("lose").innerHTML = "nope";
    }
};

var startAnimation = function(){

  if(restartGame===true){
    location.reload();
    restartGame = false;
   
  }
   movement();
   requestAnimationFrame(startAnimation);
   
   
};

requestAnimationFrame(startAnimation);
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

startAnimation();


function once (fn) {
  var res = null;
  return function () {
    if (res === null) {
      res = fn.apply(null, arguments);
    }
    return res;
  }
};

