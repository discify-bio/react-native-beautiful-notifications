import { createContext, MutableRefObject } from 'react'
import { NotificationMethods } from './types'

const Context = createContext<MutableRefObject<NotificationMethods>>(null as any)

export default Context