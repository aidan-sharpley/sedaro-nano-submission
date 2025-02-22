import { Form, FormField, FormLabel } from '@radix-ui/react-form';
import {
	Button,
	Card,
	Flex,
	Heading,
	Separator,
	TextField,
} from '@radix-ui/themes';
import _ from 'lodash';
import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Routes } from 'routes';
import { FormValue, defaultBody1, defaultBody2 } from 'types';

type BaseCardProps = {
	formData: FormData;
	handleChange: React.ChangeEventHandler<HTMLInputElement>;
	title: string;
	required?: boolean;
};

function BaseCard({
	title,
	formData,
	handleChange,
	required = true,
}: BaseCardProps) {
	return (
		<>
			<Heading as="h3" size="3" weight="bold">
				{title}
			</Heading>
			{/* Form: https://www.radix-ui.com/primitives/docs/components/form */}
			<FormField name={`${title}.x`}>
				<FormLabel htmlFor={`${title}.x`}>Initial X-position</FormLabel>
				<TextField.Root
					type="number"
					id={`${title}.x`}
					name={`${title}.x`}
					value={formData[title]?.x}
					onChange={handleChange}
					required={required}
				/>
			</FormField>
			<FormField name={`${title}.y`}>
				<FormLabel htmlFor={`${title}.y`}>Initial Y-position</FormLabel>
				<TextField.Root
					type="number"
					id={`${title}.y`}
					name={`${title}.y`}
					value={formData[title]?.y}
					onChange={handleChange}
					required={required}
				/>
			</FormField>
			<FormField name={`${title}.z`}>
				<FormLabel htmlFor={`${title}.z`}>Initial Z-position</FormLabel>
				<TextField.Root
					type="number"
					id={`${title}.z`}
					name={`${title}.z`}
					value={formData[title]?.z}
					onChange={handleChange}
					required={required}
				/>
			</FormField>
			<FormField name={`${title}.vx`}>
				<FormLabel htmlFor={`${title}.vx`}>Initial X-velocity</FormLabel>
				<TextField.Root
					type="number"
					id={`${title}.vx`}
					name={`${title}.vx`}
					value={formData[title]?.vx}
					onChange={handleChange}
					required={required}
				/>
			</FormField>
			<FormField name={`${title}.vy`}>
				<FormLabel htmlFor={`${title}.vy`}>Initial Y-velocity</FormLabel>
				<TextField.Root
					type="number"
					id={`${title}.vy`}
					name={`${title}.vy`}
					value={formData[title]?.vy}
					onChange={handleChange}
					required={required}
				/>
			</FormField>
			<FormField name={`${title}.vz`}>
				<FormLabel htmlFor={`${title}.vz`}>Initial Z-velocity</FormLabel>
				<TextField.Root
					type="number"
					id={title}
					name={title}
					value={formData[title]?.vz}
					onChange={handleChange}
					required={required}
				/>
			</FormField>
			<FormField name={`${title}.mass`}>
				<FormLabel htmlFor={`${title}.mass`}>Mass</FormLabel>
				<TextField.Root
					type="number"
					id={`${title}.mass`}
					name={`${title}.mass`}
					value={formData[title]?.mass}
					onChange={handleChange}
					required={required}
				/>
			</FormField>
		</>
	);
}

export default BaseCard;
