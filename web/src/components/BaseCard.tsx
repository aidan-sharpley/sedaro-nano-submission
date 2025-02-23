import { Form, FormField, FormLabel } from '@radix-ui/react-form';
import {
	Button,
	Card,
	Flex,
	Heading,
	Separator,
	Table,
	TextField,
	Tooltip,
} from '@radix-ui/themes';
import _ from 'lodash';
import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Routes } from 'routes';
import { FormValue, defaultBody1, defaultBody2 } from 'types';
import Input from './Input';

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
			<Flex justify="center" width="100%" m="4">
				<Table.Root
					style={{
						width: '800px',
					}}
				>
					{/* Table: https://www.radix-ui.com/themes/docs/components/table */}
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeaderCell></Table.ColumnHeaderCell>
							<Tooltip content={'Initial X-position'}>
								<Table.ColumnHeaderCell>X</Table.ColumnHeaderCell>
							</Tooltip>
							<Tooltip content={'Initial Y-position'}>
								<Table.ColumnHeaderCell>Y</Table.ColumnHeaderCell>
							</Tooltip>
							<Tooltip content={'Initial Z-position'}>
								<Table.ColumnHeaderCell>Z</Table.ColumnHeaderCell>
							</Tooltip>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						<Table.Row key={'position-key'}>
							<Table.RowHeaderCell>{'Position'}</Table.RowHeaderCell>
							<Input
								key={'x'}
								formData={formData}
								handleChange={handleChange}
								title={title}
							/>
							<Input
								key={'y'}
								formData={formData}
								handleChange={handleChange}
								title={title}
							/>
							<Input
								key={'z'}
								formData={formData}
								handleChange={handleChange}
								title={title}
							/>
						</Table.Row>
					</Table.Body>
				</Table.Root>
			</Flex>

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
