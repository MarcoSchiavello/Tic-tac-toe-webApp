import TicTacToeWithAI from './ticTacToe.js';
import { $ } from './utilities.js';


const ticTacToe = new TicTacToeWithAI('ticTacToe');


$('#ticTacToe').querySelectorAll('div[cell-num]').forEach(cell => {
    cell.onclick = e => {
        let winner;
        ticTacToe.select(+cell.getAttribute('cell-num'));
        if(winner = ticTacToe.checkWinner())  {
            displayWinner(winner);
            return;
        }
        ticTacToe.AIselect();
        if(winner = ticTacToe.checkWinner()) 
            displayWinner(winner);
    };
});

$('#reset').addEventListener('click',e => { 
    ticTacToe.reset();
    $('.winner-page').style.display = 'none';
});

function displayWinner(winner) {
    $('#winner').innerHTML = 'Hai ' + (winner === 2 ? 'perso' : winner === 1 ? 'vinto' : 'pareggiato');
    $('.winner-page').style.display = 'flex';
}