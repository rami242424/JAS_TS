
import { ApiRes, OneItem } from "#types/index";
import { Post } from "#types/post";
import Button from "@components/Button";
import InputError from "@components/InputError";
import Submit from "@components/Submit";
import { userState } from "@recoil/user/atoms";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

const SERVER = import.meta.env.VITE_API_SERVER;

export type PostForm = Pick<Post, 'title' | 'content' | 'type'>;

function New() {
  // { type: 'info' }
  const { type } = useParams();

  // 로그인 된 사용자 정보
  const user = useRecoilValue(userState);
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<PostForm>();
  const navigate = useNavigate();

  const { mutate: addPost } = useMutation<ApiRes<OneItem<Post>>, Error, PostForm>({
    mutationFn: async (bodyData) => {
      bodyData.type = type || 'info';
      const res = await fetch(`${SERVER}/posts`, {
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
    onSuccess(resData) {
      // mutationFn이 에러 없이 실행되면 호출되는 콜백 함수
      if(resData.ok){
        // 기존 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: ['posts', type],
          // queryKey: [type, _id]
        });
        navigate(`../${resData.item._id}`, { relative: 'path' });
      }else{
        console.error(resData.message);
      }
    },
  });

  return (
    <main className="min-w-[320px] p-4">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">게시글 등록</h2>
      </div>
      <section className="mb-8 p-4">
        <form onSubmit={ handleSubmit(bodyData => addPost(bodyData)) }>
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
            <Submit>등록</Submit>
            <Button type="reset" bgColor="gray" onClick={ () => history.back() }>취소</Button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default New;