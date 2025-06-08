import { View, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Entypo, FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';

export function BottomNav() {
  const theme = useColorScheme() || 'light';

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme === 'dark' ? '#E9B308' : '#FFA500' }
    ]}>
      <TouchableOpacity>
        <Entypo
          name="home"
          size={28}
          color={theme === 'dark' ? '#525252' : '#FFFFFF'}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <FontAwesome6
          name="dumbbell"
          size={24}
          color={theme === 'dark' ? '#525252' : '#FFFFFF'}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <FontAwesome6
          name="ranking-star"
          size={28}
          color={theme === 'dark' ? '#525252' : '#FFFFFF'}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <FontAwesome5
          name="trophy"
          size={24}
          color={theme === 'dark' ? '#525252' : '#FFFFFF'}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons
          name="person"
          size={28}
          color={theme === 'dark' ? '#525252' : '#FFFFFF'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
