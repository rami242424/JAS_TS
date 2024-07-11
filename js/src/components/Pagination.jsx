import { Link, useParams, useSearchParams } from "react-router-dom";

function Pagination({ totalPage, current = 1 }) {
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const pageList = [];

  for (let page = 1; page <= totalPage; page++) {
    searchParams.set('page', page);
    let search = searchParams.toString();
    pageList.push(
      <li
        key={page}
        className={current === page ? 'text-bold text-gray-400' : ''}
      >
        <Link to={`/${type}?${search}`}>{ page }</Link>
      </li>,
    );
  }
  return (
    <div>
      <ul className="flex justify-center gap-3 m-4">
        { pageList }
      </ul>
    </div>
  );
}

export default Pagination;