import { createEdubreakShapeAtPoint, useApp } from '@tldraw/editor'
import { NodeTypeEnum, deleteFromInbox } from '@tldraw/edubreak'
import _uniqueId from 'lodash/uniqueId'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Chip } from 'primereact/chip'
import { ReactChild, memo, useEffect, useState } from 'react'
import { useTranslation } from '../../hooks/useTranslation/useTranslation'
import { Icon } from '../primitives/Icon'

/** @public */
interface ArtefactProps {
	artefact: any
}

export const Artefact = memo(function Artefact(props: ArtefactProps) {
	const msg = useTranslation()
	const app = useApp()
	const [tags, setTags] = useState<ReactChild[]>([])
	const formatedDate = new Date(props.artefact.created).toLocaleString('de-DE', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})
	const subTitle =
		props.artefact.author.name.firstname +
		' ' +
		props.artefact.author.name.lastname +
		' | ' +
		formatedDate

	function getIconFromType() {
		switch (props.artefact.type) {
			case NodeTypeEnum.BLOG:
				return <Icon className="artefact-card-icon" icon={'align-left2'} />
			case NodeTypeEnum.DOCUMENT:
				return <Icon className="artefact-card-icon" icon={'file'} />
			case NodeTypeEnum.VIDEO:
				return <Icon className="artefact-card-icon" icon={'video'} />
			case NodeTypeEnum.VIDEOCOMMENT:
				return <Icon className="artefact-card-icon" icon={'comments'} />
		}
	}

	useEffect(() => {
		if (props.artefact.tags) {
			const tagElements = []
			for (const tag of props.artefact.tags[0]) {
				tagElements.push(
					<Chip className="artefact-card-tag" key={_uniqueId('tag-')} label={tag.name} />
				)
			}
			setTags(tagElements)
		}
	}, [props.artefact.tags])

	function getTags() {
		return tags
	}

	const header = (
		<div className="artefact-card-header">
			<div className="artefact-card-header-top">
				<div className="artefact-card-title">{props.artefact.title}</div>
				{getIconFromType()}
			</div>
			<div className="artefact-card-subtitle">{subTitle}</div>
		</div>
	)

	async function addArtefactToCanvas() {
		createEdubreakShapeAtPoint(app, app.viewportPageCenter, props.artefact)
		const response = await deleteFromInbox(props.artefact.id)
		if (response) {
			const deleteInboxItemEvent = new CustomEvent('onDeleteInboxItem', { detail: response })
			window.dispatchEvent(deleteInboxItemEvent)
		} else {
			throw new Error('The edubreak inbox item could not be deleted properly')
		}
	}

	const footer = (
		<div className="artefact-card-footer">
			<Button
				className="artefact-card-button-add"
				onClick={() => {
					addArtefactToCanvas()
				}}
			>
				<Icon className="artefact-card-button-add-icon" icon="plus" />
				<div className="artefact-card-button-add-label">{msg('artefact.add')}</div>
			</Button>
		</div>
	)

	const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
		event.dataTransfer.setData('text/plain', JSON.stringify(props.artefact))
	}

	return (
		<div draggable={true} onDragStart={handleDragStart} className="artefact-card-wrapper">
			<Card header={header} footer={footer} className="artefact-card">
				<div className="artefact-card-content">{tags.length > 0 ? getTags() : undefined}</div>
			</Card>
		</div>
	)
})
