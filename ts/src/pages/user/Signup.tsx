import { ApiRes, ApiResWithValidation, FileRes, ListType, OneItem } from "#types/index";
import { User } from "#types/user";
import Button from "@components/Button";
import Submit from "@components/Submit";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const SERVER = import.meta.env.VITE_API_SERVER;

type UserForm = {
  type: 'user' | 'seller',
  name: string,
  email: string,
  password: string,
  profileImage?: string | string[],
};

function Signup() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setError, } = useForm<UserForm>();

  const { mutate: addUser } = useMutation<ApiRes<OneItem<User>>, Error, UserForm>({
    async mutationFn(bodyData){
      bodyData.type = 'user';

      // 이미지 먼저 업로드
      if (bodyData.profileImage != undefined && bodyData.profileImage.length > 0) {
        // 프로필 이미지를 추가한 경우
        const formData = new FormData();
        formData.append('attach', bodyData.profileImage[0]);

        const fileRes = await fetch(`${SERVER}/files`, {
          method: 'POST',
          // headers: {
          //   'Content-Type': 'multipart/form-data', // 생략
          // },
          body: formData,
        });

        if(!fileRes.ok){
          throw new Error('파일 업로드 실패');
        }
        const fileData: ListType<FileRes> = await fileRes.json();
        // 서버로부터 응답받은 이미지 이름을 회원 정보에 포함
        bodyData.profileImage = fileData.item[0].path;
      } else {
        // profileImage 속성을 제거
        delete bodyData.profileImage;
      }

      const res = await fetch(`${SERVER}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
      });

      const resData: ApiResWithValidation<OneItem<User>, UserForm> = await res.json();
      if(resData.ok){ 
        alert(`${ resData.item.name } 님 회원가입이 완료 되었습니다.\n로그인 후에 이용하세요.`);
        navigate('/user/login');
      }else{ // 서버에서 4xx, 5xx 응답
        console.error(resData);

        if('errors' in resData){ // 데이터 검증 에러
          resData.errors.forEach(error =>
            setError(error.path, { message: error.msg }),
          );
        }else if(resData.message){ // 기타 에러
          alert(resData.message);
        }
      }

      return resData;
    },
    onError(err){
      // 네트워크 에러
      console.error(err.message);
      alert('잠시후 다시 이용해 주세요.');
    }
  });

  return (
    <main className="min-w-80 flex-grow flex items-center justify-center">
      <div className="p-8  border border-gray-200 rounded-lg w-full max-w-md dark:bg-gray-600 dark:border-0">
        <div className="text-center py-4">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">회원 가입</h2>
        </div>

        <form onSubmit={ handleSubmit(bodyData => addUser(bodyData)) }>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              placeholder="이름을 입력하세요"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-400 dark:bg-gray-700"
              {...register('name', {
                required: '이름을 입력하세요.',
                minLength: {
                  value: 2,
                  message: '이름을 2글자 이상 입력하세요.',
                },
              })}
            />
            {/* 입력값 검증 에러 출력 */}
            { errors.name && (
              <p className="ml-2 mt-1 text-sm text-red-500 dark:text-red-400">{ errors.name.message }</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
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
              type="password"
              id="password"
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
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="profileImage">프로필 이미지</label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              placeholder="이미지를 선택하세요"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
              {...register('profileImage')}
            />
          </div>

          <div className="mt-10 flex justify-center items-center">
            <Submit>회원가입</Submit>
            <Button type="reset" bgColor="gray" onClick={ () => history.back() }>취소</Button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Signup;