interface ServiceInterface {
  get(name: String): Promise<any>;
  set(name: String, data: any, duration: Number): Promise<any>;
  update(name: String, data: any, duration: Number | null): Promise<any>;
  delete(name: String): Promise<Boolean>;
}
export default ServiceInterface;
