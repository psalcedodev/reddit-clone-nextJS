import React, { useState } from 'react'

const useSelectFile = () => {
  const [selectedFile, setSelectedFile] = useState<string>('')

  const onSelectedFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader()
    if (e.target.files) {
      reader.readAsDataURL(e.target.files[0])
      reader.onloadend = () => {
        setSelectedFile(reader.result as string)
      }
    }
  }

  return { selectedFile, onSelectedFile, setSelectedFile }
}
export default useSelectFile
