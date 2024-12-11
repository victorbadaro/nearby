import { Button } from '@/components/button';
import { Loading } from '@/components/loading';
import { Coupon } from '@/components/market/coupon';
import { Cover } from '@/components/market/cover';
import { Details, type DetailsProps } from '@/components/market/details';
import { api } from '@/services/api';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Modal, ScrollView, StatusBar, View } from 'react-native';

type DataProps = DetailsProps & {
	cover: string;
};

export default function Market() {
	const [_, requestPermission] = useCameraPermissions();
	const params = useLocalSearchParams<{ id: string }>();
	const qrLock = useRef(false);
	const [data, setData] = useState<DataProps>();
	const [isLoading, setIsLoading] = useState(true);
	const [coupon, setCoupon] = useState<string | null>(null);
	const [isVisibleCameraModal, setIsVisibleCameraModal] = useState(false);
	const [couponIsFetching, setCouponIsFetching] = useState(false);

	async function fetchMarket() {
		try {
			const { data } = await api.get(`/markets/${params.id}`);

			setData(data);
			setIsLoading(false);
		} catch (error) {
			console.log(error);
			Alert.alert('Erro', 'Não foi possível carregar os dados', [
				{
					text: 'OK',
					onPress: () => router.back()
				}
			]);
		}
	}

	async function handleOpenCamera() {
		try {
			const { granted } = await requestPermission();

			if (!granted) {
				return Alert.alert('Câmera', 'Você precisa habilitar o uso da câmera');
			}

			qrLock.current = false;
			setIsVisibleCameraModal(true);
		} catch (error) {
			console.log(error);
			Alert.alert('Câmera', 'Não foi possível utilizar a câmera');
		}
	}

	async function getCoupon(id: string) {
		try {
			setCouponIsFetching(true);

			const { data } = await api.patch(`/coupons/${id}`);

			Alert.alert('Cupom', data.coupon);
			setCoupon(data.coupon);
		} catch (error) {
			console.log(error);
			Alert.alert('Erro', 'Não foi possível utilizar o cupom');
		} finally {
			setCouponIsFetching(false);
		}
	}

	function handleUseCoupon(id: string) {
		setIsVisibleCameraModal(false);
		Alert.alert('Cupom', 'Não é possível reutilizar um cupom resgatado. Deseja realmente resgatar o cupom?', [
			{ style: 'cancel', text: 'Não' },
			{ text: 'Sim', onPress: () => getCoupon(id) }
		]);
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: fetchMarket function is not necessary as a dependency here
	useEffect(() => {
		fetchMarket();
	}, [params.id, coupon]);

	if (isLoading) {
		return <Loading />;
	}

	if (!data) {
		return <Redirect href="/home" />;
	}

	return (
		<View style={{ flex: 1 }}>
			<StatusBar barStyle="light-content" hidden={isVisibleCameraModal} />

			<ScrollView showsVerticalScrollIndicator={false}>
				<Cover uri={data.cover} />
				<Details data={data} />

				{coupon ? <Coupon code={coupon} /> : null}
			</ScrollView>

			<View style={{ padding: 32 }}>
				<Button onPress={handleOpenCamera}>
					<Button.Title>Ler QR Code</Button.Title>
				</Button>
			</View>

			<Modal style={{ flex: 1 }} visible={isVisibleCameraModal}>
				<CameraView
					style={{ flex: 1 }}
					onBarcodeScanned={({ data }) => {
						if (data && !qrLock.current) {
							qrLock.current = true;
							setTimeout(() => handleUseCoupon(data), 500);
						}
					}}
				/>

				<View style={{ position: 'absolute', bottom: 32, left: 32, right: 32 }}>
					<Button onPress={() => setIsVisibleCameraModal(false)} isLoading={couponIsFetching}>
						<Button.Title>Voltar</Button.Title>
					</Button>
				</View>
			</Modal>
		</View>
	);
}
