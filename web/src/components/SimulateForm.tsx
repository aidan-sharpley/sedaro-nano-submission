import { Form } from '@radix-ui/react-form';
import { Button, Card, Flex, TextField } from '@radix-ui/themes';
import BaseCard from 'components/BaseCard';
import _ from 'lodash';
import React, { useState } from 'react';
import {
	FormValue,
	SimulationViewEnum,
	defaultBatch,
	defaultBody1,
	defaultBody2,
} from 'types';
import ViewDropdown from './ViewDropdown';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

type SimulateFormProps = {
	style?: object;
	setSimulationCount: React.Dispatch<React.SetStateAction<number>>;
	simulationCount?: number;
	simulationView?: SimulationViewEnum;
	setSimulationView: React.Dispatch<React.SetStateAction<SimulationViewEnum>>;
	refreshData: (
		options?: RefetchOptions
	) => Promise<QueryObserverResult<any, Error>>;
};

const SimulateForm = ({
	style,
	setSimulationCount,
	simulationCount = 1,
	simulationView,
	setSimulationView,
	refreshData,
}: SimulateFormProps) => {
	const [formData, setFormData] = useState<FormData>({
		Body1: defaultBody1,
		Body2: defaultBody2,
		Batch: defaultBatch,
	});

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setIsLoading(true);
			const response = await fetch(
				`http://localhost:8000/simulation?limit=${simulationCount}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(formData),
				}
			);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			// This is a hacky workaround due to time constraints,
			// ideally we would get our updated data from the post.
			// Alternatively, we could probably use rpc or server sent events.
			refreshData();
			setIsLoading(false);
		} catch (error) {
			console.error('Error:', error);
			setIsLoading(false);
		}
	};

	return (
		<Flex>
			{/* Card: https://www.radix-ui.com/themes/docs/components/card */}
			<Card
				size={'4'}
				style={{
					opacity: '99%',
					backgroundColor: 'transparent',
					overflowY: 'auto',
					minWidth: '330px',
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
								enabled={simulationCount > 1}
							/>
						</Flex>
						<Flex direction={'row'} gap={'2'} mt="5" justify={'center'}>
							<ViewDropdown
								simulationView={simulationView}
								setSimulationView={setSimulationView}
							/>
							<Button loading={isLoading} type="submit">
								Run Simulation
							</Button>
							x
							<TextField.Root
								type="number"
								id={'batch.count'}
								name={'batch.count'}
								value={simulationCount}
								style={{ width: 95, textAlign: 'left' }}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									const { value } = e.target;
									let newValue: FormValue =
										value === '' ? '' : parseFloat(value);
									setSimulationCount(newValue);
								}}
								step={1}
							/>
						</Flex>
					</Flex>
				</Form>
			</Card>
		</Flex>
	);
};

export default SimulateForm;
