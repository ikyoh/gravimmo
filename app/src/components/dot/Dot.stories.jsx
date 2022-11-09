import { Dot } from './Dot'

export default {
  title: 'Dot',
  component: Dot,
}


const Template = args => <Dot {...args} />;

export const Default = Template.bind({});
Default.args = {
};
