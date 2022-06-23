import * as React from 'react'
import {Dialog} from '@primer/react/lib-esm/Dialog/Dialog'
import {Box, Button} from '@primer/react'
import {useDropzone} from 'react-dropzone'
import {GLOBAL_STATE_KEY} from '../global-state'
import {HStack, VStack} from './stack'
import {Input} from './input'

export function RestoreBackup() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [file, setFile] = React.useState<{name: string; data: string} | null>(null)
  const [confirm, setConfirm] = React.useState(false)

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const [backup] = acceptedFiles
    const reader = new FileReader()
    reader.onload = () => {
      const stateJSON = String(reader?.result)
      const state = JSON.parse(stateJSON)
      setConfirm(false)

      if (state.actions && state.context) {
        setFile({name: backup.name, data: stateJSON})
      } else {
        alert('Expected to find an xstate machine in backup—are you sure this is a Prism backup?')
      }
    }
    reader.readAsText(backup)
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  function restore() {
    if (!file) return
    localStorage.setItem(GLOBAL_STATE_KEY, file.data)
    window.location.reload()
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Restore backup</Button>
      {isOpen ? (
        <Dialog title="Restore backup" onClose={() => setIsOpen(false)}>
          <VStack spacing={16}>
            <Box
              {...getRootProps()}
              py={10}
              sx={{cursor: 'pointer'}}
              background={isDragActive ? 'var(--color-background-secondary-hover)' : null}
              textAlign="center"
            >
              <input {...getInputProps()} />

              {}
              {isDragActive ? (
                <p>Drop files here...</p>
              ) : file ? (
                <p>{file.name}</p>
              ) : (
                <p>Drop files here, or click to select...</p>
              )}
            </Box>

            <HStack spacing={8}>
              <Input
                type="checkbox"
                id="confirm-restore"
                checked={!!file && confirm}
                onChange={e => setConfirm(e.target.checked)}
              />
              <label htmlFor="confirm-restore">I want to restore this backup and lose my current state.</label>
            </HStack>

            <HStack>
              <Button onClick={restore} disabled={!file || !confirm}>
                Restore
              </Button>
            </HStack>
          </VStack>
        </Dialog>
      ) : null}
    </>
  )
}
