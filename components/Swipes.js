import React, { useState } from 'react';
import { View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import SwipeableImage from './SwipeableImage';

function Swipes({ users, currentIndex, handleLike, handlePass, swipesRef }) {
  const [willLike, setWillLike] = useState(false);
  const [willPass, setWillPass] = useState(false);

  const nextPlan = users[currentIndex + 1];

  const renderLeftActions = () => {
    if (!nextPlan) return <View style={styles.empty}/>;
    return (
      <RectButton style={styles.container}>
        <SwipeableImage plan={nextPlan} />
      </RectButton>
    );
  };

  const renderRightActions = () => {
    if (!nextPlan) return <View style={styles.empty}/>;
    return (
      <RectButton style={styles.container}>
        <SwipeableImage plan={nextPlan} />
      </RectButton>
    );
  };

  return (
    <Swipeable
      ref={swipesRef}
      friction={2}
      leftThreshold={40}
      rightThreshold={40}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onSwipeableLeftOpen={() => { setWillLike(false); handleLike(); }}
      onSwipeableRightOpen={() => { setWillPass(false); handlePass(); }}
      onSwipeableLeftWillOpen={() => setWillLike(true)}
      onSwipeableRightWillOpen={() => setWillPass(true)}
    >
      <SwipeableImage plan={users[currentIndex]} willLike={willLike} willPass={willPass} />
    </Swipeable>
  );
}

const styles = {
  container: { flex: 1 },
  empty:     { width: 0, height: 0 }
};

export default React.forwardRef((props, ref) => <Swipes swipesRef={ref} {...props} />);
