import { communityState } from '@/atoms/communitiesAtom'
import { Post } from '@/atoms/postAtom'
import About from '@/components/Community/About'
import PageContent from '@/components/Layout/PageContent'
import Comments from '@/components/Posts/Comments/Comments'
import PostItem from '@/components/Posts/PostItem'
import { auth, firestore } from '@/firebase/clientApp'
import useCommunityData from '@/Hooks/useCommunityData'
import usePosts from '@/Hooks/usePosts'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRecoilValue } from 'recoil'

type PostPageProps = {}

const PostPage: React.FC<PostPageProps> = () => {
  const { postStateValue, onVote, onDeletePost, setPostStateValue } = usePosts()
  const { communityStateValue } = useCommunityData()
  const [user] = useAuthState(auth)
  const router = useRouter()

  const fetchPost = async (postId: string) => {
    try {
      const postDocRef = doc(firestore, 'posts', postId)
      const postDoc = await getDoc(postDocRef)

      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }))
    } catch (error: any) {
      console.log('fetchPost', error.message)
    }
  }

  useEffect(() => {
    const { pid } = router.query
    if (pid && !postStateValue.selectedPost) {
      fetchPost(pid as string)
    }
  }, [router.query, postStateValue.selectedPost])

  return (
    <PageContent>
      <>
        {postStateValue.selectedPost && (
          <PostItem
            userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
            post={postStateValue.selectedPost}
            onVote={onVote}
            userVoteValue={
              postStateValue.postVotes.find(
                (vote) => vote.postId === postStateValue.selectedPost?.id
              )?.voteValue
            }
            onDeletePost={onDeletePost}
          />
        )}
        <Comments
          user={user}
          selectedPost={postStateValue.selectedPost}
          communityId={communityStateValue.currentCommunity?.id as string}
        />
      </>
      <>
        {communityStateValue.currentCommunity && (
          <About communityData={communityStateValue.currentCommunity} />
        )}
      </>
    </PageContent>
  )
}
export default PostPage
