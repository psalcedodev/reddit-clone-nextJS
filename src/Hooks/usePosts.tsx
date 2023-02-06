import { authModalState } from '@/atoms/authModalAtom'
import { communityState } from '@/atoms/communitiesAtom'
import { Post, postState, PostVote } from '@/atoms/postAtom'
import { auth, firestore, storage } from '@/firebase/clientApp'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState)
  const currentCommunity = useRecoilValue(communityState).currentCommunity
  const setAuthModalState = useSetRecoilState(authModalState)
  const [user] = useAuthState(auth)
  const route = useRouter()

  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => {
    event.stopPropagation()

    if (!user?.uid) {
      setAuthModalState({
        isOpen: true,
        view: 'login',
      })
      return
    }
    try {
      const { voteStatus } = post
      const existingVote = postStateValue.postVotes.find(
        (item) => item.postId === post.id
      )

      const batch = writeBatch(firestore)
      const updatePost = { ...post }
      const updatedPosts = [...postStateValue.posts]
      let updatedPostVotes = [...postStateValue.postVotes]

      let voteChange = vote

      // New vote
      if (!existingVote) {
        const postVoteRef = doc(
          collection(firestore, 'users', `${user?.uid}`, 'postVotes')
        )
        const newVote: PostVote = {
          postId: post.id,
          id: postVoteRef.id,
          communityId,
          voteValue: vote,
        }
        batch.set(postVoteRef, newVote)

        updatePost.voteStatus = voteStatus + vote
        updatedPostVotes = [...updatedPostVotes, newVote]
      } else {
        // Existing vote
        const postVoteRef = doc(
          collection(firestore, 'users', `${user?.uid}`, 'postVotes'),
          existingVote.id
        )
        // Removing their vote (up => neutral OR down => neutral)
        if (existingVote.voteValue === vote) {
          updatePost.voteStatus = voteStatus - vote
          updatedPostVotes = updatedPostVotes.filter(
            (vote) => vote.id !== existingVote.id
          )
          // Remove vote
          batch.delete(postVoteRef)
          voteChange *= -1
        } else {
          updatePost.voteStatus = voteStatus + 2 * vote
          const voteIdx = updatedPostVotes.findIndex(
            (vote) => vote.id === existingVote.id
          )
          updatedPostVotes[voteIdx] = {
            ...existingVote,
            voteValue: vote,
          }
          // Update vote
          batch.update(postVoteRef, { voteValue: vote })
          voteChange = 2 * vote
        }
      }

      const postRef = doc(firestore, 'posts', post.id)
      batch.update(postRef, { voteStatus: voteStatus + voteChange })

      await batch.commit()

      const postIdx = updatedPosts.findIndex((item) => item.id === post.id)
      updatedPosts[postIdx] = updatePost
      setPostStateValue((prev) => ({
        ...prev,
        posts: updatedPosts,
        postVotes: updatedPostVotes,
      }))

      if (postStateValue.selectedPost) {
        setPostStateValue((prev) => ({
          ...prev,
          selectedPost: updatePost,
        }))
      }
    } catch (error: any) {
      console.log('onVote', error.message)
    }
  }

  const onSelectPost = async (post: Post) => {
    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: post,
    }))

    route.push(`/r/${post.communityId}/comments/${post.id}`)
  }

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      if (post.imageUrl) {
        const imageRef = ref(storage, `posts/${post.id}/image`)
        await deleteObject(imageRef)
      }

      const postDocRef = doc(firestore, 'posts', post.id)
      await deleteDoc(postDocRef)

      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id),
      }))
      return true
    } catch (error: any) {
      return false
    }
  }

  const getCommunityPostVotes = async (communityId: string) => {
    try {
      const postVotesQuery = query(
        collection(firestore, 'users', `${user?.uid}/postVotes`),
        where('communityId', '==', communityId)
      )

      const postVoteDocs = await getDocs(postVotesQuery)
      const postVotes = postVoteDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setPostStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }))
    } catch (error: any) {
      console.log('getCommunityPostVotes', error.message)
    }
  }

  useEffect(() => {
    if (!user || !currentCommunity?.id) return
    getCommunityPostVotes(currentCommunity.id)
  }, [currentCommunity, user])

  useEffect(() => {
    if (!user) {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }))
    }
  }, [user])

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  }
}
export default usePosts
