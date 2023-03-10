import { Post } from '@/atoms/postAtom'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Flex,
  Icon,
  Image,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { BsChat, BsDot } from 'react-icons/bs'
import { FaReddit } from 'react-icons/fa'
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from 'react-icons/io5'
type PostItemProps = {
  post: Post
  userIsCreator: boolean
  userVoteValue?: number
  onVote: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => void
  onDeletePost: (post: Post) => Promise<boolean>
  onSelectPost?: (post: Post) => void
  homePage?: boolean
}

const PostItem: React.FC<PostItemProps> = ({
  post,
  userIsCreator,
  userVoteValue,
  onVote,
  onDeletePost,
  onSelectPost,
  homePage,
}) => {
  const router = useRouter()
  const [loadingImage, setLoadingImage] = useState(true)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const singlePostPage = !onSelectPost
  const [error, setError] = useState('')

  const handleDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation()
    setLoadingDelete(true)
    try {
      const request = await onDeletePost(post)
      if (singlePostPage) router.push(`/r/${post.communityId}`)
      if (!request) throw new Error('Error deleting post')
    } catch (error: any) {
      setError(error.message)
    }
    setLoadingDelete(false)
  }

  const postFooterButtons = [
    {
      text: post.numberOfComments,
      icon: BsChat,
      canAct: true,
      action: () => void 0,
      actionLoading: false,
    },
    {
      text: 'Share',
      icon: IoArrowRedoOutline,
      canAct: true,
      action: () => void 0,
      actionLoading: false,
    },
    {
      text: 'Save',
      icon: IoBookmarkOutline,
      canAct: true,
      action: () => void 0,
      actionLoading: false,
    },
    {
      text: 'Delete',
      icon: AiOutlineDelete,
      canAct: userIsCreator,
      action: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
        handleDelete(e),
      actionLoading: loadingDelete,
    },
  ]
  return (
    <Flex
      border="1px solid"
      bg="white"
      borderColor={singlePostPage ? 'white' : 'gray.300'}
      borderRadius={singlePostPage ? '4px 4px 0px 0px' : '4px'}
      _hover={{
        borderColor: singlePostPage ? 'none' : 'gray.500',
      }}
      cursor={singlePostPage ? 'unset' : 'pointer'}
      onClick={() => onSelectPost && onSelectPost(post)}
    >
      <Flex
        direction={'column'}
        align="center"
        bg={singlePostPage ? 'none' : 'gray.100'}
        p={2}
        width="40px"
        borderRadius={singlePostPage ? '0' : '3px 0 0 3px'}
      >
        <Icon
          fontSize={24}
          as={
            userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
          }
          color={userVoteValue === 1 ? 'brand.100' : 'gray.400'}
          onClick={(e) => onVote(e, post, 1, post.communityId)}
          cursor={'pointer'}
        />
        <Text>{post.voteStatus}</Text>
        <Icon
          fontSize={24}
          as={
            userVoteValue === -1
              ? IoArrowDownCircleSharp
              : IoArrowDownCircleOutline
          }
          color={userVoteValue === -1 ? '#4379ff' : 'gray.400'}
          onClick={(e) => onVote(e, post, -1, post.communityId)}
          cursor={'pointer'}
        />
      </Flex>
      <Flex direction={'column'} width="100%">
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle mr={2}>{error}</AlertTitle>
          </Alert>
        )}
        <Stack spacing={1} p="10px">
          <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
            {homePage && (
              <>
                {post.communityImageUrl ? (
                  <Image
                    src={post.communityImageUrl}
                    alt="Community Image"
                    borderRadius="full"
                    boxSize="18px"
                    mr={2}
                  />
                ) : (
                  <Icon as={FaReddit} fontSize="20px" color="blue.500" mr={1} />
                )}
                <Link
                  href={`r/${post.communityId}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Text
                    fontWeight={600}
                    _hover={{ textDecoration: 'underline' }}
                  >
                    {`r/${post.communityId}`}
                  </Text>
                </Link>
                <Icon as={BsDot} color="gray.500" fontSize={8} />
              </>
            )}
            <Text>
              {`Posted by u/${post.creatorDisplayName} ${moment(
                new Date(post.createdAt.seconds * 1000)
              ).fromNow()}`}
            </Text>
          </Stack>
          <Text fontSize={'12pt'} fontWeight={600}>
            {post.title}
          </Text>
          <Text fontSize={'10pt'}>{post.body}</Text>
          {post.imageUrl && (
            <Flex justify={'center'} align="center" p={2}>
              {loadingImage && (
                <Skeleton height={'200px'} width="100%" borderRadius={4} />
              )}
              <Image
                src={post.imageUrl}
                maxWidth="460px"
                alt="Post Image"
                display={loadingImage ? 'none' : 'block'}
                onLoad={() => setLoadingImage(false)}
              />
            </Flex>
          )}
        </Stack>
        <Flex ml={1} mb={0.5} color="gray.500" fontWeight={600}>
          {postFooterButtons.map((button, index) => (
            <div key={index}>
              {button.canAct && (
                <Flex
                  align="center"
                  p="8px 10px"
                  borderRadius={4}
                  _hover={{ bg: 'gray.200' }}
                  cursor="pointer"
                  onClick={button.action}
                >
                  {button.actionLoading ? (
                    <>
                      <Spinner size="sm" />
                    </>
                  ) : (
                    <>
                      <Icon as={button.icon} mr={2} />
                      <Text fontSize={'9pt'}>{button.text}</Text>
                    </>
                  )}
                </Flex>
              )}
            </div>
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}
export default PostItem
