The Thymol engine for Pattern Lab / Node
========================================

This engine adds [Thymeleaf](http://www.thymeleaf.org/) support to the Node edition of Pattern Lab using [headissue/thymol-node](https://github.com/headissue/thymol-node).

Installing
----------

To install the Thymol engine in your edition, `npm install patternengine-node-thymol` should do the trick.

Supported features
------------------

-	[x] [Includes](http://patternlab.io/docs/pattern-including.html)
-	[x] Lineage
-	[x] [Hidden Patterns](http://patternlab.io/docs/pattern-hiding.html)
-	[x] [Pseudo-Patterns](http://patternlab.io/docs/pattern-pseudo-patterns.html)
-	[x] [Pattern States](http://patternlab.io/docs/pattern-states.html)
-	[ ] [Pattern Parameters](http://patternlab.io/docs/pattern-parameters.html) (Accomplished instead using native Thymeleaf features)
-	[ ] [Style Modifiers](http://patternlab.io/docs/pattern-stylemodifier.html) (Accomplished instead using native Thymeleaf features)

Partial calls and lineage hunting are supported. Thymol does not support the mustache-specific syntax extensions, style modifiers and pattern parameters, because their use cases are addressed by the core Thymol feature set. Thymeleafs th:include is also not possible, use th:replace instead.

**Note**: You *cannot* use `th:replace` with other attributes on a tag. `th:replace` gets interpreted and string-replaced by the patternengine, even before thymol has the chance to parse it. One workaround for this is by wrapping it with a `<th:block>`.
