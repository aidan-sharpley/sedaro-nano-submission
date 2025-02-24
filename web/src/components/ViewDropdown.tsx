import {
	Button,
	DropdownMenu,
	Flex,
	ThickDividerHorizontalIcon,
} from '@radix-ui/themes';
import _ from 'lodash';
import React from 'react';
import { SimulationViewEnum } from 'types';

type ViewDropdownProps = {
	simulationView?: SimulationViewEnum;
	setSimulationView: React.Dispatch<React.SetStateAction<SimulationViewEnum>>;
};

const ViewDropdown = ({
	simulationView,
	setSimulationView,
}: ViewDropdownProps) => {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<Button type="submit">
					View: {simulationView == 'Both' ? 'P&V' : simulationView}
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
				<DropdownMenu.Item
					onSelect={() => setSimulationView('Both')}
					className="DropdownMenuItem"
				>
					{'P&V' as SimulationViewEnum}
				</DropdownMenu.Item>
				<DropdownMenu.Item
					onSelect={() => setSimulationView('Position')}
					className="DropdownMenuItem"
				>
					{'Position' as SimulationViewEnum}
				</DropdownMenu.Item>
				<DropdownMenu.Item
					onSelect={() => setSimulationView('Velocity')}
					className="DropdownMenuItem"
				>
					{'Velocity' as SimulationViewEnum}
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
};

export default ViewDropdown;
