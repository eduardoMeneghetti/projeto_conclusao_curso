import React from 'react';
import {
  Text,
  TouchableHighlightProps,
  TouchableOpacity,
} from 'react-native';

import { styles } from './styles';

type Props = TouchableHighlightProps & {
  title: string;
};

export function Button({...rest}: Props) {
  return (
    <TouchableOpacity 
        style={styles.button}
        {...rest}
        activeOpacity={0.6}
    >
        <Text style={styles.buttonText}>{rest.title}</Text>
    </TouchableOpacity>
  );
}

