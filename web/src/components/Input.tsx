import { FormField } from '@radix-ui/react-form';
import { Flex, Table, TextField } from '@radix-ui/themes';
import _ from 'lodash';
import React, { useCallback } from 'react';
import { FormValue } from 'types';

type InputProps = {
	formData: FormData;
	title: string;
	required?: boolean;
	field: string;
	value?: number;
	setFormData: (value: React.SetStateAction<FormData>) => void;
};

function Input({
	title,
	required = true,
	field,
	formData,
	setFormData,
}: InputProps) {
	return (
		<Table.Cell>
			<FormField name={`${title}.${field ?? ''}`}>
				<TextField.Root
					type="number"
					id={`${title}.${field ?? ''}`}
					name={`${title}.${field}`}
					value={formData?.[title]?.[field]}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						const { name, value } = e.target;
						let newValue: FormValue = value === '' ? '' : parseFloat(value);
						setFormData((prev) => _.set({ ...prev }, name, newValue));
					}}
					required={required}
					step={0.01}
				/>
			</FormField>
		</Table.Cell>
	);
}

export default Input;
