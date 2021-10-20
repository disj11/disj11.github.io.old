---
title: ITEM 28. 배열보다는 리스트를 사용하라
date: 2021-10-20 19:30:14
category: effective-java
draft: false
---

## 배열과 제네릭의 차이

배열과 제네릭에는 중요한 두 가지 차이가 있다. 첫 번째 차이점은 배열은 **공변**(covariant)인 반면 제네릭은 **불공변**(invariant)라는 것이며, 두 번째 차이점은 배열은 **실체화**(reify)되지만 리스트는 그렇지 않다는 것이다.

### 공변과 불공변

공변은 `Sub`가 `Super`의 하위 타입이라면 배열 `Sub[]`는 배열 `Super[]`의 하위타입이 된다는 의미이다. 불공변이란 서로 다른 타입 `Type1`과 `Type2`가 있을 때, `List<Type1>`은 `List<Type2>`의 하위 타입도 아니고 상위 타입도 아니라는 의미이다. 다음의 예시를 살펴보자.

```java
Object[] objectArray = new Long[1];
```

`Long`는 `Object`의 하위타입이므로 배열에서는 위 문법이 허용된다. 하지만 다음과 같은 문법은 허용되지 않는다.

```java
List<Object> ol = new ArrayList<Long>();
```

언뜻 보면 리스트에 문제가 있어 보이지만, 사실 문제는 배열에 있다. 다음의 예를 살펴보자.

```java
Object[] objectArray = new Long[1];
objectArray[0] = "문자열을 넣는다."; // ArrayStoreException 발생
```

위 코드는 문법상 오류가 없기 때문에 컴파일이 정상적으로 되지만, 런타임 시 `ArrayStoreException`을 던진다. 반면에 리스트를 사용할 경우 앞에서 알아본 것 처럼 컴파일 시점에서 오류를 확인 할 수 있다.

### 실체화

실체화란 런타임 시점에도 자신이 담기로한 원소의 타입을 확인한다는 것이다. 이러한 특성으로 앞에서 살펴본 것 처럼 `Long` 배열에 `String` 원소를 넣으려고 하면 런타임 시점에 `ArrayStoreException`이 발생한다. 반면 제네릭은 컴파일 시에만 타입 검사를 하고, 런타임 시에는 타입이 소거된다. 이렇게 런타임에 컴파일타임보다 타입 정보를 적게 가지는 타입을 **실체화 불가 타입**(non-reifiable type) 이라고 한다. 실체화 불가 타입에는 `E`, `List<E>`, `List<String>` 등이 있다.

## 예제

다음과 같이 배열을 사용한 `Chooser` 클래스가 있다.

```java
public class Chooser {
    private final Object[] choiceArray;
    
    public Chooser(Collection choices) {
        choiceArray = choices.toArray();
    }
    
    public Object choose() {
        Random rnd = ThreadLocalRandom.current();
        return choiceArray[rnd.nextInt(choiceArray.length)];
    }
}
```

이 클래스를 사용하려면 `choose` 메서드를 호출할 때마다 반환된 `Object`를 원하는 타입으로 형변환 해야하는 불편함이 있다. 혹시나 타입이 다른 원소가 들어있다면, 런타임 시 형변환 오류가 날 가능성도 있다. 이 클래스를 제네릭으로 변경해보자.

```java
public class Chooser<T> {
    private final T[] choiceArray;
    
    public Chooser(Collection<T> choices) {
        choiceArray = choices.toArray();
    }

    public T choose() {
        Random rnd = ThreadLocalRandom.current();
        return choiceArray[rnd.nextInt(choiceArray.length)];
    }
}
```

이 클래스를 컴파일하면 `Object[]`를 `T[]`로 변환할 수 없다는 오류가 발생한다. 이는 Object 배열을 T 배열로 형변환하면 된다.

```java
choiceArray = (T[]) choices.toArray();
```

이렇게 변경하면 오류는 해결되지만, 경고가 발생한다. 이 형변환이 런타임에도 안전한지 보장할 수 없기 때문에 발생하는 경고이다. 코드를 작성자가 안전하다고 확신한다면 주석을 남기고 애너테이션을 달아 경고를 숨겨도 되지만, 경고의 원인을 제거하는 편이 훨씬 좋을 것이다. 다음처럼 코드를 변경해보자.

```java
public class Chooser<T> {
    private final List<T> choiceList;
    
    public Chooser(Collection<T> choices) {
        choicesList = new ArrayList<>(choices);
    }
    
    public T choose() {
        Random rnd = ThreadLocalRandom.current();
        return choiceList.get(rnd.nextInt(choiceList.size()));
    }
}
```

이 코드는 `Object[]`를 사용했을 때와는 다르게 `choose` 메서드 사용시 형변환 해야할 필요도 없으며, 이로 인해 런타임 시 발생할 수 있는 `ClassCastException`를 걱정할 필요가 없다.

## 정리

배열은 공변이고 실체화되는 반면에 제네릭은 불공변이고 타입 정보가 런타임시 소거된다. 이렇게 완전히 다른 규칙이 적용되므로 제네릭과 배열을 섞어 쓰기란 쉽지 않다. 만약 둘을 섞어 쓰다 컴파일 오류나 경고를 만난다면, 가장 먼저 배열을 리스트로 대체하는 방법을 적용해보자.