import { $, createMatrix } from './utilities.js';

const SIZE = 3;
const icons = {
    'X': `
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            width="30.121px" height="30.12px" viewBox="0 0 30.121 30.12" style="enable-background:new 0 0 30.121 30.12;"
            xml:space="preserve" class="tic-tac-toe__cross">
            <path d="M29.095,20.118c1.365,1.364,1.365,3.582,0,4.948l-4.027,4.027c-0.684,0.684-1.58,1.025-2.475,1.025
                c-0.896,0-1.792-0.344-2.477-1.025l-5.056-5.058l-5.058,5.06c-0.684,0.684-1.58,1.024-2.475,1.024s-1.792-0.343-2.475-1.024
                l-4.027-4.027c-1.367-1.367-1.367-3.584,0-4.949l5.058-5.059l-5.058-5.058c-1.367-1.367-1.367-3.584,0-4.949l4.027-4.027
                c1.366-1.367,3.583-1.367,4.949,0l5.058,5.055l5.057-5.057c1.367-1.367,3.584-1.367,4.95,0l4.027,4.027
                c1.365,1.365,1.365,3.582,0,4.949l-5.059,5.058L29.095,20.118z"/>
        </svg>
    `,
    'O': `
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        width="94px" height="94px" viewBox="0 0 94 94" style="enable-background:new 0 0 94 94;" xml:space="preserve" class="tic-tac-toe__circle">
            <path d="M47,94C21.084,94,0,72.916,0,47S21.084,0,47,0s47,21.084,47,47S72.916,94,47,94z M47,12.186
                c-19.196,0-34.814,15.618-34.814,34.814c0,19.195,15.618,34.814,34.814,34.814c19.195,0,34.814-15.619,34.814-34.814
                C81.814,27.804,66.195,12.186,47,12.186z"/>
        </svg>
    `,
    ' ': ''
}

class TicTacToeWithAI {
    #turn;
    #divElement;
    #fieldMatrix;
    #status = true;

    constructor(divElementId) {
        this.#divElement = $('#' + divElementId);
        this.#fieldMatrix = createMatrix(SIZE, SIZE, ' ');
        this.#turn = 0;
        
        for(let i = 0; i < SIZE * SIZE; i++)
            this.#divElement.innerHTML += `<div cell-num="${i}"></div>`;   

        console.log(this.#fieldMatrix);
        this.#updateRender();
    }

    changeStatus(status) {
        this.#divElement.querySelectorAll('div[cell-num]').forEach(cell => {
            if(cell.getAttribute('clicked') === 'true')
                return;

            if(this.#status)
                cell.classList.add('disable');
            else 
                cell.classList.remove('disable');

        });

        this.#status = status;
    }

    get turn() {
        return this.#turn + 1;
    }

    #cellNuberToCoords(cellNum) {
        return {
            row: Math.floor(cellNum / SIZE),
            col: cellNum - (Math.floor(cellNum / SIZE) * SIZE)
        }
    }

    #coordsToCellNuber(row, col) {
        return (row * SIZE) + col;
    }

    #updateRender() {
        this.#divElement.querySelectorAll('div[cell-num]').forEach(cell => {
            const coords = this.#cellNuberToCoords(+cell.getAttribute('cell-num'));
            cell.innerHTML = icons[this.#fieldMatrix[coords.row][coords.col]];
        });
    }

    select(cellNum, character = 'X') {
        const coords = this.#cellNuberToCoords(cellNum);
        this.#fieldMatrix[coords.row][coords.col] = character;
        this.#updateRender();
        this.#turn++;
        
        const cellSelected = this.#divElement.querySelector(`div[cell-num="${cellNum}"]`);
        cellSelected.setAttribute('clicked', 'true');
        cellSelected.classList.add('disable');
    }

    AIselect() {
        const selectionPos = this.#minimax(Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER).actionPosition;
        this.select(this.#coordsToCellNuber(selectionPos.row, selectionPos.col), 'O');
    }

    #nthBlankPosition(blankNum = 1) {
        for(let i = 0; i < SIZE; i++)
            for(let j = 0; j < SIZE; j++)
                if(this.#fieldMatrix[i][j] === ' ') {
                    blankNum--;
                    if(blankNum <= 0)
                        return {
                            row: i,
                            col: j
                        };
                }
               
        return { 
            row: -1, 
            col: -1 
        };
    }

    checkWinner() {
        for(let i = 0; i < SIZE; i++) {
            if(this.#fieldMatrix[i][0] === this.#fieldMatrix[i][1] && this.#fieldMatrix[i][1] === this.#fieldMatrix[i][2] && this.#fieldMatrix[i][2] !== ' ')
              return 2 * (this.#fieldMatrix[i][1] === 'O') + (this.#fieldMatrix[i][1] === 'X');
        
            if(this.#fieldMatrix[0][i] === this.#fieldMatrix[1][i] && this.#fieldMatrix[1][i] === this.#fieldMatrix[2][i] && this.#fieldMatrix[2][i] !== ' ')
              return 2 * (this.#fieldMatrix[1][i] === 'O') + (this.#fieldMatrix[1][i] === 'X');
          }
        
          if(((this.#fieldMatrix[0][0] === this.#fieldMatrix[1][1] && this.#fieldMatrix[1][1] === this.#fieldMatrix[2][2])
            ||
            (this.#fieldMatrix[0][2] === this.#fieldMatrix[1][1] && this.#fieldMatrix[1][1] === this.#fieldMatrix[2][0])) && this.#fieldMatrix[1][1] !== ' ')
            return (2 * (this.#fieldMatrix[1][1] === 'O') + (this.#fieldMatrix[1][1] === 'X'));
        
          return 0;
    }

    #minimax(high, alpha, beta, maximize = true) {
        const evaluation = this.checkWinner();

        if((this.#nthBlankPosition().row === -1) || evaluation != 0 || !high) {
            return {
                value: evaluation == 2 ? 1 : (evaluation == 1 ? -1 : 0) ,
                actionPosition: { row: -1, col: -1 }
            };
        }
            
        let childNum = 0;
        let maxEvalRecord = { value: Number.MIN_SAFE_INTEGER, actionPosition: { row: -1, col: -1 } }; 
        let minEvalRecord = { value: Number.MAX_SAFE_INTEGER, actionPosition: { row: -1, col: -1 } };
        let nextPos;
    
        while((nextPos = this.#nthBlankPosition(++childNum)).row !== -1) {
            this.#fieldMatrix[nextPos.row][nextPos.col] = maximize ? 'O' :'X';
            
            const evalRecord = this.#minimax(high - 1, alpha, beta, !maximize);
            evalRecord.actionPosition = { row: nextPos.row, col: nextPos.col };
    
            maxEvalRecord = (evalRecord.value > maxEvalRecord.value) ? evalRecord : maxEvalRecord;
            minEvalRecord = (evalRecord.value < minEvalRecord.value) ? evalRecord : minEvalRecord;
    
            if(maximize)
                alpha = alpha > evalRecord.value ? alpha : evalRecord.value;
            else
                beta = beta > evalRecord.value ? evalRecord.value : beta;
    
            this.#fieldMatrix[nextPos.row][nextPos.col] = ' ';
    
            if(beta <= alpha)
                break;
        }
    
        return maximize ? maxEvalRecord : minEvalRecord;
    } 
}

export {
    TicTacToeWithAI
}