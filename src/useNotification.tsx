import { useContext, useMemo } from 'react'
import Context from './Context'

const useNotification = () => {
  const notificationContext = useContext(Context)

  const notification = useMemo(() => {
    return notificationContext.current
  }, [notificationContext.current])
  return notification
}

export default useNotification
