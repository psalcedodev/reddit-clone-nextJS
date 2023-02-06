import { Timestamp } from 'firebase/firestore'
import { atom } from 'recoil'

export interface Community {
  id: string
  creatorId: string
  numberOfMembers: number
  privacyType: 'public' | 'private' | 'restricted'
  createdAt?: Timestamp
  imageUrl?: string
}

export interface CommunitySnippet {
  communityId: string
  isModerator?: boolean
  imageUrl?: string
}

export interface CommunitiesState {
  mySnippets: CommunitySnippet[]
  currentCommunity?: Community
  snippetsFetched: boolean
}

const defaultCommunityState: CommunitiesState = {
  mySnippets: [],
  snippetsFetched: false,
}

export const communityState = atom<CommunitiesState>({
  key: 'communityState',
  default: defaultCommunityState,
})
