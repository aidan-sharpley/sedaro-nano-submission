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

// Output data to the plot
type PlottedAgentData = Record<string, number[]>;
type PlottedFrame = Record<string, PlottedAgentData>;

const baseData = () => ({
	x: [],
	y: [],
	z: [],
	type: 'scatter3d',
	mode: 'lines+markers',
	marker: { size: 4 },
	line: { width: 2 },
});

const App = () => {
	// Store plot data in state.
	const [positionData, setPositionData] = useState<PlottedAgentData[]>([]);
	const [velocityData, setVelocityData] = useState<PlottedAgentData[]>([]);

	const [simulationCount, setSimulationCount] = useState<number>(1);
	const [simulationView, setSimulationView] =
		useState<SimulationViewEnum>('Both');

	const { isLoading, data } = useQuery({
		queryKey: ['queryAPI'],
		refetchInterval: 3000, // 3 second pings of data
		queryFn: () =>
			fetch(`http://localhost:8000/simulation`).then((res) => res.json()),
		enabled: !!simulationCount,
	});

	useEffect(() => {
		try {
			// data should be populated from a POST call to the simulation server
			const updatedPositionData: PlottedFrame = {};
			const updatedVelocityData: PlottedFrame = {};

			(data as DataPoint[]).forEach(([t0, t1, frame]) => {
				for (let [agentId, { x, y, z, vx, vy, vz }] of Object.entries(frame)) {
					updatedPositionData[agentId] =
						updatedPositionData[agentId] || baseData();
					updatedPositionData[agentId].x.push(x);
					updatedPositionData[agentId].y.push(y);
					updatedPositionData[agentId].z.push(z);

					updatedVelocityData[agentId] =
						updatedVelocityData[agentId] || baseData();
					updatedVelocityData[agentId].x.push(vx);
					updatedVelocityData[agentId].y.push(vy);
					updatedVelocityData[agentId].z.push(vz);
				}
			});
			setPositionData(Object.values(updatedPositionData));
			setVelocityData(Object.values(updatedVelocityData));
			console.log('Set plot data!');
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
				ml={'1vh'}
				mt={'5vh'}
				height={'66vh'}
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
