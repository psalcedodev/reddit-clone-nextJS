import { communityState } from '@/atoms/communitiesAtom'
import CreateCommunityModal from '@/components/Modal/CreateCommunity/CreateCommunityModal'
import { Box, Flex, Icon, MenuItem, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FaReddit } from 'react-icons/fa'
import { GrAdd } from 'react-icons/gr'
import { useRecoilValue } from 'recoil'
import MenuListItem from './MenuListItem'
type CommunitiesProps = {}

const Communities: React.FC<CommunitiesProps> = () => {
  const [open, setOpen] = useState(false)
  const mySnippets = useRecoilValue(communityState).mySnippets

  return (
    <>
      <CreateCommunityModal isOpen={open} handleClose={() => setOpen(false)} />
      <Box my={3}>
        <Text fontWeight={500} fontSize="7pt" pl={3} mb={1} color="gray.500">
          Moderating
        </Text>

        {mySnippets
          .filter((item) => item.isModerator)
          .map((item, index) => (
            <MenuListItem
              key={index}
              icon={FaReddit}
              displayText={`r/${item.communityId}`}
              link={`/r/${item.communityId}`}
              iconColor="brand.100"
              imageUrl={item.imageUrl}
            />
          ))}
      </Box>
      <Box my={3}>
        <Text fontWeight={500} fontSize="7pt" pl={3} mb={1} color="gray.500">
          My Communities
        </Text>

        <MenuItem
          width={'100%'}
          fontSize="10pt"
          _hover={{ bg: 'gray.100' }}
          onClick={() => setOpen(true)}
        >
          <Flex align="center">
            <Icon fontSize={20} mr={2} as={GrAdd} />
            Create Community
          </Flex>
        </MenuItem>
        {mySnippets.map((item, index) => (
          <MenuListItem
            key={index}
            icon={FaReddit}
            displayText={`r/${item.communityId}`}
            link={`/r/${item.communityId}`}
            iconColor="red.500"
            imageUrl={item.imageUrl}
          />
        ))}
      </Box>
    </>
  )
}
export default Communities
