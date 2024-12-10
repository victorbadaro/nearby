import type { IconProps as TablerIconProps } from '@tabler/icons-react-native';
import type { ComponentType } from 'react';
import { ActivityIndicator, Text, type TextProps, TouchableOpacity, type TouchableOpacityProps } from 'react-native';

import { colors } from '@/styles/theme';
import { s } from './styles';

type ButtonProps = TouchableOpacityProps & {
	isLoading?: boolean;
};

function Button({ children, style, isLoading = false, ...rest }: ButtonProps) {
	return (
		<TouchableOpacity style={[s.container, style]} activeOpacity={0.8} disabled={isLoading} {...rest}>
			{isLoading ? <ActivityIndicator size="small" color={colors.gray[100]} /> : children}
		</TouchableOpacity>
	);
}

function Title({ children }: TextProps) {
	return <Text style={s.title}>{children}</Text>;
}

type IconProps = {
	icon: ComponentType<TablerIconProps>;
};

function Icon({ icon: Icon }: IconProps) {
	return <Icon size={24} color={colors.gray[100]} />;
}

Button.Title = Title;
Button.Icon = Icon;

export { Button };
