---
title: 코틀린 관용구 (Idioms)
date: 2021-10-29 22:00:11
category: kotlin
draft: false
---

## 개요

코틀린에서 자주 사용하는 [관용구](https://kotlinlang.org/docs/idioms.html)를 알아보자.

## DTO 생성 (POJOs/POCOs)

```kotlin
data class Customer(val name: String, val email: String)
```

`Customer` 클래스는 다음 기능을 제공한다.

* 모든 프로퍼티의 getter와 setter (setter는 `var` 인 경우만 제공 )
* `equals()`
* `hashCode()`
* `toString()`
* `copy()`
* 모든 프로퍼티의 `component1()`, `component2()`, ..., 제공  ([Data classes 참조](https://kotlinlang.org/docs/data-classes.html))

## 함수 매개변수의 기본값

```kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```

## 리스트 필터

```kotlin
val positives = list.filter { x -> x > 0 }
```

또는 짧은 버전으로:

```kotlin
val posistives = list.filter { it > 0 }
```

[Java와 Kotlin 필터링](https://kotlinlang.org/docs/java-to-kotlin-idioms-strings.html#create-a-string-from-collection-items)의 차이점

## 컬렉션 안의 요소 확인

```kotlin
if ("john@example.com" in emailsList) { ... }

if ("jane@example.com" !in emailsList) { ... }
```

## 문자열 보간 (String interpolation﻿)

```kotlin
println("Name $name")
```

[Java와 Kotlin의 문자열 연결](https://kotlinlang.org/docs/java-to-kotlin-idioms-strings.html#concatenate-strings)의 차이

## 인스턴스 체크

```kotlin
when (x) {
    is Foo -> ...
    is Bar -> ...
    else   -> ...
}
```

## 읽기 전용 리스트

```kotlin
val list = listOf("a", "b", "c")
```

## 읽기 전용 맵

```kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)
```

## 맵 엔트리에 접근

```kotlin
println(map["key"])
map["key"] = value
```

## 맵 또는 리스트 순회

```kotlin
for ((k, v) in map) {
    println("$k -> $v")
}
```

## 범위 반복

```kotlin
for (i in 1..100) { ... }  // closed range: 100을 포함
for (i in 1 until 100) { ... } // half-open range: 100을 포함하지 않음
for (x in 2..10 step 2) { ... }
for (x in 10 downTo 1) { ... }
if (x in 1..10) { ... }
```

## Lazy property

```kotlin
val p: String by lazy {
    // compute the string
}
```

## 확장 함수 (Extension functions)

```kotlin
fun String.spaceToCamelCase() { ... }

"Convert this to camelcase".spaceToCamelCase()
```

## 싱글톤 생성

```kotlin
object Resource {
    val name = "Name"
}
```

## 추상 클래스 인스턴스화

```kotlin
abstract class MyAbstractClass {
    abstract fun doSomething()
    abstract fun sleep()
}

fun main() {
    val myObject = object : MyAbstractClass() {
        override fun doSomething() {
            // ...
        }
        
        override fun sleep() {
            // ...
        }
    }
    
    myObject.doSomething()
}
```

## If-not-null shorthand

```kotlin
val files = File("Test").listFiles()

println(files?.size) // files가 null이 아닌 경우 size를 출력
```

## If-not-null-else shorthand

```kotlin
val files = File("Test").listFiles()

println(files?.size ?: "empty") // files가 null이라면 "empty"가 출력된다.
```

## null인 경우 실행

```kotlin
val values = ...
val email = values["email"] ?: throw IllegalStateException("Email is missing!")
```

## 비어 있을 가능성이 있는 컬렉션에서 첫 번째 아이템 가져오기

```kotlin
val emails = ... // 비어 있을 수도 있는 컬렉션
val mainEmail = emails.firstOrNull() ?: ""
```

## null이 아닌 경우 실행

```kotlin
val value = ...

value?.let {
    ... // 이 블록은 null이 아닌 경우 실행된다.
}
```

## null이 아닌 경우 nullable 값으로 변환

```kotlin
val value = ...

val mapped = value?.let { tansformValue(it) } ?: defaultValue
// value 또는 transform 한 값이 null 이라면 defaultValue가 반환된다.
```

## when을 사용하여 반환

```kotlin
fun transform(color: String): Int {
    return when (color) {
        "Red" -> 0
        "Green" -> 1
        "Blue" -> 2
        else -> throw IllegalArgumentException("Invalid color param value")
    }
}
```

## try-catch 표현식

```kotlin
fun test() {
    val result = try {
        count()
    } catch (e: ArithmeticException) {
        throw IllegalStateException(e)
    }
    
    // result 값 사용
}
```

## if 표현식

```kotlin
fun foo(param: Int) {
    val result = if (param == 1) {
        "one"
    } else if (param == 2) {
        "two"
    } else {
        "three"
    }
}
```

## Unit을 반환하는 메서드의 Builder-style 사용법

```kotlin
fun arrayOfMinusOnes(size: Int): IntArray {
    return IntArray(size).apply { fill(-1) }
}
```

## 단일 표현식 함수 (Single-expression functions)

```kotlin
fun theAnswer() = 42
```

이는 다음과 같다.

```kotlin
fun theAnswer(): Int {
    return 42
}
```

단일 표현식 함수를 다른 관용구와 결합하여 코드를 단축 시킬 수 있다. 예를 들어 `when` 표현식과 함께 사용한다면:

```kotlin
fun transform(color: String): Int = when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
}
```

## 객체 인스턴스의 여러 메서드 호출 (with)

```kotlin
class Turtle {
    fun penDown()
    fun penUp()
    fun turn(degrees: Double)
    fun forward(pixels: Double)
}

val myTurtle = Turtle()
with(myTurtle) { // 가로 세로 100px의 정사각형을 그린다.
    penDown()
    for (i in 1..4) {
        forward(100.0)
        turn(90.0)
    }
    penUp()
}
```

## 객체의 속성 구성 (apply)

```kotlin
val myRectangle = Rectangle().apply {
    length = 4
    breadth = 5
    color = 0xFAFAFA
}
```

이 방법은 생성자가 없는 속성을 정의하는데 유용하다.

## Java 7의 try-with-resources

```kotlin
val stream = Files.newInputStream(Paths.get("/some/file.txt"))
stream.buffered().reader().use { reader ->
    println(reader.readText())
}
```

## 제네릭 타입 정보가 필요한 제네릭 함수

```kotlin
//  public final class Gson {
//     ...
//     public <T> T fromJson(JsonElement json, Class<T> classOfT) throws JsonSyntaxException {
//     ...

inline fun <reified T: Any> Gson.fromJson(json: JsonElement): T = this.fromJson(json, T::class.java)

```

## Nullable Boolean

```kotlin
val b: Boolean? = ...
if (b == true) {
    ...
} else {
    // `b` 는 false 이거나 null
}
```

## 두 변수 swap

```kotlin
var a = 1
var b = 2
a = b.also { b = a }
```

## 완성되지 않은 코드 마킹 (TODO)

코틀린의 standard library 는 항상 `NotImplementedError` 를 던지는 `TODO()` 함수를 내장하고 있다. 이 함수의 리턴 타입은 `Nothing` 이므로 타입과 상관 없이 사용할 수 있다.

```kotlin
fun calcTaxes(): BigDecimal = TODO("Waiting for feedback from accounting")
```