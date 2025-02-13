
let onKey = false
let currentKey;
let defaultCol = [255]
let keyboardOn = true
let initiated = false
let outerPoints = [];
let innerPoints = [];
let mainWindow;
let capsLock = true
let keyboardType = 0 // 0 is Letters, 1 is Mathematical, 2 is Special Keys
let numDots;
let resetKey;
let mathSymbols = [43, 45, 42, 47, 61, 37, 40, 41]
let specialSymbols = [35, 39, 59, 44, 46, 33, 64, 36, 94, 38, 95, 126, 34, 58, 60, 62, 63];
let mathIcons = ["add", "minus", "multiply", "slash", "equals", "5", "9", "0"]//[43, 45, 42, 47, 61, 37, 40, 41]
let specialIconsUK = ["number_sign", "quote", "semicolon", "comma", "period", "1", "quote", "4", "6 ", "7", "minus", "number_sign", "2", "semicolon", "comma", "period", "slash"]
let specialIconsUS = ["number_sign", "quote", "semicolon", "comma", "period", "1", "quote", "4", "6", "7", "minus", "at", "2", "semicolon", "comma", "period", "slash"]
let specialIcons = ["number_sign", "quote", "semicolon", "comma", "period", "1", "quote", "4", "6 ", "7", "minus", "number_sign", "2", "semicolon", "comma", "period", "slash"]
let resetTrigger = true
let resetRadius = 50
let circleRadius = 50
let keyArray;
let hLAngle = 25 // Controls the angle of the Highlighted Characters!
let hLCount = 5 // Controls the amount of Highlighted Characters!
let noHAngle;
let angleStack;
let fullStack;
let angleArraySum;
let keyArrayRadian;
let angleArray;
let zoomSpeed;
let outerRadius;
let highlightCol;
let keyboardCol;
let keyboardTrans;
let checkArray;
let newInner;
let newOuter;
let prevKeyArray;
let keyInitiated;
let count;

