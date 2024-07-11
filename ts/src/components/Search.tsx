import Submit from "@components/Submit";
import { useState } from "react";

function Search({ handleSearch }: { handleSearch: (keyword: string) => void }) {
  const [keyword, setKeyword] = useState('');

  return (
    <form onSubmit={ e => { e.preventDefault(); handleSearch(keyword) } }>
      <input
        className="dark:bg-gray-600 bg-gray-100 p-1 rounded"
        type="text"
        name="keyword"
        onChange={ e => setKeyword(e.target.value)}
      />
      <Submit>검색</Submit>
    </form>
  );
}

export default Search;