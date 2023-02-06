import { Button, Flex, Input, Stack, Textarea } from '@chakra-ui/react'
import React from 'react'

type TextInputsProps = {
  textInputs: {
    title: string
    body: string
  }
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  loading: boolean
  handleCreatePost: () => void
}

const TextInputs: React.FC<TextInputsProps> = ({
  textInputs,
  onChange,
  loading,
  handleCreatePost,
}) => {
  return (
    <Stack spacing={3} width="100%">
      <Input
        name="title"
        placeholder="Title"
        onChange={onChange}
        value={textInputs.title}
        fontSize="10pt"
        borderRadius={4}
        _placeholder={{
          color: 'gray.500',
        }}
        _focus={{
          bg: 'white',
          outline: 'none',
          border: '1px solid',
          borderColor: 'black',
        }}
      />
      <Textarea
        name="body"
        placeholder="Text (optional)"
        height="100px"
        onChange={onChange}
        value={textInputs.body}
        fontSize="10pt"
        borderRadius={4}
        _placeholder={{
          color: 'gray.500',
        }}
        _focus={{
          bg: 'white',
          outline: 'none',
          border: '1px solid',
          borderColor: 'black',
        }}
      />
      <Flex justify={'flex-end'}>
        <Button
          isDisabled={!textInputs.title}
          isLoading={loading}
          height={'34px'}
          padding="0px 30px"
          onClick={handleCreatePost}
        >
          Post
        </Button>
      </Flex>
    </Stack>
  )
}
export default TextInputs
