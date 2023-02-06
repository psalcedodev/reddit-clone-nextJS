import { Community } from '@/atoms/communitiesAtom'
import { Post } from '@/atoms/postAtom'
import { auth, firestore } from '@/firebase/clientApp'
import usePosts from '@/Hooks/usePosts'
import { Stack } from '@chakra-ui/react'
import { getDocs, collection, query, where, orderBy } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRecoilValueLoadable } from 'recoil'
import PostItem from './PostItem'
import PostLoader from './PostLoader'

type PostsProps = {
  communityData: Community
}

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  // fetch posts from database
  // display posts
  const [user] = useAuthState(auth)

  const [loading, setLoading] = useState(false)
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  } = usePosts()

  const getPosts = async () => {
    try {
      setLoading(true)
      const postsQuery = query(
        collection(firestore, 'posts'),
        where('communityId', '==', communityData.id),
        orderBy('createdAt', 'desc')
      )
      const postDocs = await getDocs(postsQuery)
      const posts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setPostStateValue((prev) => ({ ...prev, posts: posts as Post[] }))
      setLoading(false)
    } catch (error: any) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    getPosts()
  }, [communityData])

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map((post) => (
            <PostItem
              userIsCreator={user?.uid === post.creatorId}
              key={post.id}
              post={post}
              onVote={onVote}
              onSelectPost={onSelectPost}
              userVoteValue={
                postStateValue.postVotes.find((vote) => vote.postId === post.id)
                  ?.voteValue
              }
              onDeletePost={onDeletePost}
            />
          ))}
        </Stack>
      )}
    </>
  )
}
export default Posts
