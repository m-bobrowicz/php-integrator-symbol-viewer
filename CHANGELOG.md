# 0.5.2
* added empty figures view
* css fixes

# 0.5.0
* rewritten view from scratch to utilize ES6 templates
* dropped parent filters in favour of toggling inherited properties
* view layout written in flexbox
* added centering scroll when navigating to a symbol
* added setting whether inherited properties should be displayed by default
* added distinction between own and inherited symbols
* added highlighting in search
* added support for mutliple classes in the same file

# 0.3.3
* fixed passing null className to service
* added panel side configuration
* added collapsable symbol info (property types, parameters, return types, descriptions)

# 0.3.1
* added command for toggling panel's visibility
* fixed consumed service version (thanks to @Gert-dev)
* changed event subscription to custom service event

# 0.3.0
* changed bullets to bold letters without radial background
* removed divider lines
* fixed list not showing results when deleting input chars
* added parent classes, implemented interfaces and used traits to panel view
* added filtering for symbols only from selected parent classes / implemented interfaces / used traits

# 0.2.0
* fixed list not stretching to full height
* fixed bug when empty lists are added when no symbols exist
* added event subscriptions management to avoid memory leaks
* added error guards to prevent throwing errors when in non-TextEditor tab
* added error messages
* added CHANGELOG

# 0.1.1
* package info update

# 0.1.0
* initial release
