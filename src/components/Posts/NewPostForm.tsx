import { Alert, AlertIcon, AlertTitle, Flex, Icon } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BiPoll } from 'react-icons/bi'
import { BsLink45Deg, BsMic } from 'react-icons/bs'
import { IoDocumentText, IoImageOutline } from 'react-icons/io5'
import { AiFillCloseCircle } from 'react-icons/ai'
import TabItem from './TabItem'
import TextInputs from './PostForm/TextInputs'
import ImageUpload from './PostForm/ImageUpload'
import { Post } from '@/atoms/postAtom'
import { User } from 'firebase/auth'
import { useRouter } from 'next/router'
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import { firestore, storage } from '@/firebase/clientApp'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import useSelectFile from '@/Hooks/useSelectFile'

export type TabItemType = {
  title: string
  icon: typeof Icon.arguments
}

const formTabs: TabItemType[] = [
  {
    title: 'Post',
    icon: IoDocumentText,
  },
  {
    title: 'Images & Video',
    icon: IoImageOutline,
  },
  {
    title: 'Poll',
    icon: BiPoll,
  },
  {
    title: 'Link',
    icon: BsLink45Deg,
  },
  {
    title: 'Talk',
    icon: BsMic,
  },
]

interface TextInputProps {
  title: string
  body: string
}
type NewPostFormProps = {
  user: User
  communityImageUrl?: string
}

const NewPostForm: React.FC<NewPostFormProps> = ({
  user,
  communityImageUrl,
}) => {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title)
  const [textInputs, setTextInputs] = useState<TextInputProps>({
    title: '',
    body: '',
  })

  const { selectedFile, onSelectedFile, setSelectedFile } = useSelectFile()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(true)

  const handleCreatePost = async () => {
    const { communityId } = router.query
    // create new post object
    const newPost: Omit<Post, 'id'> = {
      title: textInputs.title,
      body: textInputs.body,
      communityId: communityId as string,
      creatorId: user?.uid,
      creatorDisplayName: user.email!.split('@')[0],
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
      numberOfComments: 0,
      communityImageUrl: communityImageUrl || '',
    }
    setLoading(true)
    try {
      const postDocRef = await addDoc(collection(firestore, 'posts'), newPost)
      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`)
        await uploadString(imageRef, selectedFile, 'data_url')

        const downloadUrl = await getDownloadURL(imageRef)
        await updateDoc(postDocRef, { imageUrl: downloadUrl })
      }
      router.back()
    } catch (error: any) {
      console.log(error.message)
      setError(true)
    }
    setLoading(false)
  }

  const onTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setTextInputs((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex borderBottom={'1px solid'} borderColor="gray.200">
        {formTabs.map((tab, index) => (
          <TabItem
            key={index}
            item={tab}
            selected={tab.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>

      <Flex p={4}>
        {selectedTab === 'Post' && (
          <TextInputs
            textInputs={textInputs}
            onChange={onTextChange}
            loading={loading}
            handleCreatePost={handleCreatePost}
          />
        )}
        {selectedTab === 'Images & Video' && (
          <ImageUpload
            onSelectedImage={onSelectedFile}
            selectedFile={selectedFile}
            setSelectedTab={setSelectedTab}
            setSelectedFile={setSelectedFile}
          />
        )}
      </Flex>
      {error && (
        <>
          <Alert status="error">
            <AlertIcon />
            <AlertTitle mr={2}>
              There was an error creating your post
            </AlertTitle>
          </Alert>
        </>
      )}
    </Flex>
  )
}
export default NewPostForm
