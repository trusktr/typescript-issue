import {element, numberAttribute, stringAttribute, booleanAttribute, Element, event} from '@lume/element'
import type {PotaElementAttributes} from '@lume/element/dist/pota.js'
import {onCleanup} from 'solid-js'
import html from 'solid-js/html'

/**
 * Define the attributes of the KitchenSink element that should be available for
 * use in framework templates (for example Pota JSX templates). The list of
 * attributes should be a union of property names that exist in the element
 * class.
 */
type KitchenSinkAttributes = 'count' | 'name' | 'color' | 'doingSomething' | 'onawesomeness'

/**
 * A "kitchen sink" element that demonstrates a variety of essential features
 * that a custom element might use, and demonstrates how the element's
 * properties and attributes can be used in a Pota JSX template including type
 * checking of selected attributes.
 *
 * Once you've defined your element, you can use it in a Pota JSX template with
 * type checking by registering it onto the `IntrinsicElements` interface of
 * the `pota/jsx-runtime` module. This is demonstrated at the bottom of this file
 * using the `declare module` syntax and the `PotaElementAttributes` type
 * helper.
 */
export
@element('kitchen-sink')
class KitchenSink extends Element {
	// Define attributes using decorators. Use the appropriate decorator for
	// based on the type of the property. The decorator will automatically
	// create the attribute and keep the property in sync with the attribute
	// value.
	@numberAttribute count = 0
	@stringAttribute name = 'Baby Yoda'
	@stringAttribute color: 'red' | 'green' | 'blue' = 'red'

	// Use camelCase for property names and dashed-case for attribute names.
	// This defines a reactive property "doingSomething" that corresponds to a
	// same-name but dashed-cased attribute "doing-something", so whenever the
	// "doing-something" attribute changes, the "doingSomething" property will
	// be updated, and vice versa.
	@booleanAttribute doingSomething = false

	// Here we define an event that this element can emit. Anything past the
	// "on" in the property name will be the event name. The type of the event
	// handler should be: a function that takes the event object as an argument,
	// or null for when no handler is given. The event handler will be triggered
	// for the event with the same name as the property name, but without the
	// "on" prefix. For example, the following property will call the assigned
	// event handler whenever the element dispatches an "awesomeness" event.
	@event onawesomeness!: ((event: MouseEvent) => void) | null

	connectedCallback() {
		super.connectedCallback()

		// Dispatch an 'awesomeness' event after 1 second. This will trigger the
		// event handler assigned to the "onawesomeness" property if any is
		// assigned, will also trigger the event handler assigned to the
		// "onawesomeness" attribute if any, and will also trigger
		// any event handler added with `addEventListener('awesomeness', ...)`.
		setTimeout(() => {
			this.dispatchEvent(new Event('awesomeness'))
		}, 1000)

		this.createEffect(() => {
			// Re-runs any time any of the attributes/properties change.
			console.log('values inside the element: ', this.count, this.name, this.doingSomething)
		})

		// Here we create an interval, then we rely on Solid's onCleanup to remove
		// the interval when the element is disconnected from the DOM. This is
		// similar to how you would use `connectedCallback` and `disconnectedCallback`, but
		// `onCleanup` is more declarative and composable.
		this.createEffect(() => {
			// Create an interval that increments the count property every second.
			const interval = setInterval(() => this.count++, 1000)

			// Cleanup the interval when the element is disconnected from the DOM.
			onCleanup(() => clearInterval(interval))
		})

		// This effect will run when the element is connected to the DOM, and
		// similar to the previous effect, it will cleanup when the element is
		// disconnected from the DOM if the timer is still active (if the
		// element is disconnected before 5 seconds).
		this.createEffect(() => {
			const timeout = setTimeout(() => {
				this.removeAttribute('count')
				console.log(' ------------------------ JS prop after attribute removed:', this.count)
			}, 5000)

			onCleanup(() => clearTimeout(timeout))
		})
	}

	// We're writing the template with Solid `html` to avoid having to add the
	// Solid JSX compiler to the Pota project as it would be tricky not to
	// conflict with Pota's JSX compiler at the same time. It would be more
	// practical to put custom element definitions in a separate project
	// compiled with Solid's JSX compiler, and a Pota app consuming the elements
	// would be using only the Pota JSX compiler and would not care how the
	// outside elements were compiled. In that case, the Pota project would only
	// import the compiled versions of the elements along with their type
	// definitions. So, for sake of example, we're keeping things simple here by
	// using `html` instead of JSX, so we can focus on showing how the a custom
	// element's property and attribute type definitions can be used in Pota
	// (but if you have a reason to write custom elements in the Pota app, you
	// can do so like this, noting that there's no type checking inside the
	// `html` template tag currently).
	//
	// Besides, if you have a Pota app, you're probably going to be writing
	// Pota components, not Custom Elements. You'd only be writing custom
	// elements if you're sharing the elements across different frameworks
	// besides and including Pota.
	template = () => html`
		<div>
			<!--
			Note that Solid's html template tag expects values to be getter
			functions, hence the arrow functions.
			-->
			<h1>Count: ${() => this.count}</h1>

			<h1 style=${() => `color: ${this.color};`}>Name: ${() => this.name}</h1>

			<h1>Doing something? ${() => (this.doingSomething ? 'true' : 'false')}</h1>

			<slot>
				<!-- This is the default location where children of the element
				are slotted to by default if a slot is not specified. -->

				<!-- This is fallback content if there are no default nodes to distribute. -->
				<p>default slot's default content</p>
			</slot>

			<hr />

			<slot name="foo">
				<!-- This is a named slot where children of this element are
				slotted to if those children have a slot="foo" attribute
				specifying the slot to slotted to. -->

				<!-- This is fallback content if there are no nodes to distribute to this particular slot. -->
				<p>"foo" slot's default content</p>
			</slot>
		</div>
	`

	/**
	 * Static styles get instantiated once per DOM root (Document or ShadowRoot)
	 * for all instances of the element. Interpoalting instance variables here
	 * won't work, but this is more performant than the css instance property.
	 */
	static css = /*css*/ `
		:host {
			margin: 20px;
		}

		div {
			border: 3px solid deeppink;
		}
	`

	bgColor = 'skyblue'

	/**
	 * This style is on the instances, instantiated once per instance and
	 * instance properties can be interpolated for unique styles per instance,
	 * but is less performant than the css property.
	 *
	 * Note that that this is currently not reactive, so if `this.bgColor`
	 * changes, the style won't update. Its useful for initialized styles that
	 * don't change after initialization.
	 *
	 * To make it reactive, you can use a CSS variable here, and update the CSS
	 * variable value in a `createEffect` callback using a reactive property.
	 */
	css = /*css*/ `
		div {
			border-radius: 10px;
			background: ${this.bgColor};
			padding: 10px 20px;
		}
	`
}

// Register the custom element onto Pota's IntrinsicElements interface so that
// Pota knows about the element and can provide type checking for the
// element's attributes in Pota JSX templates.
// CONTINUE: use PotaElementAttributes
declare module 'pota' {
	namespace JSX {
		interface IntrinsicElements {
			'kitchen-sink': PotaElementAttributes<KitchenSink, KitchenSinkAttributes>
		}
	}
}

import type {JSX} from 'pota'
type test = JSX.HTMLAttributes<KitchenSink, {}, JSX.HTMLEvents<KitchenSink>>
type test2 = PotaElementAttributes<KitchenSink, KitchenSinkAttributes>

type t = test['on:error']

// @ts-expect-error
type t2 = test2['on:error'] // odd, no type error

// @ts-expect-error
type t3 = test2['blah'] // odd, also no type error
