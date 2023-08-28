import { createContext, useContext } from 'react'
import { EditorAssetUrls } from '../assetUrls'

const AssetUrlsContext = createContext<EditorAssetUrls | null>(null)

/** @public */
export function AssetUrlsProvider({
	assetUrls,
	children,
}: {
	assetUrls: EditorAssetUrls
	children: React.ReactNode
}) {
	return <AssetUrlsContext.Provider value={assetUrls}>{children}</AssetUrlsContext.Provider>
}

/** @public */
export function useAssetUrls() {
	const assetUrls = useContext(AssetUrlsContext)
	if (!assetUrls) {
		throw new Error('useAssetUrls must be used within an AssetUrlsProvider')
	}

	return assetUrls
}
