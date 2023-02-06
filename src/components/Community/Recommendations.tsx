import { Community } from '@/atoms/communitiesAtom'
import { firestore } from '@/firebase/clientApp'
import useCommunityData from '@/Hooks/useCommunityData'
import {
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  Icon,
  Box,
  Button,
} from '@chakra-ui/react'
import {
  query,
  collection,
  where,
  limit,
  getDocs,
  orderBy,
} from 'firebase/firestore'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaReddit } from 'react-icons/fa'

const Recommendations: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(false)
  const { communityStateValue, onJoinOrLeaveCommunity } = useCommunityData()
  const getCommunityRecommendations = async () => {
    setLoading(true)
    try {
      const communitiesQuery = query(
        collection(firestore, 'communities'),
        orderBy('numberOfMembers', 'desc'),
        limit(5)
      )
      const communityDocs = await getDocs(communitiesQuery)
      const communities = communityDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setCommunities(communities as Community[])
    } catch (error: any) {
      console.log(error.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    getCommunityRecommendations()
  }, [])
  return (
    <Flex
      direction={'column'}
      bg="white"
      borderRadius={4}
      border="1px solid"
      borderColor="gray.300"
    >
      <Flex
        align="flex-end"
        color="white"
        p="6px 10px"
        height={'70px'}
        borderRadius={'4px 4px 0px 0px'}
        fontWeight={700}
        backgroundSize={'cover'}
        bgGradient="linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.75)), url(/images/recCommsArt.png)"
      >
        <Flex>Top Communities</Flex>
      </Flex>
      <Flex direction={'column'}>
        {loading ? (
          <Stack mt={2} p={3}>
            <Flex justify={'space-between'} align={'center'}>
              <SkeletonCircle size="10" />
              <Skeleton height={10} width="70%" />
            </Flex>
            <Flex justify={'space-between'} align={'center'}>
              <SkeletonCircle size="10" />
              <Skeleton height={10} width="70%" />
            </Flex>
            <Flex justify={'space-between'} align={'center'}>
              <SkeletonCircle size="10" />
              <Skeleton height={10} width="70%" />
            </Flex>
          </Stack>
        ) : (
          <>
            {communities.map((community, index) => {
              const isMember = !!communityStateValue?.mySnippets.find(
                (snippet) => snippet.communityId === community.id
              )
              return (
                <Link
                  key={community.id}
                  href={`/r/${community.id}`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <Flex
                    align="center"
                    fontSize={'10pt'}
                    borderBottom="1px solid"
                    borderColor="gray.300"
                    p={'10px 12px'}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Flex width="80%" align="center">
                      <Flex width="15%">
                        <Text>{index + 1}</Text>
                      </Flex>
                      <Flex width="80%" align="center">
                        {community.imageUrl ? (
                          <Image
                            src={community.imageUrl}
                            borderRadius="full"
                            boxSize="28px"
                            mr={2}
                            alt={community.id}
                          />
                        ) : (
                          <Icon
                            as={FaReddit}
                            fontSize={30}
                            mr={2}
                            color="brand.100"
                          />
                        )}
                        <span
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          <Text>{`r/${community.id}`}</Text>
                        </span>
                      </Flex>
                    </Flex>
                    <Box
                      onClick={(event) => {
                        event.stopPropagation()
                        onJoinOrLeaveCommunity(community, isMember)
                      }}
                    >
                      <Button
                        height={'22px'}
                        fontSize="8pt"
                        variant={isMember ? 'outline' : 'solid'}
                      >
                        {isMember ? 'Leave' : 'Join'}
                      </Button>
                    </Box>
                  </Flex>
                </Link>
              )
            })}
            <Box p={3}>
              <Button height={'30px'} width="100%">
                View All
              </Button>
            </Box>
          </>
        )}
      </Flex>
    </Flex>
  )
}

export default Recommendations
