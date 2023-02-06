import { ChevronDownIcon } from '@chakra-ui/icons'
import {
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react'
import { User } from 'firebase/auth'
import React from 'react'
import { CgProfile } from 'react-icons/cg'
import { FaRedditSquare } from 'react-icons/fa'
import { IoSparkles } from 'react-icons/io5'
import { MdOutlineLogin } from 'react-icons/md'
import { VscAccount } from 'react-icons/vsc'

import { authModalState } from '@/atoms/authModalAtom'
import { auth } from '@/firebase/clientApp'
import { signOut } from 'firebase/auth'
import { useSetRecoilState } from 'recoil'
type UserMenuProps = {
  user?: User | null
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const setAuthModalState = useSetRecoilState(authModalState)

  const logout = async () => {
    await signOut(auth)
  }

  const menuItems = [
    {
      icon: CgProfile,
      text: 'Profile',
      onClick: () => console.log('Profile'),
    },
    {
      icon: MdOutlineLogin,
      text: 'Logout',
      onClick: () => logout(),
    },
  ]

  const handleLogin = () => {
    setAuthModalState((prev) => ({
      ...prev,
      isOpen: true,
      view: 'login',
    }))
  }

  return (
    <Menu>
      <MenuButton
        cursor={'pointer'}
        padding="0px 6px"
        borderRadius={4}
        _hover={{
          bg: 'gray.200',
          outline: '1px solid',
        }}
      >
        <Flex align="center">
          <Flex align="center">
            {user ? (
              <>
                <Icon
                  fontSize={24}
                  mr={1}
                  color="gray.300"
                  as={FaRedditSquare}
                />
                <Flex
                  direction={'column'}
                  align={'flex-start'}
                  fontSize={'8pt'}
                  mr={8}
                  display={{ base: 'none', lg: 'flex' }}
                >
                  <Text fontWeight={700} color={'gray.700'}>
                    {user.displayName || user.email?.split('@')[0]}
                  </Text>
                  <Flex>
                    <Icon as={IoSparkles} color={'brand.100'} />
                    <Text color={'gray.500'}>0 karma</Text>
                  </Flex>
                </Flex>
              </>
            ) : (
              <Icon fontSize={24} mr={1} color="gray.300" as={VscAccount} />
            )}
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        {user ? (
          <>
            {menuItems.map((item, index) => (
              <div key={index}>
                <MenuDivider />
                <MenuItem
                  fontSize="10pt"
                  fontWeight={700}
                  _hover={{
                    bg: 'blue.500',
                    color: 'white',
                  }}
                  onClick={item.onClick}
                >
                  <Flex>
                    <Icon fontSize={20} mr={2} as={item.icon} />
                    {item.text}
                  </Flex>
                </MenuItem>
              </div>
            ))}
          </>
        ) : (
          <MenuItem
            fontSize="10pt"
            fontWeight={700}
            _hover={{
              bg: 'blue.500',
              color: 'white',
            }}
            onClick={handleLogin}
          >
            <Flex>
              <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
              Log In / Sign Up
            </Flex>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  )
}
export default UserMenu
