import useDirectory from '@/Hooks/useDirectory'
import { Image, MenuItem, Icon, Flex } from '@chakra-ui/react'
import React from 'react'
import { IconType } from 'react-icons'

type MenuListItemProps = {
  displayText: string
  link: string
  imageUrl?: string
  icon: IconType
  iconColor: string
}

const MenuListItem: React.FC<MenuListItemProps> = ({
  displayText,
  link,
  imageUrl,
  icon,
  iconColor,
}) => {
  const { onSelectMenuItem } = useDirectory()
  return (
    <MenuItem
      width="100%"
      fontSize="10pt"
      _hover={{ bg: 'gray.100' }}
      onClick={() =>
        onSelectMenuItem({ link, displayText, icon, iconColor, imageUrl })
      }
    >
      <Flex align="center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="hello"
            borderRadius="full"
            boxSize="18px"
            mr={2}
          />
        ) : (
          <Icon fontSize={20} as={icon} color={iconColor} mr={2} />
        )}
        {displayText}
      </Flex>
    </MenuItem>
  )
}
export default MenuListItem
