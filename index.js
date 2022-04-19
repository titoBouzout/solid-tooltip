import { createMutable } from 'solid-js/store'
import { onCleanup, onMount } from 'solid-js'
import { insert } from 'solid-js/web'

// state
let local = createMutable({
	open: false,
	x: 0,
	y: 0,
	content: null,
	position: 'top',
})

// create container
let tooltip
let portal = (
	<div
		ref={tooltip}
		role="window"
		aria-label="tooltip text"
		onMouseOver={() => {
			local.open = true
		}}
		onMouseOut={close}
		style={{
			position: "fixed",
			"z-index": "9999",
			width: "max-content",
			"box-sizing": "border-box",
			top: local.y+'px',
			left: local.x+'px',
			display: local.open ? 'block' : 'none'
		}}
	>
		{local.content}
	</div>
)
insert(document.body, portal)

// directive
export default function Tooltip(related, at, wrap) {
	let title

	onMount(() => {
		title = related.title || related.getAttribute('title') || ''
		related.removeAttribute('title')
	})

	function open() {
		update(related, at, title, wrap)
	}

	related.addEventListener('mouseover', open)
	related.addEventListener('mouseout', close)
	related.addEventListener('click', close)

	onCleanup(() => {
		close()
		related.removeEventListener('mouseover', open)
		related.removeEventListener('mouseout', close)
		related.removeEventListener('click', close)
	})
}

// close tooltip when switching tabs
window.addEventListener('blur', e => {
	if (e.target == e.currentTarget) {
		close()
	}
})

function close() {
	local.open = false
}

// update when opening
function update(related, at, title, wrapper) {
	if (!local.open) {
		let position = at() || 'top'

		// the current title may have changed
		let currentTitle = related.title || related.getAttribute('title') || title
		related.removeAttribute('title')

		// if theres no wrapper, provide a default
		local.content =
			wrapper !== undefined ? (
				wrapper(currentTitle, position)
			) : (
				<div
					style={`
						margin: 3px;
						border-radius: 3px;
						padding: 6px;

						box-shadow: 0 0 7px 1px rgba(0, 0, 0, 0.05);
						color: snow;
						background: #282828;
						border: 1px solid grey;
						font-size: 0.8rem;

						text-transform: capitalize;
					`}
				>
					{currentTitle}
				</div>
			)
		local.position = position
		local.open = true

		// get coordinates
		let tooltipRect = tooltip.getBoundingClientRect()
		let tooltipWidth = tooltipRect.width
		let tooltipHeight = tooltipRect.height

		let relatedRect = related.getBoundingClientRect()
		let relatedWidth = relatedRect.width
		let relatedHeight = relatedRect.height
		let relatedTop = relatedRect.top
		let relatedLeft = relatedRect.left
		let relatedBottom = relatedRect.bottom
		let relatedRight = relatedRect.right

		let x, y

		switch (position) {
			case 'bottom': {
				x = relatedLeft + (relatedWidth / 2 - tooltipWidth / 2)
				y = relatedBottom
				break
			}
			case 'bottom-left': {
				x = relatedLeft - tooltipWidth
				y = relatedBottom
				break
			}
			case 'bottom-left-overlap': {
				x = relatedWidth + relatedLeft - tooltipWidth
				y = relatedBottom
				break
			}
			case 'bottom-right': {
				x = relatedRect.right
				y = relatedBottom
				break
			}
			case 'bottom-right-overlap': {
				x = relatedRect.right - relatedWidth
				y = relatedBottom
				break
			}
			case 'top-left': {
				x = relatedLeft - tooltipWidth
				y = relatedTop - tooltipHeight
				break
			}
			case 'top-left-overlap': {
				x = relatedWidth + relatedLeft - tooltipWidth
				y = relatedTop - tooltipHeight
				break
			}
			case 'top-right': {
				x = relatedRight
				y = relatedTop - tooltipHeight
				break
			}
			case 'top-right-overlap': {
				x = relatedRight - relatedWidth
				y = relatedTop - tooltipHeight
				break
			}
			case 'left': {
				x = relatedLeft - tooltipWidth
				y = relatedTop + (relatedHeight / 2 - tooltipHeight / 2)
				break
			}
			case 'right': {
				x = relatedRight
				y = relatedTop + (relatedHeight / 2 - tooltipHeight / 2)
				break
			}
			case 'top':
			default: {
				x = relatedLeft + (relatedWidth / 2 - tooltipWidth / 2)
				y = relatedTop - tooltipHeight
				break
			}
		}

		// overflow, dont let the tooltip go out of the page
		// margin controls how close to the border it can be
		let margin = 5
		if (x < margin) {
			x = margin
		} else if (x + tooltipWidth + margin >= document.body.clientWidth) {
			x = document.body.clientWidth - tooltipWidth - margin
		}

		if (y < margin) {
			y = margin
		} else if (y + tooltipHeight + margin >= document.body.clientHeight) {
			y = document.body.clientHeight - tooltipHeight - margin
		}

		// trigger reactivity
		local.x = x
		local.y = y
	}
}
