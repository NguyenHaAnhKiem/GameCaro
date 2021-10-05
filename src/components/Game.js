import React, { useState } from "react";
import Board from "./Board";
import "../index.css";

function Game() {
  const [numberRow, setNumberRow] = useState(5);
  const [numberCol, setNumberCol] = useState(5);
  const [history, setHistory] = useState([
    {
      squares: Array(numberCol * numberCol).fill(null),
      col: null,
      row: null,
    },
  ]);
  const [xIsNext, setXIsNext] = useState(true);
  const [stepNumber, setStepNumber] = useState(0);
  const [isArrange, setIsArrange] = useState(false);

  
  const currentHistory = history;
  const current = currentHistory[stepNumber];
  const winner = calculateWinner(
    current.squares,
    numberRow,
    numberCol,
    current.row - 1,
    current.col - 1
  );

  const moves = history.map((step, move) => {
    let desc = move
      ? "Row " + history[move].row + " - Col " + history[move].col + " #" + move
      : "Go to game start";

    if (move === stepNumber) {
      desc = <b style={{ color: "#000" }}>{desc}</b>;
    }

    return (
      <button
        key={move}
        className="button-move"
        onClick={() => jumpTo(move, setStepNumber, setXIsNext)}
      >
        {desc}
      </button>
    );
  });

  if (isArrange) {
    moves.reverse();
  }

  let status;

  if (winner.winner) {
    status = "Winner: " + winner.winner;
  } else {
    status = "Next Player: " + (xIsNext ? "X" : "O");
  }

  if (winner.isDraw) {
    status = "Draw";
  }

  return (
    <div className="game">
      <div className="game-info col-25">
        <div className="game-function">
          {arrangeSteps(isArrange, setIsArrange)}
        </div>
        <div className="game-form">
          <form
            onSubmit={(e) =>
              init(
                e,
                setNumberRow,
                setNumberCol,
                setHistory,
                setStepNumber,
                setXIsNext
              )
            }
          >
            <div className="form-info">
              <input
                className="form-input"
                type="number"
                id="row"
                name="Row"
                placeholder="Enter Row..."
                required
              />

              <input
                className="form-input"
                type="number"
                id="col"
                name="Col"
                placeholder="Enter Col..."
                required
              />
            </div>
            <div className="form-submit">
              <input className="frm-btn" type="submit" value="CREATE" />
            </div>
          </form>
        </div>
        <div className="game-moves">{moves}</div>
      </div>
      <div className="game-board col-75">
        <div className="game-status">{status}</div>
        <Board
          squares={current.squares}
          winLine={winner.line}
          onClick={(i) =>
            handleClick(
              i,
              history,
              setHistory,
              numberRow,
              numberCol,
              xIsNext,
              setXIsNext,
              stepNumber,
              setStepNumber,
              setIsArrange
            )
          }
          numberRow={numberRow}
          numberCol={numberCol}
        />
      </div>
    </div>
  );
}

function init(
  event,
  setNumberRow,
  setNumberCol,
  setHistory,
  setStepNumber,
  setXIsNext
) {
  const numberRow = event.target.Row.value;
  const numberCol = event.target.Col.value;
  setHistory([{
    squares: Array(numberRow * numberCol).fill(null),
    col: null,
    row: null,
  }]);
  setNumberRow(numberRow);
  setNumberCol(numberCol);
  setStepNumber(0);
  setXIsNext(false);

  event.preventDefault();
}

/**
 * Hàm handleClick thực hiện cập nhật giá trị history, xIsNext, stepNumber
 * @param {*} i => Vị trí của ô được đánh
 * @param {*} history => Giá trị của history trước khi đánh
 * @param {*} setHistory => Hàm cập nhật History
 * @param {*} numberRow => Số hàng của bàn cờ
 * @param {*} numberCol => Số cột của bàn cờ
 * @param {*} xIsNext => (true, false) - (0, X)
 * @param {*} setXIsNext => Cập nhật lại nước đánh tiếp theo
 * @param {*} stepNumber => Số bước đã đánh
 * @param {*} setStepNumber => Cập nhật lại số nước đã đánh
 * @returns
 */
