import {element, numberAttribute, stringAttribute, booleanAttribute, Element, event} from '@lume/element'
import type {PotaElementAttributes} from '@lume/element/dist/pota.js'

type KitchenSinkAttributes = 'count' | 'name' | 'color' | 'doingSomething' | 'onawesomeness'

export
@element('kitchen-sink')
class KitchenSink extends Element {
	@numberAttribute count = 0
	@stringAttribute name = 'Baby Yoda'
	@stringAttribute color: 'red' | 'green' | 'blue' = 'red'
	@booleanAttribute doingSomething = false
	@event onawesomeness!: ((event: MouseEvent) => void) | null
}

// prettier-ignore
export type PotaElementAttributes2< El > =
		JSX.HTMLAttributes<El, {}, JSX.HTMLEvents<El>>

declare module 'pota' {
	namespace JSX {
		interface IntrinsicElements {
			// 'kitchen-sink': JSX.HTMLAttributes<KitchenSink, {}, JSX.HTMLEvents<KitchenSink>>
			'kitchen-sink': PotaElementAttributes<KitchenSink>
			// 'kitchen-sink': PotaElementAttributes2<KitchenSink>
		}
	}
}

import type {JSX} from 'pota'

type test = JSX.HTMLAttributes<KitchenSink, {}, JSX.HTMLEvents<KitchenSink>>
type test2 = PotaElementAttributes<KitchenSink>

type t = test['on:error']

// @ts-expect-error
type t2 = test2['on:error'] // odd, no type error

// @ts-expect-error
type t3 = test2['blah'] // odd, also no type error

type test4 = JSX.HTMLAttributes<HTMLElement, {}, JSX.HTMLEvents<HTMLElement>>
type test5 = PotaElementAttributes<HTMLElement>

type t4 = test4['on:error']

// @ts-expect-error
type t5 = test5['on:error'] // odd, no type error

// @ts-expect-error
type t6 = test5['blah'] // odd, also no type error
