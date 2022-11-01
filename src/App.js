import logo from "./logo.svg";
import "./App.css";
import GameGuess from "./components/gameGuess/gameGuess";

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <div>
        <GameGuess />
      </div>
    </div>
  );
}

export default App;
