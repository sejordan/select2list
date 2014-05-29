select2list
===========

select2list is a jQuery plugin that turns an HTML &lt;select&gt; element into a flat list of clickable items. The new list drives the old &lt;select&gt; element, so it is a drop in replacement with seamless degradation.

## How do I use it?

In addition to the documentation provided here, the source code is well documented, and easily readable.

Using the plugin is very simple. No configuration is necessary; simply calling the plugin function on a select element will get you up and running.

<code>$('select.list').select2list();</code>

The plugin allows you to customize the HTML tags and classes used to generate the list using the options at initialization.

<pre>
    $('select.custom').select2list({
      tagName: 'div',
      childTagName: 'p'
    });
</pre>

## Configuration Options

<table class="table">
    <thead>
        <tr>
            <th scope="col">Option name</th>
            <th scope="col">Default value</th>
            <th scope="col">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">tagName</th>
            <td><code>'ul'</code></td>
            <td>The outer HTML tag to be used to generate the new element.</td>
        </tr>

        <tr>
            <th scope="row">className</th>
            <td><code>'select2list'</code></td>
            <td>The HTML class to be used with the new wrapper element.</td>
        </tr>

        <tr>
            <th scope="row">childTagName</th>
            <td><code>'li'</code></td>
            <td>The inner HTML tag to be used to generate the child elements (the options).</td>
        </tr>

        <tr>
            <th scope="row">childClassName</th>
            <td><code>'select2list-option'</code></td>
            <td>The HTML class to be used with the new children elements (the options).</td>
        </tr>

        <tr>
            <th scope="row">optionValueDataKey</th>
            <td><code>'select2list-value'</code></td>
            <td>Each child element will have it's associated value stored by jQuery using the $.data method, this is the key that will hold the value.</td>
        </tr>

        <tr>
            <th scope="row">change</th>
            <td><code>$.noop</code></td>
            <td>See the <a href="#callback-change">change</a> callback below.</td>
        </tr>
    </tbody>
</table>

## Triggered Events

<table class="table">
    <thead>
        <tr>
            <th scope="col">Event name</th>
            <th scope="col">Parameters</th>
            <th scope="col">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr id="#callback-change">
            <th scope="row">Change</th>
            <td>
                <ol>
                    <li><code>select_list_object</code> - an instance of the SelectList object</li>
                    <li><code>value</code> - the value of the newly selected option</li>
                    <li><code>display</code> - the display text of the newly selected option</li>
                </ol>
            </td>
            <td>Fires after a new option has been selected</td>
        </tr>
    </tbody>
</table>
</div>

## Available Methods

After initializing the plugin, you can call methods on the plugin by providing the method name as the first parameter, followed by any method parameters, to the plugin function.

<table class="table">
   <thead>
       <tr>
           <th scope="col">Method name</th>
           <th scope="col">Parameters</th>
           <th scope="col">Description</th>
       </tr>
   </thead>
   <tbody>
       <tr>
           <th scope="row">redraw</th>
           <td>none</td>
           <td>Triggers a redraw of the list element, which includes re-parsing all of the &lt;option&gt; elements in the &lt;select&gt;.</td>
       </tr>

       <tr>
           <th scope="row">add</th>
           <td>
               <ol>
                   <li><code>value</code> - the value of the new option</li>
                   <li><code>display</code> - the display value of the new option (optional, defaults to <code>value</code>)</li>
               </ol>
           </td>
           <td>Add a new option to the list. Also creates a new &lt;option&gt; element and appends it to the underlying &lt;select&gt; element.</td>
       </tr>

       <tr>
           <th scope="row">select</th>
           <td>
               <ol>
                   <li><code>value</code> - the value of the option to select</li>
               </ol>
           </td>
           <td>Changes the currently selected option by looking up the option with the provided value and selecting it.</td>
       </tr>
   </tbody>
</table>

## Styling the list

Styling the list is very simple. You can control the CSS classes that go on the parent and child elements. When an option is selected, the <code>selected</code> class is also added to the child (option) element.
