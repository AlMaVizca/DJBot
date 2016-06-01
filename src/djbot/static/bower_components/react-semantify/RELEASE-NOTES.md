<a name="0.5.1"></a>
## [0.5.1](https://github.com/jessy1092/react-semantify/compare/v0.5.0...v0.5.1) (2016-05-02)


### Bug Fixes

* Set displayname when getComposeComponent. close #60([617e5c8](https://github.com/jessy1092/react-semantify/commit/617e5c8)), closes [#60](https://github.com/jessy1092/react-semantify/issues/60)



<a name="0.5.0"></a>
# [0.5.0](https://github.com/jessy1092/react-semantify/compare/v0.4.3...v0.5.0) (2016-05-01)


### Features

* Add new component: Container([2a718cd](https://github.com/jessy1092/react-semantify/commit/2a718cd))
* Add new component: Embed([a121c17](https://github.com/jessy1092/react-semantify/commit/a121c17))
* Use higher order component instead of mixin and rewrite all component. close #35([dc85f72](https://github.com/jessy1092/react-semantify/commit/dc85f72)), closes [#35](https://github.com/jessy1092/react-semantify/issues/35)



<a name="0.4.3"></a>
## [0.4.3](https://github.com/jessy1092/react-semantify/compare/v0.4.2...v0.4.3) (2016-04-12)


### Features

* Support react v15.0 ([b0b7fbd](https://github.com/jessy1092/react-semantify/commit/b0b7fbd))



<a name="0.4.2"></a>
## [0.4.2](https://github.com/jessy1092/react-semantify/compare/v0.4.1...v0.4.2) (2016-04-11)


### Bug Fixes

* Transmit the properties into components: divider, accordion, dimmer, popup, item ([d49066a](https://github.com/jessy1092/react-semantify/commit/d49066a))



<a name="0.4.1"></a>
## [0.4.1](//compare/v0.4.0...v0.4.1) (2015-11-22)


### Bug Fixes

* **export:** Fix Unit component export 6bfcbbf

### Features

* **export:** Use ES6 export for exporting component 23ea253 PR #34



<a name="0.4.0"></a>
# [0.4.0](//compare/v0.3.2...v0.4.0) (2015-11-22)

- Support React 0.14.*


## Version 0.3.2 - 2015/11/13

- Form should use a <form> tag. [PR #29](https://github.com/jessy1092/react-semantify/pull/29)
- chore: Update dependency version.
- Update nodejs version on travis-ci. Now use NodeJS 4.x for development

## Version 0.3.1 - 2015/04/03

- Remove Unit Component onClick function. [issue #19](https://github.com/jessy1092/react-semantify/issues/19)

## Version 0.3.0 - 2015/04/01

- Support React v0.13.x
- Use [classnames](https://github.com/JedWatson/classnames) instead of [React.addon.classSet](http://facebook.github.io/react/docs/class-name-manipulation.html)

## Version 0.2.4 - 2015/03/10

- Transpile on prepublish. [issue #13](https://github.com/jessy1092/react-semantify/issues/13)
- Use gulp 4.0 for build system with es6.

## Version 0.2.3 - 2015/01/07

- Add Commons and Modules Test Function
- Use covrage status.
- Use jest.genMockFunction to test onClick Function.

## Version 0.2.2 - 2015/01/05

- Fix the onClick function Bug. [issue #7](https://github.com/jessy1092/react-semantify/issues/7)
  + Remove onClick Function Test on elements.
    - Segment, Label, Icon, Header, Flag, Button
- Add Collections and Views Test Function.

## Version 0.2.1 - 2015/01/03

- Fix the onClick function Bug: Use this.props.onClick to get the onClick function.
  + Segment, Label, Icon, Header, Flag, Button
- Add Elements Test Function.
  + Use [Jest](https://facebook.github.io/jest/) for component test.
  + Use Travis-CI for CI.

## Version 0.2.0 - 2015/01/02

- Enhabce [Input component](https://github.com/jessy1092/react-semantify/blob/master/docs/Elements.md#input)
- Add State in Modules component.
  + Checkbox support: *disabled*, *readOnly*
  + Dimmer support: *disabled*, *active*
  + Dropdown support: *disabled*, *active*, *error*
  + Modal support: *active*
  + Progress support: *active*, *success*, *warning*, *error*, *disabled*
  + Search support: *loading*
  + Tab support: *active*, *loading*

## Version 0.1.2 - 2014/12/27

- Add `<Title>` component for Accordion.
- update checkbox: support `disabled`, `readOnly`, `init` property.
- update dimmer: support `disabled`, `active`, `init` property.

## Version 0.1.1 - 2014/12/25

- Support `init` property in all module components. let it initializes easily.
- Fix the bug: Accordion typo.

## Version 0.1.0 - 2014/12/22

- Add State attribute: Disabled, Focus, Active, Loading, Error, Completed.
- Below elements can support thease attributes.
  + Button: `active`, `disable`, `loading`
  + Header: `disable`
  + Icon: `disable`, `loading`
  + Image: `disable`
  + Input: `loading`, `focus`, `error`
  + Loader: `disable`
  + Reveal: `disable`
  + Segment: `disable`, `loading`
  + Step: `active`, `disable`, `completed`

## Version 0.0.8 - 2014/12/21

- Fix the bug: Assign React parameter type.

## Version 0.0.7 - 2014/12/20

- Pre-release Modules.
  - accordion, checkbox, dimmer, dropbown, modal, popup, progress, rating, search, shape, sidebar, sticky, tab.

## Version 0.0.6 - 2014/12/19

- Fix Table bug: use `<table>` tag.
- Add Docs: Table, Message, Menu, Grid, Collections.

## Version 0.0.5 - 2014/12/14

- Fix Segment bug: Add color attribute.
- Fix Image bug: Use `<img>` instead of `<div>`
- Add Elements Docs.

## Version 0.0.4 - 2014/12/12

- Support react-semantify.min.js. You can [download js file](https://github.com/jessy1092/react-semantify/releases/)
- More clearly example on browser in README.

## Version 0.0.3 - 2014/12/12

- Can use with npm install. `npm install react-semantify`
- build browser version. You can [download js file](https://github.com/jessy1092/react-semantify/releases/download/v0.0.3/react-semantify.js) in this release.

## Version 0.0.1 - 2014/12/11

- init
- Add support components.
  + Elements
    - Button
    - Divider
    - Flag
    - Header
    - Icon
    - Image
    - Input
    - Label
    - List
    - Loader
    - Rail
    - Reveal
    - Segment
    - Step
  + Collections
    - Breadcrumb
    - Form
    - Grid
    - Comment
    - Feed
    - Item
    - Statistic
  + Modules
    - Dimmer
    - Dropdown
