import { authModalState } from '@/atoms/authModalAtom'
import { Button } from '@chakra-ui/react'
import React from 'react'
import { useSetRecoilState } from 'recoil'
import AuthModal from '../Modal/Auth/AuthModal'

const AuthButtons: React.FC = () => {
  const setAuthModalState = useSetRecoilState(authModalState)

  const handleAuthModal = (view: 'login' | 'register') => {
    setAuthModalState((prev) => ({
      ...prev,
      isOpen: true,
      view: view,
    }))
  }

  return (
    <>
      <AuthModal />
      <Button
        variant="outline"
        height="28px"
        display={{ base: 'none', sm: 'flex' }}
        width={{ base: '70px', md: '110px' }}
        mr={2}
        onClick={() => handleAuthModal('login')}
      >
        Login
      </Button>
      <Button
        variant={'solid'}
        height="28px"
        display={{ base: 'none', sm: 'flex' }}
        width={{ base: '70px', md: '110px' }}
        mr={2}
        onClick={() => handleAuthModal('register')}
      >
        Sign Up
      </Button>
    </>
  )
}

export default AuthButtons
