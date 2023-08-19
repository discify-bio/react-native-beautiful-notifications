import { ReactNode } from 'react'

export interface NotificationProperties {
  children: ReactNode
}

export interface NotificationMethods {
  show: (properties: NotificationProperties) => void
}
