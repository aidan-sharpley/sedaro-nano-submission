import { Form } from '@radix-ui/react-form';
import { Button, Card, Flex, Separator } from '@radix-ui/themes';
import BaseCard from 'components/BaseCard';
import _ from 'lodash';
import React, { useCallback, useState } from 'react';
import { defaultBody1, defaultBody2 } from 'types';

type SimulateFormProps = {
	style?: object;
	width?: string;
};

const SimulateForm = ({ style, width }: SimulateFormProps) => {
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
			} catch (error) {
				console.error('Error:', error);
			}
		},
		[formData]
	);

	return (
		<Flex>
			{/* Card: https://www.radix-ui.com/themes/docs/components/card */}
			<Card style={{ background: 'black', ...style }}>
				<Form onSubmit={handleSubmit}>
					<Flex my={'2'} direction={'column'}>
						<BaseCard
							title="Body1"
							formData={formData}
							setFormData={setFormData}
						/>
						<Separator size="4" my="3" />
						<BaseCard
							title="Body2"
							formData={formData}
							setFormData={setFormData}
						/>
						<Separator size="4" my="3" />
						<BaseCard
							title="Batch"
							formData={formData}
							setFormData={setFormData}
							required={false}
						/>
						<Separator size="4" my="3" />
						<Flex justify="center">
							<Button type="submit">Submit</Button>
						</Flex>
					</Flex>
				</Form>
			</Card>
		</Flex>
	);
};

export default SimulateForm;
