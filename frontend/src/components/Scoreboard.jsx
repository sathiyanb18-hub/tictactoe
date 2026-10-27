export default function Scoreboard({ scores }) {
  return (
    <div className="row text-center g-2 mt-3">
      <div className="col-4">
        <div className="score-box">
          <div>Player X</div>
          <div className="num">{scores.X}</div>
        </div>
      </div>
      <div className="col-4">
        <div className="score-box">
          <div>Draws</div>
          <div className="num">{scores.draws}</div>
        </div>
      </div>
      <div className="col-4">
        <div className="score-box">
          <div>Player O</div>
          <div className="num">{scores.O}</div>
        </div>
      </div>
    </div>
  );
}