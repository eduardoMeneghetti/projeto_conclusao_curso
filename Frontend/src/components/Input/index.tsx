import React, { forwardRef, useState } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';

import { styles } from './styles';

type Props = TextInputProps & {
  isPassword?: boolean;
  iconOpen?: ImageSourcePropType;
  iconClosed?: ImageSourcePropType;
  onIconPress?: () => void;
};

export const Input = forwardRef<TextInput, Props>(
  ({ isPassword, iconClosed, iconOpen, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <View style={{ position: 'relative' }}>
        <TextInput
          key={showPassword ? 'text' : 'password'}
          ref={ref}
          style={[
            styles.input,
            isPassword && { paddingRight: 50 },
          ]}
          secureTextEntry={isPassword ? !showPassword : false}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            style={styles.icon}
            onPress={() => setShowPassword(prev => !prev)}
          >
            <Image
              source={showPassword ? iconOpen : iconClosed}
              style={styles.iconImage}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

