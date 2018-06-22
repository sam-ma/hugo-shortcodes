# hugo-shortcodes
Custom shortcodes for Hugo

## 1. Kotlin - for [kotlin playground](https://jetbrains.github.io/kotlin-playground/examples/)

### Set up
1. copy `layouts/shortcodes/kotlin.html` to `[your hugo site home]/layouts/shortcodes/kotlin.html`
2. copy `[your hugo site home]/themes/[the theme you choose]/layouts/partials/head.html` to `[your hugo site home]/layouts/partials/header.html`
3. add the followings into the `<head>` section
```html
<script src="https://unpkg.com/kotlin-playground@1" data-selector=".kotlin-code"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/github.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/kotlin.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script>
```

### Examples (live demo https://www.shenyan.me/kotlin/hugo-kotlin-example/)

1. Basic example
```kotlin
{{< kotlin >}}
class Contact(val id: Int, var email: String) 

fun main(args: Array<String>) {
    val contact = Contact(1, "mary@gmail.com")
    println(contact.id)                   
}
{{< /kotlin >}}
```
![Kotlin test 1](/img/kotlinTest1.png "Kotlin test 1")

2. example using `theme` and `highlight-only`
```kotlin
{{< kotlin theme="idea" highlight-only="true" >}}
fun main(args: Array<String>) {
    println("Hello World!")
}
{{< /kotlin >}}
```
![Kotlin test 2](/img/kotlinTest2.png "Kotlin test 2")

3. example using `darcula` theme
```kotlin
{{< kotlin theme="darcula" highlight-only="true" >}}
fun main(args: Array<String>) {
    println("Hello World!")
}
{{< /kotlin >}}
```
![Kotlin test 3](/img/kotlinTest3.png "Kotlin test 3")

4. example using `platform`
```kotlin
{{< kotlin platform="js" >}}
fun sum(a: Int, b: Int): Int {
    return a + b
}

fun main(args: Array<String>) {
    print(sum(-1, 8))
}
{{< /kotlin >}}
```
![Kotlin test 4](/img/kotlinTest4.png "Kotlin test 4")

5. example using `junit` platform
```kotlin
{{< kotlin platform="junit" >}}
import org.junit.Test
import org.junit.Assert

class TestExtensionFunctions() {
    @Test fun testIntExtension() {
        Assert.assertEquals("Rational number creation error: ", RationalNumber(4, 1), 4.r())
    }

    @Test fun testPairExtension() {
        Assert.assertEquals("Rational number creation error: ", RationalNumber(2, 3), Pair(2, 3).r())
    }
}
//sampleStart
/*
Then implement extension functions Int.r() and Pair.r() and make them convert Int and Pair to RationalNumber.
*/
fun Int.r(): RationalNumber = RationalNumber(this, 2)
fun Pair<Int, Int>.r(): RationalNumber = RationalNumber(first, second)

data class RationalNumber(val numerator: Int, val denominator: Int)
//sampleEnd
{{< /kotlin >}}
```
![Kotlin test 5](/img/kotlinTest5.png "Kotlin test 5")

6. example using `folded-button`
```kotlin
{{< kotlin platform="junit" folded-button="false" >}}
import org.junit.Test
import org.junit.Assert

class TestContainsFunctions() {
    @Test fun contains() {
        Assert.assertTrue(containsEven(listOf(1, 2, 3, 4)));
    }
    @Test fun notContains() {
        Assert.assertFalse(containsEven(listOf(1, 3, 5)));
    }
}
//sampleStart
/*
Pass a lambda to any function to check if the collection contains an even number.
The function any gets a predicate as an argument and returns true if there is at least one element satisfying the predicate.
*/
fun containsEven(collection: Collection<Int>): Boolean = collection.any {[mark]TODO()[/mark]}
//sampleEnd
{{< /kotlin >}}
```
![Kotlin test 6](/img/kotlinTest6.png "Kotlin test 6")

7. example using `canvas` platform
```kotlin
{{< kotlin platform="canvas" >}}
package fancylines


import jquery.*
import org.w3c.dom.CanvasRenderingContext2D
import org.w3c.dom.HTMLCanvasElement
import kotlin.browser.document
import kotlin.browser.window
import kotlin.js.Math



val canvas = initalizeCanvas()
fun initalizeCanvas(): HTMLCanvasElement {
    val canvas = document.createElement("canvas") as HTMLCanvasElement
    val context = canvas.getContext("2d") as CanvasRenderingContext2D
    context.canvas.width  = window.innerWidth.toInt();
    context.canvas.height = window.innerHeight.toInt();
    document.body!!.appendChild(canvas)
    return canvas
}

class FancyLines() {
    val context = canvas.getContext("2d") as CanvasRenderingContext2D
    val height = canvas.height
    val width = canvas.width
    var x = width * Math.random()
    var y = height * Math.random()
    var hue = 0;

    fun line() {
        context.save();

        context.beginPath();

        context.lineWidth = 20.0 * Math.random();
        context.moveTo(x, y);

        x = width * Math.random();
        y = height * Math.random();

        context.bezierCurveTo(width * Math.random(), height * Math.random(),
                width * Math.random(), height * Math.random(), x, y);

        hue += (Math.random() * 10).toInt();

        context.strokeStyle = "hsl($hue, 50%, 50%)";

        context.shadowColor = "white";
        context.shadowBlur = 10.0;

        context.stroke();

        context.restore();
    }

    fun blank() {
        context.fillStyle = "rgba(255,255,1,0.1)";
        context.fillRect(0.0, 0.0, width.toDouble(), height.toDouble());
    }

    fun run() {
        window.setInterval({ line() }, 40);
        window.setInterval({ blank() }, 100);
    }
}
//sampleStart
fun main(args: Array<String>) {
    FancyLines().run()
}
//sampleEnd
{{< /kotlin >}}
```
![Kotlin test 7](/img/kotlinTest7.png "Kotlin test 7")