export interface IChronosOlControl {
	id: number;
	name: string;
	desc?: string;
	config?: {
		icon?: string;
		type: 'toolContainer' | 'floatingPanel' | 'simpleWidget';
		color?: string;
		state?: boolean;
		toolsWillOpen?: IChronosOlControl[];
	};
    target?: any
}