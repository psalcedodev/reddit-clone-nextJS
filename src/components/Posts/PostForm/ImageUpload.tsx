import { Button, Flex, Image, Stack } from '@chakra-ui/react'
import React, { useRef } from 'react'

type ImageUploadProps = {
  onSelectedImage: (e: React.ChangeEvent<HTMLInputElement>) => void
  selectedFile?: string
  setSelectedTab: (tab: string) => void
  setSelectedFile: (file: string) => void
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onSelectedImage,
  selectedFile,
  setSelectedTab,
  setSelectedFile,
}) => {
  const selectedFileRef = useRef<HTMLInputElement>(null)
  return (
    <Flex direction={'column'} justify={'center'} align="center" width="100%">
      {selectedFile ? (
        <>
          <Image
            src={selectedFile}
            alt={selectedFile}
            maxWidth={400}
            maxHeight={400}
          />
          <Stack direction="row" mt={4}>
            <Button height="28px" onClick={() => setSelectedTab('Post')}>
              To Post
            </Button>
            <Button
              variant={'outline'}
              height="28px"
              onClick={() => setSelectedFile('')}
            >
              Remove
            </Button>
          </Stack>
        </>
      ) : (
        <Flex
          justify={'center'}
          align="center"
          p={20}
          border="1px dashed"
          borderColor="gray.200"
          width="100%"
          borderRadius={4}
        >
          <Button
            variant={'outline'}
            height="28px"
            onClick={() => selectedFileRef.current?.click()}
          >
            Upload
          </Button>
          <input
            ref={selectedFileRef}
            type="file"
            hidden
            onChange={onSelectedImage}
          />
          {/* // eslint-disable-next-line @next/next/no-img-element */}
        </Flex>
      )}
    </Flex>
  )
}
export default ImageUpload
