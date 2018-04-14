## 短网址服务

## 总体完成需求如下：

基本需求：

1. 输入长连接，生成短连接。
2. 访问短连接，跳转长连接。
3. 支持访问计数。
4. 编写测试代码。

扩展：

1. 支持自定义短连接长度。
2. 支持自定义短连接。

### 一丶背景

​    短网址服务，是将长网址缩短到一个很短的网址，用户能够通过短网址进行访问，服务重定向到对应的长网址。通过对长网址的缩短，使用户能够更便于记忆与使用。

### 二丶功能设计

1. 输入长连接，可以生成短连接。

   （1） 用户自定义（指定短连接）。

   ​          a: 判断需要转换的长连接是否为合法地址。

   ​          b:  需要识别短连接是否已被使用，并给出相应提示。

   （2） 系统默认转化（指定短连接长度）。

   ​          a: 判断需要转换的长连接是否为合法地址。

   ​          b: 需要判断指定长度的短连接是否用完，若用尽，需提示。

   ​          c: 判断生成短连接是否被自定义占用，并做相应处理。

2. 访问短连接，跳转到长连接。

      （1） 需要识别短连接是否有对应长连接，没有则需返回404.

      （2）有对应长连接，则重定向过去。

3. 具有访问计数。

      （1）当有合法重定向时候，则计数该路径访问。

4. 具有测试代码。

      根据当前情况，测试力度在接口层面的逻辑测试，主要以下几方面内容：

   ​    （1） 测试网址验证的正则表达式正确性与覆盖性。

   ​    （2）测试正常的系统转化URL。

   ​    （3）测试用户自定义的转化URL。

   ​    （4）测试默认转化时遇到短连接被自定义的情况。

   ​    （5）测试用户自定义时候短连接被使用情况。

   ​    （6）测试指定位数短地址用尽情况。

   ​    （7）数据库字段大小写问题区分。

### 三丶转化算法

1. 需要考虑问题：

   （1） 长地址与短地址的对应关系： 一对一丶一对多。

   （2）短地址够用情况：

   ​           由A-Z,a-z,0-9共计62位作为短地址转化基本元素，如下数量情况。

   | 位数/位 | 个数             |
   | ------- | ---------------- |
   | 1       | 62               |
   | 2       | 约3844           |
   | 32      | 约23 5000        |
   | 4       | 约1450 0000      |
   | 5       | 约 9 0000 0000   |
   | 6       | 越 568 0000 0000 |

   由表格知： 6位目前应该够用，目前一般也采用6位。

2. 算法（参考源于网络）：

   （1）md5y压缩与移位操作转化。

   1)将长网址[md5](https://baike.baidu.com/item/md5)生成32位签名串,分为4段, 每段1个字节（即8位）;

   2)对这四段循环处理, 取4个字节（32位）, 将他看成16进制串与0x3fffffff(30位1)与操作, 即超过30位的忽略处理;

   3)这30位分成6段, 每5位的数字作为字母表的索引取得特定[字符](https://baike.baidu.com/item/%E5%AD%97%E7%AC%A6), 依次进行获得6位字符串;

   4)总的md5串可以获得4个6位串; 取里面的任意一个就可作为这个长url的短url地址;

   （2）基于顺序自增id转化。

   ​      把数字和字符组合做一定的[映射](https://baike.baidu.com/item/%E6%98%A0%E5%B0%84),就可以产生唯一的字符串,如第62个组合就是aaaaa9,第63个组合就是aaaaba,再利用洗牌算法，把原字符串打乱后保存，那么对应位置的组合字符串就会是无序的组合。

   ​      把长网址存入数据库,取返回的id,找出对应的字符串,例如返回ID为1，那么对应上面的字符串组合就是bbb,同理 ID为2时，字符串组合为bba,依次类推,直至到达62种组合后才会出现重复的可能，所以如果用上面的62个字符，任意取6个字符组合成字符串的话，你的数据存量达到500多亿后才会出现重复的可能。

   ​    **根据第一种算法的实现，可知，从md5开始，就有存在重复短连接的可能性（非常小），是一种一对一关系，转化步骤与逻辑也较为复杂，因此不采用。**

   ​    **第二种方式保证了短连接的唯一性，缺点是位数可能会一直变化，当然指定到6位时，再变化的可能就几乎可以忽略，同时具有一定的顺序性。顺序性可通过打乱原符合顺序做一定程度上的解决。这种做法可以做到一对多的映射，逻辑清晰明了，因此采用此种算法。**

### 四丶项目框架设计

1. 基本框架选择：

   考虑到需要接口提供与数据库交互。采用相对轻量的springboot+mybatis框架的maven项目，测试采用springboot junit测试框架,数据库使用mysql。

2. 目录结构:

   short-url-service

   ​     ----src/main/java

   ​         ----com.pk.shorturl    --项目启动入口

   ​         ----com.pk.shorturl.common  --公用静态变量

   ​         ----com.pk.shorturl.controller --controller

   ​         ----com.pk.shorturl.service  --service

   ​         ----com.pk.shorturl.dao  --dao

   ​         ----com.pk.shorturl.model  --数据模型

   ​         ----com.pk.shorturl.util   --辅助工具类

   ​     ----src/main/resources

   ​         ----mapper   --mybatis查询sql文件

   ​         ----public   --静态页面（404等）

   ​     ----src/test/java

   ​         ----com.pk.shorturl.controller

### 五丶数据库设计

1. links

   id: 映射记录ID

   url: 长连接网址

   short_url: 短连接网址

   type: 映射类型， 0： 默认，1：用户自定义

   insert_at: 插入时间

   updated_at: 更新时间

   count: 访问计数

```sql
DROP TABLE IF EXISTS `links`;
CREATE TABLE `links` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` text,
  `short_url` varchar(45) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `type` int(1) DEFAULT NULL,
  `insert_at` bigint(20) DEFAULT NULL,
  `updated_at` bigint(20) DEFAULT NULL,
  `count` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8;
```



### 六丶接口设计

1. 访问基本路径：http://127.0.0.1:8085

2. 系统默认网址转换：

   ```java
     type: POST
     url: /url_convertor/default_convert
     params:
        String  long_url （require）: 长连接地址
        int short_url_length (require): 短连接长度
   ```

3.  用户自定义转化：

    ```java
    type: POST
     url: /url_convertor/custom_convert
     params:
        String  long_url （require）: 长连接地址
        String short_url (require): 短连接地址

    ```

4. 访问短连接跳转长连接：

   ```java
   type: POST
     url: /url_convertor/｛shorturl}
     params:
       String shorturl (require): 短连接地址
   ```

### 七丶扩展问题

1. 合法长连接验证问题。
2. 访问计数存储与计数方式问题。
3. 长转短形式问题，接口or方法调用。
4. 增加指定短连接检测。
5. 存储形式问题，考虑到高并发的情况，mysql或许不实用，redis可能更好，尤其是静态量的存储。

### 八丶安全

1. 此方面仅仅对长连接网站做了正则判断，来防止一些无法访问的网址。还需加强。
