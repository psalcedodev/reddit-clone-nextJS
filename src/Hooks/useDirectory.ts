import { FaReddit } from 'react-icons/fa'
import { useRecoilValue } from 'recoil'
import { useEffect } from 'react'
import {
  DirectoryMenuItem,
  directoryMenuState,
} from '@/atoms/directoryMenuAtom'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { communityState } from '@/atoms/communitiesAtom'
const useDirectory = () => {
  const [directoryState, setDirectoryState] = useRecoilState(directoryMenuState)
  const communityStateValue = useRecoilValue(communityState)
  const router = useRouter()

  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    setDirectoryState((oldState) => ({
      ...oldState,
      selectedMenuItem: menuItem,
    }))
    router.push(menuItem.link)
    if (directoryState.isOpen) toggleMenuOpen()
  }

  const toggleMenuOpen = () => {
    setDirectoryState((oldState) => ({
      ...oldState,
      isOpen: !directoryState.isOpen,
    }))
  }

  useEffect(() => {
    const { currentCommunity } = communityStateValue
    if (currentCommunity) {
      setDirectoryState((oldState) => ({
        ...oldState,
        selectedMenuItem: {
          displayText: currentCommunity.id,
          link: `/r/${currentCommunity.id}`,
          imageUrl: currentCommunity.imageUrl,
          icon: FaReddit,
          iconColor: 'blue.500',
        },
      }))
    }
  }, [communityStateValue.currentCommunity])

  return { directoryState, toggleMenuOpen, onSelectMenuItem }
}
export default useDirectory
