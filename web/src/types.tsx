export type FormValue = number | '';

export type Body = {
	agentId?: string;
	x: FormValue;
	y: FormValue;
	z: FormValue;
	vx: FormValue;
	vy: FormValue;
	vz: FormValue;
	mass: FormValue;
};

export type FormData = {
	Body1: Body;
	Body2: Body;
};

export type SimulationViewEnum = 'Both' | 'Position' | 'Velocity';

export const defaultBody1: Body = {
	agentId: 'Body1',
	x: -0.73,
	y: 0,
	z: 0,
	vx: 0,
	vy: -0.0015,
	vz: 0,
	mass: 1,
};

export const defaultBody2: Body = {
	agentId: 'Body2',
	x: 60.34,
	y: 0,
	z: 0,
	vx: 0,
	vy: 0.13,
	vz: 0,
	mass: 0.0123,
};

export const defaultBatch: Body = {
	x: 0,
	y: 0,
	z: 0,
	vx: 0,
	vy: 0,
	vz: 0,
	mass: 0,
};
