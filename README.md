<div align="center"> <a href="https://github.com/svenjia/vue3-eggjs-admin"> <img width="100" src="./public/logo.png"> </a> <br> <br>

<h1>vue3-eggjs-admin</h1>
</div>

## 介绍

vue3-eggjs-admin 是一个采用了Vue3、Element-plus、TypeScript、eggjs技术栈的后台管理系统基础框架，可以迅速作为项目的开发模板，适用于有前、后端（Nodejs）经验全干开发者。

该系统集成了后台系统中常见的登录、权限管理、上传文件功能，可直接开发业务代码

## 特性

- **最新的前端技术栈**：Vue3+TypeScript+Element-plus
- **前端国际化、主题、组件封装**：得益于 vue-element-plus-admin 前端框架的友好封装
- **优秀的Nodejs框架**: Egg.jss是阿里开源的企业级Nodejs框架,基于Koa开发，进行了非常好的封装
- **内置登录鉴权、权限管理** 不用重复开发后台系统中必备的这两项功能
- **内置Knex** SQL构造器，函数式编写sql，支持mysql8.x

## 准备工作

- Mysql服务器：推荐使用[官方的安装工具](https://dev.mysql.com/downloads/installer/)
- 创建数据库,数据库名:permission，字符集:utf8mb4，排序规则：utf8mb4_general_ci
- 执行[sql文件](./server/dbs/permission.sql),初始化表
- 修改server配置数据库配置文件 server/config/local/config.mysql.js


## 安装和使用

- 获取代码

```bash
git clone https://github.com/svenjia/vue3-eggjs-admin.git
```

-  安装前端依赖、启动前端程序 （推荐使用pnpm）

```bash
cd vue3-eggjs-admin/client

pnpm install 

pnpm run dev

```

-  安装后端依赖

```bash
cd vue3-eggjs-admin/server

pnpm install

pnpm run dev

```

## 程序说明
- ### client相关
1.存放前端代码，关于组件使用、国际化等，可查看[文档](https://element-plus-admin-doc.cn/guide/introduction.html)
2.前端的路由没有采用动态挂载，访问权限是由后端进行返回，然后标记哪些路由可以用来生成菜单，代码见client/store/modules/permission.ts 中的getResource方法
3.后端返回的错误代码，由拦截器统计处理，页面中只有处理成功的逻辑
- ### server相关
1.配置文件全部放在server/config,ENV文件用来标记读取哪些配置，可以查看[eggjs配置相关的文档](https://www.eggjs.org/zh-CN/basics/config)
2.整个系统的菜单、api访问都被视为系统资源，资源配置放在config/resources.json，注意type=1表示是菜单，name需要和前端route定义的name保持一致
3.前端访问权限拦截在中间件permission中，全局的错误捕获防止error_handler中间件
4.为了不手写SQL，采用了Knex sql构造工具，在singleton中的代码，在app启动时进行挂载
5.server启动时，会自动检测是否有admin123这个管理员账号，没有会自动生成。（可以自行配置）注意：前端的登录账号校验是6-16位字母和数字的组合
6.上传前端直接用element-plus的upload组件，后端用egg内置的multipart插件，存储用的s3

## 未完待续（欢迎提建议）

## 许可证

[MIT](./LICENSE)
