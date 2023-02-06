import { Community } from '@/atoms/communitiesAtom'
import { Box, Button, Flex, Icon, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { FaReddit } from 'react-icons/fa'
import useCommunityData from '@/Hooks/useCommunityData'
type HeaderProps = {
  communityData: Community
}

const Header: React.FC<HeaderProps> = ({ communityData }) => {
  const { communityStateValue, onJoinOrLeaveCommunity, loading } =
    useCommunityData()
  const isJoined = !!communityStateValue.mySnippets.find(
    (snippet) => snippet.communityId === communityData.id
  )
  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="56%" bg="blue.400" />
      <Flex justify="center" flexGrow={1} bg="white">
        <Flex width="95%" maxWidth="860px">
          {communityStateValue.currentCommunity?.imageUrl ? (
            <Image
              src={communityStateValue.currentCommunity.imageUrl}
              alt={communityStateValue.currentCommunity.id}
              borderRadius="full"
              boxSize="64px"
              border="4px solid white"
              position="relative"
              top={-3}
              bg="white"
            />
          ) : (
            <Icon
              as={FaReddit}
              fontSize={64}
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
              borderRadius="50%"
            />
          )}
          <Flex padding="10px 16px">
            <Flex direction="column" mr={6}>
              <Text fontSize="16pt" fontWeight={800}>
                {communityData.id}
              </Text>
              <Text fontSize="10pt" color="gray.400">
                r/{communityData.id}
              </Text>
            </Flex>
            <Button
              variant={isJoined ? 'outline' : 'solid'}
              height="30px"
              pr={6}
              pl={6}
              isLoading={loading}
              onClick={() => onJoinOrLeaveCommunity(communityData, isJoined)}
            >
              <Text fontSize="10pt" fontWeight={600}>
                {isJoined ? 'Joined' : 'Join'}
              </Text>
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
export default Header
