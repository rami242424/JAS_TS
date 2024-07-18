import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import Spinner from "@/components/Spinner";
import ListItem from "@/pages/community/ListItem";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SERVER= import.meta.env.VITE_API_SERVER;

// 게시물 목록 찾아서 응답하게 만드는 것
async function fetchPosts(type){
  const url = `${SERVER}/posts?type=${type}&delay=5000`; // API 요청을 보낼 URL을 동적으로 생성
  const res = await fetch(url); // 비동기함수 : 호출하자마자 리턴(작업 완료되기 전에)
  return res.json();
}

export default function List(){
  const { type } = useParams();

  const { isLoading, data } = useQuery({
  // const { isLoading, data, error } = useSuspenseQuery({
    queryKey: [type],
    queryFn: () => {
      // Promise 반환하는 함수
      return fetchPosts(type);
    },
    staleTime: 1000*10, // 쿼리 실행후 캐시가 유지되는 시간(기본 0)
  });

 // const [data, setData] = useState([]);
  // const fetchData = async (type) => {
  //   const result = await fetchPosts(type);
  //   setData(result.item);
  // }
  // useEffect(() => {
  //   fetchData(type);
  // }, []);

  const list = data?.item?.map(item => <ListItem key={item._id} item={ item } />);

 // if(isLoading){
  //   return <Spinner.FullScreen />
  // }

  return (
    <main className="min-w-80 p-10">
      <div className="text-center py-4">
        <h2 className="pb-4 text-2xl font-bold text-gray-700 dark:text-gray-200">정보 공유</h2>
      </div>
      <div className="flex justify-end mr-4">
        
        <Search />

        <a href="/info/new" className="bg-orange-500 py-1 px-4 text-base text-white font-semibold ml-2 hover:bg-amber-400 rounded">글작성</a>
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

            { isLoading && (
              <tr>
                <td colSpan={6} className="py-20">
                  <div className="flex justify-center">
                    <Spinner.TargetArea />
                  </div>
                </td>
              </tr>
            ) }
            { list }

          </tbody>
        </table>
        <hr />

        <Pagination />

      </section>
    </main>
  );
}