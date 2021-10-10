---
title: 프록시 2 - 다이내믹 프록시와 팩토리 빈
date: 2021-09-27 23:44:94
category: toby-spring
draft: false
---

## 개요

이번 포스트에서는 [이전 포스트](/toby-spring/proxy-1-proxy-and-pattern)에서 다뤘던 프록시의 문제를 해결하기 위한 다이내믹 프록시에 대해서 알아보고, 다이내믹 프록시를 적용하여 기존 코드의 문제를 해결해보자.

## 리플렉션

다이내믹 프록시를 이해하려면 우선 리플렉션에 대해 알아야한다. 리플렉션은 자바의 코드 자체를 추상화해서 접근할 수 있도록 만든 것이며, 이를 쉽게 사용하도록 `java.lang.reflect` 패키지를 제공한다. 이 패키지의 클래스들을 이용하면, 인터페이스를 구현해서 클래스를 새로 정의하지 않고도 프록시를 손쉽게 만들 수 있다. 다이내믹 프록시도 리플렉션 기능을 이용하여 프록시를 만들어준다.

이해를 돕기 위해 리플렉션 API 중 `Method` 라는 인터페이스를 이용해 메서드를 호출하는 방법을 알아보자. 자바에는 `클래스이름.class` 또는 오브젝트의 `getClass()` 메서드를 이용하여 `Class` 타입 오브젝트를 가져올 수 있다. 이 클래스 오브젝트를 이용하면 클래스 코드에 대한 메타정보를 가져오거나 오브젝트를 조작할 수 있다. 예를들어 다음과 같은 기능을 행할 수 있다.

1. 클래스의 이름
2. 어떤 클래스를 상속하는지
3. 어떤 인터페이스를 구현했는지
4. 어떤 필드를 갖고 있는지, 그 필드의 타입은 무엇인지
5. 메서드는 어떤 것을 정의했고, 파라미터와 리턴 타입은 무엇인지
6. 오브젝트의 필드 값 수정
7. 원하는 파라미터 값을 이용해 메서드 호출

`Method` 도 `Class` 에서 가져올 수 있다. 다음 코드는 `String` 의 `length` 메서드 정보를 가져온다.

```java
Method lengthMethod = String.class.getMethod("length");
```

가져온 메서드를 실행하고 싶다면 `invoke` 메서드를 사용한다.

```java
String name = "Spring";
Method lengthMethod = String.class.getMethod("length");
int length = lengthodMethod.invoke(name);
```

## 다이내믹 프록시

다이내믹 프록시는 프록시 팩토리에 의해 런타임 시 다이내믹하게 만들어지는 오브젝트이며, 타깃의 인터페이스와 같은 타입으로 만들어진다. 다음 그림은 다이내믹 프록시가 동작하는 방식이다.

![다이내믹 프록시 동작 방식](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/cd1d5e91-9143-4f90-96d1-f6a1ed79242f/Untitled.png)

다이내믹 프록시를 사용하려면, 그림에서 보는 것과 같이 다이내믹 프록시로부터 메소드 호출 정보를 받아서 처리하는 `InvocationHandler` 의 구현체를 만들어야 한다. 다이내믹 프록시는 모든 요청을 `InvocationHandler` 의 `incoke()` 메소드로 보내주기 때문에 아무리 메서드가 많더라도 `invoke()` 메서드 하나로 처리할 수 있다.

![InvocationHandler를 통한 요청 처리 구조](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bd3ff6bd-bf62-4ed9-9cff-518b39eb4f28/Untitled.png)

이제 다이내믹 프록시를 적용해보자.

### 기존 코드

