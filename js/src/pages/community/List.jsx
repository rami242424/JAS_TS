import Button from "@components/Button";
import Pagination from "@components/Pagination";
import Search from "@components/Search";
import ListItem from "@pages/community/ListItem";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const SERVER = import.meta.env.VITE_API_SERVER;

const fetchData = async (url) => {
  const response = await fetch(`${SERVER}${url}`);
  if (!response.ok) {
    throw new Error('오류 발생!');
  }
  return response.json();
};

function List() {
  const navigate = useNavigate();
  // { type: 'info' }
  const { type } = useParams();

  // /info?page=3&keyword=hello
  const [searchParams, setSearchParams] = useSearchParams();

  const { isLoading, data, error, refetch } = useQuery({
    // queryKey: [queryString],
    // queryKey: [params.type],
    queryKey: ['posts', type],
    queryFn: () => {
      searchParams.set('type', type);
      return fetchData(`/posts?${searchParams.toString()}`); // Promise를 반환하는 함수
    },
    // select: res => res.item,
    staleTime: 1000*10, // 쿼리 실행 후 캐시가 유지되는 시간(기본, 0)
    // suspense: true, // Suspense 사용 여부
  });

  console.log(data);

  // TODO: 추가하면 캐시 안되고 매번 서버에 요청함
  // useEffect(() => {
  //   console.log('searchParams.toString()', searchParams.toString());
  //   refetch();
  // }, [searchParams.toString()]);

  // 검색 요청시 주소의 query string 수정
  const handleSearch = (keyword) => {
    searchParams.delete('type');
    searchParams.set('keyword', keyword);
    searchParams.set('page', 1);
    setSearchParams(searchParams);
    refetch();
  };

  const itemList = data?.item.map(item => <ListItem key={ item._id } item={ item } />);

  return (
    <main className="min-w-80 p-10">
      <div className="text-center py-4">
        <h2 className="pb-4 text-2xl font-bold text-gray-700 dark:text-gray-200">정보 공유</h2>
      </div>
      <div className="flex justify-end mr-4">
        <Search handleSearch={ handleSearch }/>
        <Button onClick={ () => navigate(`/info/new`) }>글작성</Button>
      </div>
      <section className="pt-10">
        <table className="border-collapse w-full table-fixed">
          <colgroup>
            <col className="w-[10%] sm:w-[10%]" />
            <col className="w-[60%] sm:w-[30%]" />
            <col className="w-[30%] sm:w-[15%]" />
            <col className="w-0 sm:w-[10%]" />
            <col className="w-0 sm:w-[10%]" />
            <col className="w-0 sm:w-[25%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-solid border-gray-600">
              <th className="p-2 whitespace-nowrap font-semibold">번호</th>
              <th className="p-2 whitespace-nowrap font-semibold">제목</th>
              <th className="p-2 whitespace-nowrap font-semibold">글쓴이</th>
              <th className="p-2 whitespace-nowrap font-semibold hidden sm:table-cell">조회수</th>
              <th className="p-2 whitespace-nowrap font-semibold hidden sm:table-cell">댓글수</th>
              <th className="p-2 whitespace-nowrap font-semibold hidden sm:table-cell">작성일</th>
            </tr>
          </thead>
          <tbody>
            {/* 로딩 상태 표시 */}
            { isLoading && (
              <tr>
                <td colSpan="6" className="py-20 text-center">로딩중...</td>
              </tr>
            )}

            {/* 에러 메세지 출력 */}
            { error && (
              <tr>
                <td colSpan="6" className="py-20 text-center">{ error.message }</td>
              </tr>
            )}

            {/* 본문 출력 */}
            { itemList }
            
          </tbody>
        </table>
        <hr />

        <Pagination
          totalPage={data?.pagination.totalPages}
          current={data?.pagination.page}
        />
      </section>
    </main>
  );
}

export default List;