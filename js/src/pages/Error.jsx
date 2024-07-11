import Footer from "@components/layout/Footer";
import Header from "@components/layout/Header";
import { useRouteError } from "react-router-dom";

function Error() {
  const err = useRouteError();
  const message = err.status === 404 ? '존재하지 않는 페이지입니다.' : err.message || '예상하지 못한 에러가 발생했습니다.';
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="py-20 bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg flex flex-col items-center space-y-2">
        <h2 className="text-xl font-semibold mb-2 text-center">🚧 앗, 무언가 잘못됐네요!</h2>
        <h3 className="text-md font-semibold mb-2 text-center">{ message }</h3>
        <p className="pt-12 text-center">이 오류는 더 나은 서비스를 위한 첫걸음이에요. 조금만 기다려 주세요!</p>
        <button className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600">
          ⚙️ 문제 해결하기
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default Error;