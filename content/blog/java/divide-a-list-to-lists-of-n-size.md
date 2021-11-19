---
title: 리스트를 N 크기의 리스트로 나누기
date: 2021-11-19 11:11:81
category: java
draft: false
---

## 개요

리스트를 n 크기의 리스트로 나누는 방법을 알아보자. 예를 들어 7개의 요소가 있는 리스트를 크기 2의 리스트로 나눈 결과는 다음과 같다.

```
[1, 2, 3, 4, 5, 6, 7] -> [[1, 2], [3, 4], [5, 6], [7]]
```

이 포스트는에서는 for 루프를 사용하여 리스트를 나누는 방법과, Java 8 에서 도입된 Stream API 와 grouping collector 를 사용하여 리스트를 나누는 방법을 알아볼 것이다.

## for 루프 사용

가장 떠올리기 쉬운 방법은 `for` 루프를 사용하는 것이다. `for` 루프를 사용한 명령형 스타일의 코드는 다음과 같다.

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7);
int chunkSize = 3;
AtomicInteger counter = new AtomicInteger();

for (int number : numbers) {
    if (counter.getAndIncrement() % chunkSize == 0) {
        result.add(new ArrayList<>());
    }
    result.get(result.size() - 1).add(number);
}

System.out.println(result); // [[1, 2, 3], [4, 5, 6], [7]]
```

## Stream API + grouping collector 사용

Java 8 에서 도입된 Stream API 와 grouping collector 를 사용하면 더 간결한 코딩이 가능하다.

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7);
int chunkSize = 3;
AtomicInteger counter = new AtomicInteger();

Collection<List<Integer>> result = numbers.stream()
    .collect(Collectors.groupingBy(it -> counter.getAndIncrement() / chunkSize))
    .values();

System.out.println(result); // [[1, 2, 3], [4, 5, 6], [7]]
```

하나씩 의미를 알아보자. `Collectors.groupingBy()` 메서드는 `Function` 을 매개변수로 받아 그 결과를 key 로 하는 `Map` 을 만들어준다. 위 코드에서 `values()` 메서드를 호출하지 않은 모습은 다음과 같다.

```java
Map<Integer, List<Integer>> result = numbers.stream()
    .collect(Collectors.groupingBy(it -> counter.getAndIncrement() / chunkSize));
// {0=[1, 2, 3], 1=[4, 5, 6], 2=[7]}
```

이렇게 생성된 `Map` 의 `values()` 메서드를 호출하여 밸류만 뽑아내면 `[[1, 2, 3], [4, 5, 6], [7]]` 와 같은 `Collection` 이 되는 것이다. 만약 `Collection<List<T>>` 형태를 `List<List<T>>` 로 캐스팅 하고 싶다면 `ArrayList<T>` 의 생성자를 활용할 수 있다.

```java
List<List<Integer>> result = new ArraysList<>(numbers.stream()
    .collect(Collectors.groupingBy(it -> counter.getAndIncrement() / chunkSize))
    .values());
```

## 3rd party library

만약 리스트가 크고, 성능이 중요하다면 `AbstractList` 를 상속받아 로직을 직접 구현해야 할 수도 있다. 하지만 이미 좋은 라이브러리가 있기 때문에 특별한 문제가 없다면 이런 라이브러리를 사용하는 것이 좋다.

* Google Guava 의 `Lists.partition(List list, int size)` 메서드 [(docs)](https://guava.dev/releases/snapshot-jre/api/docs/com/google/common/collect/Lists.html#partition(java.util.List,int))
* Apache Commons Collections 의 `ListUtils.partition(List list, int size)` 메서드 [(docs)](https://commons.apache.org/proper/commons-collections/apidocs/org/apache/commons/collections4/ListUtils.html#partition-java.util.List-int-)

## 참조

[Divide a list to lists of n size in Java 8](https://e.printstacktrace.blog/divide-a-list-to-lists-of-n-size-in-Java-8/)