function handleClick(
  i,
  history,
  setHistory,
  numberRow,
  numberCol,
  xIsNext,
  setXIsNext,
  stepNumber,
  setStepNumber
) {
  const currentHistory = history.slice(0, stepNumber + 1);
  const current = currentHistory[currentHistory.length - 1];
  const squares = current.squares.slice();
  const divisor = numberCol > numberRow ? numberCol : numberCol;
  const col = (i % divisor) + 1;
  const row = (i - (i % divisor)) / divisor + 1;

  if (
    calculateWinner(
      squares,
      numberRow,
      numberCol,
      current.row - 1,
      current.col - 1
    ).line
  ) {
    return;
  }

  if (squares[i]) {
    return;
  }

  squares[i] = xIsNext ? "X" : "O";

  setHistory(
    currentHistory.concat([
      {
        squares: squares,
        col: col,
        row: row,
      },
    ])
  );
  setXIsNext(!xIsNext);
  setStepNumber(currentHistory.length);
}

/**
 * Hàm jumpTo thực hiện cập nhật lại số bước đã đánh và nước tiếp theo sẽ đánh
 * @param {*} step => Số bước
 * @param {*} setStepNumber => Cập nhật lại số nước đã đánh
 * @param {*} setXIsNext => Cập nhật lại nước đánh tiếp theo
 */
function jumpTo(step, setStepNumber, setXIsNext) {
  setStepNumber(step);
  setXIsNext(step % 2 === 0);
}

/**
 * Hàm arrangeSteps thực hiện sắp xếp danh sách các bước đã đánh
 * @param {*} isArrange => (true, false) - (tăng, giảm)
 * @param {*} setIsArrange => Hàm cập nhật lại kiểu sắp xếp
 * @returns Danh sách các bước đã sắp xếp
 */
function arrangeSteps(isArrange, setIsArrange) {
  const desc = isArrange ? "Sort Descending" : "Sort Ascending";

  return (
    <button
      className="button button2"
      onClick={() => {
        setIsArrange(!isArrange);
      }}
    >
      {desc}
    </button>
  );
}

/**
 * Hàm calculateWin thực hiện kiểm tra sau nước đánh thì ván cờ đã kết thúc hay chưa?
 * @param {*} squares => Bàn cờ hiện tại
 * @param {*} row => Số hàng
 * @param {*} col => Số cột
 * @param {*} i => Vị trí hàng của nước đánh
 * @param {*} j => Vị trí cột của nước đánh
 * @returns 
    Trả về false nếu bàn cờ rỗng
    Trả về winner: winner - Người thắng (O hay X),
        isDraw: isDraw - Có xảy ra hòa,
        line - Mảng vị trí thắng,
 */
function calculateWinner(squares, row, col, i, j) {
  if (checkArrayNull(squares)) {
    let winNumber = 5;

    let line =
      checkCol(squares, row, col, i, j, winNumber) ||
      checkRow(squares, row, col, i, j, winNumber) ||
      checkDiaRight(squares, row, col, i, j, winNumber) ||
      checkDiaLeft(squares, row, col, i, j, winNumber) ||
      null;

    if (line) {
      return {
        winner: squares[i * col + j],
        isDraw: false,
        line,
      };
    }

    let isDraw = true;
    let winner = null;
    let numberX = 0;
    let numberO = 0;

    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        isDraw = false;
        break;
      }

      if (squares[i] === "X") {
        numberX++;
      } else {
        numberO++;
      }
    }

    if (isDraw && numberO !== numberX) {
      if (numberO > numberX) {
        winner = "O";
      } else {
        winner = "X";
      }

      line = [];

      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === winner) {
          line.push(i);
        }
      }

      isDraw = false;
    }

    return {
      winner: winner,
      isDraw: isDraw,
      line,
    };
  }

  return false;
}

/**
 * Hàm checkArrayNull kiểm tra mảng có null hay không?
 * @param {*} array => Mảng cần kiểm tra
 * @returns True => Mảng không null, False => Mảng null
 */
function checkArrayNull(array) {
  if (
    typeof array != "undefined" &&
    array != null &&
    array.length != null &&
    array.length > 0
  ) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] !== "undefined" && array[i] != null) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Hàm checkCol thực hiện kiểm tra sau có 5 nước giống nhau trên 1 cột hay không ?
 * @param {*} squares => Bàn cờ hiện tại
 * @param {*} row => Số hàng
 * @param {*} col => Số cột
 * @param {*} i => Vị trí hàng của nước đánh
 * @param {*} j => Vị trí cột của nước đánh
 * @returns True => Có, False => Không
 */
