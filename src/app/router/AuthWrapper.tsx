import { useEffect, type PropsWithChildren } from 'react'
import { restoreSession } from '@/app/store/user-slice.ts'
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks.ts'

export function AuthWrapper({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch()
  const { isSessionResolved } = useAppSelector((state) => state.user)

  useEffect(() => {
    if (!isSessionResolved) {
      void dispatch(restoreSession())
    }
  }, [dispatch, isSessionResolved])

  return <>{children}</>
}



