import axios from "axios";
import { useState, useEffect } from "react";
import { DebounceInput } from "react-debounce-input";
import ArticlePreview from "../Components/ArticlePreview";
function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const storedArticles = JSON.parse(localStorage.getItem("articles") || "[]");

  const fetchArticles = async () => {
    try {
      const result = await axios.get(
        `http://localhost:4001/trips?keywords=${searchQuery}`
      );
      if (result.status >= 200 && result.status <= 210) {
        // console.log("response 200");
        setArticles(result.data.data);
      }
    } catch (error) {
      // console.error(error);
      // console.log("status offline - init using cache");
      setArticles(storedArticles);
    }
  };

  const handleAddInput = (textInput) => {
    // const newTextInputString = searchQuery.concat(", ", textInput.tag);
    const newTextInputString = searchQuery + "\n" + textInput.tag + " ";
    setSearchQuery(newTextInputString);
  };

  useEffect(() => {
    fetchArticles();
  }, [searchQuery]);

  useEffect(() => {
    localStorage.setItem("articles", JSON.stringify(articles));
  }, [articles]);
  return (
    <>
      <div className="flex flex-col justify-center items-center p-10">
        <h1 className="p-8 text-5xl text-center text-sky-400">เที่ยวไหนดี</h1>
        <div className="w-4/5">
          <p className="text-left">ค้นหาที่เที่ยว</p>
        </div>
        {/* <input
          className="p-2 my-4 border border-gray-400 rounded w-4/5"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="หาที่เที่ยวแล้วไปกัน"
        /> */}
        <DebounceInput
          className="p-2 my-4 outline-none border-b-2 w-4/5"
          type="text"
          debounceTimeout={300}
          value={searchQuery}
          onChange={(e) => {
            // console.log(e.target.value);
            setSearchQuery(e.target.value);
          }}
          placeholder="หาที่เที่ยวแล้วไปกัน"
        />
        <div>
          {articles.map((article) => (
            <div key={article.eid} className="article-item">
              {/* {console.log("I'm re-render!")} */}
              <ArticlePreview
                article={article}
                handleAddInput={handleAddInput}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default HomePage;
