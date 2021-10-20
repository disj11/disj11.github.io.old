---
title: ITEM 31. 한정적 와일드카드를 사용해 API 유연성을 높여라
date: 2021-10-20 20:30:02
category: effective-java
draft: false
---

## 개요

[ITEM 28](/effective-java/item-28-prefer-lists-to-arrays)에서 이야기 했듯 `List<String>`과 같은 매개변수화(parameterized) 타입은 불공변이다. `List<String>`은 `List<Object>`의 하위 타입이 아니며, `List<Object>`는 `List<String>`의 상위 타입이 아니라는 것이다. 하지만 때로는 불공변 방식보다 유연한 무언가가 필요할 때가 있다. 예시 코드를 살펴보며 유연한 API를 만들 수 있는 방법을 알아보자.

## 예시

다음과 같은 `Stack` 클래스가 있다고 하자.

```java
public class Stack<E> {
    public void push(E e);
    public E pop();
    public boolean isEmpty();
    
    public void pushAll(Collection<E> src) {
        for (E e : src) {
            push(e);
        }
    }
}
```

클라이언트에서 다음과 같이 `pushAll` 메서드를 사용하였다.

```java
Stack<Number> numberStack = new Stack<>();
List<Integer> integers = Arrays.asList(1, 2, 3);
numberStack.pushAll(integers); // Error
```

언뜻 보이기에는 이상이 없어 보이지만 `numberStack.pushAll(integers);` 구문에서 컴파일 오류가 발생한다. `Integer`는 `Number`는 하위 타입이지만 `List<Integer>`는 `List<Number>`의 하위 타입이 아니기 때문이다. 앞에서 말한 것처럼 매개변수화 타입이 불공변이기 때문에 나타나는 문제이다. 자바에서는 이런 상황에 대처할 수 있는 한정적 와일드카드 타입이라는 특별한 매개변수화 타입을 제공한다. 다음 코드는 `pushAll` 메서드에 한정적 와일드카드 타입을 적용한 코드이다.

```java
public void pushAll(Collection<? extends E> src) {
    for (E e : src) {
        push(e);
    }
}
```

코드를 변경하고 나면 오류 없이 말끔히 컴파일 된다. 여기서 사용한 `Collection<? extends E>`가 한정적 와일드카드를 사용한 것이며, 'E의 하위 타입의 Collection' 이라는 의미이다. (하위 타입이란 자기 자신도 포함된다.)

이번에는 `Stack` 클래스에 `popAll` 메서드를 추가해보자.

```java
public void popAll(Collection<E> dst) {
    while (!isEmpty()) {
        dst.add(pop());
    }
}
```

현재 `Stack`에 있는 원소를 `dst`로 옮겨주는 메서드이다. 정상적으로 작동하는지 확인해보자.

```java
Stack<Number> numberStack = new Stack<>();
Collection<Object> objects = new ArrayList<>();
numberStack.popAll(objects); // Error
```

한정적 와일드카드 타입을 사용하기 전의 `pushAll` 메서드 처럼 `numberStack.popAll(objects);` 구문에서 컴파일 오류가 발생한다. 여기에도 와일드카드 타입을 사용하도록 변경해보자.

```java
public void popAll(Collection<? super E> dst) {
    while (!isEmpty()) {
        dst.add(pop());
    }
}
```

변경 후에는 오류가 없어진다. 여기서 사용한 `Collection<? super E>`는 'E의 상위 타입의 Collection' 이어야 한다는 의미이다. (모든 타입은 자기 자신의 상위 타입이다.)

## 팁

언제 어떤 와일드카드 타입을 사용해야 할지 헷갈린다면 다음 공식을 기억하면 좋다.

> 펙스 (PECS): producer-extends, consumer-super

이 공식은 매개변수화 타입 `T`가 생산자라면 `<? extends T>`, 소비자라면 `<? super T>`를 사용하라는 의미이다. 앞의 예시에서 살펴본 `pushAll` 메서드의 매개변수는 `Stack`이 사용할 `E`를 생산하므로 생산자로 볼 수 있다. 반면에, `popAll` 메서드는 `Stack`의 `E`를 소비하므로 소비자라고 볼 수 있다. 

## 정리

예시로 알 수 있는 바는 명확하다. 유연성을 극대화 하기 위해서는 생산자나 소비자용 매개변수에 와일드카드 타입을 사용하라는 것이다. 만약, 매개변수가 생산자와 소비자 역할을 동시에 한다면 와일드카드 타입을 사용해도 좋을 게 없다.