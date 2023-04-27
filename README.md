# ts-axios
基于typescript实现axios

实现axios的主要功能：包括处理参数，支持链式调用，请求和响应拦截器，默认配置，配置合并，请求取消，CSRF防御。使用JEST进行单元测试分支覆盖率达到90%以上

```
src
├─ axios.ts
├─ cancel
│    ├─ Cancel.ts
│    └─ CancelToken.ts
├─ core
│    ├─ Axios.ts
│    ├─ dispatchRequest.ts
│    ├─ interceptorManager.ts
│    ├─ mergeConfig.ts
│    ├─ transform.ts
│    └─ xhr.ts
├─ default.ts
├─ helpers
│    ├─ cookie.ts
│    ├─ data.ts
│    ├─ error.ts
│    ├─ headers.ts
│    ├─ url.ts
│    └─ util.ts
├─ index.ts
└─ types
       └─ index.ts
```

使用

```
npm install ts-axios-zither
```
