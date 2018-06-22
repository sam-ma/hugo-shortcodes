---
title: "Kotlin Test"
date: 2018-06-22T20:41:35+10:00
draft: true
---

{{< kotlin >}}
class Contact(val id: Int, var email: String) 

fun main(args: Array<String>) {
    val contact = Contact(1, "mary@gmail.com")
    println(contact.id)                   
}
{{< /kotlin >}}

{{< kotlin theme="idea" highlight-only="true" >}}
fun main(args: Array<String>) {
    println("Hello World!")
}
{{< /kotlin >}}

{{< kotlin theme="darcula" highlight-only="true" >}}
fun main(args: Array<String>) {
    println("Hello World!")
}
{{< /kotlin >}}

{{< kotlin platform="js" >}}
fun sum(a: Int, b: Int): Int {
    return a + b
}

fun main(args: Array<String>) {
    print(sum(-1, 8))
}
{{< /kotlin >}}

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

{{< kotlin theme="darcula">}}
//sampleStart
fun sum(a: Int, b: Int): Int {
    return a + b
}
//sampleEnd

fun main(args: Array<String>) {
    print(sum(-1, 8))
}
{{< /kotlin >}}