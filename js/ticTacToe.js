import { $ } from './utilities.js';
import Matrix from './matrix.js';

const SIZE = 3;
const icons = {
    'X': `
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="tic-tac-toe__cross">
        <line stroke-width="4" x1="2" x2="30" y1="2" y2="30"/><line stroke-width="4" x1="2" x2="30" y1="30" y2="2"/>
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
    #lock = false;

    constructor(divElementId) {
        this.#divElement = $('#' + divElementId);
        this.#fieldMatrix = new Matrix(SIZE, SIZE, ' ');
        this.#turn = 1;
        
        for(let i = 0; i < SIZE * SIZE; i++)
            this.#divElement.innerHTML += `<div cell-num="${i}"></div>`;   

        this.#updateRender();
    }

    lockBoard(lock) {
        this.#divElement.querySelectorAll('div[cell-num]').forEach(cell => {
            if(cell.getAttribute('clicked') === 'true')
                return;

            if(lock)
                cell.classList.add('disable');
            else 
                cell.classList.remove('disable');

        });

        this.#lock = lock;
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
        $('#turn').innerHTML = this.#turn;
        this.#divElement.querySelectorAll('div[cell-num]').forEach(cell => {
            const coords = this.#cellNuberToCoords(+cell.getAttribute('cell-num'));
            cell.innerHTML = icons[this.#fieldMatrix.matrix[coords.row][coords.col]];
        });
    }

    reset() {
        this.#turn = 1;
        this.#fieldMatrix.clear(' ');
        this.#updateRender();
        this.#divElement.querySelectorAll('div[clicked="true"]').forEach(cell => {
            cell.removeAttribute('clicked', 'false');
        });
        this.lockBoard(false);
    }

    select(cellNum, character = 'X') {
        const coords = this.#cellNuberToCoords(cellNum);
        this.#fieldMatrix.matrix[coords.row][coords.col] = character;
        this.#updateRender();
        this.#turn++;
        
        const cellSelected = this.#divElement.querySelector(`div[cell-num="${cellNum}"]`);
        cellSelected.setAttribute('clicked', 'true');
        cellSelected.classList.add('disable');

        const winner = this.checkWinner();
        if(winner !== 0)
            this.lockBoard(true);
    }

    AIselect() {
        const selectionPos = this.#minimax(Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER).actionPosition;
        this.select(this.#coordsToCellNuber(selectionPos.row, selectionPos.col), 'O');
    }

    #nthBlankPosition(blankNum = 1) {
        for(let i = 0; i < SIZE; i++)
            for(let j = 0; j < SIZE; j++)
                if(this.#fieldMatrix.matrix[i][j] === ' ') {
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

    checkWinner(position = false) {
        let winner;
        for(let i = 0; i < SIZE; i++) {
            if(this.#fieldMatrix.matrix[i][0] === this.#fieldMatrix.matrix[i][1] &&
               this.#fieldMatrix.matrix[i][1] === this.#fieldMatrix.matrix[i][2] && 
               this.#fieldMatrix.matrix[i][2] !== ' ') {
                winner = 2 * (this.#fieldMatrix.matrix[i][1] === 'O') + (this.#fieldMatrix.matrix[i][1] === 'X');
                return position ? {position: [90, i], winner: winner} : winner;
            }
        
            if(this.#fieldMatrix.matrix[0][i] === this.#fieldMatrix.matrix[1][i] &&
               this.#fieldMatrix.matrix[1][i] === this.#fieldMatrix.matrix[2][i] &&
               this.#fieldMatrix.matrix[2][i] !== ' ') {
                winner = 2 * (this.#fieldMatrix.matrix[1][i] === 'O') + (this.#fieldMatrix.matrix[1][i] === 'X');
                return position ? {position: [null, i], winner: winner} : winner;
            }
        }
        
        if((this.#fieldMatrix.matrix[0][0] === this.#fieldMatrix.matrix[1][1] && 
            this.#fieldMatrix.matrix[1][1] === this.#fieldMatrix.matrix[2][2]) &&
            this.#fieldMatrix.matrix[1][1] !== ' ') {
            winner = 2 * (this.#fieldMatrix.matrix[1][1] === 'O') + (this.#fieldMatrix.matrix[1][1] === 'X');
            return position ? {position: [-45, null], winner: winner} : winner;
        }

        if(((this.#fieldMatrix.matrix[0][2] === this.#fieldMatrix.matrix[1][1] && 
             this.#fieldMatrix.matrix[1][1] === this.#fieldMatrix.matrix[2][0])) &&
             this.#fieldMatrix.matrix[1][1] !== ' ') {
            winner = 2 * (this.#fieldMatrix.matrix[1][1] === 'O') + (this.#fieldMatrix.matrix[1][1] === 'X');
            return position ? {position: [45, null], winner: winner} : winner;
        }
     
        if((this.#nthBlankPosition().row === -1))
            return position ? {position: null, winner: 3} : 3;
    
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
            this.#fieldMatrix.matrix[nextPos.row][nextPos.col] = maximize ? 'O' :'X';
            
            const evalRecord = this.#minimax(high - 1, alpha, beta, !maximize);
            evalRecord.actionPosition = { row: nextPos.row, col: nextPos.col };
    
            maxEvalRecord = (evalRecord.value > maxEvalRecord.value) ? evalRecord : maxEvalRecord;
            minEvalRecord = (evalRecord.value < minEvalRecord.value) ? evalRecord : minEvalRecord;
    
            if(maximize)
                alpha = alpha > evalRecord.value ? alpha : evalRecord.value;
            else
                beta = beta > evalRecord.value ? evalRecord.value : beta;
    
            this.#fieldMatrix.matrix[nextPos.row][nextPos.col] = ' ';
    
            if(beta <= alpha)
                break;
        }
    
        return maximize ? maxEvalRecord : minEvalRecord;
    } 
}

export default TicTacToeWithAI;
