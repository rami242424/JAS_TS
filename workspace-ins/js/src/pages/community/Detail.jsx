import Submit from "@/components/Submit";
import CommentList from "@/pages/community/CommentList";

export default function Detail(){
  return (
    <main className="container mx-auto mt-4 px-4">
      <section className="mb-8 p-4">
        <form action="/info">
        <div className="font-semibold text-xl">제목 : 좋은 소식이 있습니다.</div>
          <div className="text-right text-gray-400">작성자 : 제이지</div>
          <div className="mb-4">
            <div>
              <pre className="font-roboto w-full p-2 whitespace-pre-wrap">좋은 소식을 가지고 왔습니다.<br />오늘 드디어 최종 면접을 합니다.<br />많이 응원해 주세요^^</pre>
            </div>
            <hr/>
          </div>
          <div className="flex justify-end my-4">
            <a href="/info" className="bg-orange-500 py-1 px-4 text-base text-white font-semibold ml-2 hover:bg-amber-400 rounded">목록</a>
            <a href="/info/1/edit" className="bg-gray-900 py-1 px-4 text-base text-white font-semibold ml-2 hover:bg-amber-400 rounded">수정</a>
            <Submit bgColor="red">삭제</Submit>
          </div>
        </form>
      </section>

      {/* 부분 화면 로딩중 */}
      {/*
      <div className="flex flex-col items-center">
        <h3 className="mb-4 text-lg font-semibold">잠시만 기다려주세요.</h3>
        <span>로딩중...</span>
      </div>
      */}
      
      <CommentList />

    </main>
  );
}