import { Form } from '@radix-ui/react-form';
import {
	Button,
	Card,
	DropdownMenu,
	Flex,
	Separator,
	TextField,
	Portal,
	ThickDividerHorizontalIcon,
} from '@radix-ui/themes';
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
import {
	HamburgerMenuIcon,
	DotFilledIcon,
	CheckIcon,
	ChevronRightIcon,
} from '@radix-ui/react-icons';
import Input from './Input';

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
			<Card size={'4'} style={{ overflowY: 'auto', ...style }}>
				<Form onSubmit={handleSubmit}>
					<Flex direction={'column'}>
						<Flex align={'center'} gap={'2'} justify="left" mt={'-3'}>
							{'Configuration'}
							<DropdownMenu.Root>
								<DropdownMenu.Trigger asChild>
									<button className="IconButton" aria-label="Customise options">
										{simulationView}
									</button>
								</DropdownMenu.Trigger>
								<DropdownMenu.Content
									className="DropdownMenuContent"
									sideOffset={5}
								>
									<DropdownMenu.Item
										onSelect={() => setSimulationView('Both')}
										className="DropdownMenuItem"
									>
										{'Both' as SimulationViewEnum}
									</DropdownMenu.Item>
									<DropdownMenu.Item
										onSelect={() => setSimulationView('Position')}
										className="DropdownMenuItem"
									>
										{'Position' as SimulationViewEnum}
									</DropdownMenu.Item>
									<DropdownMenu.Item
										onSelect={() => setSimulationView('Velocity')}
										className="DropdownMenuItem"
									>
										{'Velocity' as SimulationViewEnum}
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Flex>
						<Flex justify="center" mt={'2'}>
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
						<Flex direction={'row'} gap={'4'} mt="5">
							<Button type="submit">Run Simulation</Button>
							{'   X   '}
							<TextField.Root
								type="number"
								id={'batch.count'}
								name={'batch.count'}
								value={simulationCount}
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
