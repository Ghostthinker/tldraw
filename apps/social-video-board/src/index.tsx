// eslint-disable-next-line import/no-internal-modules
import { getBundlerAssetUrls } from '@tldraw/assets/src/urls'
import {
	DefaultErrorFallback,
	ErrorBoundary,
	setDefaultEditorAssetUrls,
	setDefaultUiAssetUrls,
} from '@tldraw/tldraw'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import SocialVideoBoard from './SocialVideoBoard'

// we use secret internal `setDefaultAssetUrls` functions to set these at the
// top-level so assets don't need to be passed down in every single example.
const assetUrls = getBundlerAssetUrls()
setDefaultEditorAssetUrls(assetUrls)
setDefaultUiAssetUrls(assetUrls)

type SocialVideoBoard = {
	path: string
	element: JSX.Element
}
export const allExamples: SocialVideoBoard[] = [
	{
		path: '/svb',
		element: <SocialVideoBoard />,
	},
]

const router = createBrowserRouter(allExamples)
const rootElement = document.getElementById('root')
const root = createRoot(rootElement!)

root.render(
	<StrictMode>
		<ErrorBoundary
			fallback={(error) => <DefaultErrorFallback error={error} />}
			onError={(error) => console.error(error)}
		>
			<RouterProvider router={router} />
		</ErrorBoundary>
	</StrictMode>
)
