import Submit from "@components/Submit";
import { userState } from "@recoil/user/atoms";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

const SERVER = import.meta.env.VITE_API_SERVER;

function CommentNew() {
  const { _id } = useParams();

  // 로그인 된 사용자 정보
  const user = useRecoilValue(userState);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (bodyData) => {
      const res = await fetch(`${SERVER}/posts/${_id}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token.accessToken}`
        },
        body: JSON.stringify(bodyData),
      });

      return res.json();
    },
    onError(err) {
      console.error(err);
    },
    onSuccess() {
      // queryFn이 성공을(2xx 응답 상태 코드) 응답 받을 경우 호출되는 콜백 함수
      // 기존 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ['posts', _id, 'replies'],
        // queryKey: [type, _id]
      });
      reset();
    },
  });

  const onSubmit = (bodyData) => {
    if(user){
      mutate(bodyData);
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <h4 className="mb-4">새로운 댓글을 추가하세요.</h4>
      <form onSubmit={ handleSubmit(onSubmit) }>
        <div className="mb-4">
          <textarea
            rows="3"
            cols="40"
            className="block p-2 w-full text-sm border rounded-lg border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="내용을 입력하세요."
            {...register('comment', {
              required: '내용을 입력하세요',
              minLength: {
                value: 2,
                message: '2글자 이상 입력하세요',
              },
            })}></textarea>


          {/* 에러 메세지 출력 */}
          { errors.comment && (
          <p className="ml-2 mt-1 text-sm text-red-500">
            에러 메세지
          </p>
          )}
          
        </div>
        <Submit size="sm">댓글 등록</Submit>
      </form>
    </div>
  );
}

export default CommentNew;