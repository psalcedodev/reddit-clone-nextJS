import { doc, getDoc, increment } from 'firebase/firestore'
import { CommunitySnippet } from './../atoms/communitiesAtom'
import { firestore } from '@/firebase/clientApp'
import { collection, getDocs, writeBatch } from 'firebase/firestore'
import { auth } from '@/firebase/clientApp'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { Community, communityState } from '@/atoms/communitiesAtom'
import { useEffect, useState } from 'react'
import { authModalState } from '@/atoms/authModalAtom'
import router, { useRouter } from 'next/router'

const useCommunityData = () => {
  const [user] = useAuthState(auth)
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const setAuthModalState = useSetRecoilState(authModalState)

  const getMySnippets = async () => {
    setLoading(true)
    try {
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      )

      const mySnippets = snippetDocs.docs.map((doc) => ({
        communityId: doc.id,
        ...doc.data(),
      }))

      setCommunityStateValue((oldState) => ({
        ...oldState,
        mySnippets: mySnippets as CommunitySnippet[],
        snippetsFetched: true,
      }))
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const joinCommunity = async (communityData: Community) => {
    // batch write
    // create a new community snippet
    // updating the number of members in the community by adding 1
    setLoading(true)

    try {
      const batch = writeBatch(firestore)
      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageUrl: communityData.imageUrl || '',
        isModerator: user?.uid === communityData.creatorId,
      }
      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id
        ),
        newSnippet
      )
      batch.update(doc(firestore, `communities`, communityData.id), {
        numberOfMembers: increment(1),
      })
      await batch.commit()

      setCommunityStateValue((oldState) => ({
        ...oldState,
        mySnippets: [...oldState.mySnippets, newSnippet],
      }))
    } catch (error: any) {
      console.log('joinCommunity', error.message)
      setError(error.message)
    }
    setLoading(false)

    // update recoil state
  }

  const leaveCommunity = async (communityId: string) => {
    // batch write
    // create a new community snippet
    // updating the number of members in the community by subsctracting 1
    setLoading(true)
    try {
      const batch = writeBatch(firestore)

      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
      )
      batch.update(doc(firestore, 'communities', communityId), {
        numberOfMembers: increment(-1),
      })
      await batch.commit()
      // update recoil state
      setCommunityStateValue((oldState) => ({
        ...oldState,
        mySnippets: oldState.mySnippets.filter(
          (snippet) => snippet.communityId !== communityId
        ),
      }))
    } catch (error: any) {
      console.log('leaveCommunity', error.message)
      setError(error.message)
    }
    setLoading(false)
  }

  const onJoinOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    if (!user) {
      setAuthModalState((oldState) => ({
        ...oldState,
        isOpen: true,
        view: 'login',
      }))
      return
    }

    setLoading(true)
    if (isJoined) {
      leaveCommunity(communityData.id)
      return
    }
    joinCommunity(communityData)
  }

  const getCommunityData = async (communityId: string) => {
    setLoading(true)
    try {
      const communityDocRef = doc(firestore, `communities`, communityId)
      const communityDoc = await getDoc(communityDocRef)

      setCommunityStateValue((oldState) => ({
        ...oldState,
        currentCommunity: {
          id: communityDoc.id,
          ...communityDoc.data(),
        } as Community,
      }))
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      setCommunityStateValue((oldState) => ({
        ...oldState,
        mySnippets: [],
        snippetsFetched: false,
      }))
      return
    }
    getMySnippets()
  }, [user])

  useEffect(() => {
    const { communityId } = router.query
    if (communityId && !communityStateValue.currentCommunity) {
      getCommunityData(communityId as string)
    }
  }, [router.query, communityStateValue.currentCommunity])

  return {
    communityStateValue,
    onJoinOrLeaveCommunity,
    loading,
  }
}

export default useCommunityData
