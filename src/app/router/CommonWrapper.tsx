import type { PropsWithChildren } from 'react'
import { Loader } from '@/ui/loader/loader.tsx'
import { ErrorModal } from '@/ui/modal/error-modal.tsx'
import { hideGlobalError } from '@/app/store/settings-slice.ts'
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks.ts'

export function CommonWrapper({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch()
  const { errorMessage, isGlobalLoading } = useAppSelector((state) => state.settings)

  return (
    <>
      {isGlobalLoading ? <Loader /> : null}
      {errorMessage ? (
        <ErrorModal message={errorMessage} onClose={() => dispatch(hideGlobalError())} />
      ) : null}
      {children}
    </>
  )
}




