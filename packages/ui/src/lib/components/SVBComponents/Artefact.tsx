import { memo, ReactChild, useEffect, useState } from 'react'
// import { useReadonly } from '../../hooks/useReadonly'
import _uniqueId from 'lodash/uniqueId'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Chip } from 'primereact/chip'
import { useTranslation } from '../../hooks/useTranslation/useTranslation'
import { Icon } from '../primitives/Icon'

/** @public */
interface ArtefactProps {
	title: string
	subTitle: string
	tags: string[]
}

export const Artefact = memo(function Artefact(props: ArtefactProps) {
	const msg = useTranslation()
	// const isReadonly = useReadonly()
	// TODO: replace with real tags
	const [tags, setTags] = useState<ReactChild[]>([])

	useEffect(() => {
		console.log('tags sind: ', props.tags)
		const tagElements = []
		for (const tag of props.tags) {
			tagElements.push(<Chip className="artefact-card-tag" key={_uniqueId('tag-')} label={tag} />)
		}
		setTags(tagElements)
	}, [props.tags])

	function getTags() {
		return tags
	}

	const header = (
		<div className="artefact-card-header">
			<div className="artefact-card-header-top">
				<div className="artefact-card-title">{props.title}</div>
				<Icon className="artefact-card-icon" icon={'video'} />
			</div>
			<div className="artefact-card-subtitle">{props.subTitle}</div>
		</div>
	)

	const footer = (
		<div className="artefact-card-footer">
			<Button className="artefact-card-button-add">
				<Icon className="artefact-card-button-add-icon" icon="plus" />
				<div className="artefact-card-button-add-label">{msg('artefact.add')}</div>
			</Button>
		</div>
	)

	return (
		<div className="artefact-card-wrapper">
			<Card header={header} footer={footer} className="artefact-card">
				<div className="artefact-card-content">{tags.length > 0 ? getTags() : undefined}</div>
			</Card>
		</div>
	)
})
