import { StyleSheet } from 'react-native';
import { themes } from '../../global/themes';

export const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: themes.colors.menuBar,
    borderRadius: 16,
    padding: 20,
    width: '85%',
    maxHeight: '70%',
    shadowColor: themes.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: themes.colors.menuBar,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: themes.colors.black,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: '300',
  },
  listContent: {
    paddingBottom: 8,
  },
  item: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: themes.colors.background_input,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  itemSelected: {
    backgroundColor: themes.colors.secondary
  },
  itemText: {
    fontSize: 16,
    color: themes.colors.black,
  },
  itemTextSelected: {
    color: themes.colors.white,
    fontWeight: 'bold',
  },
  button:{
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageActiveInative:{
    width: 50,
    height: 50
  }
});