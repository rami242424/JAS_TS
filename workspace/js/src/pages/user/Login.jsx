import InputError from "@/components/InputError";
import Submit from "@/components/Submit";
import { userState } from "@/recoil/user/atoms"; // Recoil 상태를 정의하는 Atom
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil"; //  Recoil 상태를 업데이트하는 훅

const SERVER = import.meta.env.VITE_API_SERVER;

async function login(formData){
  const res = await fetch(`${SERVER}/users/login`, {
    method: 'POST', // 서버의 /users/login 엔드포인트에 POST 요청을 보내는 것은, 사용자가 로그인 폼에 입력한 데이터를 서버에 전달하여, 해당 사용자가 올바른 사용자(즉, 이미 등록된 사용자)인지 확인해 달라는 요청을 의미합니다.
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  });
  return res.json();
}

export default function Login(){
  const navigate = useNavigate();


  // 상태값 변경(로그인 성공 시 사용자 정보를 업데이트하는 데 사용)
  const setUser = useSetRecoilState(userState);

  const { register, handleSubmit, formState: { errors }, setError } = useForm();

  const { mutate: checkLogin } = useMutation({
    retry: 3,
    mutationFn(formData){
      return login(formData);
    },
    onSuccess(resData){
      if(resData.ok){
        // 로그인 상태 저장
        setUser({
          _id: resData.item._id,
          name: resData.item.name,
          profile: resData.item.profileImage,
          accessToken: resData.item.token.accessToken,
          refreshToken: resData.item.token.refreshToken,
        });

        alert(`${resData.item.name}님 로그인 되었습니다.`);
        navigate('/');
      }else{ // API서버에서 에러 응답
        if(resData.errors){
          resData.errors.forEach(error => setError(error.path, { message: error.msg }));
        }else if(resData.message){
          alert(resData.message);
        }
      }
    },
    onError(err){ // 네트워크 에러
      console.error(err.message);
      alert('잠시후 다시 이용해 주세요.');
    }
  });



  return (
    <main className="min-w-80 flex-grow flex items-center justify-center">
      <div className="p-8 border border-gray-200 rounded-lg w-full max-w-md dark:bg-gray-600 dark:border-0">
        <div className="text-center py-4">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">로그인</h2>
        </div>

        <form action="/" onSubmit={ handleSubmit(checkLogin) }>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-400 dark:bg-gray-700"
              { ...register('email', {
                required: '이메일을 입력하세요.',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: '이메일 형식이 아닙니다.'
                }
              }) }
            />
            <InputError target={ errors.email }/>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-400 dark:bg-gray-700"
              { ...register('password', {
                required: '비밀번호를 입력하세요.'
              }) }
            />
            <InputError target={ errors.password }/>
            <a href="#" className="block mt-6 ml-auto text-gray-500 text-sm dark:text-gray-300 hover:underline">비밀번호를 잊으셨나요?</a>
          </div>
          <div className="mt-10 flex justify-center items-center">
          <Submit>로그인</Submit>
            <a href="/user/signup" className="ml-8 text-gray-800 hover:underline">회원가입</a>
          </div>
        </form>
      </div>
    </main>
  );
}