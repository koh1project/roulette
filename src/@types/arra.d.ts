interface Array {
  from(arrayLike: any, mapFn?, thisArg?): Array<any>;
}

interface ArrayConstructor {
  from(arrayLike: any, mapFn?, thisArg?): Array<any>;
}

interface ArrayConstructor {
  from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): Array<U>;
  from<T>(arrayLike: ArrayLike<T>): Array<T>;
}
interface ObjectConstructor {
  assign(target : any, ...sources: any[]) : Object;
}