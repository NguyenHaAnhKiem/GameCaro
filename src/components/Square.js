function Square({ value, highlight, onClick, cell }) {
  if (highlight) {
    value = <b className="highlight">{value}</b>;
  }

  cell = cell + '%';

  return (
    <button className="square" style={{width: cell}} onClick={onClick}>
      {value}
    </button>
  );
}

export default Square;
