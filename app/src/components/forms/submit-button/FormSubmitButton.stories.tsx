import { FormSubmitButton } from './FormSubmitButton'
import { ComponentStory } from '@storybook/react';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Form/FormSubmitButton',
  component: FormSubmitButton,
}

const Template: ComponentStory<typeof FormSubmitButton> = (args) => <FormSubmitButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'valider',
};
