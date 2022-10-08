import { Example } from './Example'

export default {
  title: 'Example',
  component: Example,
}


const Template = args => <Example {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Label',
};
