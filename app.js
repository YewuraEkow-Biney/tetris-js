document.addEventListener('DOMContentLoaded', ()=>{
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const ScoreDisplay = document.querySelector('#score');
    const StartBtn = document.querySelector('#start-button');
    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ];

    //Tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];

    const zTetromino = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ];

    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ];

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ];

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ];

    const Tetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPos = 4;
    let currentRot = 0;
    let random =Math.floor(Math.random()*Tetrominoes.length);

    let current = Tetrominoes [random][currentRot];
    
    function draw() {
        current.forEach(index =>{
            squares[currentPos + index].classList.add('tetromino');
            squares[currentPos + index].style.backgroundColor = colors[random];
        });
    };
    
    function undraw() {
        current.forEach(index =>{
            squares[currentPos + index].classList.remove('tetromino');
            squares[currentPos + index].style.backgroundColor = '';
        }); 
    };

    //timerId = setInterval(moveDown, 1000);

    function control(e){
        if(e.keyCode === 37){
            moveLeft();
        }else if(e.keyCode === 38){
            rotate();
        }else if(e.keyCode === 39){
            moveRight();
        }else if(e.keyCode === 40){
            moveDown()
        }
    }

    document.addEventListener('keyup', control);

    function moveDown(){
        undraw();
        currentPos += width;
        draw();
        halt();
    }

    function halt(){
        if(current.some(index => squares[currentPos + index + width].classList.contains('wall'))){
            current.forEach(index => squares[currentPos + index].classList.add('wall'));
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * Tetrominoes.length);
            current = Tetrominoes[random][currentRot]
            currentPos = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    function moveLeft(){
        undraw();
        const isAtleftEdge = current.some(index => (currentPos + index) % width === 0);

        if(!isAtleftEdge){
            currentPos -= 1;
        };

        if(current.some(index => squares [currentPos + index].classList.contains('wall'))){
            currentPos += 1;
        }

        draw();
    }

    function moveRight(){
        undraw();
        const isAtrightEdge = current.some(index => (currentPos + index) % width === width-1);

        if(!isAtrightEdge){
            currentPos += 1;
        };

        if(current.some(index => squares [currentPos + index].classList.contains('wall'))){
            currentPos -= 1;
        }

        draw();
    }

    function rotate(){
        undraw();
        currentRot++;
        if(currentRot === current.length){
            currentRot = 0;
        }

        current = Tetrominoes[random][currentRot];
        draw();
    }

    const displayTetromino = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    const displayIndex = 0;
    

    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2],
        [0, displayWidth, displayWidth+1, displayWidth*2+1],
        [1, displayWidth, displayWidth+1, displayWidth+2],
        [0, 1, displayWidth, displayWidth+1],
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
    ];

    function displayShape(){
        displayTetromino.forEach(square =>{
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        });
        upNextTetrominoes[nextRandom].forEach(index =>{
            displayTetromino[displayIndex + index].classList.add('tetromino');
            displayTetromino[displayIndex + index].style.backgroundColor = colors[nextRandom];
        }); 
    }

    StartBtn.addEventListener('click', () =>{
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random()*Tetrominoes.length);
            displayShape();
        }
        
    });

    function addScore(){
        for(let i = 0; i<199; i +=width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

            if(row.every(index => squares[index].classList.contains('wall'))){
                score += 10;
                ScoreDisplay.innerHTML = score;
                row.forEach(index =>{
                    squares[index].classList.remove('wall');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                });
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
            
        }
    }

    function gameOver(){
        if(current.some(index => squares[currentPos + index].classList.contains('wall'))){
            ScoreDisplay.innerHTML = 'GAME OVER';
            clearInterval(timerId);
        }
    }

});

