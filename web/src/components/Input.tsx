import { FormField } from '@radix-ui/react-form';
import { Table, TextField } from '@radix-ui/themes';
import _ from 'lodash';
import React from 'react';

type InputProps = {
	formData: FormData;
	handleChange: React.ChangeEventHandler<HTMLInputElement>;
	title: string;
	required?: boolean;
	key: string;
};

function Input({
	title,
	formData,
	handleChange,
	required = true,
	key,
}: InputProps) {
	return (
		<>
			<Table.Cell>
				<FormField name={`${title}.${key}`}>
					<TextField.Root
						type="number"
						id={`${title}.${key}`}
						name={`${title}.${key}`}
						value={formData[title][key]}
						onChange={handleChange}
						required={required}
						step={0.01}
					/>
				</FormField>
			</Table.Cell>
		</>
	);
}

export default Input;