function setup() {
    let canvas = createCanvas(400, 400);
    textFont('Verdana')
    canvas.parent('sketch-container')
    clear();
    textAlign(CENTER, CENTER); // Center align text horizontally and vertically
    textSize(20); // Set text size for the letters
    angleMode(RADIANS);
    numDots = 32
    zoomSpeed = 0.4
    outerRadius = 150;
    highlightCol = "#ff9a9a"
    keyboardCol = 'white'
    keyboardTrans = 122.5
    angleArray = []
    checkArray = []
    prevKeyArray = []
    keyInitiated = false

  }
  
  function draw() {
    clear()
    if (initiated === false){ // This calculates the default angle for all of them, makes it adaptable for keyboard with varying key armounds. or numDots.
      angleArray = []
      for (let i = 0; i < numDots; i++){
        angleArray.push(360/numDots)
      }
    }
  
    noHAngle = (360 - (hLAngle * hLCount)) / (numDots - hLCount)
    hLAngleO = hLAngle * (PI / 180);
    noHAngleO = noHAngle * (PI / 180);

    // These are the variables that get reset on every draw call.
 // Distance from the center for outer circle
    let innerRadius = outerRadius - 35 ; // Distance from the center for inner circle previously was shared with 1.5
    let angleStep = TWO_PI / numDots; // Angle between each dot
    keyArray = []

    // This if statement initiates the position of the keys

    if (initiated === false){
      for (let i = 0; i < numDots; i++) {
        let angle = i * angleStep;
        let x = width / 2 + outerRadius * cos(angle);
        let y = height / 2 + outerRadius * sin(angle);
        outerPoints.push({ x, y });
      }

      // Calculate and store the points for the inner circle
      for (let i = 0; i < numDots; i++) {
        let angle = i * angleStep;
        let x = width / 2 + innerRadius * cos(angle);
        let y = height / 2 + innerRadius * sin(angle);
        innerPoints.push({ x, y });
      }
      //initiated = true
    }
    
    //sort the points from nearest to furthest.
    if (initiated === false){
      for (let i = 0; i < numDots; i++){
        let middleDistanceX
        let middleDistanceY
        if (i === 0){
          middleDistanceX = (innerPoints[i].x + innerPoints[numDots-1].x) / 2
          middleDistanceY = (innerPoints[i].y + innerPoints[numDots-1].y) / 2
        } else {
          middleDistanceX = (innerPoints[i].x + innerPoints[i-1].x) / 2
          middleDistanceY = (innerPoints[i].y + innerPoints[i-1].y) / 2
        }
        keyArray.push([i, dist(mouseX, mouseY, middleDistanceX, middleDistanceY), (360/numDots)])
        initiated = true
      }
    } else {
      for (let i = 0; i < numDots; i++){
        let middleDistanceX
        let middleDistanceY
        if (i === 0){
          middleDistanceX = (newInner[i].x + newInner[numDots-1].x) / 2
          middleDistanceY = (newInner[i].y + newInner[numDots-1].y) / 2
        } else {
          middleDistanceX = (newInner[i].x + newInner[i-1].x) / 2
          middleDistanceY = (newInner[i].y + newInner[i-1].y) / 2
        }
        keyArray.push([i, dist(mouseX, mouseY, middleDistanceX, middleDistanceY), (360/numDots)])
      }
    }

    newInner = []
    newOuter = []

    keyArray.sort(([, valueB], [, valueA]) => valueB - valueA);
    const mouseDistance = dist(mouseX, mouseY, width/2, height/2)

    // Key sensitivity , this controls how many keys have to be different for it to change the angles. ------- For next release
    /*
    if (keyInitiated === true){
      count = 0
      for (let i = keyArray.length - 1; i >= keyArray.length - 5; i--){
        for (let x = keyArray.length - 1; x >= keyArray.length - 5; x--){
          if (keyArray[i][0] === prevKeyArray[x][0]){
            count++
          }
        }
      }
      if (count >= 2){
        keyArray = prevKeyArray
      }
    }
    console.log(count)
    prevKeyArray = keyArray
    keyInitiated = true
    */
    // -----------------------------------------------------------------------------------------------------
    
    let newHangle;
    let newnoHangle;

    angleArraySum = angleArray.reduce((a, b) => a + b , 0) // Attempting to remove the adjustment period.
    // Calculate the angle of the keys and send the x, y coordinates for the inner circle and the outer.
    angleStack = 0
    if (initiated === true){
      let isHighlight;
      let angle;
      for (let i = 0; i < numDots; i++) {
        isHighlight = false
      for (let x = 0; x < hLCount; x++){ // 20 goes in, checks if it is equal to the nearest 5 index value in the keyArray list
          newHangle = hLAngle
        if (i === keyArray[x][0]){
          if (fullStack){
            if (angleArray[i] < newHangle && angleArray.reduce((a, b) => a + b , 0) < 360){
              angleArray[i] += zoomSpeed //* ((numDots - hLCount) / hLCount) // i is going to get the index of the key, not the keyArray after being sorted, may need a seperate array that doesn't get sorted
            }
            if (angleArray[i] > newHangle && angleArray.reduce((a, b) => a + b , 0) > 356){
              angleArray[i] -= zoomSpeed // * ((numDots - hLCount) / hLCount) // i is going to get the index of the key, not the keyArray after being sorted, may need a seperate array that doesn't get sorted
            }
          } else {
            if (angleArray[i] < newHangle){
              angleArray[i] += zoomSpeed //* ((numDots - hLCount) / hLCount) // i is going to get the index of the key, not the keyArray after being sorted, may need a seperate array that doesn't get sorted
            }
            if (angleArray[i] > newHangle){
              angleArray[i] -= zoomSpeed // * ((numDots - hLCount) / hLCount) // i is going to get the index of the key, not the keyArray after being sorted, may need a seperate array that doesn't get sorted
            }
          }
          if (angleArray[i] !== newHangle){
            if (!checkArray.includes(i)){
              checkArray.push(i)
            }
          } else {
            if (checkArray.includes(i)){
              let checkIndex = checkArray.indexOf(i)
              checkArray.splice(checkIndex, 1)
            }
          }
          keyArrayRadian = angleArray[i] * (PI / 180)
          angle = angleStack + keyArrayRadian

          angleStack += keyArrayRadian
          isHighlight = true
        }
      }
      newnoHangle = noHAngle
      if (isHighlight === false){
        if (fullStack){
          if (angleArray[i] < newnoHangle && angleArray.reduce((a, b) => a + b , 0) < 360){
            angleArray[i] += zoomSpeed
          }
          if (angleArray[i] > newnoHangle && angleArray.reduce((a, b) => a + b , 0) > 356){
            angleArray[i] -= zoomSpeed //((numDots - hLCount) / hLCount)
          }
        } else {
          if (angleArray[i] < newnoHangle){
            angleArray[i] += zoomSpeed
          }
          if (angleArray[i] > newnoHangle){
            angleArray[i] -= zoomSpeed //((numDots - hLCount) / hLCount)
          }
        }
        if (angleArray[i] !== newnoHangle){
          if (!checkArray.includes(i)){
            checkArray.push(i)
          }
        }else {
          if (checkArray.includes(i)){
            let checkIndex = checkArray.indexOf(i)
            checkArray.splice(checkIndex, 1)
          }
        }

        keyArrayRadian = angleArray[i] * (PI / 180)
        angle = angleStack + keyArrayRadian;
        angleStack += keyArrayRadian
      }
      let x = width / 2 - outerRadius * cos(angle);
      let y = height / 2 - outerRadius * sin(angle);
      newOuter.push({ x, y });
      x = width / 2 - innerRadius * cos(angle);
      y = height / 2 - innerRadius * sin(angle);
      newInner.push({ x, y });
    }
    //console.log(angleArraySum)
    fullStack = angleStack

    // Draw rectangles and add letters
    for (let i = 0; i < numDots; i++) {
      // Goes through every dot and then we find the middle point between them
      let outer1 = newOuter[i];
      let outer2 = newOuter[(i + 1) % numDots];
      let inner1 = newInner[i];
      let inner2 = newInner[(i + 1) % numDots];
      let midX = (inner1.x + inner2.x) / 2
      let midY = (inner1.y + inner2.y) / 2

      // Set color based on intersection
      if (dist(mouseX, mouseY, midX, midY) < circleRadius/2){
        if (currentKey === i){ // The current Key needs to be set in the if statement below...
          let newHighlightCol = color(highlightCol)
          newHighlightCol.setAlpha(150)
          fill(newHighlightCol); // Purple glow color with some transparency
        }

        // If the mouse is not already on a key then it will run, if it's already on a key then it will have already run previously and will not run to stop spam
        if (!onKey){
          if (i < (numDots - 6) && keyboardOn === true && keyboardType === 0){
            if (capsLock === false){
            setTimeout(() => {
              //robot.setClipboard(japanese[0])
              //keySender.sendKey(String.fromCharCode(65 + i).toLowerCase()); // Sends lower case if the capsLock is false
              //keySender.sendKey('ctrl+v')
            }, 100);
            } else {
              setTimeout(() => {
                //keySender.sendKey(String.fromCharCode(65 + i)); // Sends the higher case if the capsLock is true
              }, 100);
            } // 
          } else if (i < (numDots - 6) && keyboardOn === true && keyboardType === 1){ // Changes to the math keyboard
            setTimeout(() => {
              if (i < 10){
                //keySender.sendKey(String.fromCharCode(48 + i));
              } else if(i < 15) {
                //keySender.sendKey(mathIcons[i - 10]); // This is now working
              }else {
                //keySender.sendCombination(['shift', mathIcons[i - 10]])
              }
            }, 100);
          } else if (i < (numDots - 6) && keyboardOn === true && keyboardType === 2){ // Changes to the math keyboard
            setTimeout(() => {
              if(i < 5) {
                //keySender.sendKey(specialIcons[i]);
              } else if(i < 17) {
                //keySender.sendCombination(['shift', specialIcons[i]]);
              }
            }, 100);
          }
           else if(i===numDots - 6){
            setTimeout(() => {
              //keySender.sendKey('space');
            }, 100);
          } else if (i === numDots - 5 && keyboardOn === true){ // Switches the capsLock on and off

            switch (capsLock) {
              case true:
                capsLock = false
                break
              case false:
                capsLock = true
                break
            }
          }
            else if(i===numDots - 4){
              setTimeout(() => {
                //keySender.sendKey('back_space');
              }, 100);

            } else if(i === numDots - 3 && resetTrigger === true){
              if (keyboardType === 0){
                keyboardType = 1
                numDots = 24
                initiated = false
                keyInitiated = false
                innerPoints = []
                outerPoints = []
                resetTrigger = false
                break
              } else if (keyboardType === 1 && resetTrigger === true){
                keyboardType = 2
                numDots = 23
                initiated = false
                keyInitiated = false
                innerPoints = []
                outerPoints = []
                resetTrigger = false
                break
              } else if (keyboardType === 2 && resetTrigger === true){
                keyboardType = 0
                numDots = 32
                initiated = false
                keyInitiated = false
                innerPoints = []
                outerPoints = []
                keyboardType = 0
                resetTrigger = false
                break
              }
              resetKey = true
            }
            else if(i === numDots - 2){
              //keySender.sendKey('enter')
            }

           else if ( i === numDots - 1) {
            switch (keyboardOn) {
              case true:
                keyboardOn = false
                break
              case false:
                keyboardOn = true
                break
            }
          }
          onKey = true
          if (resetKey === true){
            currentKey = null
            onKey = false
          } else {
            currentKey = i
          }
          resetKey = false

        }
      } else {
        if (keyboardOn === false){
          defaultCol = '#FF0000'
        } else {
          defaultCol = keyboardCol
        }
        let newKeyTrans = color(defaultCol)
        newKeyTrans.setAlpha(keyboardTrans)
        fill(newKeyTrans); // Default color

      }

      if (dist(mouseX, mouseY, width/2, height/2) < (resetRadius/2 + circleRadius/2)){
        resetTrigger = true
      }

      if (i === currentKey && (dist(mouseX, mouseY, midX, midY) >= circleRadius/2)){
        onKey = false
        currentKey = null
      }

      if (i === numDots - 1){
        fill(255, 93, 93)
      }

      // Draw a quad using these four points
      quad(
        outer1.x, outer1.y, // Outer point 1
        outer2.x, outer2.y, // Outer point 2
        inner2.x, inner2.y, // Inner point 2
        inner1.x, inner1.y  // Inner point 1
      );
  
      // Calculate center position for each quad
      let centerX = (outer1.x + outer2.x + inner1.x + inner2.x) / 4;
      let centerY = (outer1.y + outer2.y + inner1.y + inner2.y) / 4;
      
      let letter;

      // Below just shows the letters that correspond to the type of keyboard they are using.

      if (keyboardType === 0){
        if (capsLock === true){
        letter = String.fromCharCode(65 + i); // ASCII 'A' is 65
      } else if (capsLock === false) {
        letter = String.fromCharCode(97 + i); // ASCII 'a' is 97
      }
      }
      if (keyboardType === 1){
        if (i < 10){
          letter = String.fromCharCode(48 + i);
        } else if (i < 18)
          letter = String.fromCharCode(mathSymbols[i-10]);
      }
      if (keyboardType === 2){
        if (i < specialIcons.length){
          letter = String.fromCharCode(specialSymbols[i])
        }

      }
      fill(0)
      if (i < numDots-6){
        text(letter, centerX, centerY); // Draw letter at center of quad
      }
      if (i === numDots-6){
        text(String.fromCodePoint(0x2423), centerX, centerY) // This represents caps locks being toggled
      }      
      if (i === numDots-5){
        text('^', centerX, centerY) // This represents caps locks being toggled
      }
      if (i === numDots-4){
        text('<', centerX, centerY) // This represents a back space
      }
      if (i === numDots-3){
        text('...', centerX, centerY) // This represents special characters
      }      
      if (i === numDots-2){
        text(String.fromCodePoint(0x23CE), centerX, centerY) // This represents the enter button
      }
      fill(255)
    }
    fill(255, 93, 93, 255)
    circle(width/2, height/2, resetRadius)
    fill(0)
    circle(mouseX, mouseY, circleRadius)
  }
  }
