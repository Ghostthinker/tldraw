import { TLStyleType } from '@tldraw/tlschema'
import { TLBoxTool } from '../TLBoxTool/TLBoxTool'

export class TLViewzoneTool extends TLBoxTool {
	static override id = 'viewzone'
	static initial = 'idle'

	shapeType = 'viewzone'

	styles = ['opacity'] as TLStyleType[]
}
