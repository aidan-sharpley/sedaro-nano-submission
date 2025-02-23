import { Flex, Heading, Separator, Table } from '@radix-ui/themes';
import SimulateForm from 'SimulateForm';
import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { Link } from 'react-router-dom';
import { Routes } from 'routes';

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
	const [initialState, setInitialState] = useState<DataFrame>({});

	useEffect(() => {
		// fetch plot data when the component mounts
		let canceled = false;

		async function fetchData() {
			console.log('calling fetchdata...');

			try {
				// data should be populated from a POST call to the simulation server
				const response = await fetch('http://localhost:8000/simulation');
				if (canceled) return;
				const data: DataPoint[] = await response.json();
				const updatedPositionData: PlottedFrame = {};
				const updatedVelocityData: PlottedFrame = {};

				setInitialState(data[0][2]);

				data.forEach(([t0, t1, frame]) => {
					for (let [agentId, { x, y, z, vx, vy, vz }] of Object.entries(
						frame
					)) {
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
		}

		fetchData();

		return () => {
			canceled = true;
		};
	}, []);

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
				height={'63vh'}
				width={'30vh'}
			>
				<SimulateForm
					style={{
						zIndex: '10',
					}}
				/>
			</Flex>
			<Flex width={'100%'} height={'100%'} position={'absolute'}>
				<Plot
					style={{
						width: '100%',
						height: '100%',
					}}
					data={[...positionData, ...velocityData]}
					layout={{
						title: 'Position & Velocity',
						scene: {
							xaxis: { title: 'X' },
							yaxis: { title: 'Y' },
							zaxis: { title: 'Z' },
						},
						autosize: true,
						dragmode: 'turntable',
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
