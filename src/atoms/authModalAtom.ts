import { atom } from 'recoil'

export interface AuthModalStateProps {
  isOpen: boolean
  view: 'login' | 'register' | 'resetPassword'
}

const defaultModalState: AuthModalStateProps = {
  isOpen: false,
  view: 'login',
}

export const authModalState = atom<AuthModalStateProps>({
  key: 'authModalStateKey',
  default: defaultModalState,
})
