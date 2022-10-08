import { Title } from './Title'

export default {
  title: 'Title',
  component: Title,
}


const Template = args => <Title {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'syndic',
};
