import Button from "@components/Button";
import { userState } from "@recoil/user/atoms";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

const SERVER = import.meta.env.VITE_API_SERVER;

function CommentItem({ item }) {
  const { _id } = useParams();
  // 로그인 된 사용자 정보
  const user = useRecoilValue(userState);

  const queryClient = useQueryClient();
  const { mutate: handleDelete } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${SERVER}/posts/${_id}/replies/${item._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token.accessToken}`
        }
      });
      
      const resData = await res.json();

      if(!resData.ok){ // 서버에서 4xx, 5xx 응답
        console.error(resData);
      }

      return resData;
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['posts', _id, 'replies'],
      });
    },
  });

  return (
    <div className="shadow-md rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <img
          className="w-8 mr-2 rounded-full"
          src={`${ import.meta.env.VITE_API_SERVER }${ item.user.profile }`}
          alt={`${ item.user.name } 프로필 이미지`}
        />
        <Link to="" className="text-orange-400">{ item.user.name }</Link>
        <time className="ml-auto text-gray-500" dateTime={ item.updatedAt }>{ item.updatedAt }</time>
      </div>
      <div className="flex justify-between items-center mb-2">
        <pre className="whitespace-pre-wrap text-sm">{ item.comment }</pre>
        { user?._id === item.user._id && (
          <Button bgColor="red" size="sm" onClick={ handleDelete }>삭제</Button>
        ) }
      </div>
    </div>
  );
}

export default CommentItem;