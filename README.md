## The Thymol engine for Pattern Lab / Node

To install the Thymol engine in your edition, `npm install patternengine-node-thymol` should do the trick.

Partial calls and lineage hunting are supported. Thymol does not support the mustache-specific syntax extensions, style modifiers and pattern parameters, because their use cases are addressed by the core Thymol feature set.
Thymeleafs th:include is also not possible, use th:replace instead.

**Note**: You _cannot_ use `th:replace` with other attributes on a tag. `th:replace` gets interpreted and string-replaced by the patternengine, even before thymol has the chance to parse it. One workaround for this is by wrapping it with a `<th:block>`.
