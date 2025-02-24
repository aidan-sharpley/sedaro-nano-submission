import { Form } from '@radix-ui/react-form';
import { Button, Card, Flex, TextField } from '@radix-ui/themes';
import BaseCard from 'components/BaseCard';
import _ from 'lodash';
import React, { useCallback, useState } from 'react';
import {
	FormValue,
	SimulationViewEnum,
	defaultBatch,
	defaultBody1,
	defaultBody2,
} from 'types';
import ViewDropdown from './ViewDropdown';

type SimulateFormProps = {
	style?: object;
	setSimulationCount: React.Dispatch<React.SetStateAction<number>>;
	simulationCount?: number;
	simulationView?: SimulationViewEnum;
	setSimulationView: React.Dispatch<React.SetStateAction<SimulationViewEnum>>;
};

const SimulateForm = ({
	style,
	setSimulationCount,
	simulationCount,
	simulationView,
	setSimulationView,
}: SimulateFormProps) => {
	const [formData, setFormData] = useState<FormData>({
		Body1: defaultBody1,
		Body2: defaultBody2,
		Batch: defaultBatch,
	});

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			try {
				const response = await fetch('http://localhost:8000/simulation', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(formData),
				});
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
			} catch (error) {
				console.error('Error:', error);
			}
		},
		[formData]
	);

	return (
		<Flex>
			{/* Card: https://www.radix-ui.com/themes/docs/components/card */}
			<Card
				size={'4'}
				style={{
					opacity: '99%',
					backgroundColor: 'transparent',

					overflowY: 'auto',
					...style,
				}}
			>
				<Form onSubmit={handleSubmit}>
					<Flex direction={'column'}>
						<Flex justify="center" mt={'-3'}>
							<BaseCard
								title="Body1"
								formData={formData}
								setFormData={setFormData}
							/>
						</Flex>
						<Flex justify="center" mt="5">
							<BaseCard
								title="Body2"
								formData={formData}
								setFormData={setFormData}
							/>
						</Flex>
						<Flex justify="center" mt="5" mb="1">
							<BaseCard
								title="Batch"
								formData={formData}
								setFormData={setFormData}
								required={false}
							/>
						</Flex>
						<Flex direction={'row'} gap={'2'} mt="5" justify={'center'}>
							<ViewDropdown
								simulationView={simulationView}
								setSimulationView={setSimulationView}
							/>

							<Button type="submit">
								Simulation Loops:
								<TextField.Root
									type="number"
									id={'batch.count'}
									name={'batch.count'}
									value={simulationCount}
									style={{ width: 25 }}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
										const { value } = e.target;
										let newValue: FormValue =
											value === '' ? '' : parseFloat(value);
										setSimulationCount(newValue);
									}}
									step={1}
								/>
							</Button>
						</Flex>
					</Flex>
				</Form>
			</Card>
		</Flex>
	);
};

export default SimulateForm;
