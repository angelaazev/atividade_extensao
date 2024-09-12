import React, { useState, useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from '@expo/vector-icons/Ionicons'
import { View, ActivityIndicator } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'

import HomeStack from './components/home'
import WorkoutCatalogStack from './components/workouts'
import { initializeDatabase } from './db'

// import { resetDatabase } from './db'
// resetDatabase()

const Tab = createBottomTabNavigator()

const App = () => {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const prepare = async () => {
      try {
        await initializeDatabase()
      } catch (e) {
        console.warn('Failed to initialize database:', e)
      } finally {
        setIsReady(true)
      }
    }

    prepare()
  }, [])

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name='HomeStack'
          component={HomeStack}
          options={{
            title: 'Início',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                size={28}
                style={{ marginBottom: -3 }}
                name={focused ? 'home' : 'home-outline'}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name='WorkoutCatalogStack'
          component={WorkoutCatalogStack}
          options={() => ({
            title: 'Treinos',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                size={28}
                style={{ marginBottom: -3 }}
                name={focused ? 'barbell' : 'barbell-outline'}
                color={color}
              />
            ),
          })}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default App
