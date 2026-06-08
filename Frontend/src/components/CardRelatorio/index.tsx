import react from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';
import { styles } from './styles';

type Props = {
    title: string;
    imageSource: any;
    onPress?: () => void;   
}

export function CardRelatorio(props: Props) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.card} onPress={props.onPress}>
                    <Image style={styles.image}
                        source={props.imageSource}
                    />
                   <Text style={styles.title}>{props.title}</Text>
            </TouchableOpacity>
        </View>
    );
}