import { Tldraw } from '@tldraw/tldraw'
// eslint-disable-next-line import/no-internal-modules
import '@tldraw/tldraw/editor.css'
// eslint-disable-next-line import/no-internal-modules
import '@tldraw/tldraw/ui.css'

export default function SocialVideoBoard() {
	return (
		<div className="tldraw__editor">
			<Tldraw autoFocus persistenceKey="social-video-board" />
		</div>
	)
}
