import { useEffect, useState } from "react";
import { useAuth } from "../../utils/hooks/auth/useAuth";
import {
  addGameToStore,
  getLastGamePlayed,
} from "../../utils/hooks/games/gamesStorage";
import GameCover from "../gameCover/gameCover";
import GameInput from "../gameInput/gameInput";
import "./gameGuess.css";

const initialPixelation = 0.1;

function GameGuess() {
  const [coverInfo, setCoverInfo] = useState(getLastGamePlayed());
  const [pixelation, setPixelation] = useState(initialPixelation);
  const [attempts, setAttempts] = useState(0);

  const { authState } = useAuth();

  const { access_token: accessToken } = authState;

  const getCover = async () => {
    try {
      const coverData = await fetch(
        "https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/covers",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Client-ID": "z6eg9t0uabn96tvt7l8yibmaff8n0w",
            Authorization: `Bearer ${accessToken}`,
          },
          body: `fields game,url;limit 1; where game > ${coverInfo.game};`,
        }
      );

      const cover = await coverData.json();
      setCoverInfo(cover?.[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      getCover();
    }
  }, [accessToken]);

  const resetPixelation = () => {
    setPixelation(initialPixelation);
  };

  const resetAttempts = () => {
    setAttempts(0);
  };

  const increaseAttempts = () => {
    setAttempts(attempts + 1);
  };

  const revealMoreImage = () => {
    if (pixelation < 1) {
      setPixelation(pixelation + 0.1);
    }
  };

  const resetGame = () => {
    resetPixelation();
    resetAttempts();
    getCover();
  };

  const onSelectGame = ({ game }) => {
    if (game === coverInfo.game) {
      alert("success");
      addGameToStore({ ...coverInfo, attempts });
      resetGame();
    } else {
      revealMoreImage();
      increaseAttempts();
    }
  };

  return (
    <div className="game-guess">
      <h1>Guess the game</h1>
      Attempts: {attempts}
      {accessToken ? (
        <>
          <GameInput {...{ accessToken, onSelectGame }} />
          <button onClick={resetGame}>skip</button>
          <GameCover {...{ coverInfo, pixelation }} />
        </>
      ) : null}
    </div>
  );
}

export default GameGuess;
