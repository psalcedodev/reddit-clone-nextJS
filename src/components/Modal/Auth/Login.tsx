import { authModalState } from '@/atoms/authModalAtom'
import { Button, Flex, Input, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '@/firebase/clientApp'
import { FIREBASE_AUTH_ERROR_CODES } from '@/firebase/errors'

type LoginProps = {}

const Login: React.FC<LoginProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState)

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth)

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })

  // Firebase login
  const onSubmit = () => {
    signInWithEmailAndPassword(loginForm.email, loginForm.password)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleSingUp = () => {
    setAuthModalState((prev) => ({
      ...prev,
      view: 'register',
    }))
  }

  const handleResetPassword = () => {
    setAuthModalState((prev) => ({
      ...prev,
      view: 'resetPassword',
    }))
  }

  return (
    <form>
      <Input
        name="email"
        type="email"
        placeholder="Email"
        mb={2}
        onChange={onChange}
        required
        fontSize={'10pt'}
        _placeholder={{
          color: 'gray.500',
        }}
        _hover={{
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        _focus={{
          outline: 'none',
          border: '1px solid',
          bg: 'white',
          borderColor: 'blue.500',
        }}
        bg={'gray.50'}
      />
      <Input
        name="password"
        type="password"
        placeholder="Password"
        mb={2}
        onChange={onChange}
        required
        fontSize={'10pt'}
        _placeholder={{
          color: 'gray.500',
        }}
        _hover={{
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        _focus={{
          outline: 'none',
          border: '1px solid',
          bg: 'white',
          borderColor: 'blue.500',
        }}
        bg={'gray.50'}
      />
      <Text textAlign="center" color="red" fontSize="10pt">
        {
          FIREBASE_AUTH_ERROR_CODES[
            error?.message as keyof typeof FIREBASE_AUTH_ERROR_CODES
          ]
        }
      </Text>
      <Button
        width="100%"
        onClick={onSubmit}
        height="36px"
        mt={2}
        mb={2}
        isLoading={loading}
      >
        Login
      </Button>
      <Flex justifyContent="center" mb={2}>
        <Text fontSize="9pt" mr={1}>
          Forgot your password?
        </Text>
        <Text
          fontSize="9pt"
          color="blue.500"
          cursor="pointer"
          onClick={handleResetPassword}
        >
          Reset
        </Text>
      </Flex>

      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>{"Don't have an account?"}</Text>
        <Text
          ml={1}
          color="blue.500"
          cursor="pointer"
          fontWeight={700}
          onClick={handleSingUp}
        >
          Sign up
        </Text>
      </Flex>
    </form>
  )
}
export default Login
