interface CacheInterface {
  get(name: String): Promise<any>;
  set(name: String, data: any, duration: Number): Promise<any>;
  update(name: String, data: any, duration: Number): Promise<any>;
  delete(name: String): Promise<Boolean>;
  remember(name: String, duration: Number, callback: Function): Promise<any>;
  rememberForever(name: String, callback: Function): Promise<any>;
}
export default CacheInterface;
