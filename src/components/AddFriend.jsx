import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

function AddFriend() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {

      if (query) {
        const users = await axios.get("http://localhost:9000/api/Users/getAllUsers",{withCredentials:true})
        
        const filtered = users.data.data.filter(
          (friend) =>
            friend.userName.toLowerCase().includes(query.toLowerCase()) ||
            friend.email.toLowerCase().includes(query.toLowerCase())
        );
    
        setResults(filtered);
      }
      else {
        setResults([])
      }
    } catch (error) {
      console.log("error in searching",error)
    }
  };

  const handleAddFriend = async (e,id) => {
    e.preventDefault()

    try {
      const friend = {receiver:id}
      const res = await axios.post("http://localhost:9000/api/Request/createRequest",friend,{withCredentials:true})

      setResults(
        results.map((f) => f._id === id ? {...f, status:"pending"} : f)
      )
    } catch (error) {
      console.log("error in sending friend request",error)
    }
  }

  const handleRemoveFriend = async (e,id) => { 
    e.preventDefault()

    try {

      const request = await axios.post("http://localhost:9000/api/Request/getRequestBySender",{friendId:id})

      const requestId = request.data.data

      await axios.post("http://localhost:9000/api/Request/rejectRequest",{requestId:id},{withCredentials:true})

      setResults(
        results.map((f) => f._id === id ? {...f, status: "none"}:f)
      )

      console.log(results)
    } catch (error) {
      console.log("error in removing friend", error)
    }
  }


  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Add Friend</h2>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {/* Search Results */}
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

              {
                friend.status === "pending" ? (
                  <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg">
                    Pending
                  </button>
                ) : friend.status === "accepted" ? (
                  <button className="bg-red-500 text-white px-3 py-1 rounded-lg"
                  onClick={(e) => handleRemoveFriend(e, friend._id)}>
                    Remove
                  </button>
                ) : (
                  <button onClick={(e) => handleAddFriend(e,friend._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600">
                    Add
                  </button>
                )
              }

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
