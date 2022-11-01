import { useEffect, useState } from "react";
import GameCover from "../gameCover/gameCover";
import GameInput from "../gameInput/gameInput";

function GameGuess() {
  const [authData, setAuthData] = useState();
  const [coverInfo, setCoverInfo] = useState({
    game: "1",
  });

  const login = async () => {
    try {
      const authData = await fetch(
        "https://id.twitch.tv/oauth2/token?client_id=z6eg9t0uabn96tvt7l8yibmaff8n0w&client_secret=7wenmu85erti1niritenv3s92pgbs3&grant_type=client_credentials",
        {
          method: "POST",
        }
      );

      const auth = await authData.json();
      setAuthData(auth);
    } catch (error) {
      console.log(error);
    }
  };

  const getCover = async () => {
    try {
      const coverData = await fetch(
        "https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/covers",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Client-ID": "z6eg9t0uabn96tvt7l8yibmaff8n0w",
            Authorization: `Bearer ${authData.access_token}`,
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
    login();
  }, []);

  const onSelectGame = ({ game }) => {
    if (game === coverInfo.game) {
      alert("success");
      getCover();
    }
  };

  return (
    <div>
      <h1>Guess the game</h1>
      {authData?.access_token ? (
        <>
          <GameInput {...{ authData, onSelectGame }} />
          <GameCover {...{ authData, coverInfo, getCover }} />
        </>
      ) : null}
    </div>
  );
}

export default GameGuess;
