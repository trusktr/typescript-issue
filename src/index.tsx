import {effect, signal} from 'pota'
import './KitchenSink.ts'
import {KitchenSink} from './KitchenSink.ts'

const [sink, setSink] = signal<KitchenSink>()
const [sink2, setSink2] = signal<KitchenSink>()

const result = (
	<>
		<img on:error={e => console.error(e.error)} />

		{/* Start with an initial value of 5 */}
		<kitchen-sink
			ref={setSink}
			on:error={e => e.error} // type test
			count="5"
		></kitchen-sink>
	</>
) as unknown as () => Element[]

document.body.append(...result())

effect(() => {
	if (!sink()) return

	console.log('values outside the element:', sink().count, sink().name, sink().doingSomething)
})
