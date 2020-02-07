class Record {
  constructor(id, ownerId, title, imageUrl, description, date) {
    this.id = id;
    this.ownerId = ownerId;
    this.imageUrl = imageUrl;
    this.title = title;
    this.description = description;
    this.date = date;
  }
}

export default Record;
