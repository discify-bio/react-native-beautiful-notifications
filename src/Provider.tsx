import React from 'react'
import { MutableRefObject, PropsWithChildren, useEffect, useRef, useState } from 'react'
import Context from './Context'
import { NotificationProperties, NotificationMethods } from './types'
import { Host, Portal } from 'react-native-portalize'
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withDelay, withSequence, withTiming } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

interface IProps {
  config?: {
    font?: string
    paddingHorizontal?: number
    backgroundColor?: string
  }
}

const Provider: React.FC<PropsWithChildren<IProps>> = ({
  children
}) => {
  const ref = useRef<NotificationMethods>(null) as MutableRefObject<NotificationMethods>

  const [isOpen, setIsOpen] = useState(false)
  const [notificationChildren, setNotificationChildren] = useState<React.ReactNode | null>(null)

  useEffect(() => {
    ref.current = {
      show: start
    }
  }, [])

  const value = useSharedValue(0)

  const start = (properties: NotificationProperties) => {
    if (!properties.children) return
    
    setNotificationChildren(properties.children)
    startAnimation()
  }

  const startAnimation = () => {
    setIsOpen(true)
    value.value = withSequence(
      withTiming(1, {
        easing: Easing.inOut(Easing.quad),
        duration: 350
      }),
      withDelay(3000, withTiming(0, {
        easing: Easing.inOut(Easing.quad),
        duration: 350
      }, () => {
        runOnJS(setIsOpen)(false)
      }))
    )
  }

  const backgroundAnimation = useAnimatedStyle(() => {
    return {
      opacity: value.value
    }
  })
  
  return (
    <Context.Provider
      value={ref}
    >
      <Host
        style={{
          flex: 1
        }}
      >
        <Portal>
          <SafeAreaView>
            {isOpen && (
              <Animated.View
                style={[
                  backgroundAnimation
                ]}
                key={String(isOpen)}
              >
                {notificationChildren}
              </Animated.View>
            )}
          </SafeAreaView>
        </Portal>
        {children}
      </Host>
    </Context.Provider>
  )
}

export default Provider
