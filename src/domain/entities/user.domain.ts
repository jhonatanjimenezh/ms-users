export class UserDomain {
  constructor(
    public readonly uuid: string,
    public readonly document: string,
    public readonly name: string,
    public readonly email: string,
    public readonly phone: string,
  ) {}
}
