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
}: SelectionModalProps) {

  const [showInactive, setShowInactive] = useState(false);

  const renderItem = ({ item }: { item: SelectionItem }) => {
    const isSelected = item.id === selectedId;
    return (
      <TouchableOpacity
        onPress={() => {
          onSelect(item);
          onClose();
        }}
        style={[styles.item, isSelected && styles.itemSelected]}
      >
        <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
          {item.title}
        </Text>
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
            <Button title='+' onPress={onAdd}/>
          </View>
        )}
      </View>
    </Modal>
  );
}