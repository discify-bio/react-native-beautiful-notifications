import { ReactNode } from 'react'

export interface NotificationProperties {
  id?: string
  children: ReactNode
}

export interface NotificationMethods {
  show: (properties: NotificationProperties) => void
}
