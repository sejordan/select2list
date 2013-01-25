/**
* jQuery select2list plugin v0.1.0
* Works with jQuery >= v1.7.1
*
* Turn a select element into a list of radio-button-style links
*/
(function($) {

   /**
    * valid options include:
    * - tagName: HTML tag of parent element. Default: 'ul'
    * - className: HTML class applied to the parent element. Default: 'select2list'
    * - childTagName: HTML tag of children elements. Default: 'li'
    * - childClassName: HTML class applied to the children elements. Defualt: 'select2list-option'
    * - optionValueDataKey: HTML5 data key name to store the option's value
    *
    * - change(SelectListObject, new_value, display): callback, is fired when a new option is selected. Default: $.noop
    *
    * @param {element} el The HTML element to apply SelectList to
    * @param {object} options Optional object of configuration options
    * @return {object} Returns the public API for the SelectList object
    */
    var SelectList = function SelectList(select_element, options) {

       var
       /****************************
        * Define private variables *
        ****************************/
        self = this,

       /**
        * @var {object} config
        */
        config = $.extend({
            tagName: 'ul',
            className: 'select2list',
            childTagName: 'li',
            childClassName: 'select2list-option',
            optionValueDataKey: 'select2list-value',

            // custom event handlers
            change: $.noop
        }, options),

       /**
        * @var {string} current_option_value The value of the currently
        * selected option
        */
        current_option_value = $(select_element).find('option:selected').attr('value'),

       /**
        * @var {object} selectable_options
        */
        selectable_options = {},

       /**
        * @var {element} generated_element
        */
        generated_element;


       var
       /**************************
        * Define private methods *
        **************************/

       /**
        * Provided with a value, function selects the option with that value
        * and triggers the change event on the underlying select element
        * Only selects the value if it is a valid option
        * and only triggers the change event if the value is valid and new
        * (doesn't trigger change if current value is re-selected)
        *
        * @param {string} value The value to select
        */
        select_option_by_value = function(value) {
            // only do something if we're getting a new value, and that value is valid
            if( value && (current_option_value !== value) && (value in selectable_options) ) {

                // set the new value as the currently selected one
                current_option_value = value;

                // and redraw the generated element
                render_generated_element();

                // and tell the underlying element to change
                // so events attached to the native option bubble up
                $(select_element).val(value).trigger('change');

                // if we've got a custom event handler for the change event,
                // fire it now
                if( $.isFunction( config.change ) ) {
                    config.change.apply(self, [self,value,selectable_options[value]['label']]);
                }
            }
        },

       /**
        * rebuilds the selectable_options variable
        * by looking at the select_element and parsing
        * out the options' value=>display pairs
        */
        parse_options = function() {
            var parsed_options = {};

            $(select_element).find('option').each(function() {
                var display_value = $(this).data('display');

                // if a data-display value is set, use that, otherwise take
                // the element's html text
                parsed_options[ $(this).attr('value') ] = {
                    label: (display_value ? display_value : $(this).text()),
                    value: $(this).attr('value'),
                    disabled: !!($(this).attr('disabled')),
                    option_element: this
                };
            });

            selectable_options = parsed_options;
        },

       /**
        * returns a list of all possible values in the list
        */
        get_all_values = function() {
            var list = [];
            $.each(selectable_options, function(v,k) {
                list.push(v);
            });

            return list;
        },

       /**
        * Calls parse_options to make sure the latest list of selectable
        * options is available, and then re-renders the list element
        */
        render_generated_element = function() {
            // before we can render the element, we need to make sure we have
            // the latest set of selectable options
            parse_options();

            // clean out any old children from a previous render
            generated_element.html('');

            $.each(selectable_options, function(value, option) {
                var is_selected = (current_option_value === value),
                    option_html,
                    option_class = config.childClassName;

                // if we're on the current selected option, we don't wrap
                // the item in an <a> tag, so it won't look active
                if( is_selected ) {
                    option_html = '<span>' + option['label'] + '</span>';
                    option_class += ' selected';
                } else if( option['disabled'] ) {
                    option_html = '<span>' + option['label'] + '</span>';
                    option_class += ' disabled';
                } else {
                    option_html = '<a href="#' + value + '">' + option['label'] + '</a>';
                }

                new_option = $('<' + config.childTagName + '/>', {
                    'class': option_class
                })
                .data('select2list-value', value)
                .data(config.optionValueDataKey, value)
                .html(option_html)
                .appendTo(generated_element);
            });
        },

       /**
        * Add a new option to the list of selectable options. Adds the option to the
        * underlying select element, and then re-renders the generated element
        *
        * @param {string} value The value of the new selectable option
        * @param {string} display The text to use as display in list. If not provided,
        *  the variable defaults to the value parameter
        * @param {object attributes Key:Value pairing of attributes
        */
        add_option = function(value, display, attributes) {

            var new_option;

            // display is optional. If one is not provided,
            // set the display equal to the value string
            if( !display ) {
                display = value;
            }

            // we want to append the new option onto the select element
            new_option = $('<option value="' + value + '">' + display + '</option>').appendTo(select_element);

            // add any attributes
            if( attribtues ) {
                $.each(attributes, function(attr_name, attr_value) {
                    $(new_option).attr(attr_name, attr_value);
                });
            }

            // and now re-draw the generated element
            render_generated_element();
        },

       /**
        * Handles when an <a> tag of a child element is clicked. Finds the closest
        * child element, pulls its value data and selects it by calling the
        * select_option_by_value function
        *
        * @param {event} evt The click event
        * @this {element} The <a> tag of the child element that was clicked on
        */
        handle_option_click = function(evt) {
            // find the closest generated child element
            var option_element = $(this).closest('.' + config.childClassName);

            if( option_element ) {
                select_option_by_value( $(option_element).data(config.optionValueDataKey) );
                evt.preventDefault();
            }
        };

        // generate the new html element
        generated_element = $('<' + config.tagName + '/>', {
            'class': config.className
        });

        // pre-render the generated element
        render_generated_element();

        // hide the existing select element, put the generated element in place
        $(select_element).hide().after(generated_element);

        // listen for clicks on the new options
        $(generated_element).on('click', config.childTagName + ' a', handle_option_click);

       /**
        * Return the public facing API to the object
        */
        return {
            redraw: render_generated_element,
            add: add_option,
            select: select_option_by_value,

            enable: function(value) {
                if( !value ) {
                    // enable all values
                    value = get_all_values();
                } else if (typeof value === 'string') {
                    // make single value iterable
                    value = [value];
                }

                $.each(value, function(index, v) {
                    if( v in selectable_options ) {
                        // remove disabled attr
                        $(selectable_options[v]['option_element']).attr('disabled', null);
                    }
                });

                render_generated_element();
            },

            disable: function(value) {
                if( !value ) {
                    // disable all values
                    value = get_all_values();
                } else if (typeof value === 'string') {
                    // make single value iterable
                    value = [value];
                }

                $.each(value, function(index, v) {
                    if( v in selectable_options ) {
                        // set disabled attr
                        $(selectable_options[v]['option_element']).attr('disabled', 'disabled');
                    }
                });

                render_generated_element();
            }
        };
    };

   /**
    * Creates an instance of SelectList per matched element,
    * or does a pass-thru for method calls on elements with
    * pre-existing SelectList objects
    */
    $.fn.select2list = function(options) {

        var return_value,
            extended_param_list = Array.prototype.slice.call(arguments, 1);

        this.each(function() {
            var matched_element = this,
                sl = $(matched_element).data('select2list.SelectList'),
                custom_options,
                method_name;

            // if we found an existing SelectList object, the plugin must've already been
            // called. Expect this to be a method call to be passed-thru
            if(sl) {
                if( typeof options === 'string' ) {
                    method_name = options;

                    if( !return_value ) {
                        return_value = [];
                    }

                    if( method_name in sl && $.isFunction(sl[method_name]) ) {
                        // store method results per each matched element in an array
                        return_value.push(
                            sl[method_name].apply(sl, extended_param_list)
                        );
                    }

                } // otherwise we've nothing to do
            } else {
                // allow custom options to be set by using data- attributes
                custom_options = $.extend(options, $(this).data());

                // initialize plugin
                sl = new SelectList(matched_element, custom_options);
                $(matched_element).data('select2list.SelectList', sl);
            }
        });

        // if we've got an array of return values, but the array is just of
        // length 1, then return the value not wrapped in an array
        if( typeof return_value === 'Array' && return_value.length === 1 ) {
            return_value = return_value.pop();
        }

        // if we picked up a return value, return that, otherwise return 'this'
        // 'this' is the jQuery selector the plugin has been called on
        return return_value ? return_value : this;

    };

})(jQuery);
