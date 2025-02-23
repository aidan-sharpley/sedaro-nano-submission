import { Flex, Heading, Table, Tooltip } from '@radix-ui/themes';
import _ from 'lodash';
import React from 'react';
import Input from './Input';
import BodyRow from './BodyRow';

type BaseCardProps = {
	formData: FormData;
	setFormData: React.Dispatch<React.SetStateAction<FormData>>;
	title: string;
	required?: boolean;
	fontSize?: number;
};

function BaseCard({
	title,
	formData,
	setFormData,
	required = true,
	fontSize = 12,
}: BaseCardProps) {
	return (
		<Flex justify="center" m="3">
			<Table.Root m={'-4'} size={'1'} my="-5">
				{/* Table: https://www.radix-ui.com/themes/docs/components/table */}
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeaderCell style={{ fontSize: fontSize + 1 }}>
							{title}
						</Table.ColumnHeaderCell>
						<Tooltip content={'Initial X-position'}>
							<Table.ColumnHeaderCell
								style={{ fontSize: fontSize }}
								justify={'center'}
							>
								X
							</Table.ColumnHeaderCell>
						</Tooltip>
						<Tooltip content={'Initial Y-position'}>
							<Table.ColumnHeaderCell
								style={{ fontSize: fontSize }}
								justify={'center'}
							>
								Y
							</Table.ColumnHeaderCell>
						</Tooltip>
						<Tooltip content={'Initial Z-position'}>
							<Table.ColumnHeaderCell
								style={{ fontSize: fontSize }}
								justify={'center'}
							>
								Z
							</Table.ColumnHeaderCell>
						</Tooltip>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					<BodyRow
						formData={formData}
						setFormData={setFormData}
						title={title}
						rowKey={'Position'}
						fontSize={fontSize}
						required={required}
					/>
					<BodyRow
						formData={formData}
						setFormData={setFormData}
						title={title}
						rowKey={'Velocity'}
						fontSize={fontSize}
						required={required}
					/>
					<BodyRow
						formData={formData}
						setFormData={setFormData}
						title={title}
						rowKey={'Mass'}
						fontSize={fontSize}
						required={required}
					/>
				</Table.Body>
			</Table.Root>
		</Flex>
	);
}

export default BaseCard;
