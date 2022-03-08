class Player{
  constructor(cards, playerNum) {
    this.cards = cards;
    this.playerNum = playerNum;

  }
  playCard(pileNum, cardNum){
    var card = this.cards[cardNum];
    if(testLegalMoveOn(pileNum, card)){
      piles[pileNum].unshift(card); // adds a card at index 0
      this.cards.splice(cardNum, 1); // deleats the card
    }else{
      console.log("ILLEGAL MOVE CARD: " + card + " CANNOT BE PLAYED ON:" + piles[pileNum][0]);
    }
  }
}






// The Game Code
// The game variables
var currentDeck = [];
var numOfPlayers = 3;
var cardNum = 6;

var players = [];



var piles = [ [1], [1], [100], [100] ];

function startGame(){
  initializeDeck();
  deal();


  //console.log(players[0]);
  //console.log(players[1]);
  //console.log(players[2]);
  //console.log(players[3]);
  //console.log(players[4]);
  drawHands(400,200);


}





function initializeDeck(){
  // Clear current deck
  currentDeck = [];

  // possible values list that contain all the numbers unshuffled
  var possibleValues = [];
  for(var i = 2; i < 100; i++){
    possibleValues.push(i);
  }

  // Appends number 2 throgh 99 in random order to "shuffle" them
  for(var i = 2; i < 100; i++){
    // Gets a random index value in currentDeck to place the number
    var randomNum = Math.floor(Math.random() * (possibleValues.length));
    var number = possibleValues[randomNum];
    possibleValues.splice(randomNum, 1);
    currentDeck.push(number);
  }
  //console.log(currentDeck);

}

function deal(){
  // sets up number of players based on playerNum
  for (var i = 0; i < numOfPlayers; i++) {
    players.push(new Player([], i + 1));
  }

  for(var i = 0; i < numOfPlayers; i++){
      dealCardsTo(i);
  }
}

function dealCardsTo(playerNum){
  var player = players[playerNum];
  // deals cards until there cards eqaul the card num
  while(player.cards.length < cardNum){
    var card = currentDeck[0];
    currentDeck.splice(0, 1);
    player.cards.push(card);
  }
}

function testLegalMoveOn(pileNum, number){
  var topCard = piles[pileNum][0];
  if(pileNum < 3){ // check if pile is going up or down
    if(topCard < number || topCard - 10 == number){ // check if the card is greater or if it can bump it back
      return true;
    }
  }else{ // pile is going down
    if(topCard > number || topCard + 10 == number){ // check if the card is less or if it can bump it up
      return true;
    }
  }
  return false;
}

startGame();







// Graphics Code
function drawCard(x, y, number, orientation, cardSize){
  var color;
  var i = Math.floor(Math.random() * 4);
  if( i == 0){
    color = "red";
  }else if(i == 1){
    color = "green";

  }else if(i == 2){
    color = "blue";

  }else if(i == 3){
    color = "yellow";

  }



  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    // Graphics Variables
    var ctx = canvas.getContext('2d');
    var centerX = x + cardSize / 2;
    var centerY = y + cardSize * 0.7;
    var offsetx = 0;
    //var angle = 0.7853982 * (orientation/45);
    var angle = 0.7853982 * (orientation/45);

    if(number < 10){
      offsetx += cardSize * 0.32;
    }

    // Bunch of math that basicly just creates the shape and rota†es around its center took me FOREVER
    var rect={ x:x, y:y, width:cardSize, height:cardSize * 1.4};
    ctx.translate( rect.x+rect.width/2, rect.y+rect.height/2 );
    ctx.rotate(orientation * Math.PI / 180);
    ctx.translate( -rect.x-rect.width/2, -rect.y-rect.height/2 );
    ctx.fillStyle = "black";
    ctx.fillRect( rect.x, rect.y, rect.width, rect.height );
    ctx.font = cardSize - 10 + 'px Trebuchet MS';
    ctx.fillStyle = color;
    ctx.fillText(number.toString(), offsetx + x + 0.03 * cardSize, y + 1 * cardSize);
    ctx.setTransform(1,0,0,1,0,0);

  }
}
function drawCardsWithPoints(points, cards, orientation, cardSize){

  // The two points define the line
  var subPoints = splitEqIntoPoints(points[0], points[1], cards.length);
  //console.log(findIntrsctBtwLines([4, 10], [5, -2]));
  for(var i = 0; i < cards.length; i++){
    var x = subPoints[i][0];
    var y = subPoints[i][1];

    drawCard(x, y, cards[i], orientation, cardSize);
  }

}


