---
title: 불변 객체와 참조 투명성
date: 2021-10-14 20:10:64
category: java
draft: false
---

## 개요

불변 객체와 참조 투명성에 대하여 알아보고, 예제를 통하여 불변 객체가 갖는 장점을 알아보자.

## 참조 투명성 (Referential transparency)

'참조 투명성'은 함수가 함수 외부의 영향을 받지 않는 것을 의미한다. 이렇게 외부의 영향을 받지 않는 코드를 가리켜 "참조에 투명 하다." 라고 할 수 있다.

## 불변 객체 (Immutable object)

객체 지향 프로그램에서 말하는 '불변 객체'란 생성 후 상태를 바꿀 수 없는 객체를 말한다. 불변 객체는 참조에 투명하므로 스레드에 안전한 특징을 갖는다. 반대의 개념으로는 가변(mutable) 객체가 있으며, 가변 객체는 생성 후에도 상태를 변경할 수 있다.

## 예제

예제를 통해 불변 객체가 같는 장점을 살펴보자.

### 가변 객체 사용

먼저 다음과 같은 `Money` 클래스가 존재한다.

```java
public class Money {
	private int value;

	public Money(int value) {
		this.value = value;
	}

	public int getValue() {
		return this.value;
	}

	public void setValue(int value) {
		this.value = value;
	}
}
```

이 코드는 `setValue` 라는 상태를 변경할 수 있는 세터가 존재하므로 가변 객체이다. 가변 객체는 불변 객체와 다르게 참조 투명성 문제가 발생할 수 있다. 문제가 발생하는 상황을 살펴보자. 먼저 다음과 같은 주문 항목을 표현하는 클래스가 있다.

```java
public class OrderLine {
	public OrderLine(Product product, Money price, int quantity) {
		this.price = price;
		this.quantity = quantity;
		this.amounts = price.value * quantity;
	}
}
```

이 코드를 사용하는 클라이언트에서 다음과 같은 코드를 작성하였다.

```java
Money price = new Money(1000);
OrderLine line = new OrderLine(product, price, 2); // [1]
price.setValue(2000); // [2]

// [1]: [price=1000, quantity=2, amounts=2000]
// [2]: [price=2000, quantity=2, amounts=2000]
```

[1] 에서 `OrderLine` 을 생성하면 amounts 에는 2000 이라는 값이 들어갈 것이다. 아직까지는 문제가 보이지 않는다. 하지만 [2]에서 `Money` 의 값을 2000으로 수정하였다. 다시 한번 `OrderLine` 을 확인해보니 price=2000, quantity=2 인데 amounts 가 2000으로 문제가 발생한다. 이 문제를 고치기 위해서는 다음과 같은 코드가 필요하다.

```java
public class OrderLine {
	public OrderLine(Product product, Money price, int quantity) {
		this.price = new Money(price);
		this.quantity = quantity;
		this.amounts = price.value * quantity;
	}
}
```

생성자에서 `Money` 객체를 새로 생성하여 방어적인 코드를 작성하여 문제를 해결하였다. 물론 이런 식으로 해결 할 수도 있겠지만, 만약 `Money` 객체가 불변 객체였다면 어땠을까?

### 불변 객체

`Money` 객체를 불변 객체로 바꿔보자.

```java
public class Money {
	private int value;

	public Money(int value) {
		this.value = value;
	}

	public int getValue() {
		return this.value;
	}

	public Money add(Money money) {
		return new Money(this.value + money.getValue());
	}
}
```

setter 가 없어지고 대신 `add` 메서드가 추가되었다. `add` 메서드는 객체의 상태를 바꾸는 것이 아닌 새로운 객체를 생성하여 되돌려준다. 이제 `Money` 는 불변 객체가 되었으며, 상태를 바꿀 수 없으므로 참조 투명성 문제도 발생하지 않는다. 또, 단순히 "값을 설정한다" 라는 개념이 아닌 "돈을 더한다" 라는 개념이 더 명확하게 들어나게 되었다.

## 정리

불변 객체와 가변 객체의 예제를 만들어보며, 불변 객체가 갖는 장점을 알아보았다. 이펙티브 자바의 [ITEM 17](/effective-java/item-17-minimize-mutability)에서도 불변 객체의 장점을 설명하고 있다. 앞으로는 기계적으로 getter와 setter를 작성하지 말고, 필요하다면 불변 객체를 만들어 사용해보자.
