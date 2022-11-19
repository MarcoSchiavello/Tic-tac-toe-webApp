import { TicTacToeWithAI } from './ticTacToe.js';
import { $ } from './utilities.js';


const ticTacToe = new TicTacToeWithAI('ticTacToe');

$('#ticTacToe').querySelectorAll('div[cell-num]').forEach(cell => {
    cell.addEventListener('click', e => {
        ticTacToe.select(+cell.getAttribute('cell-num'));
        ticTacToe.AIselect();
    });
});