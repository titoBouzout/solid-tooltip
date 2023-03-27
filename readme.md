# Solid Tooltip

Directive for displaying simple tooltips on components given a `title` attribute.

A Solid component. See https://www.solidjs.com/

## Simple Usage

```jsx
import tooltip from 'solid-tooltip'

export default function YourComponent() {
	return (
		<div use:tooltip="top" title="the title!">
			hover me!
		</div>
	)
}
```

## Reactive Usage

```jsx
import tooltip from 'solid-tooltip'

export default function YourComponent() {
	return <div use:tooltip={[() => signal()]}>hover me!</div>
}
```

## Reactive Usage With Position

```jsx
import tooltip from 'solid-tooltip'

export default function YourComponent() {
	return <div use:tooltip={['bottom', () => signal()]}>hover me!</div>
}
```

## Install

`npm install solid-tooltip`

## How it works?

Appends one div container to the body. Whenever your mouse moves over the component that has the title attribute, it updates the content of the attached div with the `title`, show it, and position it in the desired place. When the mouse moves out, click, or the tab lose focus, the tooltip is hidden.

## Custom Tooltip

Customizing the tooltip is as simple as writting a wrapper. Lets say you want a tooltip that displays multiple lines.

```jsx
//fancy-tooltip.js

import { createSignal } from 'solid-js'
import tooltip from 'solid-tooltip'

// create a signal to read/set the tooltip content
const [content, setContent] = createSignal()

// create the custom div that we will reuse on every tooltip
const container = (
	<div
		style={`
			background:orange;
			color:black;
			border:1px solid white;
			white-space: pre-wrap;
			font-size:.8rem;
			padding:6px;
			margin:3px;
		`}
	>
		{content()}
	</div>
)

export default function myMultipleLinesTooltip(related, at) {
	return tooltip(related, at, (tooltip, position) => {
		setContent(
			tooltip
				.split('\n')
				.map(s => s.trim())
				.join('\n')
				.trim(),
		)
		return container
	})
}

// other-file.js

import myMultipleLinesTooltip from './fancy-tooltip.js'

export default function YourComponent() {
	return (
		<div use:myMultipleLinesTooltip="bottom" title="fancy\ntitle!">
			hover me!
		</div>
	)
}
```

## Positions

The argument of the directive its just the position.

| value                  |
| ---------------------- |
| `bottom`               |
| `bottom-left`          |
| `bottom-left-overlap`  |
| `bottom-right`         |
| `bottom-right-overlap` |
| `top` (the default)    |
| `top-left`             |
| `top-left-overlap`     |
| `top-right`            |
| `top-right-overlap`    |
| `left`                 |
| `right`                |

## Alternatives

- https://github.com/LXSMNSYC/solid-tippy

## Author

- https://github.com/titoBouzout

## URL

- https://github.com/titoBouzout/solid-tooltip
- https://www.npmjs.com/package/solid-tooltip
