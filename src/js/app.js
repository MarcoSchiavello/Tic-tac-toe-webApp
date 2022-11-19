import { TicTacToeWithAI } from './ticTacToe.js';
import { $ } from './utilities.js';


const ticTacToe = new TicTacToeWithAI('ticTacToe');


$('#ticTacToe').querySelectorAll('div[cell-num]').forEach(cell => {
    cell.onclick = e => {
        ticTacToe.select(+cell.getAttribute('cell-num'));
        ticTacToe.changeStatus(false);
        ticTacToe.AIselect();
        ticTacToe.changeStatus(true);
    };
});