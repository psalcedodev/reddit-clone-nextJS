import { Post, postState } from '@/atoms/postAtom'
import { firestore } from '@/firebase/clientApp'
import {
  Box,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from '@chakra-ui/react'
import { User } from 'firebase/auth'
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import CommentInput from './CommentInput'
import CommentItem, { Comment } from './CommentItem'

type CommentsProps = {
  user?: User | null
  selectedPost: Post | null
  communityId: string
}

const Comments: React.FC<CommentsProps> = ({
  user,
  selectedPost,
  communityId,
}) => {
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [fetchLoading, setfetchLoading] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [deleteLoadingId, setDeleteLoadingId] = useState('')
  const setPostState = useSetRecoilState(postState)
  const onCreateComment = async () => {
    setCreateLoading(true)
    try {
      const batch = writeBatch(firestore)

      const commentDocRef = doc(collection(firestore, 'comments'))
      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user!.uid!,
        creatorDisplayText: user!.email!.split('@')[0],
        communityId: communityId,
        postId: selectedPost?.id!,
        postTitle: selectedPost?.title!,
        text: commentText,
        createdAt: serverTimestamp() as Timestamp,
      }
      batch.set(commentDocRef, newComment)

      newComment.createdAt = {
        seconds: Date.now() / 1000,
      } as Timestamp

      const postDocRef = doc(collection(firestore, 'posts'), selectedPost?.id)
      batch.update(postDocRef, {
        numberOfComments: selectedPost?.numberOfComments! + 1,
      })

      await batch.commit()

      setCommentText('')
      setComments((prevComments) => [newComment, ...prevComments])
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost!,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1,
        },
      }))
    } catch (error: any) {
      console.log(error.message)
    }
    setCreateLoading(false)
  }
  const onDeleteComment = async (comment: Comment) => {
    setDeleteLoadingId(comment.id)
    try {
      const batch = writeBatch(firestore)

      const commentDocRef = doc(collection(firestore, 'comments'), comment.id)
      batch.delete(commentDocRef)

      const postDocRef = doc(collection(firestore, 'posts'), selectedPost?.id)
      batch.update(postDocRef, {
        numberOfComments: selectedPost?.numberOfComments! - 1,
      })

      await batch.commit()

      setComments((prevComments) =>
        prevComments.filter((item) => item.id !== comment.id)
      )
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost!,
          numberOfComments: prev.selectedPost!.numberOfComments - 1,
        },
      }))
    } catch (error: any) {
      console.log(error.message)
    }
    setDeleteLoadingId('')
  }

  const getPostComments = async () => {
    setfetchLoading(true)
    try {
      const commentsQuery = query(
        collection(firestore, 'comments'),
        where('postId', '==', selectedPost?.id),
        orderBy('createdAt', 'desc')
      )
      const commentsDoc = await getDocs(commentsQuery)
      const commentsData = commentsDoc.docs.map((doc) =>
        doc.data()
      ) as Comment[]
      setComments(commentsData)
    } catch (error: any) {
      console.log(error.message)
    }
    setfetchLoading(false)
  }

  useEffect(() => {
    if (!selectedPost) return
    getPostComments()
  }, [selectedPost])

  return (
    <Box bg="white" borderRadius={'0px 0px 4px 4px'} p={2}>
      <Flex
        direction={'column'}
        pl={10}
        pr={4}
        mb={6}
        fontSize="10pt"
        width="100%"
      >
        {!fetchLoading && (
          <CommentInput
            commentText={commentText}
            setCommentText={setCommentText}
            user={user}
            createLoading={createLoading}
            onCreateComment={onCreateComment}
          />
        )}
      </Flex>
      <Stack spacing={6} width="100%" p={2}>
        {fetchLoading ? (
          <>
            {[0, 1, 2, 3].map((item) => (
              <Box key={item} bg="gray.100" borderRadius="4px" p={2}>
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={4} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {comments.length === 0 ? (
              <Flex
                direction={'column'}
                p={20}
                align={'center'}
                justify={'center'}
                borderTop={'1px solid'}
                borderColor={'gray.100'}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No comments yet
                </Text>
              </Flex>
            ) : (
              <>
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    userId={user?.uid!}
                    onDeleteComment={onDeleteComment}
                    loadingDelete={deleteLoadingId === comment.id}
                  />
                ))}
              </>
            )}
          </>
        )}
      </Stack>
    </Box>
  )
}
export default Comments
