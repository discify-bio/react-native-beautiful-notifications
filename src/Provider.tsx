import React from 'react'
import { MutableRefObject, PropsWithChildren, useEffect, useRef, useState } from 'react'
import Context from './Context'
import { NotificationProperties, NotificationMethods } from './types'
import { Host, Portal } from 'react-native-portalize'
import Animated, { Easing, Extrapolation, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { TouchableOpacity } from 'react-native'

interface IProps {
  config?: {
    activeOpacity?: number
  }
}

const Provider: React.FC<PropsWithChildren<IProps>> = ({
  children,
}) => {
  const ref = useRef<NotificationMethods>(null) as MutableRefObject<NotificationMethods>
  const insets = useSafeAreaInsets()

  const [isOpen, setIsOpen] = useState(false)

  const [notificationChildren, setNotificationChildren] = useState<React.ReactNode | null>(null)
  const [id, setId] = useState<string | null>(null)
  const [notificationOnPress, setNotificationOnPress] = useState<(() => any) | undefined>(undefined)

  const [timeoutNumber, setTimeoutNumber] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    ref.current = {
      show: start
    }
  }, [])

  const value = useSharedValue(0)
  const translateValue = useSharedValue(0)

  const start = (properties: NotificationProperties) => {
    if (!properties.children) return
    setTimeoutNumber(value => {
      if (value !== null) clearTimeout(value)
      return null
    })
    if (properties.id) setId(properties.id)
    if (properties.onPress) setNotificationOnPress(() => properties.onPress)

    setNotificationChildren(properties.children)
    startAnimation()
  }

  const closeModal = () => {
    value.value = withTiming(0, {
      duration: 350
    }, () => runOnJS(clear)())
  }

  const onPress = () => {
    closeModal()
    if (notificationOnPress) notificationOnPress()
  }

  const clear = () => {
    setIsOpen(false)
    setNotificationChildren(null)
    translateValue.value = 0
    setTimeoutNumber(null)
  }

  const startAnimation = () => {
    setIsOpen(true)
    value.value = withTiming(1, {
      easing: Easing.inOut(Easing.quad),
      duration: 350
    })
    startTimeout()
  }

  const startTimeout = () => {
    setTimeoutNumber(setTimeout(() => {
      closeModal()
    }, 3500))
  }

  const gesture = Gesture.Pan()
      .activeOffsetY([-10, 0])
      .onBegin(() => {
        if (timeoutNumber !== null) clearTimeout(timeoutNumber)
      })
      .onUpdate(event => {
        const value = event.translationY / 1.5 > 10 ? 10 + (event.translationY / 10) : event.translationY / 1.5
        if (value > 40) return
        translateValue.value = value
      })
      .onEnd(event => {
        if (event.translationY > -10) {
          startTimeout()
          translateValue.value = withSpring(0, {
            stiffness: 250,
            damping: 25
          })
          return
        }
        closeModal()
      })

  const blockStyle = useAnimatedStyle(() => {
    const interpolateTransform = interpolate(
      value.value,
      [0, 1],
      [-250, insets.top]
    )
    const interpolateOpacity = interpolate(
      value.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    )
    return {
      opacity: interpolateOpacity,
      transform: [
        {
          translateY: interpolateTransform + translateValue.value
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
          {isOpen && (
            <GestureDetector
              gesture={gesture}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onPress}
              >
                <Animated.View
                  key={id}
                  style={blockStyle}
                >
                  {notificationChildren}
                </Animated.View>
              </TouchableOpacity>
            </GestureDetector>
          )}
        </Portal>
        {children}
      </Host>
    </Context.Provider>
  )
}

export default Provider
