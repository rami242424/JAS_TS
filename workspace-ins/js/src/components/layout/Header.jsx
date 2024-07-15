import Theme from "@/components/Theme";

export default function Header(){
  return (
    <header className="px-8 min-w-80 bg-slate-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 transition-color duration-500 ease-in-out">
      <nav className="flex flex-wrap justify-center items-center p-4 md:flex-nowrap md:justify-between">
        <div className="w-1/2 order-1 md:w-auto">
          <a href="/" className="flex items-center gap-2">
            <img className="mr-3 h-6 sm:h-9" src="/images/favicon.svg" width="40" height="40" alt="로고 이미지" />
            <span className="text-lg font-bold">멋사컴</span>
          </a>
        </div>
        <div className="w-auto order-2 text-base mt-4 md:mt-0">
          <ul className="flex items-center gap-6 uppercase">
            <li className="hover:text-amber-500 hover:font-semibold"><a href="/info">정보공유</a></li>
            <li className="hover:text-amber-500 hover:font-semibold"><a href="/free">자유게시판</a></li>
            <li className="hover:text-amber-500 a:font-semibold"><a href="/qna">질문게시판</a></li>
          </ul>
        </div>

        <div className="w-1/2 order-1 flex justify-end items-center md:order-2 md:w-auto">

          <div className="flex justify-end">
            <a href="/user/login" className="bg-orange-500 py-1 px-2 text-sm text-white font-semibold ml-2 hover:bg-amber-400 rounded">로그인</a>
            <a href="/user/signup" className="bg-gray-900 py-1 px-2 text-sm text-white font-semibold ml-2 hover:bg-amber-400 rounded">회원가입</a>
          </div>

          <Theme />

        </div>
      </nav>
    </header>
  );
}