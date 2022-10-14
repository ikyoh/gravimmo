import { FormInputText } from './FormInputText'

export default {
  title: 'FormInputText',
  component: FormInputText,
}


const Template = args => <FormInputText {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Label',
};
