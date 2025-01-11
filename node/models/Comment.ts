export class Comment {
  constructor(
    private id: string,
    private postId: string,
    private name: string,
    private body: string,
    private email: string
  ) {}

  // Getters
  getId = () => this.id;
  getPostId = () => this.postId;
  getName = () => this.name;
  getBody = () => this.body;
  getEmail = () => this.email;

  // Setters
  setId = (newId: string) => (this.id = newId);
  setPostId = (newPostId: string) => (this.postId = newPostId);
  setName = (newName: string) => (this.name = newName);
  setBody = (newBody: string) => (this.body = newBody);
  setEmail = (newEmail: string) => (this.email = newEmail);
}
