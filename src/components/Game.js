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
 * H??m handleClick th???c hi???n c???p nh???t gi?? tr??? history, xIsNext, stepNumber
 * @param {*} i => V??? tr?? c???a ?? ???????c ????nh
 * @param {*} history => Gi?? tr??? c???a history tr?????c khi ????nh
 * @param {*} setHistory => H??m c???p nh???t History
 * @param {*} numberRow => S??? h??ng c???a b??n c???
 * @param {*} numberCol => S??? c???t c???a b??n c???
 * @param {*} xIsNext => (true, false) - (0, X)
 * @param {*} setXIsNext => C???p nh???t l???i n?????c ????nh ti???p theo
 * @param {*} stepNumber => S??? b?????c ???? ????nh
 * @param {*} setStepNumber => C???p nh???t l???i s??? n?????c ???? ????nh
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
 * H??m jumpTo th???c hi???n c???p nh???t l???i s??? b?????c ???? ????nh v?? n?????c ti???p theo s??? ????nh
 * @param {*} step => S??? b?????c
 * @param {*} setStepNumber => C???p nh???t l???i s??? n?????c ???? ????nh
 * @param {*} setXIsNext => C???p nh???t l???i n?????c ????nh ti???p theo
 */
function jumpTo(step, setStepNumber, setXIsNext) {
  setStepNumber(step);
  setXIsNext(step % 2 === 0);
}

/**
 * H??m arrangeSteps th???c hi???n s???p x???p danh s??ch c??c b?????c ???? ????nh
 * @param {*} isArrange => (true, false) - (t??ng, gi???m)
 * @param {*} setIsArrange => H??m c???p nh???t l???i ki???u s???p x???p
 * @returns Danh s??ch c??c b?????c ???? s???p x???p
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
 * H??m calculateWin th???c hi???n ki???m tra sau n?????c ????nh th?? v??n c??? ???? k???t th??c hay ch??a?
 * @param {*} squares => B??n c??? hi???n t???i
 * @param {*} row => S??? h??ng
 * @param {*} col => S??? c???t
 * @param {*} i => V??? tr?? h??ng c???a n?????c ????nh
 * @param {*} j => V??? tr?? c???t c???a n?????c ????nh
 * @returns 
    Tr??? v??? false n???u b??n c??? r???ng
    Tr??? v??? winner: winner - Ng?????i th???ng (O hay X),
        isDraw: isDraw - C?? x???y ra h??a,
        line - M???ng v??? tr?? th???ng,
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
 * H??m checkArrayNull ki???m tra m???ng c?? null hay kh??ng?
 * @param {*} array => M???ng c???n ki???m tra
 * @returns True => M???ng kh??ng null, False => M???ng null
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
 * H??m checkCol th???c hi???n ki???m tra sau c?? 5 n?????c gi???ng nhau tr??n 1 c???t hay kh??ng ?
 * @param {*} squares => B??n c??? hi???n t???i
 * @param {*} row => S??? h??ng
 * @param {*} col => S??? c???t
 * @param {*} i => V??? tr?? h??ng c???a n?????c ????nh
 * @param {*} j => V??? tr?? c???t c???a n?????c ????nh
 * @returns True => C??, False => Kh??ng
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
 * H??m checkRow th???c hi???n ki???m tra sau c?? 5 n?????c gi???ng nhau tr??n 1 h??ng hay kh??ng?
 * @param {*} squares => B??n c??? hi???n t???i
 * @param {*} row => S??? h??ng
 * @param {*} col => S??? c???t
 * @param {*} i => V??? tr?? h??ng c???a n?????c ????nh
 * @param {*} j => V??? tr?? c???t c???a n?????c ????nh
 * @returns True => C??, False => Kh??ng
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
 * H??m checkDiaRight th???c hi???n ki???m tra sau c?? 5 n?????c gi???ng nhau tr??n ???????ng ch??o b??n ph???i hay kh??ng?
 * @param {*} squares => B??n c??? hi???n t???i
 * @param {*} row => S??? h??ng
 * @param {*} col => S??? c???t
 * @param {*} i => V??? tr?? h??ng c???a n?????c ????nh
 * @param {*} j => V??? tr?? c???t c???a n?????c ????nh
 * @returns True => C??, False => Kh??ng
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
 * H??m checkDiaLeft th???c hi???n ki???m tra sau c?? 5 n?????c gi???ng nhau tr??n ???????ng ch??o b??n tr??i hay kh??ng?
 * @param {*} squares => B??n c??? hi???n t???i
 * @param {*} row => S??? h??ng
 * @param {*} col => S??? c???t
 * @param {*} i => V??? tr?? h??ng c???a n?????c ????nh
 * @param {*} j => V??? tr?? c???t c???a n?????c ????nh
 * @returns True => C??, False => Kh??ng
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
