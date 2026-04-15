import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { hideGlobalError } from '@/store/settings-slice.ts'
import { useAppSelector } from '@/store/hooks.ts'
import { useAppDispatch } from '@/store/hooks.ts'
import { restoreSession } from '@/store/user-slice.ts'
import { Loader } from '@/ui/loader/loader.tsx'
import { ErrorModal } from '@/ui/modal/error-modal.tsx'

export function CommonWrapper() {
  const dispatch = useAppDispatch()
  const { errorMessage, isGlobalLoading } = useAppSelector((state) => state.settings)
  const { isSessionResolved } = useAppSelector((state) => state.user)

  useEffect(() => {
    if (!isSessionResolved) {
      void dispatch(restoreSession())
    }
  }, [dispatch, isSessionResolved])

  return (
    <>
      {isGlobalLoading ? <Loader /> : null}
      {errorMessage ? (
        <ErrorModal message={errorMessage} onClose={() => dispatch(hideGlobalError())} />
      ) : null}
      <Outlet />
    </>
  )
}
