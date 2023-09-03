import { ReactNode } from 'react'

export interface NotificationProperties {
  id?: string
  children: ReactNode
  onPress?: () => any
}

export interface NotificationMethods {
  show: (properties: NotificationProperties) => void
}
