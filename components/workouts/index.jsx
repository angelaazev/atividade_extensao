import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import WorkoutCatalogScreen from './workoutCatalog'
import WorkoutDetailsScreen from './workoutDetails'

const Stack = createStackNavigator()

const WorkoutCatalogStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='WorkoutCatalogScreen'
        component={WorkoutCatalogScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='WorkoutDetailsScreen'
        component={WorkoutDetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default WorkoutCatalogStack
