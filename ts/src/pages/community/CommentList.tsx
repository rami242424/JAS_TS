import CommentItem from "@pages/community/CommentItem";
import CommentNew from "@pages/community/CommentNew";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { ApiRes, Comment, ListType } from "#types/index";

const SERVER = import.meta.env.VITE_API_SERVER;


// function CommentList({ data }: { data: Comment[] | undefined }) {
function CommentList() {
  const { _id } = useParams();
  const { data } = useQuery<ApiRes<ListType<Comment>>, Error, Comment[]>({
    queryKey: ['posts', _id, 'replies'],
    queryFn: async () => {
      // const sort = JSON.stringify({ _id: -1 });
      const res = await fetch(`${SERVER}/posts/${_id}/replies`);
      const resData = await res.json();

      if(!resData.ok){
        throw new Error('실패');
      }
      return resData.item;
    },
    
    // refetchInterval: 1000
  });



  const commentList = data?.map(item => <CommentItem key={ item._id } item={ item } />);

  return (
    <section className="mb-8">
      <h4 className="mt-8 mb-4 ml-2">댓글 { commentList?.length || 0 }개</h4>

      {/* 댓글 */}
      { commentList }

      {/* 댓글 입력 */}
      <CommentNew />

    </section>
  );
}

export default CommentList;