function checkCol(squares, row, col, i, j, winNumber) {
  const location = i * col + j;
  let numberSquares = 0;
  let rowTemp = i;
  let lines = [];

  while (
    squares[location] === squares[rowTemp * col + j] &&
    rowTemp < row &&
    numberSquares < winNumber
  ) {
    lines.push(rowTemp * col + j);
    numberSquares++;
    rowTemp++;
  }

  rowTemp = i - 1;
  while (
    squares[location] === squares[rowTemp * col + j] &&
    rowTemp >= 0 &&
    numberSquares < winNumber
  ) {
    lines.push(rowTemp * col + j);
    numberSquares++;
    rowTemp--;
  }

  if (numberSquares === winNumber) {
    return lines;
  }

  return false;
}

/**
 * Hàm checkRow thực hiện kiểm tra sau có 5 nước giống nhau trên 1 hàng hay không?
 * @param {*} squares => Bàn cờ hiện tại
 * @param {*} row => Số hàng
 * @param {*} col => Số cột
 * @param {*} i => Vị trí hàng của nước đánh
 * @param {*} j => Vị trí cột của nước đánh
 * @returns True => Có, False => Không
 */
function checkRow(squares, row, col, i, j, winNumber) {
  const location = i * col + j;
  let numberSquares = 0;
  let colTemp = j;
  let lines = [];

  while (
    squares[location] === squares[i * col + colTemp] &&
    colTemp < col &&
    numberSquares < winNumber
  ) {
    lines.push(i * col + colTemp);
    numberSquares++;
    colTemp++;
  }

  colTemp = j - 1;
  while (
    squares[location] === squares[i * col + colTemp] &&
    colTemp >= 0 &&
    numberSquares < winNumber
  ) {
    lines.push(i * col + colTemp);
    numberSquares++;
    colTemp--;
  }

  if (numberSquares === winNumber) {
    return lines;
  }

  return false;
}

/**
 * Hàm checkDiaRight thực hiện kiểm tra sau có 5 nước giống nhau trên đường chéo bên phải hay không?
 * @param {*} squares => Bàn cờ hiện tại
 * @param {*} row => Số hàng
 * @param {*} col => Số cột
 * @param {*} i => Vị trí hàng của nước đánh
 * @param {*} j => Vị trí cột của nước đánh
 * @returns True => Có, False => Không
 */
function checkDiaRight(squares, row, col, i, j, winNumber) {
  const location = i * col + j;
  let numberSquares = 0;
  let colTemp = j;
  let rowTemp = i;
  let lines = [];

  while (
    squares[location] === squares[rowTemp * col + colTemp] &&
    rowTemp < row &&
    colTemp < col &&
    numberSquares < winNumber
  ) {
    lines.push(rowTemp * col + colTemp);
    numberSquares++;
    colTemp++;
    rowTemp++;
  }

  rowTemp = i - 1;
  colTemp = j - 1;
  while (
    squares[location] === squares[rowTemp * col + colTemp] &&
    rowTemp >= 0 &&
    colTemp >= 0 &&
    numberSquares < winNumber
  ) {
    lines.push(rowTemp * col + colTemp);
    numberSquares++;
    colTemp--;
    rowTemp--;
  }

  if (numberSquares === winNumber) {
    return lines;
  }

  return false;
}

/**
 * Hàm checkDiaLeft thực hiện kiểm tra sau có 5 nước giống nhau trên đường chéo bên trái hay không?
 * @param {*} squares => Bàn cờ hiện tại
 * @param {*} row => Số hàng
 * @param {*} col => Số cột
 * @param {*} i => Vị trí hàng của nước đánh
 * @param {*} j => Vị trí cột của nước đánh
 * @returns True => Có, False => Không
 */
function checkDiaLeft(squares, row, col, i, j, winNumber) {
  const location = i * col + j;
  let numberSquares = 0;
  let colTemp = j;
  let rowTemp = i;
  let lines = [];

  while (
    squares[location] === squares[rowTemp * col + colTemp] &&
    rowTemp >= 0 &&
    colTemp < col &&
    numberSquares < winNumber
  ) {
    lines.push(rowTemp * col + colTemp);
    numberSquares++;
    colTemp++;
    rowTemp--;
  }

  rowTemp = i + 1;
  colTemp = j - 1;
  while (
    squares[location] === squares[rowTemp * col + colTemp] &&
    rowTemp < row &&
    colTemp >= 0 &&
    numberSquares < winNumber
  ) {
    lines.push(rowTemp * col + colTemp);
    numberSquares++;
    colTemp--;
    rowTemp++;
  }

  if (numberSquares === winNumber) {
    return lines;
  }

  return false;
}

export default Game;
