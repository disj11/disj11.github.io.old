---
title: int 상수 대신 열거 타입을 사용하라
date: 2021-10-25 11:10:19
category: effective-java
draft: false
---

자바에서 열거 타입을 지원하기 전에는 아래와 같이 정수 상수를 선언해 사용했었다.

## 정수 열거 패턴

```java
public static final int APPLE_FUJI = 0;
public static final int APPLE_PIPPIN = 1;
public static final int APPLE_GRANNY_SMITH = 2;

public static final int ORANGE_NAVEL = 0;
public static final int ORANGE_TEMPLE = 1;
public static final int ORANGE_BLOOD = 2;
```

이 같은 정수 열거 패턴은 단점이 많다.

1. 타입 안전을 보장할 방법이 없으며 표현력도 좋지 않다.
2.  `APPLE_FUJI == ORANGE_NAVEL` 처럼 동등 연산자로 비교하더라도 `true` 값이 나온다.
3. 문자열로 출력하기가 어렵기 때문에 디버깅이 어렵다.
4. 열거 그룹 안에 있는 모든 상수를 순회할 방법도 없으며, 총 몇 개의 상수가 정의되어 있는지 알 수도 없다.

정수 대신 문자열을 사용하는 패턴도 있지만, 이 패턴도 단점이 많다.

1. 문자열 상수 대신 문자열 값을 그대로 사용하는 실수를 할 수 있다.
2. 문자열 값에 오타가 있다고 해도 컴파일러는 확인할 길이 없어 런타임 시 버그가 발생할 수 있다.

이러한 단점을 해결할 수 있는 것이 열거 타입이다.

## 열거 타입

```java
public enum Apple { FUJI, PIPPIN, GRANNY_SMITH }
public enum Orange { NAVEL, TEMPLE, BLOOD }
```

열거 타입은 외부에서 접근할 수 있는 생성자를 제공하지 않으므로 사실상 final이며, 인스턴스 역시 단 하나만 존재함이 보장된다. 열거 타입의 장점은 다음과 같다.

1. 컴파일타임 타입 안전성을 제공한다.
2. 열거 타입의 `toString` 메서드는 적절한 문자열을 보여준다.
3. 자신 안에 정의된 상수 값을 배열로 반환해주는 정적 메서드인 `values()` 를 제공한다.

보는 것과 같이 열거 타입은 정수 열거 패턴의 단점을 해소해준다. 추가적으로 열거 타입에는 임의의 메서드나 필드를 추가할 수도 있다. 예를 들어, 과일의 색을 알려주는 메서드, 과일의 이미지를 반환하는 메서드 등을 추가할 수 있을 것이다. 한걸음 더 나아가, 상수마다 동작이 달라져야 하는 경우도 열거 타입을 통해 제공할 수 있다.

## 예제 - 사칙 연산 계산기

사칙연산을 제공하는 계산기를 만들어보고, 이를 개선해보자.

### 개선전 (switch문 사용)

```java
public enum Operation {
	PLUS, MINUS, TIMES, DIVIDE;

	public double apply(double x, double y) {
		switch(this) {
			case PLUS: return x + y;
			case MINUS: return x - y;
			case TIMES: return x * y;
			case DIVIDE: return x / y;
		}
		throw new AssertionError("알 수 없는 연산: " + this);
	}
}
```

위 코드는 동작은 하겠지만 좋지만은 않은 코드이다. `throw` 문은 실제로 도달할 일이 없지만 기술적은로는 도달할 수 있기 때문에 생략하면 컴파일조차 되지 않는다. 또 새로운 연산자가 추가될 경우 해당 case문도 추가해야 한다. 혹시라도 잊게 된다면 런타임 시 `AssertionError` 가 발생할 것이다.

### 개선 후 (상수별 메서드 구현)

```java
public enum Operation {
	PLUS {public double apply(double x, double y){return x + y;}},
	MINUS {public double apply(double x, double y){return x - y;}},
	TIMES {public double apply(double x, double y){return x * y;}},
	DIVIDE {public double apply(double x, double y){return x / y;}};

	public abstract double apply(double x, double y);
}
```

이처럼 변경된 코드는 새로운 연산자가 추가되더라도 apply 메서드 작성을 잊을 가능성을 낮춰준다. 실수로 잊었다 하더라도 컴파일 오류가 발생하여 메서드 작성을 잊었다고 알려줄 것이다.

## 예제 - 일당 계산기

직원의 기본 임금과 일한 시간을 받아 일당을 계산해주는 계산기를 만들고 개선해보자. 추가적인 조건으로 주중에 오버타임이 발생하면 잔업수당이 주어지고, 주말에는 무조건 잔업수당이 주어진다고 하자. 이를 열거 타입으로 만들면 아래와 같다.

