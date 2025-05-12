"use client";

import { useState, useEffect, useCallback } from "react";

import PromptCard from "./PromptCard";
import debounce from "lodash.debounce";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
         key={post._id}
         post={post}
         handleTagClick={handleTagClick}
         />
      ))}
    </div>
  )
}

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/prompt');
      const data = await response.json();

      setPosts(data);
      setFilteredPosts(data)
    }

    fetchPosts();
  }, []);


  // Debounced filter function
  const filterPosts = useCallback(
    debounce((value, posts) => {
      const lowerCaseValue = value.toLowerCase();

      const filtered = posts.filter((post) =>
        post.prompt.toLowerCase().includes(lowerCaseValue) ||
        post.tag.toLowerCase().includes(lowerCaseValue) ||
        post.creator.username.toLowerCase().includes(lowerCaseValue)
      );

      setFilteredPosts(filtered);
    }, 500), // 500ms debounce delay
    []
  );

  // Normal input search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    filterPosts(value, posts); // trigger debounce
  };

   // Tag click search
   const handleTagClick = (tag) => {
    setSearchText(tag);
    filterPosts(tag, posts);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      <PromptCardList data={filteredPosts} handleTagClick={handleTagClick} />
    </section>
  );
};

export default Feed;
