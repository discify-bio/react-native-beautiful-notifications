import React from 'react'
import { MutableRefObject, PropsWithChildren, useEffect, useRef, useState } from 'react'
import Context from './Context'
import { NotificationProperties, NotificationMethods } from './types'
import { Host, Portal } from 'react-native-portalize'
import Animated, { Easing, FadeInUp, FadeOutUp, runOnJS, useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

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
  const [id, setId] = useState<string | null>(null)

  useEffect(() => {
    ref.current = {
      show: start
    }
  }, [])

  const value = useSharedValue(0)
  const translateValue = useSharedValue(0)

  const start = (properties: NotificationProperties) => {
    if (!properties.children) return
    if (properties.id) setId(properties.id)

    setNotificationChildren(properties.children)
    startAnimation()
  }

  const closeModal = () => {
    translateValue.value = 0
    setIsOpen(false)
    setNotificationChildren(null)
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
      }, (isEnded) => {
        if (isEnded) runOnJS(closeModal)()
      }))
    )
  }

  const gesture = Gesture.Pan()
      .activeOffsetY([-10, 0])
      .onUpdate(event => {
        const value = event.translationY / 1.5
        if (value > 0) return
        translateValue.value = value
      })
      .onEnd(event => {
        if (event.translationY > -10) {
          translateValue.value = withSpring(0, {
            stiffness: 250,
            damping: 25
          })
          return
        }
        closeModal()
      })

  const blockStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateValue.value
        }
      ]
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
              <GestureDetector
                gesture={gesture}
              >
                <Animated.View
                  key={id}
                  entering={FadeInUp}
                  exiting={FadeOutUp}
                  style={blockStyle}
                >
                  {notificationChildren}
                </Animated.View>
              </GestureDetector>
            )}
          </SafeAreaView>
        </Portal>
        {children}
      </Host>
    </Context.Provider>
  )
}

export default Provider
