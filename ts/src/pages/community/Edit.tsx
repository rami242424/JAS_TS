import { Post } from "#types/post";
import Button from "@components/Button";
import InputError from "@components/InputError";
import Submit from "@components/Submit";
import { userState } from "@recoil/user/atoms";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { PostForm } from "./New";
import { OneItem } from "#types/index";

const SERVER = import.meta.env.VITE_API_SERVER;

function Edit() {
  const location = useLocation();
  const { data } = location.state || {};

  const { type, _id } = useParams();


  // 로그인 된 사용자 정보
  const user = useRecoilValue(userState);

  if(!data){
    throw new Error('잘못된 경로로 접근하였습니다.');
  }

  const { register, handleSubmit, formState: { errors } } = useForm<PostForm>({
    values: {
      title: data.title,
      content: data.content,
    },
  });
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { mutate: handleUpdate } = useMutation<OneItem<Post>, Error, PostForm>({
    mutationFn: async bodyData => {

      const res = await fetch(`${SERVER}/posts/${_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token.accessToken}`
        },
        body: JSON.stringify(bodyData),
      });
      
      const resData = await res.json();

      if(!resData.ok){ // 서버에서 4xx, 5xx 응답
        console.error(resData);
      }

      return resData;
    },
    onSuccess() {
      // queryFn이 성공을(2xx 응답 상태 코드) 응답 받을 경우 호출되는 콜백 함수
      // 기존 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ['posts', _id], // 상세
      });
      queryClient.invalidateQueries({
        queryKey: ['posts', type], // 목록
      });
      navigate('../', { relative: 'path' });
    },
  });

  return (
    <main className="min-w-[320px] p-4">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">게시글 수정</h2>
      </div>
      <section className="mb-8 p-4">
        <form onSubmit={ handleSubmit(bodyData => handleUpdate(bodyData)) }>
          <div className="my-4">
            <label className="block text-lg content-center" htmlFor="title">제목</label>
            <input
              id="title"
              type="text"
              placeholder="제목을 입력하세요." 
              className="w-full py-2 px-4 border rounded-md dark:bg-gray-700 border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              { ...register('title', {
                required: '제목을 입력하세요.'
              }) }
            />
            {/* 입력값 검증 에러 출력 */}
            <InputError target={ errors.title } />
          </div>
          <div className="my-4">
            <label className="block text-lg content-center" htmlFor="content">내용</label>
            <textarea 
              id="content"
              rows={15}
              placeholder="내용을 입력하세요."
              className="w-full p-4 text-sm border rounded-lg border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              { ...register('content', {
                required: '내용을 입력하세요.'
              }) }
            ></textarea>
            {/* 입력값 검증 에러 출력 */}
            <InputError target={ errors.content } />
          </div>
          <hr />
          <div className="flex justify-end my-6">
            <Submit>수정</Submit>
            <Button type="reset" bgColor="gray" onClick={ () => history.back() }>취소</Button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Edit;