### 개선 전 (switch문 사용)

```java
enum PayrollDay {
	MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY;

	private static final int MINS_PER_SHIFT = 8 * 60;

	int pay(int minutesWorked, int payRate) {
		int basePay = minutesWorked * payRate;
		int overtimePay;

		switch(this) {
			case SATURDAY:
			case SUNDAY:
				overtimePay = basePay / 2;
				break;
			default:
				overtimePay = minutesWorked <= MINS_PER_SHIFT ?
					0 : (minutesWorked - MINS_PER_SHIFT) * payRate / 2;
		}

		return basePay + overtimePay;
	}
}
```

이 코드는 간결하지만, 관리 관점에서는 위험하다. 휴가와 같은 새로운 값을 열거 타입에 추가할 경우 그 값을 처리하는 case문을 잊지 않고 넣어줘야한다. 그렇지 않으면 휴가 기간에 일해도 평일과 같은 임금을 받게 된다. 이를 개선해보자.

### 개선 후 (전략 열거 타입 패턴)

```java
enum PayrollDay {
	MONDAY(WEEKDAY), TUESDAY(WEEKDAY), WEDNESDAY(WEEKDAY), THURSDAY(WEEKKDAY),
	FRIDAY(WEEKDAY), SATURDAY(WEEKEND), SUNDAY(WEEKEND),

	private final PayType payType;

	PayrollDay(PayType payType) {
		this.payType = payType;
	}

	int pay(int minutesWorked, int payRate) {
		return payType.pay(minutesWorked, payRate);
	}

	// 전략 열거 타입
	enum PayType {
		WEEKDAY {
			int overtimePay(int minsworked, int payRate) {
				return minsWorked <= MINS_PER_SHIFT ? 0 : (minsWorked - MINS_PER_SHIFT) * payRate / 2
			}
		},
		WEEKEND {
			int overtimePay(int minsworked, int payRate) {
				return minsWorked * payRate / 2;
			}
		};

		abstract int overtimePay(int mins, int payRate);
		private static final int MINS_PER_SHIFT = 8 * 60;

		int pay(int minsWorked, int payRate) {
			int basePay = minsWorked * payRate;
			return basePay + overtimePay(minsWorked, payRate);
		}
	}
}
```

개선된 코드에서는 새로운 상수를 추가할 때 잔업수당 '전략'을 선택하도록 하였다. 이 패턴을 사용하면 switch 문이나 상수별 메서드 구현이 필요 없게 된다. switch 문을 사용한 것보다 복잡하지만 더 안전하고 유연하다.

하지만 추가하려는 메서드가 의미상 열거 타입과 연관이 없거나, 기존 열거 타입에 상수별 동작을 혼합해 넣을 때는 switch 문이 좋은 선택이 될 수 있다. 예를 들어 서드파티에서 가져온 Operation 열거타입이 있다고 가정하고, 각 연산의 반대 연산을 변환하는 메서드가 필요하다면 다음과 같이 작성 할 수 있다.

```jsx
public static Operation inverse(Operation op) {
	switch(op) {
		case PLUS: return Operation.MINUS;
		case MINUS: return Operation.PLUS;
		case TIMES: return Opertaion.DIVIDE;
		case DEVIDE: return Operation.TIMES;
		default: throw new AssertionError("알 수 없는 연산: " + op);
	}
}
```

열거 타입에 포함할만큼 유용하지는 않은 경우도 마찬가지로 switch를 활용할 수 있다.

## 팁

열거 타입에서 `toString` 메서드를 재정의하였다면, `toString` 이 반환하는 문자열을 열거 타입 상수로 변환해주는 `fromString` 메서드를 제공할 것을 고려해보자.

```java
private static final Map<String, Operation> stringToEnum =
	Stream.of(values()).collect(toMap(Object::toString, e -> e));

public static Optional<Operation> fromString(String symbol) {
	return Optional.ofNullable(stringToEnum.get(symbol));
}
```

## 정리

필요한 원소를 컴파일타임에 다 알 수 있는 상수 집합이라면 항상 열거 타입을 사용하자. 열거 타입은 나중에 상수가 추가돼도 바이너리 수준에서 호환되도록 설계되었다. 하나의 메서드가 상수별로 다르게 동작해야한다면 switch 문 대신 상수별 메서드 구현을 사용하자. 열거 타임 상수 일부가 같은 동작을 공유한다면 전략 열거 타입 패턴을 사용하자.