export * from './user';
export * from './post';
export * from './file';

export interface CoreRes {
  ok: 0 | 1,
}

export interface Pagination {
  page: number,
  limit: number,
  total: number,
  totalPages: number,
}

export interface CoreSuccessRes extends CoreRes{
  ok: 1,
}

export interface OneItem<T> extends CoreSuccessRes{
  item: T
}

export interface ListType<T> extends CoreSuccessRes{
  item: T[],
  pagination: Pagination,
}


export interface CoreErrorRes extends CoreRes{
  ok: 0,
  message: string,
}

export interface AuthErrorRes extends CoreErrorRes{
  errorName: "EmptyAuthorization | TokenExpiredError | JsonWebTokenError"
}

export interface ValidationError<E> {
  type: string,
  value: string,
  msg: string,
  path: keyof E,
  location: string
}

export interface ValidationErrorRes<E> extends CoreErrorRes{
  errors: ValidationError<E>[]
}

// export type ErrorRes<E> = CoreErrorRes | AuthErrorRes | ValidationErrorRes<E>;

/**
 * @param T: 성공했을 때의 데이터 타입
 * @param E: ValidationError을 응답할 경우 Form의 name 값 목록
 *  
 * 
 */ 
// export type ApiRes<T> = T | ErrorRes;



// E가 있을 때의 APIRes
export type ApiResWithValidation<T, E> = T | CoreErrorRes | AuthErrorRes | ValidationErrorRes<E>;

// E가 없을 때의 APIRes
export type ApiRes<T> = T | CoreErrorRes | AuthErrorRes;

/**
 * E의 전달 여부에 따라 ApiRes 타입 선택
 * @param T: 데이터 패칭에 성공했을 때의 데이터 타입
 * @param E: 서버에서 ValidationError을 응답할 경우 표함 될 수 있는 path 값 목록
 *  
 * 
 */ 
// export type ApiRes<T, E = never> = E extends never ? ApiResWithoutValidation<T> : ApiResWithValidation<T, E>;
