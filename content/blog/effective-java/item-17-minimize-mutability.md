---
title: ITEM 17. 변경 가능성을 최소화하라
date: 2021-10-18 20:10:62
category: effective-java
draft: false
---

## 불변 클래스

불변 클래스란 그 인스턴스 내부의 값을 수정할 수 없는 클래스를 말한다. 자바 플랫폼 라이브러리에도 String, 기본 타입의 박싱된 클래스들, BigInteger, BigDecimal이 불변 클래스에 속한다. **불변 클래스는 가변 클래스보다 설계하고 구현하고 사용하기 쉬우며, 오류가 생길 여지도 적고 훨씬 안전하다.**

클래스를 불변으로 만들기 위해서는 다섯 가지 규칙을 따르면 된다.

1. 객체의 상태를 변경하는 메서드를 제공하지 않는다.
2. 클래스를 확장할 수 없도록 한다.
3. 모든 필드를 final로 선언한다.
4. 모든 필드를 private로 선언한다.
5. 자신 외에는 내부의 가변 컴포넌트에 접근할 수 없도록 한다.

다음은 다섯 가지 규칙을 지킨 복소수를 표현하는 클래스이다.

```java
public **final** class Complex {
	**private final** double re;
	**private final** double im;

	public Complex(double re, double im) {
		this.re = re;
		this.im = im;
	}

	public double realPart() { return re; }
	public double imaginaryPart() { return im; }

	public Complex plus(Complex c) {
		return new Complex(re + c.re, im + c.im);
	}

	public Complex minus(Complex c) {
		return new Complex(re - c.re, im - c.im);
	}

	public Complex times(Complex c) {
		return new Complex(re * c.re - im * c.im, re * c.im + im * c.re);
	}

	public Complex dividedBy(Complex c) {
		double tmp = c.re * c.re + c.im * c.im;
		return new Complex((re * c.re + im * c.im) / tmp, (im * c.re - re * c.im) / tmp);
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) {
			return true;
		}
		if (!(o instanceof Complex)) {
			return false;
		}

		Complex c = (Complex) o;
		return Double.compare(c.re, re) == 0 && Double.compare(c.im, im) == 0;
	}

	@Override
	public int hashCode() {
		return 31 * Double.hashCode(re) + Double.hashCode(im);
	}

	@Override
	public String toString() {
		return "(" + re + " + " + im + "i)";
	}
}
```

사칙연산 메서드들이(plus, minus, times, dividedBy) 인스턴스 자신을 수정하지 않고 새로운 인스턴스를 만들어 반환하고 있다. 또한 메서드 이름으로 add와 같은 동사 대신 plus 같은 전치사를 사용하였다. 이는 해당 메서드가 객체의 값을 변경하지 않는다는 사실을 강조하려는 의도이다.

## 불변 클래스의 장점

**불변 객체는 단순하다.** 객체 생성 시점의 상태를 파괴될 때까지 그대로 보존한다. 또 불변 객체는 **스레드에 안전하여 따로 동기화할 필요가 없다.** 여러 스레드가 동시에 사용하여도 절대 훼손되지 않기 때문에 **안심하고 공유할 수 있다.** 따라서 불변 클래스라면 한번 만든 인스턴스를 최대한 재활용하기를 권한다. 위에서 만든 `Complex` 클래스는 다음과 같이 재사용 할 수 있다.

```java
public static final Complex ZERO = new Complex(0, 0);
public static final Complex ONE = new Complex(1, 0);
public static final Complex I = new Complex(0, 1);
```

불변 객체는 방어적 복사가 필요 없다. 아무리 복사해봐야 원본과 같기 때문에 복사 자체가 의미가 없다. 따라서 불변 클래스는 clone메서드나 복사 생성자를 제공하지 않는 것이 좋다.

**불변 객체끼리는 내부 데이터를 공유할 수 있다.** 한가지 예로 `BigInteger` 클래스는 값의 부호를 int 변수로, 크기(절댓값)를 int 배열로 따로 표현한다. BigInteger의 negate메서드는 크기가 같고 부호만 반대인 새로운 BigInteger를 생성하는데 이때의 크기는 원본 인스턴스가 가리키는 내부 배열을 그대로 사용한다.

또 **불변 객체는 그 자체로 실패 원자성을 제공한다.**

> **NOTE:** 실패 원자성이란 '메서드에서 예외가 발생한 후에도 그 객체는 여전히 (메서드 호출 전과 똑같은) 유효한 상태여야 한다'는 성질이다.
>

## 불변 클래스의 단점

불변 클래스도 단점은 있다. **값이 다르다면 반드시 독립된 객체로 만들어야 한다는 것이다.** 예를들어 백만 비트짜리 `BigInteger` 에서 비트 하나를 바꾼다면, 단지 하나의 비트를 바꾸기 위해 백만 비트짜리 새로운 인스턴스를 생성해야하며, BigInteger의 크기에 비례해 시간과 공간을 잡아먹을 것이다.

```java
BigInteger moby = ...;
moby = moby.flipBit(0);
```

반면에, `BigSet` 이라는 가변 클래스를 이용한다면 상수 시간 안에 원하는 비트 하나를 바꿀 수 있다.

```java
BigSet moby = ...;
moby.flip(0);
```

이러한 문제를 해결하기 위해서 가변 동반 클래스(companion class)를 사용할 수 있다. `BigInteger` 도 모듈러 지수같은 가변 동반 클래스를 package-private로 두고 있어, 각 단계마다 객체를 생성하지 않도록 하였다. 이처럼 클라이언트들이 원하는 복잡한 연산을 정확히 예측할 수 있다면 package-private의 가변 동반 클래스만으로 충분하지만, 그렇지 않다면 이 클래스를 public으로 제공해야 한다. 자바 플랫폼 라이브러리에서 이러한 클래스로는 `String`이 있으며, String의 가변 동반 클래스는 `StringBuilder` 이다.

## 상속을 막는 방법

상속을 막는 방법은 final 클래스로 선언하는 것이지만, 좀 더 유연한 방법이 있다. 모든 생성자를 private 혹은 package-private으로 만들고 public 정적 팩터리를 제공하는 방법이다.

```java
public **final** class Complex {
	**private final** double re;
	**private final** double im;

	**private** Complex(double re, double im) {
		this.re = re;
		this.im = im;
	}

	**public static Complex valueOf(double re, double im) {
		return new Complex(re, im);
	}**

	// ... 코드 생략
}
```

정적 팩터리 방식의 장점은 [ITEM1](/effective-java/item-1-consider-static-factory-method)에서 알아본 적이 있다.

## 정리

클래스는 꼭 필요한 경우가 아니라면 불변이어야 한다. 불변으로 만들 수 없다면 변경할 수 있는 부분을 최소한으로 줄이자. 다른 합당한 이유가 없다면 모든 필드는 private final이어야 한다. 생성자는 불변식 설정이 모두 완료된, 초기화가 완벽히 끝난 상태의 객체를 생성해야 한다.
