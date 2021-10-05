import Square from "./Square";

function Board({ squares, winLine, onClick, numberRow, numberCol }) {
  const cell = 100/numberCol;

  return (
    <div className="board">
      {[...Array(numberCol * numberRow).keys()].map((i) =>
        renderSquare(
          squares[i] ? squares[i] : "",
          i,
          winLine && winLine.includes(i),
          onClick,
          cell
        )
      )}
    </div>
  );
}

/**
 * Hàm renderSquare thực hiện ghi giá trị và tô đậm ô nếu thắng 
 * @param {*} value - giá trị của ô (X, 0, '')
 * @param {*} i - vị trí ô 
 * @param {*} isWinLane - (Thắng, Chưa thắng, Hòa) 
 * @param {*} onClick - Hàm thực hiện khi click vào ô
 * @returns JSX của ô
 */

function renderSquare(value, i, isWinLane, onClick, cell) {
  return (
    <Square value={value} highlight={isWinLane} onClick={() => onClick(i)} cell={cell}/> 
  ); 
}

export default Board;
