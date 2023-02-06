import React from 'react'
import { useRecoilState } from 'recoil'
import { authModalState } from '@/atoms/authModalAtom'

import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import AuthInputs from './AuthInputs'
import OauthButtons from './OauthButtons'
import ResetPassword from './ResetPassword'

const AuthModal: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(authModalState)
  const handleClose = () => {
    setModalState((prev) => ({ ...prev, isOpen: false, view: 'login' }))
  }

  const modalTitle =
    modalState.view === 'login'
      ? 'Login'
      : modalState.view === 'register'
      ? 'Register'
      : modalState.view === 'resetPassword'
      ? 'Reset Password'
      : ''
  return (
    <>
      <Modal isOpen={modalState.isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={'center'}>{modalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            pb={6}
          >
            <Flex
              direction={'column'}
              align={'center'}
              justify={'center'}
              width={'70%'}
            >
              {modalState.view === 'login' || modalState.view === 'register' ? (
                <>
                  <OauthButtons />
                  <Text
                    textAlign={'center'}
                    color={'gray.500'}
                    fontWeight={700}
                  >
                    OR
                  </Text>

                  <AuthInputs />
                </>
              ) : (
                <ResetPassword />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
export default AuthModal
