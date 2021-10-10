---
title: 트랜잭션 어노테이션
date: 2021-10-08 21:10:03
category: toby-spring
draft: false
---

## 개요

포인트컷 표현식과 트랜잭션 속성을 이용하면 트랜잭션을 일괄적으로 적용할 수 있다. 하지만 클래스나 메소드에 따라 다른 트랜잭션 속성을 적용해야 하는 경우가 있다. 이런 세밀한 트랜잭션 속성의 제어가 필요한 경우를 위해 스프링에서는 `@Transactional` 을 제공한다.

## 트랜잭션 어노테이션

다음은 트랜잭션 어노테이션을 정의한 코드이다.

```java
package org.springframework.transaction.annotation;

import ...

@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
public @interface Transactional {
    @AliasFor("transactionManager")
    String value() default "";

    @AliasFor("value")
    String transactionManager() default "";

    Propagation propagation() default Propagation.REQUIRED;

    Isolation isolation() default Isolation.DEFAULT;

    int timeout() default -1;

    boolean readOnly() default false;

    Class<? extends Throwable>[] rollbackFor() default {};

    String[] rollbackForClassName() default {};

    Class<? extends Throwable>[] noRollbackFor() default {};

    String[] noRollbackForClassName() default {};
}
```

트랜잭션 어노테이션은 메소드, 클래스, 인터페이스에 적용할 수 있다. 각각의 트랜잭션 속성이 어떤 역할을 하는지 알고 싶다면 [트랜잭션 속성](https://www.notion.so/TransactionDefinition-75d9471e4e3246a4a68420056b6524d6) 포스트를 참고한다.

## 대체 정책

스프링은 `@Transactional` 을 적용할 때 4 단계의 대체(fallback) 정책을 이용하게 해준다. 대체 정책이란 타깃 메서드 → 타깃 클래스 → 선언 메서드 → 선언 타입(클래스, 인터페이스) 의 순서에 따라 `@Transactional` 이 적용되었는지 차례로 확인하고, 가장 먼저 발견되는 숙성 정보를 사용하게 하는 방법이다. 다음의 예를 살펴 보자.

```java
// [1]
public interface Service {
	// [2]
	void method();
}

// [3]
public class ServiceImpl {
	// [4]
	public void method() {}
}
```

`@Transactional` 어노테이션은 [1], [2], [3], [4] 에 존재할 수 있다. 앞서 설명한대로 [4] → [3] → [2] → [1] 의 순서대로 어노테이션을 찾으며, 가장 먼저 발견된 어노테이션의 속성을 적용한다. 만약 `ServiceImpl` 에 메서드가 여러 개이고 모두 같은 트랜잭션 속성을 사용한다면, [3]에 어노테이션을 추가하는 식으로 사용한다. 특정 메서드만 다른 속성을 부여하고 싶다면 해당 메소드에 추가로 `@Transactional` 을 부여해주면 된다. 다음 코드는 트랜잭션 어노테이션을 적절히 사용한 예시이다.

```java
@Transactional
public interface UserService {
	void add(User user);
	void delete(String id);
	void update(User user);
	
  @Transactional(readOnly = true)
	User get(String id);

	@Transactional(readOnly = true)
	List<User> getAll();
}
```

## 트랜잭션 어노테이션 사용을 위한 설정

`@Transactional` 을 사용하는데 필요한 설정은 매우 간단하다. 다음과 같은 태그 한 줄이면 충분하다.

```xml
<tx:annotation-driven/>
```

만약 자바 기반 설정을 사용하고 싶다면 다음과 같이 설정을 추가한다.

```java
@Configuration
@EnableTransactionManagement
public class DataConfig {
	// ...
}
```

## 선언적 트랜잭션

`@Transactional` 과 같이 AOP를 이용해 코드 외부에서 트랜잭션의 기능을 부여해주고 속성을 지정 할 수 있게 하는 방법을 **선언적 트랜잭션**(declarative transaction)이라고 한다. 반대로 `TransactionTemplate` 나 개별 데이터 기술의 트랜잭션 API를 사용해 직접 코드 안에서 사용하는 방법을 **프로그램에 의한 트랜잭션**(programmatic transaction)이라고 한다. 스프링은 두 방식 모두를 지원하지만 특별한 경우가 아니라면 선언적 방식의 트랜잭션을 사용하는 것이 좋다.