import type {ComponentMeta, ComponentStory} from '@storybook/react'
import React from 'react'
import {TextField as Component} from './text-field'

export default {
  title: 'Primitives/Text Field',
  component: Component,
  args: {
    label: 'demo label',
    hint: 'demo hint text',
  },
  argTypes: {
    size: {
      options: ['1', '2'],
      control: {type: 'select'},
      defaultValue: '2',
    },
    shape: {
      options: ['rounded', 'pill'],
      control: {type: 'inline-radio'},
      defaultValue: 'rounded',
      description: 'Defines the shape of the outside of the button',
    },
    status: {
      options: ['neutral', 'success', 'warning', 'danger'],
      control: {type: 'select'},
      defaultValue: 'neutral',
    },
  },
} as ComponentMeta<typeof Component>

export const TextField: ComponentStory<typeof Component> = (args) => <Component {...args} type="text" />

// import {TextField} from './text-field'
// import {Meta} from '@storybook/addon-docs'

// <Meta title="Forms/Text Field" />

// # TextField

// Use the `TextField` component to gather text input from the user.

// ## Import

// ```tsx
// import {TextField} from '@mintter/ui/text-field'
// ```

// ## Usage

// ```jsx
// <TextField type="email" placeholder="Type some text..." />
// ```

// ### Size

// Pass a `size` prop to the `TextField` component to change its size.

// ```jsx
// <TextField size="1" placeholder="Small" />
// <TextField size="2" placeholder="Medium" />
// ```

// > The default `TextField` `size` is `2`.

// ### Shape

// Pass a `shape` prop to the `TextField` component to change its shape.

// ```jsx
// <TextField shape="rounded" placeholder="Rounded" />
// <TextField shape="pill" placeholder="Pill" />
// ```

// > The default `TextField` `shape` is `rounded`

// ### Label

// Pass a `label` prop to the `TextField` component to render an
// [accessible label](https://radix-ui.com/primitives/docs/utilities/label) above the input associated to it.

// ```jsx
// <TextField label="Username" placeholder="How do you want other users to call you?" />
// ```

// ### Hint

// Pass a `hint` prop to the `TextField` component to render a helper message below the input.

// ```jsx
// <TextField
//   type="password"
//   placeholder="Password"
//   hint="Try to use an unique password that is strong and easy to remember"
// />
// ```

// ### Status

// Pass an `status` prop to the `TextField` component to indicate it's status. If your `TextField` has a label associated,
// its color will change accordingly.

// ```jsx
// <TextField
//   type="password"
//   status="neutral"
//   defaultValue="p@$$w0Rd"
//   hint="Your password should be secure"
// />
// <TextField
//   type="password"
//   status="success"
//   defaultValue="p@$$w0Rd"
//   hint="Your password was changed successfuly"
// />
// <TextField
//   status="warning"
//   placeholder="Organization name"
//   hint="Changing your organization name can cause unintended side effects"
// />
// <TextField
//   type="email"
//   status="danger"
//   placeholder="Enter your email to receive updates"
//   hint="Please enter a valid email"
// />
// ```

// > The default `TextField` `status` is `neutral`.

// ### Disabled

// Pass a `disabled` prop to the `TextField` component to disable it.

// ```jsx
// <TextField disabled label="Email" placeholder="Enter your email to receive updates" />
// ```

// ### Multiline (Textarea)

// Pass an `as="textarea"` prop to make your TextField a textarea that autogrows as you type.

// ```jsx
// <TextField as="textarea" rows={5} label="Bio" placeholder="A little about yourself..." />
// ```

// ## Playground

// Combine `TextField` props to preview your component.
