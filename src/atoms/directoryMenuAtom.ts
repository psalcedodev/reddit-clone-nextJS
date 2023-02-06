import { TiHome } from 'react-icons/ti'
import { IconType } from 'react-icons'
import { atom } from 'recoil'

export type DirectoryMenuItem = {
  displayText: string
  icon: IconType
  link: string
  iconColor: string
  imageUrl?: string
}
interface DirectoryMenuState {
  isOpen: boolean
  selectedMenuItem: DirectoryMenuItem
}

export const defaultDirectoryMenuItem: DirectoryMenuItem = {
  displayText: 'Home',
  icon: TiHome,
  link: '/',
  iconColor: 'black',
}

export const defaultMenuState: DirectoryMenuState = {
  isOpen: false,
  selectedMenuItem: defaultDirectoryMenuItem,
}

export const directoryMenuState = atom({
  key: 'directoryMenuState',
  default: defaultMenuState,
})
