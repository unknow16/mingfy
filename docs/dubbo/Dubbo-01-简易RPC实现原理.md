---
title: Dubbo-01-简易RPC实现原理
date: 2018-02-24 16:54:33
tags: Dubbo
---

* 这个简单的例子的实现思路是使用阻塞的socket IO流来进行server和client的通信，也就是rpc应用中服务提供方和服务消费方。并且是端对端的，用端口号来直接进行通信。方法的远程调用使用的是jdk的动态代理，参数的序列化也是使用的最简单的objectStream。

* 真实的rpc框架会对上面的实现方式进行替换，采用更快更稳定，更高可用易扩展，更适宜分布式场景的中间件，技术来替换。例如使用netty的nio特性达到非阻塞的通信，使用zookeeper统一管理服务注册与发现，解决了端对端不灵活的劣势。代理方式有cglib字节码技术。序列化方式有hession2，fastjson等等。不过梁飞大大的博客使用原生的jdk api就展现给各位读者一个生动形象的rpc demo，实在是强。rpc框架解决的不仅仅是技术层面的实现，还考虑到了rpc调用中的诸多问题，重试机制，超时配置…这些就需要去了解成熟的rpc框架是如果考虑这些问题的了。

> 致敬梁飞大大

## 核心框架类
```
package com.fuyi;

import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.net.ServerSocket;
import java.net.Socket;

/**
 * RpcFramework
 *
 * @author william.liangf
 */
public class RpcFramework {
    /**
     * 暴露服务
     *
     * @param service 服务实现
     * @param port 服务端口
     * @throws Exception
     */
    public static void export(final Object service, int port) throws Exception {
        if (service == null)
            throw new IllegalArgumentException("service instance == null");
        if (port <= 0 || port > 65535)
            throw new IllegalArgumentException("Invalid port " + port);
        System.out.println("Export service " + service.getClass().getName() + " on port " + port);


        ServerSocket server = new ServerSocket(port);
        for(;;) {
            try {
                final Socket socket = server.accept();
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            try {
                                ObjectInputStream input = new ObjectInputStream(socket.getInputStream());
                                try {
                                    String methodName = input.readUTF();
                                    Class<?>[] parameterTypes = (Class<?>[])input.readObject();
                                    Object[] arguments = (Object[])input.readObject();
                                    ObjectOutputStream output = new ObjectOutputStream(socket.getOutputStream());
                                    try {
                                        Method method = service.getClass().getMethod(methodName, parameterTypes);
                                        Object result = method.invoke(service, arguments);
                                        output.writeObject(result);
                                    } catch (Throwable t) {
                                        output.writeObject(t);
                                    } finally {
                                        output.close();
                                    }
                                } finally {
                                    input.close();
                                }
                            } finally {
                                socket.close();
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }).start();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    /**
     * 引用服务
     *
     * @param <T> 接口泛型
     * @param interfaceClass 接口类型
     * @param host 服务器主机名
     * @param port 服务器端口
     * @return 远程服务
     * @throws Exception
     */
    @SuppressWarnings("unchecked")
    public static <T> T refer(final Class<T> interfaceClass, final String host, final int port) throws Exception {
        if (interfaceClass == null)
            throw new IllegalArgumentException("Interface class == null");
        if (! interfaceClass.isInterface())
            throw new IllegalArgumentException("The " + interfaceClass.getName() + " must be interface class!");
        if (host == null || host.length() == 0)
            throw new IllegalArgumentException("Host == null!");
        if (port <= 0 || port > 65535)
            throw new IllegalArgumentException("Invalid port " + port);
        System.out.println("Get remote service " + interfaceClass.getName() + " from server " + host + ":" + port);


        return (T) Proxy.newProxyInstance(interfaceClass.getClassLoader(), new Class<?>[] {interfaceClass}, new InvocationHandler() {
            public Object invoke(Object proxy, Method method, Object[] arguments) throws Throwable {
                Socket socket = new Socket(host, port);
                try {
                    ObjectOutputStream output = new ObjectOutputStream(socket.getOutputStream());
                    try {
                        output.writeUTF(method.getName());
                        output.writeObject(method.getParameterTypes());
                        output.writeObject(arguments);
                        ObjectInputStream input = new ObjectInputStream(socket.getInputStream());
                        try {
                            Object result = input.readObject();
                            if (result instanceof Throwable) {
                                throw (Throwable) result;
                            }
                            return result;
                        } finally {
                            input.close();
                        }
                    } finally {
                        output.close();
                    }
                } finally {
                    socket.close();
                }
            }
        });
    }
}
```

### 定义接口

```
package com.fuyi;

public interface HelloService {

    String hello(String name);
}
```

### 服务接口实现

```
package com.fuyi.provider;

import com.fuyi.HelloService;

public class HelloServiceImpl implements HelloService {

    @Override
    public String hello(String name) {
        return "hello " + name;
    }
}
```

### 暴露服务

```
package com.fuyi.provider;

import com.fuyi.RpcFramework;

public class RpcProvider {

    public static void main(String[] args) throws Exception {
        HelloServiceImpl helloService = new HelloServiceImpl();
        RpcFramework.export(helloService, 1234);
    }
}
```

### 引用服务

```
package com.fuyi.consumer;

import com.fuyi.HelloService;
import com.fuyi.RpcFramework;

public class RpcConsumer {

    public static void main(String[] args) throws Exception {
        HelloService helloService = RpcFramework.refer(HelloService.class, "127.0.0.1", 1234);

        for (int i=0; i<6; i++) {
            String hello = helloService.hello("world" + i);
            System.out.println(hello);
            Thread.sleep(1000);
        }
    }
}
```

