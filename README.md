# JS.scala

JS.scala compiles JavaScript code to Scala, allowing you to write your web application entirely in JavaScript!

*Input*

    const a = 42
    const b = "Hello, World"
    const sq = x => x * x
    const dsq = x => {
      const dx = sq(x)
      return dx * dx
    };
    const d = dsq(a)

    const exclaimer = {
      apply: name => name + "!"
    }

    exclaimer.apply("Hello, World")

*Output*

    val a = 42
    val b = "Hello, World"
    def sq (x:HandHolder) = x * x
    def dsq (x:HandHolder) = {
      val dx = sq(x)
      dx * dx
    }
    val d = dsq(a)
    object exclaimer {
      def apply (name:HandHolder) = name + "!"
    }

    exclaimer("Hello, World")


## Types

Next step is to add Flow type inference (https://github.com/facebook/flow) types to AST to restrict the expressive power of JavaScript, but export valid Scala. For now it just replaces types with a "HandHolder" place holder.
