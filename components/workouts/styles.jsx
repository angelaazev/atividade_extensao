import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  workoutItem: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 15,
    padding: 10,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  menuContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
})

export default styles
