import { defaultDirectoryMenuItem } from '@/atoms/directoryMenuAtom'
import { auth } from '@/firebase/clientApp'
import useDirectory from '@/Hooks/useDirectory'
import { Flex, Image } from '@chakra-ui/react'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import RightContent from '../RightContent/RightContent'
import Directory from './Directory/Directory'
import SearchInput from './SearchInput'

const Navbar: React.FC = () => {
  const [user] = useAuthState(auth)
  const { onSelectMenuItem } = useDirectory()
  return (
    <Flex
      bg="white"
      height="44px"
      padding="6px 12px"
      justifyContent={{ md: 'space-between' }}
    >
      <Flex align="center" width={{ base: '40px', md: 'auto' }}>
        <Image src="/images/redditFace.svg" height="30px" alt="logo" />
        <Image
          src="/images/redditText.svg"
          height="46px"
          alt="logo"
          cursor={'pointer'}
          display={{ base: 'none', md: 'unset' }}
          onClick={() => onSelectMenuItem(defaultDirectoryMenuItem)}
        />
      </Flex>
      {user && <Directory />}
      <SearchInput user={user} />
      <RightContent user={user} />
    </Flex>
  )
}
export default Navbar
