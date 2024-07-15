export default function Pagination(){
  return (
    <div>
      <ul className="flex justify-center gap-3 m-4">
        <li className="font-bold text-blue-700">
          <a href="/info?page=1">1</a>
        </li>
        <li>
          <a href="/info?page=2">2</a>
        </li>
      </ul>
    </div>
  );
}