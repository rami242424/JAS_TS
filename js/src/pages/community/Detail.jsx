import Button from "@components/Button";
import CommentList from "@pages/community/CommentList";
import { userState } from "@recoil/user/atoms";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

const SERVER = import.meta.env.VITE_API_SERVER;

const fetchData = async (url) => {
  const response = await fetch(`${SERVER}${url}`);
  if (!response.ok) {
    throw new Error('오류 발생!');
  }
  return response.json();
};

function Detail() {
  const navigate = useNavigate();
  const { type, _id } = useParams();

  // 로그인 된 사용자 정보
  const user = useRecoilValue(userState);

  const { data } = useQuery({
    queryKey: ['posts', _id],
    queryFn: () => fetchData(`/posts/${_id}`), // Promise를 반환하는 함수
    select: res => res.item,
    staleTime: 1000*10, // 쿼리 실행 후 캐시가 유지되는 시간(기본, 0)
    suspense: true, // Suspense 사용 여부
  });

  const queryClient = useQueryClient();
  const { mutate: handleDelete } = useMutation({
    mutationFn: async () => {
      await fetch(`${SERVER}/posts/${_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token.accessToken}`
        },
      });
    },
    onSuccess() {
      // queryFn이 성공을(2xx 응답 상태 코드) 응답 받을 경우 호출되는 콜백 함수
      // 기존 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ['posts', type],
      });
      navigate('../', { relative: 'path' });
    },
  });

  const handleList = () => {
    // relative: 'path' 주소를 기준으로 상대 경로 이동
    // relative: 'route' 라우터를 기준으로 상대 경로 이동(기본)
    //   라우터 설정에 :type과 :type/:_id 가 형제로 되어 있어서 상위 폴더로 이동하면 /로 이동하는 문제가 있음
    navigate('../', { relative: 'path'});
  };

  const handleEdit = () => {
    navigate(`edit`, { state: { data } });
  }

  return (
    <main className="container mx-auto mt-4 px-4">

      <section className="mb-8 p-4">
        <div className="font-semibold text-xl">제목 : { data.title }</div>
        <div className="text-right text-gray-400">작성자 : { data.user.name }</div>
        <div className="mb-4">
          <div>
            <pre className="font-roboto w-full p-2 whitespace-pre-wrap">{ data.content }</pre>
          </div>
          <hr/>
        </div>
        <div className="flex justify-end my-4">
          <Button onClick={ handleList }>목록</Button>
          { user?._id === data.user._id && (
            <>
              <Button bgColor="gray" onClick={ handleEdit }>수정</Button>
              <Button bgColor="red" onClick={ handleDelete }>삭제</Button>
            </>
          ) }
        </div>
      </section>
      
      {/* 댓글 목록 */}
      <CommentList data={ data.replies } />
    </main>
  );
}

export default Detail;