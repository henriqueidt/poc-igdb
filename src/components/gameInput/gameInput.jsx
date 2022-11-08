import { useEffect, useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "./gameInput.css";
import { useDebounce } from "../../utils/hooks/useDebounce";

function GameInput({ accessToken, onSelectGame }) {
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSetSearchTerm = useDebounce(
    (event) => setSearchTerm(event.target.value),
    200
  );

  const useGameSearch = (searchTerm) => {
    const [games, setGames] = useState([]);

    useEffect(() => {
      if (searchTerm.trim() !== "") {
        let isFresh = true;
        fetchGames(searchTerm).then((games) => {
          if (isFresh) setGames(games);
        });
        return () => (isFresh = false);
      }
    }, [searchTerm]);

    return games;
  };

  const games = useGameSearch(searchTerm);
  const handleSearchTermChange = (event) => {
    const { value } = event.target;
    if (value.length > 3) {
      debouncedSetSearchTerm(event);
    }
  };

  const cache = {};
  const fetchGames = (value) => {
    if (cache[value]) {
      return Promise.resolve(cache[value]);
    }
    return fetch(
      "https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/search",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Client-ID": "z6eg9t0uabn96tvt7l8yibmaff8n0w",
          Authorization: `Bearer ${accessToken}`,
        },
        body: `fields name,game;where name ~ "${value}"*;`,
      }
    )
      .then((res) => res.json())
      .then((result) => {
        cache[value] = result;
        return result;
      });
  };

  const onSelect = (gameName) => {
    onSelectGame(games.find((game) => game.name === gameName));
  };

  return (
    <Combobox aria-label="Games" onSelect={onSelect}>
      <ComboboxInput
        className="game-search-input"
        onChange={handleSearchTermChange}
      />
      {games && (
        <ComboboxPopover className="game-input__popover">
          {games.length > 0 ? (
            <ComboboxList className="game-input__list">
              {games.map((game) => {
                const str = `${game.name}`;
                return (
                  <ComboboxOption
                    key={str}
                    value={str}
                    className="game-input__option"
                  />
                );
              })}
            </ComboboxList>
          ) : (
            <span style={{ display: "block", margin: 8 }}>
              No results found
            </span>
          )}
        </ComboboxPopover>
      )}
    </Combobox>
  );
}

export default GameInput;
