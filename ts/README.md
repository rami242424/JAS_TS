# React 커뮤니티 App Typescript 리팩토링
## 프로젝트 생성
```sh
cd workspace/community

npm init vite@latest ts

Select a framework: » React
Select a variant: » TypeScript

cd ts
npm i
```

#### 설정파일 복사
* vite.config.js
  - community/js/vite.config.js 설정을 복사

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
      { find: "@components", replacement: "/src/components" },
      { find: "@hooks", replacement: "/src/hooks" },
      { find: "@pages", replacement: "/src/pages" },
      { find: "@recoil", replacement: "/src/recoil" },
      { find: "@zustand", replacement: "/src/zustand" },   
    ],
  },
})
```

* tsconfig.app.json
  - community/js/jsconfig.json 설정을 복사
  - allowJs, include 추가 설정

```js
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["/*"],
      "@components/*": ["components/*"],
      "@hooks/*": ["hooks/*"],
      "@pages/*": ["pages/*"],
      "@recoil/*": ["recoil/*"],
      "@zustand/*": ["zustand/*"],
      "#types/*": ["types/*"], // 공용 타입 정의 폴더
    },
    ......
    "allowJs": true, // 자바스크립트 파일을 타입스크립트 프로젝트에 포함
    // "checkJs": true, // 자바스크립트 파일에 대한 타입체크 활성화
  },
  "include": ["src", "src/vite-env.d.ts"] // vite에서 제공하는 import.meta.env 등의 클라이언트용 타입 추가
}
```

* .env, .env.local

* TailWind CSS 패키지 설치
```sh
npm install -D tailwindcss postcss autoprefixer
```

* TailWind CSS 설정 파일 복사
  - postcss.config.js
  - tailwind.config.js

#### 이미지 복사
* public/images/

#### 소스 파일 복사
* src/components/
* src/hooks/
* src/pages/
* src/recoil/
* src/zustand/
* src/App.css
* src/App.jsx -> App.tsx
* src/index.css

#### 공용 타입 설정 파일 작성
* src/types/user.ts
```ts

```

* src/types/article.ts
```ts

```

* src/types/index.ts
```ts
export * from './user';
export * from './article';
```




#### 확장자 ts,tsx 로 수정
* src/routes.jsx

##### 레이아웃 컴포넌트
* src/components/layout/index
```tsx

```

* src/components/layout/Header
```tsx

```

* src/components/layout/Footer
```tsx

```

##### 페이지 컴포넌트
* src/pages/community/index

* src/pages/community/List
```tsx

```

* src/pages/community/ListItem
```tsx

```

* src/pages/community/Detail
```tsx

```

* src/pages/community/CommentList
```tsx

```

* src/pages/community/CommentItem
```tsx

```

* src/recoil/user/atoms
```tsx

```

* src/pages/community/CommentNew
```tsx

```

* src/pages/community/New
```tsx

```

* src/components/InputError
```tsx

```

* src/pages/community/Edit
```tsx

```

* src/components/Login
```tsx

```

* src/components/Signup
```tsx

```


* src/components/Button
```tsx

```

* src/components/Submit
```tsx

```




##### fetch 커스텀 훅
* src/hooks/useFetch.ts
  - 확장자를 ts로 변경
  - 매개변수의 타입 지정
  - fetch()의 응답 데이터 타입을 제네릭으로 정의

```ts
......
const useFetch = <T>(url: string, options: RequestInit = {}) => {
  const [data, setData] = useState<T | null>(null); // API 응답 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState<Error | null>(null); // 에러 상태

  const fetchData = async () => {
    ......
    try {
      ......
    } catch (err) {
      if(err instanceof TypeError){ // 타입 가드
        console.log('네트워크 에러');
        setError(err);
      }else if(err instanceof Error){
        console.log('서버의 에러 응답');
        setError(err);
      }
    } finally {
      ......
    }
  };
  ......
};
......
```

* src/hooks/useMutation.ts
  - 확장자를 ts로 변경
  - 매개변수의 타입 지정
  - 리턴 타입 제네릭으로 지정

```ts
const useMutation = (url: string, options: RequestInit = {}) => {
  const send = async <T>(addOptions = {}): Promise<T> => {
    ...
    const result: T = await response.json();
    ...
  };
  ...
};
```

##### 페이지 컴포넌트
* src/pages/Todo
  - 확장자를 tsx로 변경

* src/pages/TodoItem
  - 확장자를 tsx로 변경
  - prop-types 대신 Props의 type 정의
  - 이벤트 타입 지정
  - 타입 가드 추가

```tsx
import Button from "@components/Button";
import Submit from "@components/Submit";
import useMutation from "@hooks/useMutation";
import { TodoItemData } from "#types/todo";
import { useState } from "react";

