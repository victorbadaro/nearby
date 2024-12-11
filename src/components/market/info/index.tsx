import type { IconProps } from '@tabler/icons-react-native';
import type { ComponentType } from 'react';
import { Text, View } from 'react-native';

import { colors } from '@/styles/theme';
import { s } from './styles';

type Props = {
	description: string;
	icon: ComponentType<IconProps>;
};

export function Info({ description, icon: Icon }: Props) {
	return (
		<View style={s.container}>
			<Icon size={16} color={colors.gray[400]} />
			<Text style={s.text}>{description}</Text>
		</View>
	);
}
