import { communityState } from '@/atoms/communitiesAtom'
import { Post, PostVote } from '@/atoms/postAtom'
import CreatePostLink from '@/components/Community/CreatePostLink'
import Recommendations from '@/components/Community/Recommendations'
import PageContent from '@/components/Layout/PageContent'
import PostItem from '@/components/Posts/PostItem'
import PostLoader from '@/components/Posts/PostLoader'
import { auth, firestore } from '@/firebase/clientApp'
import useCommunityData from '@/Hooks/useCommunityData'
import usePosts from '@/Hooks/usePosts'
import { Stack } from '@chakra-ui/react'
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRecoilValue } from 'recoil'

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth)
  const [loading, setLoading] = useState(false)
  const { communityStateValue } = useCommunityData()

  const {
    postStateValue,
    setPostStateValue,
    onSelectPost,
    onDeletePost,
    onVote,
  } = usePosts()
  const buildUserHomeFeed = async () => {
    setLoading(true)
    try {
      if (communityStateValue.mySnippets.length) {
        const myCommunityIds = communityStateValue.mySnippets.map(
          (snippet) => snippet.communityId
        )
        const postsQuery = query(
          collection(firestore, 'posts'),
          where('communityId', 'in', myCommunityIds),
          limit(10)
        )
        const postDocs = await getDocs(postsQuery)
        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setPostStateValue((prev) => ({
          ...prev,
          posts: posts as Post[],
        }))
      } else {
        buildNotLoggedInHomeFeed()
      }
    } catch (error: any) {
      console.log('buildUserHomeFeed', error.message)
    }
    setLoading(false)
  }

  const buildNotLoggedInHomeFeed = async () => {
    setLoading(true)
    try {
      // grab the 10 most recent posts
      const postsQuery = query(
        collection(firestore, 'posts'),
        orderBy('voteStatus', 'desc'),
        limit(10)
      )
      const postDocs = await getDocs(postsQuery)
      const posts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setPostStateValue((prev) => ({ ...prev, posts: posts as Post[] }))
    } catch (error: any) {
      console.log('buildNotLoggedInHomeFeed', error.message)
    }
    setLoading(false)
  }

  const getUserPostVotes = async () => {
    try {
      const postIds = postStateValue.posts.map((post) => post.id)
      const postVotesQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where('postId', 'in', postIds)
      )
      const postVotesDocs = await getDocs(postVotesQuery)
      const postVotes = postVotesDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setPostStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }))
    } catch (error: any) {
      console.log('getUserPostVotes', error.message)
    }
  }

  useEffect(() => {
    if (communityStateValue.snippetsFetched) buildUserHomeFeed()
  }, [communityStateValue.snippetsFetched])

  useEffect(() => {
    if (!user && !loadingUser) buildNotLoggedInHomeFeed()
  }, [user, loadingUser])

  useEffect(() => {
    if (user && postStateValue.posts.length) getUserPostVotes()
    return () => {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }))
    }
  }, [user, postStateValue.posts])

  return (
    <>
      <PageContent>
        <>
          <CreatePostLink />
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
                    postStateValue.postVotes.find(
                      (vote) => vote.postId === post.id
                    )?.voteValue
                  }
                  onDeletePost={onDeletePost}
                  homePage
                />
              ))}
            </Stack>
          )}
        </>
        <>
          <Recommendations />
        </>
      </PageContent>
    </>
  )
}

export default Home
