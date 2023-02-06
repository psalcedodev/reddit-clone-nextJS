import { Flex, Icon } from "@chakra-ui/react";
import React from "react";
import {
    BsArrowUpRightCircle,
    BsFilterCircle,
    BsCameraVideo,
    BsChatDots,
    BsBell,
} from "react-icons/bs";
import { GrAdd } from "react-icons/gr";

const Icons: React.FC = () => {
    const leftSideIcons = [
        { icon: BsArrowUpRightCircle },
        { icon: BsFilterCircle },
        { icon: BsCameraVideo },
    ];

    const rightSideIcons = [
        { icon: BsChatDots },
        { icon: BsBell },
        { icon: GrAdd },
    ];
    return (
        <Flex>
            <Flex
                display={{ base: "none", md: "flex" }}
                align="center"
                borderRight="1px solid"
                borderColor="gray.200"
            >
                {leftSideIcons.map((icon, index) => (
                    <Flex
                        key={index}
                        mr={1.5}
                        ml={1.5}
                        padding={1}
                        cursor="pointer"
                        borderRadius={4}
                        _hover={{ bg: "gray.200" }}
                        fontSize={22}
                    >
                        <Icon as={icon.icon} />
                    </Flex>
                ))}
            </Flex>
            <>
                {rightSideIcons.map((icon, index) => (
                    <Flex
                        key={index}
                        mr={1.5}
                        ml={1.5}
                        padding={1}
                        cursor="pointer"
                        borderRadius={4}
                        _hover={{ bg: "gray.200" }}
                        fontSize={22}
                    >
                        <Icon as={icon.icon} />
                    </Flex>
                ))}
            </>
        </Flex>
    );
};
export default Icons;
