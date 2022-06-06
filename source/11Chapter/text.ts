// actionType
type ResolveType = (resolve: any) => void; // 成功毁掉
type RejectType = (reject: any) => void; // 失败回调
type Executor = (resolve: ResolveType, reject: RejectType) => void; // 执行函数

class PromiseMe<T = any> {
  public resolve!: ResolveType;
  public reject!: RejectType;
  public status!: string;
  public resolve_executor_value!: any; // 成功时抛出的结果
  public reject_executor_value!: any; // 失败时抛出的结果
  constructor(executor: Executor) {
    this.status = "pending"; // 起始状态
    this.resolve = (value: any): any => {
      if (this.status === "pending") {
        this.status = "success";
        // value[10] = 100; // 代码错误
        this.resolve_executor_value = value;
        console.log("resolve ===> value", value);
      }
    };
    this.reject = (value: any): any => {
      if (this.status === "pending") {
        this.status = "fail";
        console.log("resolve ===> value", value);
      }
    };

    try {
      // 执行函数
      executor(this.resolve, this.reject);
    } catch (err: any) {
      //console.log(err.toString())
      this.status = "pending";
      // 失败则直接执行reject函数
      this.reject(err.toString());
      throw new Error("程序停止...");
    }
  }

  then(resolveInThen: ResolveType, rejectInThen: RejectType) {
    return new Promise((resolve, reject) => {
      let result; // 结果 传递给链式调用的内容
      if (this.status === "success") {
        result = resolveInThen(this.resolve_executor_value);
        this.xresolve(result);
      }
      if (this.status === "reject") {
        result = rejectInThen(this.reject_executor_value);
        reject(result);
    }
    });
  }
}

// test.ts
let promise = new PromiseMe((resolve, reject) => {
  resolve("成功了");
  // reject("失败了");
});

promise
  .then(
    (resolveData1) => {
      console.log("第一个then成功了:", resolveData1);
      return "ok";
    },
    (rejectData1) => {
      console.log("第一个then失败了:", rejectData1);
      return "fail1";
    }
  )
  .then(
    (resolveData2) => {
      console.log("第二个then成功了:", resolveData2);
      return "ok2";
    },
    (rejectData2) => {
      console.log("第二个then失败了:", rejectData2);
      return "fail2";
    }
  )
  .then(
    (resolveData3) => {
      console.log("第三个then成功了:", resolveData3);
      return "ok2";
    },
    (rejectData3) => {
      console.log("第三个then失败了:", rejectData3);
      return "fail2";
    }
  );
console.log("end");
export {};
