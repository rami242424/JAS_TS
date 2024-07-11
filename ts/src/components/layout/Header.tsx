import Button from "@components/Button";
import Theme from "@components/Theme";
import { userState } from "@recoil/user/atoms";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const [user, setUser] = useRecoilState(userState);

  return (
    <header className="px-8 min-w-80 bg-slate-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
      <nav className="flex flex-wrap justify-center items-center p-4 md:flex-nowrap md:justify-between">
        <div className="w-1/2 order-1 md:w-auto">
          <Link to="/" className="flex items-center gap-2">
            <img className="mr-3 h-6 sm:h-9" src="/images/favicon.svg" alt="로고 이미지" />
            <span className="text-lg font-bold">멋사컴</span>
          </Link>
        </div>
        <div className="w-auto order-2 text-base mt-4 md:mt-0">
          <ul className="flex items-center gap-6 uppercase">
            <li className="hover:text-amber-500 hover:font-semibold"><Link to="/info">정보공유</Link></li>
            <li className="hover:text-amber-500 hover:font-semibold"><Link to="/free">자유게시판</Link></li>
            <li className="hover:text-amber-500 a:font-semibold"><Link to="/qna">질문게시판</Link></li>
          </ul>
        </div>

        <div className="w-1/2 order-1 flex justify-end items-center md:order-2 md:w-auto">

          
          { user ? (
            <p className="flex items-center">
              <img className="w-8 rounded-full mr-2" src={`${import.meta.env.VITE_API_SERVER}${user.profile}`} />
              {user.name}님 :)
              <Button size="md" bgColor="gray" onClick={ handleLogout }>로그아웃</Button>
            </p>
          ) : (
              <div className="flex justify-end">
              <Button size="sm" onClick={ () => navigate(`/user/login`) }>로그인</Button>
              <Button size="sm" bgColor="gray" onClick={ () => navigate(`/user/signup`) }>회원가입</Button>
              </div>
          ) }

          <Theme />

        </div>
      </nav>
    </header>
  );
}

export default Header;