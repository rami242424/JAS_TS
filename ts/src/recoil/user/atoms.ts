import { atom, RecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";
import { UserInToken } from "#types/user";

const { persistAtom } = recoilPersist({
  key: 'user',
  storage: sessionStorage
});

export const userState: RecoilState<UserInToken | null> = atom({
  key: "userState",
  default: null,
  effects: [persistAtom]
});