기존 코드는 다음과 같으며, 이 코드의 문제점은 [이전 포스트](/spring/proxy-and-pattern/#프록시의-문제점)에서 설명하였다. 이 코드에 다이내믹 프록시를 적용해 볼 것이다.

```java
public interface UserService {
	void upgradeLevels();
}
```

```java
public class UserServiceImpl implements UserService {
	@Override
	public void upgradeLevels() {
		TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition()); // 트랜잭션 시작
		List<User> users = userDao.findAll();
		for (User user : users) {
			user.upgradeLevel();
			userDao.update(user);
		}
	}
}
```

```java
public class UserServiceTx implements UserService {
	UserService userService;
	PlatformTransactionManager transactionManager = new DataSourceTransactionManager(dataSource);

	public void setTransactionManager(PlanformTransactionManager transactionManager) {
		this.trasactionManager = transactionManager;
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	public void upgradeLevels() {
		TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition()); // 트랜잭션 시작
		try {
			userService.upgradeLevels();
			transactionManager.commit(status);
		} catch (RunctimeException e) {
			transactionManager.rollback(status);
			throw e;
		}
	}
}
```

### 다이내믹 프록시 적용

`InvocationHandler` 인터페이스를 구현하여 트랜잭션 부가기능을 가진 핸들러를 만들어보자.

<div id="transaction-handler">

```java
public class TransactionHandler implements InvocationHandler {
	private PlatformTransactionManager transactionManager;
	private Object target; // 부가기능을 제공할 타깃
	private String pattern; // 트랜잭션을 적용할 메소드 이름 패턴

	public void setTarget(Object target) {
		this.target = target;
	}

	public void setTransactionManager(PlatformTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}

	@Override
	public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
		if (method.getName().startsWith(pattern)) {
			return invokeInTransaction(method, args);
		} else {
			return method.invoke(target, args);
		}
	}

	public Object invokeInTransaction(Method method, Object[] args) throws Throwable {
		TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());
		try {
			Object ret = method.invoke(target, args);
			this.transactionManager.commit();
			return ret;
		} catch (InvocationTargetException e) {
			transactionManager.rollback(status);
			throw e.getTargetException();
		}
	}
}
```

</div>

요청을 위임할 `target` 과 어떤 메서드에 부가 기능을 적용할 지 설정할 수 있는 `pattern` 을 제공받도록 하였다. `Method.invoke()` 를 이용해 타깃 오브젝트의 메서드를 호출할 때는 타깃 오브젝트에서 발생하는 예외가 `InvocationTargetException` 으로 포장되어 전달되기때문에 `getTargetException()` 메서드로 중첩되어있는 예외를 가져오도록 하였다.

만들어본 코드는 이전 포스트에서 만들었던 [UserServiceTx](https://www.notion.so/1-0fddedcaaaf344f482835cab17388afb)와 같은 기능을 하지만, `UserService` 뿐만 아니라 트랜잭션이 필요한 모든 오브젝트에 적용할 수 있다. 만들어진 `TransactionHandler` 를 사용하는 방법은 다음과 같다.

```java
TransactionHandler txHandler = new TransactionHandler();
txHandler.setTarget(userService);
txHandler.setTransactionManager(transactionManager);
txHandler.setPattern("upgradeLevels");

UserService txUserService = (UserService) Proxy.newProxyInstance(
	getClass().getClassLoader(),
	new Class[]{UserService.class},
	txHandler
);
txUserService.upgradeLevels();
```

### 다이내믹 프록시의 문제점

다이내믹 프록시를 적용하여 기존 코드의 문제점을 해결했지만, 다른 문제가 발생하였다. 다이내믹 프록시 오브젝트를 일반적인 스프링의 빈으로 등록할 수 없다는 것이다. 스프링은 빈 정의에 나오는 클래스의 이름을 가지고 다음과 같은 리플렉션 API를 통해 빈 오브젝트를 생성한다.

```java
Date now = (Date) Class.forName("java.util.Date").newInstance(); 
```

하지만 다이내믹 프록시 오브젝트의 클래스는 어떤 것인지 알 수가 없다. 따라서 프록시 오브젝트의 클래스 정보를 미리 알아내서 스프링 빈에 정의할 방법이 없으며, 오직 `Proxy` 클래스의 `newInstance()` 메서드를 통해서만 만들 수 있다. 그렇다면 다이내믹 프록시 오브젝트를 빈으로 등록할 수 있는 방법은 정말 없는 걸까?

### 팩토리 빈

이 문제는 팩토리 빈을 통하여 해결할 수 있다. 팩토리 빈은 오브젝트의 생성 로직을 담당하는 역할을 한다. 팩토리 빈을 만드는 가장 간단한 방법은 `FactoryBean` 인터페이스를 구현하는 것이며, 이렇게 구현한 클래스를 빈으로 등록하면 **팩토리 빈 내부에서 생성하는 오브젝트가 빈 오브젝트로 사용**된다. 팩토리 빈은 다음과 같은 세 가지 메서드로 구성되어있다.

```java
package org.springframework.beans.factory;

public interface FactoryBean<T> {
	T getObject() throw Exception; // Spring 컨테이너에서 사용할 객체
	Class<? extends T> getObjectType(); // FactoryBean이 생성하는 객체의 타입 유형
	boolean isSingleton(); // getObject()로 생성된객체가 싱글톤인지 여부
}
```

다음은 팩토리 빈을 구현한 클래스이다.

<div id="tx-proxy-factory-bean">

```java
public class TxProxyFactoryBean implements FactoryBean<Object> {
	Object target;
	PlatformTransactionManager transactionManager;
	String pattern;
	Class<?> serviceInterface;

	// setter 생략

	@Override
	public Object getObject() throws Exception {
		TransactionHandler txHandler = new TransactionHandler();
		txHandler.setTarget(target);
		txHandler.setTransactionManager(transactionManager);
		txHandler.setPattern(pattern);
		
		return Proxy.newProxyInstance(
			getClass().getClassLoader(),
			new Class[]{serviceInterface},
			txHandler
		);
	}

	@Override
	public Class<?> getObjectType() {
		return serviceInterface;
	}

	@Override
	public boolean isSingleton() {
		return false; // 싱글톤 빈이 아니라는 뜻이 아니라 getObject()가 매번 같은 오브젝트를 리턴해주지 않는다는 의미
	}
}
```

</div>

빈으로 등록시 사용할 설정 값은 다음과 같다.

```xml
<bean id="userService" class="springbook.user.service.TxProxyFactoryBean">
	<property name="target" ref="userServiceImpl"/>
	<property name="transactionManager" ref="transactionManager"/>
	<property name="pattern" value="upgradeLevels"/>
	<property name="serviceInterface" value="springbook.user.service.UserService"/>
</bean>
```

`target` 과 `transactionManager` 프로퍼티는 다른 빈을 가리키는 것이므로 ref 애트리뷰트로 설정하였고, `pattern` 은 단순 문자열이니 value 값으로 설정하였다. `serviceInterface` 는 Class 타입이지만 스프링에서 setter를 확인하여 자동 변환시켜주므로 value 값으로 설정한다.

만약 자바 기반으로 설정을 구성하고 싶다면 XML 기반의 구성과는 약간 다르게 `getObject()` 메서드를 명시적으로 호출해야한다.

```java
@Configuration
public class FacotryBeanAppConfig {
	@Bean(name = "userServiceFactory")
	public TxProxyFactoryBean txProxyFactoryBean() {
		TxProxyFactoryBean factory = new TxProxyFactoryBean();
		factory.setTarget(...);
		factory.setTransactionManager(...);
		factory.setPattern(...);
		factory.setServiceInterface(...);
		return factory;
	}

	@Bean
	public UserService userService() throws Exception {
		return txProxyFactoryBean.getObject();
	}
}
```

빈으로 등록을 완료했다면 다음과 같이 사용할 수 있다.

```java
public class FactoryBeanTest {
	@Autowired
	private UserService userService;

	@Resource(name = "&userService")
	TxProxyFactoryBean txProxyFactoryBean;
}
```

앞서 설명한대로 팩토리 빈 자체가 아닌 FactoryBean에 의해 생성된 오브젝트가 빈 오브젝트로 사용되므로 `@Autowired` 를 통해 `UserService` 를 DI 받을 수 있다.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c63ff751-22dc-47a3-ace9-bd46222e6be5/Untitled.png)

만약 팩토리 빈 자체를 사용하고 싶다면 빈 이름 앞에 `&` 를 붙이기만 하면 된다.

이제 다른 서비스에서도 트랜잭션 기능을 사용하고 싶다면 타깃 오브젝트에 맞는 프로퍼티 정보를 설정하여 빈으로 등록해주기만 하면 된다.

## 프록시 팩토리 빈 방식의 장점

프록시 팩토리 빈 방식의 장점은 이전 포스트에서 알아봤던 문제점을 해결할 수 있다는 것이다. 문제점으로는 다음과 같은 것들이 있었다.

1. 프록시를 적용할 대상이 구현하고 있는 인터페이스를 구현하는 프록시 클래스를 일일이 만들어야 한다.
2. 부가적인 기능이 여러 메소드에 반복적으로 나타나게되어 중복 코드가 발생한다.

다이내믹 프록시를 이용하여 이 두가지 문제점을 해결할 수 있음을 살펴보았다. 여기에 팩토리 빈까지 사용하여 번거로운 다이내믹 프록시 생성 코드도 제거할 수 있었으며, DI 설정만으로 다양한 타깃 오브젝트에 적용이 가능하게 만들었다.

하지만 프록시 팩토리 빈 방식의 한계점도 존재한다.

## 프록시 팩토리 빈 방식의 한계

지금 만들어본 프록시 팩토리는 타깃 정보를 갖고 있다. 이러한 구조상의 문제로 여러 개의 클래스의 메서드에 부가기능을 적용하고 싶다면, 거의 비슷한 프록시 팩토리 빈의 설정이 중복되는 것을 막을 수 없다. 만약 타깃이 같다고 하더라도 여러 개의 부가기능을 적용하고 싶다고 하면 비슷한 문제가 발생한다. 또 다른 문제로 `TransactionHandler` 의 오브젝트가 프록시 팩토리 빈의 개수만큼 만들어진다는 것이다. `TransactionHandler` 가 타깃의 정보를 갖고 있기 때문에 발생하는 문제이다.

[다음 포스트](/toby-spring/proxy-3-proxy-factory-bean)에서는 이런 한계를 해결하기 위한 방법을 알아보자.