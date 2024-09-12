import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import HomeScreen from './screen'
import StartedWorkoutScreen from './startedWorkout'

const Stack = createStackNavigator()

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='HomeScreen'
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='StartedWorkoutScreen'
        component={StartedWorkoutScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default HomeStack
