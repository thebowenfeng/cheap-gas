import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentProps, useState } from 'react';
import { Dropdown } from './dropdown';

const options = [
    { value: 'e10', label: 'E10' },
    { value: 'unleaded-91', label: 'Unleaded 91' },
    { value: 'premium-95', label: 'Premium 95' },
    { value: 'premium-98', label: 'Premium 98' },
    { value: 'diesel', label: 'Diesel' },
];

const ControlledDropdown = (props: ComponentProps<typeof Dropdown>) => {
    const [value, setValue] = useState(props.value);

    return (
        <Dropdown
            {...props}
            value={value}
            onValueChange={(nextValue, option) => {
                setValue(nextValue);
                props.onValueChange?.(nextValue, option);
            }}
        />
    );
};

const meta = {
    title: 'Common/Dropdown',
    component: Dropdown,
    parameters: {
        layout: 'centered',
    },
    render: (args) => <ControlledDropdown {...args} />,
    args: {
        options,
        placeholder: 'Choose a fuel type',
        ariaLabel: 'Fuel type',
    },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
