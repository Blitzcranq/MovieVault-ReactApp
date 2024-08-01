import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { APIContext } from "../APIContextProvider";
import { useNavigate } from "react-router-dom";
// import "../../styles/";

function ToWatchList({}) {
  const { apiKey, setApiKey } = useContext(APIContext);
  const [movies, setMovies] = useState([]);
  const [sorted, setSorted] = useState(false);
  const [priorities, setPriorities] = useState({});
  const naviagte = useNavigate();

  const sortMoviesByPriority = (movies) => {
    movies.sort((a, b) => {
      return a.priority - b.priority;
    });
  };

  // setApiKey("90c714fc3d83ff7917a843fa94111761d8ece19dc372f7b984d82eab596e2f50");

  // DEF CHANGE THIS URL_TO_GET_TO_WATCH_LIST_ENTRIES^^

  // const { apiKey } = useContext(APIContext);
  // console.log(apiKey);

  // useEffect(() => {
  //   // Set the API key only once when the component mounts
  //   setApiKey(
  //     "94e6b57ab67bcfb174c6be67e10beba1082b7bc5ae333469dab8a2a5771d2564"
  //   );
  // }, [setApiKey]);

  useEffect(() => {
    if (apiKey) {
      console.log(apiKey);
      retrieveMoviesToWatch(apiKey, sorted);
    } else {
      naviagte("/");
    }
  }, [apiKey, sorted]);
  const URL_TO_GET_TO_WATCH_LIST_ENTRIES = `https://loki.trentu.ca/~vrajchauhan/3430/assn/cois-3430-2024su-a2-Blitzcranq/api/towatchlist/entries?x-api-key=${apiKey}`;
  const URL_TO_UPDATE_PRIORITY = `https://loki.trentu.ca/~vrajchauhan/3430/assn/cois-3430-2024su-a2-Blitzcranq/api/towatchlist/entries`;

  // 3/3?x-api-key=`

  const retrieveMoviesToWatch = async (apiKey, sorted = false) => {
    try {
      const response = await axios.get(URL_TO_GET_TO_WATCH_LIST_ENTRIES, {
        headers: {
          "Content-Type": "application/json",
          // "x-api-key": apiKey,
        },
      });
      const respMovies = response.data;

      sorted && sortMoviesByPriority(respMovies);
      setMovies(respMovies);

      // Reset priorities state
      const newPriorities = {};
      respMovies.forEach((movie) => {
        newPriorities[movie.toWatchListID] = movie.priority;
      });
      setPriorities(newPriorities);

      console.log("Movies retrieved:", respMovies);
    } catch (error) {
      console.error("Error occurred with request:", error);
    }
  };

  const handlePriorityChange = (toWatchListID, value) => {
    setPriorities((prev) => ({ ...prev, [toWatchListID]: value }));
  };

  const updatePriority = async (toWatchListID) => {
    const newPriority = priorities[toWatchListID];
    if (!newPriority) return;

    try {
      console.log("LOOK HERE !");

      console.log(
        `${URL_TO_UPDATE_PRIORITY}/${toWatchListID}/priority?x-api-key=${apiKey}`
      );
      await axios.patch(
        `${URL_TO_UPDATE_PRIORITY}/${toWatchListID}/priority?x-api-key=${apiKey}&?user`,
        { priority: newPriority },
        {
          headers: {
            "Content-Type": "application/json",
            // "x-api-key": apiKey,
          },
        }
      );

      // Re-fetch the movies to update the local state
      await retrieveMoviesToWatch(apiKey, sorted);
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  };
  return (
    <main>
      <h2> To Watch List</h2>
      <button onClick={() => setSorted(!sorted)}>Sort by Priority</button>
      <table>
        <thead>
          <tr>
            <th>Movie Name</th>
            <th>Priority To Watch</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> MYHERO</td>
            <td> 1</td>
            <td> LOVED IT!</td>
          </tr>
          {movies.map((movie) => (
            <tr key={movie.toWatchListID}>
              <td>{movie.title}</td>
              <td>
                <input
                  type="number"
                  value={priorities[movie.toWatchListID] || movie.priority}
                  onChange={(e) =>
                    handlePriorityChange(movie.toWatchListID, e.target.value)
                  }
                />
              </td>
              <td>{movie.notes}</td>
              <td>
                <button onClick={() => updatePriority(movie.toWatchListID)}>
                  Update Priority
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default ToWatchList;
