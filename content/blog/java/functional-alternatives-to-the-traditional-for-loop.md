---
title: 전통적인 for 루프 사용의 대안
date: 2021-11-02 17:11:59
category: java
draft: false
---

## 개요

Java 8 에서 복잡한 반복에 도움이 되는 강력한 새로운 메서드가 나왔다. 그럼에도 우리는 익숙한 전통적인 방식의 `for` 문을 사용한다. 이번 포스팅에서는 Java 8 에서 추가된 `IntStream` 의 메서드들과 Java 9 에서 추가된 `takeWhile`, `dropWhile` 에 대해서 알아본다.

## for 문과 range

다음은 전통적인 방식의 `for` 문을 사용한 예제이다.

```java
for (int i = 1; i < 4; i++) {
    System.out.print(i + "...");
}
```

간단한 작업을 위해 우리는 변수의 초기화, 범위 값의 제한, 증감 연산자를 사용하였다. 코드가 길지는 않지만 필요한 조건들이 많은 것을 볼 수 있다. Java 8 에서 도입된 `IntStream` 의 `range()` 메서드를 사용하여 이 코드를 바꾸면 다음과 같다.

```java
IntStream.range(1, 4).forEach(i -> System.out.print(i + "..."));
```

변수의 초기화를 강요하지도 않고, 자동으로 값이 증가하므로 증감연산자도 필요가 없다. 또 하나의 중요한 차이는 여기에서의 `i` 값은 람다식에 대한 매개변수이므로 각각의 반복에서 완전히 새로운 변수라는 것이다.

## Mutable vs parameters

전통적인 `for` 방식을 사용한 예제에서 변수 `i` 는 같은 변수의 값이 증가하는 것이고, `range` 예제에서의 `i` 는 반복마다 항상 새로운 변수이다. 작은 차이이지만, 이 차이가 중요할 때가 있다. 다음 예제를 살펴보자.

```java
ExecutorService executorService = Executors.newFixedThreadPool(10);
for (int i = 0; i < 5; i++) {
    int temp = i;

    executorService.submit(new Runnable() {
        public void run() {
            // 아래의 라인을 주석 해제하면 오류가 발생한다.
            // System.out.println("Running task " + i);
            // 내부 클래스에서 참조하는 로컬 변수는 반드시 `final` 이거나 `effectively final` 이어야 하기 때문이다.

            System.out.println("Running task " + temp);
        }
    });
}

executorService.shutdown();
```
주석에서 적어놨듯 `System.out.println("Running task " + i);` 의 주석을 해제하면 오류가 발생한다.

> effectively final 이란 final 로 선언되지는 않았지만, 변수의 값이 변경되지 않는 경우를 말한다.

이 문제를 해결하기 위해서는 위 코드의 `for` 에 보이는 `int temp = i;` 처럼 for 문 안에서 새로운 임시 변수를 선언해야 했다. 동일한 코드를 `range` 를 사용하여 작성해보자.

```java
ExecutorService executorService = Executors.newFixedThreadPool(10);

IntStream.range(0, 5).forEach(i -> executorService.submit(new Runnable() {
    public void run() {
        System.out.println("Running task " + i);
    }
}));

executorService.shutdown();
```

이렇게 변경된 코드에서의 `i` 는 이전 예제에서의 `temp` 와 같이 매 반복마다 새로운 변수이다. 어디에서도 값을 변경하지 않기 때문에 effectively final 이므로 오류없이 컴파일된다. 내부 인터페이스도 람다식을 사용하도록 바꾸면 아래와 같이 굉장히 간단해진다.

```java
IntStream.range(0, 5).forEach(i ->
        executorService.submit(() -> System.out.println("Running task " + i)));
```

## Closed ranges

`for` 문을 사용할 때 다음과 같이 범위의 마지막 값까지 사용하도록 할 수 있다.

```java
for (int i = 0; i <= 5; i++) {
    // ...
}
```

같은 동작을 위해 `IntSteram` 의 `rangeClosed` 메서드를 사용할 수 있다.

```java
IntStream.rangeClosed(0, 5)
```

## Skipping values

다음과 같이 값을 건너 뛰고 싶을 경우가 있다.

```java
int total = 0;
for (int i = 0; i <= 100; i+=3) {
    total += i
}
```

`IntStream` 의 `iterate` 메서드를 사용하여 같은 동작을 구현할 수 있다.

```java
InStream.iterate(1, e -> e + 3)
    .limit(34)
    .sum()
```

`iterate` 메서드의 첫 번째 매개변수에는 초기 값을, 두 번재 매개변수에는 람다 식을 사용하여 다음 값을 결정한다. `range` 나 `rangeClosed` 메서드와 달리 중단 값이 없기 때문에 `limit` 을 사용하여 값을 몇 번 반복할 지 제한해야 한다. 그런지 않으면 무한 루프가 일어나기 때문에 사용에 주의해야 한다.

또 한 가지 불편한 점이 있다. 1 ~ 100 까지 3 씩 증가한다면 총 34번의 반복이 필요(1, 4, 7... 100)하기 때문에 `limit` 에 34를 입력하였다. 하지만 증가하는 값을 바꾸고 1 ~ 100 사이 값을 유지하기 위해서는 그에 맞게 limit 값도 바꾸어야 하는 번거러움이 있다. 실수할 여지도 있기 때문에 좋지 않아 보인다. 이러한 문제를 해결할 수 있는 방법이 있다.

## takeWhile 메서드

Java 9 에서 등장한 `takeWhile` 은 조건이 만족한다면 값을 받아들인다.

```java
IntStream.iterate(1, e -> e + 3)
    .takeWhile(i -> i <= 100)
    .sum();
```

이 코드는 증가하는 값이 바뀌어도 `iterate` 의 람다 식만 바꾸면 된다. 반복 횟수를 계산하여 직접 명시해주지 않아도 되기 때문에 훨씬 쉽고 오류 발생의 여지도 적다.

비슷한 메서드로 `dropWhile` 도 있다. `dropWhile` 은 `takeWhile` 과는 반대로 조건이 만족한다면 값을 버린다.

```java
List<Integer> list = Stream.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
    .dropWhile(number -> number <= 5)
    .collect(Collectors.toList());
System.out.println(list); // [6, 7, 8, 9, 10]
```

두 메서드 사용시 주의사항은 조건이 만족하는 지점까지만 작동한다는 것이다. 글로 설명하면 와닿지 않으므로 다음 예제를 보자.

```java
Stream.of(1,2,3,4,5,6,7,8,9,10,9,8,7,6,5,4,3,2,1)
    .takeWhile(i -> i < 4 )
    .forEach(System.out::print);
```

이 코드의 출력은 `123321` 이 아니라 `123` 이다. `i` 값이 5가 되는 순간 조건에서 만족하지 않으므로 작동이 멈춘다.

## 역순으로 반복

역순으로 반복되는 `for` 문은 다음과 같다.

```java

for (int i = 7; i > 0; i--) {
    //
}
```

마찬가지로 같은 동작을 `iterate` 를 사용하여 구현한 코드이다.

```java
IntStream.iterate(7, e -> e - 1)
    .limit(7)
```

앞에서 알아본 것 처럼 `limit` 대신 `takeWhile` 이나 `dropWhile` 을 사용할 수도 있다.

## 결론

전통적인 `for` 방식은 강력하지만 지나치게 복잡하다. Java 8, 9 에서 추가된 `range`, `iterate`, `limit` 등을 사용하면 반복을 단순화 하는데 도움이 된다.

## 참조

(Functional alternatives to the traditional for loop)[https://developer.ibm.com/articles/j-java8idioms3/]
