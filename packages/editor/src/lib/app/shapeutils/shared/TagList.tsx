import classNames from 'classnames'
import _uniqueId from 'lodash/uniqueId'
import { Chip } from 'primereact/chip'
import { ReactChild, useEffect, useState } from 'react'

export function TagList({ edubreakTags, className }: { edubreakTags: any[]; className?: string }) {
	const [tags, setTags] = useState<ReactChild[]>([])

	useEffect(() => {
		if (edubreakTags) {
			const tagElements = []
			if (edubreakTags.length > 0) {
				for (const tag of edubreakTags) {
					tagElements.push(
						<Chip className="edubreak-tag" key={_uniqueId('tag-')} label={tag.name} />
					)
				}
				setTags(tagElements)
			}
		}
	}, [])

	function getTags() {
		return tags
	}

	return (
		<div className={classNames('edubreak-tags', className)}>
			{tags.length > 0 ? getTags() : undefined}
		</div>
	)
}
