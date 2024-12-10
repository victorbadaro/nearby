import { Categories, type CategoriesProps } from '@/components/categories';
import { api } from '@/services/api';
import { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';

export default function Home() {
	const [categories, setCategories] = useState<CategoriesProps>([]);
	const [category, setCategory] = useState('');

	async function fetchCategories() {
		try {
			const { data } = await api.get<CategoriesProps>('/categories');

			setCategories(data);
			setCategory(data[0].id);
		} catch (error) {
			console.log(error);
			Alert.alert('Categorias', 'Não foi possível carregar as categorias.');
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: fetchCategories function is not necessary as a dependency
	useEffect(() => {
		fetchCategories();
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<Categories data={categories} onSelect={setCategory} selected={category} />
		</View>
	);
}
