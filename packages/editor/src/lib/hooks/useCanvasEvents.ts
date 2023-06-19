import { deleteFromInbox } from '@tldraw/edubreak'
import React, { useMemo } from 'react'
import { createEdubreakShapeAtPoint, createShapesFromFiles } from '../utils/assets'
import { preventDefault, releasePointerCapture, setPointerCapture } from '../utils/dom'
import { getPointerInfo } from '../utils/svg'
import { useApp } from './useApp'

export function useCanvasEvents() {
	const app = useApp()

	const events = useMemo(
		function canvasEvents() {
			// Track the last screen point
			let lastX: number, lastY: number

			function onPointerDown(e: React.PointerEvent) {
				if ((e as any).isKilled) return
				if (e.button !== 0 && e.button !== 1 && e.button !== 5) return

				setPointerCapture(e.currentTarget, e)

				app.dispatch({
					type: 'pointer',
					target: 'canvas',
					name: 'pointer_down',
					...getPointerInfo(e, app.getContainer()),
				})
			}

			function onPointerMove(e: React.PointerEvent) {
				if ((e as any).isKilled) return

				if (e.clientX === lastX && e.clientY === lastY) return
				lastX = e.clientX
				lastY = e.clientY

				app.dispatch({
					type: 'pointer',
					target: 'canvas',
					name: 'pointer_move',
					...getPointerInfo(e, app.getContainer()),
				})
			}

			function onPointerUp(e: React.PointerEvent) {
				if ((e as any).isKilled) return
				if (e.button !== 0 && e.button !== 1 && e.button !== 5) return
				lastX = e.clientX
				lastY = e.clientY

				releasePointerCapture(e.currentTarget, e)

				app.dispatch({
					type: 'pointer',
					target: 'canvas',
					name: 'pointer_up',
					...getPointerInfo(e, app.getContainer()),
				})
			}

			function onPointerEnter(e: React.PointerEvent) {
				if ((e as any).isKilled) return

				app.dispatch({
					type: 'pointer',
					target: 'canvas',
					name: 'pointer_enter',
					...getPointerInfo(e, app.getContainer()),
				})
			}

			function onPointerLeave(e: React.PointerEvent) {
				if ((e as any).isKilled) return

				app.dispatch({
					type: 'pointer',
					target: 'canvas',
					name: 'pointer_leave',
					...getPointerInfo(e, app.getContainer()),
				})
			}

			function onTouchStart(e: React.TouchEvent) {
				;(e as any).isKilled = true
				document.body.click() // god damn it, but necessary for long presses to open the context menu
				preventDefault(e)
			}

			function onTouchEnd(e: React.TouchEvent) {
				;(e as any).isKilled = true
				if (
					(e.target as HTMLElement).tagName !== 'A' &&
					(e.target as HTMLElement).tagName !== 'TEXTAREA'
				) {
					preventDefault(e)
				}
			}

			function onDragOver(e: React.DragEvent<Element>) {
				preventDefault(e)
			}

			async function onDrop(e: React.DragEvent<Element>) {
				preventDefault(e)
				const artefact = JSON.parse(e.dataTransfer.getData('text/plain'))
				if (artefact.campusURL) {
					await createEdubreakShapeAtPoint(app, app.viewportPageCenter, artefact)
					const response = await deleteFromInbox(artefact.id)
					if (response) {
						const deleteInboxItemEvent = new CustomEvent('onDeleteInboxItem', { detail: response })
						window.dispatchEvent(deleteInboxItemEvent)
					} else {
						throw new Error('The edubreak inbox item could not be deleted properly')
					}
				} else {
					if (!e.dataTransfer?.files?.length) return

					const files = Array.from(e.dataTransfer.files).filter(
						(file) => !file.name.endsWith('.tldr')
					)

					await createShapesFromFiles(app, files, app.screenToPage(e.clientX, e.clientY), false)
				}
			}

			return {
				onPointerDown,
				onPointerMove,
				onPointerUp,
				onPointerEnter,
				onPointerLeave,
				onDragOver,
				onDrop,
				onTouchStart,
				onTouchEnd,
			}
		},
		[app]
	)

	return events
}
