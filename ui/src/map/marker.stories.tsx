import type { Meta, StoryObj } from '@storybook/react-vite';
import type { GasStation } from '../api/types';
import { StationMarkerView } from './marker';

const station = {
    id: 'station-1',
    name: 'Melbourne Central Fuel asaaaaaaaa',
    address: '123 Example Street, Melbourne, Victoria, Australia',
    location: {
        longitude: 144.9631,
        latitude: -37.8136,
    },
    tradingHours: undefined,
    icon: 'metro.png',
    prices: [
        {
            type: 'E10',
            amount: 100.33,
            updated: Date.now()
        }
    ],
} satisfies GasStation;

const meta = {
    title: 'Map/StationMarker',
    component: StationMarkerView,
    parameters: {
        layout: 'centered',
    },
    args: {
        station
    },
} satisfies Meta<typeof StationMarkerView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};