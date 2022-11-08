const GAMES_STATE_KEY = "gamesState";

export const addGameToStore = (game) => {
  const gamesState = getGamesState();
  let newGames;

  if (gamesState?.games) {
    newGames = [...gamesState.games, game];
  } else {
    newGames = [game];
  }

  localStorage.setItem(GAMES_STATE_KEY, JSON.stringify({ games: newGames }));
};

export const getLastGamePlayed = () => {
  const gameState = getGamesState();
  if (gameState?.games?.length > 0) {
    return gameState.games[gameState.games.length - 1];
  }

  return {};
};

export const getGamesState = () => {
  const gamesState = localStorage.getItem(GAMES_STATE_KEY);

  if (gamesState) {
    return JSON.parse(gamesState);
  }

  return null;
};
