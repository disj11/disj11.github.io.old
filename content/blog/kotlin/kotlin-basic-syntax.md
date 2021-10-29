---
title: 코틀린 기본 문법
date: 2021-10-29 21:35:47
category: kotlin
draft: false
---

## 개요

예제를 통하여 코틀린의 [기본 문법](https://kotlinlang.org/docs/basic-syntax.html)을 알아보자.

## 패키지 정의 및 가져오기

패키지는 소스 파일의 최상단에 선언하여야 한다.

```kotlin
package my.demo

import kotlin.text.*

// ...
```

디렉토리와 패키지는 일치시키지 않아도 상관없다.

[Packages](https://kotlinlang.org/docs/packages.html) 참조

## 프로그램 시작점

코틀린 어플리케이션의 시작점은 `main` 함수이다.

```kotlin
fun main() {
    println("Hello world!")
}
```

`main` 함수는 `String` 매개변수를 받을 수 있다.

```kotlin
fun main(args: Array<String>) {
    println(args.contentToString())
}
```

## 표준 출력

`print` 는 입력 받은 매개변수를 표준 출력한다.

```kotlin
print("Hello ")
print("world!")
```

```
// output
Hello world!
```

`println`는 입력 받은 매개변수를 표준 출력하고 줄 바꿈을 추가한다. 

```kotlin
println("Hello")
println("world!")
```

 ```
 // output
 Hello
 world!
 ```

## Functions

두 개의 `Int` 파라미터와 `Int` 리턴 타입을 같는 함수:

```kotlin
fun sum(a: Int, b: Int): Int {
    return a + b
}
```

함수의 본문은 표현식을 사용하여 작성할 수 있다. 리턴 타입은 타입 추론된다.

```kotlin
fun sum(a: Int, b: Int) = a + b
```

값을 반환하지 않는 함수:

```kotlin
fun printSum(a: Int, b: Int): Unit {
    println("sum of $a and $b is ${a + b}")
}
```

`Unit` 리턴 타입은 생략할 수 있다.

```kotlin
fun printSum(a: Int, b: Int) {
    println("sum of $a and $b is ${a + b}")
}
```

[Functions](https://kotlinlang.org/docs/functions.html) 참조

## 변수

읽기 전용 지역변수는 `val` 키워드를 사용하여 정의하며, 값의 할당은 한번만 가능하다.

```kotlin
val a: Int = 1 // 선언 시 초기값 할당
val a = 2 // `Int` 타입이 추론 됨
val c: Int // 선언 시 초기값을 할당하지 않는 경우는 `Type`을 명시해야 함
c = 3 // 지연된 할당
```

값을 재할당 하고 싶다면 `var` 키워드를 사용한다.

```kotlin
var x = 5 // `Int` 타입이 추론 됨
x += 1
```

상위 레벨에서 변수 선언이 가능하다.

```kotlin
val PI = 3.14
var x = 0

fun incrementX() {
    x += 1
}
```

[Properties](https://kotlinlang.org/docs/properties.html) 참조

## 클래스와 인스턴스의 생성

클래스의 정의에는 `class` 키워드를 사용한다.

```kotlin
class Shape
```

클래스의 속성은 클래스 선언부나 본문에 나열할 수 있다.

```kotlin
class Rectangle(var height: Double, var length: Double) {
    var perimeter = (height + length) * 2
}
```

클래스 선언부에 나열되어 있는 속성이 있다면, 기본 생성자로 사용된다. 

```kotlin
val rectangle = Rectangle(5.0, 2.0)
println("The perimeter is ${rectangle.perimeter}")
```

클래스의 상속은 `:` 를 사용한다. 클래스는 기본적으로 상속 불가능한 `final` 이므로 상속 가능하게 만들기 위해서는 `open` 을 사용한다.

```kotlin
open class Shape

class Rectangle(var height: Double, var length: Double): Shape() {
    var perimeter = (height + length) * 2
}
```

[classes](https://kotlinlang.org/docs/classes.html) 와 [objects and instances](https://kotlinlang.org/docs/object-declarations.html) 참조

## 주석

코틀린은 한 줄 주석과 여러 줄 주석이 가능하다.

```kotlin
// 한 줄 주석 사용

/* 여러 줄 주석 사용
   여러 줄 주석 사용 */
```

여러 줄 주석은 중첩하여 사용할 수 있다.

```kotlin
/* 여러 줄 주석 시작
/* 중첩 된 주석 *⁠/
여러 줄 주석 끝 */
```

문서화를 위한 주석 구문은 [Documenting Kotlin Code](https://kotlinlang.org/docs/kotlin-doc.html) 참조

## 문자열 템플릿

```kotlin
var a = 1
// simple name in template:
val s1 = "a is $a" 

a = 2
// arbitrary expression in template:
val s2 = "${s1.replace("is", "was")}, but now is $a"
```

```
// output
a was 1, but now is 2
```

자세한 내용은 [String templates](https://kotlinlang.org/docs/basic-types.html#string-templates) 참조

## 조건식

```kotlin
fun maxOf(a: Int, b: Int): Int {
    if (a > b) {
      return a
    } else {
      return b
    }
}
```

코틀린에서는 `if` 를 표현식으로 사용할 수 있다.

```kotlin
fun maxOf(a: Int, b: Int) = if (a > b) a else b
```

[`if` -expressions](https://kotlinlang.org/docs/control-flow.html#if-expression) 참조

## for loop

```kotlin
val items = listOf("apple", "banana", "kiwifruit")
for (item in items) {
    println(item)
}
```

또는

```kotlin
val items = listOf("apple", "banana", "kiwifruit")
for (index in items.indices) {
    println("item at $index is ${items[index]}")
}
```

[for loop](https://kotlinlang.org/docs/control-flow.html#for-loops) 참조

## while loop

```kotlin
val items = listOf("apple", "banana", "kiwifruit")
var index = 0
while (index < items.size) {
    println("item at $index is ${items[index]}")
    index++
}
```

[while loop](https://kotlinlang.org/docs/control-flow.html#while-loops) 참조

## when expression

 ```kotlin
 fun describe(obj: Any): String =
     when (obj) {
         1          -> "One"
         "Hello"    -> "Greeting"
         is Long    -> "Long"
         !is String -> "Not a string"
         else       -> "Unknown"
     }
 ```

[when expression](https://kotlinlang.org/docs/control-flow.html#when-expression) 참조

## Range

`in` 연산자를 사용하여 숫자가 범위 내에 있는지 확인할 수 있다.

```kotlin
val x = 10
val y = 9
if (x in 1...y+1) {
    prinln("fits in range")
}
```

숫자가 범위를 벗어났는지 확인:

```kotlin
val list = listOf("a", "b", "c")

if (-1 !in 0..list.lastIndex) {
    println("-1 is out of range")
}
if (list.size !in list.indices) {
    println("list size is out of valid list indices range, too")
}
```

범위를 반복:

```kotlin
for (x in 1..5) {
    print(x)
}
```

`step` 을 사용하여 증가 값을 변경:

```kotlin
for (x in 1..10 step 2) {
    println(x)
}
```

```
// output
1
3
5
7
9
```

[Ranges and progressions](https://kotlinlang.org/docs/ranges.html) 참조

## Collections

컬렉션을 반복한다.

```kotlin
for (item in items) {
    println(item)
}
```

컬렉션 안에 객체가 포함되어 있는지 확인하려면 `in` 을 사용한다.

```kotlin
when {
    "orange" in items -> println("juicy")
    "apple" in items -> println("apple is find too")
}
```

람다식을 사용하여 컬렉션 `filter` 와 `map` 사용:

```kotlin
val fruits = listOf("banana", "avocado", "apple", "kiwifruit")
fruits
    .filter { it.startsWith("a") }
    .sortedBy { it }
    .map { it.uppercase() }
    .forEach { println(it) }
```

```
// output
APPLE
AVOCADO
```

[Collections overview](https://kotlinlang.org/docs/collections-overview.html) 참조

## null 허용 값과 null 체크

`null` 값이 허용된다면 명시적으로 이름 뒤에 `?` 를 붙여야 한다.

```kotlin
fun parseInt(str: String): Int? {
    // ...
}
```

리턴 값으로 `null` 을 허용 함수의 사용:

```kotlin
fun printProduct(arg1: String, arg2: String) {
    val x = parseInt(arg1)
    val y = parseInt(arg2)

    // `x * y`를 사용하면 null 값이 포함되어 있을수도 있으므로 오류가 발생한다.
    if (x != null && y != null) {
        // null 체크 이후에는 자동으로 non-nullable로 캐스팅되어 사용 가능하다.
        println(x * y)
    }
    else {
        println("'$arg1' or '$arg2' is not a number")
    }    
} 
```

또는

```kotlin
// ...
if (x == null) {
    println("Wrong number format in arg1: '$arg1'")
    return
}
if (y == null) {
    println("Wrong number format in arg2: '$arg2'")
    return
}

// null 체크 이후에는 자동으로 non-nullable로 캐스팅되어 사용 가능하다.
println(x * y)
```

[Null-safety](https://kotlinlang.org/docs/null-safety.html) 참조

## 타입 검사와 자동 캐스팅

`is` 연산자는 타입을 확인하는데 사용한다. 불변인 로컬 변수 또는 속성이 타입이 특정 타입이 맞다고 확인된 경우, 명시적으로 캐스팅 할 필요가 없다.

```kotlin
fun getStringLength(obj: Any): Int? {
    if (obj is String) {
        // `obj`는 `String` 타입으로 자동 캐스팅 된다.
        return obj.length
    }
    
    return null
}
```

또는

```kotlin
fun getStringLength(obj: Any): Int? {
    if (obj !is String) return null

    // `obj`는 `String` 타입으로 자동 캐스팅 된다.
    return obj.length
}
```

또는

```kotlin
fun getStringLength(obj: Any): Int? {
    // `obj`는 `&&` 우측에서 `String` 타입으로 자동 캐스팅 된다.
    if (obj is String && obj.length > 0) {
        return obj.length
    }

    return null
}
```

[Classes](https://kotlinlang.org/docs/classes.html) 와 [Type casts](https://kotlinlang.org/docs/typecasts.html) 참조







