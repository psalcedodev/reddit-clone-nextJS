import { authModalState } from '@/atoms/authModalAtom'
import { Button, Flex, Input, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '@/firebase/clientApp'
import { FIREBASE_AUTH_ERROR_CODES } from '@/firebase/errors'

type RegisterProps = {}

const Register: React.FC<RegisterProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState)

  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [formError, setFormError] = useState<string>('')

  const [createUserWithEmailAndPassword, _, loading, signUpError] =
    useCreateUserWithEmailAndPassword(auth)

  // Firebase Register
  const onSubmit = () => {
    if (formError) setFormError('')
    if (registerForm.password !== registerForm.confirmPassword) {
      setFormError('Passwords do not match')
      return
    }
    createUserWithEmailAndPassword(registerForm.email, registerForm.password)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleLogin = () => {
    setAuthModalState((prev) => ({
      ...prev,
      view: 'login',
    }))
  }

  return (
    <form>
      {(formError || signUpError) && (
        <Text textAlign="center" color="red" fontSize="10pt">
          {formError ||
            FIREBASE_AUTH_ERROR_CODES[
              signUpError?.message as keyof typeof FIREBASE_AUTH_ERROR_CODES
            ]}
        </Text>
      )}
      <Input
        required
        name="email"
        type="email"
        placeholder="Email"
        mb={2}
        onChange={onChange}
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
      <Input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
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
      <Button
        width="100%"
        onClick={onSubmit}
        height="36px"
        mt={2}
        mb={2}
        isLoading={loading}
      >
        Register
      </Button>

      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>Already a redditor?</Text>
        <Text
          ml={1}
          color="blue.500"
          cursor="pointer"
          fontWeight={700}
          onClick={handleLogin}
        >
          Login
        </Text>
      </Flex>
    </form>
  )
}
export default Register
