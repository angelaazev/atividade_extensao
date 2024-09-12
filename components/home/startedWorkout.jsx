import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, FlatList } from 'react-native'

import { db } from '../../db'
import styles from './styles'

const StartedWorkoutScreen = ({ route }) => {
  const { workoutId } = route.params
  const [isLoading, setIsLoading] = useState(false)
  const [exercises, setExercises] = useState()

  useEffect(() => {
    setIsLoading(true)
    db.transaction((tx) => {
      tx.executeSql(
        `
        SELECT * FROM exercise_catalog WHERE workout_id = ?;
        `,
        [workoutId],
        (_, { rows: { _array } }) => {
          setExercises(_array)
          setIsLoading(false)
        },
        (_, error) => console.error(error),
      )
    })
  }, [workoutId])

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
      {exercises?.length === 0 ? (
        <View
          style={{
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>Esse treino não possui nenhum treino cadastrado!</Text>
        </View>
      ) : (
        <FlatList
          style={{ padding: 10 }}
          data={exercises}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.workoutItem}>
              <Text style={styles.modalTitle}>{item.name}</Text>
              <Text>Sets: {item.sets}</Text>
              <Text>Repetições: {item.reps}</Text>
              <Text>Peso: {item.weight}</Text>
              <Text>Unidade: {item.unit}</Text>
              <Text>Descrição: {item.description}</Text>
            </View>
          )}
        />
      )}
    </View>
  )
}

export default StartedWorkoutScreen
