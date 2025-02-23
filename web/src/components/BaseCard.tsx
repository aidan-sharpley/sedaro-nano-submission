import { Flex, Heading, Table, Tooltip } from '@radix-ui/themes';
import _ from 'lodash';
import React from 'react';
import Input from './Input';

type BaseCardProps = {
	formData: FormData;
	setFormData: React.Dispatch<React.SetStateAction<FormData>>;
	title: string;
	required?: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function BaseCard({
	title,
	formData,
	setFormData,
	required = true,
	onChange,
}: BaseCardProps) {
	return (
		<Flex justify="center" m="4">
			<Table.Root m={'-4'} size={'1'} my="-5">
				{/* Table: https://www.radix-ui.com/themes/docs/components/table */}
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeaderCell>{title}</Table.ColumnHeaderCell>
						<Tooltip content={'Initial X-position'}>
							<Table.ColumnHeaderCell
								justify={'center'}
								style={{ fontSize: 13 }}
							>
								X
							</Table.ColumnHeaderCell>
						</Tooltip>
						<Tooltip content={'Initial Y-position'}>
							<Table.ColumnHeaderCell
								justify={'center'}
								style={{ fontSize: 13 }}
							>
								Y
							</Table.ColumnHeaderCell>
						</Tooltip>
						<Tooltip content={'Initial Z-position'}>
							<Table.ColumnHeaderCell
								justify={'center'}
								style={{ fontSize: 13 }}
							>
								Z
							</Table.ColumnHeaderCell>
						</Tooltip>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					<Table.Row align={'center'} key={'position-key'}>
						<Table.RowHeaderCell>{'Position'}</Table.RowHeaderCell>
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
					<Table.Row align={'center'} key={'velocity-key'}>
						<Table.RowHeaderCell>{'Velocity'}</Table.RowHeaderCell>
						<Input
							field={'vx'}
							formData={formData}
							setFormData={setFormData}
							title={title}
							required={required}
						/>
						<Input
							field={'vy'}
							formData={formData}
							setFormData={setFormData}
							title={title}
							required={required}
						/>
						<Input
							field={'vz'}
							formData={formData}
							setFormData={setFormData}
							title={title}
							required={required}
						/>
					</Table.Row>
					<Table.Row align={'center'} key={'mass-key'}>
						<Table.RowHeaderCell>{'Mass'}</Table.RowHeaderCell>
						<Input
							field={'mass'}
							formData={formData}
							setFormData={setFormData}
							title={title}
							required={required}
						/>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</Flex>
	);
}

export default BaseCard;
