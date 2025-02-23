import { Form, FormField, FormLabel } from '@radix-ui/react-form';
import {
	Button,
	Card,
	Flex,
	Heading,
	Separator,
	TextField,
} from '@radix-ui/themes';
import BaseCard from 'components/BaseCard';
import _ from 'lodash';
import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Routes } from 'routes';
import { FormValue, defaultBody1, defaultBody2, Body } from 'types';

type SimRequest<FormData> = {
	Body1: Body;
	Body2: Body;

	// TODO: make actual batch
	Batch: Body;
};

const SimulateForm: React.FC = () => {
	const navigate = useNavigate();

	const [formData, setFormData] = useState<FormData>({
		Body1: defaultBody1,
		Body2: defaultBody2,
		Batch: {},
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
				navigate(Routes.SIMULATION);
			} catch (error) {
				console.error('Error:', error);
			}
		},
		[formData]
	);

	const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		let newValue: FormValue = value === '' ? '' : parseFloat(value);
		setFormData((prev) => _.set({ ...prev }, name, newValue));
	}, []);

	return (
		<div
			style={{
				position: 'absolute',
				top: '5%',
				left: 'calc(50% - 200px)',
				overflow: 'scroll',
			}}
		>
			{/* Card: https://www.radix-ui.com/themes/docs/components/card */}
			<Card
				style={{
					width: '400px',
				}}
			>
				<Heading as="h2" size="4" weight="bold" mb="4">
					Run a Simulation
				</Heading>
				<Link to={Routes.SIMULATION}>View previous simulation</Link>
				<Separator size="4" my="5" />
				<Form onSubmit={handleSubmit}>
					<BaseCard
						title="Body1"
						formData={formData}
						handleChange={handleChange}
					/>
					<Separator size="4" my="5" />
					<BaseCard
						title="Body2"
						formData={formData}
						setFormData={setFormData}
					/>
					<Separator size="4" my="5" />
					<BaseCard
						title="Batch"
						formData={formData}
						setFormData={setFormData}
						required={false}
					/>
					<Separator size="4" my="5" />
					<Flex justify="center" m="5">
						<Button type="submit">Submit</Button>
					</Flex>
				</Form>
			</Card>
		</div>
	);
};

export default SimulateForm;
