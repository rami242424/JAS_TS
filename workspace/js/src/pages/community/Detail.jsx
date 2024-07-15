import Spinner from "@/components/Spinner";
import Submit from "@/components/Submit";
import CommentList from "@/pages/community/CommentList";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

// 게시물 목록 찾아서 응답하게 만드는 것
async function fetchPost(_id){
  const url = `https://api.fesp.shop/posts/${_id}`;
  const res = await fetch(url); // 비동기함수 : 호출하자마자 리턴(작업 완료되기 전에)
  return res.json();
}

export default function Detail(){
  const { type, _id } = useParams(); // type을 꺼내기 위해서 사용

  const { isLoading, data, error } = useQuery({
    queryKey: [type, _id],
    queryFn: () => {
      return fetchPost(_id);
    },
    select: resData => resData.item,
    staleTime: 1000*3
  });

  // const [data, setData] = useState(null);
  // const fetchData = async (_id) => {
  //   const result = await fetchPost(_id);
  //   setData(result.item);
  // }

  // useEffect(() => { // 화면에 렌더링 되고 난 후 효과들(함수가 최종 리턴을 한후에 useEffect 안에서 동작)
  //   fetchData(_id);
  // }, []);


  return (
    <main className="container mx-auto mt-4 px-4">
      <section className="mb-8 p-4">
        <form action={`/${type}`}>
        <div className="font-semibold text-xl">제목 : { data?.title }</div>
          <div className="text-right text-gray-400">작성자 : { data?.user.name }</div>
          <div className="mb-4">
            <div>
              <pre className="font-roboto w-full p-2 whitespace-pre-wrap">{ data?.content }</pre>
            </div>
            <hr/>
          </div>
          <div className="flex justify-end my-4">
            <Link to={`/${type}`} className="bg-orange-500 py-1 px-4 text-base text-white font-semibold ml-2 hover:bg-amber-400 rounded">목록</Link>
            <Link to={`/${type}/${_id}/edit`} className="bg-gray-900 py-1 px-4 text-base text-white font-semibold ml-2 hover:bg-amber-400 rounded">수정</Link>
            <Submit bgColor="red">삭제</Submit>
          </div>
        </form>
      </section>

      {/* 부분 화면 로딩중 */}
      { isLoading && (
        <Spinner.TargetArea />
      ) }
     
      
      <CommentList replies={ data?.replies }/>

    </main>
  );
}