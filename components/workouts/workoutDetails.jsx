import React, { useEffect, useState } from 'react'
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

import { db } from '../../db'
import styles from './styles'

const WorkoutDetailsScreen = ({ route }) => {
  const { workoutId } = route.params

  const [isLoading, setIsLoading] = useState(false)
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isOptionsMenuVisible, setIsOptionsMenuVisible] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState()
  const [exercises, setExercises] = useState()
  const [exerciseName, setExerciseName] = useState('')
  const [exerciseSets, setExerciseSets] = useState(0)
  const [exerciseReps, setExerciseReps] = useState(0)
  const [exerciseWeight, setExerciseWeight] = useState(0)
  const [exerciseUnit, setExerciseUnit] = useState('')
  const [exerciseDesc, setExerciseDesc] = useState('')

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

  const handleAddExercise = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO exercise_catalog (workout_id, name, sets, reps, weight, unit, description) VALUES (?, ?, ?, ?, ?, ?, ?);',
        [
          workoutId,
          exerciseName,
          exerciseSets,
          exerciseReps,
          exerciseWeight,
          exerciseUnit,
          exerciseDesc,
        ],
        (_, result) => {
          const newExercise = {
            id: result.insertId,
            workout_id: workoutId,
            name: exerciseName,
            sets: exerciseSets,
            reps: exerciseReps,
            weight: exerciseWeight,
            unit: exerciseUnit,
            description: exerciseDesc,
          }
          setExercises((previousState) => [...previousState, newExercise])
        },
        (_, error) => console.error(error),
      )
    })
  }

  const handleDeleteExercise = ({ id }) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM exercise_catalog WHERE id = ?;',
        [id],
        (_, result) => {
          setExercises((previousState) =>
            previousState.filter((res) => res.id !== id),
          )
        },
        (_, error) => console.error(error),
      )
    })
  }

  const handleEditExercise = ({ id }) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE exercise_catalog SET name = ?, sets = ?, reps = ?, weight = ?, unit = ?, description = ? WHERE id = ?;',
        [
          exerciseName,
          exerciseSets,
          exerciseReps,
          exerciseWeight,
          exerciseUnit,
          exerciseDesc,
          id,
        ],
        (_, result) => {
          setExercises((previousState) =>
            previousState.map((exercise) =>
              exercise.id === id
                ? {
                    ...exercise,
                    name: exerciseName,
                    sets: exerciseSets,
                    reps: exerciseReps,
                    weight: exerciseWeight,
                    unit: exerciseUnit,
                    description: exerciseDesc,
                  }
                : exercise,
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
            <Text style={styles.modalTitle}>Exercício</Text>
            <TextInput
              style={styles.input}
              placeholder='Nome'
              value={exerciseName}
              onChangeText={setExerciseName}
            />
            <TextInput
              style={styles.input}
              placeholder='Séries'
              keyboardType='numeric'
              value={exerciseSets}
              onChangeText={setExerciseSets}
            />
            <TextInput
              style={styles.input}
              placeholder='Repetições'
              keyboardType='numeric'
              value={exerciseReps}
              onChangeText={setExerciseReps}
            />
            <TextInput
              style={styles.input}
              placeholder='Peso'
              keyboardType='numeric'
              value={exerciseWeight}
              onChangeText={setExerciseWeight}
            />
            <TextInput
              style={styles.input}
              placeholder='Unidade'
              value={exerciseUnit}
              onChangeText={setExerciseUnit}
            />
            <TextInput
              style={styles.input}
              placeholder='Descrição'
              value={exerciseDesc}
              onChangeText={setExerciseDesc}
            />
            <View style={styles.buttonContainer}>
              <Button
                title='Cancelar'
                onPress={() => {
                  setIsAddModalVisible(false)
                  setExerciseName('')
                  setExerciseSets(0)
                  setExerciseReps(0)
                  setExerciseWeight(0)
                  setExerciseUnit('')
                  setExerciseDesc('')
                }}
              />
              <Button
                title='Criar'
                onPress={() => {
                  handleAddExercise()
                  setIsAddModalVisible(false)
                  setExerciseName('')
                  setExerciseSets(0)
                  setExerciseReps(0)
                  setExerciseWeight(0)
                  setExerciseUnit('')
                  setExerciseDesc('')
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
            <Text style={styles.modalTitle}>Exercício</Text>
            <TextInput
              style={styles.input}
              placeholder='Nome'
              value={exerciseName}
              onChangeText={setExerciseName}
            />
            <TextInput
              style={styles.input}
              placeholder='Séries'
              keyboardType='numeric'
              value={exerciseSets}
              onChangeText={setExerciseSets}
            />
            <TextInput
              style={styles.input}
              placeholder='Repetições'
              keyboardType='numeric'
              value={exerciseReps}
              onChangeText={setExerciseReps}
            />
            <TextInput
              style={styles.input}
              placeholder='Peso'
              keyboardType='numeric'
              value={exerciseWeight}
              onChangeText={setExerciseWeight}
            />
            <TextInput
              style={styles.input}
              placeholder='Unidade'
              value={exerciseUnit}
              onChangeText={setExerciseUnit}
            />
            <TextInput
              style={styles.input}
              placeholder='Descrição'
              value={exerciseDesc}
              onChangeText={setExerciseDesc}
            />
            <View style={styles.buttonContainer}>
              <Button
                title='Cancelar'
                onPress={() => {
                  setIsEditModalVisible(false)
                  setSelectedExercise(undefined)
                  setExerciseName('')
                  setExerciseSets(0)
                  setExerciseReps(0)
                  setExerciseWeight(0)
                  setExerciseUnit('')
                  setExerciseDesc('')
                }}
              />
              <Button
                title='Confirmar'
                onPress={() => {
                  handleEditExercise({ id: selectedExercise.id })
                  setIsEditModalVisible(false)
                  setSelectedExercise(undefined)
                  setExerciseName('')
                  setExerciseSets(0)
                  setExerciseReps(0)
                  setExerciseWeight(0)
                  setExerciseUnit('')
                  setExerciseDesc('')
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
        onRequestClose={() => {
          setIsOptionsMenuVisible(false)
          setSelectedExercise(undefined)
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menuContent}>
            <Button
              title='Editar'
              onPress={() => {
                setExerciseName(selectedExercise.name)
                setExerciseSets(selectedExercise.sets.toString())
                setExerciseReps(selectedExercise.reps.toString())
                setExerciseWeight(selectedExercise.weight.toString())
                setExerciseUnit(selectedExercise.unit)
                setExerciseDesc(selectedExercise.description)
                setIsOptionsMenuVisible(false)
                setIsEditModalVisible(true)
              }}
            />
            <Button
              title='Deletar'
              onPress={() => {
                handleDeleteExercise({ id: selectedExercise.id })
                setIsOptionsMenuVisible(false)
                setSelectedExercise(undefined)
              }}
            />
            <Button
              title='Fechar'
              onPress={() => {
                setIsOptionsMenuVisible(false)
                setSelectedExercise(undefined)
              }}
            />
          </View>
        </View>
      </Modal>
      {exercises?.length === 0 ? (
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
            data={exercises}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onLongPress={() => {
                  setSelectedExercise(item)
                  setIsOptionsMenuVisible(true)
                }}
              >
                <View style={styles.workoutItem}>
                  <Text style={styles.modalTitle}>{item.name}</Text>
                  <Text>Sets: {item.sets}</Text>
                  <Text>Repetições: {item.reps}</Text>
                  <Text>Peso: {item.weight}</Text>
                  <Text>Unidade: {item.unit}</Text>
                  <Text>Descrição: {item.description}</Text>
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

export default WorkoutDetailsScreen
