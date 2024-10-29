import React from 'react';
 

const Leaderboard = ({ data }) => {
  return (
    <div className="leaderboard2">
      <div className="leaderboard-header">
        <h1>Līderi</h1>
        <div className="close-button" onClick={() => console.log('Close')}>X</div>
      </div>
      <div className="leaderboard-body">
        {data.map((player, index) => (
          <div key={index} className="leaderboard-row">
            <div className="rank">#{index + 1}</div>
            <div className="avatar">
              <img src={player.avatar} alt={player.name} />
            </div>
            <div className="player-name">{player.name}</div>
            <div className="wins">
              <span className={`score green`}>{player.wins}</span> Uzvaras
            </div>
            <div className="losses">
              <span className={`score red`}>{player.losses}</span> Zaudes
            </div>
            <div className="score-flames">
              <span className="score">{player.score}</span>
              <span className="flame-icon">🔥</span>
            </div>
          </div>
        ))}
      </div>
      <div className="leaderboard-footer">
        <button className="nav-button">⬅️</button>
        <button className="nav-button">➡️</button>
      </div>
    </div>
  );
};

export default Leaderboard;
