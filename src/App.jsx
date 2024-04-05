import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'



// import React, { useState } from 'react';

function AddTeamForm({ onAddTeam }) {
  const [teamName, setTeamName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTeam(teamName);
    setTeamName('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-x-2">
      <input
        type="text"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        placeholder="Team Name"
        className="border-2 border-gray-200 p-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2">
        Add Team
      </button>
    </form>
  );
}


function TeamSelector({ teams, onSelectTeams }) {
  const [selectedTeams, setSelectedTeams] = useState([]);

  const handleSelectTeam = (team) => {
    if (selectedTeams.includes(team)) {
      setSelectedTeams(selectedTeams.filter((t) => t !== team));
    } else if (selectedTeams.length < 2) {
      setSelectedTeams([...selectedTeams, team]);
    }
  };

  const handleConfirmSelection = () => {
    onSelectTeams(selectedTeams);
    setSelectedTeams([]);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {teams.map((team) => (
          <button
            key={team}
            onClick={() => handleSelectTeam(team)}
            className={`p-2 ${selectedTeams.includes(team) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {team}
          </button>
        ))}
      </div>
      {selectedTeams.length === 2 && (
        <button onClick={handleConfirmSelection} className="mt-4 bg-green-500 text-white p-2">
          Start Match with Selected Teams
        </button>
      )}
    </div>
  );
}



function ScoreUpdater({ teams, onEndMatch }) {
  // Initialize scores for teams with a starting score of 0
  const [scores, setScores] = useState(teams.reduce((acc, team) => {
    acc[team] = 0;
    return acc;
  }, {}));

  // Function to handle score increment for a team
  const handleScoreChange = (team, pointsToAdd) => {
    setScores(prevScores => ({
      ...prevScores,
      [team]: prevScores[team] + pointsToAdd // Correctly updates the score for a team
    }));
  };

  return (
    <div>
      {teams.map((team) => (
        <div key={team} className="flex items-center justify-between my-2">
          <span>{team}</span>
          <div>
            <button onClick={() => handleScoreChange(team, 1)} className="bg-green-500 text-white p-2 rounded mx-1">
              Goal
            </button>
            <button onClick={() => handleScoreChange(team, 1)} className="bg-yellow-500 text-white p-2 rounded mx-1">
              Penalty
            </button>
            <button onClick={() => handleScoreChange(team, 1)} className="bg-red-500 text-white p-2 rounded mx-1">
              Free Kick
            </button>
          </div>
        </div>
      ))}
      <div className="mt-4">
        <button onClick={() => onEndMatch(scores)} className="bg-red-500 text-white p-2 rounded">
          End Match
        </button>
      </div>
      <div>
        {teams.map(team => (
          <span key={team} className="block">{team} Score: {scores[team]}</span>
        ))}
      </div>
    </div>
  );
}





// Assuming your existing components (AddTeamForm, TeamSelector, ScoreUpdater) are defined above or imported
// Import or define AddTeamForm, TeamSelector, ScoreUpdater components

function App() {
  const [teams, setTeams] = useState([]);
  const [matchTeams, setMatchTeams] = useState([]);
  const [matchResults, setMatchResults] = useState([]);
  const [overallPoints, setOverallPoints] = useState({});

  const addTeam = (teamName) => {
    if (!teams.includes(teamName)) {
      setTeams([...teams, teamName]);
      setOverallPoints({ ...overallPoints, [teamName]: 0 });
    }
  };

  const selectTeamsForMatch = (selectedTeams) => {
    setMatchTeams(selectedTeams);
  };

  const endMatchAndSaveResults = (teamScores) => {
    const score1 = teamScores[matchTeams[0]];
    const score2 = teamScores[matchTeams[1]];
    let matchResult, winner;

    if (score1 > score2) {
      winner = matchTeams[0];
      matchResult = `${matchTeams[0]} wins against ${matchTeams[1]}`;
    } else if (score2 > score1) {
      winner = matchTeams[1];
      matchResult = `${matchTeams[1]} wins against ${matchTeams[0]}`;
    } else {
      matchResult = `${matchTeams[0]} vs ${matchTeams[1]} ends in a tie`;
    }

    if (winner) {
      setOverallPoints(prev => ({
        ...prev,
        [winner]: (prev[winner] || 0) + 1
      }));
    }

    setMatchResults([...matchResults, `${matchResult} - Score: ${score1}:${score2}`]);
    setMatchTeams([]);
  };

  const sortedTeams = Object.keys(overallPoints).sort((a, b) => overallPoints[b] - overallPoints[a]);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex-1 p-4">
        <AddTeamForm onAddTeam={addTeam} />
        <TeamSelector teams={teams} onSelectTeams={selectTeamsForMatch} />
        {matchTeams.length === 2 && <ScoreUpdater teams={matchTeams} onEndMatch={endMatchAndSaveResults} />}
      </div>
      <div className="w-full md:w-64 md:fixed top-0 right-0 p-4">
        <h2 className="text-lg font-bold">Match Results</h2>
        <ul>
          {matchResults.map((result, index) => (
            <li key={index}>{result}</li>
          ))}
        </ul>
        <h2 className="text-lg font-bold mt-4">Leaderboard</h2>
        <ol>
          {sortedTeams.map((team) => (
            <li key={team}>{team} - {overallPoints[team]} points</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default App;



  