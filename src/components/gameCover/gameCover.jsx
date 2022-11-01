import { useEffect } from "react";

function GameCover({ authData, coverInfo, getCover }) {
  useEffect(() => {
    getCover();
  }, [authData]);

  return (
    <>
      <button onClick={getCover}>refresh</button>
      <div>
        a
        {coverInfo?.url ? (
          <img src={coverInfo?.url?.replace("thumb", "720p")} alt="cover" />
        ) : null}
      </div>
    </>
  );
}

export default GameCover;
