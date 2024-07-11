import Submit from "@components/Submit";
import { userState } from "@recoil/user/atoms";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

const SERVER = import.meta.env.VITE_API_SERVER;

function Login() {

  const location = useLocation();
  // recoil setter 반환
  const setUser = useSetRecoilState(userState);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setError } = useForm();

  const onSubmit = async (bodyData) => {
    try {
      const res = await fetch(`${SERVER}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData),
      });
      
      const resData = await res.json();

      if(resData.ok){
        // 사용자 정보를 recoil에 저장
        setUser({
          _id: resData.item._id,
          name: resData.item.name,
          profile: resData.item.profileImage,
          token: resData.item.token,
        });
        alert(resData.item.name + '님 로그인 되었습니다.');
        navigate(location.state?.from ? location.state?.from : '/');
      }else{ // 서버에서 4xx, 5xx 응답
        console.error(resData);

        if(resData.errors){ // 데이터 검증 에러
          resData.errors.forEach(error =>
            setError(error.path, { message: error.msg }),
          );
        }else if(resData.message){ // 기타 에러
          alert(resData.message);
        }
      }
    } catch (err) {
      // 네트워크 에러
      console.error(err.message);
      alert('잠시후 다시 이용해 주세요.');
    }
  };

  return (
    <main className="min-w-80 flex-grow flex items-center justify-center">
      <div className="p-8 border border-gray-200 rounded-lg w-full max-w-md dark:bg-gray-600 dark:border-0">
        <div className="text-center py-4">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">로그인</h2>
        </div>

        <form onSubmit={ handleSubmit(onSubmit) }>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-400 dark:bg-gray-700"
              {...register('email', {
                required: '이메일을 입력하세요.',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: '이메일 형식이 아닙니다.',
                },
              })}
            />
            {/* 입력값 검증 에러 출력 */}
            { errors.email && (
              <p className="ml-2 mt-1 text-sm text-red-500 dark:text-red-400">{ errors.email.message }</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-400 dark:bg-gray-700"
              {...register('password', {
                required: '비밀번호를 입력하세요.',
              })}
            />
            {/* 입력값 검증 에러 출력 */}
            { errors.password && (
              <p className="ml-2 mt-1 text-sm text-red-500 dark:text-red-400">{ errors.password.message }</p>
            )}
            <Link to="#" className="block mt-6 ml-auto text-gray-500 text-sm dark:text-gray-300 hover:underline">비밀번호를 잊으셨나요?</Link>
          </div>
          <div className="mt-10 flex justify-center items-center">
            <Submit>로그인</Submit>
            <Link to="/user/signup" className="ml-8 text-gray-800 hover:underline">회원가입</Link>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Login;