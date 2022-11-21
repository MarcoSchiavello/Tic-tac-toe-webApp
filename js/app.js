import TicTacToeWithAI from './ticTacToe.js';
import { $, $all } from './utilities.js';


const ticTacToe = new TicTacToeWithAI('ticTacToe');


$('#ticTacToe').querySelectorAll('div[cell-num]').forEach(cell => {
    cell.onclick = e => {
        let winner;
        ticTacToe.select(+cell.getAttribute('cell-num'));
        if(winner = ticTacToe.checkWinner(true))  {
            displayWinner(winner);
            return;
        }
        ticTacToe.AIselect();
        if(winner = ticTacToe.checkWinner(true)) 
            displayWinner(winner);
    };
});

$('#reset').addEventListener('click',e => { 
        ticTacToe.reset();
        $('#winner').innerHTML = '';
        $('.slider__body').style.right = '0';
        resetWinnerLine();
});


function displayWinner(winner) {
    $('#winner').innerHTML = 'HAI ' + (winner.winner === 2 ? 'PERSO' : winner.winner === 1 ? 'VINTO' : 'PAREGGIATO');
    $('#winner').style.color = 'var(--clr-' + (winner.winner === 2 ? 'circle' : winner.winner === 1 ? 'cross' : 'draw') + ')';
    $('.slider__body').style.right = '-100%';
    moveWinnerLine(winner);
}

function moveWinnerLine(winner) {
    if(winner.position === null)
        return;

    const line = $('.winner-line');
    line.style.transform = 'translateY(-50%)' + ( winner.position[0] !== null ? ' rotate(' + winner.position[0] + 'deg' : ')');
    if(winner.position[1] !== null)
        line.style[winner.position[0] === 90 ? 'top' : 'left'] = ( (winner.position[1] * 10) + 5 + winner.position[1] - (winner.position[0] === null)/2) + 'vh';

    line.style.background = 'var(--clr-' + (winner.winner === 1 ? 'cross' : 'circle') + ')';
    setTimeout(() => {
        line.style.transition = '0.4s ease';
        line.style.height = Math.abs(winner.position[0]) === 45 ? '150%' : '115%';
    }, 4);
    
}

function resetWinnerLine() {
    const line = $('.winner-line');
    line.style.transform = 'translateY(-50%)';
    line.style.top = '50%';
    line.style.left = '50%';
    line.style.height = '0';
    line.style.transition = 'none';
}
