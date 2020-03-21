class Message {
  constructor(id, text, createdAt, user) {
    this._id = id;
    this.text = text;
    this.createdAt = createdAt;
    this.user = user;
  }
}

export default Message;
