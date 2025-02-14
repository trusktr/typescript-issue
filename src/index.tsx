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
			id="sink"
			count="5"
			name="Mo"
			doing-something
			on:click={e => {
				e.type // type test
				sink().count++
				sink().name += 'Mo'
				// Get or set attributes (dash-case)
				sink().setAttribute(
					'doing-something',
					// Or get or set the same-name properties (camelCase)
					sink().doingSomething ? 'false' : 'true',
				)

				console.log('doingSomething after attribute change:', sink().doingSomething)
			}}
			on:awesomeness={event => {
				// The 'on*' event properties are also available in JSX or `html` templates.
				console.log('awesomeness happened!', event.type)
			}}
		></kitchen-sink>

		<kitchen-sink ref={setSink2} id="sink2" count="1" name="Po" doing-something="false" color="blue">
			<p>child from light DOM, no slot specified</p>
			<p slot="foo">child from light DOM, slotted to the foo slot</p>
		</kitchen-sink>
	</>
) as unknown as () => Element[]

document.body.append(...result())

effect(() => {
	if (!sink()) return

	console.log('values outside the element:', sink().count, sink().name, sink().doingSomething)
})

effect(() => {
	if (!sink2()) return

	// Event listeners can be set on 'on*' event properties directly, as with builtin events.
	sink2().onawesomeness = (event: Event) => {
		console.log('more awesomeness happened!', event.type)
	}
})
