import React, { useState, forwardRef } from 'react'
import { View, StyleSheet } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { RectButton } from 'react-native-gesture-handler'
import SwipeableImage from './SwipeableImage'

function InnerSwipes({ users, currentIndex, handleLike, handlePass, swipesRef }) {
  const [willLike, setWillLike] = useState(false)
  const [willPass, setWillPass] = useState(false)

  const nextPlan = users[currentIndex + 1]

  const renderLeftActions = () => {
    if (!nextPlan) {
      return <View style={styles.emptyPlaceholder} />
    }
    return (
      <RectButton style={styles.actionContainer}>
        <SwipeableImage plan={nextPlan} />
      </RectButton>
    )
  }

  const renderRightActions = () => {
    if (!nextPlan) {
      return <View style={styles.emptyPlaceholder} />
    }
    return (
      <RectButton style={styles.actionContainer}>
        <SwipeableImage plan={nextPlan} />
      </RectButton>
    )
  }

  return (
    <Swipeable
      ref={swipesRef}
      friction={2}
      leftThreshold={40}
      rightThreshold={40}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onSwipeableLeftWillOpen={() => setWillLike(true)}
      onSwipeableRightWillOpen={() => setWillPass(true)}
      onSwipeableLeftOpen={() => {
        setWillLike(false)
        handleLike()
      }}
      onSwipeableRightOpen={() => {
        setWillPass(false)
        handlePass()
      }}
    >
      <SwipeableImage
        plan={users[currentIndex]}
        willLike={willLike}
        willPass={willPass}
      />
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  actionContainer: {
    flex: 1
  },
  emptyPlaceholder: {
    flex: 1
  }
})

export default forwardRef((props, ref) => <InnerSwipes {...props} swipesRef={ref} />)