function drawHands(centerX, centerY){
  var circleSize = 100000;

  var cardSize = 65 - numOfPlayers * 5;
  var lineLength = 1.3 + numOfPlayers * 0.3;   //controls the number of subsections used to find the shorter line

  var xpos = canvas.width/2;
  var ypos =  canvas.height/2;


  var angle = (360 / players.length) * (Math.PI/180);   // in radians
  let subdivNum = 2;
  var subdiv = angle / subdivNum;


  // sets the settings for visual apeal for sideLength, cardSize and circleSize
  var sizeSettings = [[],[],[2, 40, 26000], [2.4, 35, 25000], [2.8, 30, 24000], [3.2, 25, 23000]];


// performs subsequent calculation first making a circle and subdividing it into 2 sections per player than
//Using these sections to make a line for each player nad calculating the intersection of these lines to form a ploygon
  var points = [];
  var intersectPoints = [];
  var polygonSides = [];
  var actualSides = [];


  // Can't figure out a way to calculate these for the orientation computations
  var yint = [0,0, 60,22,0,45,32.1375, 22.75];
  // Initialize yint
  for (var i = 7; i < 100; i++) {
    var oldval = yint[i - 1];
    var newval = oldval * 0.71111111111;
    yint.push(newval);
  }

  for(var i = 0; i < players.length * subdivNum; i++){

      var x = Math.cos(subdiv * i) * Math.sqrt(circleSize);
      var y = Math.sin(subdiv * i) * Math.sqrt(circleSize);
      x += xpos;
      y += ypos;
      points.push([x,y]);
  }

  for(var i = 0; i < points.length; i+=2){

    // points = [0,1,2,3,4,5,6,7]
    //points =  [2,3,4,5,6,7,0,1]
    //round1 = 0,1,2,3   round2:2,3,4,5 roundd3: 4,5,6,7 round4:6,7,0,1
    // double shift needed to acomadate
    var shiftPoints = [...points];
    shiftPoints.push(shiftPoints.shift());
    shiftPoints.push(shiftPoints.shift());

    var point1 = points[i];
    var point2 = points[i + 1];

    var point3 = shiftPoints[i];
    var point4 = shiftPoints[i + 1];

    var intersectPoint = findIntrsctBtwLines([point1, point2], [point3, point4]);

    intersectPoints.push(intersectPoint);
  }

  // For some reason the sides are on off for every side above 6 so i have to reset it here
  if(intersectPoints.length > 5){
    intersectPoints.push(intersectPoints.shift());
  }

  for(var i = 0; i < intersectPoints.length; i++){



    var shiftPoints = [...intersectPoints]; // weird problem with asignment in javascript
    shiftPoints.push(shiftPoints.shift());

    var point1 = intersectPoints[i];
    var point2 = shiftPoints[i];

    var shorterLine = convertToShorterLineWith(point1, point2, lineLength);
    var color = "orange";
    var slope = 360 / numOfPlayers;
    var angle = slope * i + yint[numOfPlayers - 1];





    drawCardsWithPoints(shorterLine, players[i].cards, angle, cardSize);

    // angles
    /*
    7 sides
    0 -> 330
    1 -> 30
    2 -> 80
    3 -> 130
    4 -> 180
    5 -> 230
    6 -> 280
    51.42x + 30 = y


    6 sides
    0 -> 345
    1 -> 45
    2 -> 105
    3 -> 165
    4 -> 225
    5 -> 285
    60x + 45 = y


    5 sides
    0 -> 0
    1 -> 72
    2 -> 144
    3 -> 216
    4 -> 288
    72x + 0 = y


    4 sides
    0 -> 22
    1 -> 112
    2 -> 202
    3 -> 292
    90x + 22 = y


    3 sides
    0 -> 60
    1 -> 180
    2 -> 300
    120x + 60 = x

    -26x + 198 = slope where x is number of sides
    */
  }


}



function calcEqWith(point1x, point1y, point2x, point2y){
  var slope;
  if((point1x - point2x) == 0){
    slope = -1;
  }else{
    var slope = (point1y - point2y) / (point1x - point2x);
  }
  // Point slope form is y - y1 = m(x - x1)
  var yintercept = -(point2x * slope) + point2y;

  return [slope, yintercept];
}


function splitEqIntoPoints(point1,point2, subsections){
  // Splits a line into a set number of subsections then returns the points at these subsections
  var points = [];
  for(var i = 0; i < subsections; i++){
    var k = i / (subsections - 1);
    var x = point1[0] + (k * (point2[0] - point1[0]));
    var y = point1[1] + (k * (point2[1] - point1[1]));
    points.push([x, y]);
  }
  return points;
}

function convertToShorterLineWith(point1, point2, shrinkVal){
  // Divides the line into subsections than chooses the first and last subsection to make the new line
  var points = splitEqIntoPoints(point1, point2, (shrinkVal * 2 + 1));
  var smalPoint1 = points[1];
  var smalPoint2 = points[points.length - 2];
  console.log([[point1, point2], [smalPoint1, smalPoint2]]);
  return [smalPoint1, smalPoint2];
}

function findIntrsctBtwLines(points1, points2){ // where points1 and 2 are 2 line defining sets of points
  var line1 = calcEqWith(points1[0][0], points1[0][1], points1[1][0], points1[1][1]);
  var line2 = calcEqWith(points2[0][0], points2[0][1], points2[1][0], points2[1][1]);
  // Using algebra to set the equations equal to each other than solve for the intersection
  // 5x+11=3x-12
  var calc1 = line1[0] - line2[0];
  var calc2 = line2[1] - line1[1];
  //2x = -33
  var x = calc2/calc1;
  var y = x * line1[0] + line1[1];
  return [x,y];
}


function testPoint(x,y){
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.stroke();


  }
}
function testEquation(point1, point2){
  var canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.moveTo(point1[0], point1[1]);
    ctx.lineTo(point2[0], point2[1])
    ctx.stroke();
  }


}
