import { Community, communityState } from '@/atoms/communitiesAtom'
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Stack,
  Text,
  Image,
  Spinner,
} from '@chakra-ui/react'
import React, { useRef } from 'react'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import { RiCakeLine } from 'react-icons/ri'
import moment from 'moment'
import Link from 'next/link'
import { auth, firestore, storage } from '@/firebase/clientApp'
import { useAuthState } from 'react-firebase-hooks/auth'
import useSelectFile from '@/Hooks/useSelectFile'
import { FaReddit } from 'react-icons/fa'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { doc, updateDoc } from 'firebase/firestore'
import { useSetRecoilState } from 'recoil'
type AboutProps = {
  communityData: Community
}

const About: React.FC<AboutProps> = ({ communityData }) => {
  const [user] = useAuthState(auth)
  const selectedFileRef = useRef<HTMLInputElement>(null)
  const { selectedFile, onSelectedFile } = useSelectFile()
  const [uploadingImage, setUploadingImage] = React.useState(false)

  const communityStateValue = useSetRecoilState(communityState)

  const handleUploadImage = async () => {
    try {
      if (!selectedFile) return
      setUploadingImage(true)
      const imageRef = ref(storage, `communities/${communityData.id}/image`)
      await uploadString(imageRef, selectedFile, 'data_url')
      const downloadUrl = await getDownloadURL(imageRef)

      await updateDoc(doc(firestore, `communities`, communityData.id), {
        imageUrl: downloadUrl,
      })

      communityStateValue((old) => {
        return {
          ...old,
          currentCommunity: {
            ...old.currentCommunity,
            imageUrl: downloadUrl,
          } as Community,
        }
      })

      setUploadingImage(false)
    } catch (error: any) {
      console.log('error', error.message)
    }
  }

  return (
    <Box position="sticky" top={'14px'}>
      <Flex
        justify={'space-between'}
        align="center"
        bg="blue.400"
        color="white"
        p={3}
        borderRadius={'4px 4px 0px 0px'}
      >
        <Text fontSize={'10pt'} fontWeight={700}>
          About Community
        </Text>
        <Icon as={HiOutlineDotsHorizontal} />
      </Flex>
      <Flex
        direction={'column'}
        p={3}
        bg="white"
        borderRadius={'0px 0px 4px 4px'}
      >
        <Stack>
          <Flex width="100%" p={2} fontSize="10pt" fontWeight={700}>
            <Flex direction={'column'} flexGrow={1}>
              <Text>{communityData.numberOfMembers.toLocaleString()}</Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction={'column'} flexGrow={1}>
              <Text>1</Text>
              <Text>Online</Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex align={'center'} p={1} fontSize="10pt" fontWeight={500}>
            <Icon as={RiCakeLine} />
            {communityData.createdAt && (
              <Text ml={2}>
                Created{' '}
                {moment(
                  new Date(communityData.createdAt.seconds * 1000)
                ).format('MMM D, YYYY')}
              </Text>
            )}
          </Flex>
          <Link href={`/r/${communityData.id}/submit`}>
            <Button width="100%" mt={3} height="30px">
              Create Post
            </Button>
          </Link>
          {communityData.creatorId === user?.uid && (
            <>
              <Divider />
              <Stack spacing={1} fontSize="10pt">
                <Text fontWeight={600}>Admin</Text>
                <Flex align="center" justify={'space-between'}>
                  <Text
                    color="blue.500"
                    cursor={'pointer'}
                    _hover={{ textDecoration: 'underline' }}
                    onClick={() => selectedFileRef.current?.click()}
                  >
                    Change Image
                  </Text>
                  {communityData.imageUrl || selectedFile ? (
                    <Image
                      src={selectedFile || communityData.imageUrl}
                      alt={communityData.id}
                      borderRadius="full"
                      boxSize="40px"
                    />
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize={40}
                      color="brand.100"
                      mr={2}
                    />
                  )}
                </Flex>
                {selectedFile &&
                  (uploadingImage ? (
                    <Spinner />
                  ) : (
                    <Text cursor={'pointer'} onClick={handleUploadImage}>
                      Save Changes
                    </Text>
                  ))}
                <input
                  type="file"
                  ref={selectedFileRef}
                  onChange={onSelectedFile}
                  accept="image/*"
                  hidden
                />
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  )
}
export default About
