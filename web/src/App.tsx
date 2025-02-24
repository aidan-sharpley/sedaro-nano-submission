import { Flex } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import SimulateForm from 'components/SimulateForm';
import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { SimulationViewEnum } from 'types';

// Input data from the simulation
type AgentData = Record<string, number>;
type DataFrame = Record<string, AgentData>;
type DataPoint = [number, number, DataFrame];
type DataSet = DataPoint[][];

// Output data to the plot
type PlottedAgentData = Record<string, number[]>;
type PlottedFrame = Record<string, PlottedAgentData>;

const baseData = (name: string) => ({
	x: [],
	y: [],
	z: [],
	t: [],
	type: 'scatter3d',
	mode: 'lines+markers',
	marker: { size: 4 },
	line: { width: 2 },
	name: name,
});

const App = () => {
	// Store plot data in state.
	const [positionData, setPositionData] = useState<PlottedAgentData[]>([]);
	const [velocityData, setVelocityData] = useState<PlottedAgentData[]>([]);

	const [simulationCount, setSimulationCount] = useState<number>(1);
	const [simulationView, setSimulationView] =
		useState<SimulationViewEnum>('Both');

	const { data, refetch } = useQuery({
		queryKey: [`queryAPI${simulationCount}`],
		placeholderData: (prev) => prev,
		queryFn: () =>
			fetch(`http://localhost:8000/simulation?limit=${simulationCount}`).then(
				(res) => res.json()
			),
	});

	useEffect(() => {
		// data should be populated from a POST call to the simulation server
		const combinedPositionData: PlottedAgentData[] = [];
		const combinedVelocityData: PlottedAgentData[] = [];

		try {
			(data as DataSet).forEach((ds, i) => {
				const updatedPositionData: PlottedFrame = {};
				const updatedVelocityData: PlottedFrame = {};

				ds.forEach(([t0, t1, frame]) => {
					for (let [agentId, { x, y, z, vx, vy, vz }] of Object.entries(
						frame
					)) {
						const positionID = i + 'P' + agentId;
						const velocityID = i + 'V' + agentId;

						updatedPositionData[positionID] =
							updatedPositionData[positionID] || baseData(positionID);
						updatedPositionData[positionID].x.push(x);
						updatedPositionData[positionID].y.push(y);
						updatedPositionData[positionID].z.push(z);

						updatedVelocityData[velocityID] =
							updatedVelocityData[velocityID] || baseData(velocityID);
						updatedVelocityData[velocityID].x.push(vx);
						updatedVelocityData[velocityID].y.push(vy);
						updatedVelocityData[velocityID].z.push(vz);
					}
				});
				combinedPositionData.push(...Object.values(updatedPositionData));
				combinedVelocityData.push(...Object.values(updatedVelocityData));
				console.log('Set plot data!');
			});

			setPositionData(combinedPositionData);
			setVelocityData(combinedVelocityData);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}, [data]);

	return (
		<div
			style={{
				height: '100vh',
				width: '100vw',
				margin: '0 auto',
			}}
		>
			{/* Flex: https://www.radix-ui.com/themes/docs/components/flex */}
			<Flex
				position={'absolute'}
				ml={'4vh'}
				mt={'5vh'}
				height={'65vh'}
				width={'30vh'}
			>
				<SimulateForm
					style={{
						zIndex: '10',
					}}
					setSimulationCount={setSimulationCount}
					simulationCount={simulationCount}
					simulationView={simulationView}
					setSimulationView={setSimulationView}
					refreshData={refetch}
				/>
			</Flex>
			<Flex width={'100%'} height={'100%'} position={'absolute'}>
				<Plot
					style={{
						width: '100%',
						height: '100%',
					}}
					data={
						simulationView == 'Position'
							? positionData
							: simulationView == 'Velocity'
							? velocityData
							: simulationView == 'Both'
							? [...positionData, ...velocityData]
							: []
					}
					layout={{
						title:
							simulationView == 'Position' || simulationView == 'Velocity'
								? simulationView
								: 'Position & Velocity',
						scene: {
							xaxis: { title: 'X' },
							yaxis: { title: 'Y' },
							zaxis: { title: 'Z' },
						},
						autosize: true,
						dragmode: 'orbit',
					}}
					useResizeHandler
					config={{
						scrollZoom: true,
					}}
				/>
			</Flex>
		</div>
	);
};

export default App;
