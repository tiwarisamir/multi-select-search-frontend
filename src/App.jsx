import { useEffect, useRef, useState } from "react";
import "./App.css";
import Pill from "./components/Pill";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setsuggestions] = useState([]);
  const [selectedUser, setselectedUser] = useState([]);
  const [selectedUserSet, setselectedUserSet] = useState(new Set());
  const [selectedSuggestionIndex, setselectedSuggestionIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchUsers = () => {
      if (searchTerm.trim() === "") {
        setsuggestions([]);
        return;
      }
      fetch(`https://dummyjson.com/users/search?q=${searchTerm}`)
        .then((res) => res.json())
        .then((data) => setsuggestions(data))
        .catch((err) => {
          console.error(err);
        });
    };
    const debounceFetch = setTimeout(fetchUsers, 800);

    return () => clearTimeout(debounceFetch);
  }, [searchTerm]);

  const handelSelectUser = (user) => {
    setselectedUser([...selectedUser, user]);
    setselectedUserSet(new Set([...selectedUserSet, user.email]));
    setSearchTerm("");
    setsuggestions([]);
    inputRef.current.focus();
  };

  const handelRemoveUser = (user) => {
    const updatedUsers = selectedUser.filter(
      (selectedUser) => selectedUser.id !== user.id
    );
    setselectedUser(updatedUsers);

    const updatedEmails = new Set(selectedUserSet);
    updatedEmails.delete(user.email);
    setselectedUserSet(updatedEmails);
  };

  const handelKeyDown = (e) => {
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      selectedUser.length > 0
    ) {
      const lastUser = selectedUser[selectedUser.length - 1];
      handelRemoveUser(lastUser);
      setsuggestions([]);
    } else if (e.key === "ArrowUp") {
      setselectedSuggestionIndex((prevIndex) => {
        return prevIndex > 0 ? prevIndex - 1 : prevIndex;
      });
    } else if (e.key === "ArrowDown") {
      setselectedSuggestionIndex((prevIndex) => {
        return prevIndex < suggestions?.users?.length - 1
          ? prevIndex + 1
          : prevIndex;
      });
    } else if (e.key === "Enter") {
      if (selectedSuggestionIndex !== -1) {
        handelSelectUser(suggestions.users[selectedSuggestionIndex]);
        setselectedSuggestionIndex(0);
      }
    }
  };
  return (
    <div className="flex relative m-2">
      <div className="w-full flex flex-wrap items-center gap-2 p-5 border-2 rounded-3xl ">
        {selectedUser.map((user) => {
          return (
            <Pill
              key={user.email}
              image={user.image}
              text={`${user.firstName} ${user.lastName}`}
              onClick={() => handelRemoveUser(user)}
            />
          );
        })}
        <div>
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handelKeyDown}
            placeholder="Search Users..."
            className=" h-5 p-1 w-full focus:outline-none"
          />
          <ul className="max-h-72 overflow-y-scroll absolute bg-slate-50 border border-slate-200  ">
            {suggestions?.users?.map((user, index) => {
              return !selectedUserSet.has(user.email) ? (
                <li
                  key={user.id}
                  className={`flex items-center gap-2 m-1 cursor-pointer border-b border-slate-200 last:border-none hover:bg-slate-200 ${
                    index === selectedSuggestionIndex ? "bg-slate-200" : ""
                  } `}
                  onClick={() => handelSelectUser(user)}
                >
                  <img
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-[20px]"
                  />
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </li>
              ) : (
                <span key={user.id} className="hidden"></span>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
