import { Flex, Heading, Table, Tooltip } from '@radix-ui/themes';
import _ from 'lodash';
import React from 'react';
import Input from './Input';

type BodyRowProps = {
	formData: FormData;
	setFormData: React.Dispatch<React.SetStateAction<FormData>>;
	title: string;
	required?: boolean;
	enabled?: boolean;
	fontSize?: number;
	rowKey: 'Position' | 'Velocity' | 'Mass';
};

function BodyRow({
	title,
	formData,
	setFormData,
	required = true,
	fontSize = 12,
	rowKey,
	enabled,
}: BodyRowProps) {
	const ifVelocityRowField = rowKey == 'Velocity' ? 'v' : '';

	return (
		<Table.Row align={'center'} key={`${rowKey}-key`}>
			<Table.RowHeaderCell style={{ fontSize: fontSize }}>
				{rowKey}
			</Table.RowHeaderCell>
			<Input
				field={ifVelocityRowField + 'x'}
				formData={formData}
				setFormData={setFormData}
				title={title}
				required={required}
				enabled={enabled}
			/>
			<Input
				field={ifVelocityRowField + 'y'}
				formData={formData}
				setFormData={setFormData}
				title={title}
				required={required}
				enabled={enabled}
			/>
			<Input
				field={ifVelocityRowField + 'z'}
				formData={formData}
				setFormData={setFormData}
				title={title}
				required={required}
				enabled={enabled}
			/>
		</Table.Row>
	);
}

export default BodyRow;
