import { Flex, Heading, Table, Tooltip } from '@radix-ui/themes';
import _ from 'lodash';
import React from 'react';
import Input from './Input';

type BodyRowProps = {
	formData: FormData;
	setFormData: React.Dispatch<React.SetStateAction<FormData>>;
	title: string;
	required?: boolean;
	fontSize?: number;
	rowKey: string;
};

function BodyRow({
	title,
	formData,
	setFormData,
	required = true,
	fontSize = 12,
	rowKey,
}: BodyRowProps) {
	return (
		<Table.Row align={'center'} key={`${rowKey}-key`}>
			<Table.RowHeaderCell style={{ fontSize: fontSize }}>
				{rowKey}
			</Table.RowHeaderCell>
			<Input
				field={'x'}
				formData={formData}
				setFormData={setFormData}
				title={title}
				required={required}
			/>
			<Input
				field={'y'}
				formData={formData}
				setFormData={setFormData}
				title={title}
				required={required}
			/>
			<Input
				field={'z'}
				formData={formData}
				setFormData={setFormData}
				title={title}
				required={required}
			/>
		</Table.Row>
	);
}

export default BodyRow;
