import { FieldError } from "react-hook-form";

// children 속성을 사용하지 않으면 꼭 React.FC로 선언할 필요 없음
function InputError({ target }: { target?: FieldError}) {
  if(!target) return null;
  return <p className="ml-2 mt-1 text-sm text-red-500 dark:text-red-400">{ target.message }</p>;
}

export default InputError