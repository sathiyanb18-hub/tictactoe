export default function Board({ squares, onClick, winLine }) {
  return (
    <div id="board" className="board">
      {squares.map((value, i) => {
        const classes = ['square'];
        if (value) classes.push(value);
        else classes.push('empty');
        if (winLine && winLine.includes(i)) classes.push('win');
        return (
          <button key={i} className={classes.join(' ')} onClick={() => onClick(i)}>
            {value && <span>{value}</span>}
          </button>
        );
      })}
    </div>
  );
}