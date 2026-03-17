import React from 'react';
import {
  Text,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import { styles } from './styles';

type Props = TouchableOpacityProps & {
  title?: string;
  image?: ImageSourcePropType;
  children?: React.ReactNode;
};

export function Button({ title, image, children, ...rest }: Props) {
  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.6}
      {...rest}
    >
      {image ? (
        <Image source={image} style={styles.buttonImage} />
      ) : children ? (
        <>{children}</>
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

