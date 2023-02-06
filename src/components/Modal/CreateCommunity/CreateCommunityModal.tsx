import { auth, firestore } from '@/firebase/clientApp'
import useDirectory from '@/Hooks/useDirectory'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
  Box,
  Text,
  Input,
  Stack,
  Checkbox,
  Flex,
  Icon,
} from '@chakra-ui/react'
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { BsFillEyeFill, BsFillPersonFill } from 'react-icons/bs'
import { HiLockClosed } from 'react-icons/hi'

type CreateCommunityModalProps = {
  isOpen: boolean
  handleClose: () => void
}

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  isOpen,
  handleClose,
}) => {
  const [user] = useAuthState(auth)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [communityName, setCommunityName] = useState<string>('')
  const [charsRemaining, setCharsRemaining] = useState<number>(21)
  const [communityType, setCommunityType] = useState<
    'public' | 'private' | 'restricted'
  >('public')

  const router = useRouter()
  const { toggleMenuOpen } = useDirectory()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 21) return
    setCommunityName(e.target.value)
    setCharsRemaining(21 - e.target.value.length)
  }

  const onCommunityTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommunityType(e.target.name as 'public' | 'private' | 'restricted')
  }

  const handleCreateCommunity = async () => {
    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/
    // Validate community name
    if (format.test(communityName) || communityName.length < 3) {
      return setError(
        'Community names must be between 3–21 characters, and can only contain letters, numbers, or underscores.'
      )
    }
    setLoading(true)

    try {
      const communityDocRef = doc(firestore, 'communities', communityName)
      await runTransaction(firestore, async (transaction) => {
        const communityDoc = await transaction.get(communityDocRef)
        if (communityDoc.exists()) {
          throw new Error(`${communityName} is already taken`)
        }
        transaction.set(communityDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacyType: communityType,
        })
        transaction.set(
          doc(firestore, `users/${user?.uid}/communitySnippets`, communityName),
          {
            communityId: communityName,
            isModerator: true,
          }
        )
        handleClose()
        toggleMenuOpen()
        router.push(`r/${communityName}`)
      })
    } catch (error: any) {
      console.log('handleCreateCommunity', error)
      setError(error.message)
    }
    setLoading(false)

    setCommunityName('')
    setCommunityType('public')
  }

  const communityTypes = [
    {
      name: 'Public',
      value: 'public',
      description: 'Anyone can view and join',
      icon: BsFillPersonFill,
    },

    {
      name: 'Restricted',
      value: 'restricted',
      description: 'Only approved users can view and join',
      icon: BsFillEyeFill,
    },
    {
      name: 'Private',
      value: 'private',
      description: 'Only approved users can view and join',
      icon: HiLockClosed,
    },
  ]

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          display="flex"
          flexDirection={'column'}
          fontSize={15}
          padding={3}
        >
          Create a Community
        </ModalHeader>
        <Box pl={3} pr={3}>
          <Divider />

          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" padding="10px 0px">
            <Text fontWeight={600} fontSize={15}>
              Name
            </Text>
            <Text fontSize={11}>
              Community names including capitalization cannot be changed.
            </Text>
            <Text
              position="relative"
              top="28px"
              left="10px"
              width="20px"
              color={'gray.400'}
            >
              r/
            </Text>
            <Input
              position="relative"
              size="sm"
              pl="22px"
              value={communityName}
              onChange={handleChange}
            />
            <Text
              color={charsRemaining === 0 ? 'red' : 'gray.500'}
              fontSize="9pt"
            >
              {charsRemaining} Characters Remaining
            </Text>
            <Text color="red.500" fontSize="9pt">
              {error}
            </Text>
            <Box mt={4} mb={4}>
              <Text fontWeight={600} fontSize={15}>
                Community Type
              </Text>
              <Stack spacing={2}>
                {communityTypes.map((community, index) => (
                  <Checkbox
                    key={index}
                    name={community.value}
                    isChecked={communityType === community.value}
                    onChange={onCommunityTypeChange}
                  >
                    <Flex align="center">
                      <Icon as={community.icon} color="gray.500" mr={2} />
                      <Text fontSize={'10pt'} mr={1}>
                        {community.name}
                      </Text>
                      <Text fontSize={'8pt'} color="gray.500" pt={1}>
                        {community.description}
                      </Text>
                    </Flex>
                  </Checkbox>
                ))}
              </Stack>
            </Box>
          </ModalBody>
        </Box>

        <ModalFooter bg={'gray.100'} borderTopRadius={'0px 0px 10px 10px'}>
          <Button
            colorScheme="blue"
            variant={'outline'}
            height="30px"
            mr={3}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            height="30px"
            onClick={handleCreateCommunity}
            isLoading={loading}
          >
            Create Community
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
export default CreateCommunityModal
