import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native'

import { db } from '../../db'
import styles from './styles'

const HomeScreen = ({ navigation }) => {
  const isFocused = useIsFocused()

  const [workouts, setWorkouts] = useState()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isFocused) {
      const currentDay = new Date().getDay() + 1
      setIsLoading(true)
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM workout_catalog WHERE weekday = ?;',
          [currentDay],
          (_, { rows: { _array } }) => {
            setWorkouts(_array)
            setIsLoading(false)
          },
          (_, error) => console.error(error),
        )
      })
    }
  }, [isFocused])

  const handleStartWorkout = ({ id }) => {
    navigation.navigate('HomeStack', {
      screen: 'StartedWorkoutScreen',
      params: {
        workoutId: id,
      },
    })
  }

  if (isLoading) {
    return (
      <View
        style={{
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <View>
      {workouts?.length === 0 ? (
        <View
          style={{
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 18 }}>
            Nenhum treino configurado para hoje!
          </Text>
        </View>
      ) : (
        <View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, marginTop: 20 }}>
              O que você quer treinar hoje?
            </Text>
          </View>
          <FlatList
            style={{ padding: 10 }}
            data={workouts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleStartWorkout({ id: item.id })}
              >
                <View style={styles.workoutItem}>
                  <Text style={styles.modalTitle}>{item.name}</Text>
                  <Text>Clique para iniciar</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  )
}

export default HomeScreen
