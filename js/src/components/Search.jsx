import Submit from "@components/Submit";
import { useState } from "react";

function Search({ handleSearch }) {
  const [keyword, setKeyword] = useState('');

  return (
    <form>
      <input
        className="dark:bg-gray-600 bg-gray-100 p-1 rounded"
        type="text"
        name="keyword"
        onChange={ e => setKeyword(e.target.value)}
      />
      <Submit onClick={ e => { e.preventDefault(); handleSearch(keyword) } }>검색</Submit>
    </form>
  );
}

export default Search;