import React, { useContext, useState } from "react";
import axios from "axios";
import IncommingRequests from "../hooks/Requests/IncommingRequests";
import socket from "../socket";
import themeContext from "../contexts/themeContext/themeContext";

function AddFriend({ contacts }) {
  const {darkMode,setDarkMode} = useContext(themeContext)
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const profile = JSON.parse(localStorage.getItem("getProfile")); // logged in user
  const loggedInUserId = profile?._id;

  const onlyContacts = contacts.filter((c) => !c.isGroupChat);
  const incomingRequests = IncommingRequests();

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      if (query) {

        // fetch api
        const users = await axios.get("http://localhost:9000/api/Users/getAllUsers", {
          withCredentials: true,
        });

        const filtered = users.data.data.filter(
          (friend) =>
            friend.userName.toLowerCase().includes(query.toLowerCase()) ||
            friend.email.toLowerCase().includes(query.toLowerCase())
        );

        const contactIds = onlyContacts.map((c) => c._id);

        const requests = incomingRequests.requests || [];
        
        const finalResults = filtered.map((friend) => {
          if (contactIds.includes(friend._id)) {
            return { ...friend, status: "accepted" };
          }

          const request = requests.find(
            (r) => r.sender === friend._id || r.receiver === friend._id
          );

          if (request) {
            if (request.status === "pending") {
              if (request.sender === loggedInUserId) {
                return { ...friend, status: "outgoing-pending", requestedId: request._id }; // I sent it
              } else {
                return { ...friend, status: "incoming-pending", requestedId: request._id  }; // I received it
              }
            }
            return { ...friend, status: request.status, requestedId: request._id  }; // accepted/rejected
          }

          return { ...friend, status: "none", requestedId: request?._id  };
        });

        setResults(finalResults);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.log("error in searching", error);
    }
  };

  const handleAddFriend = async (e, id) => {
    e.preventDefault();

    try {
      
      socket.emit("sendRequest",{userId:profile?._id, receiverId:id})

      setResults(
        results.map((f) =>
          f._id === id ? { ...f, status: "outgoing-pending" } : f
        )
      );
    } catch (error) {
      console.log("error in sending friend request", error);
    }
  };

  const handleRemoveFriend = async (e, id) => {
    e.preventDefault();
    console.log(id)
    try {
      await axios.post(
        "http://localhost:9000/api/Request/rejectRequest",
        { requestId: id?.requestedId },
        { withCredentials: true }
      );

      setResults(
        results.map((f) =>
          f._id === id?._id ? { ...f, status: "none" } : f
        )
      );
    } catch (error) {
      console.log("error in removing friend", error);
    }
  };

  const handleAcceptRequest = async (e, requestId) => {
    e.preventDefault();

    try {
      socket.emit("acceptRequest",{requestId:requestId})

      setResults(
        results.map((f) =>
          f._id === requestId ? { ...f, status: "accepted" } : f
        )
      );
    } catch (error) {
      console.log("error in accepting request", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className={`text-xl font-semibold mb-4 ${darkMode?"text-white":"text-black"}`}>Add Friend</h2>

      <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${darkMode?"text-white":"text-black"}`}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      <div className="space-y-3">
        {results.length > 0 ? (
          results.map((friend) => (
            <div
              key={friend._id}
              className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm"
            >
              <div>
                <div className="font-semibold">{friend.userName}</div>
                <div className="text-sm text-gray-500">{friend.email}</div>
              </div>

              {friend.status === "outgoing-pending" ? (
                <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg">
                  Pending
                </button>
              ) : friend.status === "incoming-pending" ? (
                <button
                  onClick={(e) => {
                    handleAcceptRequest(e,friend.requestedId)
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                >
                  Accept
                </button>
              ) : friend.status === "accepted" ? (
                <button
                  onClick={(e) => handleRemoveFriend(e, friend)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg"
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={(e) => handleAddFriend(e, friend._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                >
                  Add Friend
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-gray-500">No results yet</div>
        )}
      </div>
    </div>
  );
}

export default AddFriend;
