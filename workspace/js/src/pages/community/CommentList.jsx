import Submit from "@/components/Submit";
import CommentNew from "@/pages/community/CommentNew";

export default function CommentList(){
  return (
    <section className="mb-8">
      <h4 className="mt-8 mb-4 ml-2">댓글 2개</h4>

      <div className="shadow-md rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <img
            className="w-8 mr-2 rounded-full"
            src="https://api.fesp.shop/files/00-sample/user-muzi.webp"
            alt="어피치 프로필 이미지"
          />
          <a href="" className="text-orange-400">어피치</a>
          <time className="ml-auto text-gray-500" dateTime="2024.07.02 14:11:22">2024.07.02 14:11:22</time>
        </div>
        <div className="flex justify-between items-center mb-2">
          <form action="#">
            <pre className="whitespace-pre-wrap text-sm">화이팅!</pre>
            <Submit bgColor="red" size="sm">삭제</Submit>
          </form>
        </div>  
      </div>

      <div className="shadow-md rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <img
            className="w-8 mr-2 rounded-full"
            src="https://api.fesp.shop/files/00-sample/user-muzi.webp"
            alt="무지 프로필 이미지"
          />
          <a href="" className="text-orange-400">무지</a>
          <time className="ml-auto text-gray-500" dateTime="2024.07.07 12:34:56">2024.07.07 12:34:56</time>
        </div>
        <div className="flex justify-between items-center mb-2">
          <form action="#">
            <pre className="whitespace-pre-wrap text-sm">축하해요~~~</pre>
            <Submit bgColor="red" size="sm">삭제</Submit>
          </form>
        </div>  
      </div>

      <CommentNew />

    </section>
  );
}