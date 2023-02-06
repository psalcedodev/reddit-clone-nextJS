import { auth } from "@/firebase/clientApp";
import { Button, Flex, Image } from "@chakra-ui/react";
import React from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";

const OauthButtons: React.FC = () => {
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

    return (
        <Flex direction={"column"} width="100%" mb={4}>
            <Button
                variant={"oauth"}
                mb={2}
                onClick={() => signInWithGoogle()}
                isLoading={loading}
            >
                <Image
                    src="/images/googlelogo.png"
                    height="20px"
                    mr={4}
                    alt="logo"
                />
                Continue with Google
            </Button>
            <Button variant={"oauth"}>Other Oauth</Button>
            {error && <p>{error.message}</p>}
        </Flex>
    );
};
export default OauthButtons;
