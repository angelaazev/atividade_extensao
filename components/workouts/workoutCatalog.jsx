import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'

import { db } from '../../db'
import styles from './styles'

const WorkoutCatalogScreen = ({ navigation }) => {
  const isFocused = useIsFocused()

  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isOptionsMenuVisible, setIsOptionsMenuVisible] = useState(false)
  const [selectedWorkout, setSelectedWorkout] = useState()
  const [workouts, setWorkouts] = useState()
  const [workoutName, setWorkoutName] = useState('')
  const [workoutDay, setWorkoutDay] = useState(1)

  const pickerDays = [
    { label: 'Domingo', value: 1 },
    { label: 'Segunda-feira', value: 2 },
    { label: 'Terça-feira', value: 3 },
    { label: 'Quarta-feira', value: 4 },
    { label: 'Quinta-feira', value: 5 },
    { label: 'Sexta-feira', value: 6 },
    { label: 'Sábado', value: 7 },
  ]

  useEffect(() => {
    if (isFocused) {
      setIsLoading(true)
      db.transaction((tx) => {
        tx.executeSql(
          `
          SELECT
            w.id,
            w.name,
            w.weekday,
            COUNT(e.id) AS exerciseCount
          FROM
            workout_catalog w
          LEFT JOIN
            exercise_catalog e
          ON
            w.id = e.workout_id
          GROUP BY
            w.id, w.name, w.weekday;
          `,
          [],
          (_, { rows: { _array } }) => {
            setWorkouts(_array)
            setIsLoading(false)
          },
          (_, error) => console.error(error),
        )
      })
    }
  }, [isFocused])

  const handleInspectWorkout = ({ id }) => {
    navigation.navigate('WorkoutCatalogStack', {
      screen: 'WorkoutDetailsScreen',
      params: {
        workoutId: id,
      },
    })
  }

  const handleAddWorkout = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO workout_catalog (name, weekday) VALUES (?, ?);',
        [workoutName, workoutDay],
        (_, result) => {
          const newWorkout = {
            id: result.insertId,
            name: workoutName,
            weekday: workoutDay,
            exerciseCount: 0,
          }
          setWorkouts((previousState) => [...previousState, newWorkout])
        },
        (_, error) => console.error(error),
      )
    })
  }

  const handleDeleteWorkout = ({ id }) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM workout_catalog WHERE id = ?;',
        [id],
        (_, result) => {
          setWorkouts((previousState) =>
            previousState.filter((res) => res.id !== id),
          )
        },
        (_, error) => console.error(error),
      )
    })
  }

  const handleEditWorkout = ({ id }) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE workout_catalog SET name = ?, weekday = ? WHERE id = ?;',
        [workoutName, workoutDay, id],
        (_, result) => {
          setWorkouts((previousState) =>
            previousState.map((workout) =>
              workout.id === id
                ? { ...workout, name: workoutName, weekday: workoutDay }
                : workout,
            ),
          )
        },
        (_, error) => console.error(error),
      )
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
      <Modal
        animationType='slide'
        transparent={true}
        visible={isAddModalVisible}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Treino</Text>
            <TextInput
              style={styles.input}
              placeholder='Nome'
              value={workoutName}
              onChangeText={setWorkoutName}
            />
            <Picker
              selectedValue={workoutDay}
              onValueChange={(item) => {
                setWorkoutDay(item)
              }}
            >
              {pickerDays.map((item, idx) => (
                <Picker.Item key={idx} label={item.label} value={item.value} />
              ))}
            </Picker>
            <View style={styles.buttonContainer}>
              <Button
                title='Cancelar'
                onPress={() => {
                  setIsAddModalVisible(false)
                  setWorkoutName('')
                  setWorkoutDay(1)
                }}
              />
              <Button
                title='Criar'
                onPress={() => {
                  handleAddWorkout()
                  setIsAddModalVisible(false)
                  setWorkoutName('')
                  setWorkoutDay(1)
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType='slide'
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Treino</Text>
            <TextInput
              style={styles.input}
              placeholder='Nome'
              value={workoutName}
              onChangeText={setWorkoutName}
            />
            <Picker
              selectedValue={workoutDay}
              onValueChange={(item) => {
                setWorkoutDay(item)
              }}
            >
              {pickerDays.map((item, idx) => (
                <Picker.Item key={idx} label={item.label} value={item.value} />
              ))}
            </Picker>
            <View style={styles.buttonContainer}>
              <Button
                title='Cancelar'
                onPress={() => {
                  setIsEditModalVisible(false)
                  setSelectedWorkout(undefined)
                  setWorkoutName('')
                  setWorkoutDay(1)
                }}
              />
              <Button
                title='Confirmar'
                onPress={() => {
                  handleEditWorkout({ id: selectedWorkout.id })
                  setIsEditModalVisible(false)
                  setSelectedWorkout(undefined)
                  setWorkoutName('')
                  setWorkoutDay(1)
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={isOptionsMenuVisible}
        transparent={true}
        animationType='fade'
        onRequestClose={() => setIsOptionsMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menuContent}>
            <Button
              title='Editar'
              onPress={() => {
                setWorkoutName(selectedWorkout.name)
                setWorkoutDay(selectedWorkout.weekday)
                setIsOptionsMenuVisible(false)
                setIsEditModalVisible(true)
              }}
            />
            <Button
              title='Deletar'
              onPress={() => {
                handleDeleteWorkout({ id: selectedWorkout.id })
                setIsOptionsMenuVisible(false)
                setSelectedWorkout(undefined)
              }}
            />
            <Button
              title='Fechar'
              onPress={() => {
                setIsOptionsMenuVisible(false)
                setSelectedWorkout(undefined)
              }}
            />
          </View>
        </View>
      </Modal>
      {workouts?.length === 0 ? (
        <View
          style={{
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            title='Adicionar'
            onPress={() => setIsAddModalVisible(true)}
          />
        </View>
      ) : (
        <View>
          <FlatList
            style={{ padding: 10 }}
            data={workouts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleInspectWorkout({ id: item.id })}
                onLongPress={() => {
                  setSelectedWorkout(item)
                  setIsOptionsMenuVisible(true)
                }}
              >
                <View style={styles.workoutItem}>
                  <Text style={styles.modalTitle}>{item.name}</Text>
                  <Text>
                    Dia da semana:{' '}
                    {pickerDays.find((day) => day.value == item.weekday).label}
                  </Text>
                  <Text>Número de exercícios: {item.exerciseCount}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
          <Button
            title='Adicionar'
            onPress={() => setIsAddModalVisible(true)}
          />
        </View>
      )}
    </View>
  )
}

export default WorkoutCatalogScreen
