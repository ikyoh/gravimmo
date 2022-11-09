import { FormInput } from './FormInput'

export default {
  title: 'FormInput',
  component: FormInput,
}


const Template = args => <FormInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Label',
};
