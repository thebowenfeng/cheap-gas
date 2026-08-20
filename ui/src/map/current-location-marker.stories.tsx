import type { Meta, StoryObj } from '@storybook/react-vite';
import { LocationMarkerView } from './current-location-marker';

const meta = {
    title: 'Map/CurrentLocationMarker',
    component: LocationMarkerView,
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof LocationMarkerView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