type Props = {
  item: TodoItemData,
  refetch: () => Promise<void>,
};

function TodoItem({ item, refetch }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(item.title);
  const { send } = useMutation(`/todos/${ item.id }`);

  // 수정 모드로 변경
  const handleEdit = () => {
    setEditMode(true);
  };

  // 수정 사항 저장
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      await send({
        method: 'PATCH',
        body: JSON.stringify({ title })
      });
      refetch();
    }catch(err){
      if(err instanceof Error) {
        alert(`에러 ${ err.message }`);
      }
    }   
  };

  // 수정 취소
  const handleCancel = () => {
    setTitle(item.title);
    setEditMode(false);
  };

  // 완료/미완료 처리
  const handleDone = async () => {
    try{
      await send({
        method: 'PATCH',
        body: JSON.stringify({ done: !item.done })
      });
      refetch();
    }catch(err){
      if(err instanceof Error) {
        alert(`에러 ${ err.message }`);
      }
    }
  };

  // 삭제
  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try{
      await send({
        method: 'DELETE'
      });
      refetch();
    }catch(err){
      if(err instanceof Error) {
        alert(`에러 ${ err.message }`);
      }
    }
  };

  return (
    <li className="flex justify-between p-4 border-b-2 border-gray-200">
      <form className="flex-grow flex items-center" onSubmit={ handleSave }>
        { editMode
          ? <input className="flex-grow mr-4 border-2 border-gray-300 p-1" type="text" name="title" value={ title } onChange={ (e) => setTitle(e.target.value) } placeholder="내용을 입력하세요." />
          : <span className={`${ item.done ? 'line-through text-gray-400' : '' } cursor-pointer`} onClick={ () => handleDone() }>{ title }</span>
        }

        <div className="flex ml-auto">
          { editMode 
            ? <>
                <Submit size="sm" bgColor="blue">저장</Submit>
                <Button type="reset" size="sm" onClick={ () => handleCancel() }>취소</Button>
              </>
            
            : <>
                <Button size="sm" onClick={ handleEdit }>수정</Button>
                <Submit size="sm" bgColor="red" onClick={ handleDelete }>삭제</Submit>
              </>
          }
        </div>
      </form>
    </li>
  );
}

export default TodoItem;
```

* src/pages/TodoList
  - 확장자를 tsx로 변경
  - prop-types 대신 Props의 type 정의

```tsx
import { TodoListResponse } from "#types/todo";
import TodoItem from "@pages/TodoItem";

type Props = {
  data?: TodoListResponse,
  refetch: () => Promise<void>,
};

function TodoList({ data, refetch }: Props) {

  const items = data?.map((item) => <TodoItem key={ item.id } item={ item } refetch={ refetch } />);

  return (
    <ul>
      { items }
    </ul>
  );
}

export default TodoList;
```

* src/pages/TodoInput
  - 확장자를 tsx로 변경
  - prop-types 대신 Props의 type 정의

```tsx
import { TodoRegistData } from "#types/todo";
import Button from "@components/Button";
import useMutation from "@hooks/useMutation";
import { useState } from "react";

type Props = {
  refetch: () => Promise<void>,
};

function TodoInput({ refetch }: Props) {
  const [ title, setTitle ] = useState('');
  const { send } = useMutation('/todos');

  const handleAdd = async () => {
    try{
      const body: TodoRegistData = {
        title,
        done: false
      }
      await send({
        method: 'POST',
        body: JSON.stringify(body),
      });
      refetch();
    }catch(err){
      if(err instanceof Error) {
        alert(`에러 ${ err.message }`);
      }
    }
  }

  return (
    <div className="flex mb-4">
      <input 
        className="flex-grow border-2 border-gray-300 p-2 rounded-l-lg focus:outline-none focus:border-orange-500" 
        type="text"
        placeholder="할일을 입력하세요."
        name="title"
        value={ title }
        onChange={ (e) => setTitle(e.target.value) } />
      <Button size="md" bgColor="blue" onClick={ handleAdd }>추가</Button>
    </div>
  );
}

export default TodoInput;
```
