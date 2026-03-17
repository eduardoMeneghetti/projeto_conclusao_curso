import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image
}
  from 'react-native';
import Modal from 'react-native-modal';
import { styles } from './styles';
import { Button } from '../Button';

type SelectionItem = {
  id: string;
  title: string;
  inactive?: boolean;
};

type SelectionModalProps = {
  isVisible: boolean;
  onClose: () => void;
  data: SelectionItem[];
  selectedId: string | null;
  onSelect: (item: SelectionItem) => void;
  title: string;
  onAdd?: () => void;
  showInactiveToggle?: boolean;
  onToggleInactive?: (show: boolean) => void;
  onEdit?: (item: SelectionItem) => void;
};

export default function SelectionModal({
  isVisible,
  onClose,
  data,
  selectedId,
  onSelect,
  title,
  onAdd,
  showInactiveToggle,
  onToggleInactive,
  onEdit,
}: SelectionModalProps) {

  const [showInactive, setShowInactive] = useState(false);

  const renderItem = ({ item }: { item: SelectionItem }) => {
    const isSelected = item.id === selectedId;
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.inactive) return;
          onSelect(item);
          onClose();
        }}
        style={[
          styles.item,
          isSelected && styles.itemSelected,
          item.inactive && styles.itemInactive
        ]}
      >

        <Text style={[
          styles.itemText, 
          isSelected && styles.itemTextSelected,
          item.inactive && styles.itemTextInactive, 
          { flex: 1 }]}>
          {item.title}
        </Text>

        {onEdit && (
          <TouchableOpacity
            onPress={() => onEdit(item)}
            style={styles.itemEdit}
          >
            <Image
              source={isSelected ? require('../../assets/icon/edit_item_select.png') : require('../../assets/icon/edit_item.png')}
              style={styles.imageEdit}
            />
          </TouchableOpacity>
        )}

      </TouchableOpacity>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
      propagateSwipe
    >
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text>mostrar inativos</Text>
          {showInactiveToggle && (
            <TouchableOpacity
              onPress={() => {
                const newValue = !showInactive;
                setShowInactive(newValue);
                onToggleInactive?.(newValue);
              }}
            >
              <Image style={styles.imageActiveInative}
                source={showInactive ? require('../../assets/icon/active.png') : require('../../assets/icon/inative.png')}
              />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />

        {onAdd && (
          <View style={styles.button}>
            <Button title='+' onPress={onAdd} />
          </View>
        )}
      </View>
    </Modal>
  );
}