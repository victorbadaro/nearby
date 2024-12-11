import { Categories, type CategoriesProps } from '@/components/categories';
import type { PlaceProps } from '@/components/place';
import { Places } from '@/components/places';
import { api } from '@/services/api';
import { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';

type MarketsProps = PlaceProps;

export default function Home() {
	const [categories, setCategories] = useState<CategoriesProps>([]);
	const [category, setCategory] = useState('');
	const [markets, setMarkets] = useState<MarketsProps[]>([]);

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

	async function fetchMarkets() {
		try {
			if (!category) {
				return;
			}

			const { data } = await api.get(`/markets/category/${category}`);

			setMarkets(data);
		} catch (error) {
			console.log(error);
			Alert.alert('Locais', 'Não foi possível carregar os locais.');
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: fetchCategories function is not necessary as a dependency here
	useEffect(() => {
		fetchCategories();
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: fetchMarkets function is not necessary as a dependency here
	useEffect(() => {
		fetchMarkets();
	}, [category]);

	return (
		<View style={{ flex: 1, backgroundColor: '#CECECE' }}>
			<Categories data={categories} onSelect={setCategory} selected={category} />
			<Places data={markets} />
		</View>
	);
}
