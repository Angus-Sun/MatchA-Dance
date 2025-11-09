import GlobalLeaderboard from "../components/GlobalLeaderboard.jsx";
import "./LeaderboardPage.css";

export default function LeaderboardPage() {
  return (
    <div className="leaderboard-page">
      <div className="leaderboard-page-header">
        <h1>🏆 Global Rankings</h1>
        <p className="leaderboard-page-subtitle">
          See how you stack up against the best dancers worldwide
        </p>
      </div>
      
      <div className="leaderboard-page-content">
        <GlobalLeaderboard />
      </div>
    </div>
  );
}